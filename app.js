(() => {
  'use strict';

  const STAGES = ['stage0.jpg', 'stage1.jpg', 'stage2.jpg', 'stage3.jpg'];
  const CHANGE_TIMES = [23, 45, 60];
  const FINISH_SECONDS = 90;
  const SPARK_TIMES = [8, 16, 23, 31, 39, 45, 53, 60, 67, 74, 81, 88];

  const app = document.getElementById('app');
  const button = document.getElementById('startButton');
  const audio = document.getElementById('song');
  const stageImage = document.getElementById('stageImage');
  const cleanFlash = document.getElementById('cleanFlash');
  const bigStars = document.getElementById('bigStars');
  const bubbleParty = document.getElementById('bubbleParty');
  const celebration = document.getElementById('celebration');

  STAGES.forEach((src) => { const img = new Image(); img.src = src; });

  let timers = [];
  let running = false;
  let finished = false;

  const addTimer = (fn, ms) => timers.push(window.setTimeout(fn, ms));
  const clearTimers = () => { timers.forEach(window.clearTimeout); timers = []; };
  const replay = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };

  const speak = (text) => {
    try {
      if (!('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ja-JP';
      u.rate = 1.05;
      u.pitch = 1.25;
      u.volume = 1;
      window.speechSynthesis.speak(u);
    } catch (_) {}
  };

  const setStage = (index) => {
    stageImage.classList.add('switching');
    window.setTimeout(() => {
      stageImage.src = STAGES[index];
      if (index === 3) stageImage.classList.add('clean-mode');
      replay(cleanFlash, 'show');
      window.setTimeout(() => stageImage.classList.remove('switching'), 190);
    }, 80);
  };

  const resetVisuals = () => {
    app.classList.remove('running', 'finished');
    stageImage.src = STAGES[0];
    stageImage.classList.remove('switching', 'clean-mode');
    cleanFlash.classList.remove('show');
    bigStars.classList.remove('on');
    bubbleParty.classList.remove('on');
    celebration.classList.remove('show');
    app.classList.remove('sparkle-party');
  };

  const reset = () => {
    clearTimers();
    running = false;
    finished = false;
    resetVisuals();
    audio.pause();
    try { audio.currentTime = 0; } catch (_) {}
  };

  const finish = () => {
    if (!running || finished) return;
    finished = true;
    app.classList.add('finished');
    bigStars.classList.add('on');
    bubbleParty.classList.add('on');
    replay(celebration, 'show');
    // 音源を切らない。画面だけ終了演出に入る。
  };

  const start = async () => {
    reset();
    running = true;
    app.classList.add('running');

    CHANGE_TIMES.forEach((sec, i) => addTimer(() => setStage(i + 1), sec * 1000));
    addTimer(() => { bigStars.classList.add('on'); bubbleParty.classList.add('on'); app.classList.add('sparkle-party'); }, 60 * 1000);
    SPARK_TIMES.forEach((sec) => addTimer(() => replay(cleanFlash, 'show'), sec * 1000));
    addTimer(finish, FINISH_SECONDS * 1000);

    try {
      audio.currentTime = 0;
      await audio.play();
    } catch (_) {
      // iPhone/iPadの再生開始が遅れても、画面進行は維持。
    }
  };

  button.addEventListener('click', () => { if (!running || finished) start(); }, { passive: true });
  audio.addEventListener('ended', () => {
    if (running) {
      running = false;
      app.classList.remove('running');
      app.classList.add('finished');
      bigStars.classList.add('on');
      bubbleParty.classList.add('on');
        if (!finished) replay(celebration, 'show');
      finished = true;
    }
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && running) reset(); });
})();
