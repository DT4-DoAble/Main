const urlParams = new URLSearchParams(window.location.search);
const nickname = urlParams.get("nickname");
console.log(nickname); // 이름 출력

// 프로필 사진 업로드
const fileInput = document.getElementById("fileInput");
const profileImage = document.getElementById("nicknameProfileImage");

fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      nicknameProfileImage.src = e.target.result; // 이미지 미리보기 설정
      nicknameProfileImage.style.objectFit = "cover"; // 이미지 비율 유지하며 꽉 채우기
      // 이미지 데이터를 localStorage에 저장
      localStorage.setItem("profileImage", e.target.result);
    };
    reader.readAsDataURL(file); // 파일을 읽어 Data URL로 변환
  }
});
// 프로필 이름 설정
const form = document.querySelector("form");
form.addEventListener("submit", function (event) {
  event.preventDefault(); // 기본 폼 제출을 막음

  // 입력된 닉네임을 localStorage에 저장
  const nicknameInput = document.getElementById("nickname").value;
  localStorage.setItem("nickname", nicknameInput);

  // URL에 닉네임을 포함해 이동
  window.location.href = `/main/html/index.html?nickname=${encodeURIComponent(
    nicknameInput
  )}`;
});
