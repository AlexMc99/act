const express = require('express');
const app     = express();
const path    = require('path');
const createDAO   = require('./Models/dao');
const UserModel   = require('./Models/UserModel');
const AuthController = require('./Controllers/AuthController');
const ClassroomModel   = require('./Models/ClassroomModel');

const dbFilePath = process.env.DB_FILE_PATH || path.join(__dirname, 'Database', 'Act.db');
const dbFilePathClass = process.env.DB_FILE_PATH || path.join(__dirname, 'Database', 'Classroom.db');
let Classroom = undefined;
let Auth = undefined;

app.use(express.static('public'));

let PORT = 80;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
    console.log(req.ip);
    res.redirect('/home');
});

app.get("/home", async (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "act.html"));
});


app.get("/register", async (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "register.html"));
});

app.post("/register", async (req, res) => {
    const body = req.body;
    console.log(body);
    if (body === undefined || (!body.username || !body.password)) {
        return res.sendStatus(400);
    }
    const {username, password} = body;
    try {
        await Auth.register(username, password);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.get("/login", async (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "login.html"));
});

app.post("/login", async (req, res) => {
    const body = req.body;
    console.log(body);
    if (body === undefined || (!body.username || !body.password)) {
        return res.sendStatus(400);
    }
    const {username, password} = body;
    try {
        let success = await Auth.login(username, password);
        if (success === true){
            //res.sendStatus(200);
            res.redirect("/classroom_list");
        }
        else
            res.sendStatus(401);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.get("/students", async (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "studentLogin.html"));
});

app.post("/students", async (req, res) => {
    const body = req.body;
    console.log(body);
    if (body === undefined || (!body.username || !body.password)) {
        return res.sendStatus(400);
    }
    const {username, password} = body;
    try {
        let success = await Auth.login(username, password);
        if (success === true){
            //res.sendStatus(200);
            res.redirect("/students");
        }
        else
            res.sendStatus(401);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.get("/students", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/student.html'));
});

app.get("/classroom_list", (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/teacher.html'));
});

app.get("/classrooms", (req, res) => {
    Classroom.getAll()
        .then( (rows) => {
            console.log(rows);
            // remember to change index.js
            res.send(JSON.stringify({classrooms: rows}));
        })
        .catch( err => {
            console.error(err);
            res.sendStatus(500);
        })
});


app.post("/add_new_classroom", (req, res) => {
    const data = req.body;
    console.log(data);
    Classroom.add(data.text)
        .then( () => {
            res.sendStatus(200);
        }).catch( err => {
            console.error(err);
            res.sendStatus(500);
        });
});


app.listen(80, async () => {
    // wait until the db is initialized and all models are initialized
    await initDB();
    // Then log that the we're listening on port 80
    console.log("Listening on port 80.");
});

async function initDB () {
    const dao = await createDAO(dbFilePath);
    const dao2 = await createDAO(dbFilePathClass);
    Classroom = new ClassroomModel(dao2);
    await Classroom.createTable();
    Users = new UserModel(dao);
    await Users.createTable();
    Auth = new AuthController(dao);
}