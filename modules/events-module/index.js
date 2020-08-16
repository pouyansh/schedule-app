const create_menu = require('../index')
create_menu('Events')

const Events = require('./events/index')
let events = new Events()
const EventCategory = require('./event-category/index')
let event_category = new EventCategory()

function fill_categories () {
    let list = event_category.getAll()
    let select = document.getElementById('category')
    let option
    list.forEach(element => {
        option = document.createElement('option')
        option.setAttribute('value', element.id)
        option.innerHTML = element.name
        select.appendChild(option)
    });
}
fill_categories()

function add_event () {
    const form = document.getElementById('event_form')
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let title = document.getElementById('title').value;
        let category = document.getElementById('category').value;
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
            let item = {title, date: d, category}
            events.create(item)
        }
    })
}
add_event()

function add_category () {
    const form = document.getElementById('category_form')
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let name = document.getElementById('name').value;
        let code = document.getElementById('code').value;
        let color = document.getElementById('color').value;
        let item = {name, code, color}
        event_category.create(item)
    })
}
add_category()

events.show_events(event_category.get, "after")
events.show_events(event_category.get, "before")