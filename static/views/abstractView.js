export default class Aview{
    constructor(){
        this.needListener   = false;
        this.listenerId     = "";
    }
    getHtml(){

    }
    setTitle(title){
        document.title = title;
    }
    getHeader(path){
        return (`<link rel="stylesheet" href="` + path + `">\n`)
    }
    getInput(){
        let values = {};
        for (let inp of document.querySelectorAll(".data"))
            values[inp.name] = inp.value;
        return values;
    }
}