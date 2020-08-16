const Repository = require('../../../database/repository.js')
const create_table = require('../../tools/table/index')

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

    get_statistics (category) {
        let list = this.repo.get({category: category.id.toString()})
        let sum = 0, sum_calories = 0, sum_difficulties = 0
        list.forEach(element => {
            sum = sum + parseInt(element.period)
            sum_calories = sum_calories + parseInt(element.calories)
            sum_difficulties = sum_difficulties + parseInt(element.difficulty)
        });
        return {sum, sum_calories, avg_difficulty: (sum_difficulties/list.length).toFixed(1)}
    }

    get_last_five (category) {
        let list = this.repo.get({category: category.toString()})
        list.forEach(element => {
            element.d = new Date(element.year, element.month, element.date, 0,0,0,0)
        })
        list.sort(function(a, b) {
            return b.d - a.d 
        });
        if (list.length > 5) {
            let new_list = [list[0], list[1], list[2], list[3], list[4]]
            return new_list
        }
        return list
    }

    addEntry (element) {
        let list, table_creation_list = [], headers = ["Date", "Period", "Cal.", "Dif.", "Desc."]
        list = this.get_last_five(element.id)
        
        let total_container = document.createElement('div')
        total_container.className = "ui container border-top--grey"

        let header_div = document.createElement('h2')
        header_div.className = "ui header"
        let header = document.createElement('div')
        header.className = "content"
        header.innerHTML = element.name
        header_div.appendChild(header)
        total_container.appendChild(header_div)

        total_container.appendChild(this.create_statistics(element))

        list.forEach(e => {
            let dd = e.d.getDate();
            let mm = e.d.getMonth()+1;
            if(dd<10) {dd='0'+dd;}
            if(mm<10) {mm='0'+mm;}
            table_creation_list.push([mm+'/'+dd , e.period, e.calories, e.difficulty, e.description])
        });
        total_container.appendChild(create_table(headers, table_creation_list))
        return total_container
    }

    create_tables (get_table_list) {
        let container = document.getElementById('container')
        let table_list = get_table_list()
        table_list.forEach(element => {
            container.appendChild(this.addEntry(element))
        });
    }

    create_statistics (element) {
        let {sum, sum_calories, avg_difficulty} = this.get_statistics(element)
        var hours = (sum / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);

        let container = document.createElement('div')
        container.className = "ui small statistics no-margin"

        let div_statistics = document.createElement('div')
        div_statistics.className = "blue statistic"
        let value = document.createElement('div')
        value.className = "value"
        value.innerHTML = rhours + ":" + rminutes
        div_statistics.appendChild(value)
        let label = document.createElement('div')
        label.className = "label"
        label.innerHTML = "Time"
        div_statistics.appendChild(label)
        container.appendChild(div_statistics)

        div_statistics = document.createElement('div')
        div_statistics.className = "olive statistic"
        value = document.createElement('div')
        value.className = "value"
        value.innerHTML = sum_calories
        div_statistics.appendChild(value)
        label = document.createElement('div')
        label.className = "label"
        label.innerHTML = "Cal"
        div_statistics.appendChild(label)
        container.appendChild(div_statistics)

        div_statistics = document.createElement('div')
        div_statistics.className = "red statistic"
        value = document.createElement('div')
        value.className = "value"
        value.innerHTML = avg_difficulty
        div_statistics.appendChild(value)
        label = document.createElement('div')
        label.className = "label"
        label.innerHTML = "Avg. Dif."
        div_statistics.appendChild(label)
        container.appendChild(div_statistics)

        return container
    }
}

module.exports = Training