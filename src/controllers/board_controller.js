import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "boards" ]
  connect(){
    const bus = document.getElementById("event_bus")

    bus.addEventListener('refresh_board_list', (e) => { this.refreshEventListener(e) }, false);
    this.refreshEventListener(new Event("connect board"))
  }

  greet(){
    this.refreshEventListener(new Event("click greet"))
	}

  refreshEventListener(e) {
		while(this.boardsTarget.firstChild)
			this.boardsTarget.removeChild(this.boardsTarget.firstChild)
    console.log(e)
    this.getUserBoard()
    .then((boards) => {
      console.log(boards);
      for(let board of boards){
        const card = this.createTrelloBoardCard(board)
        this.boardsTarget.appendChild(card)
      }
    });
  }

  createTrelloBoardCard(board) {
    const holder = document.createElement('div');
    holder.setAttribute('class', 'col-md-3');
    const link = document.createElement('a');
    link.setAttribute('href', 'planning.html?board='+board.id);
    const card = document.createElement('div');
    card.setAttribute('class', 'mb-3 box-shadow');
    const cardBody = document.createElement('div');
    cardBody.setAttribute('class', 'card-img-top');
    let style = "background-color:"+board.prefs.backgroundColor+"; max-height:1057px; max-width:1480px; min-height:105.7px; min-width:148px; display:block; padding:10px; color:white; font-weight:bold;";
    if(board.prefs.backgroundImageScaled){
      style+=" background-image:url("+board.prefs.backgroundImageScaled[1].url+"); background-repeat: no-repeat"
      card.appendChild(cardBody);
    } 
    cardBody.setAttribute('style', style);

    const boardNameTextNode = document.createTextNode(board.name);
    const orgaNameTextNode = document.createTextNode(board.name);
    cardBody.appendChild(boardNameTextNode);

    if(board.starred){
      const starTextNode = document.createTextNode(" ★");
      cardBody.appendChild(starTextNode);
    }
    link.appendChild(cardBody);
    card.appendChild(link);

    holder.appendChild(card);

    return holder

  }


  getUserBoard() {
    return new Promise(function (fulfilled, rejected) {
      Trello.get('/members/me/boards/',	
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
