const Repository = require('../../../database/repository.js')
const chart_generator = require('../../tools/chart/index')

class HabitDay {
    constructor() {
        this.repo = new Repository('habit-day')
        this.repo.createTable()
    }

    get = (item) => {item.show = true; return this.repo.get(item)}
    getAll = () => {return this.repo.get({show: true})}
    create (item) {item.show = true; this.repo.create(item)}
    remove = (id) => {this.repo.update({id, show: false})}
    update = (item) => {this.repo.update(item)}

    removeItem = (id) => {
        let list = this.get({habit: id})
        list.forEach(element => {
            this.remove(element.id)
        })
    }

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

    create_chart = (habit) => {
        let list = this.get({habit: habit.id})
        list.forEach(element => {
            element.d = new Date(element.date)
        });
        list.sort(function (a,b) {
            return a.d - b.d
        })
        if (list.length > 0) {
            let d = new Date(Date.now())
            d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0,0,0,0)
            let dif_days = (d - list[0].d)/(1000 * 60 * 60 * 24) + 1
            let chart_list = [], max = 0, prev = 0, colors = []
            if(dif_days < 28) {
                let pointer = 0
                let temp_d = new Date(list[0].d)
                for(var i = 0; i < dif_days; i ++) {
                    if (list[pointer].d - temp_d == 0){
                        chart_list.push(list[pointer].amount)
                        if (list[pointer].amount >= prev) {
                            if(habit.bad) {
                                colors.push("rgba(255,0,0,0.6)")
                            } else {
                                colors.push("rgba(35,195,0,0.6)")
                            }
                        } else if(list[pointer].amount > 2/3*prev) {
                            if(habit.bad) {
                                colors.push("rgba(255,156,0,0.6)")
                            } else {
                                colors.push("rgba(166,228,0,0.6)")
                            }
                        } else if(list[pointer].amount > 1/3*prev) {
                            if(habit.bad) {
                                colors.push("rgba(255,255,0,0.6)") 
                            } else {
                                colors.push("rgba(255,255,0,0.6)")
                            }
                        } else {
                            if(habit.bad) {
                                colors.push("rgba(35,195,0,0.6)")
                            } else {
                                colors.push("rgba(255,0,0,0.6)")
                            }
                        }
                        if (list[pointer].amount > max) max = list[pointer].amount
                        prev = list[pointer].amount
                        if (pointer < list.length - 1)
                            pointer = pointer + 1
                    } else {
                        chart_list.push(0)
                        colors.push("rgba(35,195,0,0.6)")
                    }
                    temp_d.setDate(temp_d.getDate() + 1)
                }
            } else {
                let temp_d = list[0].d
                let pointer = 0
                for(var i = 0; i < dif_days; i ++) {
                    if (list[pointer].d - temp_d == 0){
                        if (temp_d.getDay() == 0) {
                            chart_list.push(list[pointer].amount)
                            if (list[pointer].amount > max) max = list[pointer].amount
                        } else {
                            if (chart_list.length == 0) chart_list.push(0)
                            chart_list[chart_list.length - 1] = chart_list[chart_list.length - 1] + list[pointer].amount
                            if (chart_list[chart_list.length - 1] > max) max = chart_list[chart_list.length - 1]
                        }
                        pointer = pointer + 1
                    } else {
                        if (temp_d.getDay() == 0) chart_list.push(0)
                    }
                    temp_d.setDate(temp_d.getDate() + 1)
                }
            }
            return chart_generator(chart_list, max, false, colors, "habit" + habit.id)
        }
        return document.createElement('div')
    }
}

module.exports = HabitDay