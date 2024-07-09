const fs = require("fs");
const { parseISO, isValid, isBefore, startOfDay } = require('date-fns');

const readJSONFile = async (filePath) => {
  try {
    const data = await fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON file:", error.message);
    return null;
  }
};

function addToSessionContainer(req, element) {
  try {
    return req.session.container.map((obj) => {
      if (obj.bid === req.body.bid) {
        return { ...obj, element };
      }
      return obj;
    });
  } catch (error) {
    throw new Error("Problem with the session container");
  }
}

const setResponse = (response, result) => {
  let messages = [];

  if (Array.isArray(response)) {
    messages = response;
  } else if (response) {
    messages.push({ data: response});
  }
  if (Array.isArray(result)) {
    messages = result;
  } else if (result) {
    messages.push({ data: result });
  }
  return { messages };
};

const validateInput = async (input, pattern) => {
  const regex = new RegExp(pattern);
  return regex.test(input);
};

const processEntities = (data) => {
  let result = [];
  const entities = data.entities ?? [];
  for (let i = 0; i < entities.length; i++) {
    if (!entities[i].resolution) {
      continue;
    }
    item = entities[i];

    if ("date" === item.entity && item.resolution) {
      result["date"] = item.resolution.strValue ?? item.resolution.futureValue;
    }
    if ("time" === item.entity && item.resolution) {
      if (item.resolution.values[0]) {
        result["time"] = item.resolution.values[0].value;
      }
    }
    if ("email" === item.entity && item.resolution.value) {
      result["email"] = item.resolution.value;
    }
    if ("phonenumber" === item.entity && item.resolution.value) {
      result["phonenumber"] = item.resolution.value;
    }
  }
  return result;
};
const filterInputValue = (field, value) => {
  confirmedFields = [
    "email_confirmed",
    "date_confirmed",
    "appointment_confirmed",
  ];

  if (
    confirmedFields.includes(field) &&
    !["_true", "_false", true, false].includes(value)
  ) {
    value = null;
  }

  if (field === "date" && !isValidDateFormat(value)) {
    value = null;
  }

  if (field === "name" && value) {
    const nameParts = value.trim().split(" ");
    value = nameParts[0];
  }
  return value;
};


const fileExist = (filePath) => {
  if (fs.existsSync(filePath)) {
    return true;
  } else {
    return false;
  }
};

const isValidDateFormat = (input) => {
  // Check if the input is a string in the "YYYY-MM-DD" format
  if (typeof input === "string") {
    return isValidDate(input) ? true : false;
  }
  return true;
};

const isValidDate = (dateString) => {
  // Define a regular expression pattern for the "YYYY-MM-DD" format
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (!datePattern.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return false;
  }

  return true;
};



function sanitizeInput(input) {
  // Define a regular expression pattern to allow only specific characters
    const sanitizedInput = input.replace(/[^a-zA-Z0-9\s@,.+():;?/-]+/g, '');
    return sanitizedInput;
}

function isStringValidDate(dateString) {
  const parsedDate = parseISO(dateString);
  // Check if the parsed date is valid, the input string is not empty,
  // and the parsed date is not before the start of today
  const currentDate = startOfDay(new Date());
  return isValid(parsedDate) && dateString.trim() !== '' && !isBefore(parsedDate, currentDate);
}

function getDayName(selectedDate) {
  const date = new Date(selectedDate);
  const options = { weekday: 'long' };
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

module.exports = {
  readJSONFile,
  addToSessionContainer,
  setResponse,
  validateInput,
  processEntities,
  filterInputValue,
  fileExist,
  isValidDateFormat,
  sanitizeInput,
  isStringValidDate,
  getDayName
};
