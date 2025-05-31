const path = require("node:path");
const {Pool} = require("pg");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const dotenv = require('dotenv').config();

const pool = new Pool({
    host: process.env.host,
    user: process.env.user,
    database: process.env.database,
    password: process.env.password,
    port: Number(process.env.port),
})

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");



app.use(session({secret: "cats", resave: "false", saveUninitialized: false}));
app.use(passport.session());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => res.render("index"));
app.get("/sign-up", (req, res) => res.render("signup-form"));
app.post("/sign-up", async (req, res, next) => {
    try {
        await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [req.body.username, req.body.password]);
        res.redirect("/");
    }

    catch (err) {
        return next(err);
    }
})
app.listen(process.env.port || 8000);