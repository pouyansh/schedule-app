const Repository = require('../../../database/repository.js')

class Events {
    constructor() {
        this.repo = new Repository('events')
        this.repo.createTable()
    }
    
    get (item) {return this.repo.get(item)}
    getAll = () => {return this.repo.getAll()}
    create (item) {this.repo.create(item)}
    clearAll () {this.repo.clearAll()}
    remove (id) {this.repo.delete(id)}
    update (item) {this.repo.update(item)}

    show_events(getCategory, check = "after") {
        let list = this.getAll()
        list.forEach(element => {
            element.d = new Date(element.date)
        })
        list.sort(function(a, b) {
            return a.d - b.d 
        });
        list.forEach(element => {
            element.cat = getCategory({id: parseInt(element.category)})
        });
        let new_list = []
        let now = Date.now()
        for (var i = 0 ; i < list.length; i ++) {
            if (check == "after" && list[i].d >= now) {
                new_list.push(list[i])
            }
            if (check == "before" && list[i].d <= now && new_list.length < 10) {
                new_list.push(list[i])
            }
        }
        let container = document.getElementById('container')
        let total_container = document.createElement('div')
        total_container.className = "ui container border-top--grey"

        let header_div = document.createElement('h2')
        header_div.className = "ui header"
        let header = document.createElement('div')
        header.className = "content"
        if (check == "after")
            header.innerHTML = "Incoming events"
        else 
            header.innerHTML = "Previous events"
        header_div.appendChild(header)
        total_container.appendChild(header_div)

        let list_div = document.createElement('div')
        list_div.className = "ui big relaxed divided list"
        let item, icon, content, desc, d
        new_list.forEach(element => {
            let category = getCategory({id: parseInt(element.category)})[0]
            item = document.createElement('div')
            item.className = "item"
            icon = document.createElement('i')
            icon.className = category.code + " large middle aligned icon"
            icon.style.color = category.color
            content = document.createElement('div')
            content.className = "content"
            header = document.createElement('div')
            header.className = "header cursor--pointer"
            header.innerHTML = element.title
            header.addEventListener('click', () => {
                let div = document.getElementById('div' + element.id)
                if (div.className == "show") {
                    div.className = "hidden"
                } else {
                    div.className = "show"
                }
            })
            content.appendChild(header)
            desc = document.createElement('div')
            desc.className = "description little-margin"
            d = new Date(element.date)
            desc.innerHTML = (d.getMonth()+1) + "/" + d.getDate() + "  " + d.getHours() + ":" + d.getMinutes()
            if(d.getMinutes() == 0) desc.innerHTML = desc.innerHTML + "0"
            content.appendChild(desc)
            item.appendChild(icon)
            item.appendChild(content)

            let change_div = document.createElement('div')
            change_div.setAttribute('id', 'div' + element.id)
            change_div.className = "hidden"

            let button_div = document.createElement('div')
            button_div.setAttribute('class', 'ui buttons buttons')
            
            let button = document.createElement('button')
            button.className = "ui red basic button"
            button.innerHTML = "Delete"
            button.addEventListener('click', ()=>{
                this.remove(element.id)
            })
            button_div.appendChild(button)
            change_div.appendChild(button_div)
            total_container.appendChild(change_div)

            item.appendChild(change_div)
            list_div.appendChild(item)
        })
        total_container.appendChild(list_div)

        container.appendChild(total_container)
    }
}

module.exports = Events