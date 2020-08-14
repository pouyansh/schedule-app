// Menu selection
function select_option(id) {
    let menu_object = document.getElementById('menu')
    let objects = menu_object.children
    for (var i = 0; i < objects.length; i++) {
        var tableChild = objects[i];
        tableChild.className = 'item'
    }
    objects[parseInt(id)].className = 'item active'
    let section_object = document.getElementById('sections')
    objects = section_object.children
    for (var i = 0; i < objects.length; i++) {
        var tableChild = objects[i];
        tableChild.className = 'hidden'
    }
    objects[parseInt(id)].className = 'active'
}
