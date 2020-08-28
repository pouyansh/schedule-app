const create_menu = require('../index')
create_menu('Daily schedule')

const DailySchedule = require('./daily-schedule')
let daily_schedule = new DailySchedule()

function change_form_type () {
    let select = document.getElementById('type')
    let section1 = document.getElementById('section1')
    let section2 = document.getElementById('section2')
    select.addEventListener('change', () => {
        if (select.value == "1") {
            section1.className = "show"
            section2.className = "hidden"
        }
        if (select.value == "2") {
            section2.className = "show"
            section1.className = "hidden"
        }
    })
}
change_form_type()

function add_task () {
    const form = document.getElementById('task_form')
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let title = document.getElementById('title').value;
        let date = document.getElementById('date').value;
        let splitted = date.split('/')
        if (splitted.length == 3) {
            let d = new Date(parseInt(splitted[2]), parseInt(splitted[0]) - 1, parseInt(splitted[1]), 0,0,0,0)
            let type = document.getElementById('type').value;
            let start = document.getElementById('start').value;
            let finish = document.getElementById('finish').value;
            let duration = document.getElementById('duration').value;

            let item = {title, date: d, type, start, finish, duration}
            daily_schedule.create(item)
        }
    })
}
add_task()