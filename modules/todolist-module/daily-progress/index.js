const Repository = require('../../../database/repository.js')

class DailyProgress {
    constructor() {
        this.repo = new Repository('dailyProgress')
        this.repo.createTable()
    }
    
    get (item) {return this.repo.get(item)}
    create (item) {this.repo.create(item)}
    clearAll () {this.repo.clearAll()}
    remove (id) {this.repo.delete(id)}
    update (item) {this.repo.update(item)}

    increment(id, date, amount, check) {
        let item = this.get({item_id: id, date: date.getDate(), month: date.getMonth(), year:date.getYear(), check})[0]
        if (item) {
            item.amount = parseInt(item.amount) + amount
            this.update(item)
        } else {
            this.create({item_id: id, amount, check, date: date.getDate(), month: date.getMonth(), year:date.getYear()})
        } 
    }

    removeItem (id) {
        let list = this.get({item_id: id})
        list.forEach(element => {
            this.remove(element.id)
        });
    }
}

module.exports = DailyProgress