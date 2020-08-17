let chart_generator = (list, max, accumulative = "true", colors = [], id = "id") => {
    let container = document.createElement('div')
    let table = document.createElement('table')
    table.className = "graph"
    table.setAttribute('id', id)
    let tbody = document.createElement('tbody')
    let tr, td, span
    let sum = 0
    for(var i = 0; i < list.length; i++) {
        sum = sum + list[i]
        tr = document.createElement('tr')
        if(accumulative)
            tr.style.height = sum/max*100 + "%"
        else
            tr.style.height = list[i]/max*100 + "%"
        td = document.createElement('td')
        if(colors.length > 0) {
            td.style.backgroundColor = colors[i]
        } 
        span = document.createElement('span')
        span.innerHTML = list[i] + ", " + i
        td.appendChild(span)
        tr.appendChild(td)
        tbody.appendChild(tr)
    }
    let style = document.createElement('style')
    style.innerHTML = "#" + id + " tbody:before {content: '" + max + "'} "
    table.appendChild(style)
    table.appendChild(tbody)
    container.appendChild(table)
    return container
}

module.exports = chart_generator