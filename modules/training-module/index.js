const Training = require('./training/index')
let training = new Training()
const TrainingList = require('./training-list/index')
let training_list = new TrainingList()


const {ipcRenderer} = require('electron')
ipcRenderer.on('training:add_category', (_, item) => {training_list.create(item)})
ipcRenderer.on('training:add', (_, item) => {training.create(item)})

const create_menu = require('../index')
create_menu('Training')

// Filling select_training
function fill_select_training () {
    let list = training_list.getAll()
    let select = document.getElementById('select_training')
    let option
    list.forEach(element => {
        option = document.createElement('option')
        option.setAttribute('value', element.id)
        option.innerHTML = element.name
        select.appendChild(option)
    });
}
fill_select_training()

// Add training form
function add_training () {
    const form = document.getElementById('training_form')
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = document.getElementById('select_training').value;
        const date = document.getElementById('date').value;
        const period = document.getElementById('period').value;
        const calories = document.getElementById('calories').value;
        const difficulty = document.getElementById('difficulty').value;
        const description = document.getElementById('description').value;
        let splitted = date.split('/')
        let item
        if (date) {
            item = {category, date: splitted[1], month: parseInt(splitted[0])-1, year: splitted[2], period, calories, difficulty, description}
        } else {
            let d = new Date(Date.now())
            item = {category, date: d.getDate(), month: d.getMonth(), year: d.getFullYear(), period, calories, difficulty, description}
        }
        ipcRenderer.send('training:add', item)
    })
}
add_training()

// Add category form
function add_category () {
    const form = document.getElementById('training-category-form')
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const item = {name}
        ipcRenderer.send('training:add_category', item)
    })
}
add_category()

training.create_tables(training_list.getAll)