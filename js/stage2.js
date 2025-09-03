const password = 7284;

(function init() {
    const params = new URLSearchParams(location.search);
    const id = params.get('password');
    const btn = document.getElementById('enter');
    const content = document.getElementById("content");
    const notice = document.getElementById("notice");

    // 활성화
    if (id == password) {
        btn.style.display = 'block';
        content.textContent = '올바른 패스워드를 입력했습니다.';
    }
    else if (id == "0000") {
        content.innerText = `이전과 동일한 방식입니다.
            올바른 패스워드를 입력하고 다음 스테이지로 넘어가세요.`;
    }
    else {
        notice.textContent = '올바르지 않은 패스워드입니다.';
    }

    // 클릭/엔터로 전환
    const go = () => location.href = './stage3.html';
    btn.addEventListener('click', go);
    btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            go();
        }
    });

})();