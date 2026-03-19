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
});

app.get("/", (req, res) => {
  res.render("login");
});

// vuln logic
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = `
    SELECT * FROM users
    WHERE email = '${email}' AND password = '${password}'
  `;

  db.get(query, (err, row) => {
    if (row) {
      req.session.user = row; // per-user session
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
    flag: process.env.FLAG
  });
});

app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Stage 1 running on http://localhost:${process.env.PORT}`);
});