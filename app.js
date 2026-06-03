(() => {
  'use strict';

  const CLEAN_TIMES = [23, 45, 60];
  const SAFE_FINISH_SECONDS = 93; // 音源を途中で止めないための保険。基本は audio ended で終了。
  const ACTION_TIMES = [10, 18, 30, 38, 52, 68, 76, 84];

  const app = document.getElementById('app');
  const button = document.getElementById('startButton');
  const audio = document.getElementById('song');
  const covers = [document.getElementById('cover1'), document.getElementById('cover2'), document.getElementById('cover3')];
  const pops = [document.getElementById('cleanPop1'), document.getElementById('cleanPop2'), document.getElementById('cleanPop3')];
  const shineLoop = document.getElementById('shineLoop');
  const cracker = document.getElementById('cracker');

  let timers = [];
  let running = false;

  const addTimer = (fn, ms) => timers.push(window.setTimeout(fn, ms));
  const clearTimers = () => { timers.forEach(window.clearTimeout); timers = []; };

  const replay = (el, cls) => {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  };

  const resetVisuals = () => {
    app.classList.remove('running', 'finished');
    covers.forEach((el) => el.classList.remove('show'));
    pops.forEach((el) => el.classList.remove('show'));
    shineLoop.classList.remove('show', 'pulse');
    cracker.classList.remove('show');
  };

  const reset = () => {
    clearTimers();
    running = false;
    resetVisuals();
    audio.pause();
    try { audio.currentTime = 0; } catch (_) {}
  };

  const cleanGerm = (index) => {
    covers[index]?.classList.add('show');
    pops[index]?.classList.add('show');
    replay(shineLoop, 'pulse');
  };

  const finish = () => {
    if (!running) return;
    clearTimers();
    running = false;
    app.classList.remove('running');
    app.classList.add('finished');
    covers.forEach((el) => el.classList.add('show'));
    shineLoop.classList.add('show');
    replay(cracker, 'show');
  };

  const start = async () => {
    reset();
    running = true;
    app.classList.add('running');

    CLEAN_TIMES.forEach((sec, index) => addTimer(() => cleanGerm(index), sec * 1000));
    addTimer(() => shineLoop.classList.add('show'), 60 * 1000);
    ACTION_TIMES.forEach((sec) => addTimer(() => replay(shineLoop, 'pulse'), sec * 1000));
    addTimer(finish, SAFE_FINISH_SECONDS * 1000);

    try {
      audio.currentTime = 0;
      await audio.play();
    } catch (_) {
      // iPhone/iPadで再生開始が遅れても画面進行は維持する。
    }
  };

  button.addEventListener('click', () => { if (!running) start(); }, { passive: true });
  audio.addEventListener('ended', finish);
  document.addEventListener('visibilitychange', () => { if (document.hidden && running) reset(); });
})();
