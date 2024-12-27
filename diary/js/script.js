// IndexedDB 초기화
const db = new Dexie("DailyLogDatabase");

// Dexie 데이터 베이스 스키마 정의
db.version(1).stores({
  dailyLogs: "++id ,date,diary,selectedEmoji,selectedEmotion", // 스토어 정의
});
// 더미 데이터
const dummyData = [
  {
    date: "2024-12-01",
    diary: "오늘은 아무 일 없이 잘 지나감",
    selectedEmoji: "normal",
    selectedEmotion: "normal:평범한",
  },
  {
    date: "2024-12-02",
    diary: "산책 갔다가 턱시도 고양이를 만났다! 너무 귀여워서 행복했다,,,",
    selectedEmoji: "smile",
    selectedEmotion: "smile:행복한",
  },
  {
    date: "2024-12-04",
    diary: "무난했던 오늘 하루 무탈하게 잘 지나가서 다행이다",
    selectedEmoji: "normal",
    selectedEmotion: "normal:따분한",
  },
  {
    date: "2024-12-08",
    diary:
      "오늘 하루 너무 힘들다 . 회사에서도 일이 마음대로 진행되지 않아서 속상했는데 친구랑  싸우기까지,, 언제 화해하려나 ",
    selectedEmoji: "sad",
    selectedEmotion: "sad:실망한",
  },
  {
    date: "2024-12-14",
    diary:
      "길 가다가 이상한 사람을 만난 오늘 진짜 세상에는 다양한 사람이 있는 것 같다",
    selectedEmoji: "anger",
    selectedEmotion: "anger:분노한한",
  },
];

// 데이터베이스 초기화
db.on("populate", () => {
  db.data.bulkAdd(dummyData); // bulkAdd로 한 번에 데이터 추가
});

// 데이터베이스 열기
db.open().catch((err) => {
  console.error("Failed to open database:", err);
});



document.addEventListener("DOMContentLoaded", () => {
  const openModalButton = document.getElementById("openModal");
  const closeModalButton = document.querySelector(".close");

  // 화면 크기 조건
  const maxMobileWidth = 393;

  // 모달 열기 버튼 클릭 이벤트
  openModalButton.addEventListener("click", () => {
    if (window.innerWidth <= maxMobileWidth) {
      // 393px 이하일 경우 다른 페이지로 이동
      window.location.href = "../html/diaryStore.html"; // 이동할 HTML 파일 경로
    } else {
      // 393px 초과일 경우 모달에 외부 HTML 삽입
      openModal();
    }
  });

  // 모달 닫기 버튼 클릭 이벤트
  closeModalButton.addEventListener("click", () => {
    closeModal();
  });

  function openModal() {
    const modalOverlay = document.querySelector(".modal-overlay");
    modalOverlay.style.display = "block"; // 모달을 보이게 함
  }

  function closeModal() {
    const modalOverlay = document.querySelector(".modal-overlay");
    modalOverlay.style.display = "none"; // 모달을 숨김
  }
});


// 날짜 정보 설정
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");
const formattedDate = `${year}-${month}-${day}`;
document.getElementById("today-month").textContent = month;
document.getElementById("today-day").textContent = day;

// 이모지 클릭 이벤트 설정
const images = document.querySelectorAll(".emoji");
let selectedEmoji = null;

images.forEach((img) => {
  img.addEventListener("click", () => {
    images.forEach((image) => {
      image.classList.remove("selected");
      image.src = image.dataset.default; // 기본 이미지 복원
    });

    img.classList.add("selected");
    img.src = img.dataset.selected; // 선택된 이미지 변경
    selectedEmoji = img.dataset.value; // 선택된 이모지의 data-value 저장
  });
});

let emotions = [
  "행복한",
  "따분한",
  "혼란한",
  "실망한", // 첫 번째 그룹
  "설레는",
  "무력한",
  "분노한",
  "착잡한", // 두 번째 그룹
  "훈훈한",
  "평범한",
  "경악한",
  "아찔한", // 세 번째 그룹
  "유쾌한",
  "귀찮은",
  "황당한",
  "무서운", // 네 번째 그룹
];

