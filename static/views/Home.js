import Aview from "/views/abstractView.js";
import animation from "/scripts/home3dModel.js"

export default class extends Aview{
    constructor(){
        super();
    }
    getHtml(){
        return `
        <div class="base">
        <div class="firstLine retroShade">
            <div class="text">
                <h1 class="title">Our Game</h1>
                <p>
                Welcome to our game development studio, where every pixel, every line of code, and every design choice is crafted with meticulous care and passion.

                At our studio, we believe that creating extraordinary games requires an unwavering dedication to detail and a deep understanding of player experiences. Our team comprises visionary designers, talented programmers, and creative artists who collaborate seamlessly to bring captivating worlds to life.
                </p>
            </div>
            <canvas id="padle">
                
            </canvas>
        </div>
        <div class="secondLine retroShade">
        <canvas id="ground">
            
        </canvas>
        <div class="text">
            <h1 class="title">The Process</h1>
            <p>
            From the inception of an idea to the final product, our games undergo a journey marked by precision and innovation. We delve into the core of storytelling, gameplay mechanics, and visual aesthetics to ensure that each aspect harmoniously complements the others, delivering an immersive and unforgettable gaming experience.

            We meticulously design and iterate, pouring our creativity into every aspect of the game. Each element undergoes rigorous testing and refinement, guaranteeing a seamless and enjoyable experience for our players.
            </p>
        </div>
    </div>
    </div>
    <script src="/scripts/test.js"></script>
    `
    }
    setup(){
        animation();
		document.querySelector("#app").style.backgroundImage = "url('/imgs/backLogin.png')";
		document.querySelector("#app").style.backgroundSize = "cover"
		document.querySelector("#app").style.backgroundRepeat = "repeat"
	}
}