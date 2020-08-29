const Repository = require('../../../database/repository.js')

class Events {
    constructor() {
        this.repo = new Repository('events')
        this.repo.createTable()
    }
    
    get = (item) => {item.show = true; return this.repo.get(item)}
    getAll = () => {return this.repo.get({show: true})}
    create (item) {item.show = true; this.repo.create(item)}
    remove (id) {this.repo.update({id, show: false})}
    update = (item) => {this.repo.update(item)}

    show_events = (getCategory, check = "after") => {
        let list = this.getAll()
        list.forEach(element => {
            element.d = new Date(element.date)
        })
        list.sort((a, b) => {
            if (check == "after")
                return a.d - b.d 
            else
                return b.d - a.d
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
        list_div.className = "ui big relaxed divided list max-height--350"
        let item, icon, content, desc, d
        new_list.forEach(element => {
            let category = getCategory({id: parseInt(element.category)})[0]
            item = document.createElement('div')
            item.className = "item"
            icon = document.createElement('i')
            icon.className = category.code + " large middle aligned icon float--left"
            icon.style.color = category.color
            content = document.createElement('div')
            content.className = "content float--right width-90"
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
            let dif = ((d - Date.now()) / (1000 * 60 * 60 * 24)).toFixed(0)
            let m = d.getMonth()+1
            if (m < 10) m = '0' + m
            let dd = d.getDate()
            if (dd < 10) dd = '0' + dd
            let hh = d.getHours()
            if (hh < 10) hh = '0' + hh
            let mm = d.getMinutes()
            if (mm < 10) mm = '0' + mm
            desc.innerHTML = m + "/" + dd  + "&nbsp;&nbsp;" + hh + ":" + mm
            if (check == "after") desc.innerHTML = desc.innerHTML + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(" + dif + " days)"
            content.appendChild(desc)
            item.appendChild(icon)
            item.appendChild(content)

            let change_div = document.createElement('div')
            change_div.setAttribute('id', 'div' + element.id)
            change_div.className = "hidden"

            let button_div = document.createElement('div')
            button_div.setAttribute('class', 'ui buttons buttons')
            
            let button = document.createElement('button')
            button.setAttribute('class', 'ui primary basic button bold-text')
            button.innerHTML = 'Reschedule'
            button.addEventListener('click', () => {
                let amount = document.getElementById("input" + element.id).value
                if (amount) {
                    let splitted = amount.split(' ')
                    if (splitted.length == 2) {
                        let date = splitted[0].split('/')
                        if (date.length == 3) {
                            let time = splitted[1].split(':')
                            if (time.length == 2) {
                                let d = new Date(parseInt(date[2]), parseInt(date[0]) - 1, parseInt(date[1]), parseInt(time[0]), parseInt(time[1]), 0,0)
                                this.update({id: element.id, date: d})
                            }
                        }
                    }
                }
            })
            button_div.appendChild(button)
            let div_or = document.createElement('div')
            div_or.setAttribute('class', 'or')
            button_div.appendChild(div_or)
            button = document.createElement('button')
            button.className = "ui red basic button"
            button.innerHTML = "Delete"
            button.addEventListener('click', ()=>{
                this.remove(element.id)
            })
            button_div.appendChild(button)
            change_div.appendChild(button_div)

            let div_input = document.createElement('div')
            div_input.className = "ui input full-length"
            let input = document.createElement('input')
            input.setAttribute('type', 'text')
            input.setAttribute('placeholder', "Enter new date (M/D/Y H:M)")
            input.setAttribute('id', 'input' + element.id)
            div_input.appendChild(input)
            change_div.appendChild(div_input)
            total_container.appendChild(change_div)

            item.appendChild(change_div)
            list_div.appendChild(item)
        })
        total_container.appendChild(list_div)

        container.appendChild(total_container)
    }

    displaySummary(getCategory) {
        let list = this.getAll()
        let now = new Date(Date.now())
        let next_week = new Date(Date.now())
        next_week.setDate(next_week.getDate() + 7)
        let list_div = document.createElement('div')
        list_div.className = "ui big relaxed divided list"
        let item, icon, content, desc, d
        list.forEach(element => {
            if (element.date != "") {
                let d = new Date(element.date)
                if (d < next_week && d > now){
                    let category = getCategory({id: parseInt(element.category)})[0]
                    item = document.createElement('div')
                    item.className = "item"
                    icon = document.createElement('i')
                    icon.className = category.code + " large middle aligned icon"
                    icon.style.color = category.color
                    content = document.createElement('div')
                    content.className = "content"
                    let header = document.createElement('div')
                    header.className = "header"
                    header.innerHTML = element.title
                    content.appendChild(header)
                    desc = document.createElement('div')
                    desc.className = "description little-margin"
                    d = new Date(element.date)
                    desc.innerHTML = (d.getMonth()+1) + "/" + d.getDate() + "  " + d.getHours() + ":" + d.getMinutes()
                    if(d.getMinutes() == 0) desc.innerHTML = desc.innerHTML + "0"
                    content.appendChild(desc)
                    item.appendChild(icon)
                    item.appendChild(content)
                    list_div.appendChild(item)
                }
                   
            }
        });
        return list_div

    }
}

module.exports = Events