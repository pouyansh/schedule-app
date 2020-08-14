const DailyProgress = require('./daily-progress/index')
let d = new DailyProgress()
d.chert()

const {ipcRenderer} = require('electron')

const Repository = require('../../database/repository')
const todoRepo = new Repository('todolist')
todoRepo.createTable()

ipcRenderer.on('item:add', (_, item) => {todoRepo.create(item)})

ipcRenderer.on('item:clear', () => {todoRepo.clearAll()})

function addEntry(item) {
    const td = document.getElementById('todolist-container')
    let total_container = document.createElement('div')
    total_container.className = "ui container border-top--grey"

    let header_div = document.createElement('h2')
    header_div.className = "ui header"
    let header = document.createElement('div')
    header.className = "content"
    header.innerHTML = item.name
    header.addEventListener('dblclick', () => {
        removeItem(item)
    })
    header_div.appendChild(header)
    total_container.appendChild(header_div)

    let container = document.createElement('div')
    let color = get_color(item.progress, item.total)
    container.setAttribute('class', 'ui small progress full-length little-padding ' + color)
    container.setAttribute('data-value', parseInt(item.progress))
    container.setAttribute('data-total', parseInt(item.total))
    container.setAttribute('id', item.id)

    let bar = document.createElement('div')
    bar.setAttribute('class', 'bar')
    bar.style.width = parseInt(item.progress)/parseInt(item.total)*100 + '%'
    let progress = document.createElement('div')
    progress.setAttribute('class', 'progress')
    bar.appendChild(progress)
    container.appendChild(bar)

    let label = document.createElement('div')
    label.setAttribute('class', 'label')
    label.innerHTML = '(' + item.progress + '/' + item.total + ')'
    container.appendChild(label)
    total_container.appendChild(container)

    let button_div = document.createElement('div')
    button_div.setAttribute('class', 'ui buttons todolist__buttons')
    let button
    if(parseInt(item.progress) < parseInt(item.total)) {
        button = document.createElement('button')
        button.setAttribute('class', 'ui positive basic button bold-text')
        button.innerHTML = '+'
        button.addEventListener('click', function (){
            increment(item, '1')
        })
        button_div.appendChild(button)
        let div_or = document.createElement('div')
        div_or.setAttribute('class', 'or')
        button_div.appendChild(div_or)

        button = document.createElement('button')
        button.setAttribute('class', 'ui orange basic button bold-text')
        button.innerHTML = '-'
        button.addEventListener('click', function (){
            increment(item, '1', -1)
        })
        button_div.appendChild(button)
        div_or = document.createElement('div')
        div_or.setAttribute('class', 'or')
        button_div.appendChild(div_or)
    }
    button = document.createElement('button')
    button.setAttribute('class', 'ui primary basic button bold-text')
    button.innerHTML = '++'
    button.addEventListener('click', function (){
        increment(item, '0')
    })
    button_div.appendChild(button)

    if(parseInt(item.progress) < parseInt(item.total)) {
        div_or = document.createElement('div')
        div_or.setAttribute('class', 'or')
        button_div.appendChild(div_or)
        button = document.createElement('button')
        button.setAttribute('class', 'ui negative basic button bold-text')
        button.innerHTML = '--'
        button.addEventListener('click', function (){
            increment(item, '0', -1)
        })
        button_div.appendChild(button)
    }
    total_container.appendChild(button_div)

    td.appendChild(total_container)
}

function removeItem (item) {
    todoRepo.delete(item.id)
}

function increment (item, check, amount = 1) {
    if(check=='1') {
        if(parseInt(item.progress)+amount >= 0)
            todoRepo.update({name: item.name, progress: parseInt(item.progress)+amount, total: item.total, id: item.id})
    }
    else {
        if(parseInt(item.total)+amount >= 0) {
            todoRepo.update({name: item.name, progress: item.progress, total: parseInt(item.total)+amount, id: item.id})
        }
    }
}

// Reading data from db and writing it in the table
function displayTodolist() {
    let data = todoRepo.getAll()
    data.forEach((item, _) => {
        addEntry(item)
    })
}
displayTodolist()

// Get color of the bar
function get_color (progress, total) {
    let precentage = parseInt(progress)/parseInt(total) * 100
    if(precentage == 0) return 'grey'
    if(precentage < 20) return 'red'
    if(precentage < 40) return 'orange'
    if(precentage < 60) return 'yellow'
    if(precentage < 80) return 'olive'
    if(precentage < 99) return 'green'
    return 'blue'
}

// Add item
function add_item () {
    const form = document.getElementById('todolist_form')
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const progress = document.getElementById('progress').value;
        const total = document.getElementById('total').value;
        const item = {name, progress, total}
        ipcRenderer.send('item:add', item)
    })
}
add_item()