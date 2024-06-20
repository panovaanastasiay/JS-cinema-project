const loginButton = document.querySelector(".header__button");

const navDays = Array.from(document.querySelectorAll(".nav__day"));
const navToday = document.querySelector(".nav__day_today");
const navArrowRight = document.querySelector(".right");

let daysCount = 1;

let todayNavWeek;
let todayNavDate;

const weekDays = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
let todayWeekDay;

const currentDay = new Date();
let checkedDate;
let selectedDate;
let selectedMonth;
let selectedYear;

let gottenDate;
let gottenMonth;
let date;

let navDaysSorted;

const main = document.querySelector(".main");
let movies;
let movie;
let movieSeances;
let movieSeancesList;

//  "Enter"

loginButton.addEventListener("click", event => {
  event.preventDefault();
  document.location="login.html";
})

// Date today

function setToday(currentDay) {
  todayWeekDay = weekDays[currentDay.getDay()];

  todayNavWeek = navToday.querySelector(".nav__text-week");
  todayNavWeek.textContent = `${todayWeekDay}, `;
  
  todayNavDate = navToday.querySelector(".nav__text-date");
  todayNavDate.textContent = ` ${currentDay.getDate()}`;
  
  if (todayNavWeek.textContent === "Сб, " || todayNavWeek.textContent === "Вс, ") {
    todayNavWeek.classList.add("nav__day_weekend");
    todayNavDate.classList.add("nav__day_weekend");
  }
}

// Date others

function setDays() {
  navDays.forEach((day, i) => {
    if(!day.classList.contains("nav__day_today") && !day.classList.contains("nav__arrow")) {
      const date = new Date(currentDay.getTime() + (1000 * 60 * 60 * 24 * i));
      day.dataset.date = date.toJSON().split("T")[0];
      day.firstElementChild.textContent = `${weekDays[date.getDay()]},`;
      day.lastElementChild.textContent = date.getDate();
  
      if (day.firstElementChild.textContent === "Сб," || day.firstElementChild.textContent === "Вс,") {
        day.classList.add("nav__day_weekend");
      } else {
        day.classList.remove("nav__day_weekend");
      }
    }
  });
}

// Weekday change 

function changeDays(daysCount) {
  navDays.forEach((day, i) => {
    if(!day.classList.contains("nav__day_today") && !day.classList.contains("nav__arrow")) {
      const date = new Date(currentDay.getTime() + (1000 * 60 * 60 * 24 * (i + daysCount)));
      day.dataset.date = date.toJSON().split("T")[0];
      day.firstElementChild.textContent = `${weekDays[date.getDay()]},`;
      day.lastElementChild.textContent = date.getDate();
  
      if (day.firstElementChild.textContent === "Сб," || day.firstElementChild.textContent === "Вс,") {
        day.classList.add("nav__day_weekend");
      } else {
        day.classList.remove("nav__day_weekend");
      }
    }
  });
}

// Chosen date

function getDay(selectedDate, selectedMonth, selectedYear) {
  if(selectedDate < 10) {
    gottenDate = `0${selectedDate}`;
  } else {
    gottenDate = selectedDate;
  }

  if(selectedMonth < 9) {
    gottenMonth = `0${selectedMonth}`;
  } else {
    searchMonth = gottenMonth;
  }

  date = `${selectedYear}-${gottenMonth}-${gottenDate}`;
}

// Filter days 

function sortDays(navDays) {
  navDaysSorted = navDays.filter(item => !item.classList.contains("nav__arrow"));
}

// Today select

navToday.classList.add("nav__day-checked");
navToday.style.cursor = "default";
navToday.dataset.date = currentDay.toJSON().split("T")[0];

if(navToday.classList.contains("nav__day-checked")) {
  selectedDate = currentDay.getDate();
  selectedMonth = currentDay.getMonth() + 1;
  selectedYear = currentDay.getFullYear();

  getDay(selectedDate, selectedMonth, selectedYear);
  localStorage.setItem("checkedDate", date);
}

setToday(currentDay);
setDays();
sortDays(navDays);
markPastSeances();

// Right arrow

navArrowRight.addEventListener("click", () => {
  daysCount++;
  
  navToday.classList.remove("nav__day-checked");
  navToday.classList.add("nav__arrow");
  navToday.classList.add("left");
  navToday.style.cursor = "pointer";
  navToday.style.display = "flex";

  navToday.innerHTML = `
    <span class="nav__arrow-text">&lt;</span>
  `;

  changeDays(daysCount);
  sortDays(navDays);
})

// Left arrow

navToday.addEventListener("click", () => {
  if(navToday.classList.contains("nav__arrow")) {
    daysCount--;

    if(daysCount > 0) {
      changeDays(daysCount);
      sortDays(navDays);
    } else if (daysCount === 0) {
      navToday.classList.remove("nav__arrow");
      navToday.classList.remove("left");
      navToday.style.display = "block";
    
      navToday.innerHTML = `
        <span class="nav__text-today">Сегодня</span>
        <br><span class="nav__text-week"></span> <span class="nav__text-date"></span>
      `;
  
      setToday(currentDay);
      setDays();

      navDays.forEach(day => {
        if(!day.classList.contains("nav__day-checked")) {
          navToday.classList.add("nav__day-checked");
          navToday.style.cursor = "default";

          selectedDate = currentDay.getDate();
          selectedMonth = currentDay.getMonth() + 1;
          selectedYear = currentDay.getFullYear();
        
          getDay(selectedDate, selectedMonth, selectedYear);
          localStorage.setItem("checkedDate", date);
        }
      })
  
      sortDays(navDays);
    } else {
      return;
    }

  } else {
    return;
  }
  
})

