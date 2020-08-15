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

    get_total_time (category) {
        let list = this.repo.get({category: toString(category)})
        let sum = 0
        list.forEach(element => {
            sum = sum + element.period
        });
        return sum
    }

    get_last_five (category) {
        let list = this.repo.get({category: toString(category)})
        if (list.length > 5) {
            let new_list = [list[0], list[1], list[2], list[3], list[4]]
            return new_list
        }
        return list
    }
}

module.exports = Training