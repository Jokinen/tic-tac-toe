function renderBoardAsString(board) {
  return board.reduce(
    (acc, row) => acc + `${row.map((cell) => cell || '-').join(' ')} \n`,
    ''
  )
}

module.exports.renderBoardAsString = renderBoardAsString
