// IndexedDB 초기화
const db = new Dexie("DailyLogDatabase");

// Dexie 데이터 베이스 스키마 정의
db.version(1).stores({
  dailyLogs: "++id ,date,diary,selectedEmoji,selectedEmotion", // 스토어 정의
});
// 데이터베이스 열기
db.open().catch((err) => {
  console.error("Failed to open database:", err);
});


const emojiToImageMap = {
  smile: "../diary1/img/smile.svg",
  sad: "../diary1/img/sad.svg",
  anger: "../diary1/img/anger.svg",
  normal: "../diary1/img/normal.svg",
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

//데이터 정보값 표시
async function displayDiaries() {
  const diaryList = document.getElementById("diaryList");
  diaryList.innerHTML = ""; // 초기화

  

  try {
    const diaries = await db.dailyLogs.toArray(); // IndexedDB에서 데이터 가져오기

    diaries.forEach((entry) => {
      // selectedEmoji 값으로 이미지 경로 가져오기
      const emojiImage =
        emojiToImageMap[entry.selectedEmoji] || "../diary1/img/default.svg"; // 기본 이미지 설정

      // selectedEmotion에서 ": "을 기준으로 뒤에 있는 텍스트만 가져오기
      const emotionText =
        entry.selectedEmotion.split(":")[1] || entry.selectedEmotion;
      const emotionType = entry.selectedEmotion.split(":")[0]; // "smile", "sad" 등의 값

      // 해당 emotionType에 맞는 배경색을 가져오기
      const backgroundColor = emotionColors[emotionType] || "white"; // 기본 배경색은 흰색
      const color = emotionColors1[emotionType] || "black";

      const date = new Date(entry.date);
      const day = date.getDate();  

      // HTML 템플릿 생성
      const diaryItem = `
        <div class="diaryItem">
          <div class="emoji">
            <img src="${emojiImage}" alt="${entry.selectedEmoji}" />
          </div>
          <div class="content">
            <div class="date">${day}</div>
            <div class="emotion" style="background-color: ${backgroundColor}; color: ${color}" >${emotionText}</div>
            <div class="text">${entry.diary}</div>
          </div>
        </div>
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