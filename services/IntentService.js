const { listFilesAbsolute } = require("@nlpjs/basic");
const { isStringValidDate } = require("../utils/functions");

const processIntent = async (req, intentData) => {
  return intentData.answer;
}