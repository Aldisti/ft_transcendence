import Aview from "/views/abstractView.js";
import * as API from "/API/APICall.js"
import chart from "/viewScripts/chart.js"

export default class extends Aview {
    constructor() {
        super();
        this.username;
        this.friendStatus = false;
    }

    handleFriendRequest(usernameToSearch){
        API.friendStatus(1, usernameToSearch).then(res=>{
            let username = document.querySelector(".friendRequest").getAttribute("name")
            if (res.is_friend && confirm(`Do you really want to remove ${username} from your friends?`))
            {
                API.removeFriend(1, username);
                document.querySelector(".friendRequest").children[0].innerHTML = "Add Friend"
            }
            else if (!res.is_friend && confirm(`Do you really want to add ${username} to your friends?`))
            {
                API.sendFriendRequest(1, username);
                document.querySelector(".friendRequest").children[0].innerHTML = "Pending..."
            }
        })
    }

    getUserCard(){
        const urlParams = new URLSearchParams(window.location.search)
        API.getUserInfo(urlParams.get("username")).then(data=>{
            console.log(data)
            document.querySelector(".cardBody").innerHTML = `
                <div class="userAndImage">
                    <div class="imgContainer">
                        <img src="${data.user_info.picture != null ? data.user_info.picture : "/imgs/defaultImg.jpg"}">
                    </div>
                    <h2>${data.username}</h2>
                </div>
                <div class="name">
                    <div class="anagraph">
                        <h6>Name:</h6>
                        <h3>${data.user_info.first_name}</h3>
                    </div>
                    <div class="anagraph">
                        <h6>Last Name:</h6>
                        <h3>${data.user_info.last_name}</h3>
                    </div>
                </div>
                <div class="name">
                    <div class="anagraph">
                        <h6>Birth Date:</h6>
                        <h3>${data.user_info.birthdate}</h3>
                    </div>
                    <button class="askFriend friendRequest friendRequestBtn" style="${data.username == localStorage.getItem("username") ? `display: none;` : `` }" name="${data.username}">
                        <h3>Add friend</h3>
                    </button>
                    <a data-link class="askFriend" href="/account/" style="${data.username == localStorage.getItem("username") ? `` : `display: none;` }">
                        Manage Account
                    </a>
                </div>
            `
            this.username = document.querySelector(".friendRequest").getAttribute("name");
            API.friendStatus(1, this.username).then(res=>{
                if (res.is_friend)
                {
                    document.querySelector(".friendRequest").children[0].innerHTML = "Remove Friend";
                    this.friendStatus = true;
                }
                else
                    this.friendStatus = false;
                document.querySelector(".friendRequest").addEventListener("click", this.handleFriendRequest.bind(null, this.username));
            })
        })
    }
    getHtml(){
        let urlParams = new URLSearchParams(window.location.search);

        return `
            <div class="base">
                <div class="left">
                    <div class="cardBody">
                    </div>
                    <div class="filler">
                        <div class="gameStat">
                            <h6>Game Won:</h6>
                            <h3>34</h3>
                        </div>
                        <div class="gameStat">
                            <h6>Game Lost:</h6>
                            <h3>54</h3>
                        </div>
                        <div class="gameStat">
                            <h6>Tournament Won:</h6>
                            <h3>98</h3>
                        </div>
                        <div class="gameStat">
                            <h6>Tournament Lost:</h6>
                            <h3>200</h3>
                        </div>
                    </div>
                </div>
                <div class="statsContainer">
                    <h1 class="title">Statistiche</h1>
                    <div class="stats">
                        <div class="chart">
                            <h3>test</h3>
                            <div class="canvContainer">
                                <canvas id="first">
                            </div>
                        </div>
                        <div class="chart">
                            <div class="canvContainer">
                                <h3>test</h3>
                                <canvas id="second">
                            </div>
                        </div>
                        <div class="chart">
                            <div class="canvContainer">
                                <h3>test</h3>
                                <canvas id="third">
                            </div>
                        </div>
                        <div class="chart">
                            <div class="canvContainer">
                                <h3>test</h3>
                                <canvas id="fourth">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
    setup(){
        this.defineWallpaper("/imgs/backLogin.png", "https://images.unsplash.com/photo-1529678407585-55ac0053aa47?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
        this.getUserCard();
        let data = {
                type: "vertical",
                values: {
                    val1: 40,
                    val3: 10,
                    val4: 50,
                    val5: 100,
                    val6: 300,
                    val7: 250,
                },
                colors: ["#00afb9", "#f07167", "#2a9d8f"],
                maxValue: 400
            }
        let data1 = {
                type: "donut",
                values: {
                    val1: 40,
                    val3: 10,
                    val4: 50,
                    val5: 100,
                    val6: 300,
                    val7: 250,
                },
                colors: ["#00afb9", "#f07167", "#2a9d8f"],
                maxValue: 400
            }
        let data2 = {
                type: "radar",
                values: {
                    val1: 40,
                    val3: 10,
                    val4: 50,
                    val5: 100,
                    val6: 300,
                    val7: 250,
                },
                colors: ["#00afb9", "#f07167", "#2a9d8f"],
                maxValue: 400
            }
        chart(document.querySelector("#first"), data, true);
        chart(document.querySelector("#second"), data1, true);
        chart(document.querySelector("#third"), data2, true);
        chart(document.querySelector("#fourth"), data, true);
    }
}