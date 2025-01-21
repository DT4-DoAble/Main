document.addEventListener("DOMContentLoaded", function () {
  // localStorage에서 닉네임과 이미지 불러오기
  const storedNickname = localStorage.getItem("nickname");
  const storedProfileImage = localStorage.getItem("profileImage");

  // 닉네임과 이미지가 있으면 마이페이지에 반영
  if (storedNickname) {
    document.getElementById("nickname").value = storedNickname; // 닉네임 표시
  }

  if (storedProfileImage) {
    document.getElementById("mypageProfileImage").src = storedProfileImage; // 프로필 사진 표시
    document.getElementById("mypageProfileImage").style.objectFit = "cover"; // 이미지 비율 유지하며 꽉 채우기
  }

  // 프로필 사진 업로드
  const fileInput = document.getElementById("fileInput");
  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById("mypageProfileImage").src = e.target.result; // 이미지 미리보기 설정
        document.getElementById("mypageProfileImage").style.objectFit = "cover"; // 이미지 비율 유지하며 꽉 채우기
        // 이미지 데이터를 localStorage에 저장
        localStorage.setItem("profileImage", e.target.result);
      };
      reader.readAsDataURL(file); // 파일을 읽어 Data URL로 변환
    }
  });

  // 프로필 수정 완료 버튼 클릭 시
  const form = document.getElementById("profileForm");
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // 폼 제출 기본 동작 방지

    const nickname = document.getElementById("nickname").value;

    // 닉네임을 localStorage에 저장
    localStorage.setItem("nickname", nickname);

    // 프로필 수정 후 /main/html/index.html로 닉네임을 쿼리 파라미터로 전달하며 리다이렉트
    window.location.href =
      "/main/html/index.html?nickname=" + encodeURIComponent(nickname);
  });
});
