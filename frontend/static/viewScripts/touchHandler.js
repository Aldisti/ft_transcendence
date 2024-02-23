function isHorizontalSwipe(startX, startY, endX, endY){
    if (Math.abs(startY - endY) > 20)
        return false;
    if (Math.abs(startX - endX) < 100)
        return false;
    return true;
}

if (window.innerWidth < 900)
{
    let touchstartX;
    let touchstartY;
    let touchendX;
    let touchendY;
    document.addEventListener('touchstart', function (event) {
        if (event.target.classList.contains("mobile"))
            return ;
        touchstartX = event.changedTouches[0].screenX;
        touchstartY = event.changedTouches[0].screenY;
    }, false);
    
    document.addEventListener('touchend', function (event) {
        if (event.target.classList.contains("mobile"))
            return ;
        touchendX = event.changedTouches[0].screenX;
        touchendY = event.changedTouches[0].screenY;

        handleGesture(touchendX, touchendY, touchstartX, touchstartY);
    }, false);
    
    window.finish = true
    function handleGesture(touchendX, touchendY, touchstartX, touchstartY) {

        if (touchendX < touchstartX  && isHorizontalSwipe(touchendX, touchendY, touchstartX, touchstartY)) {
            window.finish = false;
            document.querySelector(".chatContainer").classList.toggle("showUserList");
            setTimeout(() => {
                window.finish = true;
            }, 1000);
        }
    
        if (touchendX > touchstartX && isHorizontalSwipe(touchendX, touchendY, touchstartX, touchstartY)) {
            //if full open will close the chat
            if (document.querySelector(".chatContainer").classList.contains("fullOpen"))
                document.querySelector(".chatContainer").classList.toggle("fullOpen");
                    //if the users tab is visible and hover out close the tab
            if (document.querySelector(".chatContainer").classList.contains("showUserList"))
                document.querySelector(".chatContainer").classList.remove("showUserList");
        }
    }
}

document.addEventListener("scroll", ()=>{
    document.querySelector(".chatContainer").style.top = `${window.scrollY + 60}px` ;
})