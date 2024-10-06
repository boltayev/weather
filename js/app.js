"use strict";

const API = "b1b15e88fa797225412429c1c50c122a1";

const dayEl = document.querySelector('.default_day');
const dateEl = document.querySelector('.default_data');
const btnEl = document.querySelector(".btn_search");
const inputEl = document.querySelector(".input_field"); 

const iconsContainer = document.querySelector(".icons")
const dayInfoEl = document.querySelector(".day_info");
const listContentEl = document.querySelector(".list_content ul")

const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
];

//  display the day
const day = new Date();
const dayName = days[day.getDay()];
dayEl.textContent = dayName;

// display date

let month = day.toLocaleString("default", {month: "long"});
let date = day.getDate();
let year = day.getFullYear()

console.log(month,date,year);
// dataEl.textContent = date + " " + month + " " + year

// add event
btnEl.addEventListener("click", (e) =>{
      e.preventDefault();

      //  check empty value 
      if(inputEl.value !== ""){
            const Search = inputEl.value;
            inputEl.value = "";
            findLocation(Search)
            // const API_URL = `http://api.openweathermap.org/data/2.5/weather?q=${countryName}&appid=${API}`
      }else{
            console.log("place enter city or Country name")
      }

});      

async function findLocation(name){
      iconsContainer.innerHTML = "";
      dayInfoEl.innerHTML = "";
      listContentEl.innerHTML = "";

      try{
            const API_URL = `http://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`;
            const data = await fetch(API_URL);
            const result = await data.json();
            // console.log(result)

            if(result.cod !== "404"){
                  // display image content
                  const ImageContent = displayImageContent(result)

                  // display right side content
                  const rightSide = rightSideContent(result)

                  // forecast function 
                  displayForeCast(result.coord.lat, result.coord.lon)

                  setTimeout(()=>{
                        iconsContainer.insertAdjacentHTML("afterbegin", ImageContent);
                        iconsContainer.classList.add("fadeIn")
                        dayInfoEl.insertAdjacentHTML("afterbegin" , rightSide)      
                  },1500)
            }else{
                  const message = `<h2 class="weather_temp">${result.cod}</h2>
                        <h3 class="cloudtxt">${result.message}</h3>`
                        iconsContainer.insertAdjacentHTML("afterbegin", message)

                  
            }

            
      }     catch(error) {}
}

// display image content and temp

function displayImageContent(data){
      return  ` <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png

      "alt="weather">
      <h2 class="weather_temp">${Math.round(data.main.temp - 275.15)}</h2>
      <h3 class="cloudtxt">${data.weather[0].description}</h3>`
}

// display the right side content

function rightSideContent(result){
      return `<div class="content">
                                    <div class="title">NAME</div>
                                    <span class="value">${result.name}</span>
                              </div>
                              <div class="content">
                                     <div class="title">TEMP</div>
                                     <span class="value">${Math.round(result.main.temp - 275.15)}</span>
                              </div>
                              <div class="content">
                                     <div class="title">HUMIDITY</div>
                                     <span class="value">${result.main.humidity}span>
                              </div>
                              <div class="content">
                                     <div class="title">WIND SPEED</div>
                                     <span class="value">${result.wind.speed}</span>
                              </div>
      `
}

async function displayForeCast(lat, long){
      const ForeCast_API = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`
      const data = await fetch(ForeCast_API);
      const result = await data.json()
 
      // filter the forecast
      const uniqeForeCastDays = []

      const daysForecast = result.list.filter((forecast)=>{
            const forecastDate = new Date(forecast.dt_txt).getDate()
            
            if(!uniqeForeCastDays.includes(forecastDate)){
                  return uniqeForeCastDays.push(forecastDate)
            }
      })
     
      console.log(daysForecast) 
      console.log(result)

      daysForecast.forEach((content, indx) =>{
            if(indx <=3 ){
                  listContentEl.insertAdjacentHTML("afterbegin", forecast(content));
            }
      });
      
}

// forecast html element data 
function forecast(frContent){

      const day = new Date(frContent.dt_txt);
      const dayName = days[day.getDay()]
      console.log(dayName)
      const splitDay = dayName.split("", 3);
      const joinDay = splitDay.join("");
      console.log(joinDay)

      return ` <li>
                        <img src="https://openweathermap.org/img/wn/${frContent.weather[0].icon}@2x.png

                        " alt="weather">
                        <span>${joinDay}</span>
                        <span class="day_temp">${Math.round(frContent.main.temp - 275.15)}</span>
                  </li>`
}



