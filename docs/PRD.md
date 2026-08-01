# Nongkrong Cards — Product Requirements Document

## Problem

Saat nongkrong bareng temen di cafe, sering muncul momen awkward: obrolan macet, topik habis, atau cuma main HP. Grup butuh icebreaker yang ringan, fun, dan bisa dipakai siapa saja tanpa persiapan.

## Goal

Membuat web app flashcard sederhana berisi 50 pertanyaan santai dalam Bahasa Indonesia, bisa dibuka langsung di HP, tanpa install, tanpa login.

## Target User

- Teman-teman usia remaja–dewasa yang nongkrong di cafe, kos, atau hangout santai
- Facilitator grup kecil (3–8 orang) yang mau memancing obrolan

## Success Metrics

- User bisa buka app dan mulai main dalam < 10 detik
- Navigasi kartu jelas: counter progress + nomor pertanyaan selalu update
- Bisa dipakai one-handed di mobile (swipe + tombol besar)
- Deploy publik via GitHub Pages

## Scope (MVP)

### Must Have

- 50 pertanyaan conversation starter (Bahasa Indonesia)
- Desain kartu vintage: amplop maroon, kartu krem, border renda, teks italic
- Navigasi: Sebelumnya, Berikutnya, Acak
- Counter progress (`X / 50`) dan label `Pertanyaan #X`
- Swipe kiri/kanan di mobile + keyboard arrow keys
- Responsif mobile-first, teks & tombol besar (aksesibilitas)
- Deploy static di https://nadifahadya.github.io

### Out of Scope (v1)

- Backend / akun user
- Input pertanyaan custom
- Share ke sosmed
- Multiplayer real-time
- Audio / TTS

## User Flow

1. User buka website
2. Lihat kartu pertanyaan pertama (`1 / 50`, `Pertanyaan #1`)
3. Baca pertanyaan → diskusi bareng temen
4. Tap **Berikutnya** atau swipe → kartu & counter naik
5. Tap **Acak** → pertanyaan diacak + counter maju
6. Ulangi sampai 50 pertanyaan habis

## Content

50 pertanyaan santai, contoh:

- "Kalau hidupmu jadi film, judulnya apa?"
- "Apa kebiasaan paling aneh yang kamu punya?"
- "Menurutmu, orang pertama di meja ini yang bakal viral siapa? Kenapa?"

## Design Requirements

| Elemen | Spesifikasi |
|--------|-------------|
| Palet warna | Maroon `#800020`, krem `#FDF5E6`, parchment `#E8DCC8` |
| Tipografi | DM Sans, italic, right-aligned pada kartu |
| Kartu | Border renda putih, icon hati, amplop maroon di belakang |
| Tombol | Besar, rounded, kontras jelas |

## Non-Functional Requirements

- Frontend: Astro + TypeScript
- Styling: vanilla CSS (no framework)
- Testing: Vitest untuk logic navigasi & shuffle
- No backend
- Static deploy via GitHub Actions → GitHub Pages

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Obrolan terlalu personal | Pertanyaan dirancang santai, bukan terlalu berat |
| Cache browser serve versi lama | Cache-busting + meta no-cache |
| Counter tidak update di mobile | Standalone JS + app-scoped DOM selectors |

## Definition of Done

- [x] 50 pertanyaan ter-load
- [x] Navigasi Berikutnya/Sebelumnya/Acak berfungsi
- [x] Counter & label Pertanyaan # sinkron
- [x] Desain vintage sesuai referensi
- [x] Live di GitHub Pages
- [x] Unit test lulus
