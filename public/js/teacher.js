"use strict";

const id = _id => document.getElementById(_id);
let default_items = '';
let local_items = [];

//document.querySelector("body").onload = main;

function main() {
    default_items = id('classroom-list').innerHTML;
    // get the items from the server as soon as the page loads
    getClassrooms();

    document.getElementById('new-classroom-form').onsubmit = (event) => {
        event.preventDefault();

        processFormSubmit(event);

        return false;
    }    
}

async function processFormSubmit(event) {
    const text = id('classroom-name').value;

    id('classroom-name').value = '';
    if (text !== '' && text !== 'clear') {
        let password = id('classroom-password').value;
        console.log(`New item: ${text}`);
        const data = {
            text: text,
            password: password
        };
        local_items.push(data);
        fetch('http://40.117.238.250/add_new_classroom', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {"Content-Type": "application/json"}
        }).then( res => {
            // just log the status for now
            return console.log(res.status);
        }).catch( err=> {
            console.log(err);
        });
     
        render();
    }
}

function render() {
    const template = id('classroom-template');
    let list_elt = id('classroom-list');
    list_elt.innerHTML = '';
    for (let i = 0; i < local_items.length; ++i) {
        let new_li = document.importNode(template.content, true);
        new_li.querySelector('.classroom-name').textContent = local_items[i].text;
        new_li.querySelector('.classroom-password').textContent = local_items[i].password;
        list_elt.appendChild(new_li);
    }
}



function getClassrooms () {
    fetch('http://40.117.238.250/classrooms', {
        method: 'GET'
    }).then( res => {
        console.log(res)
        return res.json();
    }).then( data => {
        // log the data
        console.log(data);
        // overwrite local_items with the array of todont items
        // recieved from the server
        local_items = data.classrooms;
        // render the list of items received from the server
        render();
    }).catch( err => {
        console.log(err);
    });
}