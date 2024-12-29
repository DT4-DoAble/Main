// 1. 일정 스와이프
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

// 2. 일정 목록 위치 표시 (점 세개)
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

// 3. 일정 가져오기
// Dexie 데이터베이스에서 데이터를 가져오는 부분
const db = new Dexie("CalendarDatabase");
db.version(1).stores({
  calendars: `
    ++id,
    scheduleTitle,
    scheduleStartDate,
    scheduleEndDate,
    scheduleRepeat
  `,
});

async function fetchData() {
  try {
    // DB에서 일정 데이터 가져오기
    const calendars = await db.calendars.toArray();

    if (calendars.length > 0) {
      // 각 innerContent에 일정 제목을 삽입
      const innerContents = document.querySelectorAll(".innerContent");
      let calendarIndex = 0; // 캘린더의 인덱스를 추적

      // 각 innerContent에 대해 반복
      innerContents.forEach((innerContent, contentIndex) => {
        // 해당 innerContent 내의 각 .inner 요소를 찾음
        const innerElements = innerContent.querySelectorAll(".inner");

        // 각 inner에 데이터를 할당
        innerElements.forEach((inner, innerIndex) => {
          if (calendarIndex < calendars.length) {
            const calendar = calendars[calendarIndex];

            // 각 inner 요소에 scheduleTitle 삽입
            const semiTitle = inner.querySelector(".semiTitle");
            if (semiTitle && calendar.scheduleTitle) {
              semiTitle.textContent = calendar.scheduleTitle;
            }
            calendarIndex++; // 데이터가 추가될 때마다 인덱스를 증가시킴
          }
        });
      });
    } else {
      console.log("일정이 없습니다.");
    }
  } catch (error) {
    console.error("DB에서 데이터를 가져오는 중 오류 발생:", error);
  }
}

// 페이지 로딩 시 DB 데이터로 업데이트
document.addEventListener("DOMContentLoaded", fetchData);

// 4. 디데이
// 오늘 날짜를 가져오는 함수
function getTodayDate() {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), today.getDate()); // 날짜만 비교할 수 있도록 시간은 00:00으로 설정
}

// D-day 계산 함수
function calculateDday(scheduleStartDate) {
  const today = getTodayDate();
  const startDate = new Date(scheduleStartDate);

  // 날짜 차이 계산 (밀리초 단위)
  const timeDiff = startDate - today;
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24)); // 날짜 차이 계산

  // D-0일 경우 "D-day"로 표시
  if (dayDiff === 0) {
    return "D-day";
  } else if (dayDiff < 0) {
    return `D+${-dayDiff}`;
  }
  return `D-${dayDiff}`;
}

async function fetchData() {
  try {
    // DB에서 일정 데이터 가져오기
    const calendars = await db.calendars.toArray();

    if (calendars.length > 0) {
      // 각 innerContent에 일정 제목과 D-day 삽입
      const innerContents = document.querySelectorAll(".inner");
      calendars.forEach((calendar, index) => {
        // 'innerContent' 1, 2, 3에 순차적으로 scheduleTitle과 D-day 삽입
        const semiTitles =
          innerContents[index % innerContents.length].querySelectorAll(
            ".semiTitle"
          );
        const dDays =
          innerContents[index % innerContents.length].querySelectorAll(
            ".D-day"
          );

        semiTitles.forEach((semiTitle, semiIndex) => {
          if (calendar.scheduleTitle) {
            semiTitle.textContent = calendar.scheduleTitle;
          }
        });

        dDays.forEach((dDay, dIndex) => {
          if (calendar.scheduleStartDate) {
            const dday = calculateDday(calendar.scheduleStartDate);
            dDay.textContent = dday; // "D-day" 또는 "D-1", "D-2" 등의 텍스트로 출력
          }
        });
      });
    } else {
      console.log("일정이 없습니다.");
    }
  } catch (error) {
    console.error("DB에서 데이터를 가져오는 중 오류 발생:", error);
  }
}

// 페이지 로딩 시 DB 데이터로 업데이트
document.addEventListener("DOMContentLoaded", fetchData);

// 5. 이모지 그래프
// IndexedDB 초기화
const db2 = new Dexie("DailyLogDatabase");

