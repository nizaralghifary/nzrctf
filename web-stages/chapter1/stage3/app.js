require("dotenv").config();

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true
  }
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run("CREATE TABLE users (email TEXT, password TEXT, role TEXT)");

  db.run(`
    INSERT INTO users VALUES (
      '${process.env.ADMIN_EMAIL}',
      '${process.env.ADMIN_PASS}',
      'admin'
    )
  `);

  db.run(`
    INSERT INTO users VALUES (
      '${process.env.STUDENT_EMAIL}',
      '${process.env.STUDENT_PASS}',
      'student'
    )
  `);

  db.run("CREATE TABLE students (id INTEGER, name TEXT, email TEXT)");
  db.run("CREATE TABLE system_notes (note TEXT)");
  db.run("INSERT INTO students VALUES (1, 'Zuri', 'zuri@univ.edu')");
  db.run("INSERT INTO students VALUES (2, 'Noor', 'noor@univ.edu')");
  db.run("INSERT INTO students VALUES (3, 'Kai', 'kai@univ.edu')");
  db.run("INSERT INTO students VALUES (4, 'Ari', 'ari@univ.edu')");
  db.run("INSERT INTO students VALUES (5, 'Steve', 'steve@univ.edu')");
  db.run("INSERT INTO students VALUES (6, 'Alex', 'alex@univ.edu')");
  db.run("INSERT INTO students VALUES (7, 'Efe', 'efe@univ.edu')");
  db.run("INSERT INTO students VALUES (8, 'Makena', 'makena@univ.edu')");
  db.run("INSERT INTO students VALUES (9, 'Sunny', 'sunny@univ.edu')");
  

  db.run("INSERT INTO system_notes VALUES ('backup completed')");
  db.run("INSERT INTO system_notes VALUES ('do not expose this table')");
  db.run("INSERT INTO system_notes VALUES (?)", [process.env.FLAG_C]);
});

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = `
    SELECT * FROM users
    WHERE email = '${email}' AND password = '${password}'
  `;

  db.get(query, (err, row) => {
    if (row) {
      req.session.user = row;
      return res.redirect("/dashboard");
    }

    res.send("<h3 style='color:red'>Invalid credentials</h3>");
  });
});

app.get("/dashboard", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }

  res.render("dashboard", {
    user: req.session.user,
    flagb: process.env.FLAG_B
  });
});

app.get("/admin/students", (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).send("Access denied");
  }

  const id = req.query.id;

  if (!id) {
    return res.render("students", { results: null });
  }

  const query = `SELECT name, email FROM students WHERE id = '${id}'`;

  db.all(query, (err, rows) => {
    if (err) {
      return res.send("Database error: " + err.message);
    }

    res.render("students", { results: rows });
  });
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(process.env.PORT_C, () => {
  console.log(`Stage running on http://localhost:${process.env.PORT_C}`);
});