'use strict'

const test = require('ava')
const uuid = require('uuid-base62')
const Db = require('../')
const r = require('rethinkdb')

const dbName = `psychogram_${uuid.v4()}`
const db = new Db({ db: dbName })

test.before('setup db', async t => {
  await db.connect()
  t.true(db.connected, 'should be connected')
})
test.after('desconectarse db', async t => {
  await db.disconnect()
  t.false(db.connected, 'deberia desconectarse')
})
test.after.always('clean database', async t => {
  let conn = await r.connect({})
  await r.dbDrop(dbName).run(conn)
})
test('save image', async t => {
  t.is(typeof db.saveImage, 'function', 'SaveImage is function')

  let image = {
    url: `http://psychogram.test/${uuid.v4()}.jpg`,
    likes: 0,
    liked: false,
    user_id: uuid.uuid()
  }
  let created = await db.saveImage(image)
  t.is(created.url, image.url)
  t.is(created.likes, image.likes)
  t.is(created.liked, image.liked)
  t.is(created.user_id, image.user_id)
  t.is(typeof created.id, 'string')
  t.truthy(created.createdAt)
})
