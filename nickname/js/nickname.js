const urlParams = new URLSearchParams(window.location.search);
const nickname = urlParams.get('nickname');
console.log(nickname);  // 이름 출력


const fileInput = document.getElementById('fileInput');
    const profileImage = document.getElementById('profileImage');

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profileImage.src = e.target.result;  // 이미지 미리보기 설정
                profileImage.style.objectFit = 'cover';  // 이미지 비율 유지하며 꽉 채우기
            }
            reader.readAsDataURL(file);  // 파일을 읽어 Data URL로 변환
        }
    });