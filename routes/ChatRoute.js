const express = require('express')
const router = express.Router()
const { messageHandler }  = require('../controller/ChatController')

router.post('/', messageHandler)

module.exports = router