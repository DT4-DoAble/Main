const userInput = document.getElementById("username");
const userError = document.getElementById("userError");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const passwordError = document.getElementById("passwordError");
const confirmPasswordError = document.getElementById("confirmPasswordError");
const toggleVisibility = document.getElementById("toggleVisibility");
const loginButton = document.getElementById("login");
const submitButton = document.getElementById("submitButton");

function validateUser(user) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(user);
}
// 유효성 검사 함수
function validatePassword(password) {
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,20}$/;
  return regex.test(password);
}

userInput.addEventListener("input", () => {
  const user = userInput.value;

  if (validateUser(user)) {
    userError.textContent = "아이디가 유효합니다!";
    userError.className = "success";
  } else {
    userError.textContent = "아이디는 이메일 형식이어야 합니다.";
    userError.className = "error";
  }
});

// 실시간 비밀번호 유효성 검사
passwordInput.addEventListener("input", () => {
  const password = passwordInput.value;

  if (validatePassword(password)) {
    passwordError.textContent = "비밀번호가 유효합니다!";
    passwordError.className = "success";
  } else {
    passwordError.textContent =
      "비밀번호는 8~20자 이내, 숫자와 특수문자를 포함해야 합니다.";
    passwordError.className = "error";
  }
});


loginButton.addEventListener("click", () => {
  const user = userInput.value;
  const password = passwordInput.value;

  if (!validateUser(user)) {
    userError.textContent = "아이디 형식이 올바르지 않습니다";
    return;
  }

  if (!validatePassword(password)) {
    passwordError.textContent =
      "비밀번호는 8~20자 이내, 숫자와 특수문자를 포함해야 합니다.";
    return;
  }

  window.location.href = "/nickname/html/nickname.html";
});


// 로그인 상태를 확인하는 함수
function checkLogin(redirectUrl) {
  const isLoggedIn = localStorage.getItem('isLoggedIn'); // 로그인 여부 체크

  if (isLoggedIn === 'true') {
    // 로그인되어 있으면 해당 페이지로 리디렉션
    window.location.href = redirectUrl;
  } else {
    // 로그인되지 않았으면 로그인 페이지로 리디렉션
    alert('로그인 후 이용 가능합니다.');

  }
}