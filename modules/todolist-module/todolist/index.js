const Repository = require('../../../database/repository')

class Todolist {
    constructor () {
        this.repo = new Repository('todolist')
        this.repo.createTable()
    }

    get = (item) => {item.show = true; return this.repo.get(item)}
    getAll = () => {return this.repo.get({show: true})}
    create (item, increment) {
        item.show = true
        this.repo.create(item)
        if (item.progress > 0) {
            increment(item.id, new Date(Date.now()), item.progress, '1')
        }
    }
    remove (id) {this.repo.update({id, show: false})}
    update = (item) => {this.repo.update(item)}

    // Reading data from db and writing it in the table
    displayTodolist(chart_generator, removeItem) {
        let data = this.getAll()
        data.forEach((item, _) => {
            this.addEntry(item, chart_generator, removeItem)
        })
    }

    addEntry(item, chart_generator, removeItem) {
        const td = document.getElementById('todolist-container')
        let total_container = document.createElement('div')
        total_container.className = "ui container border-top--grey"
    
        let header_div = document.createElement('h2')
        header_div.className = "ui header"
        let header = document.createElement('div')
        header.className = "content"
        header.innerHTML = item.name
        header_div.appendChild(header)
        let trash = document.createElement('i')
        trash.className = "trash alternate outline icon float--right red cursor--pointer"
        trash.style.fontSize = "20px"
        trash.addEventListener('dblclick', () => {
            this.remove(item.id)
            removeItem(item.id)
        })
        header_div.appendChild(trash)
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
        button_div.setAttribute('class', 'ui buttons buttons')
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
            let input = document.getElementById("input" + item.id)
            let amount
            if (input) {
                amount = parseInt(input.value)
            } else {
                amount = 1
            }
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

        if(parseInt(item.progress) < parseInt(item.total)) {
            let div_input = document.createElement('div')
            div_input.className = "ui input full-length"
            let input = document.createElement('input')
            input.setAttribute('type', 'number')
            input.setAttribute('placeholder', "Enter amount of change (empty equals 1)")
            input.setAttribute('id', 'input' + item.id)
            div_input.appendChild(input)
            total_container.appendChild(div_input)
        }

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

    displaySummary () {
        let div = document.createElement('div')
        div.className = "ui container"
        let table = document.createElement('table')
        table.className = "ui single line table table-layout--fixed"
        table.innerHTML = "<thead><tr><th>Title</th><th>Progress</th></tr></thead>"
        let tbody = document.createElement('tbody')
        let list = this.getAll()
        let counter = 1
        list.forEach(element => {
            if (parseInt(element.progress) < parseInt(element.total)) {
                let tr = document.createElement('tr')
                counter += 1
                let td = document.createElement('td')
                td.innerHTML = element.name
                tr.appendChild(td)
                td = document.createElement('td')
                
                let container = document.createElement('div')
                let color = this.get_color(element.progress, element.total)
                container.setAttribute('class', 'ui tiny progress full-length little-padding ' + color)
                container.setAttribute('data-value', parseInt(element.progress))
                container.setAttribute('data-total', parseInt(element.total))
                container.setAttribute('id', element.id)
            
                let bar = document.createElement('div')
                bar.setAttribute('class', 'bar')
                bar.style.width = parseInt(element.progress)/parseInt(element.total)*100 + '%'
                let progress = document.createElement('div')
                progress.setAttribute('class', 'progress')
                bar.appendChild(progress)
                container.appendChild(bar)
            
                let label = document.createElement('div')
                label.setAttribute('class', 'label')
                label.innerHTML = element.name + ' (' + element.progress + '/' + element.total + ')'
                container.appendChild(label)
                td.appendChild(container)

                tr.appendChild(td)
                tbody.appendChild(tr)
            }
        })
        table.appendChild(tbody)
        div.appendChild(table)
        return(div)
    }
}

module.exports = Todolist