import db from "../js/db.js"; // db.js에서 공유된 객체 사용

const emojiToImageMap = {
  smile: "../img/smile.svg",
  sad: "../img/sad.svg",
  anger: "../img/anger.svg",
  normal: "../img/normal.svg",
};

const emotionColors = {
  smile: "#EFFBF8",
  sad: "#F0F6FF",
  anger: "#FFF1F0",
  normal: "#FFFBE5",
};

const emotionColors1 = {
  smile: "#278B7E",
  sad: "#5C95FF",
  anger: "#FF6E61",
  normal: "#DDA508",
};

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth() + 1;

// 월별 데이터를 필터링하고 표시하는 함수
async function displayDiariesByMonth(year, month) {
  const diaryList = document.getElementById("diaryList");
  if (!diaryList) {
    console.error("diaryList element not found.");
    return;
  }
  diaryList.innerHTML = ""; // 초기화

  try {
    const diaries = await db.dailyLogs.toArray(); // IndexedDB에서 데이터 가져오기
    const filteredDiaries = diaries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.getFullYear() === year && entryDate.getMonth() + 1 === month
      );
    });

    if (filteredDiaries.length === 0) {
      diaryList.innerHTML = "<li>이달에 작성한 일기는 없습니다</li>";
      return;
    }

    filteredDiaries.forEach((entry) => {
      const emojiImage =
        emojiToImageMap[entry.selectedEmoji] || "../img/default.svg"; // 기본 이미지 설정
      const emotionText =
        entry.selectedEmotion.split(":")[1] || entry.selectedEmotion;
      const emotionType = entry.selectedEmotion.split(":")[0]; // "smile", "sad" 등의 값
      const backgroundColor = emotionColors[emotionType] || "white"; // 기본 배경색은 흰색
      const color = emotionColors1[emotionType] || "black";
      const date = new Date(entry.date);
      const day = String(date.getDate()).padStart(2, "0"); // 날짜를 두 자리로 포맷

      const diaryItem = `
        <li class="diary-item">
          <h4 class="diary-item-title">
            <span class="diary-day-number text-xl-b">${day}</span>
            <img src="${emojiImage}" alt="${entry.selectedEmoji}"  style="width:28px; height:28px;"/>
          </h4>
          <div class="diary-contents">
            <span class="tag-s-s" style="background-color: ${backgroundColor}; color: ${color}">${emotionText}</span>
            <p class="diary-text">${entry.diary}</p>
          </div>
        </li>
      `;
      diaryList.innerHTML += diaryItem; // 리스트에 추가
    });
  } catch (err) {
    console.error("Failed to load daily logs:", err);
    alert("데이터를 불러오는 중 오류가 발생했습니다.");
  }
}

// 이전/다음 월 탐색 함수
function navigateMonth(direction) {
  currentMonth += direction;

  if (currentMonth > 12) {
    currentYear += 1;
    currentMonth = 1;
  } else if (currentMonth < 1) {
    currentYear -= 1;
    currentMonth = 12;
  }

  updateCalendarHeader();
  updateTodayMonth(); // 추가: 월 업데이트 함수 호출
  displayDiariesByMonth(currentYear, currentMonth);
}

// // 달력 헤더 업데이트
function updateCalendarHeader() {
  const yearMonthElement = document.querySelector(".calendarYearMonth");
}

// 월 업데이트 (ftMon)
function updateTodayMonth() {
  const mainTodayMonth = document.getElementById("main-today-month");
  if (mainTodayMonth) {
    mainTodayMonth.textContent = currentMonth;
  }
}

// 이벤트 리스너 등록
window.addEventListener("DOMContentLoaded", () => {
  updateCalendarHeader();
  updateTodayMonth(); // 페이지 로드 시 초기 월 설정
  displayDiariesByMonth(currentYear, currentMonth);

  const prevButton = document.querySelector(".calendarPrev");
  const nextButton = document.querySelector(".calendarNext");
  const thisMonthButton = document.querySelector(".calendarThisMonth");

  if (prevButton) {
    prevButton.addEventListener("click", () => navigateMonth(-1)); // 이전 달
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => navigateMonth(1)); // 다음 달
  }

  if (thisMonthButton) {
    thisMonthButton.addEventListener("click", () => {
      currentYear = new Date().getFullYear();
      currentMonth = new Date().getMonth() + 1;
      updateCalendarHeader();
      updateTodayMonth(); 
      displayDiariesByMonth(currentYear, currentMonth); // 이번 달 데이터
    });
  }
});
