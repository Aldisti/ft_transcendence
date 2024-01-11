window.switchVisibility = (e)=>{
    console.log(e.parentNode.children[2], e.children[0])
    if (e.parentNode.children[0].type == "text")
    {
        e.parentNode.children[0].type = "password"
        e.children[0].src = "/imgs/openEye.png"
    }
    else
    {
        e.parentNode.children[0].type = "text"
        e.children[0].src = "/imgs/closedEye.png"
    }
}

window.setToken = function (token){
    let jwtToken = token;

    function getToken(){
        return (jwtToken);
    }
    return getToken;
}

window.decode64 = function (base64String) {
    const decodedData = atob(base64String);
    return decodeURIComponent(escape(decodedData));
}

window.test = function()
{
    console.log("test")
    const reader = new FileReader();
    let file = document.querySelector("#inpFile").files[0];
    document.querySelector("#labelInpFile").innerHTML = `<img class="fileIcon" src="/imgs/fileIcon.png"><span class="selectFileText">${file.name}</span>`
    reader.onload = function (event){
        console.log(event)
        document.querySelector(".updateImgForm").src = event.target.result;

    }
    reader.readAsDataURL(file);
}

window.showCode = function(){
    if (!document.querySelector(".codeDisplay").classList.contains("visible"))
    {
        document.querySelector(".codeDisplay").style.display = "flex";
        document.querySelector(".codeDisplay").classList.add("visible");
    }
    else
    {
        document.querySelector(".codeDisplay").style.display = "none";
        document.querySelector(".codeDisplay").classList.remove("visible");
    }
}