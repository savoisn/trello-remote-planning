import { Controller } from "stimulus"
import { removeChilds } from '../lib/dom'

export default class extends Controller {

  static targets = ["backlog", "cardList", "cardName", "cardDesc", "button"]
  cardIdParamName = "cardId"
  listIdParamName = "listId"

  connect(){
		console.log("GO");
    var urlParams = new URLSearchParams(window.location.search);
    const boardId = urlParams.get('board');
    const cardId = urlParams.get(this.cardIdParamName);
    const listId = urlParams.get(this.listIdParamName);
    this.getBoardLists(boardId)
    .then((lists) => {
      removeChilds(this.backlogTarget);
      for(var list of lists){
        this.backlogTarget.appendChild(new Option(list.name, list.id));
      }
      if(listId){
        this.backlogTarget.value=listId;
        this.listCard(listId);
      }
    })
    .then(() => {
      if(cardId){
        this.getCard(cardId)
        .then((card) => {
          this.cardNameTarget.value=card.name
          this.cardDescTarget.value=card.desc
        });
      };
    });
  }

  selectList(){
    const listId = this.backlogTarget.value;
    this.listCard(listId)
  }

  listCard(listId){
    this.getTicketsFromLists(listId)
    .then((cards)=>{
      console.log(cards);
      removeChilds(this.cardListTarget);
			for(let card of cards){
				let cardEl = this.createCardElem(card);
				this.cardListTarget.appendChild(cardEl);
			}
      this.handleHistory(this.listIdParamName,listId)
    });
  }

  selectComplexity(){
		const complexityCard = event.currentTarget;
    this.resetCards(this.buttonTargets)
    if(!complexityCard.classList.contains("selected")){
      complexityCard.classList.add("selected")
      this.data.set("complexity", null);
    } else {
      complexityCard.classList.remove("selected")
      this.data.set("complexity", complexityCard.getAttribute("complexity"));
    }
  }

  resetCards(buttons){
    for(const button of buttons){
      if(button.classList.contains("selected")){
        button.classList.remove("selected")
      }
    }
  }

  selectCard(event){
		event.preventDefault()
		const cardId = event.currentTarget.getAttribute("data-planning-id")

    this.getCard(cardId)
    .then((card) => {
      console.log(card)
      this.cardNameTarget.value=card.name
      this.cardDescTarget.value=card.desc
      this.handleHistory(this.cardIdParamName,card.id)
    });
		
	}

  handleHistory(itemName, value){
    var url = new URL(window.location);
    url.searchParams.set(itemName, value);
    const obj = { itemName: value }
    history.pushState(obj, value, url.toString());

    console.log(url.toString());
  }

	createCardElem(card){
		const a = document.createElement("a")
		a.setAttribute("href","#");
		a.setAttribute("data-action","click->planning#selectCard");
		a.setAttribute("data-planning-id",card.id);
		const li = document.createElement("li");
		li.setAttribute("class","list-group-item d-flex justify-content-between lh-condensed");
		const div = document.createElement("div");
		const title = document.createTextNode(card.name)
		div.appendChild(title);
		li.appendChild(div)
		a.appendChild(li)

		return a;
	}

  getCard(cardId){
    return new Promise(function (fulfilled, rejected) {
      Trello.get('/cards/'+cardId,	
        function(card){
          fulfilled(card);
        },
        function() { 
          rejected( new Error("Failed to load card") );
        }
      );
    });
  }

  getTicketsFromLists(listId){
    return new Promise(function (fulfilled, rejected) {
      Trello.get('/lists/'+listId+'/cards',	
        function(cards){
          fulfilled(cards);
        },
        function() { 
          rejected( new Error("Failed to load cards from list") );
        }
      );
    });
  }

  getBoardLists(boardId){
    return new Promise(function (fulfilled, rejected) {
      Trello.get('/boards/'+boardId+'/lists',	
        function(lists){
          fulfilled(lists);
        },
        function() { 
          rejected( new Error("Failed to load lists from board") );
        }
      );
    });
  }

}

