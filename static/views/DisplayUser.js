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
        API.getUserInfo(1, urlParams.get("username")).then(data=>{
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
            if (this.username == localStorage.getItem("username"))
                this.friendStatus = false;
            else{
                console.log("heyy ho controllato lo status")
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
            }              
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
                        <h3>Ranked</h3>
                            <div class="statsOverlay" id="matchOverlay">
                                <h2>No Data</h2>
                            </div>
                            <div class="canvContainer">
                                <canvas id="fourth">
                            </div>
                        </div>
                        <div class="chart">
                            <div class="statsOverlay" id="tournamentOverlay">
                                <h2>No Data</h2>
                            </div>
                            <h3>Tournaments</h3>
                                <div class="canvContainer">
                                    <canvas id="second">
                                </div>
                        </div>
                        <div class="chart">
                            <div class="statsOverlay" id="istogramOverlay">
                                <h2>No Data</h2>
                            </div>
                            <h3>Win History</h3>
                            <div class="canvContainer">
                                <canvas id="first">
                            </div>
                        </div>
                        <div class="chart">
                            <div class="canvContainer">
                                <div class="statsOverlay" id="radarOverlay">
                                    <h2>No Data</h2>
                                </div>
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

        let radarChart = {type: "radar", colors: ["#bc4749", "#6a994e", "#2a9d8f"], maxValue: 100};
        API.getPongMaestry(1, params.get("username")).then(res=>{
            let flag = true;
            let flag2 = true;
            Object.keys(res).forEach(el=>{
                console.log(res[el].win)
                if (res[el] != 0)
                    flag2 = false;
            })
            if (flag2)
                document.querySelector("#radarOverlay").style.display = "flex";
            if (Object.keys(res).length == 0)
                return ;

            Object.keys(res).forEach(el=>{
                if (res[el] != 0)
                    flag = false;
            })
            if (flag){
                
            }
            console.log(res)

            radarChart.values = res
            chart(document.querySelector("#third"), radarChart, true);
        }).catch(e=>{
            console.log(e)
        })


        let donutChartMatch = {type: "donut", colors: ["#4c956c", "#e63946", "#457b9d"]};
        API.getDonutChart(1, params.get("username"), "").then(res=>{
            let flag = true;
            Object.keys(res).forEach(el=>{
                console.log(res[el].win)
                if (res[el] != 0)
                    flag = false;
            })
            if (flag)
                document.querySelector("#matchOverlay").style.display = "flex";
            if (Object.keys(res).length == 0)
                return ;
            let valueSum = 0;
            Object.keys(res).forEach(el=>{
                res[el] *= 100;
                valueSum += res[el];
            })
            Object.keys(res).forEach(el=>{
                if (res[el] == 0)
                    res[el] = valueSum / 500;
            })
            donutChartMatch.maxValue = valueSum;
            donutChartMatch.values = res;
            chart(document.querySelector("#fourth"), donutChartMatch, true);
        }).catch(e=>{
            console.log(e)
        })

        let verticalChart = {type: "vertical", colors: ["#4c956c", "#4c956c", "#4c956c"]};
        API.getIstogram(1, params.get("username")).then(res=>{
            let flag = true;
            console.log(res)
            Object.keys(res).forEach(el=>{
                console.log(res[el].win)
                if (res[el].win != 0)
                    flag = false;
            })
            if (flag)
                document.querySelector("#istogramOverlay").style.display = "flex";
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

        let donutChartTournament = {type: "donut", colors: ["#4c956c", "#e63946", "#457b9d"]};
        API.getDonutChart(1, params.get("username"), "&tournament=true").then(res=>{
            let flag = true;
            Object.keys(res).forEach(el=>{
                console.log(res[el].win)
                if (res[el] != 0)
                    flag = false;
            })
            if (flag)
                document.querySelector("#tournamentOverlay").style.display = "flex";
            
            if (Object.keys(res).length == 0)
                return ;

            let valueSum = 0;
            Object.keys(res).forEach(el=>{
                res[el] *= 100;
                valueSum += res[el];
            })
            Object.keys(res).forEach(el=>{
                if (res[el] == 0)
                    res[el] = valueSum / 500;
            })

            donutChartTournament.maxValue = valueSum;
            console.log(res)

            donutChartTournament.values = res;
            chart(document.querySelector("#second"), donutChartTournament, true);
        }).catch(e=>{
            console.log(e)
        })

        this.getUserCard();
    }
}