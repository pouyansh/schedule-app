const Repository = require('../../../database/repository.js')

class EventCategory {
    constructor() {
        this.repo = new Repository('event-categories')
        this.repo.createTable()
    }
    
    get = (item) => {return this.repo.get(item)}
    getAll = () => {return this.repo.getAll()}
    create (item) {this.repo.create(item)}
    clearAll () {this.repo.clearAll()}
    remove (id) {this.repo.delete(id)}
    update (item) {this.repo.update(item)}
}

module.exports = EventCategory