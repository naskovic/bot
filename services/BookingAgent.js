const BaseAgent = require("./BaseAgent");

class BookingAgent extends BaseAgent {
  constructor(req) {
    const settings = {
      corpus: `./accounts/default/corpus.json`,
      qna: `./accounts/default/qna.json`,
      locale: "en-US",
      model: `./accounts/default/model.npm`
    };
    super(settings);
  }
}

module.exports = BookingAgent;
