// Seances
let timelineSeances;
let timelineMovies;
let selectedMovie;
let selectedHall;

let hallSeances;
let seanceTimeStart;
let seanceTimeEnd;
let currentSeancesDuration;
let currentSeancesStart;
let currentSeanceTimeStart;
let currentSeancesTimeEnd;

let seanseAllowed = false;

// btn

let movieSeancesCancel;
let movieSeancesSave;

// popup Add seance

const popupSeanceAdd = document.querySelector(".popup__seance_add");
const formAddSeance = document.querySelector(".popup__form_add-seance");
const selectSeanceHall = document.querySelector(".select__add-seance_hall");
let optionHallName;
let optionMovieName;
const selectSeanceMovie = document.querySelector(".select__add-seance_movie");
const inputSeanceTime = document.querySelector(".add-seans__input_time");
let checkedHallId;
let checkedMovieId;
let checkedMovieName;
let checkedMovieDuration;
let checkedSeanceTime;
let seanceCancelButton;

// popup Delete seance

const popupSeanceRemove = document.querySelector(".popup__seance_remove");
let seanceRemoveTitle;
let seanceDeleteButton;
let seanceRemoveCancelButton;

// Delete seance

let selectSeances;
let selectDelete;

let selectedSeance;
let selectedSeanceId;
let selectTimeline;
let selectedHallId;
let selectedMovieName;

let deletedSeances = [];
let filterDeletedSeances = [];

// Upload seance

function loadSeances(data) {
  timelineSeances.forEach(timeline => {
    timeline.innerHTML = "";

    for(let i = 0; i < data.result.seances.length; i++) {
      let movieSeanseId = data.result.films.findIndex(element => element.id === Number(data.result.seances[i].seance_filmid));
      
      if(Number(timeline.dataset.id) === data.result.seances[i].seance_hallid) {
        timeline.insertAdjacentHTML("beforeend", `
        <div class="timeline__seances_movie" data-filmid="${data.result.seances[i].seance_filmid}" data-seanceid="${data.result.seances[i].id}" draggable="true">
          <p class="timeline__seances_title">${data.result.films[movieSeanseId].film_name}</p>
          <p class="timeline__movie_start" data-duration="${data.result.films[movieSeanseId].film_duration}">${data.result.seances[i].seance_time}</p>
        </div>
        `);
      }
    }
    
  })

  // Movie background

  setMovieBackground();

  // Seance position
  
  positionSeance();


  window.addEventListener("resize", event => {
    positionSeance();
  })

  // Cancel seance btn

  movieSeancesCancel = document.querySelector(".movie-seances__batton_cancel");

  movieSeancesCancel.addEventListener("click", event => {
    if(movieSeancesCancel.classList.contains("button_disabled")) {
      event.preventDefault();
    } else {
      event.preventDefault();
      deletedSeances.length = 0;
      filterDeletedSeances.length = 0;
      loadSeances(data);
    
      deleteSeance();

      movieSeancesCancel.classList.add("button_disabled");
      movieSeancesSave.classList.add("button_disabled");
    }
  })
}

// Backgroung timeline set up

function setMovieBackground() {
  const movies = document.querySelectorAll(".movie-seances__movie");
  let movieBackground;
  const moviesInformation = new Array();

 

  movies.forEach(movie => {
    movieBackground = movie.classList.value.match(/\d+/)[0];

    const movieInfo = new Object();
    movieInfo.movieInfoId = movie.dataset.id;
    movieInfo.background = movieBackground;

    moviesInformation.push(movieInfo);
  })

  

  timelineMovies = Array.from(document.querySelectorAll(".timeline__seances_movie"));

  timelineMovies.forEach(element => {
    for (let i = 0; i < moviesInformation.length; i++)
      if(Number(element.dataset.filmid) === Number(moviesInformation[i].movieInfoId)) {
        element.classList.add(`background_${moviesInformation[i].background}`);
      }
  })

}

// Add seance in timeline

let dayInMinutes = 24 * 60;
let startSeance;
let movieduration;
let movieWidth;
let seancePosition;

function positionSeance() {

  timelineMovies.forEach(item => {
    let time = item.lastElementChild.textContent.split(":", [2]);
    let hours = Number(time[0]); 
    let minutes = Number(time[1]);

    startSeance = (hours * 60) + minutes;
    seancePosition = (startSeance / dayInMinutes) * 100;

    movieduration = item.lastElementChild.dataset.duration;
    movieWidth = (movieduration / dayInMinutes) * 100;

    item.style.left = seancePosition + "%";
    item.style.width = movieWidth + "%";

    // Font adjustement

    if(item.dataset.change === "true") {
      item.firstElementChild.style.fontSize = "10px";
      item.style.padding = "10px";
    }

    let movieWidthPx = item.getBoundingClientRect().width;

    if(movieWidthPx < 40) {
      item.firstElementChild.style.fontSize = "8px";
      item.style.padding = "5px";
      item.dataset.change = "true";
    } 
  })

}

// Add Seance popup drag

