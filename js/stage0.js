const password = 1234;

(function init() {
    const params = new URLSearchParams(location.search);
    const id = params.get('password');
    const btn = document.getElementById('enter');
    const title = document.getElementById("title");

    const tutorial = document.getElementById("tutorial");
    const content = document.getElementById("content");

    id? tutorial.style.display = 'none' : content.style.display = 'none';
    id? title.textContent = "# 0": title.textContent = "# Tutorial"

    if (id) {
        // 활성화
        if (id == password) {
            btn.style.display = 'block';
            content.textContent = '올바른 패스워드를 입력했습니다.'
        }

        // 클릭/엔터로 전환
        const go = () => location.href = './stage/stage1.html';
        btn.addEventListener('click', go);
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                go();
            }
        });
    } else {
        // 비활성 + 안내
        btn.style.display = 'block';
        btn.textContent = '> 시작하기';

        const go = () => location.href = './index.html?password=0000';
        btn.addEventListener('click', go);
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                go();
            }
        });
    }
})();