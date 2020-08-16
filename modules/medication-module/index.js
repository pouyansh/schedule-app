const create_menu = require('../index')
create_menu('Medication')

const Medication = require('./medication/index')
let medication = new Medication()
const MedicationUsed = require('./medication-used/index')
let medication_used = new MedicationUsed()

// Filling medicines
function fill_medicines () {
    let list = medication.getAll()
    let select = document.getElementById('medicine')
    let option
    list.forEach(element => {
        option = document.createElement('option')
        option.setAttribute('value', element.id)
        option.innerHTML = element.name
        select.appendChild(option)
    });
}
fill_medicines()

// Add medicine form
function add_medicine () {
    const form = document.getElementById('medicine_form')
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const hour = document.getElementById('hour').value;
        const day = document.getElementById('day').value;
        let item = {name, hour, day, show: true}
        medication.create(item)
    })
}
add_medicine()

// Used Medication form
function used_medication () {
    const form = document.getElementById('medication_used_form')
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const medicine = document.getElementById('medicine').value;
        const date = document.getElementById('date').value;
        let splitted
        let check = false
        if(!medicine) check = true
        if(date) {
            splitted = date.split(':')
            if (splitted.length != 4) {
                alert("Please correct the format of the date!")
                check = true
            }
            splitted[0] = parseInt(splitted[0])-1
        } else {
            let now = new Date(Date.now())
            splitted = [now.getMonth(), now.getDate(), now.getFullYear(), now.getHours()]
        }
        let hours = document.getElementById('next-hours').value;
        let days = document.getElementById('next-days').value;
        let change = document.getElementById('change').checked;
        let item = {check, medicine, date: splitted[1], month: splitted[0], year: splitted[2], hour: splitted[3]}
        medication_used.create(item)
        if (change)
            medication.update_next_time({check, medicine, hours, days, date: splitted[1], month: splitted[0], year: splitted[2], hour: splitted[3]})
        
    })
}
used_medication()

medication.show_next_times(medication_used.get, (e) => {
    let med = medication.get({name: e})[0]
    medication_used.show_previous_use(med, medication.change_next_time, medication.remove)
})