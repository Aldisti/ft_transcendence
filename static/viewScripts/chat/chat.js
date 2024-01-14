document.querySelector(".chatHandle").addEventListener("click", (e)=>{
    document.querySelector(".chatContainer").classList.toggle("open");
    if (document.querySelector(".chatContainer").classList.contains("open"))
        document.querySelector(".chatHandle").style.transform = `translateX(-${document.querySelector(".chatContainer").clientWidth}px)`
    else
        document.querySelector(".chatHandle").style.transform = `translateX(0px)`
})

let info = {
    username: "mpaterno",
    picture: "https://i.pinimg.com/originals/7d/34/d9/7d34d9d53640af5cfd2614c57dfa7f13.png"
}

function createUser(info){
    let el = document.createElement("div");
    let nameContainer = document.createElement("div");
    let chatUserPict = document.createElement("div");
    let img = document.createElement("img");

    el.classList.add("userLine")
    nameContainer.classList.add("nameContainer");
    chatUserPict.classList.add("chatUserPict");

    nameContainer.innerHTML = info.username;
    img.src = info.picture;
    nameContainer.innerHTML = info.username;

    chatUserPict.appendChild(img)
    el.appendChild(nameContainer);
    el.appendChild(chatUserPict);

    document.querySelector(".chatSideList").appendChild(el);
}

for (let i = 0; i < 100; i++)
{
    createUser(info);
}