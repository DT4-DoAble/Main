// 달력 초기화
const monthElement = document.getElementById("main-today-month");
monthElement.textContent = month;

function calendar(date) {
  if (monthElement) {
    monthElement.textContent = formatMonth(date.getMonth() + 1);
  }

  getMonthData(date.getFullYear(), date.getMonth() + 1);
}

// 이전, 다음 버튼 이벤트
function navigateCalendar(direction) {
  const yearMonthText =
    document.querySelector(".calendarYearMonth").textContent;
  const [year, month] = yearMonthText
    .replace("년 ", ".")
    .replace("월", "")
    .split(".")
    .map(Number);
  calendar(new Date(year, month - 1 + direction, 1));
}

// 오늘 버튼 이벤트
const todayButton = document.querySelector(
  ".calendarControls > .calendarToday"
);
if (todayButton) {
  todayButton.addEventListener("click", () => {
    calendar(new Date());
  });
}
