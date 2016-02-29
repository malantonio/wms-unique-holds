#!/usr/bin/env node
var crypto = require('crypto')
var ndjson = require('ndjson')
var through = require('through2')
var level = require('level')

if (process.stdin.isTTY) halp()

var db = level(process.argv[2] || './db')

process
  .stdin
  .pipe(ndjson.parse())
  .pipe(checkObj())
  .pipe(process.stdout)

function halp () {
  console.log('usage: %s [/path/to/leveldb]', process.argv[1])
  console.log('')
  console.log('Pipe newline-delimited JSON data to me. I\'ll hash the value and')
  console.log('store it in a LevelDB instance. Every unique item that is later')
  console.log('passed through me will be let through.')
  process.exit(0)
}

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
      if (!err) return next()

      db.put(h, 1, function (err) {
        if (err) return next()

        self.push(JSON.stringify(hold) + '\n')
        return next()
      })
    })
  })
}
