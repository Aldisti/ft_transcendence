import allLanguage from "/language/language.js"

export default class Aview{
    constructor(){
        this.needListener   = false;
        this.listenerId     = "";
        this.language = {};
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
    setup(){

    }
}