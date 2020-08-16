const Menu = require('./tools/menu/index')

// Create Menu Objects
let create_menu = (name) => {
    let menu_db = new Menu()
    let list = menu_db.getAll()
    let menu_container = document.getElementById('menu')
    let a
    list.forEach(element => {
        a = document.createElement('a')
        if(element.name === name){
            a.className = "item active"
        } else {
            a.className = "item"
        }
        a.setAttribute('href', '../' + element.module_name + '/index.html')
        a.innerHTML = element.name
        menu_container.appendChild(a)
    });
}

module.exports = create_menu
