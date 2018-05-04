
import { Controller } from "stimulus"

export default class extends Controller {

  static targets = [ "username","login" ]

  login() {
    const connected = this.data.get("connected");
    if(connected === "true" ){
      Trello.deauthorize();
      this.toggleConnected();
    } else {
      Trello.authorize({
        type: "popup",
        name: "Trello Remote Planning why not",
        scope: {
          read: true,
          write: true 
        },
        expiration: "never",
        success: () => this.handleLoginSuccess(),
        error: function() { console.log("Failed authentication"); }
      });
    }
  }

  connect(){
		if(localStorage.getItem("trello_token")){
			this.login();
		}
  }

  refreshEventListener(e) {
    console.log(e)
  }

  greet(){
    const bus = document.getElementById("event_bus")
    const event = new Event('refresh_board_list');
    bus.dispatchEvent(event);
  }

  handleLoginSuccess(){
    const bus = document.getElementById("event_bus")
    const event = new Event('refresh_board_list');
    this.getUserInfo()
    .then(userInfo => {
      this.toggleConnected(userInfo);
      bus.dispatchEvent(event);
    });
  }
  toggleConnected(userInfo){
    if(userInfo){
      this.usernameTarget.innerHTML = userInfo.fullName
      this.loginTarget.innerHTML = "Logout"
      this.data.set("connected", "true")
    } else {
      this.usernameTarget.innerHTML = "Not Connected"
      this.loginTarget.innerHTML = "Login"
      this.data.set("connected", "false")
    }
  }

  getUserInfo() {
    return new Promise(function (fulfilled, rejected) {
      Trello.get('/members/me/',	
        function(boards){
          fulfilled(boards);
        },
        function() { 
          rejected( new Error("Failed to load boards") );
        }
      );
   });
  }
}
