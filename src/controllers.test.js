const request = require('supertest')
const { createApp } = require('./createApp')
const { hasWon, boardIsFull } = require('./controllers')
const { renderBoardAsString } = require('./helpers')

describe('controllers', () => {
  describe('integration', () => {
    let app = createApp()

    it('one example game with X winning', async (done) => {
      await Promise.all([
        request(app)
          .post('/place-mark')
          .send({ mark: 'X', coordinates: { x: 1, y: 2 } }),
        request(app)
          .post('/place-mark')
          .send({ mark: 'O', coordinates: { x: 2, y: 2 } }),
        request(app)
          .post('/place-mark')
          .send({ mark: 'X', coordinates: { x: 1, y: 1 } }),
      ])

      await request(app)
        .get('/status')
        .then((response) => {
          // prettier-ignore
          const expectedBoard = [
          ['X', null, null],
          ['X', 'O', null],
          [null, null, null]
        ]

          expect(response.text).toEqual(
            `ONGOING:\n${renderBoardAsString(expectedBoard)}`
          )
        })

      await Promise.all([
        request(app)
          .post('/place-mark')
          .send({ mark: 'O', coordinates: { x: 3, y: 1 } }),
        request(app)
          .post('/place-mark')
          .send({ mark: 'X', coordinates: { x: 1, y: 3 } }),
      ])

      await request(app)
        .get('/status')
        .then((response) => {
          // prettier-ignore
          const expectedBoard = [
            ['X', null, 'O'],
            ['X', 'O', null],
            ['X', null, null]
          ]

          expect(response.text).toEqual(
            `ENDED, X:\n${renderBoardAsString(expectedBoard)}`
          )
        })

      await request(app).post('/restart')

      return request(app)
        .get('/status')
        .then((response) => {
          // prettier-ignore
          const expectedBoard = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
          ]

          expect(response.text).toEqual(
            `ONGOING:\n${renderBoardAsString(expectedBoard)}`
          )
          done()
        })
    })
  })

  describe('hasWon', () => {
    // prettier-ignore
    const noWin = [
      ['o', 'o', null],
      [null, null, null],
      [null, 'o', null]
    ]
    // prettier-ignore
    const horizontalWin = [
      ['o', 'o', 'o'],
      [null, null, null],
      [null, null, null]
    ]
    // prettier-ignore
    const verticalWin = [
      [null, 'o', null],
      [null, 'o', null],
      [null, 'o', null]
    ]
    // prettier-ignore
    const across1 = [
      ['o', null, null],
      [null, 'o', null],
      [null, null, 'o']
    ]
    // prettier-ignore
    const across2 = [
      [null, null, 'o'],
      [null, 'o', null],
      ['o', null, null]
    ]

    it('should not get goofed', () => {
      expect(hasWon(noWin, 'o')).toEqual(false)
    })

    it('should detect a horizontal win', () => {
      expect(hasWon(horizontalWin, 'o')).toEqual(true)
    })

    it('should detect a vertical win', () => {
      expect(hasWon(verticalWin, 'o')).toEqual(true)
    })

    it('should detect across1 win', () => {
      expect(hasWon(across1, 'o')).toEqual(true)
    })

    it('should detect across2 win', () => {
      expect(hasWon(across2, 'o')).toEqual(true)
    })
  })

  describe('boardIsFull', () => {
    // prettier-ignore
    const gameEnded = [
      ['x', 'o', 'o'],
      ['o', 'x', 'o'],
      ['x', 'o', 'o']
    ]
    // prettier-ignore
    const gameNotEnded = [
      [null, null, 'o'],
      [null, 'o', null],
      ['o', null, null]
    ]

    it('should return truthy if all cells have a non null value', () => {
      expect(boardIsFull(gameEnded)).toEqual(true)
    })

    it('should return falsy if one or more cells has null value', () => {
      expect(boardIsFull(gameNotEnded)).toEqual(false)
    })
  })
})
