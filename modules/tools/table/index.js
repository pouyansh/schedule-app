const create_table = (header, list, onclick = ()=>{}) => {
    let container = document.createElement('div')
    container.className = "max-height--300"
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
            td.addEventListener('click', () => {onclick(element[0])})
        });
        tbody.appendChild(tr)
    });
    table.appendChild(tbody)
    container.appendChild(table)
    return container
}

module.exports = create_table