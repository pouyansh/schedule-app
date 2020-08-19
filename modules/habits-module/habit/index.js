const Repository = require('../../../database/repository.js')
const create_table = require('../../tools/table/index')

class Habit {
    constructor() {
        this.repo = new Repository('habits')
        this.repo.createTable()
    }
    
    get = (item) => {item.show = true; return this.repo.get(item)}
    getAll = () => {return this.repo.get({show: true})}
    create (item) {item.show = true; this.repo.create(item)}
    remove = (id) => {this.repo.update({id, show: false})}
    update = (item) => {this.repo.update(item)}

    show_habits = (increment, create_chart, removeItem) => {
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
            if (element.bad) {
                header_div.innerHTML = "<i class='frown outline icon'></i>"
            } else {
                header_div.innerHTML = "<i class='smile outline icon'></i>"
            }
            let header = document.createElement('div')
            header.className = "content"
            header.innerHTML = element.name
            header_div.appendChild(header)
            let trash = document.createElement('i')
            trash.className = "trash alternate outline icon font-size--little cursor--pointer little-margin"
            trash.style.fontSize = "18px"
            trash.style.padding = "1rem"
            trash.addEventListener('dblclick', () => {
                this.remove(element.id)
                removeItem(element.id)
            })
            header_div.appendChild(trash)
            total_container.appendChild(header_div)

            let button_div = document.createElement('div')
            button_div.setAttribute('class', 'ui buttons buttons')
            let button, div_or
            button = document.createElement('button')
            if (element.bad) {
                button.setAttribute('class', 'ui yellow button bold-text basic')
            } else {
                button.setAttribute('class', 'ui olive button bold-text basic')
            }
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
            if (element.bad) {
                button.setAttribute('class', 'ui orange button bold-text basic')
            } else {
                button.setAttribute('class', 'ui green button bold-text basic')
            }
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
            if (element.bad) {
                button.setAttribute('class', 'ui red button bold-text basic')
            } else {
                button.setAttribute('class', 'ui blue button bold-text basic')
            }
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
            if (element.bad) {
                button.setAttribute('class', 'ui green button bold-text basic')
            } else {
                button.setAttribute('class', 'ui red button bold-text basic')
            }
            button.innerHTML = '-'
            button.addEventListener('click', () => {
                let d = new Date(Date.now())
                d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0,0,0)
                this.update({id: element.id, last_record: d})
                increment(element.id, -1)
            })
            button_div.appendChild(button)
            
            total_container.appendChild(button_div)
            total_container.appendChild(create_chart(element))
            container.appendChild(total_container)
        })
    }

    displaySummary(getRecord) {
        let list = this.getAll()
        let table_list = []
        let now = new Date(Date.now())
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0)
        list.forEach(element => {
            let d = new Date(element.last_record)
            if (now - d == 0) {
                let rec = getRecord({date: element.last_record, habit: element.id})
                if (rec.length > 0){
                    table_list.push([element.name, rec[0].amount])
                } else {
                    table_list.push([element.name, 0])
                }
            } else {
                table_list.push([element.name, 0])
            }
        });
        return create_table(["Title", "Amount"], table_list)
    }
}

module.exports = Habit