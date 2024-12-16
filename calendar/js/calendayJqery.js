$('document').ready(function () {
  console.log('page loaddinf complete');

  function calendarHTML(date, showDay, showFullDayName, showToday) {
    // 데이터 검증
    if (
      date == undefined ||
      date == null ||
      typeof date != 'object' ||
      !date instanceof Date
    ) {
      return '';
    }
    // 기본값 처리
    if (
      showDay == undefined ||
      showDay == null ||
      typeof showDay != 'boolean'
    ) {
      showDay = true;
    }
    if (
      showFullDayName == undefined ||
      showFullDayName == null ||
      typeof showFullDayName != 'boolean'
    ) {
      showFullDayName = false;
    }
    if (
      showToday == undefined ||
      showToday == null ||
      typeof showToday != 'boolean'
    ) {
      showToday = true;
    }

    // 요일
    var days = ['일', '월', '화', '수', '목', '금', '토'];

    // 달력 연도
    var calendarYear = date.getFullYear();
    // 달력 월
    var calendarMonth = date.getMonth() + 1;
    // 달력 일
    var calendarToday = date.getDate();

    var monthLastDate = new Date(calendarYear, calendarMonth, 0);
    // 달력 월의 마지막 일
    var calendarMonthLastDate = monthLastDate.getDate();

    var monthStartDay = new Date(calendarYear, date.getMonth(), 1);
    // 달력 월의 시작 요일
    var calendarMonthStartDay = monthStartDay.getDay();

    // 주 카운트
    var calendarWeekCount = Math.ceil(
      (calendarMonthStartDay + calendarMonthLastDate) / 7
    );

    // 오늘
    var today = new Date();

    var html = '';
    html += '<table>';
    if (showDay) {
      html += '<thead><tr>';
      for (var index = 0; index < days.length; index++) {
        html += '<th';
        if (index == 0) {
          html += ' class="sunday"';
        } else if (index == 6) {
          html += ' class="saturday"';
        }
        html += '>' + days[index];
        if (showFullDayName) {
          html += '요일';
        }
        html += '</th>';
      }
      html += '</tr></thead>';
    }
    html += '<tbody>';
    // 위치
    var calendarPos = 0;
    // 날짜
    var calendarDay = 0;
    for (var index1 = 0; index1 < calendarWeekCount; index1++) {
      html += '<tr>';
      for (var index2 = 0; index2 < 7; index2++) {
        html += '<td>';
        if (
          calendarMonthStartDay <= calendarPos &&
          calendarDay < calendarMonthLastDate
        ) {
          calendarDay++;
          html += '<span';
          if (
            showToday &&
            calendarYear == today.getFullYear() &&
            calendarMonth == today.getMonth() + 1 &&
            calendarDay == today.getDate()
          ) {
            html += ' class="today"';
          } else {
            if (index2 == 0) {
              html += ' class="sunday"';
            } else if (index2 == 6) {
              html += ' class="saturday"';
            }
          }
          html += '>' + calendarDay + '</span>';
        }
        html += '</td>';
        calendarPos++;
      }
      html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';
    return html;
  }

  function calendar(date) {
    // 년월
    $('.calendar-yearmonth').html(
      date.getFullYear() + '.' + (date.getMonth() + 1)
    );

    var html = calendarHTML(date, true, false, true);
    $('#calendar').html(html);
  }

  var date = new Date();

  calendar(date);

  // 이전 달 이동 버튼 클릭
  $('.calendar-controls > .calendar-prev').on('click', function () {
    var yearmonth = $('.calendar-yearmonth').text().split('.');
    calendar(new Date(parseInt(yearmonth[0]), parseInt(yearmonth[1]) - 2, 1));
  });

  // 다음 달 이동 버튼 클릭
  $('.calendar-controls > .calendar-next').on('click', function () {
    var yearmonth = $('.calendar-yearmonth').text().split('.');
    calendar(new Date(parseInt(yearmonth[0]), parseInt(yearmonth[1]), 1));
  });

  // 오늘 이동 버튼 클릭
  $('.calendar-controls > .calendar-today').on('click', function () {
    calendar(new Date());
  });

  // 날짜 클릭
  $(document).on(
    'click',
    '.calendar table > tbody > tr > td > span',
    function (event) {
      var yearmonth = $('.calendar-yearmonth').text().split('.');
      alert(yearmonth[0] + '.' + yearmonth[1] + '.' + $(event.target).text());
    }
  );
});
