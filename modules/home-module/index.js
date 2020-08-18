const create_menu = require('../index')
create_menu('Home')

const Todolist = require('../todolist-module/todolist/index')
const Medication = require('../medication-module/medication/index')
let todolist = new Todolist()
let medication = new Medication()

let container = document.getElementById('container')

let total_container = document.createElement('div')
total_container.className = "ui container border-top--grey"
total_container.innerHTML = "<h3 class='ui header'><div class='content'>TODO list</div></h3>"
total_container.appendChild(todolist.displaySummary())
container.appendChild(total_container)

total_container = document.createElement('div')
total_container.className = "ui container border-top--grey"
total_container.innerHTML = "<h3 class='ui header'><div class='content'>Medication</div></h3>"
total_container.appendChild(medication.displaySummary())
container.appendChild(total_container)