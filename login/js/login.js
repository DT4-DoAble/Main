window.onload = function () {
  Kakao.init('3083aede97cc7c975ae9d611ddc5f97c'); // 카카오 JavaScript 키
};

// 카카오 로그인 함수
function loginWithKakao() {
  Kakao.Auth.authorize({
    redirectUri: 'https://doable1.netlify.app/nickname/html/nickname.html', // 카카오 로그인 후 연결되는 홈페이지 - 꼭 링크 바꿀것 //
  });
}
