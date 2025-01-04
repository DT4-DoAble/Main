

// 달력 초기화
const today = new Date();
const month = today.getMonth() + 1; // 현재 월
const monthElement = document.getElementById('main-today-month');
if (monthElement) {
  monthElement.textContent = month;
}

function formatMonth(month) {
  return month < 10 ? `0${month}` : `${month}`;
}

function getMonthData(year, month) {
  console.log(`Year: ${year}, Month: ${month}`);
  // 예시: 해당 월의 일 수를 가져오는 코드
  const daysInMonth = new Date(year, month, 0).getDate();
  console.log(`Days in month: ${daysInMonth}`);
  // 일 수에 맞춰 달력을 업데이트하는 로직을 추가
}

function calendar(date) {
  if (monthElement) {
    monthElement.textContent = formatMonth(date.getMonth() + 1);
  }
  getMonthData(date.getFullYear(), date.getMonth() + 1);
}

// 이전, 다음 버튼 이벤트
function navigateCalendar(direction) {
  const yearMonthText =
    document.querySelector('.calendarYearMonth').textContent;
  const [year, month] = yearMonthText
    .replace('년', '')
    .replace('월', '')
    .split(' ')
    .map(Number);
  calendar(new Date(year, month - 1 + direction, 1)); // 연도, 월 계산이 정확히 이루어짐
}

// 오늘 버튼 이벤트
const todayButton = document.querySelector(
  '.calendarControls > .calendarToday'
);
if (todayButton) {
  todayButton.addEventListener('click', () => {
    calendar(new Date()); // 오늘 날짜로 달력 표시
  });
}
