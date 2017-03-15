import test from 'ava'
import chunkArray from './../lib/utils/chunkArray'

test('.chunkArray() should chunk an array as expected', t => {
  t.plan(3)

  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const chunkedArray = chunkArray(array, 3)
  const expectedChunkedArray = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10]
  ]

  t.true(chunkedArray instanceof Array)
  t.is(chunkedArray.length, 4)
  t.deepEqual(chunkedArray, expectedChunkedArray)
})
