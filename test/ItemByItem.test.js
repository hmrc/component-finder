import test from 'ava'
import ItemByItem from './../lib/streams/ItemByItem'
import {PassThrough} from 'stream'

const passThrough = new PassThrough({objectMode: true})
const itemByItem = new ItemByItem({objectMode: true})
const items = [
  'line1',
  'line2',
  'line3'
]

test('output from stream should be provided to consumer item by item', async t => {
  let count = 0

  passThrough.write(items)
  passThrough.end()

  t.plan(items.length)
  await passThrough
    .pipe(itemByItem)
    .on('data', item => t.is(item, items[count++]))
})
