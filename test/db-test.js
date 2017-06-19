'use strict'

const test = require('ava')
const uuid = require('uuid-base62')
const Db = require('../')
const r = require('rethinkdb')
const fixtures = require('./fixtures')

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

  let image = fixtures.getImage()
  let created = await db.saveImage(image)
  t.is(created.description, image.description)
  t.is(created.url, image.url)
  t.is(created.likes, image.likes)
  t.is(created.liked, image.liked)
  t.deepEqual(created.tags, ['awesome', 'tags', 'psychogram'])
  t.is(created.user_id, image.user_id)
  t.is(typeof created.id, 'string')
  t.is(created.public_id, uuid.encode(created.id))
  t.truthy(created.createdAt)
})
test('like image', async t => {
  t.is(typeof db.likeImage, 'function', 'likeImage is a function')
  let image = fixtures.getImage()
  let created = await db.saveImage(image)
  let result = await db.likeImage(created.public_id)

  t.true(result.liked)
  t.is(result.likes, image.likes + 1)
})