const emoLen = emotions.length;
const values = ["smile", "normal", "anger", "sad"]; // value 배열

function newCheck() {
  let rowDiv; // 현재 행을 담을 변수
  for (let i = 0; i < emoLen; i++) {
    // 4개마다 새로운 row div 생성
    if (i % 4 === 0) {
      rowDiv = document.createElement("div");
      rowDiv.className = "row"; // CSS 클래스 이름 지정 (필요하면 스타일 추가 가능)
      const leftBox = document.getElementsByClassName("emotions")[0];
      leftBox.appendChild(rowDiv);
    }

    const newDiv = document.createElement("div");
    newDiv.className = "item"; // 각 아이템에 클래스 추가 (스타일링 편리)

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = "checkbox" + i;
    input.setAttribute("name", "emotion"); // name 값 추가

    // value 값에 "emotion:감정" 형식으로 값을 설정
    input.setAttribute("value", `${values[i % 4]}:${emotions[i]}`);

    // 데이터 속성 추가 (유형에 따라 색상 구분 가능)
    input.setAttribute("data-emotion-type", values[i % 4]); // smile, anger, normal, sad

    newDiv.appendChild(input);

    const label = document.createElement("label");
    label.innerHTML = emotions[i];
    label.htmlFor = "checkbox" + i;
    newDiv.appendChild(label);

    // 현재 row div에 아이템 추가
    rowDiv.appendChild(newDiv);
  }
}

newCheck();

// 체크박스 단일 선택 로직
const emotionCheckboxes = document.querySelectorAll("input[name='emotion']");
let selectedEmotion = null;

emotionCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    emotionCheckboxes.forEach((otherCheckbox) => {
      if (otherCheckbox !== checkbox) {
        otherCheckbox.checked = false;
      }
    });
    selectedEmotion = checkbox.checked ? checkbox.value : null;
  });
});

// 일기 작성 여부 확인 함수
const btnSave = document.querySelector(".btnSave");
const txtDiary = document.querySelector(".txtDiary");

// async function checkDiaryExists(date) {
//   try {
//     const existingDiary = await db.dailyLogs.where("date").equals(date).first(); // 현재 날짜로 조회
//     if (existingDiary) {
//       alert("이미 오늘 일기를 작성했습니다. 수정하거나 삭제 후 다시 시도해주세요.");
//       btnSave.disabled = true;
//       txtDiary.disabled = true;
//     } else {
//       btnSave.disabled = false;
//       txtDiary.disabled = false;
//     }
//   } catch (err) {
//     console.error("Failed to check diary:", err);
//   }
// }

// 초기 작성 여부 확인
// checkDiaryExists(formattedDate);

// 데이터 저장 버튼 클릭 이벤트
btnSave.addEventListener("click", async () => {
  const diary = document.querySelector(".txtDiary").value;

  if (!selectedEmoji) {
    alert("이모지를 선택해주세요!");
    return;
  } else if (!selectedEmotion) {
    alert("감정을 선택해주세요!");
    return;
  } else if (!diary) {
    alert("내용을 입력해주세요!");
    return;
  }

  try {
    await db.dailyLogs.add({
      date: formattedDate,
      diary,
      selectedEmoji,
      selectedEmotion,
    });
    alert("하루가 성공적으로 저장되었습니다!");
    
    // 저장 후 버튼 및 텍스트 박스 비활성화
    btnSave.disabled = true;
    document.querySelector(".txtDiary").disabled = true;

    // 모달 닫기 (예: 모달 요소에 'hidden' 클래스 추가)
    const modal = document.querySelector(".modal"); // 모달 창 선택
    if (modal) {
      modal.classList.add("hidden"); // 'hidden' 클래스 추가로 닫기
    }
  } catch (err) {
    console.error("Failed to save daily log:", err);
    alert("저장 중 오류가 발생했습니다.");
  }
});