(() => {
  'use strict';

  const TOTAL_SECONDS = 93;
  const CLEAN_TIMES = [20, 50, 70];
  const ACTION_TIMES = [8, 16, 28, 38, 58, 78, 88];

  const app = document.getElementById('app');
  const button = document.getElementById('startButton');
  const audio = document.getElementById('song');
  const patches = [document.getElementById('clean1'), document.getElementById('clean2'), document.getElementById('clean3')];
  const bursts = [document.getElementById('burst1'), document.getElementById('burst2'), document.getElementById('burst3')];
  const action = document.getElementById('actionFx');

  let timers = [];
  let running = false;

  const clearTimers = () => {
    timers.forEach((id) => window.clearTimeout(id));
    timers = [];
  };

  const flashAction = () => {
    action.classList.remove('pop');
    void action.offsetWidth;
    action.classList.add('pop');
  };

  const reset = () => {
    clearTimers();
    running = false;
    app.classList.remove('running', 'finished');
    patches.forEach((patch) => patch.classList.remove('show'));
    bursts.forEach((burst) => burst.classList.remove('show'));
    action.classList.remove('pop');
    audio.pause();
    audio.currentTime = 0;
  };

  const finish = () => {
    clearTimers();
    running = false;
    app.classList.remove('running');
    app.classList.add('finished');
    patches.forEach((patch) => patch.classList.add('show'));
    bursts.forEach((burst) => burst.classList.add('show'));
    flashAction();
  };

  const start = async () => {
    reset();
    running = true;
    app.classList.add('running');

    CLEAN_TIMES.forEach((sec, index) => {
      timers.push(window.setTimeout(() => {
        patches[index]?.classList.add('show');
        bursts[index]?.classList.add('show');
        flashAction();
      }, sec * 1000));
    });

    ACTION_TIMES.forEach((sec) => {
      timers.push(window.setTimeout(flashAction, sec * 1000));
    });

    timers.push(window.setTimeout(finish, TOTAL_SECONDS * 1000));

    try {
      audio.currentTime = 0;
      await audio.play();
    } catch (_) {
      // iPhone/iPadで再生開始が遅れても、画面進行は止めない。
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
