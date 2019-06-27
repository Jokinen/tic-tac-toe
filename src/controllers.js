const { renderBoardAsString } = require('./helpers')

// prettier-ignore
const emptyBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null]
]
let board = [[null, null, null], [null, null, null], [null, null, null]]

const states = Object.freeze({
  ONGOING: 'ONGOING',
  ENDED: 'ENDED',
})

function markPlacementController(req, res, next) {
  req.accepts('application/json')

  const coordinates = req.body.coordinates
  const mark = req.body.mark

  if (
    !mark ||
    (mark !== 'O' && mark !== 'X') ||
    !coordinates ||
    !coordinates.x ||
    !coordinates.y ||
    coordinates.x > 3 ||
    coordinates.x < 1 ||
    coordinates.y > 3 ||
    coordinates.y < 1
  ) {
    const exampleRequest = {
      mark: 'X/O',
      coordinates: {
        x: '1-3',
        y: '1-3',
      },
    }

    return res.send(`Malformed request, please input coordinates in the following form: \n${JSON.stringify(
      exampleRequest,
      null,
      2
    )}
    `)
  }

  if (isCellMarked(board, coordinates.x, coordinates.y)) {
    return res.send(
      `Cell is already marked (${coordinates.x}, ${
        coordinates.y
      }) \n${renderBoardAsString(board)}`
    )
  }

  markCell(board, coordinates.x, coordinates.y, mark)
  res.send(renderBoardAsString(board))
}

function gameStateController(req, res, next) {
  let winner = (() => {
    if (hasWon(board, 'O')) {
      return 'O'
    }

    if (hasWon(board, 'X')) {
      return 'X'
    }

    return null
  })()
  const boardFull = boardIsFull(board)
  const status = (() => {
    if (winner !== null || boardFull) {
      return states.ENDED
    }

    return states.ONGOING
  })()

  let responseString = ''

  if (status === states.ONGOING) {
    responseString = states.ONGOING
  }

  if (status === states.ENDED && winner) {
    responseString = `${status}, ${winner}`
  }

  if (status === states.ENDED && winner === null) {
    responseString = `${status}, with no winner`
  }

  return res.send(`${responseString}:\n${renderBoardAsString(board)}`)
}

function gameResetController(req, res, next) {
  board = emptyBoard

  res.send('Board reset')
}

function isCellMarked(board, x, y) {
  return board[y - 1][x - 1] !== null
}

function markCell(board, x, y, mark) {
  return (board[y - 1][x - 1] = mark)
}

function allArrayItemsAreVal(arr, val) {
  return arr.reduce((acc, cell) => acc && cell === val, true)
}

function hasWonHorizontally(board, mark) {
  return board.reduce((acc, row) => {
    return acc || allArrayItemsAreVal(row, mark)
  }, false)
}

function getColumn(board, i) {
  return board.map((row) => row[i])
}

function hasWonVertically(board, mark) {
  const rowCount = 3
  const columns = Array.from({ length: rowCount }).map((_, i) => {
    return getColumn(board, i)
  })

  return columns.reduce(
    (acc, column) => acc || allArrayItemsAreVal(column, mark),
    false
  )
}

function across(board, mark) {
  return board.reduce((acc, row, i) => acc && row[i] === mark, true)
}

function hasWon(board, mark) {
  const horizontally = hasWonHorizontally(board, mark)
  const vertically = hasWonVertically(board, mark)
  const topLeftToBottomRight = across(board, mark)
  const topRightToBottomLeft = across([...board].reverse(), mark)

  return (
    horizontally || vertically || topLeftToBottomRight || topRightToBottomLeft
  )
}

function boardIsFull(board) {
  let hasEmptyCell = false

  board.forEach((row) =>
    row.forEach((cell) => {
      if (cell === null) {
        hasEmptyCell = true
      }
    })
  )

  return !hasEmptyCell
}

module.exports.markPlacementController = markPlacementController
module.exports.gameStateController = gameStateController
module.exports.gameResetController = gameResetController
module.exports.hasWon = hasWon
module.exports.boardIsFull = boardIsFull
