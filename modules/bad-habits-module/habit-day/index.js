const Repository = require('../../../database/repository.js')
const chart_generator = require('../../tools/chart/index')

class HabitDay {
    constructor() {
        this.repo = new Repository('habit-day')
        this.repo.createTable()
    }

    get = (item) => {return this.repo.get(item)}
    getAll = () => {return this.repo.getAll()}
    create (item) {this.repo.create(item)}
    clearAll () {this.repo.clearAll()}
    remove (id) {this.repo.delete(id)}
    update (item) {this.repo.update(item)}

    increment = (habit_id, amount) => {
        let d = new Date(Date.now())
        d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0,0,0)
        let res = this.get({habit: habit_id})
        let record
        res.forEach(element => {
            let temp_d = new Date(element.date)
            if (temp_d - d == 0) {
                record = element
            }
        });
        if (!record) {
            this.create({habit: habit_id, amount, date: d})
        } else {
            this.update({id: record.id, amount: record.amount + amount})
        }
    }

    create_chart = (habit_id) => {
        let list = this.get({habit: habit_id})
        list.forEach(element => {
            element.d = new Date(element.date)
        });
        list.sort(function (a,b) {
            return a.d - b.d
        })
        let dif_days = (list[0].d - list[list.length-1].d)/(1000 * 60 * 60 * 24) + 1
        let chart_list = [], max = 0, prev = 0, colors = []
        if(dif_days < 28) {
            list.forEach(element => {
                chart_list.push(element.amount)
                if (element.amount > prev) {
                    colors.push("rgba(255,0,0,0.6)")
                } else if(element.amount > 2/3*prev) {
                    colors.push("rgba(255,156,0,0.6)")
                } else if(element.amount > 1/3*prev) {
                    colors.push("rgba(255,255,0,0.6)")
                } else {
                    colors.push("rgba(35,195,0,0.6)")
                }
                if (element.amount > max) max = element.amount
                prev = element.amount
            })
        }
        return chart_generator(chart_list, max, false, colors)
    }
}

module.exports = HabitDay