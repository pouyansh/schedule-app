const Repository = require('../../../database/repository')

class Todolist {
    constructor () {
        this.repo = new Repository('todolist')
        this.repo.createTable()
    }

    create (item) {this.repo.create(item)}
    clearAll () {this.repo.clearAll()}
    remove (item) {this.repo.delete(item.id)}
    update (item) {this.repo.update(item)}
    getAll() {this.repo.getAll()}

    // Reading data from db and writing it in the table
    displayTodolist(chart_generator) {
        let data = this.repo.getAll()
        data.forEach((item, _) => {
            this.addEntry(item, chart_generator)
        })
    }

    addEntry(item, chart_generator) {
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
        let color = this.get_color(item.progress, item.total)
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
        let div_or
        if(parseInt(item.progress) < parseInt(item.total)) {
            button = document.createElement('button')
            button.setAttribute('class', 'ui positive basic button bold-text')
            button.innerHTML = '+'
            button.addEventListener('click', function (){
                let amount = parseInt(document.getElementById("input" + item.id).value)
                if(amount)
                    increment(item, '1', amount)
                else
                    increment(item, '1', 1)
            })
            button_div.appendChild(button)
            div_or = document.createElement('div')
            div_or.setAttribute('class', 'or')
            button_div.appendChild(div_or)
    
            button = document.createElement('button')
            button.setAttribute('class', 'ui orange basic button bold-text')
            button.innerHTML = '-'
            button.addEventListener('click', function (){
                let amount = parseInt(document.getElementById("input" + item.id).value)
                if(amount)
                    increment(item, '1', -amount)
                else
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
            let amount = parseInt(document.getElementById("input" + item.id).value)
                if(amount)
                    increment(item, '0', amount)
                else
                    increment(item, '0', 1)
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
                let amount = parseInt(document.getElementById("input" + item.id).value)
                if(amount)
                    increment(item, '0', -amount)
                else
                    increment(item, '0', -1)
            })
            button_div.appendChild(button)
        }
        total_container.appendChild(button_div)

        let div_input = document.createElement('div')
        div_input.className = "ui input full-length"
        let input = document.createElement('input')
        input.setAttribute('type', 'number')
        input.setAttribute('placeholder', "Enter amount of change (empty equals 1)")
        input.setAttribute('id', 'input' + item.id)
        div_input.appendChild(input)
        total_container.appendChild(div_input)

        total_container.appendChild(chart_generator(item.id, parseInt(item.total)))
    
        td.appendChild(total_container)
    }

    // Get color of the bar
    get_color (progress, total) {
        let precentage = parseInt(progress)/parseInt(total) * 100
        if(precentage == 0) return 'grey'
        if(precentage < 20) return 'red'
        if(precentage < 40) return 'orange'
        if(precentage < 60) return 'yellow'
        if(precentage < 80) return 'olive'
        if(precentage < 99) return 'green'
        return 'blue'
    }
}

module.exports = Todolist