import allLanguage from "/language/language.js"

export default class Aview{
    constructor(){
        this.needListener   = false;
        this.listenerId     = "";
        this.language = {};
        this.field          = {};
        this.listeners = [];
    }
    getHtml(){

    }
    getLanguage(){
        this.language = allLanguage[localStorage.getItem("language")];
    }
    setTitle(title){
        document.title = title;
    }
    getInput(){
        let values = {};
        for (let inp of document.querySelectorAll(".data"))
            values[inp.name] = inp.value;
        return values;
    }
    updateField(data){
		let keys = Object.keys(data);
		for (let key of keys)
			this.field[key] = data[key];
	}
    defineWallpaper(old, modern){
        //defining background
        if (localStorage.getItem("style") == "modern")
            document.querySelector("#app").style.backgroundImage = `url(${modern})`;
        else
            document.querySelector("#app").style.backgroundImage = `url(${old})`;
        document.querySelector("#app").style.backgroundSize = "cover"
        document.querySelector("#app").style.backgroundRepeat = "repeat"
        document.querySelector("#app").style.backgroundPosition = "center"

    }
    setup(){

    }
    destroy(){

    }
}