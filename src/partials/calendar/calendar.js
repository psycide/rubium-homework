String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

// let currentDate = new Date();
// const calendarMonth = document.body.querySelector(".calendar__month");
// const calendarTitle = document.body.querySelector(".calendar__title");

// setCalendarTitleText(calendarTitle, currentDate);
// addEmptyDays(calendarMonth, currentDate);
// addDays(calendarMonth, currentDate);


// let lastMonth = new Date(currentDate);
// lastMonth.setDate(0);



// function getLocalDay(date) {

//   let day = date.getDay();

//   if (day == 0) {
//     day = 7;
//   }

//   return day;

// }

// function setCalendarTitleText(node, date) {

//   let calendarTitleText =

//     date.toLocaleDateString("ru-RU", { month: "long" }).capitalize() +
//     " " +
//     date.toLocaleDateString("ru-RU", { year: "numeric" });

//   node.innerText = calendarTitleText;

// }

// function addEmptyDays(node, date) { // добавляет пустые элементы если месяц начинается не с понедельника

//   let firstDay = new Date(date);
//   firstDay.setDate(1);

//   for (let i = 1; i < getLocalDay(firstDay); i++) {

//     let day = document.createElement("p");
  
//     day.className = "calendar__day";
  
//     node.append(day);
  
//   }

// }

// function addDays(node, date) {

//   let daysInMonth = 33 - new Date(date.getFullYear(), date.getMonth(), 33).getDate();

//   for (let i = 1; i <= daysInMonth; i++) {

//     let day = document.createElement("button");
  
//     day.className = "calendar__day";
//     day.innerText = i;
  
//     node.append(day);
  
//   }

// }

// function deleteDays(node) {

//   let nodesToDelete = [];

//   node.childNodes.forEach((item) => {

//     if (!item.classList.contains('calendar__week-day')) {
//       nodesToDelete.push(item);
//     }

//   });

//   nodesToDelete.forEach((item) => item.remove());
// }

// function changeMonth(date) {
//   setCalendarTitleText(calendarTitle, date);
//   deleteDays(calendarMonth);
//   addEmptyDays()
// }

function Calendar(node) {

  this.self = node;
  this.date = new Date();
  this.title = node.querySelector(".calendar__title");
  this.month = node.querySelector(".calendar__month");

  this.getLocalDay = function() {

    let day = this.date.getDay();

    if (day == 0) {
      day = 7;
    }
  
    return day;
  };

  this.setCalendarTitleText = function() {
    let calendarTitleText =

    this.date.toLocaleDateString("ru-RU", { month: "long" }).capitalize() +
    " " +
    this.date.toLocaleDateString("ru-RU", { year: "numeric" });

    this.title.innerText = calendarTitleText;
  };

  this.addEmptyDays = function() {

    let firstDay = new Date(this.date);
    firstDay.setDate(1);

    for (let i = 1; i < this.getLocalDay(); i++) {

      let day = document.createElement("p");
    
      day.className = "calendar__day";
    
      this.month.append(day);
    
    }
  };

  this.addDays = function() {
    let daysInMonth = 33 - new Date(this.date.getFullYear(), this.date.getMonth(), 33).getDate();

    for (let i = 1; i <= daysInMonth; i++) {

      let day = document.createElement("button");
    
      day.className = "calendar__day";
      day.innerText = i;
    
      this.month.append(day);
    }
  };

  this.removeDays = function() {
    let nodesToDelete = [];

    node.childNodes.forEach((item) => {

      if (!item.classList.contains('calendar__week-day')) {
        nodesToDelete.push(item);
      }

    });

    nodesToDelete.forEach((item) => item.remove());
  }

  this.addEmptyDays();
  this.addDays();
}