function openSeancePopup(data) {

  const moviesArray = document.querySelectorAll(".movie-seances__movie");
  const hallsTimelineArray = document.querySelectorAll(".timeline__seances");

  

  let selectedElement;

  moviesArray.forEach(movie => {
    movie.addEventListener("dragstart", (event) => {  
      selectedMovie = movie.dataset.id;
      selectedElement = event.target;
    }) 
  })

  // Cancel add Seance drag in timeline 

  moviesArray.forEach(movie => {
    movie.addEventListener("dragend", () => {  
      selectedElement = undefined;
    }) 
  })

  hallsTimelineArray.forEach(timeline => {
    timeline.addEventListener("dragover", (event) => {
      event.preventDefault();
    })
  })

  hallsTimelineArray.forEach(timeline => {
    timeline.addEventListener("drop", (event) => {
      event.preventDefault();
      
      if(selectedElement === undefined) {
        return;
      }

      selectedHall = timeline.dataset.id;
      
      // popup Add seance

      popupSeanceAdd.classList.remove("popup__hidden");

      // Clear popup

      selectSeanceHall.innerHTML = "";
      selectSeanceMovie.innerHTML = "";
      formAddSeance.reset();

      // select name Hall

      for(let i = 0; i < data.result.halls.length; i++) {
        selectSeanceHall.insertAdjacentHTML("beforeend", `
        <option class="option_add-seance hall__name" data-id="${data.result.halls[i].id}">${data.result.halls[i].hall_name}</option>
        `);
      } 

      optionHallName = document.querySelectorAll(".hall__name");

      optionHallName.forEach(hallName => {
        if(Number(hallName.dataset.id) === Number(selectedHall)) {
          hallName.setAttribute("selected", "true");
        }
      })

      

      for(let i = 0; i < data.result.films.length; i++) {
        selectSeanceMovie.insertAdjacentHTML("beforeend", `
          <option class="option_add-seance movie__name" data-id="${data.result.films[i].id}" data-duration="${data.result.films[i].film_duration}">${data.result.films[i].film_name}</option>
        `);
      } 

      optionMovieName = document.querySelectorAll(".movie__name");

      optionMovieName.forEach(movieName => {
        if(Number(movieName.dataset.id) === Number(selectedMovie)) {
          movieName.setAttribute("selected", "true");
        }
      })

    })
  })
}

// Add seance bnt

let seancesChecked = [];

function clickSeanseAddButton() {
  formAddSeance.addEventListener("submit", (event) => {
    event.preventDefault();
    seancesChecked.length = 0;

    // Save Hall data
    let checkedHall = selectSeanceHall.value;

    optionHallName.forEach(hallName => {
      if(hallName.textContent === checkedHall) {
        checkedHallId = hallName.dataset.id;
      }
    })

    // Save movie data
    let checkedMovie = selectSeanceMovie.value;

    optionMovieName.forEach(movieName => {
      if(movieName.textContent === checkedMovie) {
        checkedMovieId = movieName.dataset.id;
        checkedMovieName = checkedMovie;
        checkedMovieDuration = movieName.dataset.duration;
      }
    })

    // Save movie time

    checkedSeanceTime = inputSeanceTime.value;

    let seanceTime = checkedSeanceTime.split(':', [2]);
    seanceTimeStart = Number(seanceTime[0]) * 60 + Number(seanceTime[1]);

    seanceTimeEnd = seanceTimeStart + Number(checkedMovieDuration);

    // Last seance time

    let lastTime = 23 * 60 + 59;

    if(seanceTimeEnd > lastTime) {
      alert("Последний сеанс должен заканчиваться не позднее 23:59!");
      return;
    }

    // Check seances crossing

    timelineSeances = document.querySelectorAll(".timeline__seances");
    
    // Unite seances in hall

    timelineSeances.forEach(timeline => {
      if(Number(timeline.dataset.id) === Number(checkedHallId)) {
        hallSeances = Array.from(timeline.querySelectorAll(".timeline__seances_movie"));
      }
    })

    // add seance if the hall is empty

    if (hallSeances.length === 0) {
      popupSeanceAdd.classList.add("popup__hidden");
      addNewSeance();
      return;
    }

    // seance hall info

    for (let seance of hallSeances) {

      //get movie duration
      
      currentSeancesDuration = seance.lastElementChild.dataset.duration;

      // movie start time

      currentSeancesStart = seance.lastElementChild.textContent;
 
      // start and end time movie

      let currentSeanceTime = currentSeancesStart.split(':', [2]);
      currentSeanceTimeStart = Number(currentSeanceTime[0]) * 60 + Number(currentSeanceTime[1]);

      currentSeancesTimeEnd = currentSeanceTimeStart + Number(currentSeancesDuration);

      // check add seance
      if(seanceTimeStart >= currentSeanceTimeStart && seanceTimeStart <= currentSeancesTimeEnd) {
        alert("Новый сеанс пересекается по времени с существующими!");
        seancesChecked.push("false");
        break;
      } else if (seanceTimeEnd >= currentSeanceTimeStart && seanceTimeEnd <= currentSeancesTimeEnd) {
        alert("Новый сеанс пересекается по времени с существующими!");
        seancesChecked.push("false");
        break;
      } else {
        seancesChecked.push("true");
      }

    }

    if(!seancesChecked.includes("false")) {
      popupSeanceAdd.classList.add("popup__hidden");
      addNewSeance();
    } else {
      return;
    }

  })
}

