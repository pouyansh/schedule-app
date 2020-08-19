const create_menu = require('../index')
create_menu('Home')

const Todolist = require('../todolist-module/todolist/index')
const Medication = require('../medication-module/medication/index')
const Events = require('../events-module/events')
const EventCategory = require('../events-module/event-category')
const Training = require('../training-module/training')
const TrainingList = require('../training-module/training-list')
const Habit = require('../habits-module/habit')
const HabitDay = require('../habits-module/habit-day')
let todolist = new Todolist()
let medication = new Medication()
let events_category = new EventCategory()
let event = new Events()
let training = new Training()
let training_list = new TrainingList()
let habit = new Habit()
let habit_day = new HabitDay()

let container = document.getElementById('container')

let total_container = document.createElement('div')
total_container.className = "ui container border-top--grey"
total_container.innerHTML = "<h2 class='ui header'><div class='content'>TODO list</div></h2>"
total_container.appendChild(todolist.displaySummary())
container.appendChild(total_container)

total_container = document.createElement('div')
total_container.className = "ui container border-top--grey"
total_container.innerHTML = "<h2 class='ui header'><div class='content'>Medication</div></h2>"
total_container.appendChild(medication.displaySummary())
container.appendChild(total_container)

total_container = document.createElement('div')
total_container.className = "ui container border-top--grey"
total_container.innerHTML = "<h2 class='ui header'><div class='content'>Events</div></h2>"
total_container.appendChild(event.displaySummary(events_category.get))
container.appendChild(total_container)

total_container = document.createElement('div')
total_container.className = "ui container border-top--grey"
total_container.innerHTML = "<h2 class='ui header'><div class='content'>Work out</div></h2>"
total_container.appendChild(training.displaySummary(training_list.getAll))
container.appendChild(total_container)

total_container = document.createElement('div')
total_container.className = "ui container border-top--grey"
total_container.innerHTML = "<h2 class='ui header'><div class='content'>Habits</div></h2>"
total_container.appendChild(habit.displaySummary(habit_day.get))
container.appendChild(total_container)