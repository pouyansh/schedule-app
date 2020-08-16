const Repository = require('../../../database/repository.js')
const create_list = require('../../tools/list/index')

class MedicationUsed {
    constructor() {
        this.repo = new Repository('medication-used')
        this.repo.createTable()
    }
    
    get = (item) => {return this.repo.get(item)}
    getAll = () => {return this.repo.getAll()}
    create (item) {if(!item.check) this.repo.create(item)}
    clearAll () {this.repo.clearAll()}
    remove (id) {this.repo.delete(id)}
    update (item) {this.repo.update(item)}

    show_previous_use(medicine, change_next, remove) {
        let list = this.get({medicine: medicine.id.toString()})
        list.forEach(element => {
            element.d = new Date(parseInt(element.year), parseInt(element.month), parseInt(element.date), parseInt(element.hour),0,0,0)
        })
        list.sort(function(a, b) {
            return b.d - a.d 
        });
        let table_list = []
        list.forEach(element => {
            table_list.push((parseInt(element.month)+1) + "/" + element.date + "/" + element.year + "--" + element.hour + ":00")
        });
        let container = document.getElementById('container')
        let total_container = document.getElementById('container_prev_use')
        if (!total_container) {
            total_container = document.createElement('div')
            total_container.setAttribute('id', 'container_prev_use')
            total_container.className = "ui container border-top--grey"
        }
        total_container.innerHTML = ''
        let header_div = document.createElement('h2')
        header_div.className = "ui header"
        let header = document.createElement('div')
        header.className = "content"
        header.innerHTML = "Records about " + medicine.name
        header_div.appendChild(header)
        total_container.appendChild(header_div)

        total_container.appendChild(create_list(table_list))

        let button_div = document.createElement('div')
        button_div.setAttribute('class', 'ui buttons buttons')
        let button = document.createElement('button')
        button.className = "ui blue basic button"
        button.innerHTML = "Change next use"
        button.addEventListener('click', ()=>{
            let next_use = document.getElementById('next_use').value
            change_next({medicine, next_use})
        })
        button_div.appendChild(button)
        let div_or = document.createElement('div')
        div_or.setAttribute('class', 'or')
        button_div.appendChild(div_or)
        button = document.createElement('button')
        button.className = "ui red basic button"
        button.innerHTML = "Delete medicine"
        button.addEventListener('dblclick', ()=>{
            remove(medicine)
        })
        button_div.appendChild(button)
        total_container.appendChild(button_div)

        let div_input = document.createElement('div')
        div_input.className = "ui input little-margin full-length"
        let input = document.createElement('input')
        input.setAttribute('id', 'next_use')
        input.setAttribute('type', 'text')
        input.setAttribute('placeholder', 'Next use (M:D:Y:H) (Empty = no next use)') 
        div_input.appendChild(input)
        total_container.appendChild(div_input)

        container.appendChild(total_container)
    }
}

module.exports = MedicationUsed