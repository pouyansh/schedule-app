const DailyProgress = require('./daily-progress/index')
const Todolist = require('./todolist/index')

const {ipcRenderer} = require('electron')
ipcRenderer.on('item:add', (_, item) => {todolist.create(item)})
ipcRenderer.on('item:clear', () => {todolist.clearAll();daily_progress.clearAll()})

let daily_progress = new DailyProgress()
let todolist = new Todolist()
todolist.displayTodolist(daily_progress.createChart)

function removeItem (item) {
    todolist.remove(item)
    daily_progress.removeItem(item.id)
}
function increment (item, check, amount) {
    if(check=='1') {
        if(parseInt(item.progress)+amount >= 0 && parseInt(item.progress)+amount <= parseInt(item.total)) {
            todolist.update({name: item.name, progress: parseInt(item.progress)+amount, total: item.total, id: item.id})
            let d = new Date()
            daily_progress.increment(item.id, d, amount, check)
        }
    }
    else {
        if(parseInt(item.total)+amount >= 0) {
            todolist.update({name: item.name, progress: item.progress, total: parseInt(item.total)+amount, id: item.id})
            let d = new Date()
            daily_progress.increment(item.id, d, amount, check)
        }
    }
}

// Add item form
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