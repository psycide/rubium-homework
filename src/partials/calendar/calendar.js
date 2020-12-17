
const { 
  calendarButtonPrev,
  calendarButtonNext,
  calendarTitle,
  calendarMonth,
  calendarDay,
  calendarDayWithEvent,
  calendarDayCurrent,
  calendarDaySelected,
  calendarWeekDay
 } = {
  calendarButtonPrev: 'calendar__button_prev',
  calendarButtonNext: 'calendar__button_next',
  calendarTitle: 'calendar__title',
  calendarMonth: 'calendar__month',
  calendarDay: 'calendar__day',
  calendarDayWithEvent: 'calendar__day_with-event',
  calendarDayCurrent: 'calendar__day_current',
  calendarDaySelected: 'calendar__day_selected',
  calendarWeekDay: 'calendar__week-day',
 }

class Calendar {
  constructor(node) {

    this._node = node;
    this._titleNode = this._node.querySelector(`.${calendarTitle}`);
    this._date = new Date();
    this._cachedMonths = new Map();
    this._cachedDayNodes = new Map();
    this._cachedEmptyDayNodes = new Map();
    this._selectedDay = null;
    this._monthNode = this._node.querySelector(`.${calendarMonth}`);
    this._prevButton = this._node.querySelector(`.${calendarButtonPrev}`);
    this._nextButton = this._node.querySelector(`.${calendarButtonNext}`);


    this.fillCalendar();
    this.addDateSwitch();

    this._monthNode.addEventListener('click', this._daySelectorHandler.bind(this))

  }

  //делаем запрос на сервер и кешируем его
  _getMonth(date) { 

    let firstDayOfMonth = new Date(date);
    firstDayOfMonth.setDate(1);

    let lastDayOfMonth = new Date(date);
    lastDayOfMonth.setDate(Calendar.daysInMonth(lastDayOfMonth));
    
    let key = Calendar.getMonthAndYear(firstDayOfMonth);

    if (!this._cachedMonths.has(key)) {

      let response = getDaysFromServer(firstDayOfMonth, lastDayOfMonth);
      this._cachedMonths.set(key, response)
    }

    this._currentDays = this._cachedMonths.get(key);

  }

  //после того как данные будут получены с сервера здесь нужно дням с событиями назначить класс
  _setDaysWithEvents() {
      
  }

  _setCalendarTitleText() {
    let calendarTitleText = capitalize(this._date.toLocaleDateString("ru-RU", { month: "long" })) +
      " " +
      this._date.toLocaleDateString("ru-RU", { year: "numeric" });

    this._titleNode.innerText = calendarTitleText;
  }

  // добавляем дни в DOM
  _addDays() {  

    let key = Calendar.getMonthAndYear(this._date);

    if (!this._cachedDayNodes.has(key)) { // если для текущего месяца не было создано элементов, то создаем и кешируем
      let days = []
      let currentDay = (new Date(this._date).getMonth() == new Date().getMonth()) ? this._date.getDate(): null;

      for (let i = 1; i <= Calendar.daysInMonth(this._date); i++) {

        let day = document.createElement("button");

        day.classList.add(calendarDay);

        if (this._currentDays[i - 1].haveEvent) {
          day.classList.add(calendarDayWithEvent);
        }

        if (i == currentDay) {
          day.classList.add(calendarDayCurrent);
        }

        day.innerText = i;

        days.push(day);
      }

      this._cachedDayNodes.set(key, days);
    }

    this._cachedDayNodes.get(key).forEach((item) => {
      this._monthNode.append(item);
    })
    
  }

  // добавляем в DOM пустые элементы чтобы дни месяца соответсвовали дням недели
  _addEmptyDays() { 

    let key = Calendar.getMonthAndYear(this._date);

    let cache = this._cachedEmptyDayNodes;

    if (!this._cachedEmptyDayNodes.has(key)) { // если для текущего месяца нет пустых элементов, то создаем и кешируем

      let firstDay = new Date(this._date);
      firstDay.setDate(1);

      let emptyDays = [];

      for (let i = 1; i < Calendar.getLocalDay(firstDay); i++) {

        let day = document.createElement("p");

        day.className = "calendar__day";

        emptyDays.push(day);

      }

      this._cachedEmptyDayNodes.set(key, emptyDays);
      
    }

    this._cachedEmptyDayNodes.get(key).forEach((item) => {
      this._monthNode.append(item);
    })
    
  }

  // удаляем из DOM все кроме названия дней недели
  _removeDays() { 

    let nodesToDelete = [];

    this._monthNode.childNodes.forEach((item) => {

      if (!item.classList.contains(calendarWeekDay)) {
        nodesToDelete.push(item);
      }

    });

    nodesToDelete.forEach((item) => item.remove());

  }

  // если элемент с событием, то назначаем ему класс
  _daySelectorHandler(event) { 

    if (!event.target.classList.contains(calendarDayWithEvent)) {return}

    if (event.target != this._selectedDay && this._selectedDay != null) {this._selectedDay.classList.remove(calendarDaySelected)}

    this._selectedDay = event.target;
    event.target.classList.add(calendarDaySelected);

    // здесь нужно сделать запрос на сервер и обновить элементы event

  }

  fillCalendar() {
    this._getMonth(this._date);
    this._setCalendarTitleText();
    this._addEmptyDays();
    this._addDays();
    this._setDaysWithEvents()

  }

  addDateSwitch() { 
    this._prevButton.addEventListener('click', () => {
      this._date.setDate(0);
      this._setDaysWithEvents(this._date);
      this._removeDays();
      this.fillCalendar();
    });

    this._nextButton.addEventListener('click', () => {
      this._date.setDate(Calendar.daysInMonth(this._date) + 1);
      this._setDaysWithEvents(this._date);
      this._removeDays();
      this.fillCalendar();
    })
  }

  static daysInMonth(date) {
    return 33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate();
  }

  static getLocalDay(date) {

    let day = date.getDay();

    if (day == 0) {
      day = 7;
    }

    return day;

  }

  static getMonthAndYear(date) {
    let dateString = date.toDateString().split(' ');
    return `${dateString[1]} ${dateString[3]}`
  }

}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

//
function getDaysFromServer(from, to) {
  let days = [];
  for (let i = 1; i <= Calendar.daysInMonth(from); i++) {
    let day = new Date(from);
    day.setDate(i);
    days.push({
      date: new Date(day),
      haveEvent: false,
    })
  }
  days[Math.round(Math.random() * (days.length - 1))].haveEvent = true;
  days[Math.round(Math.random() * (days.length - 1))].haveEvent = true;
  days[Math.round(Math.random() * (days.length - 1))].haveEvent = true;
  days[Math.round(Math.random() * (days.length - 1))].haveEvent = true;
  return days;
}


let calendar = new Calendar(document.querySelector('.calendar'))