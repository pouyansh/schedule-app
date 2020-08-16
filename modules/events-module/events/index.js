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
}

module.exports = Events