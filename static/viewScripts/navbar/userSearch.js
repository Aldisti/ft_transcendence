import * as API from "/API/APICall.js"
import * as NOTIFICATION from "/viewScripts/notification/notification.js"

function searchUser(input)
{
    API.getUserInfo(input).then(res=>{
		console.log(res)
      if (res != undefined)
	  {
		history.pushState(null, null, `/user/?username=${input}`)
		Router()
	  }
	  else
	  	NOTIFICATION.simple({title: "Error", body: `user ${input} is not registered!`})
    })
}

export default function handleSearchUser(){
    let inputRegex = /^[A-Za-z0-9!?*@$~_-]{1,32}$/
    let input = document.querySelector(".navBarSearchInput").value;
    console.log(input)
  
    if (inputRegex.test(input))
      searchUser(input);
    else
      alert("bad input retry...")
  }