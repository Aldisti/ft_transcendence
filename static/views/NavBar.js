import allLanguage from "/language/language.js"

let language = allLanguage[localStorage.getItem("language")];

document.querySelector("#navbar").innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark" >
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Trascendence</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" data-link href="/">${language.navbar.home}</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" data-link href="/login" >${language.navbar.login}</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" data-link href="/signup" >${language.navbar.register}</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" data-link href="/games" >${language.navbar.games}</a>
          </li>
        </ul>
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle account" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
            <img src="https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg" alt="">
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton1">
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
            <li>${language.navbar.changeStyle}<div id="timeTravel"></div></li>
            <li><a class="nav-link active" data-link href="/userInfo" >${language.navbar.accountMenu}</a></li>
          </ul>
        </div>
      </div>
    </div>
    </nav>
`