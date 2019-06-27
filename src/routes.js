const router = require('express').Router()
const bodyParser = require('body-parser')
const {
  markPlacementController,
  gameStateController,
  gameResetController,
} = require('./controllers')

router.use(bodyParser.json())
router.post('/place-mark', markPlacementController)
router.get('/status', gameStateController)
router.post('/restart', gameResetController)

module.exports = router
