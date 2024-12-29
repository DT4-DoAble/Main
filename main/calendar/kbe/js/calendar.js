document.addEventListener("DOMContentLoaded", function () {
  console.log("Page loading complete");

  // Dexie 데이터베이스 초기화
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
          getDayMemoData(calendarYear, calendarMonth, calendarDay);
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

  // 일정 메모 리스트 불러오기
  async function getDayMemoData(calendarYear, calendarMonth, calendarDay) {
    // console.log(calendarYear, calendarMonth, calendarDay);
    try {
      const calendars = await db.calendars.toArray().then((data) => {
        // console.log(data);
        return data.filter((item) => {
          const startDate = new Date(item.scheduleStartDate);
          // const privateId = item.id;
          // console.log(privateId);
          return (
            startDate.getFullYear() === calendarYear &&
            startDate.getMonth() + 1 === calendarMonth &&
            startDate.getDate() === calendarDay
          );
        });
      });
      // console.log('calendars', calendars);

      if (calendars.length > 0) {
        calendars.forEach((item) => {
          console.log(item);
          const memoTag = document.createElement("p");
          memoTag.textContent = `${item.scheduleTitle}`;
          memoTag.setAttribute("data-idx", `${item.id}`);
          memoTag.setAttribute("class", `memoList todo-item todo-item-mt`);
          document.querySelector(`#td-${calendarDay}`).append(memoTag);
        });
      }
    } catch (e) {
      console.error("Error fetching data:", e);
    }
  }

  // 월별 데이터 불러오기
  async function getMonthData(year, month) {
    try {
      const calendars = await db.calendars.toArray().then((data) => {
        return data.filter((item) => {
          const startDate = new Date(item.scheduleStartDate);
          return (
            startDate.getFullYear() === year &&
            startDate.getMonth() + 1 === month
          );
        });
      });
      // console.log('일정 유무 체크', calendars.length);
      if (calendars.length <= 0) {
        try {
          const dummyData = await db.calendars.toArray().then((data) => {
            return data.some((item) => item.scheduleTitle !== ""); // 빈 데이터가 아니면, 즉 일정이 존재하면
          });
          // 자료가 없을떄는 더미 자료를 넣는다.
          if (!dummyData) {
            // 반복되는 날짜에 맞는 일정 추가
            await db.calendars.add({
              scheduleTitle: "새싹 교육",
              scheduleStartDate: "2024-12-20T10:00:00.000Z",
              scheduleEndDate: "2024-12-20T18:00:00.000Z",
              scheduleRepeat: "",
            });

            await db.calendars.add({
              scheduleTitle: "새싹 프로젝트 (디자인 작업)",
              scheduleStartDate: "2024-12-07T10:00:00.000Z",
              scheduleEndDate: "2024-12-07T18:00:00.000Z",
              scheduleRepeat: "",
            });

            await db.calendars.add({
              scheduleTitle: "점심 약속",
              scheduleStartDate: "2024-12-14T12:30:00.000Z",
              scheduleEndDate: "2024-12-14T14:00:00.000Z",
              scheduleRepeat: "",
            });

            await db.calendars.add({
              scheduleTitle: "코딩 연습",
              scheduleStartDate: "2024-12-21T18:00:00.000Z",
              scheduleEndDate: "2024-12-21T19:00:00.000Z",
              scheduleRepeat: "",
            });
            await db.calendars.add({
              scheduleTitle: "한판 어떄",
              scheduleStartDate: "2024-12-28T19:14:00.000Z",
              scheduleEndDate: "2024-12-28T22:00:00.000Z",
              scheduleRepeat: "",
            });
          }
        } catch (error) {
          console.error("Error adding event:", error);
        }
      } else {
        // 결과값 찎기
        calendars.forEach((calendar) => {
          console.log(
            `Title: ${calendar.scheduleTitle}, Start: ${calendar.scheduleStartDate}, End: ${calendar.scheduleEndDate}`
          );
        });
      }

      return calendars;
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }

  // 달력 초기화
  function calendar(date) {
    const yearMonthElement = document.querySelector(".calendarYearMonth");
    const calendarElement = document.querySelector("#calendar");

    if (yearMonthElement) {
      yearMonthElement.textContent = formatYearMonth(
        date.getFullYear(),
        date.getMonth() + 1
      );
    }

    const html = calendarHTML(date, true, false, true);
    if (calendarElement) {
      calendarElement.innerHTML = html;
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

  // 일정 등록 모달 열기
  const modal = document.querySelector(".scheduleModal");
  const modalOverlay = document.createElement("div"); // 모달 오버레이 생성
  modalOverlay.classList.add("modalOverlay");
  modalOverlay.classList.add("bg-blur");
  document.body.appendChild(modalOverlay);

  // 일정 등록 버튼 클릭 시 모달 표시
  const addScheduleButton = document.querySelector(".addScheduleButton");
  if (addScheduleButton) {
    addScheduleButton.addEventListener("click", () => {
      modal.classList.add("active"); // 모달 활성화
      modalOverlay.classList.add("active"); // 오버레이 활성화
      document.body.style.overflow = "hidden"; // 스크롤 비활성화

      // 현재 날짜를 가져오기 (한국 시간 기준)
      const now = new Date();

      // console.log(now);
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // 0-based, 그래서 1 더해줌
      const currentDay = now.getDate();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      // 'YYYY-MM-DDTHH:mm' 형식으로 변환
      const startDateTime = `${currentYear}-${currentMonth
        .toString()
        .padStart(2, "0")}-${currentDay
        .toString()
        .padStart(2, "0")}T${currentHours
        .toString()
        .padStart(2, "0")}:${currentMinutes.toString().padStart(2, "0")}`;

      // 시작일과 종료일에 오늘 날짜를 자동으로 입력
      document.querySelector(`#scheduleStartDate`).value = startDateTime;
      document.querySelector(`#scheduleEndDate`).value = startDateTime;
    });
  }

  // (() => {
  //   const currMemoList = await db.calendars
  //   .where('scheduleStartDate')
  //   .between(startOfDay, endOfDay) // 해당 날짜 범위로 조건 설정
  //   .toArray();

  //   console.log(currMemoList)
  // })();

  // 날짜 클릭 시 모달 열기
  const calendarDayClick = document.querySelector(".calendar"); // .calendar 요소 선택
  const calendarTdSelector = ".calendar table > tbody > tr > td";
  const memoListSelector = ".memoList"; // 일정 내용이 있는 <p> 태그 선택

  calendarDayClick.addEventListener("click", async (event) => {
    modal.classList.add("active"); // 모달 활성화
    modalOverlay.classList.add("active"); // 오버레이 활성화
    document.body.style.overflow = "hidden"; // 스크롤 비활성화

    // console.log(event.target);

    if (event.target.closest(calendarTdSelector)) {
      const target = event.target.closest(".calendar table > tbody > tr > td");
      const clickedDay = target.querySelector("span")
        ? parseInt(target.querySelector("span").textContent)
        : "";

      // 달력 연도 및 월 가져오기
      const yearMonthText =
        document.querySelector(".calendarYearMonth").textContent;
      // const [year, month] = yearMonthText.split('.').map(Number);
      const [year, month] = yearMonthText
        .replace("년", "")
        .replace("월", "")
        .split(" ")
        .map(Number);
      console.log(year, month, clickedDay);
      // 월을 0부터 시작하는 인덱스에서 1부터 시작하도록 보정

      // 값이 잘 나오면 모달 활성화
      if (clickedDay) {
        // 현재 시간을 가져오기 (UTC)
        const now = new Date();
        // 대한민국 시간으로 9시간을 더함
        const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);
        const currentHours = koreaTime.getHours();
        const currentMinutes = koreaTime.getMinutes();

        // 시작일에 데이터 클릭한 일자 데이터 넣기
        const startDate = new Date(
          year,
          month - 1,
          clickedDay + 1,
          currentHours,
          currentMinutes
        );

        // 시간을 포함하여 format 'YYYY-MM-DDTHH:mm'으로 변환
        const startDateTime = startDate.toISOString().slice(0, 16);
        // 시작일을 `scheduleStartDate`에 설정
        document.querySelector(`#scheduleStartDate`).value = startDateTime;
        document.querySelector(`#scheduleEndDate`).value = startDateTime;
      }
    }

    // p 태그 클릭 처리 (일정 내용 보기)
    if (event.target.closest(memoListSelector)) {
      const target = event.target.closest(memoListSelector);
      const memoId = parseInt(target.dataset.idx);
      console.log(typeof memoId);
      const currMemoLists = await db.calendars
        .where("id")
        .equals(memoId)
        .toArray();

      // 등록 버튼 수정으로 변경 data-idx 추가
      document.querySelector(".submitButton").textContent = "수정";
      document.querySelector(".bs-title").textContent = "일정 상세";
      document
        .querySelector(".submitButton")
        .setAttribute("data-idx", `${memoId}`);
      // document.querySelector(".submitButton").style.backgroundColor = "blue";

      deleteButtonButton.setAttribute("data-idx", `${memoId}`);

      deleteButtonButton.style.display = "flex"; // 삭제 버튼 생성
      deleteButtonButton.classList.add("button");
      deleteButtonButton.classList.add("text-m-b");
      deleteButtonButton.classList.add("bs-t-f");
      deleteButtonButton.classList.add("bs-s-xl");
      deleteButtonButton.classList.add("bs-c-bk");
      // deleteButtonButton.style.backgroundColor = "#333"; // 삭제 버튼 색상
      // deleteButtonButton.style.color = "#fff"; // 삭제 버튼 색상

      currMemoLists.forEach(function (currMemoList) {
        // 일정 제목 업데이트
        document.querySelector(`#scheduleTitle`).value =
          currMemoList.scheduleTitle;
        // 일정 시작일 업데이트
        document.querySelector(`#scheduleStartDate`).value =
          currMemoList.scheduleStartDate.slice(0, 16);
        // 일정 종료일 업데이트
        document.querySelector(`#scheduleEndDate`).value =
          currMemoList.scheduleEndDate.slice(0, 16);
        // 일정 반복유무 checked 업데이트
        let scheduleRepeat = document.querySelector(
          "select[name=scheduleRepeat]"
        ).options;
        for (let i = 0; i < scheduleRepeat.length; i++) {
          if (scheduleRepeat[i].value == currMemoList.scheduleRepeat)
            scheduleRepeat[i].selected = true;
        }

        // 일정 반복유무 유무에 따라 종료일 활성/비활성
        if (currMemoList.scheduleRepeat === "") {
          // console.log(currMemoList.scheduleRepeat === '');
          scheduleEndDateInput.disabled = true; // 종료일 비활성화
        } else {
          scheduleEndDateInput.disabled = false; // 종료일 비활성화
        }
      });
    }
  });

  const scheduleRepeatSelect = document.querySelector("#scheduleRepeat");
  const scheduleEndDateInput = document.querySelector("#scheduleEndDate");
  const deleteButtonButton = document.querySelector(".deleteButton");
  deleteButtonButton.style.display = "none"; // 삭제 버튼 삭제

  deleteButtonButton.addEventListener("click", async function (e) {
    if (confirm("반복 일정입니다. 반복된 일정을 모두 삭제를 하시겠습니까?")) {
      alert("현재 개발중 입니다. 기다려 주세요.");
    } else {
      // console.log('삭제 버튼');
      const memoId = parseInt(e.target.dataset.idx);
      // console.log(memoId, '삭제 버튼');

      const deleteMemoLists = await db.calendars
        .where("id")
        .equals(memoId)
        .delete()
        .then(function (deleteCount) {
          // console.log('Deleted ' + deleteCount + ' objects');
        });

      // 모달 닫기 및 페이지 리프레시
      document.querySelector(".scheduleModal").classList.remove("active");
      document.querySelector(".modalOverlay").classList.remove("active");
      document.body.style.overflow = ""; // 스크롤 다시 활성화
    }

    // 입력 값 초기화
    document.querySelector("#scheduleTitle").value = "";
    document.querySelector("#scheduleStartDate").value = "";
    document.querySelector("#scheduleEndDate").value = "";
    document.querySelector("#scheduleRepeat").value = "";
    window.location.reload(); // 페이지 리프레시
  });

  // 초기 상태 설정: '사용하지 않음'이 기본값이므로 종료일 비활성화
  if (scheduleRepeatSelect.value === "") {
    scheduleEndDateInput.disabled = true; // 종료일 비활성화
  }

  // 반복유무 변경 시 종료일 활성화/비활성화 처리
  scheduleRepeatSelect.addEventListener("change", function () {
    if (scheduleRepeatSelect.value === "") {
      scheduleEndDateInput.disabled = true; // 종료일 비활성화
    } else {
      scheduleEndDateInput.disabled = false; // 종료일 활성화
    }
  });

  // 모달 닫기
  const closeButton = document.querySelector(".closeButton");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      modal.classList.remove("active"); // 모달 비활성화
      modalOverlay.classList.remove("active"); // 오버레이 비활성화
      document.body.style.overflow = ""; // 스크롤 다시 활성화

      // input, select 초기화
      document.querySelector("#scheduleTitle").value = "";
      document.querySelector("#scheduleStartDate").value = "";
      document.querySelector("#scheduleEndDate").value = "";
      document.querySelector("#scheduleRepeat").value = "";
    });
  }

  // 오버레이 클릭 시 모달 닫기
  modalOverlay.addEventListener("click", () => {
    // 모달 닫기
    modal.classList.remove("active");
    modalOverlay.classList.remove("active");
    document.body.style.overflow = ""; // 스크롤 활성화

    // input, select 초기화
    document.querySelector("#scheduleTitle").value = "";
    document.querySelector("#scheduleStartDate").value = "";
    document.querySelector("#scheduleEndDate").value = "";
    document.querySelector("#scheduleRepeat").value = "";
  });

  // 모달 외부 클릭 시 닫기 (옵션)
  window.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      // 모달 닫기
      modal.classList.remove("active");
      modalOverlay.classList.remove("active");
      document.body.style.overflow = ""; // 스크롤 활성화

      // input, select 초기화
      document.querySelector("#scheduleTitle").value = "";
      document.querySelector("#scheduleStartDate").value = "";
      document.querySelector("#scheduleEndDate").value = "";
      document.querySelector("#scheduleRepeat").value = "";
    }
  });

  // 일정 추가 처리
  let submitButton = document.querySelector(".submitButton");
  submitButton.addEventListener("click", async (e) => {
    e.preventDefault();
    if (confirm("반복 일정입니다. 반복된 일정을 모두 수정를 하시겠습니까?")) {
      alert("현재 개발중 입니다. 기다려 주세요.");
    } else {
      // 입력 데이터 가져오기
      const scheduleTitle = document.querySelector("#scheduleTitle").value;
      const scheduleStartDate =
        document.querySelector("#scheduleStartDate").value;
      const scheduleEndDate = document.querySelector("#scheduleEndDate").value;
      const scheduleRepeat = document.querySelector("#scheduleRepeat").value;

      // 시작일과 종료일을 Date 객체로 변환 (입력된 날짜가 로컬 시간)
      const startDate = new Date(scheduleStartDate);
      const endDate = new Date(scheduleEndDate);

      // 반복 요일 파싱 (예: "0,1,2" -> [0, 1, 2])
      const repeatDays = scheduleRepeat
        ? scheduleRepeat.split(",").map(Number)
        : [];

      let currentDate = new Date(startDate);

      const memoId = parseInt(e.target.dataset.idx);
      // console.log(memoId);

      if (memoId) {
        // edit - 아 문제여

        const deleteMemoLists = await db.calendars
          .update(memoId, {
            scheduleTitle: scheduleTitle,
            scheduleStartDate: startDate.toISOString(), // 이 값은 UTC로 저장
            scheduleEndDate: endDate.toISOString(), // 이 값은 UTC로 저장
            scheduleRepeat: scheduleRepeat,
          })
          .then(function (updated) {
            if (updated) console.log(updated);
          });
      } else {
        // 등록페이지
        // 반복되는 날짜 계산
        if (repeatDays.length === 0) {
          // 반복유무가 "사용하지 않음"일 경우
          try {
            // 단 한번의 일정 등록
            await db.calendars.add({
              scheduleTitle: scheduleTitle,
              scheduleStartDate: startDate.toISOString(), // 이 값은 UTC로 저장
              scheduleEndDate: endDate.toISOString(), // 이 값은 UTC로 저장
              scheduleRepeat: scheduleRepeat,
            });
            alert(`${scheduleTitle} 일정이 등록되었습니다.`);
          } catch (error) {
            console.error("Error adding event:", error);
          }
        } else {
          // 반복 설정이 있는 경우
          while (currentDate <= endDate) {
            // 현재 날짜의 요일을 구함
            const currentDay = currentDate.getDay();

            // 반복 요일 목록에 현재 요일이 포함되어 있다면
            if (repeatDays.includes(currentDay)) {
              try {
                // 반복되는 날짜에 맞는 일정 추가
                await db.calendars.add({
                  scheduleTitle: scheduleTitle,
                  scheduleStartDate: currentDate.toISOString(), // 이 값은 UTC로 저장
                  scheduleEndDate: currentDate.toISOString(), // 이 값은 UTC로 저장
                  scheduleRepeat: scheduleRepeat,
                });
              } catch (error) {
                console.error("Error adding event:", error);
              }
            }

            // 하루를 더함 (다음 날짜로 이동)
            currentDate.setDate(currentDate.getDate() + 1);
          }

          alert(`${scheduleTitle} 일정이 반복되어 등록되었습니다.`);
        }
      }
    }
    // 모달 닫기 및 페이지 리프레시
    document.querySelector(".scheduleModal").classList.remove("active");
    document.querySelector(".modalOverlay").classList.remove("active");
    document.body.style.overflow = ""; // 스크롤 다시 활성화

    // 입력 값 초기화
    document.querySelector("#scheduleTitle").value = "";
    document.querySelector("#scheduleStartDate").value = "";
    document.querySelector("#scheduleEndDate").value = "";
    document.querySelector("#scheduleRepeat").value = "";
    window.location.reload(); // 페이지 리프레시
  });

  // 달력 초기화
  const date = new Date();
  calendar(date);

  // 이전/다음 버튼
  const prevButton = document.querySelector(
    ".calendarControls > .calendarPrev"
  );
  prevButton?.addEventListener("click", () => navigateCalendar(-1));

  const nextButton = document.querySelector(
    ".calendarControls > .calendarNext"
  );
  nextButton?.addEventListener("click", () => navigateCalendar(1));
});
