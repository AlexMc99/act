"use strict";

document.querySelector("body").onload = main;

function main () {

    document.getElementById("login_form").onsubmit = (event) => {
        event.preventDefault();

        processForm(event);

        return false;
    };
}

async function processForm (event) {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const data = {username, password};
    fetch("http://40.117.238.250/login", {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
    }).then( res => {
        window.location = '/classroom_list';
    }).catch( err => {
        console.log(err);
    });
}