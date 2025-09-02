// ../js/util.js

(() => {
    // ===== 기본 참조 =====
    const pads = document.querySelectorAll('.padWrap .pad');             // 키패드 버튼(숫자/←/▶)
    const outputEl = document.getElementById('output');                  // 현재 입력 표시
    const answerDots = document.querySelectorAll('.answerWrap .answerDot'); // 결과 4칸(오타 'anwser'이어도 .answerDot 클래스로 잡음)
    const attemptDots = document.querySelectorAll('.attempWrap .attempDot'); // 시도 점 5개

    // ===== 설정 값 =====
    const MAX_ATTEMPTS = attemptDots.length; // 5로 가정
    const CODE_LENGTH = 4;

    // ===== 상태 =====
    let secret = makeSecret(CODE_LENGTH); // 예: ["3","9","7","1"] (중복 없음)
    let input = [];                       // 현재 입력 중인 4자리
    let attemptsLeft = MAX_ATTEMPTS;
    let locked = false;                   // 정답이거나 기회 소진 후 입력 잠금
    let solved = false;   // ✅ 정답 여부 기록

    // 디버깅 시 비밀코드 확인하고 싶으면 주석 해제
    // console.log('[secret]', secret.join(''));

    // ===== 이벤트 바인딩 =====
    pads.forEach((btn) => {
        btn.addEventListener('click', () => onPadClick(btn.textContent.trim()));
    });

    // ===== 함수들 =====

    // 1) 중복 없는 4자리 코드 생성 (0으로 시작 가능)
    function makeSecret(n) {
        const pool = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const pick = [];
        while (pick.length < n) {
            const d = pool[Math.floor(Math.random() * pool.length)];
            if (!pick.includes(d)) pick.push(d);
        }
        return pick;
    }

    // 2) 키패드 클릭 처리
    function onPadClick(label) {
        if (locked) return;

        if (label === '←') {
            if (input.length) input.pop();
            renderInput();
            return;
        }

        if (label === '▶') {
            if (input.length !== CODE_LENGTH) {
                blink(outputEl); // 4자리가 아니면 경고 느낌만
                return;
            }
            submitGuess();
            return;
        }

        // 숫자(0-9)
        if (/^\d$/.test(label)) {
            if (input.length >= CODE_LENGTH) return;
            input.push(label);
            renderInput();
        }
    }

    // 3) 현재 입력 표시 (원하시면 ●●●●로 가려도 됨)
    function renderInput() {
        outputEl.textContent = input.join('');
    }

    // 4) 제출 로직
    function submitGuess() {
        // 결과 색 도출: 자리/숫자 일치(green), 숫자만 있음(orange), 없음(red)
        const colors = grade(input, secret); // 길이 4 배열: 'green' | 'orange' | 'red'
        paintAnswerDots(colors);

        const isCorrect = colors.every((c) => c === 'green');

        if (isCorrect) {
            outputEl.textContent = 'Correct';
            locked = true;
            solved = true;   // ✅ 정답 맞춤 기록

            retryBtn.style.color = 'gold';
            retryBtn.textContent = '다음 단계로 이동';
            return;
        }

        // 오답이면 시도 차감 + 시도 점 표시
        attemptsLeft = Math.max(0, attemptsLeft - 1);
        paintAttempts();

        if (attemptsLeft <= 0) {
            locked = true;
            outputEl.textContent = `Access Denined`;
            return;
        }

        // 다음 입력을 위해 초기화
        input = [];
        renderInput();
    }

    // 5) 채점: 자리/숫자 일치 여부 색상 배열로 반환
    function grade(guessArr, secretArr) {
        // 깊은 복사
        const guess = [...guessArr];
        const secret = [...secretArr];

        const res = Array(CODE_LENGTH).fill('red');

        // 1단계: 자리/숫자 완전 일치 → green
        for (let i = 0; i < CODE_LENGTH; i++) {
            if (guess[i] === secret[i]) {
                res[i] = 'green';
                // 중복 판정 방지를 위해 제거 마킹
                guess[i] = null;
                secret[i] = null;
            }
        }

        // 2단계: 남은 guess 숫자가 secret 어딘가에 존재 → orange
        for (let i = 0; i < CODE_LENGTH; i++) {
            if (guess[i] == null) continue; // 이미 green 처리됨
            const idx = secret.indexOf(guess[i]);
            if (idx !== -1) {
                res[i] = 'orange';
                secret[idx] = null; // 소진 처리
            } else {
                res[i] = 'red';
            }
        }
        return res;
    }

    // 6) answerDot 색칠
    function paintAnswerDots(colors) {
        answerDots.forEach((dot, i) => {
            dot.classList.remove('is-green', 'is-orange', 'is-red');
            const c = colors[i];
            if (c === 'green') dot.classList.add('is-green');
            else if (c === 'orange') dot.classList.add('is-orange');
            else dot.classList.add('is-red');
        });
    }

    // 7) 시도 점 색칠 (남은 시도는 회색, 사용한 시도는 채움)
    function paintAttempts() {
        const used = MAX_ATTEMPTS - attemptsLeft;
        attemptDots.forEach((dot, i) => {
            if (i < used) dot.classList.add('is-used');
            else dot.classList.remove('is-used');
        });
    }

    // 8) 살짝 반짝임(입력 부족시)
    function blink(el) {
        el.classList.add('blink');
        setTimeout(() => el.classList.remove('blink'), 250);
    }

    // 9) 재시작
    function resetGame() {
        secret = makeSecret(CODE_LENGTH);
        input = [];
        attemptsLeft = MAX_ATTEMPTS;
        locked = false;
        solved = false;   // 다시 초기화
        renderInput();
        paintAnswerDots(Array(CODE_LENGTH).fill('red'));
        paintAttempts();
        outputEl.textContent = '- - - -';
    }

    // retry 버튼 클릭
    const retryBtn = document.getElementById('retry');
    if (retryBtn) {
        retryBtn.addEventListener('click', () => {
            if (solved) {
                // ✅ 정답 맞췄을 경우 이동
                location.href = "./stage2.html"; // 원하는 링크로 변경
            } else {
                // 실패하거나 도중일 경우 다시 시작
                resetGame();
            }
        });
    }

    // 초기 렌더
    renderInput();
    resetGame();
    paintAnswerDots(Array(CODE_LENGTH).fill('red')); // 시작 상태는 모두 빨강(또는 무색)
    paintAttempts();
})();
