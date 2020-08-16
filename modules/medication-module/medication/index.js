const Repository = require('../../../database/repository.js')
const create_table = require('../../table/index')

class Medication {
    constructor() {
        this.repo = new Repository('medication')
        this.repo.createTable()
    }
    
    get = (item) => {return this.repo.get(item)}
    getAll = () => {return this.repo.get({show: true})}
    create (item) {this.repo.create(item)}
    clearAll () {this.repo.clearAll()}
    remove = (item) => {this.repo.update({id: item.id, show: false})}
    update (item) {this.repo.update(item)}

    change_next_time = (item) => {
        let {medicine, next_use} = item
        if(next_use === "") {
            this.update({id: medicine.id, next_use: ""})
        } else {
            let splitted = next_use.splitted(":")
            if (splitted.length == 4) {
                let d = new Date(parseInt(splitted[2], parseInt(splitted[0])-1, parseInt(splitted[1]), parseInt(splitted[3]), 0,0,0))
                this.update({id: medicine.id, next_use: d})
            }
        }
    }

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

    show_next_times (getMedicationUsed, showPrevTable) {
        let list = this.getAll()
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
            let used = getMedicationUsed({medicine: element.id.toString()})
            used.forEach(e => {
                e.d = new Date(parseInt(e.year), parseInt(e.month), parseInt(e.date), parseInt(e.hour), 0,0,0)
            })
            used.sort(function(a, b) {
                return b.d - a.d 
            });
            let prev_use = ""
            if(used.length > 0)
                prev_use = (parseInt(used[0].month)+1) + "/" + used[0].date + "--" + used[0].hour + ":00"
            // for(var i = 0; i < Math.min(5, used.length); i ++) {
            //     prev_use = prev_use + (parseInt(used[i].month)+1) + "/" + used[i].date + "--" + used[i].hour + ":00<br>"
            // }
            let d
            if (element.next_use) {
                d = new Date(element.next_use)
            }
            table_data.push([element.name, element.next_use ? (d.getMonth()+1) + "/" + d.getDate() + "--" + d.getHours() + ":00" : '-', prev_use])
        });
        total_container.appendChild(create_table(["Medicine", "Next date to use", "Last time used"], table_data, showPrevTable))
        container.appendChild(total_container)
    }
}

module.exports = Medication