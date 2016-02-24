#!/usr/bin/env node
var events = require('events')
var crypto = require('crypto')
var ndjson = require('ndjson')
var through = require('through2')
var level = require('level')
var db = level('db', {valueEncoding: 'json'})

process
  .stdin
  .pipe(ndjson.parse())
  .pipe(checkObj())
  .pipe(process.stdout)

function createHash (obj) {
  if (typeof obj !== 'string') obj = JSON.stringify(obj)

  var hash = crypto.createHash('sha1')
  hash.update(obj)
  return hash.digest('hex')
}

function checkObj () {
  return through.obj(function (hold, _, next) {
    var h = createHash(hold)
    var self = this

    db.get(h, function (err, i) {
      if (!err) {
        return next()
      }

      db.put(h, 1, function (err) {
        self.push(JSON.stringify(hold) + "\n")
        return next()
      })
    })
  })
}
