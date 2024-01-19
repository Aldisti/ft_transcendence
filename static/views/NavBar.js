import allLanguage from "/language/language.js"
import Router from "/router/mainRouterFunc.js"
import * as API from "/API/APICall.js"
import * as NOTIFICATION from "/viewScripts/notification/notification.js"

if (localStorage.getItem("language") == null)
	localStorage.setItem("language", "en")

let language = allLanguage[localStorage.getItem("language")];
let defaultProfilePicture = "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg";
document.querySelector("#navbar").innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark" >
    <div class="container-fluid">
      <a class="navbar-brand" href="/home" data-link>TRANSCENDENCE</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-lg-0">
          ${localStorage.getItem("username") != undefined ? `` : `
            <li class="nav-item">
                <a class="nav-link active" data-link href="/login/" >${language.navbar.login}</a>
            </li>
            <li class="nav-item">
                <a class="nav-link active" data-link href="/register/" >${language.navbar.register}</a>
            </li>
          `}
          <li class="nav-item">
            <a class="nav-link active" data-link href="/games/" >${language.navbar.games}</a>
          </li>
          <li class="nav-item">
            <button class="nav-link active" >${language.navbar.notification}</a>
          </li>
        </ul>
        <div style="display: flex; margin: 0 20px 0 20px">
          <input class="form-control navBarSearchInput mr-sm-2" type="search" placeholder="Search" aria-label="Search" style="display: flex; margin: 0 20px 0 20px">
          <button class="btn searchBtn btn-success my-2 my-sm-0" id="navbarSearch" type="submit">Search</button>
        </div>
      
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle account" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            <span>
                ${localStorage.getItem("username") == undefined ? "" : localStorage.getItem("username")}
            </span>
            <img class="profilePictureUrl" src="${defaultProfilePicture}" alt="">
          </button>
          <ul class="dropdown-menu dropdown-menu-end bg-dark" aria-labelledby="dropdownMenuButton1">
            <li>
              ${language.navbar.changeLanguage}
              <select name="language" id="languageSwitch">
                <option value="en">en</option>
                <option value="ita">ita</option>
                <option value="fr">fr</option>
                <option value="es">esp</option>
                <option value="de">de</option>
                <option value="el">el</option>
                <option value="ru">ru</option>
              </select>
            </li>
            <li id="timeTravel"><p>${language.navbar.changeStyle}</p><div id="clock"></div></li>
            ${localStorage.getItem("username") == undefined ? `` : `<li><a class="nav-link active" data-link href="/account/" >${language.navbar.accountMenu}</a></li>`}
          </ul>
        </div>
      </div>
    </div>
    </nav>
`

if (localStorage.getItem("language") != null)
  document.querySelector("#languageSwitch").value = localStorage.getItem("language")

document.querySelector("#languageSwitch").addEventListener("change", (e)=>{
	localStorage.setItem("language", e.target.value)
	window.location.reload()
})

function searchUser(input)
{
    API.getUserInfo(input).then(res=>{
		console.log(res)
      if (res != undefined)
	  {
		history.pushState(null, null, `/user/?username=${input}`)
		Router()
	  }
	  else
	  	NOTIFICATION.simple({title: "Error", body: `user ${input} is not registered!`})
    })
}

document.querySelector(".searchBtn").addEventListener("click", ()=>{
  let inputRegex = /^[A-Za-z0-9!?*@$~_-]{1,32}$/
  let input = document.querySelector(".navBarSearchInput").value;
  console.log(input)

  if (inputRegex.test(input))
    searchUser(input);
  else
    alert("bad input retry...")
});  

API.getUserInfo(localStorage.getItem("username")).then(res=>{
  if (res != undefined && res.user_info.picture != null)
    document.querySelector(".profilePictureUrl").src = res.user_info.picture;
})