// add seance in timeline

function addNewSeance() {
  movieSeancesCancel.classList.remove("button_disabled");
  movieSeancesSave.classList.remove("button_disabled");

  timelineSeances.forEach(timeline => {
    if (Number(timeline.dataset.id) === Number(checkedHallId)) {
      timeline.insertAdjacentHTML("beforeend", `
      <div class="timeline__seances_movie" data-filmid="${checkedMovieId}" data-seanceid="" draggable="true">
        <p class="timeline__seances_title">${checkedMovieName}</p>
        <p class="timeline__movie_start" data-duration="${checkedMovieDuration}">${checkedSeanceTime}</p>
      </div>
      `);
    }      
    
  })

  setMovieBackground();
  
  positionSeance();

  deleteSeance();
}


// delete seance from timeline

function deleteSeance() {
  selectSeances = document.querySelectorAll(".timeline__seances_movie");

  // chose selected seance

  let selectedElement;

  selectSeances.forEach(seance => {
    seance.addEventListener("dragstart", (event) => {
      selectedSeance = seance;
      selectTimeline = seance.closest(".movie-seances__timeline");
      selectedMovie = seance.dataset.filmid;
      selectedMovieName = seance.firstElementChild.textContent;
      selectedHallId = seance.parentElement.dataset.id;
      selectDelete = selectTimeline.firstElementChild;

      selectDelete.classList.remove("hidden");

      selectedElement = event.target;

      selectDelete.addEventListener("dragover", (event) => {  
        event.preventDefault();
      })
    
      selectDelete.addEventListener("drop", (event) => {  
        event.preventDefault();
    
        // popup delete seance
    
        popupSeanceRemove.classList.remove("popup__hidden");

        seanceRemoveTitle = document.querySelector(".seance-remove_title");
        seanceRemoveTitle.textContent = selectedMovieName;

        seanceDeleteButton = document.querySelector(".popup__remove-seance_button_delete");

        // delete btn in popup delete seance

        seanceDeleteButton.addEventListener("click", (e) => {
          e.preventDefault();

          popupSeanceRemove.classList.add("popup__hidden");

          if(selectedSeance.dataset.seanceid !== "") {
            selectedSeanceId = selectedSeance.dataset.seanceid;
            deletedSeances.push(selectedSeanceId);
          }

          selectedSeance.remove();

          // filterDeletedSeances

          filterDeletedSeances = deletedSeances.filter((item, index) => {
            return deletedSeances.indexOf(item) === index;
          });

          if(filterDeletedSeances.length !== 0) {
            movieSeancesCancel.classList.remove("button_disabled");
            movieSeancesSave.classList.remove("button_disabled");
          } else {
            movieSeancesCancel.classList.add("button_disabled");
            movieSeancesSave.classList.add("button_disabled");
          }
        
        })

      })

    })
  })

  selectSeances.forEach(seance => {
    seance.addEventListener("dragend", () => {
      selectedElement = undefined;
      selectDelete.classList.add("hidden");
    })
  })

}

// seance display

function seancesOperations(data) {
  timelineSeances = document.querySelectorAll(".timeline__seances");

  // seance uploading

  loadSeances(data);

  openSeancePopup(data);
  clickSeanseAddButton();

  deleteSeance();
}

// Save seance btn 

movieSeancesSave = document.querySelector(".movie-seances__batton_save");


movieSeancesSave.addEventListener("click", event => {
  if(movieSeancesSave.classList.contains("button_disabled")) {
    event.preventDefault();
  } else {
    event.preventDefault();

    const seancesArray = Array.from(document.querySelectorAll(".timeline__seances_movie"));

    // Add seance

    seancesArray.forEach(seance => {
      if(seance.dataset.seanceid === "") {
        const params = new FormData();
        params.set("seanceHallid", `${seance.parentElement.dataset.id}`);
        params.set('seanceFilmid', `${seance.dataset.filmid}`);
        params.set('seanceTime', `${seance.lastElementChild.textContent}`);
        addSeances(params);
      }
    })
    
    // Delete Seance

    if (filterDeletedSeances.length !== 0) {
      filterDeletedSeances.forEach(seance => {
        let seanceId = seance;
        deleteSeances(seanceId);
      })
    }

    alert("Сеансы сохранены!");
    location.reload();
 }
})

// Add seance on server 

function addSeances(params) {
  fetch("https://shfe-diplom.neto-server.ru/seance", {
  method: "POST",
  body: params 
})
  .then(response => response.json())
  .then(function(data) { 
    console.log(data);
  })
}

// Delete seance from server

function deleteSeances(seanceId) {
  fetch(`https://shfe-diplom.neto-server.ru/seance/${seanceId}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then(function(data) {
      console.log(data);
    })
}