// Day select

navDaysSorted.forEach(day => {
  day.addEventListener("click", () => {

    navDaysSorted.forEach(item => {
      item.classList.remove("nav__day-checked");
      item.style.cursor = "pointer";
    })

    if(!day.classList.contains("nav__arrow")) {
      day.classList.add("nav__day-checked");
      day.style.cursor = "default";

      checkedDate = new Date(day.dataset.date);

      selectedDate = checkedDate.getDate();
      selectedMonth = checkedDate.getMonth() + 1;
      selectedYear = checkedDate.getFullYear();
        
      getDay(selectedDate, selectedMonth, selectedYear);
      localStorage.setItem("checkedDate", date);

      markPastSeances();
      clickSeance();
    }
    
  })
})

// Movie and seance list

let dataFilms;
let dataSeances;
let dataHalls;

let hallsSeances;
let currentSeances;

function getMovies(data) {
  dataFilms = data.result.films;
  dataSeances = data.result.seances;
  dataHalls = data.result.halls.filter(hall => hall.hall_open === 1);

  dataFilms.forEach(film => {
    hallsSeances = "";

    dataHalls.forEach(hall => {

      //Seance/hall filter

      currentSeances = dataSeances.filter(seance => (
        (Number(seance.seance_hallid) === Number(hall.id)) && 
        (Number(seance.seance_filmid) === Number(film.id))
      ));

      // Time filter

      currentSeances.sort(function(a, b) {
        if ((a.seance_time.slice(0,2) - b.seance_time.slice(0,2)) < 0) {
          return -1;
        } else if ((a.seance_time.slice(0,2) - b.seance_time.slice(0,2)) > 0) {
          return 1;
        }
      });

      if (currentSeances.length > 0) {

        // Hall and seances

        hallsSeances += `
        <h3 class="movie-seances__hall" data-hallid="${hall.id}">${hall.hall_name}</h3>
        <ul class="movie-seances__list">
        `;

        currentSeances.forEach(seance => {
          // Seance for chose hall

          hallsSeances += `
          <li class="movie-seances__time" data-seanceid="${seance.id}" data-hallid="${hall.id}" data-filmid="${film.id}">
            ${seance.seance_time}
          </li>
          `;
        });
        
        hallsSeances += `</ul>`;
      };
    });
  
    if (hallsSeances) {
      // Movie block

      main.insertAdjacentHTML("beforeend", `
        <section class="movie" data-filmid="${film.id}">
          <div class="movie__info">
            <div class="movie__poster">
              <img src="${film.film_poster}" alt="Постер фильма ${film.film_name}" class="movie__poster_image">
            </div>
            <div class="movie__description">
              <h2 class="movie__title">${film.film_name}</h2>
              <p class="movie__summary">${film.film_description}</p>
              <p class="movie__data">
                <span class="movie__data-length">${film.film_duration} минут</span>
                <span class="movie__data-country">${film.film_origin}</span>
              </p>
            </div>
          </div>

          <div class="movie-seances">
            ${hallsSeances}
          </div>
        </section>
      `);
    } 
  })

  markPastSeances();

  clickSeance();
}

// Server

fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then(function(data) {
    console.log(data);
    getMovies(data);
  })

// Passed seances not active


function markPastSeances() {

  // Current time

  const currentHours = currentDay.getHours();
  const currentMinutes = currentDay.getMinutes();

  movieSeancesList = document.querySelectorAll(".movie-seances__time");
  movieSeancesList.forEach(seance => {

    if (Number(selectedDate) === Number(currentDay.getDate())) {
   
      if(Number(currentHours) > Number(seance.textContent.trim().slice(0,2))) {
        seance.classList.add("movie-seances__time_disabled");
      } else if(Number(currentHours) === Number(seance.textContent.trim().slice(0,2))) {
        if(Number(currentMinutes) > Number(seance.textContent.trim().slice(3))) {
          seance.classList.add("movie-seances__time_disabled");

        } else {
          seance.classList.remove("movie-seances__time_disabled");
        }
      } else {
        seance.classList.remove("movie-seances__time_disabled");
      }
  
    } else {
      seance.classList.remove("movie-seances__time_disabled");
    }
  })
}

// Hall for chosen movie

let seanceId;

function clickSeance() {
  movieSeancesList = document.querySelectorAll(".movie-seances__time");

  movieSeancesList.forEach(seance => {
    if(!seance.classList.contains("movie-seances__time_disabled")) {
      seance.addEventListener("click", () => {
        seanceId = seance.dataset.seanceid;
        localStorage.setItem("seanceId", seanceId);

        document.location="/hall.html";
      })
    }
  })

}