// Dexie 데이터 베이스 스키마 정의
db2.version(1).stores({
  dailyLogs: "++id ,selectedEmoji", // 스토어 정의
});

async function updateEmojiGraph() {
  try {
    // 그래프 초기화 (임의 값 설정)
    const initCounts = {
      smileCount: Math.floor(Math.random() * 10) + 1, // 임의의 값 설정 (1 ~ 10 사이의 숫자)
      normalCount: Math.floor(Math.random() * 10) + 1,
      angerCount: Math.floor(Math.random() * 10) + 1,
      sadCount: Math.floor(Math.random() * 10) + 1,
    };

    // 최대값 계산 (그래프 비율 조정용)
    const maxCount = Math.max(
      initCounts.smileCount,
      initCounts.normalCount,
      initCounts.angerCount,
      initCounts.sadCount,
      1
    );

    // 그래프 바 업데이트 (임의 값 표시)
    const smileBar = document.querySelector(".barGraph.one");
    const normalBar = document.querySelector(".barGraph.two");
    const angerBar = document.querySelector(".barGraph.three");
    const sadBar = document.querySelector(".barGraph.four");

    if (smileBar) {
      smileBar.style.width = `${(initCounts.smileCount / maxCount) * 100}%`;
      smileBar.querySelector("span").textContent = `${initCounts.smileCount}번`;
    }

    if (normalBar) {
      normalBar.style.width = `${(initCounts.normalCount / maxCount) * 100}%`;
      normalBar.querySelector(
        "span"
      ).textContent = `${initCounts.normalCount}번`;
    }

    if (angerBar) {
      angerBar.style.width = `${(initCounts.angerCount / maxCount) * 100}%`;
      angerBar.querySelector("span").textContent = `${initCounts.angerCount}번`;
    }

    if (sadBar) {
      sadBar.style.width = `${(initCounts.sadCount / maxCount) * 100}%`;
      sadBar.querySelector("span").textContent = `${initCounts.sadCount}번`;
    }

    // IndexedDB에서 실제 데이터를 가져오는 부분
    const logs = await db2.dailyLogs.toArray();

    // 이모지별 사용 횟수를 변수로 카운트
    let smileCount = 0;
    let normalCount = 0;
    let angerCount = 0;
    let sadCount = 0;

    // 로그를 순회하며 각 이모지의 카운트 증가
    logs.forEach((log) => {
      if (log.selectedEmoji === "smile") smileCount++;
      else if (log.selectedEmoji === "normal") normalCount++;
      else if (log.selectedEmoji === "anger") angerCount++;
      else if (log.selectedEmoji === "sad") sadCount++;
    });

    // 최대값 계산 (그래프 비율 조정용)
    const actualMaxCount = Math.max(
      smileCount,
      normalCount,
      angerCount,
      sadCount,
      1
    ); // 실제 데이터로 최대값 계산

    // 그래프 바 업데이트 (실제 값으로)
    if (smileBar) {
      smileBar.style.width = `${(smileCount / actualMaxCount) * 100}%`;
      smileBar.querySelector("span").textContent = `${smileCount}번`;
    }

    if (normalBar) {
      normalBar.style.width = `${(normalCount / actualMaxCount) * 100}%`;
      normalBar.querySelector("span").textContent = `${normalCount}번`;
    }

    if (angerBar) {
      angerBar.style.width = `${(angerCount / actualMaxCount) * 100}%`;
      angerBar.querySelector("span").textContent = `${angerCount}번`;
    }

    if (sadBar) {
      sadBar.style.width = `${(sadCount / actualMaxCount) * 100}%`;
      sadBar.querySelector("span").textContent = `${sadCount}번`;
    }
  } catch (error) {
    console.error("Failed to update emoji graph:", error);
  }
}

// 페이지 로드 시 그래프 업데이트 실행
document.addEventListener("DOMContentLoaded", updateEmojiGraph);

// 6. 캘린더--------------------------------
// --------
// 날짜 포맷
function formatYearMonth(year, month) {
  return `${year}년 ${month}월`;
}

