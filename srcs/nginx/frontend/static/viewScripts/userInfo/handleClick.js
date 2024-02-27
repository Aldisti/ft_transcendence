function collectData(dupThis) {
    let values = document.querySelectorAll(".formMenu .inputData");
    let form = {};
    dupThis.errors = {};

    for (let val of values)
        form[val.id] = val
    return (form);
}

export default function handleClick(dupThis, e)
{
    if (e.target.classList.contains("handle")) {
        if (document.querySelector(".handle").classList.contains("open")) {
            document.querySelector(".handle").classList.remove("open");
            document.querySelector(".handle").style.transform = `translateX(0)`;
            document.querySelector(".handle").innerHTML = ">";
            document.querySelector(".leftSide").style.transform = `translateX(-${document.querySelector(".leftSide").clientWidth}px)`;
        } else {
            document.querySelector(".handle").classList.add("open");
            document.querySelector(".handle").style.transform = `translateX(${document.querySelector(".leftSide").clientWidth}px)`;
            document.querySelector(".handle").innerHTML = "<";
            document.querySelector(".leftSide").style.transform = "translateX(0)";
        }
        return;
    }
    dupThis.changeForm(e.target);
    dupThis.highlightFormMenu(localStorage.getItem("selectedForm"))
    if (e.target.classList.contains("submit"))
        dupThis.performChecksAndSubmit(collectData(dupThis));
}