document.addEventListener("DOMContentLoaded", function () {
  const icon = document.querySelector(".icon-container");

  const images = ["../img/main.png", "../img/calendar.png", "../img/diary.png"];
  const texts = [
    [
      "간편한 캘린더 어플",
      "목표 세우는 게 막막하다면?",
      "걱정마세요. Doable과 함께라면 뭐든지 할 수 있어요.",
    ],
    ["캘린더", "일정과 계획이 생겼다면,", "캘린더와 To-do list로 안내할게요."],
    [
      "일기장",
      "오늘 하루는 어땠나요?",
      "당신의 기분을 한 단어로 표현해 주세요.",
    ],
  ];

  const buttons = document.querySelectorAll(".bb");
  let index = 0;

  // 버튼 색상 초기화 함수
  function updateButtonColor() {
    buttons.forEach((button, i) => {
      if (i === index) {
        button.classList.add("active"); // 현재 인덱스에 해당하는 버튼 활성화
      } else {
        button.classList.remove("active"); // 나머지는 비활성화
      }
    });
  }

  // 초기 상태 (첫 번째 버튼 활성화)
  updateButtonColor();

  icon.addEventListener("click", function () {
    index = (index + 1) % images.length; // 다음 이미지로 넘어감, 마지막이면 처음으로
    document.querySelector(".main1").src = images[index];
    document.querySelector(".txt1").textContent = texts[index][0];
    document.querySelector(".txt2").textContent = texts[index][1];
    document.querySelector(".txt3").textContent = texts[index][2];
    updateButtonColor();
  });
});

////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function () {
  const slides = [
    {
      image: "../img/phone_main.png",
      txtt1: "간편한 캘린더 어플",
      txtt2: "목표 세우는 게 막막하다면?",
      txtt3: "걱정마세요. Doable이 도와드릴게요.",
    },
    {
      image: "../img/phone_main2.png",
      txtt1: "새로운 일정 추가",
      txtt2: "목표를 세우는 방법은?",
      txtt3: "Doable에서 함께 찾아보세요.",
    },
    {
      image: "../img/phone_main3.png",
      txtt1: "더욱 쉬운 일정 관리",
      txtt2: "매일매일 목표 달성하기",
      txtt3: "Doable과 함께라면 가능합니다!",
    },
  ];

  // 모든 버튼을 가져와서 상단에서 선언
  const buttons = document.querySelectorAll(".ip");

  function changeSlide(index) {
    // 이미지 변경
    const imageElement = document.querySelector(".m1");
    imageElement.src = slides[index].image;

    // 텍스트 변경
    const txt1 = document.querySelector(".txtt1");
    const txt2 = document.querySelector(".txtt2");
    const txt3 = document.querySelector(".txtt3");

    txt1.innerText = slides[index].txtt1;
    txt2.innerText = slides[index].txtt2;
    txt3.innerText = slides[index].txtt3;

    // 모든 버튼에서 'active' 클래스 제거
    buttons.forEach((btn) => {
      btn.classList.remove("active");
    });

    // 클릭된 버튼에 'active' 클래스 추가
    buttons[index].classList.add("active");
  }

  // 버튼 클릭 이벤트 리스너 추가
  buttons.forEach((button, i) => {
    button.addEventListener("click", () => {
      changeSlide(i);
    });
  });
});

// DOM이 완전히 로드된 후에 이벤트를 연결 (웹 시작하기 버튼)
document.addEventListener("DOMContentLoaded", function () {
  const button = document.querySelector(".start");

  // 버튼이 존재하는 경우에만 이벤트 추가
  if (button) {
    button.addEventListener("click", function () {
      window.location.href = "../../login/html/login.html"; // 이동할 URL
    });
  }
});

// 모바일 버전 시작하기 버튼
document.addEventListener("DOMContentLoaded", function () {
  const button = document.querySelector(".phone_btn");

  // 버튼이 존재하는 경우에만 이벤트 추가
  if (button) {
    button.addEventListener("click", function () {
      window.location.href = "../../login/html/login.html"; // 이동할 URL
    });
  }
});

// 로그인 상태를 확인하는 함수
function checkLogin(redirectUrl) {
  const isLoggedIn = localStorage.getItem("isLoggedIn"); // 로그인 여부 체크

  if (isLoggedIn === "true") {
    // 로그인되어 있으면 해당 페이지로 리디렉션
    window.location.href = redirectUrl;
  } else {
    // 로그인되지 않았으면 로그인 페이지로 리디렉션
    alert("로그인 후 이용 가능합니다.");
    window.location.href = "/login/html/login.html"; // 로그인 페이지로 리디렉션
  }
}
