export default function setupDarkMode(){
//     let darkMode = false;
//     let interval;

//     document.querySelector("#flexSwitchCheckDefault").addEventListener("change", ()=>{
//       if (darkMode){
//         darkMode = false;
//         return ;
//       }
//       darkMode = true;
//       interval = setInterval(() => {
//         console.log(darkMode)
//         let collection = document.querySelectorAll("#app div, #app h1, #app h6, input, button, .chat");
//         for (let el of collection)
//         {
// console.log(el, window.getComputedStyle(el).backgroundColor)
            
//           if (window.getComputedStyle(el).backgroundColor == "rgb(255, 255, 255)" && darkMode){
//                 el.style.backgroundColor = (el.tagName == "INPUT" || el.tagName == "H6") ? "var(--bs-gray)" : "var(--bs-dark)";
//                 el.style.color = "white"
//             }
//             else if (window.getComputedStyle(el).backgroundColor == "rgb(33, 37, 41)" && !darkMode){
//                 el.style.backgroundColor = "white";
//                 el.style.color = "black"
//             }
//         }
//       }, 1000);
//     })
    let bringBack = [];
    let interval;
    document.querySelector("#darkMode").addEventListener("click", ()=>{
        if (localStorage.getItem("darkMode") == null){
            localStorage.setItem("darkMode", "true");
            interval = setInterval(() => {
                document.querySelectorAll("#app div, #app h1, #app h6, input, button, .chat").forEach(el=>{
                    if (window.getComputedStyle(el).backgroundColor == "rgb(255, 255, 255)" && darkMode){
                        bringBack.push(el);
                        el.style.backgroundColor = (el.tagName == "INPUT" || el.tagName == "H6") ? "var(--bs-gray)" : "var(--bs-dark)";
                        el.style.color = "white"
                    }
                })
            }, 500);
        }else{
            clearInterval(interval);
            localStorage.removeItem("darkMode");
            bringBack.forEach(el=>{
                el.style.backgroundColor = "rgb(255, 255, 255)";
                el.style.color = "black";
            })
        }
    })
}