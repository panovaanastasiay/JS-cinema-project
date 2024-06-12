let seanceId = Number(localStorage.getItem("seanceId"));
let checkedDate = localStorage.getItem("checkedDate");

const body = document.querySelector("body");
const buyingInfo = document.querySelector(".buying__info");

const movieTitle = document.querySelector(".buying__info_title");
const seanceStartTime = document.querySelector(".buying__info-time");
const hallName = document.querySelector(".buying__info_hall");

const scheme = document.querySelector(".buying__scheme_places");
let hallSchemeRows;
let hallSeats;

const hallPriceStandart = document.querySelector(".price_standart");
const hallPriceVip = document.querySelector(".price_vip");
let priceStandart;
let priceVip;

let selectedPlaces;
let tickets = [];
let coast;

const buyingButton = document.querySelector(".buying__button");

// Screen zoom mobile

body.addEventListener("dblclick", () => {
  if((Number(body.getBoundingClientRect().width)) < 1200) {
    if(body.getAttribute("transformed") === "false" || !body.hasAttribute("transformed")) {
      body.style.zoom = "1.5";
      body.style.transform = "scale(1.5)";
      body.style.transformOrigin = "0 0";
      body.setAttribute("transformed", "true")
    } else if(body.getAttribute("transformed") === "true") {
      body.style.zoom = "1";
      body.style.transform = "scale(1)";
      body.style.transformOrigin = "0 0";
      body.setAttribute("transformed", "false");
    }
  }
})

// Movie, seance, hall info

function setInfo(data) {
  let seanceIndex = data.result.seances.findIndex(item => item.id === Number(seanceId));
  let movieIndex = data.result.films.findIndex(item => item.id === data.result.seances[seanceIndex].seance_filmid);
  let hallIndex = data.result.halls.findIndex(item => item.id === data.result.seances[seanceIndex].seance_hallid);

  movieTitle.textContent = data.result.films[movieIndex].film_name;
  seanceStartTime.textContent = data.result.seances[seanceIndex].seance_time;
  hallName.textContent = data.result.halls[hallIndex].hall_name;

  hallPriceStandart.textContent = data.result.halls[hallIndex].hall_price_standart;
  hallPriceVip.textContent = data.result.halls[hallIndex].hall_price_vip;

  priceStandart = data.result.halls[hallIndex].hall_price_standart;
  priceVip = data.result.halls[hallIndex].hall_price_vip;
}

// Hall scheme data

function showHallScheme(data) {
  let hallConfig = data.result;

  hallConfig.forEach(() => {
    scheme.insertAdjacentHTML("beforeend", `<div class="buying__scheme_row"></div>`);
  });
    
  hallSchemeRows = document.querySelectorAll(".buying__scheme_row");

  for(let i = 0; i < hallSchemeRows.length; i++) {
    for(let j = 0; j < hallConfig[i].length; j++) {
      hallSchemeRows[i].insertAdjacentHTML("beforeend", `<span class="buying__scheme_seat" data-type="${hallConfig[i][j]}"></span>`);
    }
  }

  hallSeats = document.querySelectorAll(".buying__scheme_seat");

  hallSeats.forEach(element => {
    if (element.dataset.type === "vip") {
      element.classList.add("seat_vip");
    } else if (element.dataset.type === "standart") {
      element.classList.add("seat_standart");
    } else if (element.dataset.type === "taken") {
      element.classList.add("seat_occupied");
    } else {
      element.classList.add("no-seat");
    }
  })

}

// Seat choice

function choosePlaces(hallSchemeRows) {
  let hallChooseRows = Array.from(hallSchemeRows);
  hallChooseRows.forEach(row => {
    let hallChoosePlaces = Array.from(row.children);
    hallChoosePlaces.forEach(place => {   
      if(place.dataset.type !== "disabled" && place.dataset.type !== "taken") {
        place.addEventListener("click", () => {
          place.classList.toggle("seat_selected");

          selectedPlaces = document.querySelectorAll(".seat_selected:not(.buying__scheme_legend-seat)");

          // Reserve btn

          if (selectedPlaces.length === 0) {
            buyingButton.classList.add("buying__button_disabled");
          } else {
            buyingButton.classList.remove("buying__button_disabled");
          }
        })

      }
    })
  })  
}



function clickButton() {
  buyingButton.addEventListener("click", event => {
    event.preventDefault();

    if(buyingButton.classList.contains("buying__button_disabled")) {
      return;
    } else {

      let hallChosenRows = Array.from(document.querySelectorAll(".buying__scheme_row"));

      tickets = [];

      hallChosenRows.forEach(row => {
        let rowIndex = hallChosenRows.findIndex(currentRow => currentRow === row);
       
        let hallChosenPlaces = Array.from(row.children);

        hallChosenPlaces.forEach(place => {
          let placeIndex = hallChosenPlaces.findIndex(currentPlace => currentPlace === place);

          if(place.classList.contains("seat_selected")) {
            if(place.dataset.type === "standart") {
              coast = priceStandart;
            } else if(place.dataset.type === "vip") {
              coast = priceVip;
            }

            tickets.push({
              row: rowIndex + 1,
              place: placeIndex + 1,
              coast: coast,
            })
          }

        })
      })

      localStorage.setItem("tickets", JSON.stringify(tickets));

      document.location="pay.html";
    }

  })

}


// Server dara

fetch("https://shfe-diplom.neto-server.ru/alldata")
  .then(response => response.json())
  .then(function(data) {
    console.log(data);
    setInfo(data);

    // Scheme hall server

    fetch(`https://shfe-diplom.neto-server.ru/hallconfig?seanceId=${seanceId}&date=${checkedDate}`)
    .then(response => response.json())
    .then(function(data) {
      console.log(data);
      showHallScheme(data);
      choosePlaces(hallSchemeRows);
      clickButton();
    })

  })