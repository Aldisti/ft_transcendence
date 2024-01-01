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