const slides = document.querySelector(".outer"); //전체 슬라이드 컨테이너
const slideImg = document.querySelectorAll(".innerContent"); //모든 슬라이드들
let currentIdx = 0; //현재 슬라이드 index
const slideCount = slideImg.length; // 슬라이드 개수
const prev = document.querySelector(".left"); //이전 버튼
const next = document.querySelector(".right"); //다음 버튼

// circle-button
prev.addEventListener("click", function () {
  /*첫 번째 슬라이드로 표시 됐을때는
      이전 버튼 눌러도 아무런 반응 없게 하기 위해
      currentIdx !==0일때만 moveSlide 함수 불러옴 */

  if (currentIdx !== 0) moveSlide(currentIdx - 1);
});

next.addEventListener("click", function () {
  /* 마지막 슬라이드로 표시 됐을때는
      다음 버튼 눌러도 아무런 반응 없게 하기 위해
      currentIdx !==slideCount - 1 일때만
      moveSlide 함수 불러옴 */
  if (currentIdx !== slideCount - 1) {
    moveSlide(currentIdx + 1);
  }
});
const buttons = document.querySelectorAll(".circle-button"); // .circle-button으로 버튼들 선택

// 버튼 색상 초기화 함수
function updateButtonColor() {
  buttons.forEach((button, i) => {
    // button을 buttons로 수정
    if (i === currentIdx) {
      button.classList.add("active"); // 현재 인덱스에 해당하는 버튼 활성화
    } else {
      button.classList.remove("active"); // 나머지는 비활성화
    }
  });
}

// moveSlide 함수 안에서 버튼 색상 업데이트 호출
function moveSlide(num) {
  slides.style.left = -num * 624 + "px";
  currentIdx = num;
  console.log("슬라이드 위치 (left):", slides.style.left);
  console.log("현재 인덱스 (currentIdx):", currentIdx);

  // 슬라이드 이동 후 버튼 색상 업데이트
  updateButtonColor();
}
