const create_table = (header, list) => {
    let table = document.createElement('table')
    table.className = "ui single line table"

    let thead = document.createElement('thead')
    let tr = document.createElement('tr')
    let th
    header.forEach(element => {
        th = document.createElement('th')
        th.innerHTML = element
        tr.appendChild(th)
    });
    thead.appendChild(tr)
    table.appendChild(thead)

    let tbody = document.createElement('tbody')
    let td
    list.forEach(element => {
        tr = document.createElement('tr')
        element.forEach(e => {
            td = document.createElement('td')
            td.innerHTML = e
            tr.appendChild(td)
        });
        tbody.appendChild(tr)
    });
    table.appendChild(tbody)
    return table
}

module.exports = create_table