import allLanguage from "/language/language.js"

let language = allLanguage[localStorage.getItem("language")];

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
                <a class="nav-link active" data-link href="/login" >${language.navbar.login}</a>
            </li>
            <li class="nav-item">
                <a class="nav-link active" data-link href="/signup" >${language.navbar.register}</a>
            </li>
          `}
          <li class="nav-item">
            <a class="nav-link active" data-link href="/games" >${language.navbar.games}</a>
          </li>
        </ul>
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle account" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            <span>
                ${localStorage.getItem("username") == undefined ? "" : localStorage.getItem("username")}
            </span>
            <img src="https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg" alt="">
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
            ${localStorage.getItem("username") == undefined ? `` : `<li><a class="nav-link active" data-link href="/userInfo" >${language.navbar.accountMenu}</a></li>`}
          </ul>
        </div>
      </div>
    </div>
    </nav>
`