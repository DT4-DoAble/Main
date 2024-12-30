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

// 데이터 정보값 표시
async function displayDiaries() {
  const diaryList = document.getElementById("diaryList");

  if (!diaryList) {
    console.error("diaryList element not found.");
    return;
  }

  diaryList.innerHTML = ""; // 초기화

  try {
    const diaries = await db.dailyLogs.toArray(); // IndexedDB에서 데이터 가져오기

    if (diaries.length === 0) {
      // 일기가 없을 경우
      diaryList.innerHTML = "<li>No diaries found.</li>";
      return;
    }

    diaries.forEach((entry) => {
      // selectedEmoji 값으로 이미지 경로 가져오기
      const emojiImage =
        emojiToImageMap[entry.selectedEmoji] || "../img/default.svg"; // 기본 이미지 설정

      // selectedEmotion에서 ": "을 기준으로 뒤에 있는 텍스트만 가져오기
      const emotionText =
        entry.selectedEmotion.split(":")[1] || entry.selectedEmotion;
      const emotionType = entry.selectedEmotion.split(":")[0]; // "smile", "sad" 등의 값

      // 해당 emotionType에 맞는 배경색을 가져오기
      const backgroundColor = emotionColors[emotionType] || "white"; // 기본 배경색은 흰색
      const color = emotionColors1[emotionType] || "black";

      const date = new Date(entry.date);
      const day = date.getDate(); // 일만 가져오기

      // HTML 템플릿 생성
      const diaryItem = `
        <li class="diary-item">
          <h4 class="diary-item-title">
            <span class="diary-day-number">${day}</span>  
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

// 페이지 로드 시 실행
window.addEventListener("DOMContentLoaded", displayDiaries);