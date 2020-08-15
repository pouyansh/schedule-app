const Repository = require('../../../database/repository.js')
const create_table = require('../../table/index')

class MedicationUsed {
    constructor() {
        this.repo = new Repository('medication-used')
        this.repo.createTable()
    }
    
    get (item) {return this.repo.get(item)}
    getAll = () => {return this.repo.getAll()}
    create (item) {if(!item.check) this.repo.create(item)}
    clearAll () {this.repo.clearAll()}
    remove (id) {this.repo.delete(id)}
    update (item) {this.repo.update(item)}

    show_previous_use(getMedicine) {
        let list = this.getAll()
        list.forEach(element => {
            element.d = new Date(parseInt(element.year), parseInt(element.month), parseInt(element.date), parseInt(element.hour),0,0,0)
        })
        list.sort(function(a, b) {
            return b.d - a.d 
        });
        let new_list = []
        if (list.length > 10) {
            for (var i = 0; i < 10; i ++){
                new_list.push(list[i])
            }
        } else {
            new_list = list
        }
        let table_list = []
        new_list.forEach(element => {
            let medicine = getMedicine({id: parseInt(element.medicine)})[0]
            table_list.push([medicine.name, (parseInt(element.month)+1) + "/" + element.date , element.hour + ":00"])
        });
        let container = document.getElementById('container')
        let total_container = document.createElement('div')
        total_container.className = "ui container border-top--grey"

        let header_div = document.createElement('h2')
        header_div.className = "ui header"
        let header = document.createElement('div')
        header.className = "content"
        header.innerHTML = "Records of used drugs"
        header_div.appendChild(header)
        total_container.appendChild(header_div)

        total_container.appendChild(create_table(["Medicine", "Date used", "Hour used"], table_list))
        container.appendChild(total_container)
    }
}

module.exports = MedicationUsed