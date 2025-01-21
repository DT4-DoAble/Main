window.onload = function () {
  Kakao.init("3083aede97cc7c975ae9d611ddc5f97c"); // 카카오 JavaScript 키
};

// 카카오 로그인 함수
function loginWithKakao() {
  Kakao.Auth.authorize({
    redirectUri: "https://doable1.netlify.app/nickname/html/nickname.html", // 카카오 로그인 후 연결되는 홈페이지 - 꼭 링크 바꿀것 //
  });
}

    // 로그인 상태를 확인하는 함수
    function checkLogin(redirectUrl) {
      const isLoggedIn = localStorage.getItem('isLoggedIn'); // 로그인 여부 체크

      if (isLoggedIn === 'true') {
          // 로그인되어 있으면 해당 페이지로 리디렉션
          window.location.href = redirectUrl;
      } else {
          // 로그인되지 않았으면 로그인 페이지로 리디렉션
          alert('로그인 후 이용 가능합니다.');
          window.location.href = '/login/html/login.html'; // 로그인 페이지로 리디렉션
      }
  }
