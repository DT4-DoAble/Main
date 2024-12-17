document.addEventListener('DOMContentLoaded', function (e) {
  console.log('Page loading complete');

  function formatYearMonth(year, month) {
    return `${year}년 ${month}월`;
  }

  const calendarHTML = function calendarHTML(
    date,
    showDay,
    showFullDayName,
    showToday
  ) {
    if (!(date instanceof Date)) {
      // date 값이 Date 인지 체크 아니면 중지
      return '';
    }
    showDay = showDay !== undefined ? showDay : true;
    showFullDayName = showFullDayName !== undefined ? showFullDayName : false;
    showToday = showToday !== undefined ? showToday : true;

    const days = ['일', '월', '화', '수', '목', '금', '토'];

    const calendarYear = date.getFullYear();
    const calendarMonth = date.getMonth() + 1;
    const calendarToday = date.getDate();

    const monthLastDate = new Date(calendarYear, calendarMonth, 0);
    const calendarMonthLastDate = monthLastDate.getDate();

    const monthStartDay = new Date(calendarYear, date.getMonth(), 1);
    const calendarMonthStartDay = monthStartDay.getDay();

    const calendarWeekCount = Math.ceil(
      (calendarMonthStartDay + calendarMonthLastDate) / 7
    );

    const today = new Date();

    let html = '<table>';
    if (showDay) {
      html += '<thead><tr>';
      for (let index = 0; index < days.length; index++) {
        html += `<th class="${
          index === 0 ? 'sunday' : index === 6 ? 'saturday' : ''
        }">`;
        html += days[index];
        if (showFullDayName) {
          html += '요일';
        }
        html += '</th>';
      }
      html += '</tr></thead>';
    }

    html += '<tbody>';
    let calendarPos = 0;
    let calendarDay = 0;
    for (let week = 0; week < calendarWeekCount; week++) {
      html += '<tr>';
      for (let day = 0; day < 7; day++) {
        html += '<td>';
        if (
          calendarMonthStartDay <= calendarPos &&
          calendarDay < calendarMonthLastDate
        ) {
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
  }

  // 갤린더 시작
  const date = new Date();
  calendar(date);

  const prevButton = document.querySelector(
    '.calendarControls > .calendarPrev'
  );
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      const yearMonthText =
        document.querySelector('.calendarYearMonth').textContent;
      const [year, month] = yearMonthText
        .replace('년 ', '.')
        .replace('월', '')
        .split('.')
        .map(Number);
      calendar(new Date(year, month - 2, 1));
    });
  }

  const nextButton = document.querySelector(
    '.calendarControls > .calendarNext'
  );
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const yearMonthText =
        document.querySelector('.calendarYearMonth').textContent;
      const [year, month] = yearMonthText
        .replace('년 ', '.')
        .replace('월', '')
        .split('.')
        .map(Number);
      calendar(new Date(year, month, 1));
    });
  }

  const todayButton = document.querySelector(
    '.calendarControls > .calendarToday'
  );
  if (todayButton) {
    todayButton.addEventListener('click', () => {
      calendar(new Date());
    });
  }

  // 일정등록 버튼 클릭시
  document.addEventListener('click', (event) => {
    if (event.target.closest('.calendar table > tbody > tr > td > span')) {
      const target = event.target;
      const yearMonthText =
        document.querySelector('.calendarYearMonth').textContent;
      const [year, month] = yearMonthText.split('.').map(Number);

      modal.classList.add('active'); // 모달 활성화
      modalOverlay.classList.add('active'); // 오버레이 활성화
      document.body.style.overflow = 'hidden'; // 스크롤 비활성화

      console.log(`${year}.${month}.${target.textContent}`);
    }
  });

  /* S : 일정등록 버튼 */
  const addScheduleButton = document.querySelector('.addScheduleButton');
  /* E : 일정등록 버튼 */

  /* S : 일정등록 모당찰 */
  const modal = document.querySelector('.scheduleModal');

  const modalOverlay = document.createElement('div'); // 모달 오버레이 생성
  modalOverlay.classList.add('modalOverlay');
  document.body.appendChild(modalOverlay);

  const closeButton = document.querySelector('.closeButton');

  // 일정 등록 버튼 클릭 시 모달 표시
  addScheduleButton.addEventListener('click', () => {
    modal.classList.add('active'); // 모달 활성화
    modalOverlay.classList.add('active'); // 오버레이 활성화
    document.body.style.overflow = 'hidden'; // 스크롤 비활성화
  });

  // 닫기 버튼 클릭 시 모달 숨기기
  closeButton.addEventListener('click', () => {
    modal.classList.remove('active'); // 모달 비활성화
    modalOverlay.classList.remove('active'); // 오버레이 비활성화
    document.body.style.overflow = ''; // 스크롤 다시 활성화
  });

  // 오버레이 클릭 시 모달 닫기
  modalOverlay.addEventListener('click', () => {
    modal.classList.remove('active');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  // 모달 외부 클릭 시 닫기 (옵션)
  window.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
      // overlay 클릭시만 닫히도록
      modal.classList.remove('active');
      modalOverlay.classList.remove('active');
    }
  });
  /* E : 일정등록 모당찰 */

  function adjustCalendarHeight() {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const main = document.querySelector('main');

    const headerHeight = header.offsetHeight;
    const footerHeight = footer.offsetHeight;
    const windowHeight = window.innerHeight;

    const calendarHeight = windowHeight - headerHeight - footerHeight;
    // console.log(calendarHeight);
    main.style.height = calendarHeight + 'px';
  }

  // 초기 실행 및 창 크기 변경 시 반응
  window.addEventListener('DOMContentLoaded', adjustCalendarHeight);
  window.addEventListener('resize', adjustCalendarHeight);
});
