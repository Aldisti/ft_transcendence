window.switchVisibility = (e)=>{
    console.log(e.parentNode.children[2], e.children[0])
    if (e.parentNode.children[2].type == "text")
    {
        e.parentNode.children[2].type = "password"
        e.children[0].src = "/imgs/openEye.png"
    }
    else
    {
        e.parentNode.children[2].type = "text"
        e.children[0].src = "/imgs/closedEye.png"
    }
}