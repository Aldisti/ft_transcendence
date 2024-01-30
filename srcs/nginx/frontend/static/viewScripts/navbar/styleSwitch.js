export default function styleSwitchHandler(e){
    e.stopPropagation();
    document.querySelector(".highlightPc").classList.toggle("highlightModernPc")
    if (localStorage.getItem("style") == "old")
		localStorage.setItem("style", "modern")
	else
		localStorage.setItem("style", "old")
	document.querySelector(".loaderOverlay").style.left = "0";
    setTimeout(() => {
        window.location.reload();
    }, 300);
}