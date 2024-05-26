const db ={};

db.comment = require("./comment.js")
db.member = require("./member.js")
db.preference = require("./preference.js")

module.exports = db;