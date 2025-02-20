const express = require('express');
const bodyParser = require('body-parser');
const lodash = require('lodash');
const session = require('express-session');
const randomize = require('randomatic');
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const fs = require('fs');

global.secrets = [];

express()
    .use(bodyParser.urlencoded({extended: true}))
    .use(bodyParser.json())
    .use('/static', express.static('static'))
    .set('views', './views')
    .set('view engine', 'ejs')
    .use(session({
        name: 'session',
        secret: randomize('a', 16),
        resave: true,
        saveUninitialized: true
    }))
    .get('/', (req, res) => {
        if (req.session.data) {
            res.redirect('/home');
        } else {
            res.redirect('/login')
        }
    })
    .get('/source', (req, res) => {
        res.set('Content-Type', 'text/javascript;charset=utf-8');
        res.send(fs.readFileSync(__filename));
    })
    .all('/login', (req, res) => {
        if (req.method == "GET") {
            res.render('login.ejs', {msg: null});
        }
        if (req.method == "POST") {
            const {username, password, token} = req.body;
            const sid = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).secretid;

            if (sid === undefined || sid === null || !(sid < global.secrets.length && sid >= 0)) {
                return res.render('login.ejs', {msg: 'login error.'});
            }
            const secret = global.secrets[sid];
            const user = jwt.verify(token, secret, {algorithm: "HS256"});
            if (username === user.username && password === user.password) {
                req.session.data = {
                    username: username,
                    count: 0,
                }
                res.redirect('/home');
            } else {
                return res.render('login.ejs', {msg: 'login error.'});
            }
        }
    })
    .all('/register', (req, res) => {
        if (req.method == "GET") {
            res.render('register.ejs', {msg: null});
        }
        if (req.method == "POST") {
            const {username, password} = req.body;
            if (!username || username == 'nss') {
                return res.render('register.ejs', {msg: "Username existed."});
            }
            const secret = crypto.randomBytes(16).toString('hex');
            const secretid = global.secrets.length;
            global.secrets.push(secret);
            const token = jwt.sign({secretid, username, password}, secret, {algorithm: "HS256"});
            res.render('register.ejs', {msg: "Token: " + token});
        }
    })
    .all('/home', (req, res) => {
        if (!req.session.data) {
            return res.redirect('/login');
        }
        res.render('home.ejs', {
            username: req.session.data.username||'NSS',
            count: req.session.data.count||'0',
            msg: null
        })
    })
    .post('/update', (req, res) => {
        if(!req.session.data) {
            return res.redirect('/login');
        }
        if (req.session.data.username !== 'nss') {
            return res.render('home.ejs', {
                username: req.session.data.username||'NSS',
                count: req.session.data.count||'0',
                msg: 'U cant change uid'
            })
        }
        let data = req.session.data || {};
        req.session.data = lodash.merge(data, req.body);
        console.log(req.session.data.outputFunctionName);
        res.redirect('/home');
    })
    .listen(827, '0.0.0.0')