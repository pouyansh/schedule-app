// Menu selection
function select(id) {
    let menu_object = document.getElementById('menu')
    let objects = menu_object.children
    for (var i = 0; i < objects.length; i++) {
        var tableChild = objects[i];
        tableChild.className = 'item'
    }
    objects[parseInt(id)-1].className = 'item active'
    let section_object = document.getElementById('section')
    section_object.innerHTML = ''
    if(id === 1) {
        $("#section").load("./modules/todolist/index.html");
    }
}
select(1)

