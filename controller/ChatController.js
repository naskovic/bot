const BookingAgent = require("../services/BookingAgent");
const { sanitizeInput } = require("../utils/functions");
const { processIntent } = require("../services/IntentService")


/**
 * Handles incoming messages and generates a response.
 */
const messageHandler = async (req, res, next) => {
  try {
    const agent = new BookingAgent(req);
    await agent.load();
    req.body.message = sanitizeInput(req.body.message)
    const intentData = await agent.process(req.body.message);

   
    res.status(200).json(intentData.answer);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  messageHandler,
};


