const create_menu = require('../index')
create_menu('Bad habits')

const Habit = require('./habit/index')
let habits = new Habit()
const HabitDay = require('./habit-day/index')
let habit_day = new HabitDay()

function add_habit () {
    const form = document.getElementById('habit_form')
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let name = document.getElementById('name').value;
        let d = new Date(Date.now())
        d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0,0,0)
        let item = {name, last_record: d}
        habits.create(item)
    })
}
add_habit()

habits.show_habits(habit_day.increment, habit_day.create_chart)