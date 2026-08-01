# Nongkrong Cards — RFC (Technical Decisions)

## Context

Web app flashcard static untuk icebreaker nongkrong. Constraint: Astro + TypeScript, vanilla CSS, no backend, deploy GitHub Pages.

## Decision 1: Astro Static Site

**Decision:** Pakai Astro (SSG) output ke folder `dist/`.

**Why:**

- HTML static cepat di GitHub Pages
- TypeScript untuk logic bisnis yang testable
- Tidak perlu server runtime

**Alternatives considered:**

- Plain HTML/JS → sulit maintain 50 pertanyaan + tests
- React SPA → overkill untuk scope kecil

## Decision 2: Pisahkan Logic vs UI

**Decision:** Logic navigasi di `src/lib/flashcard.ts`, UI di `FlashcardApp.astro`, runtime client di `public/flashcard-app.js`.

**Why:**

- Logic bisa di-unit-test dengan Vitest tanpa browser
- Client script standalone (IIFE) lebih stabil di mobile vs ES module inline Astro

**Key functions:**

- `goNext` / `goPrev` — navigasi bounded
- `shuffleAndAdvance` — acak deck + counter maju 1
- `getProgressLabel` — format `X / 50`
- `getQuestionLabel` — format `Pertanyaan #X`

## Decision 3: Shuffle = Acak + Maju Counter

**Decision:** Tombol Acak memanggil `shuffleAndAdvance()`, bukan reset ke kartu 1.

**Why:**

- User expect counter "bergerak" saat Acak
- Counter = posisi sesi (1–50), bukan ID pertanyaan asli
- Di kartu terakhir (50/50), Acak wrap ke 1/50

```typescript
export function shuffleAndAdvance(state, random) {
  const order = shuffleIndices(state.total, random);
  const nextState = canGoNext(state) ? goNext(state) : createInitialState(state.total);
  return { state: nextState, order };
}
```

## Decision 4: Counter Update Langsung (Bukan Delay Animasi)

**Decision:** `render()` dipanggil segera setelah state berubah, animasi kartu terpisah.

**Why:**

- Bug awal: counter & label stuck di `#1` karena update menunggu timeout animasi (220ms)
- User lihat pertanyaan berubah tapi counter tidak ikut

## Decision 5: App-Scoped DOM (`data-ui` attributes)

**Decision:** Selector pakai `app.querySelector('[data-ui="progress"]')`, bukan global `getElementById`.

**Why:**

- Hindari konflik ID jika ada elemen lain di halaman
- Semua update UI dalam scope `.app`

## Decision 6: Desain Kartu Vintage (CSS)

**Decision:** Pure CSS + SVG inline (hati, amplop clip-path, lace border pseudo-element).

**Why:**

- Tidak perlu asset gambar berat
- Responsif di berbagai ukuran layar

## Decision 7: Deploy GitHub Actions

**Decision:** Workflow `.github/workflows/deploy.yml` → build Astro → `actions/deploy-pages`.

**Why:**

- Auto-deploy setiap push ke `main`
- File legacy Pacman dipindah ke `legacy/pacman/` supaya tidak bentrok deploy

## Decision 8: Testing Strategy

**Decision:** Vitest unit tests untuk logic, manual QA untuk UI.

**Coverage:**

- Navigasi bounded (next/prev)
- Shuffle permutation valid
- `shuffleAndAdvance` increment & wrap
- Data: exactly 50 questions

## Data Model

```typescript
type FlashcardState = {
  currentIndex: number; // posisi di deck (0-based)
  total: number;        // 50
};

order: number[]; // permutasi index pertanyaan asli
```

Render:

```
questionText = QUESTIONS[order[state.currentIndex]]
progress     = `${state.currentIndex + 1} / ${state.total}`
label        = `Pertanyaan #${state.currentIndex + 1}`
```

## Known Limitations

- Counter = posisi deck, bukan nomor pertanyaan asli di list
- Tidak ada persist progress (refresh = mulai dari awal)
- Offline: butuh load pertama (setelah itu browser cache)

## Future Improvements

- Simpan progress di `localStorage`
- Mode "lanjut dari kartu terakhir"
- Kategori pertanyaan (ringan / deep / random)
- Export pertanyaan custom
