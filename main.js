document.addEventListener('DOMContentLoaded', function () {
  const modeButtons = document.querySelectorAll('.mode-btn');
  const modeSelectSection = document.querySelector('.mode-select');
  const gameSection = document.getElementById('game-section');
  const resultSection = document.getElementById('result-section');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');

  // 游戏参数
  const TOTAL_QUESTIONS = 10;
  const SOUND_PATH = 'sounds/';
  const SOUND_FILES = {
    correct: 'correct.mp3',
    wrong: 'wrong.mp3',
    click: 'click.mp3',
    finish: 'finish.mp3',
  };

  // 音效开关
  function isSoundOn() {
    const v = localStorage.getItem('math_sound_on');
    return v === null ? true : v === 'true';
  }
  function setSoundOn(val) {
    localStorage.setItem('math_sound_on', val ? 'true' : 'false');
  }
  function updateSoundBtn() {
    if (!soundToggleBtn) return;
    soundToggleBtn.textContent = isSoundOn() ? '🔊' : '🔇';
  }
  if (soundToggleBtn) {
    updateSoundBtn();
    soundToggleBtn.onclick = function () {
      setSoundOn(!isSoundOn());
      updateSoundBtn();
    };
  }

  // 播放音效
  function playSound(type) {
    if (!isSoundOn()) return;
    try {
      const audio = new Audio(SOUND_PATH + (SOUND_FILES[type] || ''));
      audio.currentTime = 0;
      audio.play();
    } catch (e) {}
  }

  // 本地最高分存取
  function getHighScore(mode) {
    return parseInt(localStorage.getItem('math_highscore_' + mode) || '0', 10);
  }
  function setHighScore(mode, score) {
    localStorage.setItem('math_highscore_' + mode, score);
  }

  // 时间格式化
  function formatDuration(seconds) {
    if (seconds < 60) return `${seconds} 秒`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}分${s < 10 ? '0' : ''}${s}秒`;
  }

  // 题目生成函数
  function generateProblem(mode) {
    if (mode === 'addition') {
      const a = Math.floor(Math.random() * 900) + 100;
      const b = Math.floor(Math.random() * 900) + 100;
      return { type: 'addition', a, b, answer: a + b };
    } else if (mode === 'subtraction') {
      const minuend = Math.floor(Math.random() * 800) + 200;
      const subtrahend = Math.floor(Math.random() * (minuend - 100 + 1)) + 100;
      return { type: 'subtraction', a: minuend, b: subtrahend, answer: minuend - subtrahend };
    } else if (mode === 'multiplication') {
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      return { type: 'multiplication', a, b, answer: a * b };
    } else if (mode === 'mixed') {
      const modes = ['addition', 'subtraction', 'multiplication'];
      const randomMode = modes[Math.floor(Math.random() * modes.length)];
      return generateProblem(randomMode);
    }
    return null;
  }

  // 题目显示函数（增强版）
  function renderProblem(problem, answerArr, activeIdx, carryArr, feedback = null, score = 0, qIndex = 1, highScore = 0) {
    const gameContent = document.getElementById('game-content');
    let html = '';
    // 顶部进度与分数
    html += `
      <div class="game-status">
        <span class="score">分数：${score}</span>
        <span class="progress">第 ${qIndex} / ${TOTAL_QUESTIONS} 题</span>
        <span class="highscore">最高分：${highScore}</span>
      </div>
    `;
    // 题目区
    if (problem.type === 'addition' || problem.type === 'subtraction') {
      // 竖式，右对齐，逐位输入
      const aStr = problem.a.toString().padStart(3, ' ');
      const bStr = problem.b.toString().padStart(3, ' ');
      const ansLen = Math.max(aStr.length, bStr.length, 3) + 1; // 最高位可能进位
      // 进位/借位标记
      html += `<div class="vertical-problem enhanced">
        <div class="carry-row">`;
      for (let i = 0; i < ansLen; i++) {
        const mark = carryArr[i] ? (problem.type === 'addition' ? '⬆️' : '⬇️') : '';
        html += `<span class="carry-cell" data-idx="${i}">${mark}</span>`;
      }
      html += `</div>`;
      // 被加/减数
      html += `<div class="num-row">`;
      for (let i = 0; i < ansLen; i++) {
        html += `<span class="num-cell">${aStr[aStr.length - ansLen + i] || ''}</span>`;
      }
      html += `</div>`;
      // 运算符和加/减数
      html += `<div class="num-row">`;
      for (let i = 0; i < ansLen; i++) {
        if (i === ansLen - bStr.length - 1) {
          html += `<span class="num-cell">${problem.type === 'addition' ? '+' : '-'}</span>`;
        } else {
          html += `<span class="num-cell"></span>`;
        }
      }
      html += `</div><div class="num-row">`;
      for (let i = 0; i < ansLen; i++) {
        html += `<span class="num-cell">${bStr[bStr.length - ansLen + i] || ''}</span>`;
      }
      html += `</div>`;
      // 横线
      html += `<div class="num-row line">`;
      for (let i = 0; i < ansLen; i++) html += `<span class="num-cell">${i === ansLen - 1 ? '─────' : ''}</span>`;
      html += `</div>`;
      // 答案输入区
      html += `<div class="num-row answer-row">`;
      for (let i = 0; i < ansLen; i++) {
        html += `<span class="ans-cell${activeIdx === i ? ' active' : ''}" data-idx="${i}">${answerArr[i] !== undefined ? answerArr[i] : ''}</span>`;
      }
      html += `</div></div>`;
    } else if (problem.type === 'multiplication') {
      // 横式，左对齐，逐位输入
      const aStr = problem.a.toString();
      const bStr = problem.b.toString();
      const ansStr = problem.answer.toString();
      const ansLen = ansStr.length;
      html += `<div class="horizontal-problem enhanced">
        <span>${problem.a} × ${problem.b} = </span>`;
      for (let i = 0; i < ansLen; i++) {
        html += `<span class="ans-cell${activeIdx === i ? ' active' : ''}" data-idx="${i}">${answerArr[i] !== undefined ? answerArr[i] : ''}</span>`;
      }
      html += `</div>`;
    }
    // 答案输入区和数字键盘
    html += `
      <div class="input-area">
        <div id="feedback-area">${feedback ? feedback : ''}</div>
        <div class="keypad">
          <button class="key-btn">1</button>
          <button class="key-btn">2</button>
          <button class="key-btn">3</button>
          <button class="key-btn">4</button>
          <button class="key-btn">5</button>
          <button class="key-btn">6</button>
          <button class="key-btn">7</button>
          <button class="key-btn">8</button>
          <button class="key-btn">9</button>
          <button class="key-btn" id="key-del">←</button>
          <button class="key-btn">0</button>
          <button class="key-btn key-submit" id="key-submit">✓</button>
        </div>
      </div>
    `;
    gameContent.innerHTML = html;
  }

  // 结算界面
  function showResult(score, correctCount, total, durationSec, mode) {
    hideAllSections();
    resultSection.classList.remove('hidden');
    const percent = Math.round((correctCount / total) * 100);
    let comment = '';
    if (percent === 100) comment = '太棒了，你是数学小能手！';
    else if (percent >= 80) comment = '很棒，继续加油！';
    else if (percent >= 60) comment = '不错哦，继续练习会更棒！';
    else comment = '别灰心，多练习就会进步！';
    // 最高分逻辑
    let highScore = getHighScore(mode);
    let isNewRecord = false;
    if (score > highScore) {
      setHighScore(mode, score);
      highScore = score;
      isNewRecord = true;
    }
    resultSection.innerHTML = `
      <div class="result-card animated">
        <h2>本次成绩</h2>
        <p>总分：<b>${score}</b></p>
        <p>最高分：<b>${highScore}</b> ${isNewRecord ? '<span style=\"color:#e67e22;\">新纪录！🎉</span>' : ''}</p>
        <p>正确率：<b>${percent}%</b> (${correctCount}/${total})</p>
        <p>用时：<b>${formatDuration(durationSec)}</b></p>
        <p class="result-comment">${comment}</p>
        <div class="result-btns">
          <button id="btn-replay">再玩一次</button>
          <button id="btn-back">返回主菜单</button>
        </div>
      </div>
    `;
    playSound('finish');
    document.getElementById('btn-replay').onclick = () => {
      startGame(window._lastMode);
    };
    document.getElementById('btn-back').onclick = () => {
      hideAllSections();
      modeSelectSection.classList.remove('hidden');
    };
  }

  // 进入游戏界面
  function startGame(mode) {
    hideAllSections();
    gameSection.classList.remove('hidden');
    gameSection.innerHTML = `<h2>模式：${getModeName(mode)}</h2><div id="game-content"></div>`;
    window._lastMode = mode; // 记录当前模式，便于重玩
    let currentProblem = generateProblem(mode);
    let answerArr, activeIdx, carryArr;
    if (currentProblem.type === 'addition' || currentProblem.type === 'subtraction') {
      // 最高位可能进位，答案位数=加数/被减数/结果最大位数+1
      const aStr = currentProblem.a.toString().padStart(3, ' ');
      const bStr = currentProblem.b.toString().padStart(3, ' ');
      const ansLen = Math.max(aStr.length, bStr.length, 3) + 1;
      answerArr = Array(ansLen).fill(undefined);
      activeIdx = ansLen - 1; // 默认右侧
      carryArr = Array(ansLen).fill(false);
    } else {
      // 乘法
      const ansLen = currentProblem.answer.toString().length;
      answerArr = Array(ansLen).fill(undefined);
      activeIdx = 0; // 默认左侧
      carryArr = [];
    }
    let allowInput = true;
    let score = 0;
    let qIndex = 1;
    let correctCount = 0;
    let combo = 0;
    let startTime = Date.now();
    let highScore = getHighScore(mode);

    function nextProblem() {
      qIndex++;
      if (qIndex > TOTAL_QUESTIONS) {
        const endTime = Date.now();
        const durationSec = Math.round((endTime - startTime) / 1000);
        setTimeout(() => showResult(score, correctCount, TOTAL_QUESTIONS, durationSec, mode), 600);
        return;
      }
      currentProblem = generateProblem(mode);
      if (currentProblem.type === 'addition' || currentProblem.type === 'subtraction') {
        const aStr = currentProblem.a.toString().padStart(3, ' ');
        const bStr = currentProblem.b.toString().padStart(3, ' ');
        const ansLen = Math.max(aStr.length, bStr.length, 3) + 1;
        answerArr = Array(ansLen).fill(undefined);
        activeIdx = ansLen - 1;
        carryArr = Array(ansLen).fill(false);
      } else {
        const ansLen = currentProblem.answer.toString().length;
        answerArr = Array(ansLen).fill(undefined);
        activeIdx = 0;
        carryArr = [];
      }
      allowInput = true;
      renderProblem(currentProblem, answerArr, activeIdx, carryArr, null, score, qIndex, highScore);
      bindInput();
    }

    function bindInput() {
      // 进位/借位标记点击
      document.querySelectorAll('.carry-cell').forEach(cell => {
        cell.onclick = function () {
          if (!(currentProblem.type === 'addition' || currentProblem.type === 'subtraction')) return;
          const idx = parseInt(cell.getAttribute('data-idx'));
          carryArr[idx] = !carryArr[idx];
          renderProblem(currentProblem, answerArr, activeIdx, carryArr, null, score, qIndex, highScore);
          bindInput();
        };
      });
      // 答案格点击
      document.querySelectorAll('.ans-cell').forEach(cell => {
        cell.onclick = function () {
          const idx = parseInt(cell.getAttribute('data-idx'));
          activeIdx = idx;
          renderProblem(currentProblem, answerArr, activeIdx, carryArr, null, score, qIndex, highScore);
          bindInput();
        };
      });
      // 数字键盘
      const keypad = document.querySelector('.keypad');
      if (!keypad) return;
      keypad.querySelectorAll('.key-btn').forEach(btn => {
        btn.onclick = function () {
          if (!allowInput) return;
          const val = btn.textContent;
          playSound('click');
          if (val >= '0' && val <= '9') {
            answerArr[activeIdx] = val;
            // 自动跳到下一个输入格
            if (currentProblem.type === 'addition' || currentProblem.type === 'subtraction') {
              // 右往左
              if (activeIdx > 0) activeIdx--;
            } else {
              // 乘法左往右
              if (activeIdx < answerArr.length - 1) activeIdx++;
            }
            renderProblem(currentProblem, answerArr, activeIdx, carryArr, null, score, qIndex, highScore);
            bindInput();
          } else if (btn.id === 'key-del') {
            answerArr[activeIdx] = undefined;
            renderProblem(currentProblem, answerArr, activeIdx, carryArr, null, score, qIndex, highScore);
            bindInput();
          } else if (btn.id === 'key-submit') {
            // 检查答案
            if (answerArr.some(v => v === undefined)) return;
            allowInput = false;
            const userAns = parseInt(answerArr.join(''), 10);
            if (userAns === currentProblem.answer) {
              correctCount++;
              score += 10;
              combo++;
              let bonus = 0;
              if (combo > 0 && combo % 3 === 0) {
                bonus = 5;
                score += bonus;
              }
              playSound('correct');
              renderProblem(
                currentProblem,
                answerArr,
                activeIdx,
                carryArr,
                `<span class=\"feedback-anim correct\">✓</span> <span style=\"color:green;\">真棒！${bonus ? '连击奖励+5分！' : ''}</span>`,
                score,
                qIndex,
                highScore
              );
              setTimeout(nextProblem, 1200);
            } else {
              combo = 0;
              playSound('wrong');
              renderProblem(
                currentProblem,
                answerArr,
                activeIdx,
                carryArr,
                '<span class=\"feedback-anim wrong\">✗</span> <span style=\"color:red;\">再想想哦！</span>',
                score,
                qIndex,
                highScore
              );
              setTimeout(() => {
                allowInput = true;
                // 清空答案
                answerArr = answerArr.map(() => undefined);
                renderProblem(currentProblem, answerArr, activeIdx, carryArr, null, score, qIndex, highScore);
                bindInput();
              }, 1000);
            }
          }
        };
      });
    }

    renderProblem(currentProblem, answerArr, activeIdx, carryArr, null, score, qIndex, highScore);
    bindInput();
  }

  // 模式名称映射
  function getModeName(mode) {
    switch (mode) {
      case 'addition': return '加法挑战';
      case 'subtraction': return '减法挑战';
      case 'multiplication': return '乘法乐园';
      case 'mixed': return '混合速算王';
      default: return '';
    }
  }

  // 隐藏所有section
  function hideAllSections() {
    modeSelectSection.classList.add('hidden');
    gameSection.classList.add('hidden');
    resultSection.classList.add('hidden');
  }

  // 绑定模式选择按钮
  modeButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const mode = btn.getAttribute('data-mode');
      startGame(mode);
    });
  });
}); 