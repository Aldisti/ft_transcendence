export default function handleSlider(slider, next, imgs, type, textures){
    let containerWidth = document.querySelector(".themeDisplay").clientWidth;
    let sliderIncrease = containerWidth
    let stepCounter = 0;
    let className = slider
    let nextClass = next

    imgs.forEach(link=>{
        let img = document.createElement("img");

        img.src = link;
        img.style.objectFit = "contain";
        img.style.flexShring = "0";
        document.querySelector(className).appendChild(img);
    })
    document.querySelector(nextClass).addEventListener("click", ()=>{
        stepCounter++;
        console.log(stepCounter)
        if (stepCounter == imgs.length)
        {
            sliderIncrease = 0;
            stepCounter = 0;
        }
        textures[type] = imgs[stepCounter];
        console.log(document.querySelector(className))
        document.querySelector(className).style.transform = `translateX(-${sliderIncrease}px)`;
        sliderIncrease += containerWidth;
    })
}