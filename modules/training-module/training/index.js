const Repository = require('../../../database/repository.js')

class Training {
    constructor() {
        this.repo = new Repository('training')
        this.repo.createTable()
    }
    
    get (item) {return this.repo.get(item)}
    create (item) {this.repo.create(item)}
    clearAll () {this.repo.clearAll()}
    remove (id) {this.repo.delete(id)}
    update (item) {this.repo.update(item)}
}

module.exports = Training