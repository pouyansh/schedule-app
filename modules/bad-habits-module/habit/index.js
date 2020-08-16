const Repository = require('../../../database/repository.js')

class Habit {
    constructor() {
        this.repo = new Repository('habits')
        this.repo.createTable()
    }
    
    get (item) {item.show = true; return this.repo.get(item)}
    getAll = () => {return this.repo.get({show: true})}
    create (item) {item.show = true; this.repo.create(item)}
    remove (id) {this.repo.update({id, show: false})}
    update = (item) => {this.repo.update(item)}

    show_habits = (increment, create_chart) => {
        let list = this.getAll()
        list.forEach(element => {
            element.d = new Date(element.last_record)
        })
        list.sort(function (a,b) {
            return b.d - a.d
        })
        
        let container = document.getElementById('container')
        list.forEach(element => {
            let total_container = document.createElement('div')
            total_container.className = "ui container border-top--grey"
    
            let header_div = document.createElement('h2')
            header_div.className = "ui header"
            let header = document.createElement('div')
            header.className = "content"
            header.innerHTML = element.name
            header_div.appendChild(header)
            let trash = document.createElement('i')
            trash.className = "trash alternate outline icon float--right red cursor--pointer"
            trash.style.fontSize = "20px"
            trash.addEventListener('dblclick', () => {
                this.remove(element.id)
            })
            header_div.appendChild(trash)
            total_container.appendChild(header_div)

            let button_div = document.createElement('div')
            button_div.setAttribute('class', 'ui buttons buttons')
            let button, div_or
            button = document.createElement('button')
            button.setAttribute('class', 'ui yellow button bold-text basic')
            button.innerHTML = '+'
            button.addEventListener('click', () => {
                let d = new Date(Date.now())
                d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0,0,0)
                this.update({id: element.id, last_record: d})
                increment(element.id, 1)
            })
            button_div.appendChild(button)
            div_or = document.createElement('div')
            div_or.setAttribute('class', 'or')
            button_div.appendChild(div_or)
    
            button = document.createElement('button')
            button.setAttribute('class', 'ui orange button bold-text basic')
            button.innerHTML = '++'
            button.addEventListener('click', () => {
                let d = new Date(Date.now())
                d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0,0,0)
                this.update({id: element.id, last_record: d})
                increment(element.id, 2)
            })
            button_div.appendChild(button)
            div_or = document.createElement('div')
            div_or.setAttribute('class', 'or')
            button_div.appendChild(div_or)
            button = document.createElement('button')
            button.setAttribute('class', 'ui negative button bold-text basic')
            button.innerHTML = '+++'
            button.addEventListener('click', () => {
                let d = new Date(Date.now())
                d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0,0,0)
                this.update({id: element.id, last_record: d})
                increment(element.id, 3)
            })
            button_div.appendChild(button)
            div_or = document.createElement('div')
            div_or.setAttribute('class', 'or')
            button_div.appendChild(div_or)
            button = document.createElement('button')
            button.setAttribute('class', 'ui green button bold-text basic')
            button.innerHTML = '-'
            button.addEventListener('click', () => {
                let d = new Date(Date.now())
                d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0,0,0)
                this.update({id: element.id, last_record: d})
                increment(element.id, -1)
            })
            button_div.appendChild(button)
            
            total_container.appendChild(button_div)
            total_container.appendChild(create_chart(element.id))
            container.appendChild(total_container)
        })
        
    }
}

module.exports = Habit