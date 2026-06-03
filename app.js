(() => {
  'use strict';

  const TOTAL_SECONDS = 90;
  const CLEAN_TIMES = [30, 60, 88];

  const app = document.getElementById('app');
  const button = document.getElementById('startButton');
  const audio = document.getElementById('song');
  const patches = [document.getElementById('clean1'), document.getElementById('clean2'), document.getElementById('clean3')];

  let timers = [];
  let running = false;

  const clearTimers = () => {
    timers.forEach((id) => window.clearTimeout(id));
    timers = [];
  };

  const reset = () => {
    clearTimers();
    running = false;
    app.classList.remove('running', 'finished');
    patches.forEach((patch) => patch.classList.remove('show'));
    audio.pause();
    audio.currentTime = 0;
  };

  const finish = () => {
    running = false;
    app.classList.remove('running');
    app.classList.add('finished');
    patches.forEach((patch) => patch.classList.add('show'));
    audio.pause();
    audio.currentTime = 0;
  };

  const start = async () => {
    reset();
    running = true;
    app.classList.add('running');

    CLEAN_TIMES.forEach((sec, index) => {
      timers.push(window.setTimeout(() => {
        patches[index]?.classList.add('show');
      }, sec * 1000));
    });

    timers.push(window.setTimeout(finish, TOTAL_SECONDS * 1000));

    try {
      await audio.play();
    } catch (_) {
      // iOS等で再生が遅れた場合でも、画面進行は止めない。
    }
  };

  button.addEventListener('click', () => {
    if (!running) start();
  }, { passive: true });

  audio.addEventListener('ended', () => {
    if (running) finish();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && running) reset();
  });
})();
