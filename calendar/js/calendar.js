document.addEventListener('DOMContentLoaded', function () {
  console.log('Page loading complete');

  // Dexie 데이터베이스 초기화
  const db = new Dexie('CalendarDatabase');
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
    if (!(date instanceof Date)) return ''; // date 값이 Date 인지 체크 아니면 중지

    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const calendarYear = date.getFullYear();
    const calendarMonth = date.getMonth() + 1;
    const calendarToday = date.getDate();

    const monthLastDate = new Date(calendarYear, calendarMonth, 0).getDate();
    const monthStartDay = new Date(calendarYear, date.getMonth(), 1).getDay();
    const calendarWeekCount = Math.ceil((monthStartDay + monthLastDate) / 7);

    const today = new Date();

    let html = '<table>';
    if (showDay) {
      html += '<thead><tr>';
      days.forEach((day, index) => {
        html += `<th class="${
          index === 0 ? 'sunday' : index === 6 ? 'saturday' : ''
        }">${day}${showFullDayName ? '요일' : ''}</th>`;
      });
      html += '</tr></thead>';
    }

    html += '<tbody>';
    let calendarPos = 0;
    let calendarDay = 0;
    for (let week = 0; week < calendarWeekCount; week++) {
      html += '<tr>';
      for (let day = 0; day < 7; day++) {
        html += `<td id="td-${calendarDay + 1}">`;
        if (monthStartDay <= calendarPos && calendarDay < monthLastDate) {
          calendarDay++;
          html += `<span class="${
            showToday &&
            calendarYear === today.getFullYear() &&
            calendarMonth === today.getMonth() + 1 &&
            calendarDay === today.getDate()
              ? 'today'
              : day === 0
              ? 'sunday'
              : day === 6
              ? 'saturday'
              : ''
          }">${calendarDay}</span>`;
          getDayMemoData(calendarYear, calendarMonth, calendarDay);
        }
        html += '</td>';
        calendarPos++;
      }
      html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';
    return html;
  };

  // 일정 메모 리스트 불러오기
  async function getDayMemoData(calendarYear, calendarMonth, calendarDay) {
    try {
      const calendars = await db.calendars.toArray().then((data) => {
        return data.filter((item) => {
          const startDate = new Date(item.scheduleStartDate);
          return (
            startDate.getFullYear() === calendarYear &&
            startDate.getMonth() + 1 === calendarMonth &&
            startDate.getDate() === calendarDay
          );
        });
      });

      if (calendars.length > 0) {
        calendars.forEach((item) => {
          const memoTag = document.createElement('p');
          memoTag.textContent = `${item.scheduleTitle}`;
          document.querySelector(`#td-${calendarDay}`).append(memoTag);
        });
      }
    } catch (e) {
      console.error('Error fetching data:', e);
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

      calendars.forEach((calendar) => {
        console.log(
          `Title: ${calendar.scheduleTitle}, Start: ${calendar.scheduleStartDate}, End: ${calendar.scheduleEndDate}`
        );
      });

      return calendars;
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }

  // 달력 초기화
  function calendar(date) {
    const yearMonthElement = document.querySelector('.calendarYearMonth');
    const calendarElement = document.querySelector('#calendar');

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
      document.querySelector('.calendarYearMonth').textContent;
    const [year, month] = yearMonthText
      .replace('년 ', '.')
      .replace('월', '')
      .split('.')
      .map(Number);
    calendar(new Date(year, month - 1 + direction, 1));
  }

  // 오늘 버튼 이벤트
  const todayButton = document.querySelector(
    '.calendarControls > .calendarToday'
  );
  if (todayButton) {
    todayButton.addEventListener('click', () => {
      calendar(new Date());
    });
  }

  // 일정 등록 모달 열기
  const modal = document.querySelector('.scheduleModal');
  const modalOverlay = document.createElement('div'); // 모달 오버레이 생성
  modalOverlay.classList.add('modalOverlay');
  document.body.appendChild(modalOverlay);

  // 일정 등록 버튼 클릭 시 모달 표시
  const addScheduleButton = document.querySelector('.addScheduleButton');
  if (addScheduleButton) {
    addScheduleButton.addEventListener('click', () => {
      modal.classList.add('active'); // 모달 활성화
      modalOverlay.classList.add('active'); // 오버레이 활성화
      document.body.style.overflow = 'hidden'; // 스크롤 비활성화
    });
  }

  // 날짜 클릭 시 모달 열기
  document.addEventListener('click', (event) => {
    if (event.target.closest('.calendar table > tbody > tr > td')) {
      const target = event.target.closest('.calendar table > tbody > tr > td');
      const clickedDay = target.querySelector('span')
        ? target.querySelector('span').textContent
        : '';

      // 달력 연도 및 월 가져오기
      const yearMonthText =
        document.querySelector('.calendarYearMonth').textContent;
      // const [year, month] = yearMonthText.split('.').map(Number);
      const [year, month] = yearMonthText
        .replace('년', '')
        .replace('월', '')
        .split(' ')
        .map(Number);
      // console.log(year, month);
      // 월을 0부터 시작하는 인덱스에서 1부터 시작하도록 보정
      const adjustedMonth = month - 1;

      // 값이 잘 나오면 모달 활성화
      if (clickedDay) {
        modal.classList.add('active'); // 모달 활성화
        modalOverlay.classList.add('active'); // 오버레이 활성화
        document.body.style.overflow = 'hidden'; // 스크롤 비활성화

        // 클릭된 날짜 출력
        console.log(`${year}.${month}.${clickedDay}`);
      }
    }
  });

  // 모달 닫기
  const closeButton = document.querySelector('.closeButton');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      modal.classList.remove('active'); // 모달 비활성화
      modalOverlay.classList.remove('active'); // 오버레이 비활성화
      document.body.style.overflow = ''; // 스크롤 다시 활성화
    });
  }

  // 오버레이 클릭 시 모달 닫기
  modalOverlay.addEventListener('click', () => {
    modal.classList.remove('active');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  // 모달 외부 클릭 시 닫기 (옵션)
  window.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
      modal.classList.remove('active');
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // 일정 추가 처리
  let submitButton = document.querySelector('.submitButton');

  submitButton.addEventListener('click', (e) => {
    e.preventDefault();

    // 데이터 INSERT
    let scheduleTitle = document.querySelector('#scheduleTitle').value;
    let scheduleStartDate = document.querySelector('#scheduleStartDate').value;
    let scheduleEndDate = document.querySelector('#scheduleEndDate').value;
    let scheduleRepeat = document.querySelector('#scheduleRepeat').value;

    db.calendars
      .add({
        scheduleTitle: scheduleTitle,
        scheduleStartDate: scheduleStartDate,
        scheduleEndDate: scheduleEndDate,
        scheduleRepeat: scheduleRepeat,
      })
      .then(() => {
        alert(
          `${scheduleTitle} 일정이 ${scheduleStartDate}~${scheduleEndDate} 일정으로 등록되었습니다.`
        );
      })
      .catch((err) => {
        alert('Error: ' + err);
      });
  });

  // 달력 초기화
  const date = new Date();
  calendar(date);

  // 이전/다음 버튼
  const prevButton = document.querySelector(
    '.calendarControls > .calendarPrev'
  );
  prevButton?.addEventListener('click', () => navigateCalendar(-1));

  const nextButton = document.querySelector(
    '.calendarControls > .calendarNext'
  );
  nextButton?.addEventListener('click', () => navigateCalendar(1));
});
