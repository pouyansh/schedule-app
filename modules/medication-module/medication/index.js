const Repository = require('../../../database/repository.js')
const create_table = require('../../table/index')

class Medication {
    constructor() {
        this.repo = new Repository('medication')
        this.repo.createTable()
    }
    
    get = (item) => {return this.repo.get(item)}
    getAll = () => {return this.repo.getAll()}
    create (item) {this.repo.create(item)}
    clearAll () {this.repo.clearAll()}
    remove (id) {this.repo.delete(id)}
    update (item) {this.repo.update(item)}

    update_next_time (data) {
        let {check, medicine, hours, days, date, month, year, hour} = data
        if (check) {
            return
        }
        let d = new Date(year, month, date, hour, 0,0,0)
        let mh, md
        let m = this.get({id: parseInt(medicine)})[0]
        if(!hours && !days) {
            mh = m.hour
            md = m.day
            if(mh == "") mh = 0
            if(md == "") md = 0
        } else {
            mh = (hours == "") ? 0 : parseInt(hours)
            md = (days == "") ? 0 : parseInt(days)

        }
        d.setDate(d.getDate() + parseInt(md))
        d.setHours(d.getHours() + parseInt(mh))

        this.update({id: parseInt(medicine), next_use: d})
    }

    show_next_times () {
        let list = this.repo.getAll()
        list.forEach(element => {
            element.d = new Date(element.next_use)
        })
        list.sort(function(a, b) {
            return a.d - b.d 
        });
        let container = document.getElementById('container')
        let total_container = document.createElement('div')
        total_container.className = "ui container border-top--grey"

        let header_div = document.createElement('h2')
        header_div.className = "ui header"
        let header = document.createElement('div')
        header.className = "content"
        header.innerHTML = "List of drugs"
        header_div.appendChild(header)
        total_container.appendChild(header_div)

        let table_data = []
        list.forEach(element => {
            let d
            if (element.next_use) {
                d = new Date(element.next_use)
            }
            table_data.push([element.name, element.next_use ? (d.getMonth()+1) + "/" + d.getDate() + "--" + d.getHours() + ":00" : '-'])
        });
        total_container.appendChild(create_table(["Medicine", "Next date to use"], table_data))
        container.appendChild(total_container)
    }
}

module.exports = Medication