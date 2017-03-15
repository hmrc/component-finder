const chunkArray = (array, size) => {
  const chunkedArrays = []

  for (let i = 0; i < array.length; i += size) {
    chunkedArrays.push(array.slice(i, i + size))
  }

  return chunkedArrays
}

export default chunkArray
