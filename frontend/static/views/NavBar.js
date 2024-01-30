import allLanguage from "/language/language.js"
import darkHandler from "/viewScripts/navbar/darkMode.js"
import handleSearchUser from "/viewScripts/navbar/userSearch.js"
import styleSwitchHandler from "/viewScripts/navbar/styleSwitch.js"
import * as API from "/API/APICall.js"

if (localStorage.getItem("language") == null)
	localStorage.setItem("language", "en")

let language = allLanguage[localStorage.getItem("language")];
let defaultProfilePicture = "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg";
document.querySelector(".loaderOverlay").style.left = "0"
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
        <div style="display: flex;">
          <input class="form-control navBarSearchInput" type="search" placeholder="Search" aria-label="Search" style="display: flex;">
          <button class="btn searchBtn btn-success" id="navbarSearch" type="submit">Search</button>
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
              </select>
            </li>
            <li id="darkMode">
              <p class="switchLable">Light</p>
                <div class="darkSwitch">
                  <div class="highlight">
                  </div>
                  <div class="sunIcon">
                    </div>
                  <div class="moonIcon">
                    </div>
                  </div>
                <p class="switchLable">Dark</p>
              </li>
            <li id="darkMode">
              <p class="switchLable">Retro</p>
                <div class="styleSwitch">
                  <div class="highlightPc">
                  </div>
                  <div class="oldPcIcon">
                    </div>
                  <div class="newPcIcon">
                    </div>
                  </div>
                <p class="switchLable">Modern</p>
              </li>
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

if (localStorage.getItem("darkMode") == "true"){
  darkHandler();
}
document.querySelector(".darkSwitch").addEventListener("click", darkHandler)
if (localStorage.getItem("style") == "modern")
  document.querySelector(".highlightPc").classList.add("highlightModernPc");
document.querySelector(".styleSwitch").addEventListener("click", styleSwitchHandler)

document.querySelector(".searchBtn").addEventListener("click", handleSearchUser);  

API.getUserInfo(localStorage.getItem("username")).then(res=>{
  if (res != undefined && res.user_info.picture != null)
    document.querySelector(".profilePictureUrl").src = res.user_info.picture;
})