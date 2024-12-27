const values = [
  "💧 물 한 컵 마시기",
  "🧘‍♀ 간단한 호흡 명상",
  "🛏️침대 정리하기",
  "🖋️ 긍정적인 글귀 읽기",
  "🥣 간단한 아침 식사",
  "☀️ 햇빛 받기",
  "🧘‍♀ 명상 하기",
  "🙆‍♀ 5분 스트레칭",
];

// 랜덤 값 선택 함수
function pickRandom(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

const modal = document.getElementById("random-modal");
const randomValueElement = document.getElementById("random-value");

// 화면 로드 시 실행
window.addEventListener("load", () => {
  const randomValue = pickRandom(values); 
  randomValueElement.textContent = randomValue; 
  modal.style.display = "flex"; // 모달 열기

  // 타이머로 모달 자동 닫기 (5초 후)
  setTimeout(() => {
    modal.style.display = "none"; // 모달 숨기기
  }, 10000); 
});

const closeModalButton = document.querySelector(".close");

// 모달 닫기 버튼 클릭 이벤트
closeModalButton.addEventListener("click", () => {
  modal.style.display = "none"; // 모달 숨기기
});

