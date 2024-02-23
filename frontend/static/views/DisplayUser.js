import Aview from "/views/abstractView.js";
import * as API from "/API/APICall.js"
import chart from "/viewScripts/chart.js"
import Router from "/router/mainRouterFunc.js";


export default class extends Aview {
    constructor() {
        super();
        this.username;
        this.friendStatus = false;
    }

    handleFriendRequest(dupThis){
        API.friendStatus(1, dupThis.username).then(res=>{
            let username = document.querySelector(".friendRequest").getAttribute("name")
            if (res.is_friend && confirm(`Do you really want to remove ${username} from your friends?`))
            {
                API.removeFriend(1, username).catch(e=>{
                    console.log(e)
                });
                document.querySelector(".friendRequest").children[0].innerHTML = "Add Friend"
            }
            else if (!res.is_friend && confirm(`Do you really want to add ${username} to your friends?`))
            {
                API.sendFriendRequest(1, username).catch(e=>{
                    console.log(e)
                });
                document.querySelector(".friendRequest").children[0].innerHTML = dupThis.language.displayUser.userInfo.pending
            }
        }).catch(e=>{
            console.log(e)
        })
    }

    getUserCard(){
        const urlParams = new URLSearchParams(window.location.search)
        API.getUserInfo(urlParams.get("username")).then(data=>{
            if (data == undefined){
                history.pushState(null, null, "/");
                Router()
                return ;
            }
            document.querySelector(".cardBody").innerHTML = `
                <div class="userAndImage">
                    <div class="imgContainer">
                        <img src="${data.user_info.picture != null ? data.user_info.picture : "/imgs/defaultImg.jpg"}">
                    </div>
                    <h2>${data.username}</h2>
                </div>
                <div class="name">
                    <div class="anagraph">
                        <h6>${this.language.displayUser.userInfo.firstName}</h6>
                        <h3>${data.user_info.first_name}</h3>
                    </div>
                    <div class="anagraph">
                        <h6>${this.language.displayUser.userInfo.lastName}</h6>
                        <h3>${data.user_info.last_name}</h3>
                    </div>
                </div>
                <div class="name">
                    <div class="anagraph">
                        <h6>${this.language.displayUser.userInfo.birthDate}</h6>
                        <h3>${data.user_info.birthdate}</h3>
                    </div>
                    <button class="askFriend friendRequest friendRequestBtn" style="${data.username == localStorage.getItem("username") ? `display: none;` : `` }" name="${data.username}">
                        <h3>${this.language.displayUser.userInfo.addFriend}</h3>
                    </button>
                    <a data-link class="askFriend" href="/account/" style="${data.username == localStorage.getItem("username") ? `` : `display: none;` }">
                        ${this.language.displayUser.userInfo.manageAccount}
                    </a>
                </div>
                <div class="matchHistory">
                    <a href="/match-history/?username=${urlParams.get("username")}" data-link>
                        <h1>${this.language.displayUser.matchHistory}</h1>
                    </a>
                </div>
            `
            this.username = document.querySelector(".friendRequest").getAttribute("name");
            API.friendStatus(1, this.username).then(res=>{
                if (res.is_friend)
                {
                    document.querySelector(".friendRequest").children[0].innerHTML = this.language.displayUser.userInfo.removeFriend;
                    this.friendStatus = true;
                }
                else
                    this.friendStatus = false;
                document.querySelector(".friendRequest").addEventListener("click", this.handleFriendRequest.bind(null, this));
            }).catch(e=>{
                console.log(e)
            })
        }).catch(e=>{
            console.log(e)
        })
    }
    getHtml(){
        let urlParams = new URLSearchParams(window.location.search);

        return `
            <div class="base">
                <div class="left">
                    <div class="cardBody">
                    </div>
                </div>
                <div class="statsContainer">
                    <h1 class="title">${this.language.displayUser.statisticTitle}</h1>
                    <div class="stats">
                        <div class="chart">
                            <div class="canvContainer">
                                <h3>Ranked</h3>
                                <canvas id="fourth">
                            </div>
                        </div>
                        <div class="chart">
                            <div class="canvContainer">
                                <h3>Tournaments</h3>
                                <canvas id="second">
                            </div>
                        </div>
                        <div class="chart">
                            <h3>Win History</h3>
                            <div class="canvContainer">
                                <canvas id="first">
                            </div>
                        </div>
                        <div class="chart">
                            <div class="canvContainer">
                                <h3>Skills</h3>
                                <canvas id="third">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    }
    setup(){
        this.defineWallpaper("/imgs/backLogin.png", "/imgs/modernBack.jpeg")
        let params = new URLSearchParams(window.location.search);

        let radarChart = {type: "radar", colors: ["#00afb9", "#f07167", "#2a9d8f"], maxValue: 100};
        API.getPongMaestry(1, params.get("username")).then(res=>{
            if (Object.keys(res).length == 0)
                return ;

            Object.keys(res).forEach(el=>{
            })
            radarChart.values = res
            chart(document.querySelector("#third"), radarChart, true);
        }).catch(e=>{
            console.log(e)
        })


        let donutChartMatch = {type: "donut", colors: ["#00afb9", "#f07167", "#2a9d8f"]};
        API.getDonutChart(1, params.get("username"), "&tournament=true").then(res=>{
            if (Object.keys(res).length == 0)
                return ;
            let valueSum = 0;
            Object.keys(res).forEach(el=>{
                valueSum += res[el];
            })
            donutChartMatch.maxValue = valueSum;
            donutChartMatch.values = res;
            chart(document.querySelector("#second"), donutChartMatch, true);
        }).catch(e=>{
            console.log(e)
        })

        let verticalChart = {type: "vertical", colors: ["#00afb9", "#f07167", "#2a9d8f"]};
        API.getIstogram(1, params.get("username")).then(res=>{
            if (Object.keys(res).length == 0)
                return ;
            let maxValue = 0;
            let obj = {};
            Object.keys(res).forEach(el=>{
                if (res[el].win > maxValue)
                    maxValue = res[el].win;
                obj[el] = res[el].win;
            })
            if (maxValue == 0)
                return
            verticalChart.maxValue = maxValue;
            verticalChart.values = obj;
            chart(document.querySelector("#first"), verticalChart, true);
        }).catch(e=>{
            console.log(e)
        })

        let donutChartTournament = {type: "donut", colors: ["#00afb9", "#f07167", "#2a9d8f"]};
        API.getDonutChart(1, params.get("username"), "").then(res=>{
            if (Object.keys(res).length == 0)
                return ;

            let valueSum = 0;
            Object.keys(res).forEach(el=>{
                valueSum += res[el];
            })
            donutChartTournament.maxValue = valueSum;
            donutChartTournament.values = res;
            chart(document.querySelector("#fourth"), donutChartTournament, true);
        }).catch(e=>{
            console.log(e)
        })

        this.getUserCard();
    }
}