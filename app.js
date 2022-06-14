const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
var corsOptions = {
    origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// simple route
// app.get("/", (req, res) => {
//     res.json({ message: "Test application." });
// });
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// const db = require("./models");
// const Role = db.role;
//
// db.sequelize.sync({force: true}).then(() => {
//     console.log('Drop and Resync Db');
//     initial();
// });
//
// function initial() {
//     Role.create({
//         id: 1,
//         name: "user",
//     });
//     Role.create({
//         id: 2,
//         name: "supervisor",
//     });
// }

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/task.routes')(app);

// async function start() {
//     try {
//         app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
//     } catch (e) {
//         console.log('Server error', e.message)
//         process.exit(1);
//     }
// }
//
// start()