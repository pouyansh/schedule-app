let list_generator = (list) => {
    let total_container = document.createElement('div')
    total_container.className = "max-height--200"
    let container = document.createElement('div')
    container.className = "ui ordered list"
    let item, content, header
    list.forEach(element => {
        item = document.createElement('a')
        item.className = "item"
        // content = document.createElement('div')
        // content.className = "content"
        // header = document.createElement('div')
        // header.className = "header"
        item.innerHTML = element
        // content.appendChild(header)
        // item.appendChild(content)
        container.appendChild(item)
    });
    total_container.appendChild(container)
    return total_container
}

module.exports = list_generator