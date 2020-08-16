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

    show_events(getCategory) {
        let list = this.getAll()
        list.sort(function(a, b) {
            return a.date - b.date 
        });
        list.forEach(element => {
            element.cat = getCategory({id: parseInt(element.category)})
        });
        let container = document.getElementById('container')
        let total_container = document.createElement('div')
        total_container.className = "ui container border-top--grey"

        container.appendChild(total_container)
    }
}

module.exports = Events