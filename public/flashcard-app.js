(function () {
  function createInitialState(total) {
    return { currentIndex: 0, total: total };
  }

  function getQuestionNumber(state) {
    return state.currentIndex + 1;
  }

  function getProgressLabel(state) {
    return getQuestionNumber(state) + ' / ' + state.total;
  }

  function canGoNext(state) {
    return state.currentIndex < state.total - 1;
  }

  function canGoPrev(state) {
    return state.currentIndex > 0;
  }

  function goNext(state) {
    if (!canGoNext(state)) return state;
    return { currentIndex: state.currentIndex + 1, total: state.total };
  }

  function goPrev(state) {
    if (!canGoPrev(state)) return state;
    return { currentIndex: state.currentIndex - 1, total: state.total };
  }

  function shuffleIndices(total) {
    var indices = [];
    for (var i = 0; i < total; i += 1) indices.push(i);
    for (var j = indices.length - 1; j > 0; j -= 1) {
      var k = Math.floor(Math.random() * (j + 1));
      var tmp = indices[j];
      indices[j] = indices[k];
      indices[k] = tmp;
    }
    return indices;
  }

  function shuffleAndAdvance(state) {
    return {
      state: canGoNext(state) ? goNext(state) : createInitialState(state.total),
      order: shuffleIndices(state.total),
    };
  }

  function init() {
    var app = document.querySelector('.app');
    if (!app) return;

    var questions = [];
    try {
      questions = JSON.parse(app.getAttribute('data-questions') || '[]');
    } catch (error) {
      return;
    }

    if (!questions.length) return;

    var order = questions.map(function (_, index) {
      return index;
    });
    var state = createInitialState(questions.length);

    var progressLabel = app.querySelector('[data-ui="progress"]');
    var progressPill = app.querySelector('[data-ui="progress-pill"]');
    var questionLabel = app.querySelector('[data-ui="question-label"]');
    var questionText = app.querySelector('[data-ui="question-text"]');
    var btnPrev = app.querySelector('[data-ui="btn-prev"]');
    var btnNext = app.querySelector('[data-ui="btn-next"]');
    var btnShuffle = app.querySelector('[data-ui="btn-shuffle"]');
    var card = app.querySelector('[data-ui="card"]');

    if (!progressLabel || !questionLabel || !questionText || !btnPrev || !btnNext || !btnShuffle || !card) {
      return;
    }

    var animationTimer = null;

    function clearAnimationTimer() {
      if (animationTimer !== null) {
        window.clearTimeout(animationTimer);
        animationTimer = null;
      }
    }

    function render() {
      var questionIndex = order[state.currentIndex];
      var question = questions[questionIndex] || '';

      progressLabel.textContent = getProgressLabel(state);
      questionLabel.textContent = 'Pertanyaan #' + getQuestionNumber(state);
      questionText.textContent = question;

      btnPrev.disabled = !canGoPrev(state);
      btnNext.disabled = !canGoNext(state);

      app.setAttribute('data-step', String(getQuestionNumber(state)));
    }

    function pulseProgressPill() {
      if (!progressPill) return;
      progressPill.classList.remove('progress-pill--pulse');
      void progressPill.offsetWidth;
      progressPill.classList.add('progress-pill--pulse');
      window.setTimeout(function () {
        progressPill.classList.remove('progress-pill--pulse');
      }, 450);
    }

    function animate(direction) {
      clearAnimationTimer();
      card.classList.remove('slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right');
      void card.offsetWidth;
      card.classList.add(direction === 'next' ? 'slide-out-left' : 'slide-out-right');

      animationTimer = window.setTimeout(function () {
        animationTimer = null;
        card.classList.remove('slide-out-left', 'slide-out-right');
        card.classList.add(direction === 'next' ? 'slide-in-right' : 'slide-in-left');
        window.setTimeout(function () {
          card.classList.remove('slide-in-left', 'slide-in-right');
        }, 280);
      }, 220);
    }

    function moveNext() {
      if (!canGoNext(state)) return;
      state = goNext(state);
      render();
      animate('next');
    }

    function movePrev() {
      if (!canGoPrev(state)) return;
      state = goPrev(state);
      render();
      animate('prev');
    }

    btnNext.addEventListener('click', moveNext);
    btnPrev.addEventListener('click', movePrev);

    btnShuffle.addEventListener('click', function () {
      clearAnimationTimer();
      card.classList.remove('slide-out-left', 'slide-out-right', 'slide-in-left', 'slide-in-right');

      var shuffled = shuffleAndAdvance(state);
      order = shuffled.order;
      state = shuffled.state;

      render();
      pulseProgressPill();
      card.classList.add('shuffle-pop');
      window.setTimeout(function () {
        card.classList.remove('shuffle-pop');
      }, 400);
    });

    var touchStartX = 0;
    var touchStartY = 0;

    card.addEventListener(
      'touchstart',
      function (e) {
        if (!e.touches.length) return;
        touchStartX = e.touches[0].screenX;
        touchStartY = e.touches[0].screenY;
      },
      { passive: true },
    );

    card.addEventListener(
      'touchend',
      function (e) {
        if (!e.changedTouches.length) return;
        var deltaX = e.changedTouches[0].screenX - touchStartX;
        var deltaY = e.changedTouches[0].screenY - touchStartY;

        if (Math.abs(deltaX) < 50 || Math.abs(deltaY) > Math.abs(deltaX)) return;

        if (deltaX < 0) moveNext();
        else movePrev();
      },
      { passive: true },
    );

    document.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') moveNext();
      else if (e.key === 'ArrowLeft') movePrev();
    });

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
