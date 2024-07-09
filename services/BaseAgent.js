const { dockStart } = require("@nlpjs/basic");
const { fileExist } = require("../utils/functions")

class Agent {
  constructor({ corpus, qna, locale, model }) {
    this.corpus = corpus;
    this.qna = qna;
    this.locale = locale;
    this.modelFile = model
  }

  async load() {

    const dock = await dockStart({
      use: ["Basic", "Nlp", "BuiltinMicrosoft"],
      settings: {
        nlp: {
          languages: [this.locale],
          forceNER: true,
        },
        ner: {
          threshold: 1,
        },
      },
    });
    this.container = dock.getContainer();
    this.nlp = dock.get("nlp");
    const builtin = this.container.get("builtin-microsoft");
    this.nlp.container.register("extract-builtin-??", builtin, true);

    await this.nlp.addCorpus(this.qna);
    await this.nlp.addCorpus(this.corpus);
    
    if (!fileExist(this.modelFile)) {
      console.log("Training model started ....", this.modelFile);
      await this.nlp.train();
      await this.nlp.save(this.modelFile);
    }
       await this.nlp.load(this.modelFile);
  }

  async process(message) {
    return await this.nlp.process(message);
  }
}

module.exports = Agent;
