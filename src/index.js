import { Application } from "stimulus"
import { definitionsFromContext } from "stimulus/webpack-helpers"

import css from "./styles/main.css"
import cards from "./styles/cards.css"

const application = Application.start()
const context = require.context("./controllers", true, /\.js$/)
application.load(definitionsFromContext(context))

var Turbolinks = require("turbolinks")
Turbolinks.start()
