import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "name", "lien" ]
    greet() {
			const element = this.nameTarget
			const name = element.value
			console.log(`Hello, ${name}!`)
		}
		toogleValue(element){
			if(element.innerHTML){
				if(element.innerHTML === "Hey Winner"){
					element.innerHTML = "Winning is always better"
				}else{
					element.innerHTML = "Hey Winner"
				}
			}

		}
    other() {
			const element = this.lienTarget
			console.log(element)
			this.toogleValue(element)
			console.log(`Hello, ${name}!`)
		}
}
