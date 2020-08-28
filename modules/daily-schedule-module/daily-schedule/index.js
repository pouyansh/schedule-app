const Repository = require('../../../database/repository.js')

class DailySchedule {
    constructor() {
        this.repo = new Repository('daily-schedule')
        this.repo.createTable()
    }
    
    get = (item) => {item.show = true; return this.repo.get(item)}
    getAll = () => {return this.repo.get({show: true})}
    create (item) {item.show = true; this.repo.create(item)}
    remove (id) {this.repo.update({id, show: false})}
    update = (item) => {this.repo.update(item)}
}

module.exports = DailySchedule