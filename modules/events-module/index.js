const create_menu = require('../index')
create_menu('Events')

const Events = require('./events/index')
let events = new Events()

// Add event form
function add_medicine () {
    const form = document.getElementById('event_form')
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let title = document.getElementById('title').value;
        let hour = document.getElementById('hour').value;
        let date = document.getElementById('date').value;
        let month = document.getElementById('month').value;
        let year = document.getElementById('year').value;
        let d = new Date(Date.now())
        if (year == "") year = d.getFullYear()
        if (month == "") month = d.getMonth() + 1
        if (date == "") date = d.getDate()
        if (hour == "") hour = d.getHours() + ":" + d.getMinutes()
        let splitted = hour.split(':')
        if (splitted.length == 2) {
            d = new Date(parseInt(year), parseInt(month) - 1, parseInt(date), parseInt(splitted[0]), parseInt(splitted[1]), 0,0)
            let item = {title, date: d}
            events.create(item)
        }
    })
}
add_medicine()