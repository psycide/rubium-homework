
const { 
  calendarButtonPrev,
  calendarButtonNext,
  calendarTitle,
  calendarMonth,
  calendarDay,
  calendarDayWithEvent,
  calendarDayCurrent,
  calendarDaySelected,
  calendarWeekDay,
  eventsContainer,
  eventsItem,
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
  eventsContainer: 'events__container',
  eventsItem: 'events__item',
 }

class Calendar {
  constructor(node) {

    this._node = node;
    this._titleNode = this._node.querySelector(`.${calendarTitle}`);
    this._date = new Date();
    this._cachedEvents = new Map();
    this._cachedDayNodes = new Map();
    this._cachedEmptyDayNodes = new Map();
    this._cachedEventNodes = new Map()
    this._currentEvents = null;
    this._selectedDay = null;
    this._monthNode = this._node.querySelector(`.${calendarMonth}`);
    this._prevButton = this._node.querySelector(`.${calendarButtonPrev}`);
    this._nextButton = this._node.querySelector(`.${calendarButtonNext}`);
    this._eventsNode = document.querySelector(`.${eventsContainer}`);


    this.fillCalendar();
    this._showNearestEvents();

    this._node.addEventListener('click', this._calendarEventHandler.bind(this))

  }

  //делаем запрос на сервер и кешируем его
  _getMonth(date) { 

    let firstDayOfMonth = new Date(date);
    firstDayOfMonth.setDate(1);

    let lastDayOfMonth = new Date(date);
    lastDayOfMonth.setDate(Calendar.daysInMonth(lastDayOfMonth));
    
    let key = Calendar.getMonthAndYear(firstDayOfMonth);

    if (!this._cachedEvents.has(key)) {

      let response = getEventsFromServer(firstDayOfMonth, lastDayOfMonth);
      this._cachedEvents.set(key, response)
    }

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
      let events = this._cachedEvents.get(key).filter((item) =>{
        if(item.date.getFullYear() == this._date.getFullYear()
          && item.date.getMonth() == this._date.getMonth()) {return true}
      });

      for (let i = 1; i <= Calendar.daysInMonth(this._date); i++) {

        let day = document.createElement("button");

        day.classList.add(calendarDay);

        if (events.find((item) => item.date.getDate() == i)) {
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

  
  _calendarEventHandler(event) { 

    // обрабатывем клики на датах с событиями
    if (event.target.classList.contains(calendarDayWithEvent)) {

      if (event.target != this._selectedDay && this._selectedDay != null) {this._selectedDay.classList.remove(calendarDaySelected)}

      this._selectedDay = event.target;
      event.target.classList.add(calendarDaySelected);

      let date = new Date(this._date)
      date.setDate(+event.target.innerText)
      this.showEvents(date)

    }

    // листаем месяцы
    if (event.target.classList.contains(calendarButtonPrev)
    || event.target.parentElement.classList.contains(calendarButtonPrev)) {

      this._date.setDate(0);
      this._setDaysWithEvents(this._date);
      this._removeDays();
      this.fillCalendar();

    }

    if (event.target.classList.contains(calendarButtonNext)
    || event.target.parentElement.classList.contains(calendarButtonNext)) {

      this._date.setDate(Calendar.daysInMonth(this._date) + 1);
      this._setDaysWithEvents(this._date);
      this._removeDays();
      this.fillCalendar();

    }

  }



  fillCalendar() {
    this._getMonth(this._date);
    this._setCalendarTitleText();
    this._addEmptyDays();
    this._addDays();
    this._setDaysWithEvents()

  }

  _showNearestEvents() {
    // показывает близжайшие события, например при загрузке страницы
  }


  // создает и возвращает узел из события
  _createEventNode(event) {

    let eventNode = document.createElement('div');

    eventNode.classList.add('event', 'events__item');

    eventNode.innerHTML = `
    <div class="event__dates">
      <span class="event__time">
        ${event.date.getHours() + ':' + event.date.getMinutes()} 
      </span>
      <span class="event__date">
        ${event.date.getDate()} ${capitalize(this._date.toLocaleDateString("ru-RU", { month: "long" }))}
      </span>
    </div>
    <h3 class="event__title">${event.title}</h3>
    <p class="event__text">
      ${event.text}
    </p>
    <div class="event__stat">
        <div class="views event__views"><img class="views__icon" src="./src/svg/icon-eye.svg">
            <p class="views__count">275</p>
        </div>
        <div class="comments event__comments"><img class="comments__icon" src="./src/svg/icon-comments.svg">
            <p class="comments__count">15</p>
        </div>
    </div>`;

    if (event.background) {

      let background = document.createElement('img');

      background.setAttribute('src', event.background);
      background.setAttribute('alt', 'event-bg');
      background.classList.add('event__bg-img');
      eventNode.classList.add('events__item_img')
      eventNode.prepend(background);

    }

    return eventNode

    }

  // показывает и кеширует события для даты date
  showEvents(date) {

    let key = Calendar.getDayMonthYear(date);

    if (!this._cachedEventNodes.has(key)) {
      
      let events = this._cachedEvents.get(Calendar.getMonthAndYear(this._date))
      .filter((item) => item.date.getDate() == date.getDate());

      let eventNodes = [];

      events.forEach((item) => eventNodes.push(this._createEventNode(item)));
      this._cachedEventNodes.set(key, eventNodes);  
    }

    if (this._currentEvents) this._currentEvents.forEach((item) => item.remove());

    this._currentEvents = this._cachedEventNodes.get(key);
    this._currentEvents.forEach((item) => this._eventsNode.prepend(item));
  }

  static getDayMonthYear(date) {
    return `${date.getDate()} ${date.getMonth()} ${date.getFullYear()}`
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


// function getDaysFromServer(from, to) {
//   let days = [];
//   for (let i = 1; i <= Calendar.daysInMonth(from); i++) {
//     let day = new Date(from);
//     day.setDate(i);
//     days.push({
//       date: new Date(day),
//       haveEvent: false,
//     })
//   }
//   days[Math.round(Math.random() * (days.length - 1))].haveEvent = true;
//   days[Math.round(Math.random() * (days.length - 1))].haveEvent = true;
//   days[Math.round(Math.random() * (days.length - 1))].haveEvent = true;
//   days[Math.round(Math.random() * (days.length - 1))].haveEvent = true;
//   return days;
// }

function getEventsFromServer(from, to) {
  let events = [];
  for (let i = 0; i < 10; i++) {
    let date = new Date(from);
    date.setDate(Math.ceil(Math.random() * Calendar.daysInMonth(from)));
    events.push({
      date: new Date(date),
      title: 'Детский мастер-класс',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
      background: '',
   });
    events.push({
      date: new Date(date),
      title: 'Джазовый концерт',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
      background: './src/img/placeholder.png',
  });
  }
  return events
}


let calendar = new Calendar(document.querySelector('.calendar'))