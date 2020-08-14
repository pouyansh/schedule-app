let chart_generator = (list, max) => {
    let container = document.createElement('div')
    let table = document.createElement('table')
    table.className = "graph"
    let tbody = document.createElement('tbody')
    let tr, td, span
    let sum = 0
    for(var i = 0; i < list.length; i++) {
        sum = sum + list[i]
        tr = document.createElement('tr')
        tr.style.height = sum/max*100 + "%"
        td = document.createElement('td')
        span = document.createElement('span')
        span.innerHTML = list[i] + ", " + i
        td.appendChild(span)
        tr.appendChild(td)
        tbody.appendChild(tr)
    }
    table.appendChild(tbody)
    container.appendChild(table)
    return container
}

module.exports = chart_generator