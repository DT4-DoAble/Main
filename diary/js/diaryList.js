// 일기 아이템 목록
let lastDate = new Date(year, month, 0).getDate();

const diaryItemList = document.querySelector(".diary-item-list-area");

let diaryItem;
let thisDate;

for (let num = 1; num <= lastDate; num++) {
  // li diaryItem 만들기
  diaryItem = document.createElement("li");
  diaryItem.classList.add("diary-item");
  diaryItemList.append(diaryItem);

  const diaryItemTitle = document.createElement("h4");
  diaryItemTitle.classList.add("diary-item-title");
  
  const diaryDayNumber = document.createElement("span");
  diaryDayNumber.classList.add("diary-day-number");
  diaryDayNumber.classList.add("text-xl-b");
  
  const diaryDayEmoji = document.createElement("img");
  diaryDayEmoji.classList.add("diary-day-emoji");
  
  const diaryContents = document.createElement("div");
  diaryContents.classList.add("diary-contents");
  
  const diaryTag = document.createElement("span");
  diaryTag.classList.add("tag-s-s");
  
  const diaryText = document.createElement("p");
  diaryText.classList.add("diary-text");
  
  diaryItem.append(diaryItemTitle);
  diaryItem.append(diaryContents);
  diaryItemTitle.append(diaryDayNumber);
  diaryItemTitle.append(diaryDayEmoji);
  diaryContents.append(diaryTag);
  diaryContents.append(diaryText);
  diaryDayNumber.innerText = String(num).padStart(2, "0");

  diaryDayEmoji.src = `../img/emotion-emoji-s-sad.svg`;
  diaryDayEmoji.alt = `Emoji`;

  // 오늘 강조
  if (day == num) {
    diaryDayNumber.style.textDecoration = 'overline';
  }

  // 일요일, 토요일 색상
  let thisDay = new Date(year, month - 1, num).getDay();
  if (thisDay === 0) {
    diaryDayNumber.classList.add("sunday");
  } else if (thisDay === 6) {
    diaryDayNumber.classList.add("saturday");
  }

}

// 
// 