String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

let currentDate = new Date();
let calendarDays = document.body.querySelector(".calendar__month");
let calendarTitle = document.body.querySelector(".calendar__title");

addCalendarTitleText(calendarTitle, currentDate);
addEmptyDays(calendarDays, currentDate);
addDays(calendarDays, currentDate);



function getLocalDay(date) {

  let day = date.getDay();

  if (day == 0) {
    day = 7;
  }

  return day;

}

function addCalendarTitleText(node, date) {

  let calendarTitleText =

    date.toLocaleDateString("ru-RU", { month: "long" }).capitalize() +
    " " +
    date.toLocaleDateString("ru-RU", { year: "numeric" });

  node.innerText = calendarTitleText;

}

function addEmptyDays(node, date) { // добавляет пустые элементы если месяц начинается не с понедельника

  let firstDay = new Date(date);
  firstDay.setDate(1);

  for (let i = 1; i < getLocalDay(firstDay); i++) {

    let day = document.createElement("p");
  
    day.className = "calendar__day";
  
    node.append(day);
  
  }

}

function addDays(node, date) {

  let daysInMonth = 33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate();

  for (let i = 1; i <= daysInMonth; i++) {

    let day = document.createElement("button");
  
    day.className = "calendar__day";
    day.innerText = i;
  
    node.append(day);
  
  }

}