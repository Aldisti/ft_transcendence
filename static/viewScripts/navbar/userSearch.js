import * as API from "/API/APICall.js"
import * as NOTIFICATION from "/viewScripts/notification/notification.js"

function searchUser(input)
{
    API.getUserInfo(window.escapeHtml(input)).then(res=>{
      if (res != undefined)
	  {
		history.pushState(null, null, `/user/?username=${window.escapeHtml(input)}`)
		Router()
	  }
	  else
	  	NOTIFICATION.simple({title: "Error", body: `user ${window.escapeHtml(input)} is not registered!`})
    })
}

export default function handleSearchUser(){
    let inputRegex = /^[A-Za-z0-9!?*@$~_-]{1,32}$/
    let input = document.querySelector(".navBarSearchInput").value;
    console.log(input)
  
    // if (inputRegex.test(input))
      searchUser(input);
    // else
    //   alert("bad input retry...")
  }