// 달력 HTML 생성
const calendarHTML = function (
  date,
  showDay = true,
  showFullDayName = false,
  showToday = true
) {
  if (!(date instanceof Date)) return ""; // date 값이 Date 인지 체크 아니면 중지

  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const calendarYear = date.getFullYear();
  const calendarMonth = date.getMonth() + 1;
  const calendarToday = date.getDate();

  const monthLastDate = new Date(calendarYear, calendarMonth, 0).getDate();
  const monthStartDay = new Date(calendarYear, date.getMonth(), 1).getDay();
  const calendarWeekCount = Math.ceil((monthStartDay + monthLastDate) / 7);

  const today = new Date();

  let html = "<table>";
  if (showDay) {
    html += `<thead class="days-of-weeks"><tr>`;
    days.forEach((day, index) => {
      html += `<th class="day-of-weeks-item ${
        index === 0 ? "sunday" : index === 6 ? "saturday" : ""
      }">${day}${showFullDayName ? "요일" : ""}</th>`;
    });
    html += "</tr></thead>";
  }

  html += "<tbody>";
  let calendarPos = 0;
  let calendarDay = 0;
  for (let week = 0; week < calendarWeekCount; week++) {
    html += `<tr class="week week-height">`;
    for (let day = 0; day < 7; day++) {
      html += `<td id="td-${calendarDay + 1}" class="day-sell">`;
      if (monthStartDay <= calendarPos && calendarDay < monthLastDate) {
        calendarDay++;
        html += `<span class="day-number ${
          showToday &&
          calendarYear === today.getFullYear() &&
          calendarMonth === today.getMonth() + 1 &&
          calendarDay === today.getDate()
            ? "today"
            : day === 0
            ? "sunday"
            : day === 6
            ? "saturday"
            : ""
        }">${calendarDay}</span>`;
        // getDayMemoData(calendarYear, calendarMonth, calendarDay);
      }
      html += "</td>";
      calendarPos++;
    }
    html += "</tr>";
  }
  html += "</tbody>";
  html += "</table>";
  return html;
};
// 페이지 로드 시 캘린더 데이터 렌더링
document.addEventListener("DOMContentLoaded", function () {
  const calendarElement = document.getElementById("calendar");
  const today = new Date();

  // 캘린더 HTML 생성
  const calendarHtml = calendarHTML(today);
  calendarElement.innerHTML = calendarHtml; // 생성된 HTML을 calendarElement에 삽입
});
function generateCalendar() {
  // 달력을 표시할 div 요소 가져오기
  var calendarContainer = document.getElementById("calendar");

  // 현재 날짜 가져오기
  var currentDate = new Date();

  // 달력의 년도와 월 설정
  var year = currentDate.getFullYear();
  var month = currentDate.getMonth();

  // 달력의 본문 생성
  let calendarHTML = "<table>";

  // 요일 표시
  calendarHTML += "<tr>";
  const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
  for (let day of daysOfWeek) {
    calendarHTML += `<th>${day}</th>`;
  }
  calendarHTML += "</tr>";

  // 각 주와 날짜 표시
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  let dayCounter = 1;

  for (let i = 0; i < 6; i++) {
    // 최대 6주 (일주일이 6주일 경우도 있음)
    calendarHTML += "<tr>";

    for (let j = 0; j < 7; j++) {
      // 7일 (요일)
      if (i === 0 && j < firstDayOfMonth) {
        // 첫 주의 시작일 이전은 빈 셀로 채움
        calendarHTML += "<td></td>";
      } else if (dayCounter > totalDaysInMonth) {
        // 마지막 날 이후는 빈 셀로 채움
        calendarHTML += "<td></td>";
      } else {
        // 유효한 날짜일 경우 날짜 표시
        calendarHTML += `<td>${dayCounter}</td>`;
        dayCounter++;
      }
    }

    calendarHTML += "</tr>";

    // 모든 날짜를 표시한 경우 종료
    if (dayCounter > totalDaysInMonth) {
      break;
    }
  }

  calendarHTML += "</table>";

  // 생성된 달력을 달력 컨테이너에 추가
  calendarContainer.innerHTML = calendarHTML;
}
// 7. 일정 중요도 표시
const innerElements = document.querySelectorAll(".inner");

innerElements.forEach((element) => {
  element.addEventListener("click", (event) => {
    // 클릭된 요소에 'selected' 클래스 토글
    event.currentTarget.classList.toggle("selected");
  });
});
// 8. 모달창
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
