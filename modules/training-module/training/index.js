const Repository = require('../../../database/repository.js')
const create_table = require('../../tools/table/index')
const chart_generator = require('../../tools/chart/index')

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

    get_statistics (category, check) {
        let list = this.repo.get({category: category.id.toString()})
        list.forEach(element => {
            element.d = new Date(parseInt(element.year), parseInt(element.month), parseInt(element.date), 0,0,0,0)
        })
        let sum = 0, sum_calories = 0, sum_difficulties = 0, num = 0, table_creation_list = []
        let chart_period_list = [0,0,0,0,0,0,0], chart_cal_list = [0,0,0,0,0,0,0]
        if (check == 1) {
            let now = new Date(Date.now())
            now = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0)
            let max_dif = 0
            list.forEach(element => {
                if (max_dif < (now-element.d) / (1000*60*60*24) + 1) max_dif = (now-element.d) / (1000*60*60*24) + 1
                sum = sum + parseInt(element.period)
                sum_calories = sum_calories + parseInt(element.calories)
                sum_difficulties = sum_difficulties + parseInt(element.difficulty)
                num = num + 1
                let dd = element.d.getDate();
                let mm = element.d.getMonth()+1;
                if(dd<10) {dd='0'+dd;}
                if(mm<10) {mm='0'+mm;}
                table_creation_list.push([mm+'/'+dd , element.period, element.calories, element.difficulty, element.description])
            });
            chart_period_list = []
            chart_cal_list = []
            for (var i = 0; i < max_dif; i ++ ) {
                chart_period_list.push(0)
                chart_cal_list.push(0)
            }
            list.forEach(element => {
                chart_cal_list[max_dif - (now-element.d) / (1000*60*60*24) - 1] = element.calories
                chart_period_list[max_dif - (now-element.d) / (1000*60*60*24) - 1] = element.period
            });
        } else if(check == 2) {
            let now = new Date(Date.now())
            list.forEach(element => {
                if ((now - element.d) / (1000 * 60 * 60 * 24) < 7 && now.getDay() > element.d.getDay()) {
                    sum = sum + parseInt(element.period)
                    sum_calories = sum_calories + parseInt(element.calories)
                    sum_difficulties = sum_difficulties + parseInt(element.difficulty)
                    num = num + 1
                    let dd = element.d.getDate();
                    let mm = element.d.getMonth()+1;
                    if(dd<10) {dd='0'+dd;}
                    if(mm<10) {mm='0'+mm;}
                    table_creation_list.push([mm+'/'+dd , element.period, element.calories, element.difficulty, element.description])
                    chart_period_list[element.d.getDay()] = element.period
                    chart_cal_list[element.d.getDay()] = element.calories
                }
            });
        } else {
            let now = new Date(Date.now())
            console.log(now.getDay())
            now.setDate(now.getDate() - now.getDay() - 1)
            console.log(now)
            list.forEach(element => {
                if ((now - element.d) / (1000 * 60 * 60 * 24) < 7 && (now - element.d) / (1000 * 60 * 60 * 24) > 0 && now.getDay() >= element.d.getDay()) {
                    sum = sum + parseInt(element.period)
                    sum_calories = sum_calories + parseInt(element.calories)
                    sum_difficulties = sum_difficulties + parseInt(element.difficulty)
                    num = num + 1
                    let dd = element.d.getDate();
                    let mm = element.d.getMonth()+1;
                    if(dd<10) {dd='0'+dd;}
                    if(mm<10) {mm='0'+mm;}
                    table_creation_list.push([mm+'/'+dd , element.period, element.calories, element.difficulty, element.description])
                    chart_period_list[element.d.getDay()] = element.period
                    chart_cal_list[element.d.getDay()] = element.calories
                }
            });
        }
        return {sum, sum_calories, avg_difficulty: (sum_difficulties/num).toFixed(1), len: num, table_creation_list, chart_cal_list, chart_period_list}
    }

    addEntry (element) {
        let headers = ["Date", "Period", "Cal.", "Dif.", "Desc."]
        
        let total_container = document.createElement('div')
        total_container.className = "ui container border-top--grey"

        let header_div = document.createElement('h2')
        header_div.className = "ui header"
        let header = document.createElement('div')
        header.className = "content cursor--pointer"
        header.innerHTML = element.name
        header.addEventListener('click', () => {
            let det = document.getElementById('detail' + element.id)
            if (det.className == "hidden") det.className = "show"
            else det.className = "hidden"
        })
        header_div.appendChild(header)
        total_container.appendChild(header_div)

        total_container.appendChild(this.create_statistics(element, 2))
        let result = this.get_statistics(element, 2)
        total_container.appendChild(create_table(headers, result.table_creation_list))
        
        let det_container = document.createElement('div')
        det_container.className = "hidden"
        det_container.setAttribute('id', "detail" + element.id)

        det_container.appendChild(chart_generator(result.chart_cal_list, Math.max(...result.chart_cal_list), false, [], "cal2" + element.id))
        det_container.appendChild(chart_generator(result.chart_period_list, Math.max(...result.chart_period_list), false, "per2" + element.id))

        let line = document.createElement('div')
        line.className = "line--grey-tiny"
        det_container.appendChild(line)
        det_container.appendChild(this.create_statistics(element, 3))
        result = this.get_statistics(element, 3)
        det_container.appendChild(create_table(headers, result.table_creation_list))
        det_container.appendChild(chart_generator(result.chart_cal_list, Math.max(...result.chart_cal_list), false, [], "cal3" + element.id))
        det_container.appendChild(chart_generator(result.chart_period_list, Math.max(...result.chart_period_list), false, "per3" + element.id))

        line = document.createElement('div')
        line.className = "line--grey-tiny"
        det_container.appendChild(line)
        det_container.appendChild(this.create_statistics(element, 1))
        result = this.get_statistics(element, 1)
        det_container.appendChild(create_table(headers, result.table_creation_list))
        det_container.appendChild(chart_generator(result.chart_cal_list, Math.max(...result.chart_cal_list), false, [], "cal1" + element.id))
        det_container.appendChild(chart_generator(result.chart_period_list, Math.max(...result.chart_period_list), false, "per1" + element.id))
        total_container.appendChild(det_container)
        return total_container
    }

    create_tables (get_table_list) {
        let container = document.getElementById('container')
        let table_list = get_table_list()
        table_list.forEach(element => {
            container.appendChild(this.addEntry(element))
        });
    }

    create_statistics (element, check, summary = false) {
        let {sum, sum_calories, avg_difficulty, len} = this.get_statistics(element, check)
        var hours = (sum / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);

        let container = document.createElement('div')
        container.className = "ui tiny statistics no-margin little-padding"

        let header_div = document.createElement('h3')
        header_div.className = "statistic ui header text-align--center margin--auto"
        let header = document.createElement('div')
        header.className = "content"
        if(summary) {
            header.innerHTML = element.name
        } else {
            if(check == 1)
                header.innerHTML = "All Time"
            else if (check == 2)
                header.innerHTML = "Cur. Week"
            else 
                header.innerHTML = "Last Week"
        }
        header_div.appendChild(header)
        container.appendChild(header_div)

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
        div_statistics.className = "green statistic"
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

        div_statistics = document.createElement('div')
        div_statistics.className = "grey statistic"
        value = document.createElement('div')
        value.className = "value"
        value.innerHTML = len
        div_statistics.appendChild(value)
        label = document.createElement('div')
        label.className = "label"
        label.innerHTML = "Num."
        div_statistics.appendChild(label)
        container.appendChild(div_statistics)

        return container
    }

    displaySummary(get_table_list) {
        let container = document.createElement('div')
        let table_list = get_table_list()
        table_list.forEach(element => {
            container.appendChild(this.create_statistics(element, 2, true))
        });
        return container
    }
}

module.exports = Training