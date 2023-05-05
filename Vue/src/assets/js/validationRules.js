import { extend, configure } from "vee-validate";
import {
  required,
  email,
  min,
  max,
  digits,
  regex,
  confirmed,
} from "vee-validate/dist/rules";
import i18n from "@/i18n/index.js";

configure({
  defaultMessage: (field, values) => {
    // override the field name.z
    values._field_ = i18n.t(`fields.${field}`);
    return i18n.t(`validation.${values._rule_}`, values);
  },
});

// Install required rule and message.
extend("required", required);

// Install email rule and message.
extend("email", email);

// Install min rule and message.
extend("min", min);

// Install max rule and message.
extend("max", max);

// Install digits rule and message.
extend("digits", digits);

// Install regex rule and message.
extend("regex", regex);

// Install confirmed rule and message.
extend("confirmed", confirmed);
