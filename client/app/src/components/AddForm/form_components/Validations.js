import validator from "validator";

export const textareaValidation = {
  required: { value: true, message: "required" },
  minLength: { value: 120, message: "maximum length: 220 characters" },
};

export const inputValidation = {
  required: { value: true, message: "required" },
  maxLength: { value: 120, message: "maximum length: 220 characters" },
};

export const dateValidationObj = {
  required: { value: true, message: "requeired" },
  validate: {
    date: (v) => dateValidation(v),
  },
};

export const dateValidation = (value) => {
  const isValid = validator.isDate(value, {
    format: "YYYY-MM-DD",

    strictMode: true,
  });
  const errorMessage = "date format must be YYYY-MM-DD";

  return isValid || errorMessage;
};

export const timeValidationObj = {
  required: { value: true, message: "required" },
  validate: {
    datetime: (v) => timeValidation(v),
  },
};
export const timeValidation = (value) => {
  const isValid = validator.isTime(value, {
    strictMode: true,
  });
  const errorMessage = "time format must be HH:MM";

  return isValid || errorMessage;
};
