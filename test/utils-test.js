'use strict'

const test = require('ava')
const utils = require('../lib/utils')

test('extracting hastags from text', t => {
  let tags = utils.extractTags('a #picture with tags #AwEsOmE #Psycho #AVA and #100 ##yes')

  t.deepEqual(tags, [
    'picture',
    'awesome',
    'psycho',
    'ava',
    '100',
    'yes'
  ])

  tags = utils.extractTags('a picture with no tags')
  t.deepEqual(tags, [])

  tags = utils.extractTags(null)
  t.deepEqual(tags, [])
})
