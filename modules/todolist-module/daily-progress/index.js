const Repository = require('../../../database/repository.js')
const chart_generator = require('../../tools/chart/index')

class DailyProgress {
    constructor() {
        this.repo = new Repository('dailyProgress')
        this.repo.createTable()
    }
    
    get = (item) => {item.show = true; return this.repo.get(item)}
    getAll = () => {return this.repo.get({show: true})}
    create (item) {item.show = true; this.repo.create(item)}
    remove = (id) => {this.repo.update({id, show: false})}
    update = (item) => {this.repo.update(item)}

    increment(id, date, amount, check) {
        let item = this.get({item_id: id, date: date.getDate(), month: date.getMonth(), year: date.getFullYear(), check})[0]
        if (item) {
            item.amount = parseInt(item.amount) + amount
            this.update(item)
        } else {
            this.create({item_id: id, amount, check, date: date.getDate(), month: date.getMonth(), year: date.getFullYear()})
        } 
    }

    removeItem = (id) => {
        let list = this.get({item_id: id})
        list.forEach(element => {
            this.remove(element.id)
        });
    }

    createChart = (id, total) => {
        let list = this.get({item_id: id, check: '1'})
        list.forEach(element => {
            element.d = new Date(element.year, element.month, element.date, 0,0,0,0)
        })
        list.sort(function(a, b) {
            return a.d - b.d 
        });
        if (list.length > 0) {
            let d = list[0].d
            let final_list = [0]
            const diffTime = Math.abs(list[list.length - 1].d - d);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            let max = 0
            for(var i = 0; i < diffDays + 1; i ++) {
                let temp_obj = {item_id: id, check: '1', date: d.getDate(), month: d.getMonth(), year: d.getFullYear()}
                let obj = this.get(temp_obj)
                if (obj.length > 0) {
                    final_list.push(parseInt(obj[0].amount))
                    if (max < parseInt(obj[0].amount)) {
                        max = parseInt(obj[0].amount)
                    }
                } else {
                    final_list.push(0)
                }
                d.setDate(d.getDate() + 1)
            }
            return chart_generator(final_list, total)
        }
        return document.createElement('div')
    }
}

module.exports = DailyProgress