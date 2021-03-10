require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Shared Frontend and Staff Database Exports
// Use this for things that both will use
// Any logic that must be separated should use the separate files.
// (not all staff exports should be accessible by the frontend)

exports.hmmmm = "ok"

// Allow staff site and khe.io to simulate server-sided validation logic of schema against data
// Used to validate data and give instantanious error messages to the user
//let Validators = require('./validate.js');
//Object.assign(exports, Validators);

// Allow staff site and khe.io to validate a user's application to KHE before uploading/making changes
let ApplicationSchema = require(`../models/application/schema`).obj;
exports.ApplicationSchema = ApplicationSchema;

},{"../models/application/schema":2}],2:[function(require,module,exports){
// Model Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

let phoneNumber = require('libphonenumber-js')

module.exports = new Schema({
  user: {
    type: ObjectId,
    ref: 'User',
  },
  valid: {
    type: Boolean,
    default: false,
  },
  age: {
    type: Number,
    validate: {
      validator: function(v) {
        return v > 16;
      },
      message: props => `You are too young to participate.`
    }
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Refuse to Specify', String],
    required: true,
  },
  newbie: {
    type: Boolean,
    default: false,
  },
  dietary: [
    {
      type: String,
      enum: [
        'Vegetarian',
        'Vegan',
        'Kosher',
        'Gluten Free',
        String,
      ],
    }
  ],
  education: {
    school: {
      type: String,
      required: [true, 'Please provide your school/university'],
    },
    standing: {
      type: String,
      enum: [
        'High School',
        'Freshman',
        'Sophomore',
        'Junior',
        'Senior',
        'Graduate',
      ],
      required: true,
    },
    major: {
      type: String,
      required: [true, 'Please enter your major or area of focus'],
    },
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        try {
          return phoneNumber.parsePhoneNumberWithError(v).isPossible();
        } catch (err) {
          //console.log(err.message);
          throw err;
        }
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, 'A phone number is required'],
  },
  agreements: {
    conduct: {
      type: Boolean,
      default: false,
      validate: (o) => o === true,
      required: true,
    },
    mlh: {
      demographic: {
        type: Boolean,
        default: false,
      }
    },
  },
})

},{"libphonenumber-js":69,"mongoose":72}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _metadata = _interopRequireDefault(require("./metadata"));

var _PhoneNumber = _interopRequireDefault(require("./PhoneNumber"));

var _AsYouTypeState = _interopRequireDefault(require("./AsYouTypeState"));

var _AsYouTypeFormatter = _interopRequireWildcard(require("./AsYouTypeFormatter"));

var _AsYouTypeParser = _interopRequireWildcard(require("./AsYouTypeParser"));

var _getCountryByCallingCode = _interopRequireDefault(require("./helpers/getCountryByCallingCode"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var USE_NON_GEOGRAPHIC_COUNTRY_CODE = false;

var AsYouType =
/*#__PURE__*/
function () {
  /**
   * @param {(string|object)?} [optionsOrDefaultCountry] - The default country used for parsing non-international phone numbers. Can also be an `options` object.
   * @param {Object} metadata
   */
  function AsYouType(optionsOrDefaultCountry, metadata) {
    _classCallCheck(this, AsYouType);

    this.metadata = new _metadata["default"](metadata);

    var _this$getCountryAndCa = this.getCountryAndCallingCode(optionsOrDefaultCountry),
        _this$getCountryAndCa2 = _slicedToArray(_this$getCountryAndCa, 2),
        defaultCountry = _this$getCountryAndCa2[0],
        defaultCallingCode = _this$getCountryAndCa2[1];

    this.defaultCountry = defaultCountry;
    this.defaultCallingCode = defaultCallingCode;
    this.reset();
  }

  _createClass(AsYouType, [{
    key: "getCountryAndCallingCode",
    value: function getCountryAndCallingCode(optionsOrDefaultCountry) {
      // Set `defaultCountry` and `defaultCallingCode` options.
      var defaultCountry;
      var defaultCallingCode; // Turns out `null` also has type "object". Weird.

      if (optionsOrDefaultCountry) {
        if (_typeof(optionsOrDefaultCountry) === 'object') {
          defaultCountry = optionsOrDefaultCountry.defaultCountry;
          defaultCallingCode = optionsOrDefaultCountry.defaultCallingCode;
        } else {
          defaultCountry = optionsOrDefaultCountry;
        }
      }

      if (defaultCountry && !this.metadata.hasCountry(defaultCountry)) {
        defaultCountry = undefined;
      }

      if (defaultCallingCode) {
        /* istanbul ignore if */
        if (USE_NON_GEOGRAPHIC_COUNTRY_CODE) {
          if (this.metadata.isNonGeographicCallingCode(defaultCallingCode)) {
            defaultCountry = '001';
          }
        }
      }

      return [defaultCountry, defaultCallingCode];
    }
    /**
     * Inputs "next" phone number characters.
     * @param  {string} text
     * @return {string} Formatted phone number characters that have been input so far.
     */

  }, {
    key: "input",
    value: function input(text) {
      var _this$parser$input = this.parser.input(text, this.state),
          digits = _this$parser$input.digits,
          justLeadingPlus = _this$parser$input.justLeadingPlus;

      if (justLeadingPlus) {
        this.formattedOutput = '+';
      } else if (digits) {
        this.determineTheCountryIfNeeded(); // Match the available formats by the currently available leading digits.

        if (this.state.nationalSignificantNumber) {
          this.formatter.narrowDownMatchingFormats(this.state);
        }

        var formattedNationalNumber;

        if (this.metadata.hasSelectedNumberingPlan()) {
          formattedNationalNumber = this.formatter.format(digits, this.state);
        }

        if (formattedNationalNumber === undefined) {
          // See if another national (significant) number could be re-extracted.
          if (this.parser.reExtractNationalSignificantNumber(this.state)) {
            this.determineTheCountryIfNeeded(); // If it could, then re-try formatting the new national (significant) number.

            var nationalDigits = this.state.getNationalDigits();

            if (nationalDigits) {
              formattedNationalNumber = this.formatter.format(nationalDigits, this.state);
            }
          }
        }

        this.formattedOutput = formattedNationalNumber ? this.getFullNumber(formattedNationalNumber) : this.getNonFormattedNumber();
      }

      return this.formattedOutput;
    }
  }, {
    key: "reset",
    value: function reset() {
      var _this = this;

      this.state = new _AsYouTypeState["default"]({
        onCountryChange: function onCountryChange(country) {
          // Before version `1.6.0`, the official `AsYouType` formatter API
          // included the `.country` property of an `AsYouType` instance.
          // Since that property (along with the others) have been moved to
          // `this.state`, `this.country` property is emulated for compatibility
          // with the old versions.
          _this.country = country;
        },
        onCallingCodeChange: function onCallingCodeChange(country, callingCode) {
          _this.metadata.selectNumberingPlan(country, callingCode);

          _this.formatter.reset(_this.metadata.numberingPlan, _this.state);

          _this.parser.reset(_this.metadata.numberingPlan);
        }
      });
      this.formatter = new _AsYouTypeFormatter["default"]({
        state: this.state,
        metadata: this.metadata
      });
      this.parser = new _AsYouTypeParser["default"]({
        defaultCountry: this.defaultCountry,
        defaultCallingCode: this.defaultCallingCode,
        metadata: this.metadata,
        state: this.state,
        onNationalSignificantNumberChange: function onNationalSignificantNumberChange() {
          _this.determineTheCountryIfNeeded();

          _this.formatter.reset(_this.metadata.numberingPlan, _this.state);
        }
      });
      this.state.reset(this.defaultCountry, this.defaultCallingCode);
      this.formattedOutput = '';
      return this;
    }
    /**
     * Returns `true` if the phone number is being input in international format.
     * In other words, returns `true` if and only if the parsed phone number starts with a `"+"`.
     * @return {boolean}
     */

  }, {
    key: "isInternational",
    value: function isInternational() {
      return this.state.international;
    }
    /**
     * Returns the "country calling code" part of the phone number.
     * Returns `undefined` if the number is not being input in international format.
     * Returns "country calling code" for "non-geographic" phone numbering plans too.
     * @return {string} [callingCode]
     */

  }, {
    key: "getCallingCode",
    value: function getCallingCode() {
      return this.state.callingCode;
    } // A legacy alias.

  }, {
    key: "getCountryCallingCode",
    value: function getCountryCallingCode() {
      return this.getCallingCode();
    }
    /**
     * Returns a two-letter country code of the phone number.
     * Returns `undefined` for "non-geographic" phone numbering plans.
     * Returns `undefined` if no phone number has been input yet.
     * @return {string} [country]
     */

  }, {
    key: "getCountry",
    value: function getCountry() {
      var _this$state = this.state,
          digits = _this$state.digits,
          country = _this$state.country; // If no digits have been input yet,
      // then `this.country` is the `defaultCountry`.
      // Won't return the `defaultCountry` in such case.

      if (!digits) {
        return;
      }

      var countryCode = country;
      /* istanbul ignore if */

      if (USE_NON_GEOGRAPHIC_COUNTRY_CODE) {
        // `AsYouType.getCountry()` returns `undefined`
        // for "non-geographic" phone numbering plans.
        if (countryCode === '001') {
          countryCode = undefined;
        }
      }

      return countryCode;
    }
  }, {
    key: "determineTheCountryIfNeeded",
    value: function determineTheCountryIfNeeded() {
      // Suppose a user enters a phone number in international format,
      // and there're several countries corresponding to that country calling code,
      // and a country has been derived from the number, and then
      // a user enters one more digit and the number is no longer
      // valid for the derived country, so the country should be re-derived
      // on every new digit in those cases.
      //
      // If the phone number is being input in national format,
      // then it could be a case when `defaultCountry` wasn't specified
      // when creating `AsYouType` instance, and just `defaultCallingCode` was specified,
      // and that "calling code" could correspond to a "non-geographic entity",
      // or there could be several countries corresponding to that country calling code.
      // In those cases, `this.country` is `undefined` and should be derived
      // from the number. Again, if country calling code is ambiguous, then
      // `this.country` should be re-derived with each new digit.
      //
      if (!this.state.country || this.isCountryCallingCodeAmbiguous()) {
        this.determineTheCountry();
      }
    } // Prepends `+CountryCode ` in case of an international phone number

  }, {
    key: "getFullNumber",
    value: function getFullNumber(formattedNationalNumber) {
      var _this2 = this;

      if (this.isInternational()) {
        var prefix = function prefix(text) {
          return _this2.formatter.getInternationalPrefixBeforeCountryCallingCode(_this2.state, {
            spacing: text ? true : false
          }) + text;
        };

        var callingCode = this.state.callingCode;

        if (!callingCode) {
          return prefix("".concat(this.state.getDigitsWithoutInternationalPrefix()));
        }

        if (!formattedNationalNumber) {
          return prefix(callingCode);
        }

        return prefix("".concat(callingCode, " ").concat(formattedNationalNumber));
      }

      return formattedNationalNumber;
    }
  }, {
    key: "getNonFormattedNationalNumberWithPrefix",
    value: function getNonFormattedNationalNumberWithPrefix() {
      var _this$state2 = this.state,
          nationalSignificantNumber = _this$state2.nationalSignificantNumber,
          complexPrefixBeforeNationalSignificantNumber = _this$state2.complexPrefixBeforeNationalSignificantNumber,
          nationalPrefix = _this$state2.nationalPrefix;
      var number = nationalSignificantNumber;
      var prefix = complexPrefixBeforeNationalSignificantNumber || nationalPrefix;

      if (prefix) {
        number = prefix + number;
      }

      return number;
    }
  }, {
    key: "getNonFormattedNumber",
    value: function getNonFormattedNumber() {
      var nationalSignificantNumberMatchesInput = this.state.nationalSignificantNumberMatchesInput;
      return this.getFullNumber(nationalSignificantNumberMatchesInput ? this.getNonFormattedNationalNumberWithPrefix() : this.state.getNationalDigits());
    }
  }, {
    key: "getNonFormattedTemplate",
    value: function getNonFormattedTemplate() {
      var number = this.getNonFormattedNumber();

      if (number) {
        return number.replace(/[\+\d]/g, _AsYouTypeFormatter.DIGIT_PLACEHOLDER);
      }
    }
  }, {
    key: "isCountryCallingCodeAmbiguous",
    value: function isCountryCallingCodeAmbiguous() {
      var callingCode = this.state.callingCode;
      var countryCodes = this.metadata.getCountryCodesForCallingCode(callingCode);
      return countryCodes && countryCodes.length > 1;
    } // Determines the country of the phone number
    // entered so far based on the country phone code
    // and the national phone number.

  }, {
    key: "determineTheCountry",
    value: function determineTheCountry() {
      this.state.setCountry((0, _getCountryByCallingCode["default"])(this.isInternational() ? this.state.callingCode : this.defaultCallingCode, this.state.nationalSignificantNumber, this.metadata));
    }
    /**
     * Returns an instance of `PhoneNumber` class.
     * Will return `undefined` if no national (significant) number
     * digits have been entered so far, or if no `defaultCountry` has been
     * set and the user enters a phone number not in international format.
     */

  }, {
    key: "getNumber",
    value: function getNumber() {
      var _this$state3 = this.state,
          nationalSignificantNumber = _this$state3.nationalSignificantNumber,
          carrierCode = _this$state3.carrierCode;

      if (this.isInternational()) {
        if (!this.state.callingCode) {
          return;
        }
      } else {
        if (!this.state.country && !this.defaultCallingCode) {
          return;
        }
      }

      if (!nationalSignificantNumber) {
        return;
      }

      var countryCode = this.getCountry();
      var callingCode = this.getCountryCallingCode() || this.defaultCallingCode;
      var phoneNumber = new _PhoneNumber["default"](countryCode || callingCode, nationalSignificantNumber, this.metadata.metadata);

      if (carrierCode) {
        phoneNumber.carrierCode = carrierCode;
      } // Phone number extensions are not supported by "As You Type" formatter.


      return phoneNumber;
    }
    /**
     * Returns `true` if the phone number is "possible".
     * Is just a shortcut for `PhoneNumber.isPossible()`.
     * @return {boolean}
     */

  }, {
    key: "isPossible",
    value: function isPossible() {
      var phoneNumber = this.getNumber();

      if (!phoneNumber) {
        return false;
      }

      return phoneNumber.isPossible();
    }
    /**
     * Returns `true` if the phone number is "valid".
     * Is just a shortcut for `PhoneNumber.isValid()`.
     * @return {boolean}
     */

  }, {
    key: "isValid",
    value: function isValid() {
      var phoneNumber = this.getNumber();

      if (!phoneNumber) {
        return false;
      }

      return phoneNumber.isValid();
    }
    /**
     * @deprecated
     * This method is used in `react-phone-number-input/source/input-control.js`
     * in versions before `3.0.16`.
     */

  }, {
    key: "getNationalNumber",
    value: function getNationalNumber() {
      return this.state.nationalSignificantNumber;
    }
    /**
     * Returns the phone number characters entered by the user.
     * @return {string}
     */

  }, {
    key: "getChars",
    value: function getChars() {
      return (this.state.international ? '+' : '') + this.state.digits;
    }
    /**
     * Returns the template for the formatted phone number.
     * @return {string}
     */

  }, {
    key: "getTemplate",
    value: function getTemplate() {
      return this.formatter.getTemplate(this.state) || this.getNonFormattedTemplate() || '';
    }
  }]);

  return AsYouType;
}();

exports["default"] = AsYouType;

},{"./AsYouTypeFormatter":5,"./AsYouTypeParser":7,"./AsYouTypeState":8,"./PhoneNumber":10,"./helpers/getCountryByCallingCode":43,"./metadata":55}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = formatCompleteNumber;
exports.canFormatCompleteNumber = canFormatCompleteNumber;

var _checkNumberLength = _interopRequireDefault(require("./helpers/checkNumberLength"));

var _parseDigits = _interopRequireDefault(require("./helpers/parseDigits"));

var _formatNationalNumberUsingFormat = _interopRequireDefault(require("./helpers/formatNationalNumberUsingFormat"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function formatCompleteNumber(state, format, _ref) {
  var metadata = _ref.metadata,
      shouldTryNationalPrefixFormattingRule = _ref.shouldTryNationalPrefixFormattingRule,
      getSeparatorAfterNationalPrefix = _ref.getSeparatorAfterNationalPrefix;
  var matcher = new RegExp("^(?:".concat(format.pattern(), ")$"));

  if (matcher.test(state.nationalSignificantNumber)) {
    return formatNationalNumberWithAndWithoutNationalPrefixFormattingRule(state, format, {
      metadata: metadata,
      shouldTryNationalPrefixFormattingRule: shouldTryNationalPrefixFormattingRule,
      getSeparatorAfterNationalPrefix: getSeparatorAfterNationalPrefix
    });
  }
}

function canFormatCompleteNumber(nationalSignificantNumber, metadata) {
  return (0, _checkNumberLength["default"])(nationalSignificantNumber, metadata) === 'IS_POSSIBLE';
}

function formatNationalNumberWithAndWithoutNationalPrefixFormattingRule(state, format, _ref2) {
  var metadata = _ref2.metadata,
      shouldTryNationalPrefixFormattingRule = _ref2.shouldTryNationalPrefixFormattingRule,
      getSeparatorAfterNationalPrefix = _ref2.getSeparatorAfterNationalPrefix;
  // `format` has already been checked for `nationalPrefix` requirement.
  var nationalSignificantNumber = state.nationalSignificantNumber,
      international = state.international,
      nationalPrefix = state.nationalPrefix,
      carrierCode = state.carrierCode; // Format the number with using `national_prefix_formatting_rule`.
  // If the resulting formatted number is a valid formatted number, then return it.
  //
  // Google's AsYouType formatter is different in a way that it doesn't try
  // to format using the "national prefix formatting rule", and instead it
  // simply prepends a national prefix followed by a " " character.
  // This code does that too, but as a fallback.
  // The reason is that "national prefix formatting rule" may use parentheses,
  // which wouldn't be included has it used the simpler Google's way.
  //

  if (shouldTryNationalPrefixFormattingRule(format)) {
    var formattedNumber = formatNationalNumber(state, format, {
      useNationalPrefixFormattingRule: true,
      getSeparatorAfterNationalPrefix: getSeparatorAfterNationalPrefix,
      metadata: metadata
    });

    if (formattedNumber) {
      return formattedNumber;
    }
  } // Format the number without using `national_prefix_formatting_rule`.


  return formatNationalNumber(state, format, {
    useNationalPrefixFormattingRule: false,
    getSeparatorAfterNationalPrefix: getSeparatorAfterNationalPrefix,
    metadata: metadata
  });
}

function formatNationalNumber(state, format, _ref3) {
  var metadata = _ref3.metadata,
      useNationalPrefixFormattingRule = _ref3.useNationalPrefixFormattingRule,
      getSeparatorAfterNationalPrefix = _ref3.getSeparatorAfterNationalPrefix;
  var formattedNationalNumber = (0, _formatNationalNumberUsingFormat["default"])(state.nationalSignificantNumber, format, {
    carrierCode: state.carrierCode,
    useInternationalFormat: state.international,
    withNationalPrefix: useNationalPrefixFormattingRule,
    metadata: metadata
  });

  if (!useNationalPrefixFormattingRule) {
    if (state.nationalPrefix) {
      // If a national prefix was extracted, then just prepend it,
      // followed by a " " character.
      formattedNationalNumber = state.nationalPrefix + getSeparatorAfterNationalPrefix(format) + formattedNationalNumber;
    } else if (state.complexPrefixBeforeNationalSignificantNumber) {
      formattedNationalNumber = state.complexPrefixBeforeNationalSignificantNumber + ' ' + formattedNationalNumber;
    }
  }

  if (isValidFormattedNationalNumber(formattedNationalNumber, state)) {
    return formattedNationalNumber;
  }
} // Check that the formatted phone number contains exactly
// the same digits that have been input by the user.
// For example, when "0111523456789" is input for `AR` country,
// the extracted `this.nationalSignificantNumber` is "91123456789",
// which means that the national part of `this.digits` isn't simply equal to
// `this.nationalPrefix` + `this.nationalSignificantNumber`.
//
// Also, a `format` can add extra digits to the `this.nationalSignificantNumber`
// being formatted via `metadata[country].national_prefix_transform_rule`.
// For example, for `VI` country, it prepends `340` to the national number,
// and if this check hasn't been implemented, then there would be a bug
// when `340` "area coude" is "duplicated" during input for `VI` country:
// https://github.com/catamphetamine/libphonenumber-js/issues/318
//
// So, all these "gotchas" are filtered out.
//
// In the original Google's code, the comments say:
// "Check that we didn't remove nor add any extra digits when we matched
// this formatting pattern. This usually happens after we entered the last
// digit during AYTF. Eg: In case of MX, we swallow mobile token (1) when
// formatted but AYTF should retain all the number entered and not change
// in order to match a format (of same leading digits and length) display
// in that way."
// "If it's the same (i.e entered number and format is same), then it's
// safe to return this in formatted number as nothing is lost / added."
// Otherwise, don't use this format.
// https://github.com/google/libphonenumber/commit/3e7c1f04f5e7200f87fb131e6f85c6e99d60f510#diff-9149457fa9f5d608a11bb975c6ef4bc5
// https://github.com/google/libphonenumber/commit/3ac88c7106e7dcb553bcc794b15f19185928a1c6#diff-2dcb77e833422ee304da348b905cde0b
//


function isValidFormattedNationalNumber(formattedNationalNumber, state) {
  return (0, _parseDigits["default"])(formattedNationalNumber) === state.getNationalDigits();
}

},{"./helpers/checkNumberLength":35,"./helpers/formatNationalNumberUsingFormat":42,"./helpers/parseDigits":49}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DIGIT_PLACEHOLDER", {
  enumerable: true,
  get: function get() {
    return _AsYouTypeFormatter.DIGIT_PLACEHOLDER;
  }
});
exports["default"] = void 0;

var _AsYouTypeFormatter = require("./AsYouTypeFormatter.util");

var _AsYouTypeFormatter2 = _interopRequireWildcard(require("./AsYouTypeFormatter.complete"));

var _parseDigits = _interopRequireDefault(require("./helpers/parseDigits"));

var _formatNationalNumberUsingFormat = require("./helpers/formatNationalNumberUsingFormat");

var _constants = require("./constants");

var _applyInternationalSeparatorStyle = _interopRequireDefault(require("./helpers/applyInternationalSeparatorStyle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Used in phone number format template creation.
// Could be any digit, I guess.
var DUMMY_DIGIT = '9'; // I don't know why is it exactly `15`

var LONGEST_NATIONAL_PHONE_NUMBER_LENGTH = 15; // Create a phone number consisting only of the digit 9 that matches the
// `number_pattern` by applying the pattern to the "longest phone number" string.

var LONGEST_DUMMY_PHONE_NUMBER = (0, _AsYouTypeFormatter.repeat)(DUMMY_DIGIT, LONGEST_NATIONAL_PHONE_NUMBER_LENGTH); // A set of characters that, if found in a national prefix formatting rules, are an indicator to
// us that we should separate the national prefix from the number when formatting.

var NATIONAL_PREFIX_SEPARATORS_PATTERN = /[- ]/; // Deprecated: Google has removed some formatting pattern related code from their repo.
// https://github.com/googlei18n/libphonenumber/commit/a395b4fef3caf57c4bc5f082e1152a4d2bd0ba4c
// "We no longer have numbers in formatting matching patterns, only \d."
// Because this library supports generating custom metadata
// some users may still be using old metadata so the relevant
// code seems to stay until some next major version update.

var SUPPORT_LEGACY_FORMATTING_PATTERNS = true; // A pattern that is used to match character classes in regular expressions.
// An example of a character class is "[1-4]".

var CREATE_CHARACTER_CLASS_PATTERN = SUPPORT_LEGACY_FORMATTING_PATTERNS && function () {
  return /\[([^\[\]])*\]/g;
}; // Any digit in a regular expression that actually denotes a digit. For
// example, in the regular expression "80[0-2]\d{6,10}", the first 2 digits
// (8 and 0) are standalone digits, but the rest are not.
// Two look-aheads are needed because the number following \\d could be a
// two-digit number, since the phone number can be as long as 15 digits.


var CREATE_STANDALONE_DIGIT_PATTERN = SUPPORT_LEGACY_FORMATTING_PATTERNS && function () {
  return /\d(?=[^,}][^,}])/g;
}; // A regular expression that is used to determine if a `format` is
// suitable to be used in the "as you type formatter".
// A `format` is suitable when the resulting formatted number has
// the same digits as the user has entered.
//
// In the simplest case, that would mean that the format
// doesn't add any additional digits when formatting a number.
// Google says that it also shouldn't add "star" (`*`) characters,
// like it does in some Israeli formats.
// Such basic format would only contain "valid punctuation"
// and "captured group" identifiers ($1, $2, etc).
//
// An example of a format that adds additional digits:
//
// Country: `AR` (Argentina).
// Format:
// {
//    "pattern": "(\\d)(\\d{2})(\\d{4})(\\d{4})",
//    "leading_digits_patterns": ["91"],
//    "national_prefix_formatting_rule": "0$1",
//    "format": "$2 15-$3-$4",
//    "international_format": "$1 $2 $3-$4"
// }
//
// In the format above, the `format` adds `15` to the digits when formatting a number.
// A sidenote: this format actually is suitable because `national_prefix_for_parsing`
// has previously removed `15` from a national number, so re-adding `15` in `format`
// doesn't actually result in any extra digits added to user's input.
// But verifying that would be a complex procedure, so the code chooses a simpler path:
// it simply filters out all `format`s that contain anything but "captured group" ids.
//
// This regular expression is called `ELIGIBLE_FORMAT_PATTERN` in Google's
// `libphonenumber` code.
//


var NON_ALTERING_FORMAT_REG_EXP = new RegExp('^' + '[' + _constants.VALID_PUNCTUATION + ']*' + '(\\$\\d[' + _constants.VALID_PUNCTUATION + ']*)+' + '$'); // This is the minimum length of the leading digits of a phone number
// to guarantee the first "leading digits pattern" for a phone number format
// to be preemptive.

var MIN_LEADING_DIGITS_LENGTH = 3;

var AsYouTypeFormatter =
/*#__PURE__*/
function () {
  function AsYouTypeFormatter(_ref) {
    var _this = this;

    var state = _ref.state,
        metadata = _ref.metadata;

    _classCallCheck(this, AsYouTypeFormatter);

    _defineProperty(this, "getSeparatorAfterNationalPrefix", function (format) {
      // `US` metadata doesn't have a `national_prefix_formatting_rule`,
      // so the `if` condition below doesn't apply to `US`,
      // but in reality there shoudl be a separator
      // between a national prefix and a national (significant) number.
      // So `US` national prefix separator is a "special" "hardcoded" case.
      if (_this.isNANP) {
        return ' ';
      } // If a `format` has a `national_prefix_formatting_rule`
      // and that rule has a separator after a national prefix,
      // then it means that there should be a separator
      // between a national prefix and a national (significant) number.


      if (format && format.nationalPrefixFormattingRule() && NATIONAL_PREFIX_SEPARATORS_PATTERN.test(format.nationalPrefixFormattingRule())) {
        return ' ';
      } // At this point, there seems to be no clear evidence that
      // there should be a separator between a national prefix
      // and a national (significant) number. So don't insert one.


      return '';
    });

    _defineProperty(this, "shouldTryNationalPrefixFormattingRule", function (format, _ref2) {
      var international = _ref2.international,
          nationalPrefix = _ref2.nationalPrefix;

      if (format.nationalPrefixFormattingRule()) {
        // In some countries, `national_prefix_formatting_rule` is `($1)`,
        // so it applies even if the user hasn't input a national prefix.
        // `format.usesNationalPrefix()` detects such cases.
        var usesNationalPrefix = format.usesNationalPrefix();

        if (usesNationalPrefix && nationalPrefix || !usesNationalPrefix && !international) {
          return true;
        }
      }
    });

    this.metadata = metadata;
    this.resetFormat();
  }

  _createClass(AsYouTypeFormatter, [{
    key: "resetFormat",
    value: function resetFormat() {
      this.chosenFormat = undefined;
      this.template = undefined;
      this.nationalNumberTemplate = undefined;
      this.populatedNationalNumberTemplate = undefined;
      this.populatedNationalNumberTemplatePosition = -1;
    }
  }, {
    key: "reset",
    value: function reset(numberingPlan, state) {
      this.resetFormat();

      if (numberingPlan) {
        this.isNANP = numberingPlan.callingCode() === '1';
        this.matchingFormats = numberingPlan.formats();

        if (state.nationalSignificantNumber) {
          this.narrowDownMatchingFormats(state);
        }
      } else {
        this.isNANP = undefined;
        this.matchingFormats = [];
      }
    }
  }, {
    key: "format",
    value: function format(nextDigits, state) {
      var _this2 = this;

      // See if the phone number digits can be formatted as a complete phone number.
      // If not, use the results from `formatNationalNumberWithNextDigits()`,
      // which formats based on the chosen formatting pattern.
      //
      // Attempting to format complete phone number first is how it's done
      // in Google's `libphonenumber`, so this library just follows it.
      // Google's `libphonenumber` code doesn't explain in detail why does it
      // attempt to format digits as a complete phone number
      // instead of just going with a previoulsy (or newly) chosen `format`:
      //
      // "Checks to see if there is an exact pattern match for these digits.
      //  If so, we should use this instead of any other formatting template
      //  whose leadingDigitsPattern also matches the input."
      //
      if ((0, _AsYouTypeFormatter2.canFormatCompleteNumber)(state.nationalSignificantNumber, this.metadata)) {
        for (var _iterator = this.matchingFormats, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref3;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref3 = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref3 = _i.value;
          }

          var format = _ref3;
          var formattedCompleteNumber = (0, _AsYouTypeFormatter2["default"])(state, format, {
            metadata: this.metadata,
            shouldTryNationalPrefixFormattingRule: function shouldTryNationalPrefixFormattingRule(format) {
              return _this2.shouldTryNationalPrefixFormattingRule(format, {
                international: state.international,
                nationalPrefix: state.nationalPrefix
              });
            },
            getSeparatorAfterNationalPrefix: this.getSeparatorAfterNationalPrefix
          });

          if (formattedCompleteNumber) {
            this.resetFormat();
            this.chosenFormat = format;
            this.setNationalNumberTemplate(formattedCompleteNumber.replace(/\d/g, _AsYouTypeFormatter.DIGIT_PLACEHOLDER), state);
            this.populatedNationalNumberTemplate = formattedCompleteNumber; // With a new formatting template, the matched position
            // using the old template needs to be reset.

            this.populatedNationalNumberTemplatePosition = this.template.lastIndexOf(_AsYouTypeFormatter.DIGIT_PLACEHOLDER);
            return formattedCompleteNumber;
          }
        }
      } // Format the digits as a partial (incomplete) phone number
      // using the previously chosen formatting pattern (or a newly chosen one).


      return this.formatNationalNumberWithNextDigits(nextDigits, state);
    } // Formats the next phone number digits.

  }, {
    key: "formatNationalNumberWithNextDigits",
    value: function formatNationalNumberWithNextDigits(nextDigits, state) {
      var previouslyChosenFormat = this.chosenFormat; // Choose a format from the list of matching ones.

      var newlyChosenFormat = this.chooseFormat(state);

      if (newlyChosenFormat) {
        if (newlyChosenFormat === previouslyChosenFormat) {
          // If it can format the next (current) digits
          // using the previously chosen phone number format
          // then return the updated formatted number.
          return this.formatNextNationalNumberDigits(nextDigits);
        } else {
          // If a more appropriate phone number format
          // has been chosen for these "leading digits",
          // then re-format the national phone number part
          // using the newly selected format.
          return this.formatNextNationalNumberDigits(state.getNationalDigits());
        }
      }
    }
  }, {
    key: "narrowDownMatchingFormats",
    value: function narrowDownMatchingFormats(_ref4) {
      var _this3 = this;

      var nationalSignificantNumber = _ref4.nationalSignificantNumber,
          nationalPrefix = _ref4.nationalPrefix,
          international = _ref4.international;
      var leadingDigits = nationalSignificantNumber; // "leading digits" pattern list starts with a
      // "leading digits" pattern fitting a maximum of 3 leading digits.
      // So, after a user inputs 3 digits of a national (significant) phone number
      // this national (significant) number can already be formatted.
      // The next "leading digits" pattern is for 4 leading digits max,
      // and the "leading digits" pattern after it is for 5 leading digits max, etc.
      // This implementation is different from Google's
      // in that it searches for a fitting format
      // even if the user has entered less than
      // `MIN_LEADING_DIGITS_LENGTH` digits of a national number.
      // Because some leading digit patterns already match for a single first digit.

      var leadingDigitsPatternIndex = leadingDigits.length - MIN_LEADING_DIGITS_LENGTH;

      if (leadingDigitsPatternIndex < 0) {
        leadingDigitsPatternIndex = 0;
      }

      this.matchingFormats = this.matchingFormats.filter(function (format) {
        return _this3.formatSuits(format, international, nationalPrefix) && _this3.formatMatches(format, leadingDigits, leadingDigitsPatternIndex);
      }); // If there was a phone number format chosen
      // and it no longer holds given the new leading digits then reset it.
      // The test for this `if` condition is marked as:
      // "Reset a chosen format when it no longer holds given the new leading digits".
      // To construct a valid test case for this one can find a country
      // in `PhoneNumberMetadata.xml` yielding one format for 3 `<leadingDigits>`
      // and yielding another format for 4 `<leadingDigits>` (Australia in this case).

      if (this.chosenFormat && this.matchingFormats.indexOf(this.chosenFormat) === -1) {
        this.resetFormat();
      }
    }
  }, {
    key: "formatSuits",
    value: function formatSuits(format, international, nationalPrefix) {
      // When a prefix before a national (significant) number is
      // simply a national prefix, then it's parsed as `this.nationalPrefix`.
      // In more complex cases, a prefix before national (significant) number
      // could include a national prefix as well as some "capturing groups",
      // and in that case there's no info whether a national prefix has been parsed.
      // If national prefix is not used when formatting a phone number
      // using this format, but a national prefix has been entered by the user,
      // and was extracted, then discard such phone number format.
      // In Google's "AsYouType" formatter code, the equivalent would be this part:
      // https://github.com/google/libphonenumber/blob/0a45cfd96e71cad8edb0e162a70fcc8bd9728933/java/libphonenumber/src/com/google/i18n/phonenumbers/AsYouTypeFormatter.java#L175-L184
      if (nationalPrefix && !format.usesNationalPrefix() && // !format.domesticCarrierCodeFormattingRule() &&
      !format.nationalPrefixIsOptionalWhenFormattingInNationalFormat()) {
        return false;
      } // If national prefix is mandatory for this phone number format
      // and there're no guarantees that a national prefix is present in user input
      // then discard this phone number format as not suitable.
      // In Google's "AsYouType" formatter code, the equivalent would be this part:
      // https://github.com/google/libphonenumber/blob/0a45cfd96e71cad8edb0e162a70fcc8bd9728933/java/libphonenumber/src/com/google/i18n/phonenumbers/AsYouTypeFormatter.java#L185-L193


      if (!international && !nationalPrefix && format.nationalPrefixIsMandatoryWhenFormattingInNationalFormat()) {
        return false;
      }

      return true;
    }
  }, {
    key: "formatMatches",
    value: function formatMatches(format, leadingDigits, leadingDigitsPatternIndex) {
      var leadingDigitsPatternsCount = format.leadingDigitsPatterns().length; // If this format is not restricted to a certain
      // leading digits pattern then it fits.

      if (leadingDigitsPatternsCount === 0) {
        return true;
      } // Start excluding any non-matching formats only when the
      // national number entered so far is at least 3 digits long,
      // otherwise format matching would give false negatives.
      // For example, when the digits entered so far are `2`
      // and the leading digits pattern is `21` –
      // it's quite obvious in this case that the format could be the one
      // but due to the absence of further digits it would give false negative.


      if (leadingDigits.length < MIN_LEADING_DIGITS_LENGTH) {
        return true;
      } // If at least `MIN_LEADING_DIGITS_LENGTH` digits of a national number are available
      // then format matching starts narrowing down the list of possible formats
      // (only previously matched formats are considered for next digits).


      leadingDigitsPatternIndex = Math.min(leadingDigitsPatternIndex, leadingDigitsPatternsCount - 1);
      var leadingDigitsPattern = format.leadingDigitsPatterns()[leadingDigitsPatternIndex]; // Brackets are required for `^` to be applied to
      // all or-ed (`|`) parts, not just the first one.

      return new RegExp("^(".concat(leadingDigitsPattern, ")")).test(leadingDigits);
    }
  }, {
    key: "getFormatFormat",
    value: function getFormatFormat(format, international) {
      return international ? format.internationalFormat() : format.format();
    }
  }, {
    key: "chooseFormat",
    value: function chooseFormat(state) {
      var _this4 = this;

      var _loop2 = function _loop2() {
        if (_isArray2) {
          if (_i2 >= _iterator2.length) return "break";
          _ref5 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) return "break";
          _ref5 = _i2.value;
        }

        var format = _ref5;

        // If this format is currently being used
        // and is still suitable, then stick to it.
        if (_this4.chosenFormat === format) {
          return "break";
        } // Sometimes, a formatting rule inserts additional digits in a phone number,
        // and "as you type" formatter can't do that: it should only use the digits
        // that the user has input.
        //
        // For example, in Argentina, there's a format for mobile phone numbers:
        //
        // {
        //    "pattern": "(\\d)(\\d{2})(\\d{4})(\\d{4})",
        //    "leading_digits_patterns": ["91"],
        //    "national_prefix_formatting_rule": "0$1",
        //    "format": "$2 15-$3-$4",
        //    "international_format": "$1 $2 $3-$4"
        // }
        //
        // In that format, `international_format` is used instead of `format`
        // because `format` inserts `15` in the formatted number,
        // and `AsYouType` formatter should only use the digits
        // the user has actually input, without adding any extra digits.
        // In this case, it wouldn't make a difference, because the `15`
        // is first stripped when applying `national_prefix_for_parsing`
        // and then re-added when using `format`, so in reality it doesn't
        // add any new digits to the number, but to detect that, the code
        // would have to be more complex: it would have to try formatting
        // the digits using the format and then see if any digits have
        // actually been added or removed, and then, every time a new digit
        // is input, it should re-check whether the chosen format doesn't
        // alter the digits.
        //
        // Google's code doesn't go that far, and so does this library:
        // it simply requires that a `format` doesn't add any additonal
        // digits to user's input.
        //
        // Also, people in general should move from inputting phone numbers
        // in national format (possibly with national prefixes)
        // and use international phone number format instead:
        // it's a logical thing in the modern age of mobile phones,
        // globalization and the internet.
        //

        /* istanbul ignore if */


        if (!NON_ALTERING_FORMAT_REG_EXP.test(_this4.getFormatFormat(format, state.international))) {
          return "continue";
        }

        if (!_this4.createTemplateForFormat(format, state)) {
          // Remove the format if it can't generate a template.
          _this4.matchingFormats = _this4.matchingFormats.filter(function (_) {
            return _ !== format;
          });
          return "continue";
        }

        _this4.chosenFormat = format;
        return "break";
      };

      // When there are multiple available formats, the formatter uses the first
      // format where a formatting template could be created.
      _loop: for (var _iterator2 = this.matchingFormats.slice(), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref5;

        var _ret = _loop2();

        switch (_ret) {
          case "break":
            break _loop;

          case "continue":
            continue;
        }
      }

      if (!this.chosenFormat) {
        // No format matches the national (significant) phone number.
        this.resetFormat();
      }

      return this.chosenFormat;
    }
  }, {
    key: "createTemplateForFormat",
    value: function createTemplateForFormat(format, state) {
      // The formatter doesn't format numbers when numberPattern contains '|', e.g.
      // (20|3)\d{4}. In those cases we quickly return.
      // (Though there's no such format in current metadata)

      /* istanbul ignore if */
      if (SUPPORT_LEGACY_FORMATTING_PATTERNS && format.pattern().indexOf('|') >= 0) {
        return;
      } // Get formatting template for this phone number format


      var template = this.getTemplateForFormat(format, state); // If the national number entered is too long
      // for any phone number format, then abort.

      if (template) {
        this.setNationalNumberTemplate(template, state);
        return true;
      }
    }
  }, {
    key: "getInternationalPrefixBeforeCountryCallingCode",
    value: function getInternationalPrefixBeforeCountryCallingCode(_ref6, options) {
      var IDDPrefix = _ref6.IDDPrefix,
          missingPlus = _ref6.missingPlus;

      if (IDDPrefix) {
        return options && options.spacing === false ? IDDPrefix : IDDPrefix + ' ';
      }

      if (missingPlus) {
        return '';
      }

      return '+';
    }
  }, {
    key: "getTemplate",
    value: function getTemplate(state) {
      if (!this.template) {
        return;
      } // `this.template` holds the template for a "complete" phone number.
      // The currently entered phone number is most likely not "complete",
      // so trim all non-populated digits.


      var index = -1;
      var i = 0;
      var internationalPrefix = state.international ? this.getInternationalPrefixBeforeCountryCallingCode(state, {
        spacing: false
      }) : '';

      while (i < internationalPrefix.length + state.getDigitsWithoutInternationalPrefix().length) {
        index = this.template.indexOf(_AsYouTypeFormatter.DIGIT_PLACEHOLDER, index + 1);
        i++;
      }

      return (0, _AsYouTypeFormatter.cutAndStripNonPairedParens)(this.template, index + 1);
    }
  }, {
    key: "setNationalNumberTemplate",
    value: function setNationalNumberTemplate(template, state) {
      this.nationalNumberTemplate = template;
      this.populatedNationalNumberTemplate = template; // With a new formatting template, the matched position
      // using the old template needs to be reset.

      this.populatedNationalNumberTemplatePosition = -1; // For convenience, the public `.template` property
      // contains the whole international number
      // if the phone number being input is international:
      // 'x' for the '+' sign, 'x'es for the country phone code,
      // a spacebar and then the template for the formatted national number.

      if (state.international) {
        this.template = this.getInternationalPrefixBeforeCountryCallingCode(state).replace(/[\d\+]/g, _AsYouTypeFormatter.DIGIT_PLACEHOLDER) + (0, _AsYouTypeFormatter.repeat)(_AsYouTypeFormatter.DIGIT_PLACEHOLDER, state.callingCode.length) + ' ' + template;
      } else {
        this.template = template;
      }
    }
    /**
     * Generates formatting template for a national phone number,
     * optionally containing a national prefix, for a format.
     * @param  {Format} format
     * @param  {string} nationalPrefix
     * @return {string}
     */

  }, {
    key: "getTemplateForFormat",
    value: function getTemplateForFormat(format, _ref7) {
      var nationalSignificantNumber = _ref7.nationalSignificantNumber,
          international = _ref7.international,
          nationalPrefix = _ref7.nationalPrefix,
          complexPrefixBeforeNationalSignificantNumber = _ref7.complexPrefixBeforeNationalSignificantNumber;
      var pattern = format.pattern();
      /* istanbul ignore else */

      if (SUPPORT_LEGACY_FORMATTING_PATTERNS) {
        pattern = pattern // Replace anything in the form of [..] with \d
        .replace(CREATE_CHARACTER_CLASS_PATTERN(), '\\d') // Replace any standalone digit (not the one in `{}`) with \d
        .replace(CREATE_STANDALONE_DIGIT_PATTERN(), '\\d');
      } // Generate a dummy national number (consisting of `9`s)
      // that fits this format's `pattern`.
      //
      // This match will always succeed,
      // because the "longest dummy phone number"
      // has enough length to accomodate any possible
      // national phone number format pattern.
      //


      var digits = LONGEST_DUMMY_PHONE_NUMBER.match(pattern)[0]; // If the national number entered is too long
      // for any phone number format, then abort.

      if (nationalSignificantNumber.length > digits.length) {
        return;
      } // Get a formatting template which can be used to efficiently format
      // a partial number where digits are added one by one.
      // Below `strictPattern` is used for the
      // regular expression (with `^` and `$`).
      // This wasn't originally in Google's `libphonenumber`
      // and I guess they don't really need it
      // because they're not using "templates" to format phone numbers
      // but I added `strictPattern` after encountering
      // South Korean phone number formatting bug.
      //
      // Non-strict regular expression bug demonstration:
      //
      // this.nationalSignificantNumber : `111111111` (9 digits)
      //
      // pattern : (\d{2})(\d{3,4})(\d{4})
      // format : `$1 $2 $3`
      // digits : `9999999999` (10 digits)
      //
      // '9999999999'.replace(new RegExp(/(\d{2})(\d{3,4})(\d{4})/g), '$1 $2 $3') = "99 9999 9999"
      //
      // template : xx xxxx xxxx
      //
      // But the correct template in this case is `xx xxx xxxx`.
      // The template was generated incorrectly because of the
      // `{3,4}` variability in the `pattern`.
      //
      // The fix is, if `this.nationalSignificantNumber` has already sufficient length
      // to satisfy the `pattern` completely then `this.nationalSignificantNumber`
      // is used instead of `digits`.


      var strictPattern = new RegExp('^' + pattern + '$');
      var nationalNumberDummyDigits = nationalSignificantNumber.replace(/\d/g, DUMMY_DIGIT); // If `this.nationalSignificantNumber` has already sufficient length
      // to satisfy the `pattern` completely then use it
      // instead of `digits`.

      if (strictPattern.test(nationalNumberDummyDigits)) {
        digits = nationalNumberDummyDigits;
      }

      var numberFormat = this.getFormatFormat(format, international);
      var nationalPrefixIncludedInTemplate; // If a user did input a national prefix (and that's guaranteed),
      // and if a `format` does have a national prefix formatting rule,
      // then see if that national prefix formatting rule
      // prepends exactly the same national prefix the user has input.
      // If that's the case, then use the `format` with the national prefix formatting rule.
      // Otherwise, use  the `format` without the national prefix formatting rule,
      // and prepend a national prefix manually to it.

      if (this.shouldTryNationalPrefixFormattingRule(format, {
        international: international,
        nationalPrefix: nationalPrefix
      })) {
        var numberFormatWithNationalPrefix = numberFormat.replace(_formatNationalNumberUsingFormat.FIRST_GROUP_PATTERN, format.nationalPrefixFormattingRule()); // If `national_prefix_formatting_rule` of a `format` simply prepends
        // national prefix at the start of a national (significant) number,
        // then such formatting can be used with `AsYouType` formatter.
        // There seems to be no `else` case: everywhere in metadata,
        // national prefix formatting rule is national prefix + $1,
        // or `($1)`, in which case such format isn't even considered
        // when the user has input a national prefix.

        /* istanbul ignore else */

        if ((0, _parseDigits["default"])(format.nationalPrefixFormattingRule()) === (nationalPrefix || '') + (0, _parseDigits["default"])('$1')) {
          numberFormat = numberFormatWithNationalPrefix;
          nationalPrefixIncludedInTemplate = true; // Replace all digits of the national prefix in the formatting template
          // with `DIGIT_PLACEHOLDER`s.

          if (nationalPrefix) {
            var i = nationalPrefix.length;

            while (i > 0) {
              numberFormat = numberFormat.replace(/\d/, _AsYouTypeFormatter.DIGIT_PLACEHOLDER);
              i--;
            }
          }
        }
      } // Generate formatting template for this phone number format.


      var template = digits // Format the dummy phone number according to the format.
      .replace(new RegExp(pattern), numberFormat) // Replace each dummy digit with a DIGIT_PLACEHOLDER.
      .replace(new RegExp(DUMMY_DIGIT, 'g'), _AsYouTypeFormatter.DIGIT_PLACEHOLDER); // If a prefix of a national (significant) number is not as simple
      // as just a basic national prefix, then just prepend such prefix
      // before the national (significant) number, optionally spacing
      // the two with a whitespace.

      if (!nationalPrefixIncludedInTemplate) {
        if (complexPrefixBeforeNationalSignificantNumber) {
          // Prepend the prefix to the template manually.
          template = (0, _AsYouTypeFormatter.repeat)(_AsYouTypeFormatter.DIGIT_PLACEHOLDER, complexPrefixBeforeNationalSignificantNumber.length) + ' ' + template;
        } else if (nationalPrefix) {
          // Prepend national prefix to the template manually.
          template = (0, _AsYouTypeFormatter.repeat)(_AsYouTypeFormatter.DIGIT_PLACEHOLDER, nationalPrefix.length) + this.getSeparatorAfterNationalPrefix(format) + template;
        }
      }

      if (international) {
        template = (0, _applyInternationalSeparatorStyle["default"])(template);
      }

      return template;
    }
  }, {
    key: "formatNextNationalNumberDigits",
    value: function formatNextNationalNumberDigits(digits) {
      var result = (0, _AsYouTypeFormatter.populateTemplateWithDigits)(this.populatedNationalNumberTemplate, this.populatedNationalNumberTemplatePosition, digits);

      if (!result) {
        // Reset the format.
        this.resetFormat();
        return;
      }

      this.populatedNationalNumberTemplate = result[0];
      this.populatedNationalNumberTemplatePosition = result[1]; // Return the formatted phone number so far.

      return (0, _AsYouTypeFormatter.cutAndStripNonPairedParens)(this.populatedNationalNumberTemplate, this.populatedNationalNumberTemplatePosition + 1); // The old way which was good for `input-format` but is not so good
      // for `react-phone-number-input`'s default input (`InputBasic`).
      // return closeNonPairedParens(this.populatedNationalNumberTemplate, this.populatedNationalNumberTemplatePosition + 1)
      // 	.replace(new RegExp(DIGIT_PLACEHOLDER, 'g'), ' ')
    }
  }]);

  return AsYouTypeFormatter;
}();

exports["default"] = AsYouTypeFormatter;

},{"./AsYouTypeFormatter.complete":4,"./AsYouTypeFormatter.util":6,"./constants":12,"./helpers/applyInternationalSeparatorStyle":34,"./helpers/formatNationalNumberUsingFormat":42,"./helpers/parseDigits":49}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.countOccurences = countOccurences;
exports.repeat = repeat;
exports.cutAndStripNonPairedParens = cutAndStripNonPairedParens;
exports.closeNonPairedParens = closeNonPairedParens;
exports.stripNonPairedParens = stripNonPairedParens;
exports.populateTemplateWithDigits = populateTemplateWithDigits;
exports.DIGIT_PLACEHOLDER = void 0;
// Should be the same as `DIGIT_PLACEHOLDER` in `libphonenumber-metadata-generator`.
var DIGIT_PLACEHOLDER = 'x'; // '\u2008' (punctuation space)

exports.DIGIT_PLACEHOLDER = DIGIT_PLACEHOLDER;
var DIGIT_PLACEHOLDER_MATCHER = new RegExp(DIGIT_PLACEHOLDER); // Counts all occurences of a symbol in a string.
// Unicode-unsafe (because using `.split()`).

function countOccurences(symbol, string) {
  var count = 0; // Using `.split('')` to iterate through a string here
  // to avoid requiring `Symbol.iterator` polyfill.
  // `.split('')` is generally not safe for Unicode,
  // but in this particular case for counting brackets it is safe.
  // for (const character of string)

  for (var _iterator = string.split(''), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var character = _ref;

    if (character === symbol) {
      count++;
    }
  }

  return count;
} // Repeats a string (or a symbol) N times.
// http://stackoverflow.com/questions/202605/repeat-string-javascript


function repeat(string, times) {
  if (times < 1) {
    return '';
  }

  var result = '';

  while (times > 1) {
    if (times & 1) {
      result += string;
    }

    times >>= 1;
    string += string;
  }

  return result + string;
}

function cutAndStripNonPairedParens(string, cutBeforeIndex) {
  if (string[cutBeforeIndex] === ')') {
    cutBeforeIndex++;
  }

  return stripNonPairedParens(string.slice(0, cutBeforeIndex));
}

function closeNonPairedParens(template, cut_before) {
  var retained_template = template.slice(0, cut_before);
  var opening_braces = countOccurences('(', retained_template);
  var closing_braces = countOccurences(')', retained_template);
  var dangling_braces = opening_braces - closing_braces;

  while (dangling_braces > 0 && cut_before < template.length) {
    if (template[cut_before] === ')') {
      dangling_braces--;
    }

    cut_before++;
  }

  return template.slice(0, cut_before);
}

function stripNonPairedParens(string) {
  var dangling_braces = [];
  var i = 0;

  while (i < string.length) {
    if (string[i] === '(') {
      dangling_braces.push(i);
    } else if (string[i] === ')') {
      dangling_braces.pop();
    }

    i++;
  }

  var start = 0;
  var cleared_string = '';
  dangling_braces.push(string.length);

  for (var _i2 = 0, _dangling_braces = dangling_braces; _i2 < _dangling_braces.length; _i2++) {
    var index = _dangling_braces[_i2];
    cleared_string += string.slice(start, index);
    start = index + 1;
  }

  return cleared_string;
}

function populateTemplateWithDigits(template, position, digits) {
  // Using `.split('')` to iterate through a string here
  // to avoid requiring `Symbol.iterator` polyfill.
  // `.split('')` is generally not safe for Unicode,
  // but in this particular case for `digits` it is safe.
  // for (const digit of digits)
  for (var _iterator2 = digits.split(''), _isArray2 = Array.isArray(_iterator2), _i3 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
    var _ref2;

    if (_isArray2) {
      if (_i3 >= _iterator2.length) break;
      _ref2 = _iterator2[_i3++];
    } else {
      _i3 = _iterator2.next();
      if (_i3.done) break;
      _ref2 = _i3.value;
    }

    var digit = _ref2;

    // If there is room for more digits in current `template`,
    // then set the next digit in the `template`,
    // and return the formatted digits so far.
    // If more digits are entered than the current format could handle.
    if (template.slice(position + 1).search(DIGIT_PLACEHOLDER_MATCHER) < 0) {
      return;
    }

    position = template.search(DIGIT_PLACEHOLDER_MATCHER);
    template = template.replace(DIGIT_PLACEHOLDER_MATCHER, digit);
  }

  return [template, position];
}

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractFormattedDigitsAndPlus = extractFormattedDigitsAndPlus;
exports["default"] = void 0;

var _extractCountryCallingCode2 = _interopRequireDefault(require("./helpers/extractCountryCallingCode"));

var _extractCountryCallingCodeFromInternationalNumberWithoutPlusSign = _interopRequireDefault(require("./helpers/extractCountryCallingCodeFromInternationalNumberWithoutPlusSign"));

var _extractNationalNumberFromPossiblyIncompleteNumber = _interopRequireDefault(require("./helpers/extractNationalNumberFromPossiblyIncompleteNumber"));

var _stripIddPrefix = _interopRequireDefault(require("./helpers/stripIddPrefix"));

var _parseDigits = _interopRequireDefault(require("./helpers/parseDigits"));

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var VALID_FORMATTED_PHONE_NUMBER_PART = '[' + _constants.VALID_PUNCTUATION + _constants.VALID_DIGITS + ']+';
var VALID_FORMATTED_PHONE_NUMBER_PART_PATTERN = new RegExp('^' + VALID_FORMATTED_PHONE_NUMBER_PART + '$', 'i');
var VALID_PHONE_NUMBER = '(?:' + '[' + _constants.PLUS_CHARS + ']' + '[' + _constants.VALID_PUNCTUATION + _constants.VALID_DIGITS + ']*' + '|' + '[' + _constants.VALID_PUNCTUATION + _constants.VALID_DIGITS + ']+' + ')';
var AFTER_PHONE_NUMBER_DIGITS_END_PATTERN = new RegExp('[^' + _constants.VALID_PUNCTUATION + _constants.VALID_DIGITS + ']+' + '.*' + '$'); // Tests whether `national_prefix_for_parsing` could match
// different national prefixes.
// Matches anything that's not a digit or a square bracket.

var COMPLEX_NATIONAL_PREFIX = /[^\d\[\]]/;

var AsYouTypeParser =
/*#__PURE__*/
function () {
  function AsYouTypeParser(_ref) {
    var defaultCountry = _ref.defaultCountry,
        defaultCallingCode = _ref.defaultCallingCode,
        metadata = _ref.metadata,
        onNationalSignificantNumberChange = _ref.onNationalSignificantNumberChange;

    _classCallCheck(this, AsYouTypeParser);

    this.defaultCountry = defaultCountry;
    this.defaultCallingCode = defaultCallingCode;
    this.metadata = metadata;
    this.onNationalSignificantNumberChange = onNationalSignificantNumberChange;
  }

  _createClass(AsYouTypeParser, [{
    key: "input",
    value: function input(text, state) {
      var _extractFormattedDigi = extractFormattedDigitsAndPlus(text),
          _extractFormattedDigi2 = _slicedToArray(_extractFormattedDigi, 2),
          formattedDigits = _extractFormattedDigi2[0],
          hasPlus = _extractFormattedDigi2[1];

      var digits = (0, _parseDigits["default"])(formattedDigits); // Checks for a special case: just a leading `+` has been entered.

      var justLeadingPlus;

      if (hasPlus) {
        if (!state.digits) {
          state.startInternationalNumber();

          if (!digits) {
            justLeadingPlus = true;
          }
        }
      }

      if (digits) {
        this.inputDigits(digits, state);
      }

      return {
        digits: digits,
        justLeadingPlus: justLeadingPlus
      };
    }
    /**
     * Inputs "next" phone number digits.
     * @param  {string} digits
     * @return {string} [formattedNumber] Formatted national phone number (if it can be formatted at this stage). Returning `undefined` means "don't format the national phone number at this stage".
     */

  }, {
    key: "inputDigits",
    value: function inputDigits(nextDigits, state) {
      var digits = state.digits;
      var hasReceivedThreeLeadingDigits = digits.length < 3 && digits.length + nextDigits.length >= 3; // Append phone number digits.

      state.appendDigits(nextDigits); // Attempt to extract IDD prefix:
      // Some users input their phone number in international format,
      // but in an "out-of-country" dialing format instead of using the leading `+`.
      // https://github.com/catamphetamine/libphonenumber-js/issues/185
      // Detect such numbers as soon as there're at least 3 digits.
      // Google's library attempts to extract IDD prefix at 3 digits,
      // so this library just copies that behavior.
      // I guess that's because the most commot IDD prefixes are
      // `00` (Europe) and `011` (US).
      // There exist really long IDD prefixes too:
      // for example, in Australia the default IDD prefix is `0011`,
      // and it could even be as long as `14880011`.
      // An IDD prefix is extracted here, and then every time when
      // there's a new digit and the number couldn't be formatted.

      if (hasReceivedThreeLeadingDigits) {
        this.extractIddPrefix(state);
      }

      if (this.isWaitingForCountryCallingCode(state)) {
        if (!this.extractCountryCallingCode(state)) {
          return;
        }
      } else {
        state.appendNationalSignificantNumberDigits(nextDigits);
      } // If a phone number is being input in international format,
      // then it's not valid for it to have a national prefix.
      // Still, some people incorrectly input such numbers with a national prefix.
      // In such cases, only attempt to strip a national prefix if the number becomes too long.
      // (but that is done later, not here)


      if (!state.international) {
        if (!this.hasExtractedNationalSignificantNumber) {
          this.extractNationalSignificantNumber(state.getNationalDigits(), state.update);
        }
      }
    }
  }, {
    key: "isWaitingForCountryCallingCode",
    value: function isWaitingForCountryCallingCode(_ref2) {
      var international = _ref2.international,
          callingCode = _ref2.callingCode;
      return international && !callingCode;
    } // Extracts a country calling code from a number
    // being entered in internatonal format.

  }, {
    key: "extractCountryCallingCode",
    value: function extractCountryCallingCode(state) {
      var _extractCountryCallin = (0, _extractCountryCallingCode2["default"])('+' + state.getDigitsWithoutInternationalPrefix(), this.defaultCountry, this.defaultCallingCode, this.metadata.metadata),
          countryCallingCode = _extractCountryCallin.countryCallingCode,
          number = _extractCountryCallin.number;

      if (countryCallingCode) {
        state.setCallingCode(countryCallingCode);
        state.update({
          nationalSignificantNumber: number
        });
        return true;
      }
    }
  }, {
    key: "reset",
    value: function reset(numberingPlan) {
      if (numberingPlan) {
        this.hasSelectedNumberingPlan = true;

        var nationalPrefixForParsing = numberingPlan._nationalPrefixForParsing();

        this.couldPossiblyExtractAnotherNationalSignificantNumber = nationalPrefixForParsing && COMPLEX_NATIONAL_PREFIX.test(nationalPrefixForParsing);
      } else {
        this.hasSelectedNumberingPlan = undefined;
        this.couldPossiblyExtractAnotherNationalSignificantNumber = undefined;
      }
    }
    /**
     * Extracts a national (significant) number from user input.
     * Google's library is different in that it only applies `national_prefix_for_parsing`
     * and doesn't apply `national_prefix_transform_rule` after that.
     * https://github.com/google/libphonenumber/blob/a3d70b0487875475e6ad659af404943211d26456/java/libphonenumber/src/com/google/i18n/phonenumbers/AsYouTypeFormatter.java#L539
     * @return {boolean} [extracted]
     */

  }, {
    key: "extractNationalSignificantNumber",
    value: function extractNationalSignificantNumber(nationalDigits, setState) {
      if (!this.hasSelectedNumberingPlan) {
        return;
      }

      var _extractNationalNumbe = (0, _extractNationalNumberFromPossiblyIncompleteNumber["default"])(nationalDigits, this.metadata),
          nationalPrefix = _extractNationalNumbe.nationalPrefix,
          nationalNumber = _extractNationalNumbe.nationalNumber,
          carrierCode = _extractNationalNumbe.carrierCode;

      if (nationalNumber === nationalDigits) {
        return;
      }

      this.onExtractedNationalNumber(nationalPrefix, carrierCode, nationalNumber, nationalDigits, setState);
      return true;
    }
    /**
     * In Google's code this function is called "attempt to extract longer NDD".
     * "Some national prefixes are a substring of others", they say.
     * @return {boolean} [result] — Returns `true` if extracting a national prefix produced different results from what they were.
     */

  }, {
    key: "extractAnotherNationalSignificantNumber",
    value: function extractAnotherNationalSignificantNumber(nationalDigits, prevNationalSignificantNumber, setState) {
      if (!this.hasExtractedNationalSignificantNumber) {
        return this.extractNationalSignificantNumber(nationalDigits, setState);
      }

      if (!this.couldPossiblyExtractAnotherNationalSignificantNumber) {
        return;
      }

      var _extractNationalNumbe2 = (0, _extractNationalNumberFromPossiblyIncompleteNumber["default"])(nationalDigits, this.metadata),
          nationalPrefix = _extractNationalNumbe2.nationalPrefix,
          nationalNumber = _extractNationalNumbe2.nationalNumber,
          carrierCode = _extractNationalNumbe2.carrierCode; // If a national prefix has been extracted previously,
      // then it's always extracted as additional digits are added.
      // That's assuming `extractNationalNumberFromPossiblyIncompleteNumber()`
      // doesn't do anything different from what it currently does.
      // So, just in case, here's this check, though it doesn't occur.

      /* istanbul ignore if */


      if (nationalNumber === prevNationalSignificantNumber) {
        return;
      }

      this.onExtractedNationalNumber(nationalPrefix, carrierCode, nationalNumber, nationalDigits, setState);
      return true;
    }
  }, {
    key: "onExtractedNationalNumber",
    value: function onExtractedNationalNumber(nationalPrefix, carrierCode, nationalSignificantNumber, nationalDigits, setState) {
      var complexPrefixBeforeNationalSignificantNumber;
      var nationalSignificantNumberMatchesInput; // This check also works with empty `this.nationalSignificantNumber`.

      var nationalSignificantNumberIndex = nationalDigits.lastIndexOf(nationalSignificantNumber); // If the extracted national (significant) number is the
      // last substring of the `digits`, then it means that it hasn't been altered:
      // no digits have been removed from the national (significant) number
      // while applying `national_prefix_transform_rule`.
      // https://gitlab.com/catamphetamine/libphonenumber-js/-/blob/master/METADATA.md#national_prefix_for_parsing--national_prefix_transform_rule

      if (nationalSignificantNumberIndex >= 0 && nationalSignificantNumberIndex === nationalDigits.length - nationalSignificantNumber.length) {
        nationalSignificantNumberMatchesInput = true; // If a prefix of a national (significant) number is not as simple
        // as just a basic national prefix, then such prefix is stored in
        // `this.complexPrefixBeforeNationalSignificantNumber` property and will be
        // prepended "as is" to the national (significant) number to produce
        // a formatted result.

        var prefixBeforeNationalNumber = nationalDigits.slice(0, nationalSignificantNumberIndex); // `prefixBeforeNationalNumber` is always non-empty,
        // because `onExtractedNationalNumber()` isn't called
        // when a national (significant) number hasn't been actually "extracted":
        // when a national (significant) number is equal to the national part of `digits`,
        // then `onExtractedNationalNumber()` doesn't get called.

        if (prefixBeforeNationalNumber !== nationalPrefix) {
          complexPrefixBeforeNationalSignificantNumber = prefixBeforeNationalNumber;
        }
      }

      setState({
        nationalPrefix: nationalPrefix,
        carrierCode: carrierCode,
        nationalSignificantNumber: nationalSignificantNumber,
        nationalSignificantNumberMatchesInput: nationalSignificantNumberMatchesInput,
        complexPrefixBeforeNationalSignificantNumber: complexPrefixBeforeNationalSignificantNumber
      }); // `onExtractedNationalNumber()` is only called when
      // the national (significant) number actually did change.

      this.hasExtractedNationalSignificantNumber = true;
      this.onNationalSignificantNumberChange();
    }
  }, {
    key: "reExtractNationalSignificantNumber",
    value: function reExtractNationalSignificantNumber(state) {
      // Attempt to extract a national prefix.
      //
      // Some people incorrectly input national prefix
      // in an international phone number.
      // For example, some people write British phone numbers as `+44(0)...`.
      //
      // Also, in some rare cases, it is valid for a national prefix
      // to be a part of an international phone number.
      // For example, mobile phone numbers in Mexico are supposed to be
      // dialled internationally using a `1` national prefix,
      // so the national prefix will be part of an international number.
      //
      // Quote from:
      // https://www.mexperience.com/dialing-cell-phones-in-mexico/
      //
      // "Dialing a Mexican cell phone from abroad
      // When you are calling a cell phone number in Mexico from outside Mexico,
      // it’s necessary to dial an additional “1” after Mexico’s country code
      // (which is “52”) and before the area code.
      // You also ignore the 045, and simply dial the area code and the
      // cell phone’s number.
      //
      // If you don’t add the “1”, you’ll receive a recorded announcement
      // asking you to redial using it.
      //
      // For example, if you are calling from the USA to a cell phone
      // in Mexico City, you would dial +52 – 1 – 55 – 1234 5678.
      // (Note that this is different to calling a land line in Mexico City
      // from abroad, where the number dialed would be +52 – 55 – 1234 5678)".
      //
      // Google's demo output:
      // https://libphonenumber.appspot.com/phonenumberparser?number=%2b5215512345678&country=MX
      //
      if (this.extractAnotherNationalSignificantNumber(state.getNationalDigits(), state.nationalSignificantNumber, state.update)) {
        return true;
      } // If no format matches the phone number, then it could be
      // "a really long IDD" (quote from a comment in Google's library).
      // An IDD prefix is first extracted when the user has entered at least 3 digits,
      // and then here — every time when there's a new digit and the number
      // couldn't be formatted.
      // For example, in Australia the default IDD prefix is `0011`,
      // and it could even be as long as `14880011`.
      //
      // Could also check `!hasReceivedThreeLeadingDigits` here
      // to filter out the case when this check duplicates the one
      // already performed when there're 3 leading digits,
      // but it's not a big deal, and in most cases there
      // will be a suitable `format` when there're 3 leading digits.
      //


      if (this.extractIddPrefix(state)) {
        this.extractCallingCodeAndNationalSignificantNumber(state);
        return true;
      } // Google's AsYouType formatter supports sort of an "autocorrection" feature
      // when it "autocorrects" numbers that have been input for a country
      // with that country's calling code.
      // Such "autocorrection" feature looks weird, but different people have been requesting it:
      // https://github.com/catamphetamine/libphonenumber-js/issues/376
      // https://github.com/catamphetamine/libphonenumber-js/issues/375
      // https://github.com/catamphetamine/libphonenumber-js/issues/316


      if (this.fixMissingPlus(state)) {
        this.extractCallingCodeAndNationalSignificantNumber(state);
        return true;
      }
    }
  }, {
    key: "extractIddPrefix",
    value: function extractIddPrefix(state) {
      // An IDD prefix can't be present in a number written with a `+`.
      // Also, don't re-extract an IDD prefix if has already been extracted.
      var international = state.international,
          IDDPrefix = state.IDDPrefix,
          digits = state.digits,
          nationalSignificantNumber = state.nationalSignificantNumber;

      if (international || IDDPrefix) {
        return;
      } // Some users input their phone number in "out-of-country"
      // dialing format instead of using the leading `+`.
      // https://github.com/catamphetamine/libphonenumber-js/issues/185
      // Detect such numbers.


      var numberWithoutIDD = (0, _stripIddPrefix["default"])(digits, this.defaultCountry, this.defaultCallingCode, this.metadata.metadata);

      if (numberWithoutIDD !== undefined && numberWithoutIDD !== digits) {
        // If an IDD prefix was stripped then convert the IDD-prefixed number
        // to international number for subsequent parsing.
        state.update({
          IDDPrefix: digits.slice(0, digits.length - numberWithoutIDD.length)
        });
        this.startInternationalNumber(state);
        return true;
      }
    }
  }, {
    key: "fixMissingPlus",
    value: function fixMissingPlus(state) {
      if (!state.international) {
        var _extractCountryCallin2 = (0, _extractCountryCallingCodeFromInternationalNumberWithoutPlusSign["default"])(state.digits, this.defaultCountry, this.defaultCallingCode, this.metadata.metadata),
            newCallingCode = _extractCountryCallin2.countryCallingCode,
            number = _extractCountryCallin2.number;

        if (newCallingCode) {
          state.update({
            missingPlus: true
          });
          this.startInternationalNumber(state);
          return true;
        }
      }
    }
  }, {
    key: "startInternationalNumber",
    value: function startInternationalNumber(state) {
      state.startInternationalNumber(); // If a national (significant) number has been extracted before, reset it.

      if (state.nationalSignificantNumber) {
        state.resetNationalSignificantNumber();
        this.onNationalSignificantNumberChange();
        this.hasExtractedNationalSignificantNumber = undefined;
      }
    }
  }, {
    key: "extractCallingCodeAndNationalSignificantNumber",
    value: function extractCallingCodeAndNationalSignificantNumber(state) {
      if (this.extractCountryCallingCode(state)) {
        // `this.extractCallingCode()` is currently called when the number
        // couldn't be formatted during the standard procedure.
        // Normally, the national prefix would be re-extracted
        // for an international number if such number couldn't be formatted,
        // but since it's already not able to be formatted,
        // there won't be yet another retry, so also extract national prefix here.
        this.extractNationalSignificantNumber(state.getNationalDigits(), state.update);
      }
    }
  }]);

  return AsYouTypeParser;
}();
/**
 * Extracts formatted phone number from text (if there's any).
 * @param  {string} text
 * @return {string} [formattedPhoneNumber]
 */


exports["default"] = AsYouTypeParser;

function extractFormattedPhoneNumber(text) {
  // Attempt to extract a possible number from the string passed in.
  var startsAt = text.search(VALID_PHONE_NUMBER);

  if (startsAt < 0) {
    return;
  } // Trim everything to the left of the phone number.


  text = text.slice(startsAt); // Trim the `+`.

  var hasPlus;

  if (text[0] === '+') {
    hasPlus = true;
    text = text.slice('+'.length);
  } // Trim everything to the right of the phone number.


  text = text.replace(AFTER_PHONE_NUMBER_DIGITS_END_PATTERN, ''); // Re-add the previously trimmed `+`.

  if (hasPlus) {
    text = '+' + text;
  }

  return text;
}
/**
 * Extracts formatted phone number digits (and a `+`) from text (if there're any).
 * @param  {string} text
 * @return {any[]}
 */


function _extractFormattedDigitsAndPlus(text) {
  // Extract a formatted phone number part from text.
  var extractedNumber = extractFormattedPhoneNumber(text) || ''; // Trim a `+`.

  if (extractedNumber[0] === '+') {
    return [extractedNumber.slice('+'.length), true];
  }

  return [extractedNumber];
}
/**
 * Extracts formatted phone number digits (and a `+`) from text (if there're any).
 * @param  {string} text
 * @return {any[]}
 */


function extractFormattedDigitsAndPlus(text) {
  var _extractFormattedDigi3 = _extractFormattedDigitsAndPlus(text),
      _extractFormattedDigi4 = _slicedToArray(_extractFormattedDigi3, 2),
      formattedDigits = _extractFormattedDigi4[0],
      hasPlus = _extractFormattedDigi4[1]; // If the extracted phone number part
  // can possibly be a part of some valid phone number
  // then parse phone number characters from a formatted phone number.


  if (!VALID_FORMATTED_PHONE_NUMBER_PART_PATTERN.test(formattedDigits)) {
    formattedDigits = '';
  }

  return [formattedDigits, hasPlus];
}

},{"./constants":12,"./helpers/extractCountryCallingCode":38,"./helpers/extractCountryCallingCodeFromInternationalNumberWithoutPlusSign":39,"./helpers/extractNationalNumberFromPossiblyIncompleteNumber":41,"./helpers/parseDigits":49,"./helpers/stripIddPrefix":50}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var AsYouTypeState =
/*#__PURE__*/
function () {
  function AsYouTypeState(_ref) {
    var _this = this;

    var onCountryChange = _ref.onCountryChange,
        onCallingCodeChange = _ref.onCallingCodeChange;

    _classCallCheck(this, AsYouTypeState);

    _defineProperty(this, "update", function (properties) {
      for (var _i = 0, _Object$keys = Object.keys(properties); _i < _Object$keys.length; _i++) {
        var key = _Object$keys[_i];
        _this[key] = properties[key];
      }
    });

    this.onCountryChange = onCountryChange;
    this.onCallingCodeChange = onCallingCodeChange;
  }

  _createClass(AsYouTypeState, [{
    key: "reset",
    value: function reset(defaultCountry, defaultCallingCode) {
      this.international = false;
      this.IDDPrefix = undefined;
      this.missingPlus = undefined;
      this.callingCode = undefined;
      this.digits = '';
      this.resetNationalSignificantNumber();
      this.initCountryAndCallingCode(defaultCountry, defaultCallingCode);
    }
  }, {
    key: "resetNationalSignificantNumber",
    value: function resetNationalSignificantNumber() {
      this.nationalSignificantNumber = this.getNationalDigits();
      this.nationalSignificantNumberMatchesInput = true;
      this.nationalPrefix = undefined;
      this.carrierCode = undefined;
      this.complexPrefixBeforeNationalSignificantNumber = undefined;
    }
  }, {
    key: "initCountryAndCallingCode",
    value: function initCountryAndCallingCode(country, callingCode) {
      this.setCountry(country);
      this.setCallingCode(callingCode);
    }
  }, {
    key: "setCountry",
    value: function setCountry(country) {
      this.country = country;
      this.onCountryChange(country);
    }
  }, {
    key: "setCallingCode",
    value: function setCallingCode(callingCode) {
      this.callingCode = callingCode;
      return this.onCallingCodeChange(this.country, callingCode);
    }
  }, {
    key: "startInternationalNumber",
    value: function startInternationalNumber() {
      // Prepend the `+` to parsed input.
      this.international = true; // If a default country was set then reset it
      // because an explicitly international phone
      // number is being entered.

      this.initCountryAndCallingCode();
    }
  }, {
    key: "appendDigits",
    value: function appendDigits(nextDigits) {
      this.digits += nextDigits;
    }
  }, {
    key: "appendNationalSignificantNumberDigits",
    value: function appendNationalSignificantNumberDigits(nextDigits) {
      this.nationalSignificantNumber += nextDigits;
    }
    /**
     * Returns the part of `this.digits` that corresponds to the national number.
     * Basically, all digits that have been input by the user, except for the
     * international prefix and the country calling code part
     * (if the number is an international one).
     * @return {string}
     */

  }, {
    key: "getNationalDigits",
    value: function getNationalDigits() {
      if (this.international) {
        return this.digits.slice((this.IDDPrefix ? this.IDDPrefix.length : 0) + (this.callingCode ? this.callingCode.length : 0));
      }

      return this.digits;
    }
  }, {
    key: "getDigitsWithoutInternationalPrefix",
    value: function getDigitsWithoutInternationalPrefix() {
      if (this.international) {
        if (this.IDDPrefix) {
          return this.digits.slice(this.IDDPrefix.length);
        }
      }

      return this.digits;
    }
  }]);

  return AsYouTypeState;
}();

exports["default"] = AsYouTypeState;

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// https://stackoverflow.com/a/46971044/970769
var ParseError = function ParseError(code) {
  _classCallCheck(this, ParseError);

  this.name = this.constructor.name;
  this.message = code;
  this.stack = new Error(code).stack;
};

exports["default"] = ParseError;
ParseError.prototype = Object.create(Error.prototype);
ParseError.prototype.constructor = ParseError;

},{}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _metadata2 = _interopRequireDefault(require("./metadata"));

var _isPossibleNumber_ = _interopRequireDefault(require("./isPossibleNumber_"));

var _validate_ = _interopRequireDefault(require("./validate_"));

var _isValidNumberForRegion_ = _interopRequireDefault(require("./isValidNumberForRegion_"));

var _getNumberType = _interopRequireDefault(require("./helpers/getNumberType"));

var _format_ = _interopRequireDefault(require("./format_"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var USE_NON_GEOGRAPHIC_COUNTRY_CODE = false;

var PhoneNumber =
/*#__PURE__*/
function () {
  function PhoneNumber(countryCallingCode, nationalNumber, metadata) {
    _classCallCheck(this, PhoneNumber);

    if (!countryCallingCode) {
      throw new TypeError('`country` or `countryCallingCode` not passed');
    }

    if (!nationalNumber) {
      throw new TypeError('`nationalNumber` not passed');
    }

    var _metadata = new _metadata2["default"](metadata); // If country code is passed then derive `countryCallingCode` from it.
    // Also store the country code as `.country`.


    if (isCountryCode(countryCallingCode)) {
      this.country = countryCallingCode;

      _metadata.country(countryCallingCode);

      countryCallingCode = _metadata.countryCallingCode();
    } else {
      /* istanbul ignore if */
      if (USE_NON_GEOGRAPHIC_COUNTRY_CODE) {
        if (_metadata.isNonGeographicCallingCode(countryCallingCode)) {
          this.country = '001';
        }
      }
    }

    this.countryCallingCode = countryCallingCode;
    this.nationalNumber = nationalNumber;
    this.number = '+' + this.countryCallingCode + this.nationalNumber;
    this.metadata = metadata;
  }

  _createClass(PhoneNumber, [{
    key: "isPossible",
    value: function isPossible() {
      return (0, _isPossibleNumber_["default"])(this, {
        v2: true
      }, this.metadata);
    }
  }, {
    key: "isValid",
    value: function isValid() {
      return (0, _validate_["default"])(this, {
        v2: true
      }, this.metadata);
    }
  }, {
    key: "isNonGeographic",
    value: function isNonGeographic() {
      var metadata = new _metadata2["default"](this.metadata);
      return metadata.isNonGeographicCallingCode(this.countryCallingCode);
    }
  }, {
    key: "isEqual",
    value: function isEqual(phoneNumber) {
      return this.number === phoneNumber.number && this.ext === phoneNumber.ext;
    } // // Is just an alias for `this.isValid() && this.country === country`.
    // // https://github.com/googlei18n/libphonenumber/blob/master/FAQ.md#when-should-i-use-isvalidnumberforregion
    // isValidForRegion(country) {
    // 	return isValidNumberForRegion(this, country, { v2: true }, this.metadata)
    // }

  }, {
    key: "getType",
    value: function getType() {
      return (0, _getNumberType["default"])(this, {
        v2: true
      }, this.metadata);
    }
  }, {
    key: "format",
    value: function format(_format, options) {
      return (0, _format_["default"])(this, _format, options ? _objectSpread({}, options, {
        v2: true
      }) : {
        v2: true
      }, this.metadata);
    }
  }, {
    key: "formatNational",
    value: function formatNational(options) {
      return this.format('NATIONAL', options);
    }
  }, {
    key: "formatInternational",
    value: function formatInternational(options) {
      return this.format('INTERNATIONAL', options);
    }
  }, {
    key: "getURI",
    value: function getURI(options) {
      return this.format('RFC3966', options);
    }
  }]);

  return PhoneNumber;
}();

exports["default"] = PhoneNumber;

var isCountryCode = function isCountryCode(value) {
  return /^[A-Z]{2}$/.test(value);
};

},{"./format_":28,"./helpers/getNumberType":45,"./isPossibleNumber_":52,"./isValidNumberForRegion_":54,"./metadata":55,"./validate_":67}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _PhoneNumber = _interopRequireDefault(require("./PhoneNumber"));

var _constants = require("./constants");

var _createExtensionPattern = _interopRequireDefault(require("./helpers/extension/createExtensionPattern"));

var _RegExpCache = _interopRequireDefault(require("./findNumbers/RegExpCache"));

var _util = require("./findNumbers/util");

var _utf = require("./findNumbers/utf-8");

var _Leniency = _interopRequireDefault(require("./findNumbers/Leniency"));

var _parsePreCandidate = _interopRequireDefault(require("./findNumbers/parsePreCandidate"));

var _isValidPreCandidate = _interopRequireDefault(require("./findNumbers/isValidPreCandidate"));

var _isValidCandidate = _interopRequireWildcard(require("./findNumbers/isValidCandidate"));

var _metadata = require("./metadata");

var _parse_ = _interopRequireDefault(require("./parse_"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var EXTN_PATTERNS_FOR_MATCHING = (0, _createExtensionPattern["default"])('matching');
/**
 * Patterns used to extract phone numbers from a larger phone-number-like pattern. These are
 * ordered according to specificity. For example, white-space is last since that is frequently
 * used in numbers, not just to separate two numbers. We have separate patterns since we don't
 * want to break up the phone-number-like text on more than one different kind of symbol at one
 * time, although symbols of the same type (e.g. space) can be safely grouped together.
 *
 * Note that if there is a match, we will always check any text found up to the first match as
 * well.
 */

var INNER_MATCHES = [// Breaks on the slash - e.g. "651-234-2345/332-445-1234"
'\\/+(.*)/', // Note that the bracket here is inside the capturing group, since we consider it part of the
// phone number. Will match a pattern like "(650) 223 3345 (754) 223 3321".
'(\\([^(]*)', // Breaks on a hyphen - e.g. "12345 - 332-445-1234 is my number."
// We require a space on either side of the hyphen for it to be considered a separator.
"(?:".concat(_utf.pZ, "-|-").concat(_utf.pZ, ")").concat(_utf.pZ, "*(.+)"), // Various types of wide hyphens. Note we have decided not to enforce a space here, since it's
// possible that it's supposed to be used to break two numbers without spaces, and we haven't
// seen many instances of it used within a number.
"[\u2012-\u2015\uFF0D]".concat(_utf.pZ, "*(.+)"), // Breaks on a full stop - e.g. "12345. 332-445-1234 is my number."
"\\.+".concat(_utf.pZ, "*([^.]+)"), // Breaks on space - e.g. "3324451234 8002341234"
"".concat(_utf.pZ, "+(").concat(_utf.PZ, "+)")]; // Limit on the number of leading (plus) characters.

var leadLimit = (0, _util.limit)(0, 2); // Limit on the number of consecutive punctuation characters.

var punctuationLimit = (0, _util.limit)(0, 4);
/* The maximum number of digits allowed in a digit-separated block. As we allow all digits in a
 * single block, set high enough to accommodate the entire national number and the international
 * country code. */

var digitBlockLimit = _constants.MAX_LENGTH_FOR_NSN + _constants.MAX_LENGTH_COUNTRY_CODE; // Limit on the number of blocks separated by punctuation.
// Uses digitBlockLimit since some formats use spaces to separate each digit.

var blockLimit = (0, _util.limit)(0, digitBlockLimit);
/* A punctuation sequence allowing white space. */

var punctuation = "[".concat(_constants.VALID_PUNCTUATION, "]") + punctuationLimit; // A digits block without punctuation.

var digitSequence = _utf.pNd + (0, _util.limit)(1, digitBlockLimit);
/**
 * Phone number pattern allowing optional punctuation.
 * The phone number pattern used by `find()`, similar to
 * VALID_PHONE_NUMBER, but with the following differences:
 * <ul>
 *   <li>All captures are limited in order to place an upper bound to the text matched by the
 *       pattern.
 * <ul>
 *   <li>Leading punctuation / plus signs are limited.
 *   <li>Consecutive occurrences of punctuation are limited.
 *   <li>Number of digits is limited.
 * </ul>
 *   <li>No whitespace is allowed at the start or end.
 *   <li>No alpha digits (vanity numbers such as 1-800-SIX-FLAGS) are currently supported.
 * </ul>
 */

var PATTERN = '(?:' + _isValidCandidate.LEAD_CLASS + punctuation + ')' + leadLimit + digitSequence + '(?:' + punctuation + digitSequence + ')' + blockLimit + '(?:' + EXTN_PATTERNS_FOR_MATCHING + ')?'; // Regular expression of trailing characters that we want to remove.
// We remove all characters that are not alpha or numerical characters.
// The hash character is retained here, as it may signify
// the previous block was an extension.
//
// // Don't know what does '&&' mean here.
// const UNWANTED_END_CHAR_PATTERN = new RegExp(`[[\\P{N}&&\\P{L}]&&[^#]]+$`)
//

var UNWANTED_END_CHAR_PATTERN = new RegExp("[^".concat(_utf._pN).concat(_utf._pL, "#]+$"));
var NON_DIGITS_PATTERN = /(\D+)/;
var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;
/**
 * A stateful class that finds and extracts telephone numbers from {@linkplain CharSequence text}.
 * Instances can be created using the {@linkplain PhoneNumberUtil#findNumbers factory methods} in
 * {@link PhoneNumberUtil}.
 *
 * <p>Vanity numbers (phone numbers using alphabetic digits such as <tt>1-800-SIX-FLAGS</tt> are
 * not found.
 *
 * <p>This class is not thread-safe.
 */

var PhoneNumberMatcher =
/*#__PURE__*/
function () {
  /** The iteration tristate. */

  /** The next index to start searching at. Undefined in {@link State#DONE}. */
  // A cache for frequently used country-specific regular expressions. Set to 32 to cover ~2-3
  // countries being used for the same doc with ~10 patterns for each country. Some pages will have
  // a lot more countries in use, but typically fewer numbers for each so expanding the cache for
  // that use-case won't have a lot of benefit.

  /**
   * Creates a new instance. See the factory methods in {@link PhoneNumberUtil} on how to obtain a
   * new instance.
   *
   * @param util  the phone number util to use
   * @param text  the character sequence that we will search, null for no text
   * @param country  the country to assume for phone numbers not written in international format
   *     (with a leading plus, or with the international dialing prefix of the specified region).
   *     May be null or "ZZ" if only numbers with a leading plus should be
   *     considered.
   * @param leniency  the leniency to use when evaluating candidate phone numbers
   * @param maxTries  the maximum number of invalid numbers to try before giving up on the text.
   *     This is to cover degenerate cases where the text has a lot of false positives in it. Must
   *     be {@code >= 0}.
   */
  function PhoneNumberMatcher() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var metadata = arguments.length > 2 ? arguments[2] : undefined;

    _classCallCheck(this, PhoneNumberMatcher);

    _defineProperty(this, "state", 'NOT_READY');

    _defineProperty(this, "searchIndex", 0);

    _defineProperty(this, "regExpCache", new _RegExpCache["default"](32));

    options = _objectSpread({}, options, {
      defaultCallingCode: options.defaultCallingCode,
      defaultCountry: options.defaultCountry && (0, _metadata.isSupportedCountry)(options.defaultCountry, metadata) ? options.defaultCountry : undefined,
      leniency: options.leniency || options.extended ? 'POSSIBLE' : 'VALID',
      maxTries: options.maxTries || MAX_SAFE_INTEGER
    });

    if (!options.leniency) {
      throw new TypeError('`Leniency` not supplied');
    }

    if (options.maxTries < 0) {
      throw new TypeError('`maxTries` not supplied');
    }

    this.text = text;
    this.options = options;
    this.metadata = metadata;
    /** The degree of validation requested. */

    this.leniency = _Leniency["default"][options.leniency];

    if (!this.leniency) {
      throw new TypeError("Unknown leniency: ".concat(options.leniency, "."));
    }
    /** The maximum number of retries after matching an invalid number. */


    this.maxTries = options.maxTries;
    this.PATTERN = new RegExp(PATTERN, 'ig');
  }
  /**
   * Attempts to find the next subsequence in the searched sequence on or after {@code searchIndex}
   * that represents a phone number. Returns the next match, null if none was found.
   *
   * @param index  the search index to start searching at
   * @return  the phone number match found, null if none can be found
   */


  _createClass(PhoneNumberMatcher, [{
    key: "find",
    value: function find() {
      // // Reset the regular expression.
      // this.PATTERN.lastIndex = index
      var matches;

      while (this.maxTries > 0 && (matches = this.PATTERN.exec(this.text)) !== null) {
        var candidate = matches[0];
        var offset = matches.index;
        candidate = (0, _parsePreCandidate["default"])(candidate);

        if ((0, _isValidPreCandidate["default"])(candidate, offset, this.text)) {
          var match = // Try to come up with a valid match given the entire candidate.
          this.parseAndVerify(candidate, offset, this.text) // If that failed, try to find an "inner match" -
          // there might be a phone number within this candidate.
          || this.extractInnerMatch(candidate, offset, this.text);

          if (match) {
            if (this.options.v2) {
              var phoneNumber = new _PhoneNumber["default"](match.country || match.countryCallingCode, match.phone, this.metadata);

              if (match.ext) {
                phoneNumber.ext = match.ext;
              }

              return {
                startsAt: match.startsAt,
                endsAt: match.endsAt,
                number: phoneNumber
              };
            }

            return match;
          }
        }

        this.maxTries--;
      }
    }
    /**
     * Attempts to extract a match from `substring`
     * if the substring itself does not qualify as a match.
     */

  }, {
    key: "extractInnerMatch",
    value: function extractInnerMatch(substring, offset, text) {
      for (var _i = 0, _INNER_MATCHES = INNER_MATCHES; _i < _INNER_MATCHES.length; _i++) {
        var innerMatchPattern = _INNER_MATCHES[_i];
        var isFirstMatch = true;
        var candidateMatch = void 0;
        var innerMatchRegExp = new RegExp(innerMatchPattern, 'g');

        while (this.maxTries > 0 && (candidateMatch = innerMatchRegExp.exec(substring)) !== null) {
          if (isFirstMatch) {
            // We should handle any group before this one too.
            var _candidate = (0, _util.trimAfterFirstMatch)(UNWANTED_END_CHAR_PATTERN, substring.slice(0, candidateMatch.index));

            var _match = this.parseAndVerify(_candidate, offset, text);

            if (_match) {
              return _match;
            }

            this.maxTries--;
            isFirstMatch = false;
          }

          var candidate = (0, _util.trimAfterFirstMatch)(UNWANTED_END_CHAR_PATTERN, candidateMatch[1]); // Java code does `groupMatcher.start(1)` here,
          // but there's no way in javascript to get a `candidate` start index,
          // therefore resort to using this kind of an approximation.
          // (`groupMatcher` is called `candidateInSubstringMatch` in this javascript port)
          // https://stackoverflow.com/questions/15934353/get-index-of-each-capture-in-a-javascript-regex

          var candidateIndexGuess = substring.indexOf(candidate, candidateMatch.index);
          var match = this.parseAndVerify(candidate, offset + candidateIndexGuess, text);

          if (match) {
            return match;
          }

          this.maxTries--;
        }
      }
    }
    /**
     * Parses a phone number from the `candidate` using `parseNumber` and
     * verifies it matches the requested `leniency`. If parsing and verification succeed,
     * a corresponding `PhoneNumberMatch` is returned, otherwise this method returns `null`.
     *
     * @param candidate  the candidate match
     * @param offset  the offset of {@code candidate} within {@link #text}
     * @return  the parsed and validated phone number match, or null
     */

  }, {
    key: "parseAndVerify",
    value: function parseAndVerify(candidate, offset, text) {
      if (!(0, _isValidCandidate["default"])(candidate, offset, text, this.options.leniency)) {
        return;
      }

      var number = (0, _parse_["default"])(candidate, {
        extended: true,
        defaultCountry: this.options.defaultCountry,
        defaultCallingCode: this.options.defaultCallingCode
      }, this.metadata);

      if (!number.possible) {
        return;
      }

      if (this.leniency(number, candidate, this.metadata, this.regExpCache)) {
        // // We used parseAndKeepRawInput to create this number,
        // // but for now we don't return the extra values parsed.
        // // TODO: stop clearing all values here and switch all users over
        // // to using rawInput() rather than the rawString() of PhoneNumberMatch.
        // number.clearCountryCodeSource()
        // number.clearRawInput()
        // number.clearPreferredDomesticCarrierCode()
        var result = {
          startsAt: offset,
          endsAt: offset + candidate.length,
          phone: number.phone
        };

        if (number.country && number.country !== '001') {
          result.country = number.country;
        } else {
          result.countryCallingCode = number.countryCallingCode;
        }

        if (number.ext) {
          result.ext = number.ext;
        }

        return result;
      }
    }
  }, {
    key: "hasNext",
    value: function hasNext() {
      if (this.state === 'NOT_READY') {
        this.lastMatch = this.find(); // (this.searchIndex)

        if (this.lastMatch) {
          // this.searchIndex = this.lastMatch.endsAt
          this.state = 'READY';
        } else {
          this.state = 'DONE';
        }
      }

      return this.state === 'READY';
    }
  }, {
    key: "next",
    value: function next() {
      // Check the state and find the next match as a side-effect if necessary.
      if (!this.hasNext()) {
        throw new Error('No next element');
      } // Don't retain that memory any longer than necessary.


      var result = this.lastMatch;
      this.lastMatch = null;
      this.state = 'NOT_READY';
      return result;
    }
  }]);

  return PhoneNumberMatcher;
}();

exports["default"] = PhoneNumberMatcher;

},{"./PhoneNumber":10,"./constants":12,"./findNumbers/Leniency":15,"./findNumbers/RegExpCache":16,"./findNumbers/isValidCandidate":17,"./findNumbers/isValidPreCandidate":18,"./findNumbers/parsePreCandidate":19,"./findNumbers/utf-8":20,"./findNumbers/util":21,"./helpers/extension/createExtensionPattern":36,"./metadata":55,"./parse_":62}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PLUS_CHARS = exports.VALID_PUNCTUATION = exports.WHITESPACE = exports.VALID_DIGITS = exports.MAX_LENGTH_COUNTRY_CODE = exports.MAX_LENGTH_FOR_NSN = exports.MIN_LENGTH_FOR_NSN = void 0;
// The minimum length of the national significant number.
var MIN_LENGTH_FOR_NSN = 2; // The ITU says the maximum length should be 15,
// but one can find longer numbers in Germany.

exports.MIN_LENGTH_FOR_NSN = MIN_LENGTH_FOR_NSN;
var MAX_LENGTH_FOR_NSN = 17; // The maximum length of the country calling code.

exports.MAX_LENGTH_FOR_NSN = MAX_LENGTH_FOR_NSN;
var MAX_LENGTH_COUNTRY_CODE = 3; // Digits accepted in phone numbers
// (ascii, fullwidth, arabic-indic, and eastern arabic digits).

exports.MAX_LENGTH_COUNTRY_CODE = MAX_LENGTH_COUNTRY_CODE;
var VALID_DIGITS = "0-9\uFF10-\uFF19\u0660-\u0669\u06F0-\u06F9"; // `DASHES` will be right after the opening square bracket of the "character class"

exports.VALID_DIGITS = VALID_DIGITS;
var DASHES = "-\u2010-\u2015\u2212\u30FC\uFF0D";
var SLASHES = "\uFF0F/";
var DOTS = "\uFF0E.";
var WHITESPACE = " \xA0\xAD\u200B\u2060\u3000";
exports.WHITESPACE = WHITESPACE;
var BRACKETS = "()\uFF08\uFF09\uFF3B\uFF3D\\[\\]"; // export const OPENING_BRACKETS = '(\uFF08\uFF3B\\\['

var TILDES = "~\u2053\u223C\uFF5E"; // Regular expression of acceptable punctuation found in phone numbers. This
// excludes punctuation found as a leading character only. This consists of dash
// characters, white space characters, full stops, slashes, square brackets,
// parentheses and tildes. Full-width variants are also present.

var VALID_PUNCTUATION = "".concat(DASHES).concat(SLASHES).concat(DOTS).concat(WHITESPACE).concat(BRACKETS).concat(TILDES);
exports.VALID_PUNCTUATION = VALID_PUNCTUATION;
var PLUS_CHARS = "+\uFF0B"; // const LEADING_PLUS_CHARS_PATTERN = new RegExp('^[' + PLUS_CHARS + ']+')

exports.PLUS_CHARS = PLUS_CHARS;

},{}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = findNumbers;

var _findNumbers_ = _interopRequireDefault(require("./findNumbers_"));

var _parsePhoneNumber = require("./parsePhoneNumber");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function findNumbers() {
  var _normalizeArguments = (0, _parsePhoneNumber.normalizeArguments)(arguments),
      text = _normalizeArguments.text,
      options = _normalizeArguments.options,
      metadata = _normalizeArguments.metadata;

  return (0, _findNumbers_["default"])(text, options, metadata);
}

},{"./findNumbers_":22,"./parsePhoneNumber":58}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// https://medium.com/dsinjs/implementing-lru-cache-in-javascript-94ba6755cda9
var Node = function Node(key, value) {
  var next = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var prev = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  _classCallCheck(this, Node);

  this.key = key;
  this.value = value;
  this.next = next;
  this.prev = prev;
};

var LRUCache =
/*#__PURE__*/
function () {
  //set default limit of 10 if limit is not passed.
  function LRUCache() {
    var limit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

    _classCallCheck(this, LRUCache);

    this.size = 0;
    this.limit = limit;
    this.head = null;
    this.tail = null;
    this.cache = {};
  } // Write Node to head of LinkedList
  // update cache with Node key and Node reference


  _createClass(LRUCache, [{
    key: "put",
    value: function put(key, value) {
      this.ensureLimit();

      if (!this.head) {
        this.head = this.tail = new Node(key, value);
      } else {
        var node = new Node(key, value, this.head);
        this.head.prev = node;
        this.head = node;
      } //Update the cache map


      this.cache[key] = this.head;
      this.size++;
    } // Read from cache map and make that node as new Head of LinkedList

  }, {
    key: "get",
    value: function get(key) {
      if (this.cache[key]) {
        var value = this.cache[key].value; // node removed from it's position and cache

        this.remove(key); // write node again to the head of LinkedList to make it most recently used

        this.put(key, value);
        return value;
      }

      console.log("Item not available in cache for key ".concat(key));
    }
  }, {
    key: "ensureLimit",
    value: function ensureLimit() {
      if (this.size === this.limit) {
        this.remove(this.tail.key);
      }
    }
  }, {
    key: "remove",
    value: function remove(key) {
      var node = this.cache[key];

      if (node.prev !== null) {
        node.prev.next = node.next;
      } else {
        this.head = node.next;
      }

      if (node.next !== null) {
        node.next.prev = node.prev;
      } else {
        this.tail = node.prev;
      }

      delete this.cache[key];
      this.size--;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.head = null;
      this.tail = null;
      this.size = 0;
      this.cache = {};
    } // // Invokes the callback function with every node of the chain and the index of the node.
    // forEach(fn) {
    //   let node = this.head;
    //   let counter = 0;
    //   while (node) {
    //     fn(node, counter);
    //     node = node.next;
    //     counter++;
    //   }
    // }
    // // To iterate over LRU with a 'for...of' loop
    // *[Symbol.iterator]() {
    //   let node = this.head;
    //   while (node) {
    //     yield node;
    //     node = node.next;
    //   }
    // }

  }]);

  return LRUCache;
}();

exports["default"] = LRUCache;

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.containsMoreThanOneSlashInNationalNumber = containsMoreThanOneSlashInNationalNumber;
exports["default"] = void 0;

var _validate_ = _interopRequireDefault(require("../validate_"));

var _parseDigits = _interopRequireDefault(require("../helpers/parseDigits"));

var _util = require("./util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Leniency when finding potential phone numbers in text segments
 * The levels here are ordered in increasing strictness.
 */
var _default = {
  /**
   * Phone numbers accepted are "possible", but not necessarily "valid".
   */
  POSSIBLE: function POSSIBLE(number, candidate, metadata) {
    return true;
  },

  /**
   * Phone numbers accepted are "possible" and "valid".
   * Numbers written in national format must have their national-prefix
   * present if it is usually written for a number of this type.
   */
  VALID: function VALID(number, candidate, metadata) {
    if (!(0, _validate_["default"])(number, undefined, metadata) || !containsOnlyValidXChars(number, candidate.toString(), metadata)) {
      return false;
    } // Skipped for simplicity.
    // return isNationalPrefixPresentIfRequired(number, metadata)


    return true;
  },

  /**
   * Phone numbers accepted are "valid" and
   * are grouped in a possible way for this locale. For example, a US number written as
   * "65 02 53 00 00" and "650253 0000" are not accepted at this leniency level, whereas
   * "650 253 0000", "650 2530000" or "6502530000" are.
   * Numbers with more than one '/' symbol in the national significant number
   * are also dropped at this level.
   *
   * Warning: This level might result in lower coverage especially for regions outside of
   * country code "+1". If you are not sure about which level to use,
   * email the discussion group libphonenumber-discuss@googlegroups.com.
   */
  STRICT_GROUPING: function STRICT_GROUPING(number, candidate, metadata, regExpCache) {
    var candidateString = candidate.toString();

    if (!(0, _validate_["default"])(number, undefined, metadata) || !containsOnlyValidXChars(number, candidateString, metadata) || containsMoreThanOneSlashInNationalNumber(number, candidateString) || !isNationalPrefixPresentIfRequired(number, metadata)) {
      return false;
    }

    return checkNumberGroupingIsValid(number, candidate, metadata, allNumberGroupsRemainGrouped, regExpCache);
  },

  /**
   * Phone numbers accepted are {@linkplain PhoneNumberUtil#isValidNumber(PhoneNumber) valid} and
   * are grouped in the same way that we would have formatted it, or as a single block. For
   * example, a US number written as "650 2530000" is not accepted at this leniency level, whereas
   * "650 253 0000" or "6502530000" are.
   * Numbers with more than one '/' symbol are also dropped at this level.
   * <p>
   * Warning: This level might result in lower coverage especially for regions outside of country
   * code "+1". If you are not sure about which level to use, email the discussion group
   * libphonenumber-discuss@googlegroups.com.
   */
  EXACT_GROUPING: function EXACT_GROUPING(number, candidate, metadata, regExpCache) {
    var candidateString = candidate.toString();

    if (!(0, _validate_["default"])(number, undefined, metadata) || !containsOnlyValidXChars(number, candidateString, metadata) || containsMoreThanOneSlashInNationalNumber(number, candidateString) || !isNationalPrefixPresentIfRequired(number, metadata)) {
      return false;
    }

    return checkNumberGroupingIsValid(number, candidate, metadata, allNumberGroupsAreExactlyPresent, regExpCache);
  }
};
exports["default"] = _default;

function containsOnlyValidXChars(number, candidate, metadata) {
  // The characters 'x' and 'X' can be (1) a carrier code, in which case they always precede the
  // national significant number or (2) an extension sign, in which case they always precede the
  // extension number. We assume a carrier code is more than 1 digit, so the first case has to
  // have more than 1 consecutive 'x' or 'X', whereas the second case can only have exactly 1 'x'
  // or 'X'. We ignore the character if it appears as the last character of the string.
  for (var index = 0; index < candidate.length - 1; index++) {
    var charAtIndex = candidate.charAt(index);

    if (charAtIndex === 'x' || charAtIndex === 'X') {
      var charAtNextIndex = candidate.charAt(index + 1);

      if (charAtNextIndex === 'x' || charAtNextIndex === 'X') {
        // This is the carrier code case, in which the 'X's always precede the national
        // significant number.
        index++;

        if (util.isNumberMatch(number, candidate.substring(index)) != MatchType.NSN_MATCH) {
          return false;
        } // This is the extension sign case, in which the 'x' or 'X' should always precede the
        // extension number.

      } else if ((0, _parseDigits["default"])(candidate.substring(index)) !== number.ext) {
        return false;
      }
    }
  }

  return true;
}

function isNationalPrefixPresentIfRequired(number, _metadata) {
  // First, check how we deduced the country code. If it was written in international format, then
  // the national prefix is not required.
  if (number.getCountryCodeSource() != 'FROM_DEFAULT_COUNTRY') {
    return true;
  }

  var phoneNumberRegion = util.getRegionCodeForCountryCode(number.getCountryCode());
  var metadata = util.getMetadataForRegion(phoneNumberRegion);

  if (metadata == null) {
    return true;
  } // Check if a national prefix should be present when formatting this number.


  var nationalNumber = util.getNationalSignificantNumber(number);
  var formatRule = util.chooseFormattingPatternForNumber(metadata.numberFormats(), nationalNumber); // To do this, we check that a national prefix formatting rule was present
  // and that it wasn't just the first-group symbol ($1) with punctuation.

  if (formatRule && formatRule.getNationalPrefixFormattingRule().length > 0) {
    if (formatRule.getNationalPrefixOptionalWhenFormatting()) {
      // The national-prefix is optional in these cases, so we don't need to check if it was
      // present.
      return true;
    }

    if (PhoneNumberUtil.formattingRuleHasFirstGroupOnly(formatRule.getNationalPrefixFormattingRule())) {
      // National Prefix not needed for this number.
      return true;
    } // Normalize the remainder.


    var rawInputCopy = PhoneNumberUtil.normalizeDigitsOnly(number.getRawInput()); // Check if we found a national prefix and/or carrier code at the start of the raw input, and
    // return the result.

    return util.maybeStripNationalPrefixAndCarrierCode(rawInputCopy, metadata, null);
  }

  return true;
}

function containsMoreThanOneSlashInNationalNumber(number, candidate) {
  var firstSlashInBodyIndex = candidate.indexOf('/');

  if (firstSlashInBodyIndex < 0) {
    // No slashes, this is okay.
    return false;
  } // Now look for a second one.


  var secondSlashInBodyIndex = candidate.indexOf('/', firstSlashInBodyIndex + 1);

  if (secondSlashInBodyIndex < 0) {
    // Only one slash, this is okay.
    return false;
  } // If the first slash is after the country calling code, this is permitted.


  var candidateHasCountryCode = number.getCountryCodeSource() === CountryCodeSource.FROM_NUMBER_WITH_PLUS_SIGN || number.getCountryCodeSource() === CountryCodeSource.FROM_NUMBER_WITHOUT_PLUS_SIGN;

  if (candidateHasCountryCode && PhoneNumberUtil.normalizeDigitsOnly(candidate.substring(0, firstSlashInBodyIndex)) === String(number.getCountryCode())) {
    // Any more slashes and this is illegal.
    return candidate.slice(secondSlashInBodyIndex + 1).indexOf('/') >= 0;
  }

  return true;
}

function checkNumberGroupingIsValid(number, candidate, metadata, checkGroups, regExpCache) {
  var normalizedCandidate = normalizeDigits(candidate, true
  /* keep non-digits */
  );
  var formattedNumberGroups = getNationalNumberGroups(metadata, number, null);

  if (checkGroups(metadata, number, normalizedCandidate, formattedNumberGroups)) {
    return true;
  } // If this didn't pass, see if there are any alternate formats that match, and try them instead.


  var alternateFormats = MetadataManager.getAlternateFormatsForCountry(number.getCountryCode());
  var nationalSignificantNumber = util.getNationalSignificantNumber(number);

  if (alternateFormats) {
    for (var _iterator = alternateFormats.numberFormats(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var alternateFormat = _ref;

      if (alternateFormat.leadingDigitsPatterns().length > 0) {
        // There is only one leading digits pattern for alternate formats.
        var leadingDigitsRegExp = regExpCache.getPatternForRegExp('^' + alternateFormat.leadingDigitsPatterns()[0]);

        if (!leadingDigitsRegExp.test(nationalSignificantNumber)) {
          // Leading digits don't match; try another one.
          continue;
        }
      }

      formattedNumberGroups = getNationalNumberGroups(metadata, number, alternateFormat);

      if (checkGroups(metadata, number, normalizedCandidate, formattedNumberGroups)) {
        return true;
      }
    }
  }

  return false;
}
/**
 * Helper method to get the national-number part of a number, formatted without any national
 * prefix, and return it as a set of digit blocks that would be formatted together following
 * standard formatting rules.
 */


function getNationalNumberGroups(metadata, number, formattingPattern) {
  if (formattingPattern) {
    // We format the NSN only, and split that according to the separator.
    var nationalSignificantNumber = util.getNationalSignificantNumber(number);
    return util.formatNsnUsingPattern(nationalSignificantNumber, formattingPattern, 'RFC3966', metadata).split('-');
  } // This will be in the format +CC-DG1-DG2-DGX;ext=EXT where DG1..DGX represents groups of digits.


  var rfc3966Format = formatNumber(number, 'RFC3966', metadata); // We remove the extension part from the formatted string before splitting it into different
  // groups.

  var endIndex = rfc3966Format.indexOf(';');

  if (endIndex < 0) {
    endIndex = rfc3966Format.length;
  } // The country-code will have a '-' following it.


  var startIndex = rfc3966Format.indexOf('-') + 1;
  return rfc3966Format.slice(startIndex, endIndex).split('-');
}

function allNumberGroupsAreExactlyPresent(metadata, number, normalizedCandidate, formattedNumberGroups) {
  var candidateGroups = normalizedCandidate.split(NON_DIGITS_PATTERN); // Set this to the last group, skipping it if the number has an extension.

  var candidateNumberGroupIndex = number.hasExtension() ? candidateGroups.length - 2 : candidateGroups.length - 1; // First we check if the national significant number is formatted as a block.
  // We use contains and not equals, since the national significant number may be present with
  // a prefix such as a national number prefix, or the country code itself.

  if (candidateGroups.length == 1 || candidateGroups[candidateNumberGroupIndex].contains(util.getNationalSignificantNumber(number))) {
    return true;
  } // Starting from the end, go through in reverse, excluding the first group, and check the
  // candidate and number groups are the same.


  var formattedNumberGroupIndex = formattedNumberGroups.length - 1;

  while (formattedNumberGroupIndex > 0 && candidateNumberGroupIndex >= 0) {
    if (candidateGroups[candidateNumberGroupIndex] !== formattedNumberGroups[formattedNumberGroupIndex]) {
      return false;
    }

    formattedNumberGroupIndex--;
    candidateNumberGroupIndex--;
  } // Now check the first group. There may be a national prefix at the start, so we only check
  // that the candidate group ends with the formatted number group.


  return candidateNumberGroupIndex >= 0 && (0, _util.endsWith)(candidateGroups[candidateNumberGroupIndex], formattedNumberGroups[0]);
}

function allNumberGroupsRemainGrouped(metadata, number, normalizedCandidate, formattedNumberGroups) {
  var fromIndex = 0;

  if (number.getCountryCodeSource() !== CountryCodeSource.FROM_DEFAULT_COUNTRY) {
    // First skip the country code if the normalized candidate contained it.
    var countryCode = String(number.getCountryCode());
    fromIndex = normalizedCandidate.indexOf(countryCode) + countryCode.length();
  } // Check each group of consecutive digits are not broken into separate groupings in the
  // {@code normalizedCandidate} string.


  for (var i = 0; i < formattedNumberGroups.length; i++) {
    // Fails if the substring of {@code normalizedCandidate} starting from {@code fromIndex}
    // doesn't contain the consecutive digits in formattedNumberGroups[i].
    fromIndex = normalizedCandidate.indexOf(formattedNumberGroups[i], fromIndex);

    if (fromIndex < 0) {
      return false;
    } // Moves {@code fromIndex} forward.


    fromIndex += formattedNumberGroups[i].length();

    if (i == 0 && fromIndex < normalizedCandidate.length()) {
      // We are at the position right after the NDC. We get the region used for formatting
      // information based on the country code in the phone number, rather than the number itself,
      // as we do not need to distinguish between different countries with the same country
      // calling code and this is faster.
      var region = util.getRegionCodeForCountryCode(number.getCountryCode());

      if (util.getNddPrefixForRegion(region, true) != null && Character.isDigit(normalizedCandidate.charAt(fromIndex))) {
        // This means there is no formatting symbol after the NDC. In this case, we only
        // accept the number if there is no formatting symbol at all in the number, except
        // for extensions. This is only important for countries with national prefixes.
        var nationalSignificantNumber = util.getNationalSignificantNumber(number);
        return (0, _util.startsWith)(normalizedCandidate.slice(fromIndex - formattedNumberGroups[i].length), nationalSignificantNumber);
      }
    }
  } // The check here makes sure that we haven't mistakenly already used the extension to
  // match the last group of the subscriber number. Note the extension cannot have
  // formatting in-between digits.


  return normalizedCandidate.slice(fromIndex).contains(number.getExtension());
}

},{"../helpers/parseDigits":49,"../validate_":67,"./util":21}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _LRUCache = _interopRequireDefault(require("./LRUCache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// A cache for frequently used country-specific regular expressions. Set to 32 to cover ~2-3
// countries being used for the same doc with ~10 patterns for each country. Some pages will have
// a lot more countries in use, but typically fewer numbers for each so expanding the cache for
// that use-case won't have a lot of benefit.
var RegExpCache =
/*#__PURE__*/
function () {
  function RegExpCache(size) {
    _classCallCheck(this, RegExpCache);

    this.cache = new _LRUCache["default"](size);
  }

  _createClass(RegExpCache, [{
    key: "getPatternForRegExp",
    value: function getPatternForRegExp(pattern) {
      var regExp = this.cache.get(pattern);

      if (!regExp) {
        regExp = new RegExp('^' + pattern);
        this.cache.put(pattern, regExp);
      }

      return regExp;
    }
  }]);

  return RegExpCache;
}();

exports["default"] = RegExpCache;

},{"./LRUCache":14}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isValidCandidate;
exports.LEAD_CLASS = void 0;

var _constants = require("../constants");

var _util = require("./util");

var _utf = require("./utf-8");

// Copy-pasted from `PhoneNumberMatcher.js`.
var OPENING_PARENS = "(\\[\uFF08\uFF3B";
var CLOSING_PARENS = ")\\]\uFF09\uFF3D";
var NON_PARENS = "[^".concat(OPENING_PARENS).concat(CLOSING_PARENS, "]");
var LEAD_CLASS = "[".concat(OPENING_PARENS).concat(_constants.PLUS_CHARS, "]"); // Punctuation that may be at the start of a phone number - brackets and plus signs.

exports.LEAD_CLASS = LEAD_CLASS;
var LEAD_CLASS_LEADING = new RegExp('^' + LEAD_CLASS); // Limit on the number of pairs of brackets in a phone number.

var BRACKET_PAIR_LIMIT = (0, _util.limit)(0, 3);
/**
 * Pattern to check that brackets match. Opening brackets should be closed within a phone number.
 * This also checks that there is something inside the brackets. Having no brackets at all is also
 * fine.
 *
 * An opening bracket at the beginning may not be closed, but subsequent ones should be.  It's
 * also possible that the leading bracket was dropped, so we shouldn't be surprised if we see a
 * closing bracket first. We limit the sets of brackets in a phone number to four.
 */

var MATCHING_BRACKETS_ENTIRE = new RegExp('^' + "(?:[" + OPENING_PARENS + "])?" + "(?:" + NON_PARENS + "+" + "[" + CLOSING_PARENS + "])?" + NON_PARENS + "+" + "(?:[" + OPENING_PARENS + "]" + NON_PARENS + "+[" + CLOSING_PARENS + "])" + BRACKET_PAIR_LIMIT + NON_PARENS + "*" + '$');
/**
 * Matches strings that look like publication pages. Example:
 * <pre>Computing Complete Answers to Queries in the Presence of Limited Access Patterns.
 * Chen Li. VLDB J. 12(3): 211-227 (2003).</pre>
 *
 * The string "211-227 (2003)" is not a telephone number.
 */

var PUB_PAGES = /\d{1,5}-+\d{1,5}\s{0,4}\(\d{1,4}/;

function isValidCandidate(candidate, offset, text, leniency) {
  // Check the candidate doesn't contain any formatting
  // which would indicate that it really isn't a phone number.
  if (!MATCHING_BRACKETS_ENTIRE.test(candidate) || PUB_PAGES.test(candidate)) {
    return;
  } // If leniency is set to VALID or stricter, we also want to skip numbers that are surrounded
  // by Latin alphabetic characters, to skip cases like abc8005001234 or 8005001234def.


  if (leniency !== 'POSSIBLE') {
    // If the candidate is not at the start of the text,
    // and does not start with phone-number punctuation,
    // check the previous character.
    if (offset > 0 && !LEAD_CLASS_LEADING.test(candidate)) {
      var previousChar = text[offset - 1]; // We return null if it is a latin letter or an invalid punctuation symbol.

      if ((0, _utf.isInvalidPunctuationSymbol)(previousChar) || (0, _utf.isLatinLetter)(previousChar)) {
        return false;
      }
    }

    var lastCharIndex = offset + candidate.length;

    if (lastCharIndex < text.length) {
      var nextChar = text[lastCharIndex];

      if ((0, _utf.isInvalidPunctuationSymbol)(nextChar) || (0, _utf.isLatinLetter)(nextChar)) {
        return false;
      }
    }
  }

  return true;
}

},{"../constants":12,"./utf-8":20,"./util":21}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isValidPreCandidate;
// Matches strings that look like dates using "/" as a separator.
// Examples: 3/10/2011, 31/10/96 or 08/31/95.
var SLASH_SEPARATED_DATES = /(?:(?:[0-3]?\d\/[01]?\d)|(?:[01]?\d\/[0-3]?\d))\/(?:[12]\d)?\d{2}/; // Matches timestamps.
// Examples: "2012-01-02 08:00".
// Note that the reg-ex does not include the
// trailing ":\d\d" -- that is covered by TIME_STAMPS_SUFFIX.

var TIME_STAMPS = /[12]\d{3}[-/]?[01]\d[-/]?[0-3]\d +[0-2]\d$/;
var TIME_STAMPS_SUFFIX_LEADING = /^:[0-5]\d/;

function isValidPreCandidate(candidate, offset, text) {
  // Skip a match that is more likely to be a date.
  if (SLASH_SEPARATED_DATES.test(candidate)) {
    return false;
  } // Skip potential time-stamps.


  if (TIME_STAMPS.test(candidate)) {
    var followingText = text.slice(offset + candidate.length);

    if (TIME_STAMPS_SUFFIX_LEADING.test(followingText)) {
      return false;
    }
  }

  return true;
}

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parsePreCandidate;

var _util = require("./util");

// Regular expression of characters typically used to start a second phone number for the purposes
// of parsing. This allows us to strip off parts of the number that are actually the start of
// another number, such as for: (530) 583-6985 x302/x2303 -> the second extension here makes this
// actually two phone numbers, (530) 583-6985 x302 and (530) 583-6985 x2303. We remove the second
// extension so that the first number is parsed correctly.
//
// Matches a slash (\ or /) followed by a space followed by an `x`.
//
var SECOND_NUMBER_START_PATTERN = /[\\/] *x/;

function parsePreCandidate(candidate) {
  // Check for extra numbers at the end.
  // TODO: This is the place to start when trying to support extraction of multiple phone number
  // from split notations (+41 79 123 45 67 / 68).
  return (0, _util.trimAfterFirstMatch)(SECOND_NUMBER_START_PATTERN, candidate);
}

},{"./util":21}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isLatinLetter = isLatinLetter;
exports.isInvalidPunctuationSymbol = isInvalidPunctuationSymbol;
exports._pL = exports.pNd = exports._pN = exports.PZ = exports.pZ = void 0;
// Javascript doesn't support UTF-8 regular expressions.
// So mimicking them here.
// Copy-pasted from `PhoneNumberMatcher.js`.

/**
 * "\p{Z}" is any kind of whitespace or invisible separator ("Separator").
 * http://www.regular-expressions.info/unicode.html
 * "\P{Z}" is the reverse of "\p{Z}".
 * "\p{N}" is any kind of numeric character in any script ("Number").
 * "\p{Nd}" is a digit zero through nine in any script except "ideographic scripts" ("Decimal_Digit_Number").
 * "\p{Sc}" is a currency symbol ("Currency_Symbol").
 * "\p{L}" is any kind of letter from any language ("Letter").
 * "\p{Mn}" is "non-spacing mark".
 *
 * Javascript doesn't support Unicode Regular Expressions
 * so substituting it with this explicit set of characters.
 *
 * https://stackoverflow.com/questions/13210194/javascript-regex-equivalent-of-a-za-z-using-pl
 * https://github.com/danielberndt/babel-plugin-utf-8-regex/blob/master/src/transformer.js
 */
var _pZ = " \xA0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000";
var pZ = "[".concat(_pZ, "]");
exports.pZ = pZ;
var PZ = "[^".concat(_pZ, "]");
exports.PZ = PZ;
var _pN = "0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19"; // const pN = `[${_pN}]`

exports._pN = _pN;
var _pNd = "0-9\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19";
var pNd = "[".concat(_pNd, "]");
exports.pNd = pNd;
var _pL = "A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC";
exports._pL = _pL;
var pL = "[".concat(_pL, "]");
var pL_regexp = new RegExp(pL);
var _pSc = "$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20B9\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6";
var pSc = "[".concat(_pSc, "]");
var pSc_regexp = new RegExp(pSc);
var _pMn = "\u0300-\u036F\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E4-\u08FE\u0900-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0CBC\u0CBF\u0CC6\u0CCC\u0CCD\u0CE2\u0CE3\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1DC0-\u1DE6\u1DFC-\u1DFF\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F\uA674-\uA67D\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE26";
var pMn = "[".concat(_pMn, "]");
var pMn_regexp = new RegExp(pMn);
var _InBasic_Latin = "\0-\x7F";
var _InLatin_1_Supplement = "\x80-\xFF";
var _InLatin_Extended_A = "\u0100-\u017F";
var _InLatin_Extended_Additional = "\u1E00-\u1EFF";
var _InLatin_Extended_B = "\u0180-\u024F";
var _InCombining_Diacritical_Marks = "\u0300-\u036F";
var latinLetterRegexp = new RegExp('[' + _InBasic_Latin + _InLatin_1_Supplement + _InLatin_Extended_A + _InLatin_Extended_Additional + _InLatin_Extended_B + _InCombining_Diacritical_Marks + ']');
/**
 * Helper method to determine if a character is a Latin-script letter or not.
 * For our purposes, combining marks should also return true since we assume
 * they have been added to a preceding Latin character.
 */

function isLatinLetter(letter) {
  // Combining marks are a subset of non-spacing-mark.
  if (!pL_regexp.test(letter) && !pMn_regexp.test(letter)) {
    return false;
  }

  return latinLetterRegexp.test(letter);
}

function isInvalidPunctuationSymbol(character) {
  return character === '%' || pSc_regexp.test(character);
}

},{}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.limit = limit;
exports.trimAfterFirstMatch = trimAfterFirstMatch;
exports.startsWith = startsWith;
exports.endsWith = endsWith;

/** Returns a regular expression quantifier with an upper and lower limit. */
function limit(lower, upper) {
  if (lower < 0 || upper <= 0 || upper < lower) {
    throw new TypeError();
  }

  return "{".concat(lower, ",").concat(upper, "}");
}
/**
 * Trims away any characters after the first match of {@code pattern} in {@code candidate},
 * returning the trimmed version.
 */


function trimAfterFirstMatch(regexp, string) {
  var index = string.search(regexp);

  if (index >= 0) {
    return string.slice(0, index);
  }

  return string;
}

function startsWith(string, substring) {
  return string.indexOf(substring) === 0;
}

function endsWith(string, substring) {
  return string.indexOf(substring, string.length - substring.length) === string.length - substring.length;
}

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = findNumbers;

var _PhoneNumberMatcher = _interopRequireDefault(require("./PhoneNumberMatcher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function findNumbers(text, options, metadata) {
  var matcher = new _PhoneNumberMatcher["default"](text, options, metadata);
  var results = [];

  while (matcher.hasNext()) {
    results.push(matcher.next());
  }

  return results;
}

},{"./PhoneNumberMatcher":11}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = findPhoneNumbers;
exports.searchPhoneNumbers = searchPhoneNumbers;

var _findPhoneNumbers_ = _interopRequireWildcard(require("./findPhoneNumbers_"));

var _parsePhoneNumber = require("./parsePhoneNumber");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

// This is a legacy function.
// Use `findNumbers()` instead.
function findPhoneNumbers() {
  var _normalizeArguments = (0, _parsePhoneNumber.normalizeArguments)(arguments),
      text = _normalizeArguments.text,
      options = _normalizeArguments.options,
      metadata = _normalizeArguments.metadata;

  return (0, _findPhoneNumbers_["default"])(text, options, metadata);
}
/**
 * @return ES6 `for ... of` iterator.
 */


function searchPhoneNumbers() {
  var _normalizeArguments2 = (0, _parsePhoneNumber.normalizeArguments)(arguments),
      text = _normalizeArguments2.text,
      options = _normalizeArguments2.options,
      metadata = _normalizeArguments2.metadata;

  return (0, _findPhoneNumbers_.searchPhoneNumbers)(text, options, metadata);
}

},{"./findPhoneNumbers_":25,"./parsePhoneNumber":58}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = findPhoneNumbersInText;
exports.getArguments = getArguments;

var _findNumbers = _interopRequireDefault(require("./findNumbers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function findPhoneNumbersInText(text, defaultCountry, options, metadata) {
  var args = getArguments(defaultCountry, options, metadata);
  return (0, _findNumbers["default"])(text, args.options, args.metadata);
}

function getArguments(defaultCountry, options, metadata) {
  if (metadata) {
    if (defaultCountry) {
      options = _objectSpread({}, options, {
        defaultCountry: defaultCountry
      });
    }
  } else {
    if (options) {
      metadata = options;

      if (defaultCountry) {
        if (is_object(defaultCountry)) {
          options = defaultCountry;
        } else {
          options = {
            defaultCountry: defaultCountry
          };
        }
      } else {
        options = undefined;
      }
    } else {
      metadata = defaultCountry;
      options = undefined;
    }
  }

  return {
    options: _objectSpread({}, options, {
      v2: true
    }),
    metadata: metadata
  };
} // Babel transforms `typeof` into some "branches"
// so istanbul will show this as "branch not covered".

/* istanbul ignore next */


var is_object = function is_object(_) {
  return _typeof(_) === 'object';
};

},{"./findNumbers":13}],25:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = findPhoneNumbers;
exports.searchPhoneNumbers = searchPhoneNumbers;
exports.PhoneNumberSearch = exports.EXTN_PATTERNS_FOR_PARSING = void 0;

var _constants = require("./constants");

var _parse_ = _interopRequireDefault(require("./parse_"));

var _isViablePhoneNumber = require("./helpers/isViablePhoneNumber");

var _createExtensionPattern = _interopRequireDefault(require("./helpers/extension/createExtensionPattern"));

var _parsePreCandidate = _interopRequireDefault(require("./findNumbers/parsePreCandidate"));

var _isValidPreCandidate = _interopRequireDefault(require("./findNumbers/isValidPreCandidate"));

var _isValidCandidate = _interopRequireDefault(require("./findNumbers/isValidCandidate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Regexp of all possible ways to write extensions, for use when parsing. This
 * will be run as a case-insensitive regexp match. Wide character versions are
 * also provided after each ASCII version. There are three regular expressions
 * here. The first covers RFC 3966 format, where the extension is added using
 * ';ext='. The second more generic one starts with optional white space and
 * ends with an optional full stop (.), followed by zero or more spaces/tabs
 * /commas and then the numbers themselves. The other one covers the special
 * case of American numbers where the extension is written with a hash at the
 * end, such as '- 503#'. Note that the only capturing groups should be around
 * the digits that you want to capture as part of the extension, or else parsing
 * will fail! We allow two options for representing the accented o - the
 * character itself, and one in the unicode decomposed form with the combining
 * acute accent.
 */
var EXTN_PATTERNS_FOR_PARSING = (0, _createExtensionPattern["default"])('parsing');
exports.EXTN_PATTERNS_FOR_PARSING = EXTN_PATTERNS_FOR_PARSING;
var WHITESPACE_IN_THE_BEGINNING_PATTERN = new RegExp('^[' + _constants.WHITESPACE + ']+');
var PUNCTUATION_IN_THE_END_PATTERN = new RegExp('[' + _constants.VALID_PUNCTUATION + ']+$'); // // Regular expression for getting opening brackets for a valid number
// // found using `PHONE_NUMBER_START_PATTERN` for prepending those brackets to the number.
// const BEFORE_NUMBER_DIGITS_PUNCTUATION = new RegExp('[' + OPENING_BRACKETS + ']+' + '[' + WHITESPACE + ']*' + '$')

var VALID_PRECEDING_CHARACTER_PATTERN = /[^a-zA-Z0-9]/;

function findPhoneNumbers(text, options, metadata) {
  /* istanbul ignore if */
  if (options === undefined) {
    options = {};
  }

  var search = new PhoneNumberSearch(text, options, metadata);
  var phones = [];

  while (search.hasNext()) {
    phones.push(search.next());
  }

  return phones;
}
/**
 * @return ES6 `for ... of` iterator.
 */


function searchPhoneNumbers(text, options, metadata) {
  /* istanbul ignore if */
  if (options === undefined) {
    options = {};
  }

  var search = new PhoneNumberSearch(text, options, metadata);
  return _defineProperty({}, Symbol.iterator, function () {
    return {
      next: function next() {
        if (search.hasNext()) {
          return {
            done: false,
            value: search.next()
          };
        }

        return {
          done: true
        };
      }
    };
  });
}
/**
 * Extracts a parseable phone number including any opening brackets, etc.
 * @param  {string} text - Input.
 * @return {object} `{ ?number, ?startsAt, ?endsAt }`.
 */


var PhoneNumberSearch =
/*#__PURE__*/
function () {
  // Iteration tristate.
  function PhoneNumberSearch(text, options, metadata) {
    _classCallCheck(this, PhoneNumberSearch);

    _defineProperty(this, "state", 'NOT_READY');

    this.text = text; // If assigning the `{}` default value is moved to the arguments above,
    // code coverage would decrease for some weird reason.

    this.options = options || {};
    this.metadata = metadata;
    this.regexp = new RegExp(_isViablePhoneNumber.VALID_PHONE_NUMBER_WITH_EXTENSION, 'ig');
  }

  _createClass(PhoneNumberSearch, [{
    key: "find",
    value: function find() {
      var matches = this.regexp.exec(this.text);

      if (!matches) {
        return;
      }

      var number = matches[0];
      var startsAt = matches.index;
      number = number.replace(WHITESPACE_IN_THE_BEGINNING_PATTERN, '');
      startsAt += matches[0].length - number.length; // Fixes not parsing numbers with whitespace in the end.
      // Also fixes not parsing numbers with opening parentheses in the end.
      // https://github.com/catamphetamine/libphonenumber-js/issues/252

      number = number.replace(PUNCTUATION_IN_THE_END_PATTERN, '');
      number = (0, _parsePreCandidate["default"])(number);
      var result = this.parseCandidate(number, startsAt);

      if (result) {
        return result;
      } // Tail recursion.
      // Try the next one if this one is not a valid phone number.


      return this.find();
    }
  }, {
    key: "parseCandidate",
    value: function parseCandidate(number, startsAt) {
      if (!(0, _isValidPreCandidate["default"])(number, startsAt, this.text)) {
        return;
      } // Don't parse phone numbers which are non-phone numbers
      // due to being part of something else (e.g. a UUID).
      // https://github.com/catamphetamine/libphonenumber-js/issues/213
      // Copy-pasted from Google's `PhoneNumberMatcher.js` (`.parseAndValidate()`).


      if (!(0, _isValidCandidate["default"])(number, startsAt, this.text, this.options.extended ? 'POSSIBLE' : 'VALID')) {
        return;
      } // // Prepend any opening brackets left behind by the
      // // `PHONE_NUMBER_START_PATTERN` regexp.
      // const text_before_number = text.slice(this.searching_from, startsAt)
      // const full_number_starts_at = text_before_number.search(BEFORE_NUMBER_DIGITS_PUNCTUATION)
      // if (full_number_starts_at >= 0)
      // {
      // 	number   = text_before_number.slice(full_number_starts_at) + number
      // 	startsAt = full_number_starts_at
      // }
      //
      // this.searching_from = matches.lastIndex


      var result = (0, _parse_["default"])(number, this.options, this.metadata);

      if (!result.phone) {
        return;
      }

      result.startsAt = startsAt;
      result.endsAt = startsAt + number.length;
      return result;
    }
  }, {
    key: "hasNext",
    value: function hasNext() {
      if (this.state === 'NOT_READY') {
        this.last_match = this.find();

        if (this.last_match) {
          this.state = 'READY';
        } else {
          this.state = 'DONE';
        }
      }

      return this.state === 'READY';
    }
  }, {
    key: "next",
    value: function next() {
      // Check the state and find the next match as a side-effect if necessary.
      if (!this.hasNext()) {
        throw new Error('No next element');
      } // Don't retain that memory any longer than necessary.


      var result = this.last_match;
      this.last_match = null;
      this.state = 'NOT_READY';
      return result;
    }
  }]);

  return PhoneNumberSearch;
}();

exports.PhoneNumberSearch = PhoneNumberSearch;

},{"./constants":12,"./findNumbers/isValidCandidate":17,"./findNumbers/isValidPreCandidate":18,"./findNumbers/parsePreCandidate":19,"./helpers/extension/createExtensionPattern":36,"./helpers/isViablePhoneNumber":46,"./parse_":62}],26:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = formatNumber;

var _format_ = _interopRequireDefault(require("./format_"));

var _parse_ = _interopRequireDefault(require("./parse_"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function formatNumber() {
  var _normalizeArguments = normalizeArguments(arguments),
      input = _normalizeArguments.input,
      format = _normalizeArguments.format,
      options = _normalizeArguments.options,
      metadata = _normalizeArguments.metadata;

  return (0, _format_["default"])(input, format, options, metadata);
} // Sort out arguments


function normalizeArguments(args) {
  var _Array$prototype$slic = Array.prototype.slice.call(args),
      _Array$prototype$slic2 = _slicedToArray(_Array$prototype$slic, 5),
      arg_1 = _Array$prototype$slic2[0],
      arg_2 = _Array$prototype$slic2[1],
      arg_3 = _Array$prototype$slic2[2],
      arg_4 = _Array$prototype$slic2[3],
      arg_5 = _Array$prototype$slic2[4];

  var input;
  var format;
  var options;
  var metadata; // Sort out arguments.
  // If the phone number is passed as a string.
  // `format('8005553535', ...)`.

  if (typeof arg_1 === 'string') {
    // If country code is supplied.
    // `format('8005553535', 'RU', 'NATIONAL', [options], metadata)`.
    if (typeof arg_3 === 'string') {
      format = arg_3;

      if (arg_5) {
        options = arg_4;
        metadata = arg_5;
      } else {
        metadata = arg_4;
      }

      input = (0, _parse_["default"])(arg_1, {
        defaultCountry: arg_2,
        extended: true
      }, metadata);
    } // Just an international phone number is supplied
    // `format('+78005553535', 'NATIONAL', [options], metadata)`.
    else {
        if (typeof arg_2 !== 'string') {
          throw new Error('`format` argument not passed to `formatNumber(number, format)`');
        }

        format = arg_2;

        if (arg_4) {
          options = arg_3;
          metadata = arg_4;
        } else {
          metadata = arg_3;
        }

        input = (0, _parse_["default"])(arg_1, {
          extended: true
        }, metadata);
      }
  } // If the phone number is passed as a parsed number object.
  // `format({ phone: '8005553535', country: 'RU' }, 'NATIONAL', [options], metadata)`.
  else if (is_object(arg_1)) {
      input = arg_1;
      format = arg_2;

      if (arg_4) {
        options = arg_3;
        metadata = arg_4;
      } else {
        metadata = arg_3;
      }
    } else throw new TypeError('A phone number must either be a string or an object of shape { phone, [country] }.'); // Legacy lowercase formats.


  if (format === 'International') {
    format = 'INTERNATIONAL';
  } else if (format === 'National') {
    format = 'NATIONAL';
  }

  return {
    input: input,
    format: format,
    options: options,
    metadata: metadata
  };
} // Babel transforms `typeof` into some "branches"
// so istanbul will show this as "branch not covered".

/* istanbul ignore next */


var is_object = function is_object(_) {
  return _typeof(_) === 'object';
};

},{"./format_":28,"./parse_":62}],27:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = formatIncompletePhoneNumber;

var _AsYouType = _interopRequireDefault(require("./AsYouType"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Formats a (possibly incomplete) phone number.
 * The phone number can be either in E.164 format
 * or in a form of national number digits.
 * @param {string} value - A possibly incomplete phone number. Either in E.164 format or in a form of national number digits.
 * @param {string?} country - Two-letter ("ISO 3166-1 alpha-2") country code.
 * @return {string} Formatted (possibly incomplete) phone number.
 */
function formatIncompletePhoneNumber(value, country, metadata) {
  if (!metadata) {
    metadata = country;
    country = undefined;
  }

  return new _AsYouType["default"](country, metadata).input(value);
}

},{"./AsYouType":3}],28:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = formatNumber;

var _matchesEntirely = _interopRequireDefault(require("./helpers/matchesEntirely"));

var _formatNationalNumberUsingFormat = _interopRequireDefault(require("./helpers/formatNationalNumberUsingFormat"));

var _metadata = _interopRequireWildcard(require("./metadata"));

var _getIddPrefix = _interopRequireDefault(require("./helpers/getIddPrefix"));

var _RFC = require("./helpers/RFC3966");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DEFAULT_OPTIONS = {
  formatExtension: function formatExtension(formattedNumber, extension, metadata) {
    return "".concat(formattedNumber).concat(metadata.ext()).concat(extension);
  } // Formats a phone number
  //
  // Example use cases:
  //
  // ```js
  // formatNumber('8005553535', 'RU', 'INTERNATIONAL')
  // formatNumber('8005553535', 'RU', 'INTERNATIONAL', metadata)
  // formatNumber({ phone: '8005553535', country: 'RU' }, 'INTERNATIONAL')
  // formatNumber({ phone: '8005553535', country: 'RU' }, 'INTERNATIONAL', metadata)
  // formatNumber('+78005553535', 'NATIONAL')
  // formatNumber('+78005553535', 'NATIONAL', metadata)
  // ```
  //

};

function formatNumber(input, format, options, metadata) {
  // Apply default options.
  if (options) {
    options = _objectSpread({}, DEFAULT_OPTIONS, options);
  } else {
    options = DEFAULT_OPTIONS;
  }

  metadata = new _metadata["default"](metadata);

  if (input.country && input.country !== '001') {
    // Validate `input.country`.
    if (!metadata.hasCountry(input.country)) {
      throw new Error("Unknown country: ".concat(input.country));
    }

    metadata.country(input.country);
  } else if (input.countryCallingCode) {
    metadata.selectNumberingPlan(input.countryCallingCode);
  } else return input.phone || '';

  var countryCallingCode = metadata.countryCallingCode();
  var nationalNumber = options.v2 ? input.nationalNumber : input.phone; // This variable should have been declared inside `case`s
  // but Babel has a bug and it says "duplicate variable declaration".

  var number;

  switch (format) {
    case 'NATIONAL':
      // Legacy argument support.
      // (`{ country: ..., phone: '' }`)
      if (!nationalNumber) {
        return '';
      }

      number = formatNationalNumber(nationalNumber, input.carrierCode, 'NATIONAL', metadata, options);
      return addExtension(number, input.ext, metadata, options.formatExtension);

    case 'INTERNATIONAL':
      // Legacy argument support.
      // (`{ country: ..., phone: '' }`)
      if (!nationalNumber) {
        return "+".concat(countryCallingCode);
      }

      number = formatNationalNumber(nationalNumber, null, 'INTERNATIONAL', metadata, options);
      number = "+".concat(countryCallingCode, " ").concat(number);
      return addExtension(number, input.ext, metadata, options.formatExtension);

    case 'E.164':
      // `E.164` doesn't define "phone number extensions".
      return "+".concat(countryCallingCode).concat(nationalNumber);

    case 'RFC3966':
      return (0, _RFC.formatRFC3966)({
        number: "+".concat(countryCallingCode).concat(nationalNumber),
        ext: input.ext
      });
    // For reference, here's Google's IDD formatter:
    // https://github.com/google/libphonenumber/blob/32719cf74e68796788d1ca45abc85dcdc63ba5b9/java/libphonenumber/src/com/google/i18n/phonenumbers/PhoneNumberUtil.java#L1546
    // Not saying that this IDD formatter replicates it 1:1, but it seems to work.
    // Who would even need to format phone numbers in IDD format anyway?

    case 'IDD':
      if (!options.fromCountry) {
        return; // throw new Error('`fromCountry` option not passed for IDD-prefixed formatting.')
      }

      var formattedNumber = formatIDD(nationalNumber, input.carrierCode, countryCallingCode, options.fromCountry, metadata);
      return addExtension(formattedNumber, input.ext, metadata, options.formatExtension);

    default:
      throw new Error("Unknown \"format\" argument passed to \"formatNumber()\": \"".concat(format, "\""));
  }
}

function formatNationalNumber(number, carrierCode, formatAs, metadata, options) {
  var format = chooseFormatForNumber(metadata.formats(), number);

  if (!format) {
    return number;
  }

  return (0, _formatNationalNumberUsingFormat["default"])(number, format, {
    useInternationalFormat: formatAs === 'INTERNATIONAL',
    withNationalPrefix: format.nationalPrefixIsOptionalWhenFormattingInNationalFormat() && options && options.nationalPrefix === false ? false : true,
    carrierCode: carrierCode,
    metadata: metadata
  });
}

function chooseFormatForNumber(availableFormats, nationalNnumber) {
  for (var _iterator = availableFormats, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var format = _ref;

    // Validate leading digits
    if (format.leadingDigitsPatterns().length > 0) {
      // The last leading_digits_pattern is used here, as it is the most detailed
      var lastLeadingDigitsPattern = format.leadingDigitsPatterns()[format.leadingDigitsPatterns().length - 1]; // If leading digits don't match then move on to the next phone number format

      if (nationalNnumber.search(lastLeadingDigitsPattern) !== 0) {
        continue;
      }
    } // Check that the national number matches the phone number format regular expression


    if ((0, _matchesEntirely["default"])(nationalNnumber, format.pattern())) {
      return format;
    }
  }
}

function addExtension(formattedNumber, ext, metadata, formatExtension) {
  return ext ? formatExtension(formattedNumber, ext, metadata) : formattedNumber;
}

function formatIDD(nationalNumber, carrierCode, countryCallingCode, fromCountry, metadata) {
  var fromCountryCallingCode = (0, _metadata.getCountryCallingCode)(fromCountry, metadata.metadata); // When calling within the same country calling code.

  if (fromCountryCallingCode === countryCallingCode) {
    var formattedNumber = formatNationalNumber(nationalNumber, carrierCode, 'NATIONAL', metadata); // For NANPA regions, return the national format for these regions
    // but prefix it with the country calling code.

    if (countryCallingCode === '1') {
      return countryCallingCode + ' ' + formattedNumber;
    } // If regions share a country calling code, the country calling code need
    // not be dialled. This also applies when dialling within a region, so this
    // if clause covers both these cases. Technically this is the case for
    // dialling from La Reunion to other overseas departments of France (French
    // Guiana, Martinique, Guadeloupe), but not vice versa - so we don't cover
    // this edge case for now and for those cases return the version including
    // country calling code. Details here:
    // http://www.petitfute.com/voyage/225-info-pratiques-reunion
    //


    return formattedNumber;
  }

  var iddPrefix = (0, _getIddPrefix["default"])(fromCountry, undefined, metadata.metadata);

  if (iddPrefix) {
    return "".concat(iddPrefix, " ").concat(countryCallingCode, " ").concat(formatNationalNumber(nationalNumber, null, 'INTERNATIONAL', metadata));
  }
}

},{"./helpers/RFC3966":33,"./helpers/formatNationalNumberUsingFormat":42,"./helpers/getIddPrefix":44,"./helpers/matchesEntirely":47,"./metadata":55}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getCountries;

var _metadata = _interopRequireDefault(require("./metadata"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getCountries(metadata) {
  return new _metadata["default"](metadata).getCountries();
}

},{"./metadata":55}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function get() {
    return _metadata.getCountryCallingCode;
  }
});

var _metadata = require("./metadata");

},{"./metadata":55}],31:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getExampleNumber;

var _PhoneNumber = _interopRequireDefault(require("./PhoneNumber"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function getExampleNumber(country, examples, metadata) {
  if (examples[country]) {
    return new _PhoneNumber["default"](country, examples[country], metadata);
  }
}

},{"./PhoneNumber":10}],32:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getNumberType;
exports.normalizeArguments = normalizeArguments;

var _isViablePhoneNumber = _interopRequireDefault(require("./helpers/isViablePhoneNumber"));

var _getNumberType2 = _interopRequireDefault(require("./helpers/getNumberType"));

var _parse_ = _interopRequireDefault(require("./parse_"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Finds out national phone number type (fixed line, mobile, etc)
function getNumberType() {
  var _normalizeArguments = normalizeArguments(arguments),
      input = _normalizeArguments.input,
      options = _normalizeArguments.options,
      metadata = _normalizeArguments.metadata;

  return (0, _getNumberType2["default"])(input, options, metadata);
} // Sort out arguments


function normalizeArguments(args) {
  var _Array$prototype$slic = Array.prototype.slice.call(args),
      _Array$prototype$slic2 = _slicedToArray(_Array$prototype$slic, 4),
      arg_1 = _Array$prototype$slic2[0],
      arg_2 = _Array$prototype$slic2[1],
      arg_3 = _Array$prototype$slic2[2],
      arg_4 = _Array$prototype$slic2[3];

  var input;
  var options = {};
  var metadata; // If the phone number is passed as a string.
  // `getNumberType('88005553535', ...)`.

  if (typeof arg_1 === 'string') {
    // If "default country" argument is being passed
    // then convert it to an `options` object.
    // `getNumberType('88005553535', 'RU', metadata)`.
    if (_typeof(arg_2) !== 'object') {
      if (arg_4) {
        options = arg_3;
        metadata = arg_4;
      } else {
        metadata = arg_3;
      } // `parse` extracts phone numbers from raw text,
      // therefore it will cut off all "garbage" characters,
      // while this `validate` function needs to verify
      // that the phone number contains no "garbage"
      // therefore the explicit `isViablePhoneNumber` check.


      if ((0, _isViablePhoneNumber["default"])(arg_1)) {
        input = (0, _parse_["default"])(arg_1, {
          defaultCountry: arg_2
        }, metadata);
      } else {
        input = {};
      }
    } // No "resrict country" argument is being passed.
    // International phone number is passed.
    // `getNumberType('+78005553535', metadata)`.
    else {
        if (arg_3) {
          options = arg_2;
          metadata = arg_3;
        } else {
          metadata = arg_2;
        } // `parse` extracts phone numbers from raw text,
        // therefore it will cut off all "garbage" characters,
        // while this `validate` function needs to verify
        // that the phone number contains no "garbage"
        // therefore the explicit `isViablePhoneNumber` check.


        if ((0, _isViablePhoneNumber["default"])(arg_1)) {
          input = (0, _parse_["default"])(arg_1, undefined, metadata);
        } else {
          input = {};
        }
      }
  } // If the phone number is passed as a parsed phone number.
  // `getNumberType({ phone: '88005553535', country: 'RU' }, ...)`.
  else if (is_object(arg_1)) {
      input = arg_1;

      if (arg_3) {
        options = arg_2;
        metadata = arg_3;
      } else {
        metadata = arg_2;
      }
    } else throw new TypeError('A phone number must either be a string or an object of shape { phone, [country] }.');

  return {
    input: input,
    options: options,
    metadata: metadata
  };
} // Babel transforms `typeof` into some "branches"
// so istanbul will show this as "branch not covered".

/* istanbul ignore next */


var is_object = function is_object(_) {
  return _typeof(_) === 'object';
};

},{"./helpers/getNumberType":45,"./helpers/isViablePhoneNumber":46,"./parse_":62}],33:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseRFC3966 = parseRFC3966;
exports.formatRFC3966 = formatRFC3966;

var _isViablePhoneNumber = _interopRequireDefault(require("./isViablePhoneNumber"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// https://www.ietf.org/rfc/rfc3966.txt

/**
 * @param  {string} text - Phone URI (RFC 3966).
 * @return {object} `{ ?number, ?ext }`.
 */
function parseRFC3966(text) {
  var number;
  var ext; // Replace "tel:" with "tel=" for parsing convenience.

  text = text.replace(/^tel:/, 'tel=');

  for (var _iterator = text.split(';'), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var part = _ref;

    var _part$split = part.split('='),
        _part$split2 = _slicedToArray(_part$split, 2),
        name = _part$split2[0],
        value = _part$split2[1];

    switch (name) {
      case 'tel':
        number = value;
        break;

      case 'ext':
        ext = value;
        break;

      case 'phone-context':
        // Only "country contexts" are supported.
        // "Domain contexts" are ignored.
        if (value[0] === '+') {
          number = value + number;
        }

        break;
    }
  } // If the phone number is not viable, then abort.


  if (!(0, _isViablePhoneNumber["default"])(number)) {
    return {};
  }

  var result = {
    number: number
  };

  if (ext) {
    result.ext = ext;
  }

  return result;
}
/**
 * @param  {object} - `{ ?number, ?extension }`.
 * @return {string} Phone URI (RFC 3966).
 */


function formatRFC3966(_ref2) {
  var number = _ref2.number,
      ext = _ref2.ext;

  if (!number) {
    return '';
  }

  if (number[0] !== '+') {
    throw new Error("\"formatRFC3966()\" expects \"number\" to be in E.164 format.");
  }

  return "tel:".concat(number).concat(ext ? ';ext=' + ext : '');
}

},{"./isViablePhoneNumber":46}],34:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = applyInternationalSeparatorStyle;

var _constants = require("../constants");

// Removes brackets and replaces dashes with spaces.
//
// E.g. "(999) 111-22-33" -> "999 111 22 33"
//
// For some reason Google's metadata contains `<intlFormat/>`s with brackets and dashes.
// Meanwhile, there's no single opinion about using punctuation in international phone numbers.
//
// For example, Google's `<intlFormat/>` for USA is `+1 213-373-4253`.
// And here's a quote from WikiPedia's "North American Numbering Plan" page:
// https://en.wikipedia.org/wiki/North_American_Numbering_Plan
//
// "The country calling code for all countries participating in the NANP is 1.
// In international format, an NANP number should be listed as +1 301 555 01 00,
// where 301 is an area code (Maryland)."
//
// I personally prefer the international format without any punctuation.
// For example, brackets are remnants of the old age, meaning that the
// phone number part in brackets (so called "area code") can be omitted
// if dialing within the same "area".
// And hyphens were clearly introduced for splitting local numbers into memorizable groups.
// For example, remembering "5553535" is difficult but "555-35-35" is much simpler.
// Imagine a man taking a bus from home to work and seeing an ad with a phone number.
// He has a couple of seconds to memorize that number until it passes by.
// If it were spaces instead of hyphens the man wouldn't necessarily get it,
// but with hyphens instead of spaces the grouping is more explicit.
// I personally think that hyphens introduce visual clutter,
// so I prefer replacing them with spaces in international numbers.
// In the modern age all output is done on displays where spaces are clearly distinguishable
// so hyphens can be safely replaced with spaces without losing any legibility.
//
function applyInternationalSeparatorStyle(formattedNumber) {
  return formattedNumber.replace(new RegExp("[".concat(_constants.VALID_PUNCTUATION, "]+"), 'g'), ' ').trim();
}

},{"../constants":12}],35:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = checkNumberLength;
exports.checkNumberLengthForType = checkNumberLengthForType;

var _mergeArrays = _interopRequireDefault(require("./mergeArrays"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function checkNumberLength(nationalNumber, metadata) {
  return checkNumberLengthForType(nationalNumber, undefined, metadata);
} // Checks whether a number is possible for the country based on its length.
// Should only be called for the "new" metadata which has "possible lengths".


function checkNumberLengthForType(nationalNumber, type, metadata) {
  var type_info = metadata.type(type); // There should always be "<possiblePengths/>" set for every type element.
  // This is declared in the XML schema.
  // For size efficiency, where a sub-description (e.g. fixed-line)
  // has the same "<possiblePengths/>" as the "general description", this is missing,
  // so we fall back to the "general description". Where no numbers of the type
  // exist at all, there is one possible length (-1) which is guaranteed
  // not to match the length of any real phone number.

  var possible_lengths = type_info && type_info.possibleLengths() || metadata.possibleLengths(); // let local_lengths    = type_info && type.possibleLengthsLocal() || metadata.possibleLengthsLocal()
  // Metadata before version `1.0.18` didn't contain `possible_lengths`.

  if (!possible_lengths) {
    return 'IS_POSSIBLE';
  }

  if (type === 'FIXED_LINE_OR_MOBILE') {
    // No such country in metadata.

    /* istanbul ignore next */
    if (!metadata.type('FIXED_LINE')) {
      // The rare case has been encountered where no fixedLine data is available
      // (true for some non-geographic entities), so we just check mobile.
      return checkNumberLengthForType(nationalNumber, 'MOBILE', metadata);
    }

    var mobile_type = metadata.type('MOBILE');

    if (mobile_type) {
      // Merge the mobile data in if there was any. "Concat" creates a new
      // array, it doesn't edit possible_lengths in place, so we don't need a copy.
      // Note that when adding the possible lengths from mobile, we have
      // to again check they aren't empty since if they are this indicates
      // they are the same as the general desc and should be obtained from there.
      possible_lengths = (0, _mergeArrays["default"])(possible_lengths, mobile_type.possibleLengths()); // The current list is sorted; we need to merge in the new list and
      // re-sort (duplicates are okay). Sorting isn't so expensive because
      // the lists are very small.
      // if (local_lengths) {
      // 	local_lengths = mergeArrays(local_lengths, mobile_type.possibleLengthsLocal())
      // } else {
      // 	local_lengths = mobile_type.possibleLengthsLocal()
      // }
    }
  } // If the type doesn't exist then return 'INVALID_LENGTH'.
  else if (type && !type_info) {
      return 'INVALID_LENGTH';
    }

  var actual_length = nationalNumber.length; // In `libphonenumber-js` all "local-only" formats are dropped for simplicity.
  // // This is safe because there is never an overlap beween the possible lengths
  // // and the local-only lengths; this is checked at build time.
  // if (local_lengths && local_lengths.indexOf(nationalNumber.length) >= 0)
  // {
  // 	return 'IS_POSSIBLE_LOCAL_ONLY'
  // }

  var minimum_length = possible_lengths[0];

  if (minimum_length === actual_length) {
    return 'IS_POSSIBLE';
  }

  if (minimum_length > actual_length) {
    return 'TOO_SHORT';
  }

  if (possible_lengths[possible_lengths.length - 1] < actual_length) {
    return 'TOO_LONG';
  } // We skip the first element since we've already checked it.


  return possible_lengths.indexOf(actual_length, 1) >= 0 ? 'IS_POSSIBLE' : 'INVALID_LENGTH';
}

},{"./mergeArrays":48}],36:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = createExtensionPattern;

var _constants = require("../../constants");

// The RFC 3966 format for extensions.
var RFC3966_EXTN_PREFIX = ';ext=';
/**
 * Helper method for constructing regular expressions for parsing. Creates
 * an expression that captures up to max_length digits.
 * @return {string} RegEx pattern to capture extension digits.
 */

var getExtensionDigitsPattern = function getExtensionDigitsPattern(maxLength) {
  return "([".concat(_constants.VALID_DIGITS, "]{1,").concat(maxLength, "})");
};
/**
 * Helper initialiser method to create the regular-expression pattern to match
 * extensions.
 * Copy-pasted from Google's `libphonenumber`:
 * https://github.com/google/libphonenumber/blob/55b2646ec9393f4d3d6661b9c82ef9e258e8b829/javascript/i18n/phonenumbers/phonenumberutil.js#L759-L766
 * @return {string} RegEx pattern to capture extensions.
 */


function createExtensionPattern(purpose) {
  // We cap the maximum length of an extension based on the ambiguity of the way
  // the extension is prefixed. As per ITU, the officially allowed length for
  // extensions is actually 40, but we don't support this since we haven't seen real
  // examples and this introduces many false interpretations as the extension labels
  // are not standardized.

  /** @type {string} */
  var extLimitAfterExplicitLabel = '20';
  /** @type {string} */

  var extLimitAfterLikelyLabel = '15';
  /** @type {string} */

  var extLimitAfterAmbiguousChar = '9';
  /** @type {string} */

  var extLimitWhenNotSure = '6';
  /** @type {string} */

  var possibleSeparatorsBetweenNumberAndExtLabel = "[ \xA0\\t,]*"; // Optional full stop (.) or colon, followed by zero or more spaces/tabs/commas.

  /** @type {string} */

  var possibleCharsAfterExtLabel = "[:\\.\uFF0E]?[ \xA0\\t,-]*";
  /** @type {string} */

  var optionalExtnSuffix = "#?"; // Here the extension is called out in more explicit way, i.e mentioning it obvious
  // patterns like "ext.".

  /** @type {string} */

  var explicitExtLabels = "(?:e?xt(?:ensi(?:o\u0301?|\xF3))?n?|\uFF45?\uFF58\uFF54\uFF4E?|\u0434\u043E\u0431|anexo)"; // One-character symbols that can be used to indicate an extension, and less
  // commonly used or more ambiguous extension labels.

  /** @type {string} */

  var ambiguousExtLabels = "(?:[x\uFF58#\uFF03~\uFF5E]|int|\uFF49\uFF4E\uFF54)"; // When extension is not separated clearly.

  /** @type {string} */

  var ambiguousSeparator = "[- ]+"; // This is the same as possibleSeparatorsBetweenNumberAndExtLabel, but not matching
  // comma as extension label may have it.

  /** @type {string} */

  var possibleSeparatorsNumberExtLabelNoComma = "[ \xA0\\t]*"; // ",," is commonly used for auto dialling the extension when connected. First
  // comma is matched through possibleSeparatorsBetweenNumberAndExtLabel, so we do
  // not repeat it here. Semi-colon works in Iphone and Android also to pop up a
  // button with the extension number following.

  /** @type {string} */

  var autoDiallingAndExtLabelsFound = "(?:,{2}|;)";
  /** @type {string} */

  var rfcExtn = RFC3966_EXTN_PREFIX + getExtensionDigitsPattern(extLimitAfterExplicitLabel);
  /** @type {string} */

  var explicitExtn = possibleSeparatorsBetweenNumberAndExtLabel + explicitExtLabels + possibleCharsAfterExtLabel + getExtensionDigitsPattern(extLimitAfterExplicitLabel) + optionalExtnSuffix;
  /** @type {string} */

  var ambiguousExtn = possibleSeparatorsBetweenNumberAndExtLabel + ambiguousExtLabels + possibleCharsAfterExtLabel + getExtensionDigitsPattern(extLimitAfterAmbiguousChar) + optionalExtnSuffix;
  /** @type {string} */

  var americanStyleExtnWithSuffix = ambiguousSeparator + getExtensionDigitsPattern(extLimitWhenNotSure) + "#";
  /** @type {string} */

  var autoDiallingExtn = possibleSeparatorsNumberExtLabelNoComma + autoDiallingAndExtLabelsFound + possibleCharsAfterExtLabel + getExtensionDigitsPattern(extLimitAfterLikelyLabel) + optionalExtnSuffix;
  /** @type {string} */

  var onlyCommasExtn = possibleSeparatorsNumberExtLabelNoComma + "(?:,)+" + possibleCharsAfterExtLabel + getExtensionDigitsPattern(extLimitAfterAmbiguousChar) + optionalExtnSuffix; // The first regular expression covers RFC 3966 format, where the extension is added
  // using ";ext=". The second more generic where extension is mentioned with explicit
  // labels like "ext:". In both the above cases we allow more numbers in extension than
  // any other extension labels. The third one captures when single character extension
  // labels or less commonly used labels are used. In such cases we capture fewer
  // extension digits in order to reduce the chance of falsely interpreting two
  // numbers beside each other as a number + extension. The fourth one covers the
  // special case of American numbers where the extension is written with a hash
  // at the end, such as "- 503#". The fifth one is exclusively for extension
  // autodialling formats which are used when dialling and in this case we accept longer
  // extensions. The last one is more liberal on the number of commas that acts as
  // extension labels, so we have a strict cap on the number of digits in such extensions.

  return rfcExtn + "|" + explicitExtn + "|" + ambiguousExtn + "|" + americanStyleExtnWithSuffix + "|" + autoDiallingExtn + "|" + onlyCommasExtn;
}

},{"../../constants":12}],37:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = extractExtension;

var _createExtensionPattern = _interopRequireDefault(require("./createExtensionPattern"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Regexp of all known extension prefixes used by different regions followed by
// 1 or more valid digits, for use when parsing.
var EXTN_PATTERN = new RegExp('(?:' + (0, _createExtensionPattern["default"])() + ')$', 'i'); // Strips any extension (as in, the part of the number dialled after the call is
// connected, usually indicated with extn, ext, x or similar) from the end of
// the number, and returns it.

function extractExtension(number) {
  var start = number.search(EXTN_PATTERN);

  if (start < 0) {
    return {};
  } // If we find a potential extension, and the number preceding this is a viable
  // number, we assume it is an extension.


  var numberWithoutExtension = number.slice(0, start);
  var matches = number.match(EXTN_PATTERN);
  var i = 1;

  while (i < matches.length) {
    if (matches[i]) {
      return {
        number: numberWithoutExtension,
        ext: matches[i]
      };
    }

    i++;
  }
}

},{"./createExtensionPattern":36}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = extractCountryCallingCode;

var _stripIddPrefix = _interopRequireDefault(require("./stripIddPrefix"));

var _extractCountryCallingCodeFromInternationalNumberWithoutPlusSign = _interopRequireDefault(require("./extractCountryCallingCodeFromInternationalNumberWithoutPlusSign"));

var _metadata = _interopRequireDefault(require("../metadata"));

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Converts a phone number digits (possibly with a `+`)
 * into a calling code and the rest phone number digits.
 * The "rest phone number digits" could include
 * a national prefix, carrier code, and national
 * (significant) number.
 * @param  {string} number — Phone number digits (possibly with a `+`).
 * @param  {string} [country] — Default country.
 * @param  {string} [callingCode] — Default calling code (some phone numbering plans are non-geographic).
 * @param  {object} metadata
 * @return {object} `{ countryCallingCode: string?, number: string }`
 * @example
 * // Returns `{ countryCallingCode: "1", number: "2133734253" }`.
 * extractCountryCallingCode('2133734253', 'US', null, metadata)
 * extractCountryCallingCode('2133734253', null, '1', metadata)
 * extractCountryCallingCode('+12133734253', null, null, metadata)
 * extractCountryCallingCode('+12133734253', 'RU', null, metadata)
 */
function extractCountryCallingCode(number, country, callingCode, metadata) {
  if (!number) {
    return {};
  } // If this is not an international phone number,
  // then either extract an "IDD" prefix, or extract a
  // country calling code from a number by autocorrecting it
  // by prepending a leading `+` in cases when it starts
  // with the country calling code.
  // https://wikitravel.org/en/International_dialling_prefix
  // https://github.com/catamphetamine/libphonenumber-js/issues/376


  if (number[0] !== '+') {
    // Convert an "out-of-country" dialing phone number
    // to a proper international phone number.
    var numberWithoutIDD = (0, _stripIddPrefix["default"])(number, country, callingCode, metadata); // If an IDD prefix was stripped then
    // convert the number to international one
    // for subsequent parsing.

    if (numberWithoutIDD && numberWithoutIDD !== number) {
      number = '+' + numberWithoutIDD;
    } else {
      // Check to see if the number starts with the country calling code
      // for the default country. If so, we remove the country calling code,
      // and do some checks on the validity of the number before and after.
      // https://github.com/catamphetamine/libphonenumber-js/issues/376
      if (country || callingCode) {
        var _extractCountryCallin = (0, _extractCountryCallingCodeFromInternationalNumberWithoutPlusSign["default"])(number, country, callingCode, metadata),
            countryCallingCode = _extractCountryCallin.countryCallingCode,
            shorterNumber = _extractCountryCallin.number;

        if (countryCallingCode) {
          return {
            countryCallingCode: countryCallingCode,
            number: shorterNumber
          };
        }
      }

      return {
        number: number
      };
    }
  } // Fast abortion: country codes do not begin with a '0'


  if (number[1] === '0') {
    return {};
  }

  metadata = new _metadata["default"](metadata); // The thing with country phone codes
  // is that they are orthogonal to each other
  // i.e. there's no such country phone code A
  // for which country phone code B exists
  // where B starts with A.
  // Therefore, while scanning digits,
  // if a valid country code is found,
  // that means that it is the country code.
  //

  var i = 2;

  while (i - 1 <= _constants.MAX_LENGTH_COUNTRY_CODE && i <= number.length) {
    var _countryCallingCode = number.slice(1, i);

    if (metadata.hasCallingCode(_countryCallingCode)) {
      metadata.selectNumberingPlan(_countryCallingCode);
      return {
        countryCallingCode: _countryCallingCode,
        number: number.slice(i)
      };
    }

    i++;
  }

  return {};
}

},{"../constants":12,"../metadata":55,"./extractCountryCallingCodeFromInternationalNumberWithoutPlusSign":39,"./stripIddPrefix":50}],39:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = extractCountryCallingCodeFromInternationalNumberWithoutPlusSign;

var _metadata = _interopRequireDefault(require("../metadata"));

var _matchesEntirely = _interopRequireDefault(require("./matchesEntirely"));

var _extractNationalNumber = _interopRequireDefault(require("./extractNationalNumber"));

var _checkNumberLength = _interopRequireDefault(require("./checkNumberLength"));

var _getCountryCallingCode = _interopRequireDefault(require("../getCountryCallingCode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Sometimes some people incorrectly input international phone numbers
 * without the leading `+`. This function corrects such input.
 * @param  {string} number — Phone number digits.
 * @param  {string?} country
 * @param  {string?} callingCode
 * @param  {object} metadata
 * @return {object} `{ countryCallingCode: string?, number: string }`.
 */
function extractCountryCallingCodeFromInternationalNumberWithoutPlusSign(number, country, callingCode, metadata) {
  var countryCallingCode = country ? (0, _getCountryCallingCode["default"])(country, metadata) : callingCode;

  if (number.indexOf(countryCallingCode) === 0) {
    metadata = new _metadata["default"](metadata);
    metadata.selectNumberingPlan(country, callingCode);
    var possibleShorterNumber = number.slice(countryCallingCode.length);

    var _extractNationalNumbe = (0, _extractNationalNumber["default"])(possibleShorterNumber, metadata),
        possibleShorterNationalNumber = _extractNationalNumbe.nationalNumber;

    var _extractNationalNumbe2 = (0, _extractNationalNumber["default"])(number, metadata),
        nationalNumber = _extractNationalNumbe2.nationalNumber; // If the number was not valid before but is valid now,
    // or if it was too long before, we consider the number
    // with the country calling code stripped to be a better result
    // and keep that instead.
    // For example, in Germany (+49), `49` is a valid area code,
    // so if a number starts with `49`, it could be both a valid
    // national German number or an international number without
    // a leading `+`.


    if (!(0, _matchesEntirely["default"])(nationalNumber, metadata.nationalNumberPattern()) && (0, _matchesEntirely["default"])(possibleShorterNationalNumber, metadata.nationalNumberPattern()) || (0, _checkNumberLength["default"])(nationalNumber, metadata) === 'TOO_LONG') {
      return {
        countryCallingCode: countryCallingCode,
        number: possibleShorterNumber
      };
    }
  }

  return {
    number: number
  };
}

},{"../getCountryCallingCode":30,"../metadata":55,"./checkNumberLength":35,"./extractNationalNumber":40,"./matchesEntirely":47}],40:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = extractNationalNumber;

var _extractNationalNumberFromPossiblyIncompleteNumber = _interopRequireDefault(require("./extractNationalNumberFromPossiblyIncompleteNumber"));

var _matchesEntirely = _interopRequireDefault(require("./matchesEntirely"));

var _checkNumberLength = _interopRequireDefault(require("./checkNumberLength"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Strips national prefix and carrier code from a complete phone number.
 * The difference from the non-"FromCompleteNumber" function is that
 * it won't extract national prefix if the resultant number is too short
 * to be a complete number for the selected phone numbering plan.
 * @param  {string} number — Complete phone number digits.
 * @param  {Metadata} metadata — Metadata with a phone numbering plan selected.
 * @return {object} `{ nationalNumber: string, carrierCode: string? }`.
 */
function extractNationalNumber(number, metadata) {
  // Parsing national prefixes and carrier codes
  // is only required for local phone numbers
  // but some people don't understand that
  // and sometimes write international phone numbers
  // with national prefixes (or maybe even carrier codes).
  // http://ucken.blogspot.ru/2016/03/trunk-prefixes-in-skype4b.html
  // Google's original library forgives such mistakes
  // and so does this library, because it has been requested:
  // https://github.com/catamphetamine/libphonenumber-js/issues/127
  var _extractNationalNumbe = (0, _extractNationalNumberFromPossiblyIncompleteNumber["default"])(number, metadata),
      nationalNumber = _extractNationalNumbe.nationalNumber,
      carrierCode = _extractNationalNumbe.carrierCode;

  if (!shouldExtractNationalPrefix(number, nationalNumber, metadata)) {
    // Don't strip the national prefix.
    return {
      nationalNumber: number
    };
  } // If a national prefix has been extracted, check to see
  // if the resultant number isn't too short.
  // Same code in Google's `libphonenumber`:
  // https://github.com/google/libphonenumber/blob/e326fa1fc4283bb05eb35cb3c15c18f98a31af33/java/libphonenumber/src/com/google/i18n/phonenumbers/PhoneNumberUtil.java#L3291-L3302
  // For some reason, they do this check right after the `national_number_pattern` check
  // this library does in `shouldExtractNationalPrefix()` function.
  // Why is there a second "resultant" number validity check?
  // They don't provide an explanation.
  // This library just copies the behavior.


  if (number.length !== nationalNumber.length + (carrierCode ? carrierCode.length : 0)) {
    // If not using legacy generated metadata (before version `1.0.18`)
    // then it has "possible lengths", so use those to validate the number length.
    if (metadata.possibleLengths()) {
      // "We require that the NSN remaining after stripping the national prefix and
      // carrier code be long enough to be a possible length for the region.
      // Otherwise, we don't do the stripping, since the original number could be
      // a valid short number."
      // https://github.com/google/libphonenumber/blob/876268eb1ad6cdc1b7b5bef17fc5e43052702d57/java/libphonenumber/src/com/google/i18n/phonenumbers/PhoneNumberUtil.java#L3236-L3250
      switch ((0, _checkNumberLength["default"])(nationalNumber, metadata)) {
        case 'TOO_SHORT':
        case 'INVALID_LENGTH':
          // case 'IS_POSSIBLE_LOCAL_ONLY':
          // Don't strip the national prefix.
          return {
            nationalNumber: number
          };
      }
    }
  }

  return {
    nationalNumber: nationalNumber,
    carrierCode: carrierCode
  };
} // In some countries, the same digit could be a national prefix
// or a leading digit of a valid phone number.
// For example, in Russia, national prefix is `8`,
// and also `800 555 35 35` is a valid number
// in which `8` is not a national prefix, but the first digit
// of a national (significant) number.
// Same's with Belarus:
// `82004910060` is a valid national (significant) number,
// but `2004910060` is not.
// To support such cases (to prevent the code from always stripping
// national prefix), a condition is imposed: a national prefix
// is not extracted when the original number is "viable" and the
// resultant number is not, a "viable" national number being the one
// that matches `national_number_pattern`.


function shouldExtractNationalPrefix(number, nationalSignificantNumber, metadata) {
  // The equivalent in Google's code is:
  // https://github.com/google/libphonenumber/blob/e326fa1fc4283bb05eb35cb3c15c18f98a31af33/java/libphonenumber/src/com/google/i18n/phonenumbers/PhoneNumberUtil.java#L2969-L3004
  if ((0, _matchesEntirely["default"])(number, metadata.nationalNumberPattern()) && !(0, _matchesEntirely["default"])(nationalSignificantNumber, metadata.nationalNumberPattern())) {
    return false;
  } // Just "possible" number check would be more relaxed, so it's not used.
  // if (isPossibleNumber(number, metadata) &&
  // 	!isPossibleNumber(numberWithNationalPrefixExtracted, metadata)) {
  // 	return false
  // }


  return true;
}

},{"./checkNumberLength":35,"./extractNationalNumberFromPossiblyIncompleteNumber":41,"./matchesEntirely":47}],41:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = extractNationalNumberFromPossiblyIncompleteNumber;

/**
 * Strips any national prefix (such as 0, 1) present in a
 * (possibly incomplete) number provided.
 * "Carrier codes" are only used  in Colombia and Brazil,
 * and only when dialing within those countries from a mobile phone to a fixed line number.
 * Sometimes it won't actually strip national prefix
 * and will instead prepend some digits to the `number`:
 * for example, when number `2345678` is passed with `VI` country selected,
 * it will return `{ number: "3402345678" }`, because `340` area code is prepended.
 * @param {string} number — National number digits.
 * @param {object} metadata — Metadata with country selected.
 * @return {object} `{ nationalNumber: string, nationalPrefix: string? carrierCode: string? }`.
 */
function extractNationalNumberFromPossiblyIncompleteNumber(number, metadata) {
  if (number && metadata.numberingPlan.nationalPrefixForParsing()) {
    // See METADATA.md for the description of
    // `national_prefix_for_parsing` and `national_prefix_transform_rule`.
    // Attempt to parse the first digits as a national prefix.
    var prefixPattern = new RegExp('^(?:' + metadata.numberingPlan.nationalPrefixForParsing() + ')');
    var prefixMatch = prefixPattern.exec(number);

    if (prefixMatch) {
      var nationalNumber;
      var carrierCode; // https://gitlab.com/catamphetamine/libphonenumber-js/-/blob/master/METADATA.md#national_prefix_for_parsing--national_prefix_transform_rule
      // If a `national_prefix_for_parsing` has any "capturing groups"
      // then it means that the national (significant) number is equal to
      // those "capturing groups" transformed via `national_prefix_transform_rule`,
      // and nothing could be said about the actual national prefix:
      // what is it and was it even there.
      // If a `national_prefix_for_parsing` doesn't have any "capturing groups",
      // then everything it matches is a national prefix.
      // To determine whether `national_prefix_for_parsing` matched any
      // "capturing groups", the value of the result of calling `.exec()`
      // is looked at, and if it has non-undefined values where there're
      // "capturing groups" in the regular expression, then it means
      // that "capturing groups" have been matched.
      // It's not possible to tell whether there'll be any "capturing gropus"
      // before the matching process, because a `national_prefix_for_parsing`
      // could exhibit both behaviors.

      var capturedGroupsCount = prefixMatch.length - 1;
      var hasCapturedGroups = capturedGroupsCount > 0 && prefixMatch[capturedGroupsCount];

      if (metadata.nationalPrefixTransformRule() && hasCapturedGroups) {
        nationalNumber = number.replace(prefixPattern, metadata.nationalPrefixTransformRule()); // If there's more than one captured group,
        // then carrier code is the second one.

        if (capturedGroupsCount > 1) {
          carrierCode = prefixMatch[1];
        }
      } // If there're no "capturing groups",
      // or if there're "capturing groups" but no
      // `national_prefix_transform_rule`,
      // then just strip the national prefix from the number,
      // and possibly a carrier code.
      // Seems like there could be more.
      else {
          // `prefixBeforeNationalNumber` is the whole substring matched by
          // the `national_prefix_for_parsing` regular expression.
          // There seem to be no guarantees that it's just a national prefix.
          // For example, if there's a carrier code, it's gonna be a
          // part of `prefixBeforeNationalNumber` too.
          var prefixBeforeNationalNumber = prefixMatch[0];
          nationalNumber = number.slice(prefixBeforeNationalNumber.length); // If there's at least one captured group,
          // then carrier code is the first one.

          if (hasCapturedGroups) {
            carrierCode = prefixMatch[1];
          }
        } // Tries to guess whether a national prefix was present in the input.
      // This is not something copy-pasted from Google's library:
      // they don't seem to have an equivalent for that.
      // So this isn't an "officially approved" way of doing something like that.
      // But since there seems no other existing method, this library uses it.


      var nationalPrefix;

      if (hasCapturedGroups) {
        var possiblePositionOfTheFirstCapturedGroup = number.indexOf(prefixMatch[1]);
        var possibleNationalPrefix = number.slice(0, possiblePositionOfTheFirstCapturedGroup); // Example: an Argentinian (AR) phone number `0111523456789`.
        // `prefixMatch[0]` is `01115`, and `$1` is `11`,
        // and the rest of the phone number is `23456789`.
        // The national number is transformed via `9$1` to `91123456789`.
        // National prefix `0` is detected being present at the start.
        // if (possibleNationalPrefix.indexOf(metadata.numberingPlan.nationalPrefix()) === 0) {

        if (possibleNationalPrefix === metadata.numberingPlan.nationalPrefix()) {
          nationalPrefix = metadata.numberingPlan.nationalPrefix();
        }
      } else {
        nationalPrefix = prefixMatch[0];
      }

      return {
        nationalNumber: nationalNumber,
        nationalPrefix: nationalPrefix,
        carrierCode: carrierCode
      };
    }
  }

  return {
    nationalNumber: number
  };
}

},{}],42:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = formatNationalNumberUsingFormat;
exports.FIRST_GROUP_PATTERN = void 0;

var _applyInternationalSeparatorStyle = _interopRequireDefault(require("./applyInternationalSeparatorStyle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// This was originally set to $1 but there are some countries for which the
// first group is not used in the national pattern (e.g. Argentina) so the $1
// group does not match correctly. Therefore, we use `\d`, so that the first
// group actually used in the pattern will be matched.
var FIRST_GROUP_PATTERN = /(\$\d)/;
exports.FIRST_GROUP_PATTERN = FIRST_GROUP_PATTERN;

function formatNationalNumberUsingFormat(number, format, _ref) {
  var useInternationalFormat = _ref.useInternationalFormat,
      withNationalPrefix = _ref.withNationalPrefix,
      carrierCode = _ref.carrierCode,
      metadata = _ref.metadata;
  var formattedNumber = number.replace(new RegExp(format.pattern()), useInternationalFormat ? format.internationalFormat() : // This library doesn't use `domestic_carrier_code_formatting_rule`,
  // because that one is only used when formatting phone numbers
  // for dialing from a mobile phone, and this is not a dialing library.
  // carrierCode && format.domesticCarrierCodeFormattingRule()
  // 	// First, replace the $CC in the formatting rule with the desired carrier code.
  // 	// Then, replace the $FG in the formatting rule with the first group
  // 	// and the carrier code combined in the appropriate way.
  // 	? format.format().replace(FIRST_GROUP_PATTERN, format.domesticCarrierCodeFormattingRule().replace('$CC', carrierCode))
  // 	: (
  // 		withNationalPrefix && format.nationalPrefixFormattingRule()
  // 			? format.format().replace(FIRST_GROUP_PATTERN, format.nationalPrefixFormattingRule())
  // 			: format.format()
  // 	)
  withNationalPrefix && format.nationalPrefixFormattingRule() ? format.format().replace(FIRST_GROUP_PATTERN, format.nationalPrefixFormattingRule()) : format.format());

  if (useInternationalFormat) {
    return (0, _applyInternationalSeparatorStyle["default"])(formattedNumber);
  }

  return formattedNumber;
}

},{"./applyInternationalSeparatorStyle":34}],43:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getCountryByCallingCode;

var _metadata = _interopRequireDefault(require("../metadata"));

var _getNumberType = _interopRequireDefault(require("./getNumberType"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var USE_NON_GEOGRAPHIC_COUNTRY_CODE = false;

function getCountryByCallingCode(callingCode, nationalPhoneNumber, metadata) {
  /* istanbul ignore if */
  if (USE_NON_GEOGRAPHIC_COUNTRY_CODE) {
    if (metadata.isNonGeographicCallingCode(callingCode)) {
      return '001';
    }
  } // Is always non-empty, because `callingCode` is always valid


  var possibleCountries = metadata.getCountryCodesForCallingCode(callingCode);

  if (!possibleCountries) {
    return;
  } // If there's just one country corresponding to the country code,
  // then just return it, without further phone number digits validation.


  if (possibleCountries.length === 1) {
    return possibleCountries[0];
  }

  return selectCountryFromList(possibleCountries, nationalPhoneNumber, metadata.metadata);
}

function selectCountryFromList(possibleCountries, nationalPhoneNumber, metadata) {
  // Re-create `metadata` because it will be selecting a `country`.
  metadata = new _metadata["default"](metadata);

  for (var _iterator = possibleCountries, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var country = _ref;
    metadata.country(country); // Leading digits check would be the simplest one

    if (metadata.leadingDigits()) {
      if (nationalPhoneNumber && nationalPhoneNumber.search(metadata.leadingDigits()) === 0) {
        return country;
      }
    } // Else perform full validation with all of those
    // fixed-line/mobile/etc regular expressions.
    else if ((0, _getNumberType["default"])({
        phone: nationalPhoneNumber,
        country: country
      }, undefined, metadata.metadata)) {
        return country;
      }
  }
}

},{"../metadata":55,"./getNumberType":45}],44:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getIddPrefix;

var _metadata = _interopRequireDefault(require("../metadata"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Pattern that makes it easy to distinguish whether a region has a single
 * international dialing prefix or not. If a region has a single international
 * prefix (e.g. 011 in USA), it will be represented as a string that contains
 * a sequence of ASCII digits, and possibly a tilde, which signals waiting for
 * the tone. If there are multiple available international prefixes in a
 * region, they will be represented as a regex string that always contains one
 * or more characters that are not ASCII digits or a tilde.
 */
var SINGLE_IDD_PREFIX_REG_EXP = /^[\d]+(?:[~\u2053\u223C\uFF5E][\d]+)?$/; // For regions that have multiple IDD prefixes
// a preferred IDD prefix is returned.

function getIddPrefix(country, callingCode, metadata) {
  var countryMetadata = new _metadata["default"](metadata);
  countryMetadata.selectNumberingPlan(country, callingCode);

  if (SINGLE_IDD_PREFIX_REG_EXP.test(countryMetadata.IDDPrefix())) {
    return countryMetadata.IDDPrefix();
  }

  return countryMetadata.defaultIDDPrefix();
}

},{"../metadata":55}],45:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = getNumberType;
exports.isNumberTypeEqualTo = isNumberTypeEqualTo;

var _metadata = _interopRequireDefault(require("../metadata"));

var _matchesEntirely = _interopRequireDefault(require("./matchesEntirely"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var NON_FIXED_LINE_PHONE_TYPES = ['MOBILE', 'PREMIUM_RATE', 'TOLL_FREE', 'SHARED_COST', 'VOIP', 'PERSONAL_NUMBER', 'PAGER', 'UAN', 'VOICEMAIL']; // Finds out national phone number type (fixed line, mobile, etc)

function getNumberType(input, options, metadata) {
  // If assigning the `{}` default value is moved to the arguments above,
  // code coverage would decrease for some weird reason.
  options = options || {}; // When `parse()` returned `{}`
  // meaning that the phone number is not a valid one.

  if (!input.country) {
    return;
  }

  metadata = new _metadata["default"](metadata);
  metadata.selectNumberingPlan(input.country, input.countryCallingCode);
  var nationalNumber = options.v2 ? input.nationalNumber : input.phone; // The following is copy-pasted from the original function:
  // https://github.com/googlei18n/libphonenumber/blob/3ea547d4fbaa2d0b67588904dfa5d3f2557c27ff/javascript/i18n/phonenumbers/phonenumberutil.js#L2835
  // Is this national number even valid for this country

  if (!(0, _matchesEntirely["default"])(nationalNumber, metadata.nationalNumberPattern())) {
    return;
  } // Is it fixed line number


  if (isNumberTypeEqualTo(nationalNumber, 'FIXED_LINE', metadata)) {
    // Because duplicate regular expressions are removed
    // to reduce metadata size, if "mobile" pattern is ""
    // then it means it was removed due to being a duplicate of the fixed-line pattern.
    //
    if (metadata.type('MOBILE') && metadata.type('MOBILE').pattern() === '') {
      return 'FIXED_LINE_OR_MOBILE';
    } // v1 metadata.
    // Legacy.
    // Deprecated.


    if (!metadata.type('MOBILE')) {
      return 'FIXED_LINE_OR_MOBILE';
    } // Check if the number happens to qualify as both fixed line and mobile.
    // (no such country in the minimal metadata set)

    /* istanbul ignore if */


    if (isNumberTypeEqualTo(nationalNumber, 'MOBILE', metadata)) {
      return 'FIXED_LINE_OR_MOBILE';
    }

    return 'FIXED_LINE';
  }

  for (var _i = 0, _NON_FIXED_LINE_PHONE = NON_FIXED_LINE_PHONE_TYPES; _i < _NON_FIXED_LINE_PHONE.length; _i++) {
    var type = _NON_FIXED_LINE_PHONE[_i];

    if (isNumberTypeEqualTo(nationalNumber, type, metadata)) {
      return type;
    }
  }
}

function isNumberTypeEqualTo(nationalNumber, type, metadata) {
  type = metadata.type(type);

  if (!type || !type.pattern()) {
    return false;
  } // Check if any possible number lengths are present;
  // if so, we use them to avoid checking
  // the validation pattern if they don't match.
  // If they are absent, this means they match
  // the general description, which we have
  // already checked before a specific number type.


  if (type.possibleLengths() && type.possibleLengths().indexOf(nationalNumber.length) < 0) {
    return false;
  }

  return (0, _matchesEntirely["default"])(nationalNumber, type.pattern());
}

},{"../metadata":55,"./matchesEntirely":47}],46:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isViablePhoneNumber;
exports.VALID_PHONE_NUMBER_WITH_EXTENSION = exports.VALID_PHONE_NUMBER = void 0;

var _constants = require("../constants");

var _createExtensionPattern = _interopRequireDefault(require("./extension/createExtensionPattern"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//  Regular expression of viable phone numbers. This is location independent.
//  Checks we have at least three leading digits, and only valid punctuation,
//  alpha characters and digits in the phone number. Does not include extension
//  data. The symbol 'x' is allowed here as valid punctuation since it is often
//  used as a placeholder for carrier codes, for example in Brazilian phone
//  numbers. We also allow multiple '+' characters at the start.
//
//  Corresponds to the following:
//  [digits]{minLengthNsn}|
//  plus_sign*
//  (([punctuation]|[star])*[digits]){3,}([punctuation]|[star]|[digits]|[alpha])*
//
//  The first reg-ex is to allow short numbers (two digits long) to be parsed if
//  they are entered as "15" etc, but only if there is no punctuation in them.
//  The second expression restricts the number of digits to three or more, but
//  then allows them to be in international form, and to have alpha-characters
//  and punctuation. We split up the two reg-exes here and combine them when
//  creating the reg-ex VALID_PHONE_NUMBER_PATTERN itself so we can prefix it
//  with ^ and append $ to each branch.
//
//  "Note VALID_PUNCTUATION starts with a -,
//   so must be the first in the range" (c) Google devs.
//  (wtf did they mean by saying that; probably nothing)
//
var MIN_LENGTH_PHONE_NUMBER_PATTERN = '[' + _constants.VALID_DIGITS + ']{' + _constants.MIN_LENGTH_FOR_NSN + '}'; //
// And this is the second reg-exp:
// (see MIN_LENGTH_PHONE_NUMBER_PATTERN for a full description of this reg-exp)
//

var VALID_PHONE_NUMBER = '[' + _constants.PLUS_CHARS + ']{0,1}' + '(?:' + '[' + _constants.VALID_PUNCTUATION + ']*' + '[' + _constants.VALID_DIGITS + ']' + '){3,}' + '[' + _constants.VALID_PUNCTUATION + _constants.VALID_DIGITS + ']*';
exports.VALID_PHONE_NUMBER = VALID_PHONE_NUMBER;
var VALID_PHONE_NUMBER_WITH_EXTENSION = VALID_PHONE_NUMBER + // Phone number extensions
'(?:' + (0, _createExtensionPattern["default"])() + ')?'; // The combined regular expression for valid phone numbers:
//

exports.VALID_PHONE_NUMBER_WITH_EXTENSION = VALID_PHONE_NUMBER_WITH_EXTENSION;
var VALID_PHONE_NUMBER_PATTERN = new RegExp( // Either a short two-digit-only phone number
'^' + MIN_LENGTH_PHONE_NUMBER_PATTERN + '$' + '|' + // Or a longer fully parsed phone number (min 3 characters)
'^' + VALID_PHONE_NUMBER_WITH_EXTENSION + '$', 'i'); // Checks to see if the string of characters could possibly be a phone number at
// all. At the moment, checks to see that the string begins with at least 2
// digits, ignoring any punctuation commonly found in phone numbers. This method
// does not require the number to be normalized in advance - but does assume
// that leading non-number symbols have been removed, such as by the method
// `extract_possible_number`.
//

function isViablePhoneNumber(number) {
  return number.length >= _constants.MIN_LENGTH_FOR_NSN && VALID_PHONE_NUMBER_PATTERN.test(number);
}

},{"../constants":12,"./extension/createExtensionPattern":36}],47:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = matchesEntirely;

/**
 * Checks whether the entire input sequence can be matched
 * against the regular expression.
 * @return {boolean}
 */
function matchesEntirely(text, regular_expression) {
  // If assigning the `''` default value is moved to the arguments above,
  // code coverage would decrease for some weird reason.
  text = text || '';
  return new RegExp('^(?:' + regular_expression + ')$').test(text);
}

},{}],48:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = mergeArrays;

/**
 * Merges two arrays.
 * @param  {*} a
 * @param  {*} b
 * @return {*}
 */
function mergeArrays(a, b) {
  var merged = a.slice();

  for (var _iterator = b, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var element = _ref;

    if (a.indexOf(element) < 0) {
      merged.push(element);
    }
  }

  return merged.sort(function (a, b) {
    return a - b;
  }); // ES6 version, requires Set polyfill.
  // let merged = new Set(a)
  // for (const element of b) {
  // 	merged.add(i)
  // }
  // return Array.from(merged).sort((a, b) => a - b)
}

},{}],49:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseDigit = parseDigit;
exports["default"] = parseDigits;
exports.DIGITS = void 0;
// These mappings map a character (key) to a specific digit that should
// replace it for normalization purposes. Non-European digits that
// may be used in phone numbers are mapped to a European equivalent.
//
// E.g. in Iraq they don't write `+442323234` but rather `+٤٤٢٣٢٣٢٣٤`.
//
var DIGITS = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  "\uFF10": '0',
  // Fullwidth digit 0
  "\uFF11": '1',
  // Fullwidth digit 1
  "\uFF12": '2',
  // Fullwidth digit 2
  "\uFF13": '3',
  // Fullwidth digit 3
  "\uFF14": '4',
  // Fullwidth digit 4
  "\uFF15": '5',
  // Fullwidth digit 5
  "\uFF16": '6',
  // Fullwidth digit 6
  "\uFF17": '7',
  // Fullwidth digit 7
  "\uFF18": '8',
  // Fullwidth digit 8
  "\uFF19": '9',
  // Fullwidth digit 9
  "\u0660": '0',
  // Arabic-indic digit 0
  "\u0661": '1',
  // Arabic-indic digit 1
  "\u0662": '2',
  // Arabic-indic digit 2
  "\u0663": '3',
  // Arabic-indic digit 3
  "\u0664": '4',
  // Arabic-indic digit 4
  "\u0665": '5',
  // Arabic-indic digit 5
  "\u0666": '6',
  // Arabic-indic digit 6
  "\u0667": '7',
  // Arabic-indic digit 7
  "\u0668": '8',
  // Arabic-indic digit 8
  "\u0669": '9',
  // Arabic-indic digit 9
  "\u06F0": '0',
  // Eastern-Arabic digit 0
  "\u06F1": '1',
  // Eastern-Arabic digit 1
  "\u06F2": '2',
  // Eastern-Arabic digit 2
  "\u06F3": '3',
  // Eastern-Arabic digit 3
  "\u06F4": '4',
  // Eastern-Arabic digit 4
  "\u06F5": '5',
  // Eastern-Arabic digit 5
  "\u06F6": '6',
  // Eastern-Arabic digit 6
  "\u06F7": '7',
  // Eastern-Arabic digit 7
  "\u06F8": '8',
  // Eastern-Arabic digit 8
  "\u06F9": '9' // Eastern-Arabic digit 9

};
exports.DIGITS = DIGITS;

function parseDigit(character) {
  return DIGITS[character];
}
/**
 * Parses phone number digits from a string.
 * Drops all punctuation leaving only digits.
 * Also converts wide-ascii and arabic-indic numerals to conventional numerals.
 * E.g. in Iraq they don't write `+442323234` but rather `+٤٤٢٣٢٣٢٣٤`.
 * @param  {string} string
 * @return {string}
 * @example
 * ```js
 * parseDigits('8 (800) 555')
 * // Outputs '8800555'.
 * ```
 */


function parseDigits(string) {
  var result = ''; // Using `.split('')` here instead of normal `for ... of`
  // because the importing application doesn't neccessarily include an ES6 polyfill.
  // The `.split('')` approach discards "exotic" UTF-8 characters
  // (the ones consisting of four bytes) but digits
  // (including non-European ones) don't fall into that range
  // so such "exotic" characters would be discarded anyway.

  for (var _iterator = string.split(''), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var character = _ref;
    var digit = parseDigit(character);

    if (digit) {
      result += digit;
    }
  }

  return result;
}

},{}],50:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = stripIddPrefix;

var _metadata = _interopRequireDefault(require("../metadata"));

var _constants = require("../constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var CAPTURING_DIGIT_PATTERN = new RegExp('([' + _constants.VALID_DIGITS + '])');

function stripIddPrefix(number, country, callingCode, metadata) {
  if (!country) {
    return;
  } // Check if the number is IDD-prefixed.


  var countryMetadata = new _metadata["default"](metadata);
  countryMetadata.selectNumberingPlan(country, callingCode);
  var IDDPrefixPattern = new RegExp(countryMetadata.IDDPrefix());

  if (number.search(IDDPrefixPattern) !== 0) {
    return;
  } // Strip IDD prefix.


  number = number.slice(number.match(IDDPrefixPattern)[0].length); // If there're any digits after an IDD prefix,
  // then those digits are a country calling code.
  // Since no country code starts with a `0`,
  // the code below validates that the next digit (if present) is not `0`.

  var matchedGroups = number.match(CAPTURING_DIGIT_PATTERN);

  if (matchedGroups && matchedGroups[1] != null && matchedGroups[1].length > 0) {
    if (matchedGroups[1] === '0') {
      return;
    }
  }

  return number;
}

},{"../constants":12,"../metadata":55}],51:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isPossibleNumber;

var _getNumberType = require("./getNumberType");

var _isPossibleNumber_ = _interopRequireDefault(require("./isPossibleNumber_"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Checks if a given phone number is possible.
 * Which means it only checks phone number length
 * and doesn't test any regular expressions.
 *
 * Examples:
 *
 * ```js
 * isPossibleNumber('+78005553535', metadata)
 * isPossibleNumber('8005553535', 'RU', metadata)
 * isPossibleNumber('88005553535', 'RU', metadata)
 * isPossibleNumber({ phone: '8005553535', country: 'RU' }, metadata)
 * ```
 */
function isPossibleNumber() {
  var _normalizeArguments = (0, _getNumberType.normalizeArguments)(arguments),
      input = _normalizeArguments.input,
      options = _normalizeArguments.options,
      metadata = _normalizeArguments.metadata;

  return (0, _isPossibleNumber_["default"])(input, options, metadata);
}

},{"./getNumberType":32,"./isPossibleNumber_":52}],52:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isPossiblePhoneNumber;
exports.isPossibleNumber = isPossibleNumber;

var _metadata = _interopRequireDefault(require("./metadata"));

var _checkNumberLength = _interopRequireDefault(require("./helpers/checkNumberLength"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function isPossiblePhoneNumber(input, options, metadata) {
  /* istanbul ignore if */
  if (options === undefined) {
    options = {};
  }

  metadata = new _metadata["default"](metadata);

  if (options.v2) {
    if (!input.countryCallingCode) {
      throw new Error('Invalid phone number object passed');
    }

    metadata.selectNumberingPlan(input.countryCallingCode);
  } else {
    if (!input.phone) {
      return false;
    }

    if (input.country) {
      if (!metadata.hasCountry(input.country)) {
        throw new Error("Unknown country: ".concat(input.country));
      }

      metadata.country(input.country);
    } else {
      if (!input.countryCallingCode) {
        throw new Error('Invalid phone number object passed');
      }

      metadata.selectNumberingPlan(input.countryCallingCode);
    }
  }

  if (metadata.possibleLengths()) {
    return isPossibleNumber(input.phone || input.nationalNumber, metadata);
  } else {
    // There was a bug between `1.7.35` and `1.7.37` where "possible_lengths"
    // were missing for "non-geographical" numbering plans.
    // Just assume the number is possible in such cases:
    // it's unlikely that anyone generated their custom metadata
    // in that short period of time (one day).
    // This code can be removed in some future major version update.
    if (input.countryCallingCode && metadata.isNonGeographicCallingCode(input.countryCallingCode)) {
      // "Non-geographic entities" did't have `possibleLengths`
      // due to a bug in metadata generation process.
      return true;
    } else {
      throw new Error('Missing "possibleLengths" in metadata. Perhaps the metadata has been generated before v1.0.18.');
    }
  }
}

function isPossibleNumber(nationalNumber, metadata) {
  //, isInternational) {
  switch ((0, _checkNumberLength["default"])(nationalNumber, metadata)) {
    case 'IS_POSSIBLE':
      return true;
    // This library ignores "local-only" phone numbers (for simplicity).
    // See the readme for more info on what are "local-only" phone numbers.
    // case 'IS_POSSIBLE_LOCAL_ONLY':
    // 	return !isInternational

    default:
      return false;
  }
}

},{"./helpers/checkNumberLength":35,"./metadata":55}],53:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isValidNumberForRegion;

var _isViablePhoneNumber = _interopRequireDefault(require("./helpers/isViablePhoneNumber"));

var _parse_ = _interopRequireDefault(require("./parse_"));

var _isValidNumberForRegion_ = _interopRequireDefault(require("./isValidNumberForRegion_"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function isValidNumberForRegion(number, country, metadata) {
  if (typeof number !== 'string') {
    throw new TypeError('number must be a string');
  }

  if (typeof country !== 'string') {
    throw new TypeError('country must be a string');
  } // `parse` extracts phone numbers from raw text,
  // therefore it will cut off all "garbage" characters,
  // while this `validate` function needs to verify
  // that the phone number contains no "garbage"
  // therefore the explicit `isViablePhoneNumber` check.


  var input;

  if ((0, _isViablePhoneNumber["default"])(number)) {
    input = (0, _parse_["default"])(number, {
      defaultCountry: country
    }, metadata);
  } else {
    input = {};
  }

  return (0, _isValidNumberForRegion_["default"])(input, country, undefined, metadata);
}

},{"./helpers/isViablePhoneNumber":46,"./isValidNumberForRegion_":54,"./parse_":62}],54:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isValidNumberForRegion;

var _validate_ = _interopRequireDefault(require("./validate_"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Checks if a given phone number is valid within a given region.
 * Is just an alias for `phoneNumber.isValid() && phoneNumber.country === country`.
 * https://github.com/googlei18n/libphonenumber/blob/master/FAQ.md#when-should-i-use-isvalidnumberforregion
 */
function isValidNumberForRegion(input, country, options, metadata) {
  // If assigning the `{}` default value is moved to the arguments above,
  // code coverage would decrease for some weird reason.
  options = options || {};
  return input.country === country && (0, _validate_["default"])(input, options, metadata);
}

},{"./validate_":67}],55:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateMetadata = validateMetadata;
exports.getExtPrefix = getExtPrefix;
exports.getCountryCallingCode = getCountryCallingCode;
exports.isSupportedCountry = isSupportedCountry;
exports["default"] = void 0;

var _semverCompare = _interopRequireDefault(require("./tools/semver-compare"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Added "possibleLengths" and renamed
// "country_phone_code_to_countries" to "country_calling_codes".
var V2 = '1.0.18'; // Added "idd_prefix" and "default_idd_prefix".

var V3 = '1.2.0'; // Moved `001` country code to "nonGeographic" section of metadata.

var V4 = '1.7.35';
var DEFAULT_EXT_PREFIX = ' ext. ';
var CALLING_CODE_REG_EXP = /^\d+$/;
/**
 * See: https://gitlab.com/catamphetamine/libphonenumber-js/blob/master/METADATA.md
 */

var Metadata =
/*#__PURE__*/
function () {
  function Metadata(metadata) {
    _classCallCheck(this, Metadata);

    validateMetadata(metadata);
    this.metadata = metadata;
    setVersion.call(this, metadata);
  }

  _createClass(Metadata, [{
    key: "getCountries",
    value: function getCountries() {
      return Object.keys(this.metadata.countries).filter(function (_) {
        return _ !== '001';
      });
    }
  }, {
    key: "getCountryMetadata",
    value: function getCountryMetadata(countryCode) {
      return this.metadata.countries[countryCode];
    }
  }, {
    key: "nonGeographic",
    value: function nonGeographic() {
      if (this.v1 || this.v2 || this.v3) return; // `nonGeographical` was a typo.
      // It's present in metadata generated from `1.7.35` to `1.7.37`.

      return this.metadata.nonGeographic || this.metadata.nonGeographical;
    }
  }, {
    key: "hasCountry",
    value: function hasCountry(country) {
      return this.getCountryMetadata(country) !== undefined;
    }
  }, {
    key: "hasCallingCode",
    value: function hasCallingCode(callingCode) {
      if (this.getCountryCodesForCallingCode(callingCode)) {
        return true;
      }

      if (this.nonGeographic()) {
        if (this.nonGeographic()[callingCode]) {
          return true;
        }
      } else {
        // A hacky workaround for old custom metadata (generated before V4).
        var countryCodes = this.countryCallingCodes()[callingCode];

        if (countryCodes && countryCodes.length === 1 && countryCodes[0] === '001') {
          return true;
        }
      }
    }
  }, {
    key: "isNonGeographicCallingCode",
    value: function isNonGeographicCallingCode(callingCode) {
      if (this.nonGeographic()) {
        return this.nonGeographic()[callingCode] ? true : false;
      } else {
        return this.getCountryCodesForCallingCode(callingCode) ? false : true;
      }
    } // Deprecated.

  }, {
    key: "country",
    value: function country(countryCode) {
      return this.selectNumberingPlan(countryCode);
    }
  }, {
    key: "selectNumberingPlan",
    value: function selectNumberingPlan(countryCode, callingCode) {
      // Supports just passing `callingCode` as the first argument.
      if (countryCode && CALLING_CODE_REG_EXP.test(countryCode)) {
        callingCode = countryCode;
        countryCode = null;
      }

      if (countryCode && countryCode !== '001') {
        if (!this.hasCountry(countryCode)) {
          throw new Error("Unknown country: ".concat(countryCode));
        }

        this.numberingPlan = new NumberingPlan(this.getCountryMetadata(countryCode), this);
      } else if (callingCode) {
        if (!this.hasCallingCode(callingCode)) {
          throw new Error("Unknown calling code: ".concat(callingCode));
        }

        this.numberingPlan = new NumberingPlan(this.getNumberingPlanMetadata(callingCode), this);
      } else {
        this.numberingPlan = undefined;
      }

      return this;
    }
  }, {
    key: "getCountryCodesForCallingCode",
    value: function getCountryCodesForCallingCode(callingCode) {
      var countryCodes = this.countryCallingCodes()[callingCode];

      if (countryCodes) {
        // Metadata before V4 included "non-geographic entity" calling codes
        // inside `country_calling_codes` (for example, `"881":["001"]`).
        // Now the semantics of `country_calling_codes` has changed:
        // it's specifically for "countries" now.
        // Older versions of custom metadata will simply skip parsing
        // "non-geographic entity" phone numbers with new versions
        // of this library: it's not considered a bug,
        // because such numbers are extremely rare,
        // and developers extremely rarely use custom metadata.
        if (countryCodes.length === 1 && countryCodes[0].length === 3) {
          return;
        }

        return countryCodes;
      }
    }
  }, {
    key: "getCountryCodeForCallingCode",
    value: function getCountryCodeForCallingCode(callingCode) {
      var countryCodes = this.getCountryCodesForCallingCode(callingCode);

      if (countryCodes) {
        return countryCodes[0];
      }
    }
  }, {
    key: "getNumberingPlanMetadata",
    value: function getNumberingPlanMetadata(callingCode) {
      var countryCode = this.getCountryCodeForCallingCode(callingCode);

      if (countryCode) {
        return this.getCountryMetadata(countryCode);
      }

      if (this.nonGeographic()) {
        var metadata = this.nonGeographic()[callingCode];

        if (metadata) {
          return metadata;
        }
      } else {
        // A hacky workaround for old custom metadata (generated before V4).
        var countryCodes = this.countryCallingCodes()[callingCode];

        if (countryCodes && countryCodes.length === 1 && countryCodes[0] === '001') {
          return this.metadata.countries['001'];
        }
      }
    } // Deprecated.

  }, {
    key: "countryCallingCode",
    value: function countryCallingCode() {
      return this.numberingPlan.callingCode();
    } // Deprecated.

  }, {
    key: "IDDPrefix",
    value: function IDDPrefix() {
      return this.numberingPlan.IDDPrefix();
    } // Deprecated.

  }, {
    key: "defaultIDDPrefix",
    value: function defaultIDDPrefix() {
      return this.numberingPlan.defaultIDDPrefix();
    } // Deprecated.

  }, {
    key: "nationalNumberPattern",
    value: function nationalNumberPattern() {
      return this.numberingPlan.nationalNumberPattern();
    } // Deprecated.

  }, {
    key: "possibleLengths",
    value: function possibleLengths() {
      return this.numberingPlan.possibleLengths();
    } // Deprecated.

  }, {
    key: "formats",
    value: function formats() {
      return this.numberingPlan.formats();
    } // Deprecated.

  }, {
    key: "nationalPrefixForParsing",
    value: function nationalPrefixForParsing() {
      return this.numberingPlan.nationalPrefixForParsing();
    } // Deprecated.

  }, {
    key: "nationalPrefixTransformRule",
    value: function nationalPrefixTransformRule() {
      return this.numberingPlan.nationalPrefixTransformRule();
    } // Deprecated.

  }, {
    key: "leadingDigits",
    value: function leadingDigits() {
      return this.numberingPlan.leadingDigits();
    } // Deprecated.

  }, {
    key: "hasTypes",
    value: function hasTypes() {
      return this.numberingPlan.hasTypes();
    } // Deprecated.

  }, {
    key: "type",
    value: function type(_type) {
      return this.numberingPlan.type(_type);
    } // Deprecated.

  }, {
    key: "ext",
    value: function ext() {
      return this.numberingPlan.ext();
    }
  }, {
    key: "countryCallingCodes",
    value: function countryCallingCodes() {
      if (this.v1) return this.metadata.country_phone_code_to_countries;
      return this.metadata.country_calling_codes;
    } // Deprecated.

  }, {
    key: "chooseCountryByCountryCallingCode",
    value: function chooseCountryByCountryCallingCode(callingCode) {
      return this.selectNumberingPlan(callingCode);
    }
  }, {
    key: "hasSelectedNumberingPlan",
    value: function hasSelectedNumberingPlan() {
      return this.numberingPlan !== undefined;
    }
  }]);

  return Metadata;
}();

exports["default"] = Metadata;

var NumberingPlan =
/*#__PURE__*/
function () {
  function NumberingPlan(metadata, globalMetadataObject) {
    _classCallCheck(this, NumberingPlan);

    this.globalMetadataObject = globalMetadataObject;
    this.metadata = metadata;
    setVersion.call(this, globalMetadataObject.metadata);
  }

  _createClass(NumberingPlan, [{
    key: "callingCode",
    value: function callingCode() {
      return this.metadata[0];
    } // Formatting information for regions which share
    // a country calling code is contained by only one region
    // for performance reasons. For example, for NANPA region
    // ("North American Numbering Plan Administration",
    //  which includes USA, Canada, Cayman Islands, Bahamas, etc)
    // it will be contained in the metadata for `US`.

  }, {
    key: "getDefaultCountryMetadataForRegion",
    value: function getDefaultCountryMetadataForRegion() {
      return this.globalMetadataObject.getNumberingPlanMetadata(this.callingCode());
    }
  }, {
    key: "IDDPrefix",
    value: function IDDPrefix() {
      if (this.v1 || this.v2) return;
      return this.metadata[1];
    }
  }, {
    key: "defaultIDDPrefix",
    value: function defaultIDDPrefix() {
      if (this.v1 || this.v2) return;
      return this.metadata[12];
    }
  }, {
    key: "nationalNumberPattern",
    value: function nationalNumberPattern() {
      if (this.v1 || this.v2) return this.metadata[1];
      return this.metadata[2];
    }
  }, {
    key: "possibleLengths",
    value: function possibleLengths() {
      if (this.v1) return;
      return this.metadata[this.v2 ? 2 : 3];
    }
  }, {
    key: "_getFormats",
    value: function _getFormats(metadata) {
      return metadata[this.v1 ? 2 : this.v2 ? 3 : 4];
    } // For countries of the same region (e.g. NANPA)
    // formats are all stored in the "main" country for that region.
    // E.g. "RU" and "KZ", "US" and "CA".

  }, {
    key: "formats",
    value: function formats() {
      var _this = this;

      var formats = this._getFormats(this.metadata) || this._getFormats(this.getDefaultCountryMetadataForRegion()) || [];
      return formats.map(function (_) {
        return new Format(_, _this);
      });
    }
  }, {
    key: "nationalPrefix",
    value: function nationalPrefix() {
      return this.metadata[this.v1 ? 3 : this.v2 ? 4 : 5];
    }
  }, {
    key: "_getNationalPrefixFormattingRule",
    value: function _getNationalPrefixFormattingRule(metadata) {
      return metadata[this.v1 ? 4 : this.v2 ? 5 : 6];
    } // For countries of the same region (e.g. NANPA)
    // national prefix formatting rule is stored in the "main" country for that region.
    // E.g. "RU" and "KZ", "US" and "CA".

  }, {
    key: "nationalPrefixFormattingRule",
    value: function nationalPrefixFormattingRule() {
      return this._getNationalPrefixFormattingRule(this.metadata) || this._getNationalPrefixFormattingRule(this.getDefaultCountryMetadataForRegion());
    }
  }, {
    key: "_nationalPrefixForParsing",
    value: function _nationalPrefixForParsing() {
      return this.metadata[this.v1 ? 5 : this.v2 ? 6 : 7];
    }
  }, {
    key: "nationalPrefixForParsing",
    value: function nationalPrefixForParsing() {
      // If `national_prefix_for_parsing` is not set explicitly,
      // then infer it from `national_prefix` (if any)
      return this._nationalPrefixForParsing() || this.nationalPrefix();
    }
  }, {
    key: "nationalPrefixTransformRule",
    value: function nationalPrefixTransformRule() {
      return this.metadata[this.v1 ? 6 : this.v2 ? 7 : 8];
    }
  }, {
    key: "_getNationalPrefixIsOptionalWhenFormatting",
    value: function _getNationalPrefixIsOptionalWhenFormatting() {
      return !!this.metadata[this.v1 ? 7 : this.v2 ? 8 : 9];
    } // For countries of the same region (e.g. NANPA)
    // "national prefix is optional when formatting" flag is
    // stored in the "main" country for that region.
    // E.g. "RU" and "KZ", "US" and "CA".

  }, {
    key: "nationalPrefixIsOptionalWhenFormattingInNationalFormat",
    value: function nationalPrefixIsOptionalWhenFormattingInNationalFormat() {
      return this._getNationalPrefixIsOptionalWhenFormatting(this.metadata) || this._getNationalPrefixIsOptionalWhenFormatting(this.getDefaultCountryMetadataForRegion());
    }
  }, {
    key: "leadingDigits",
    value: function leadingDigits() {
      return this.metadata[this.v1 ? 8 : this.v2 ? 9 : 10];
    }
  }, {
    key: "types",
    value: function types() {
      return this.metadata[this.v1 ? 9 : this.v2 ? 10 : 11];
    }
  }, {
    key: "hasTypes",
    value: function hasTypes() {
      // Versions 1.2.0 - 1.2.4: can be `[]`.

      /* istanbul ignore next */
      if (this.types() && this.types().length === 0) {
        return false;
      } // Versions <= 1.2.4: can be `undefined`.
      // Version >= 1.2.5: can be `0`.


      return !!this.types();
    }
  }, {
    key: "type",
    value: function type(_type2) {
      if (this.hasTypes() && getType(this.types(), _type2)) {
        return new Type(getType(this.types(), _type2), this);
      }
    }
  }, {
    key: "ext",
    value: function ext() {
      if (this.v1 || this.v2) return DEFAULT_EXT_PREFIX;
      return this.metadata[13] || DEFAULT_EXT_PREFIX;
    }
  }]);

  return NumberingPlan;
}();

var Format =
/*#__PURE__*/
function () {
  function Format(format, metadata) {
    _classCallCheck(this, Format);

    this._format = format;
    this.metadata = metadata;
  }

  _createClass(Format, [{
    key: "pattern",
    value: function pattern() {
      return this._format[0];
    }
  }, {
    key: "format",
    value: function format() {
      return this._format[1];
    }
  }, {
    key: "leadingDigitsPatterns",
    value: function leadingDigitsPatterns() {
      return this._format[2] || [];
    }
  }, {
    key: "nationalPrefixFormattingRule",
    value: function nationalPrefixFormattingRule() {
      return this._format[3] || this.metadata.nationalPrefixFormattingRule();
    }
  }, {
    key: "nationalPrefixIsOptionalWhenFormattingInNationalFormat",
    value: function nationalPrefixIsOptionalWhenFormattingInNationalFormat() {
      return !!this._format[4] || this.metadata.nationalPrefixIsOptionalWhenFormattingInNationalFormat();
    }
  }, {
    key: "nationalPrefixIsMandatoryWhenFormattingInNationalFormat",
    value: function nationalPrefixIsMandatoryWhenFormattingInNationalFormat() {
      // National prefix is omitted if there's no national prefix formatting rule
      // set for this country, or when the national prefix formatting rule
      // contains no national prefix itself, or when this rule is set but
      // national prefix is optional for this phone number format
      // (and it is not enforced explicitly)
      return this.usesNationalPrefix() && !this.nationalPrefixIsOptionalWhenFormattingInNationalFormat();
    } // Checks whether national prefix formatting rule contains national prefix.

  }, {
    key: "usesNationalPrefix",
    value: function usesNationalPrefix() {
      return this.nationalPrefixFormattingRule() && // Check that national prefix formatting rule is not a "dummy" one.
      !FIRST_GROUP_ONLY_PREFIX_PATTERN.test(this.nationalPrefixFormattingRule()) // In compressed metadata, `this.nationalPrefixFormattingRule()` is `0`
      // when `national_prefix_formatting_rule` is not present.
      // So, `true` or `false` are returned explicitly here, so that
      // `0` number isn't returned.
      ? true : false;
    }
  }, {
    key: "internationalFormat",
    value: function internationalFormat() {
      return this._format[5] || this.format();
    }
  }]);

  return Format;
}();
/**
 * A pattern that is used to determine if the national prefix formatting rule
 * has the first group only, i.e., does not start with the national prefix.
 * Note that the pattern explicitly allows for unbalanced parentheses.
 */


var FIRST_GROUP_ONLY_PREFIX_PATTERN = /^\(?\$1\)?$/;

var Type =
/*#__PURE__*/
function () {
  function Type(type, metadata) {
    _classCallCheck(this, Type);

    this.type = type;
    this.metadata = metadata;
  }

  _createClass(Type, [{
    key: "pattern",
    value: function pattern() {
      if (this.metadata.v1) return this.type;
      return this.type[0];
    }
  }, {
    key: "possibleLengths",
    value: function possibleLengths() {
      if (this.metadata.v1) return;
      return this.type[1] || this.metadata.possibleLengths();
    }
  }]);

  return Type;
}();

function getType(types, type) {
  switch (type) {
    case 'FIXED_LINE':
      return types[0];

    case 'MOBILE':
      return types[1];

    case 'TOLL_FREE':
      return types[2];

    case 'PREMIUM_RATE':
      return types[3];

    case 'PERSONAL_NUMBER':
      return types[4];

    case 'VOICEMAIL':
      return types[5];

    case 'UAN':
      return types[6];

    case 'PAGER':
      return types[7];

    case 'VOIP':
      return types[8];

    case 'SHARED_COST':
      return types[9];
  }
}

function validateMetadata(metadata) {
  if (!metadata) {
    throw new Error('[libphonenumber-js] `metadata` argument not passed. Check your arguments.');
  } // `country_phone_code_to_countries` was renamed to
  // `country_calling_codes` in `1.0.18`.


  if (!is_object(metadata) || !is_object(metadata.countries)) {
    throw new Error("[libphonenumber-js] `metadata` argument was passed but it's not a valid metadata. Must be an object having `.countries` child object property. Got ".concat(is_object(metadata) ? 'an object of shape: { ' + Object.keys(metadata).join(', ') + ' }' : 'a ' + type_of(metadata) + ': ' + metadata, "."));
  }
} // Babel transforms `typeof` into some "branches"
// so istanbul will show this as "branch not covered".

/* istanbul ignore next */


var is_object = function is_object(_) {
  return _typeof(_) === 'object';
}; // Babel transforms `typeof` into some "branches"
// so istanbul will show this as "branch not covered".

/* istanbul ignore next */


var type_of = function type_of(_) {
  return _typeof(_);
};
/**
 * Returns extension prefix for a country.
 * @param  {string} country
 * @param  {object} metadata
 * @return {string?}
 * @example
 * // Returns " ext. "
 * getExtPrefix("US")
 */


function getExtPrefix(country, metadata) {
  metadata = new Metadata(metadata);

  if (metadata.hasCountry(country)) {
    return metadata.country(country).ext();
  }

  return DEFAULT_EXT_PREFIX;
}
/**
 * Returns "country calling code" for a country.
 * Throws an error if the country doesn't exist or isn't supported by this library.
 * @param  {string} country
 * @param  {object} metadata
 * @return {string}
 * @example
 * // Returns "44"
 * getCountryCallingCode("GB")
 */


function getCountryCallingCode(country, metadata) {
  metadata = new Metadata(metadata);

  if (metadata.hasCountry(country)) {
    return metadata.country(country).countryCallingCode();
  }

  throw new Error("Unknown country: ".concat(country));
}

function isSupportedCountry(country, metadata) {
  // metadata = new Metadata(metadata)
  // return metadata.hasCountry(country)
  return metadata.countries[country] !== undefined;
}

function setVersion(metadata) {
  var version = metadata.version;

  if (typeof version === 'number') {
    this.v1 = version === 1;
    this.v2 = version === 2;
    this.v3 = version === 3;
    this.v4 = version === 4;
  } else {
    if (!version) {
      this.v1 = true;
    } else if ((0, _semverCompare["default"])(version, V3) === -1) {
      this.v2 = true;
    } else if ((0, _semverCompare["default"])(version, V4) === -1) {
      this.v3 = true;
    } else {
      this.v4 = true;
    }
  }
} // const ISO_COUNTRY_CODE = /^[A-Z]{2}$/
// function isCountryCode(countryCode) {
// 	return ISO_COUNTRY_CODE.test(countryCodeOrCountryCallingCode)
// }

},{"./tools/semver-compare":65}],56:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parseNumber;

var _parse_ = _interopRequireDefault(require("./parse_"));

var _parsePhoneNumber = require("./parsePhoneNumber");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// `options`:
//  {
//    country:
//    {
//      restrict - (a two-letter country code)
//                 the phone number must be in this country
//
//      default - (a two-letter country code)
//                default country to use for phone number parsing and validation
//                (if no country code could be derived from the phone number)
//    }
//  }
//
// Returns `{ country, number }`
//
// Example use cases:
//
// ```js
// parse('8 (800) 555-35-35', 'RU')
// parse('8 (800) 555-35-35', 'RU', metadata)
// parse('8 (800) 555-35-35', { country: { default: 'RU' } })
// parse('8 (800) 555-35-35', { country: { default: 'RU' } }, metadata)
// parse('+7 800 555 35 35')
// parse('+7 800 555 35 35', metadata)
// ```
//
function parseNumber() {
  var _normalizeArguments = (0, _parsePhoneNumber.normalizeArguments)(arguments),
      text = _normalizeArguments.text,
      options = _normalizeArguments.options,
      metadata = _normalizeArguments.metadata;

  return (0, _parse_["default"])(text, options, metadata);
}

},{"./parsePhoneNumber":58,"./parse_":62}],57:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parseIncompletePhoneNumber;
exports.parsePhoneNumberCharacter = parsePhoneNumberCharacter;

var _parseDigits = require("./helpers/parseDigits");

/**
 * Parses phone number characters from a string.
 * Drops all punctuation leaving only digits and the leading `+` sign (if any).
 * Also converts wide-ascii and arabic-indic numerals to conventional numerals.
 * E.g. in Iraq they don't write `+442323234` but rather `+٤٤٢٣٢٣٢٣٤`.
 * @param  {string} string
 * @return {string}
 * @example
 * ```js
 * // Outputs '8800555'.
 * parseIncompletePhoneNumber('8 (800) 555')
 * // Outputs '+7800555'.
 * parseIncompletePhoneNumber('+7 800 555')
 * ```
 */
function parseIncompletePhoneNumber(string) {
  var result = ''; // Using `.split('')` here instead of normal `for ... of`
  // because the importing application doesn't neccessarily include an ES6 polyfill.
  // The `.split('')` approach discards "exotic" UTF-8 characters
  // (the ones consisting of four bytes) but digits
  // (including non-European ones) don't fall into that range
  // so such "exotic" characters would be discarded anyway.

  for (var _iterator = string.split(''), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var character = _ref;
    result += parsePhoneNumberCharacter(character, result) || '';
  }

  return result;
}
/**
 * Parses next character while parsing phone number digits (including a `+`)
 * from text: discards everything except `+` and digits, and `+` is only allowed
 * at the start of a phone number.
 * For example, is used in `react-phone-number-input` where it uses
 * [`input-format`](https://gitlab.com/catamphetamine/input-format).
 * @param  {string} character - Yet another character from raw input string.
 * @param  {string?} prevParsedCharacters - Previous parsed characters.
 * @param  {object} meta - Optional custom use-case-specific metadata.
 * @return {string?} The parsed character.
 */


function parsePhoneNumberCharacter(character, prevParsedCharacters) {
  // Only allow a leading `+`.
  if (character === '+') {
    // If this `+` is not the first parsed character
    // then discard it.
    if (prevParsedCharacters) {
      return;
    }

    return '+';
  } // Allow digits.


  return (0, _parseDigits.parseDigit)(character);
}

},{"./helpers/parseDigits":49}],58:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parsePhoneNumber;
exports.normalizeArguments = normalizeArguments;

var _parsePhoneNumber_ = _interopRequireDefault(require("./parsePhoneNumber_"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function parsePhoneNumber() {
  var _normalizeArguments = normalizeArguments(arguments),
      text = _normalizeArguments.text,
      options = _normalizeArguments.options,
      metadata = _normalizeArguments.metadata;

  return (0, _parsePhoneNumber_["default"])(text, options, metadata);
}

function normalizeArguments(args) {
  var _Array$prototype$slic = Array.prototype.slice.call(args),
      _Array$prototype$slic2 = _slicedToArray(_Array$prototype$slic, 4),
      arg_1 = _Array$prototype$slic2[0],
      arg_2 = _Array$prototype$slic2[1],
      arg_3 = _Array$prototype$slic2[2],
      arg_4 = _Array$prototype$slic2[3];

  var text;
  var options;
  var metadata; // If the phone number is passed as a string.
  // `parsePhoneNumber('88005553535', ...)`.

  if (typeof arg_1 === 'string') {
    text = arg_1;
  } else throw new TypeError('A text for parsing must be a string.'); // If "default country" argument is being passed then move it to `options`.
  // `parsePhoneNumber('88005553535', 'RU', [options], metadata)`.


  if (!arg_2 || typeof arg_2 === 'string') {
    if (arg_4) {
      options = arg_3;
      metadata = arg_4;
    } else {
      options = undefined;
      metadata = arg_3;
    }

    if (arg_2) {
      options = _objectSpread({
        defaultCountry: arg_2
      }, options);
    }
  } // `defaultCountry` is not passed.
  // Example: `parsePhoneNumber('+78005553535', [options], metadata)`.
  else if (isObject(arg_2)) {
      if (arg_3) {
        options = arg_2;
        metadata = arg_3;
      } else {
        metadata = arg_2;
      }
    } else throw new Error("Invalid second argument: ".concat(arg_2));

  return {
    text: text,
    options: options,
    metadata: metadata
  };
} // Otherwise istanbul would show this as "branch not covered".

/* istanbul ignore next */


var isObject = function isObject(_) {
  return _typeof(_) === 'object';
};

},{"./parsePhoneNumber_":61}],59:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parsePhoneNumberFromString;

var _parsePhoneNumber = require("./parsePhoneNumber");

var _parsePhoneNumberFromString_ = _interopRequireDefault(require("./parsePhoneNumberFromString_"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function parsePhoneNumberFromString() {
  var _normalizeArguments = (0, _parsePhoneNumber.normalizeArguments)(arguments),
      text = _normalizeArguments.text,
      options = _normalizeArguments.options,
      metadata = _normalizeArguments.metadata;

  return (0, _parsePhoneNumberFromString_["default"])(text, options, metadata);
}

},{"./parsePhoneNumber":58,"./parsePhoneNumberFromString_":60}],60:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parsePhoneNumberFromString;

var _parsePhoneNumber_ = _interopRequireDefault(require("./parsePhoneNumber_"));

var _ParseError = _interopRequireDefault(require("./ParseError"));

var _metadata = require("./metadata");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function parsePhoneNumberFromString(text, options, metadata) {
  // Validate `defaultCountry`.
  if (options && options.defaultCountry && !(0, _metadata.isSupportedCountry)(options.defaultCountry, metadata)) {
    options = _objectSpread({}, options, {
      defaultCountry: undefined
    });
  } // Parse phone number.


  try {
    return (0, _parsePhoneNumber_["default"])(text, options, metadata);
  } catch (error) {
    /* istanbul ignore else */
    if (error instanceof _ParseError["default"]) {//
    } else {
      throw error;
    }
  }
}

},{"./ParseError":9,"./metadata":55,"./parsePhoneNumber_":61}],61:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parsePhoneNumber;

var _parse_ = _interopRequireDefault(require("./parse_"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function parsePhoneNumber(text, options, metadata) {
  return (0, _parse_["default"])(text, _objectSpread({}, options, {
    v2: true
  }), metadata);
}

},{"./parse_":62}],62:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = parse;
exports.extractFormattedPhoneNumber = extractFormattedPhoneNumber;

var _constants = require("./constants");

var _ParseError = _interopRequireDefault(require("./ParseError"));

var _metadata = _interopRequireDefault(require("./metadata"));

var _isViablePhoneNumber = _interopRequireDefault(require("./helpers/isViablePhoneNumber"));

var _extractExtension = _interopRequireDefault(require("./helpers/extension/extractExtension"));

var _parseIncompletePhoneNumber = _interopRequireDefault(require("./parseIncompletePhoneNumber"));

var _getCountryCallingCode = _interopRequireDefault(require("./getCountryCallingCode"));

var _isPossibleNumber_ = require("./isPossibleNumber_");

var _RFC = require("./helpers/RFC3966");

var _PhoneNumber = _interopRequireDefault(require("./PhoneNumber"));

var _matchesEntirely = _interopRequireDefault(require("./helpers/matchesEntirely"));

var _extractCountryCallingCode = _interopRequireDefault(require("./helpers/extractCountryCallingCode"));

var _extractCountryCallingCodeFromInternationalNumberWithoutPlusSign = _interopRequireDefault(require("./helpers/extractCountryCallingCodeFromInternationalNumberWithoutPlusSign"));

var _extractNationalNumber = _interopRequireDefault(require("./helpers/extractNationalNumber"));

var _stripIddPrefix = _interopRequireDefault(require("./helpers/stripIddPrefix"));

var _getCountryByCallingCode = _interopRequireDefault(require("./helpers/getCountryByCallingCode"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// This is a port of Google Android `libphonenumber`'s
// `phonenumberutil.js` of December 31th, 2018.
//
// https://github.com/googlei18n/libphonenumber/commits/master/javascript/i18n/phonenumbers/phonenumberutil.js
// We don't allow input strings for parsing to be longer than 250 chars.
// This prevents malicious input from consuming CPU.
var MAX_INPUT_STRING_LENGTH = 250; // This consists of the plus symbol, digits, and arabic-indic digits.

var PHONE_NUMBER_START_PATTERN = new RegExp('[' + _constants.PLUS_CHARS + _constants.VALID_DIGITS + ']'); // Regular expression of trailing characters that we want to remove.
// A trailing `#` is sometimes used when writing phone numbers with extensions in US.
// Example: "+1 (645) 123 1234-910#" number has extension "910".

var AFTER_PHONE_NUMBER_END_PATTERN = new RegExp('[^' + _constants.VALID_DIGITS + '#' + ']+$');
var USE_NON_GEOGRAPHIC_COUNTRY_CODE = false; // `options`:
//  {
//    country:
//    {
//      restrict - (a two-letter country code)
//                 the phone number must be in this country
//
//      default - (a two-letter country code)
//                default country to use for phone number parsing and validation
//                (if no country code could be derived from the phone number)
//    }
//  }
//
// Returns `{ country, number }`
//
// Example use cases:
//
// ```js
// parse('8 (800) 555-35-35', 'RU')
// parse('8 (800) 555-35-35', 'RU', metadata)
// parse('8 (800) 555-35-35', { country: { default: 'RU' } })
// parse('8 (800) 555-35-35', { country: { default: 'RU' } }, metadata)
// parse('+7 800 555 35 35')
// parse('+7 800 555 35 35', metadata)
// ```
//

function parse(text, options, metadata) {
  // If assigning the `{}` default value is moved to the arguments above,
  // code coverage would decrease for some weird reason.
  options = options || {};
  metadata = new _metadata["default"](metadata); // Validate `defaultCountry`.

  if (options.defaultCountry && !metadata.hasCountry(options.defaultCountry)) {
    if (options.v2) {
      throw new _ParseError["default"]('INVALID_COUNTRY');
    }

    throw new Error("Unknown country: ".concat(options.defaultCountry));
  } // Parse the phone number.


  var _parseInput = parseInput(text, options.v2),
      formattedPhoneNumber = _parseInput.number,
      ext = _parseInput.ext; // If the phone number is not viable then return nothing.


  if (!formattedPhoneNumber) {
    if (options.v2) {
      throw new _ParseError["default"]('NOT_A_NUMBER');
    }

    return {};
  }

  var _parsePhoneNumber = parsePhoneNumber(formattedPhoneNumber, options.defaultCountry, options.defaultCallingCode, metadata),
      country = _parsePhoneNumber.country,
      nationalNumber = _parsePhoneNumber.nationalNumber,
      countryCallingCode = _parsePhoneNumber.countryCallingCode,
      carrierCode = _parsePhoneNumber.carrierCode;

  if (!metadata.hasSelectedNumberingPlan()) {
    if (options.v2) {
      throw new _ParseError["default"]('INVALID_COUNTRY');
    }

    return {};
  } // Validate national (significant) number length.


  if (!nationalNumber || nationalNumber.length < _constants.MIN_LENGTH_FOR_NSN) {
    // Won't throw here because the regexp already demands length > 1.

    /* istanbul ignore if */
    if (options.v2) {
      throw new _ParseError["default"]('TOO_SHORT');
    } // Google's demo just throws an error in this case.


    return {};
  } // Validate national (significant) number length.
  //
  // A sidenote:
  //
  // They say that sometimes national (significant) numbers
  // can be longer than `MAX_LENGTH_FOR_NSN` (e.g. in Germany).
  // https://github.com/googlei18n/libphonenumber/blob/7e1748645552da39c4e1ba731e47969d97bdb539/resources/phonenumber.proto#L36
  // Such numbers will just be discarded.
  //


  if (nationalNumber.length > _constants.MAX_LENGTH_FOR_NSN) {
    if (options.v2) {
      throw new _ParseError["default"]('TOO_LONG');
    } // Google's demo just throws an error in this case.


    return {};
  }

  if (options.v2) {
    var phoneNumber = new _PhoneNumber["default"](countryCallingCode, nationalNumber, metadata.metadata);

    if (country) {
      phoneNumber.country = country;
    }

    if (carrierCode) {
      phoneNumber.carrierCode = carrierCode;
    }

    if (ext) {
      phoneNumber.ext = ext;
    }

    return phoneNumber;
  } // Check if national phone number pattern matches the number.
  // National number pattern is different for each country,
  // even for those ones which are part of the "NANPA" group.


  var valid = (options.extended ? metadata.hasSelectedNumberingPlan() : country) ? (0, _matchesEntirely["default"])(nationalNumber, metadata.nationalNumberPattern()) : false;

  if (!options.extended) {
    return valid ? result(country, nationalNumber, ext) : {};
  } // isInternational: countryCallingCode !== undefined


  return {
    country: country,
    countryCallingCode: countryCallingCode,
    carrierCode: carrierCode,
    valid: valid,
    possible: valid ? true : options.extended === true && metadata.possibleLengths() && (0, _isPossibleNumber_.isPossibleNumber)(nationalNumber, metadata) ? true : false,
    phone: nationalNumber,
    ext: ext
  };
}
/**
 * Extracts a formatted phone number from text.
 * Doesn't guarantee that the extracted phone number
 * is a valid phone number (for example, doesn't validate its length).
 * @param  {string} text
 * @param  {boolean} throwOnError — By default, it won't throw if the text is too long.
 * @return {string}
 * @example
 * // Returns "(213) 373-4253".
 * extractFormattedPhoneNumber("Call (213) 373-4253 for assistance.")
 */


function extractFormattedPhoneNumber(text, throwOnError) {
  if (!text) {
    return;
  }

  if (text.length > MAX_INPUT_STRING_LENGTH) {
    if (throwOnError) {
      throw new _ParseError["default"]('TOO_LONG');
    }

    return;
  } // Attempt to extract a possible number from the string passed in


  var startsAt = text.search(PHONE_NUMBER_START_PATTERN);

  if (startsAt < 0) {
    return;
  }

  return text // Trim everything to the left of the phone number
  .slice(startsAt) // Remove trailing non-numerical characters
  .replace(AFTER_PHONE_NUMBER_END_PATTERN, '');
}
/**
 * @param  {string} text - Input.
 * @return {object} `{ ?number, ?ext }`.
 */


function parseInput(text, v2) {
  // Parse RFC 3966 phone number URI.
  if (text && text.indexOf('tel:') === 0) {
    return (0, _RFC.parseRFC3966)(text);
  }

  var number = extractFormattedPhoneNumber(text, v2); // If the phone number is not viable, then abort.

  if (!number || !(0, _isViablePhoneNumber["default"])(number)) {
    return {};
  } // Attempt to parse extension first, since it doesn't require region-specific
  // data and we want to have the non-normalised number here.


  var withExtensionStripped = (0, _extractExtension["default"])(number);

  if (withExtensionStripped.ext) {
    return withExtensionStripped;
  }

  return {
    number: number
  };
}
/**
 * Creates `parse()` result object.
 */


function result(country, nationalNumber, ext) {
  var result = {
    country: country,
    phone: nationalNumber
  };

  if (ext) {
    result.ext = ext;
  }

  return result;
}
/**
 * Parses a viable phone number.
 * @param {string} formattedPhoneNumber — Example: "(213) 373-4253".
 * @param {string} [defaultCountry]
 * @param {string} [defaultCallingCode]
 * @param {Metadata} metadata
 * @return {object} Returns `{ country: string?, countryCallingCode: string?, nationalNumber: string? }`.
 */


function parsePhoneNumber(formattedPhoneNumber, defaultCountry, defaultCallingCode, metadata) {
  // Extract calling code from phone number.
  var _extractCountryCallin = (0, _extractCountryCallingCode["default"])((0, _parseIncompletePhoneNumber["default"])(formattedPhoneNumber), defaultCountry, defaultCallingCode, metadata.metadata),
      countryCallingCode = _extractCountryCallin.countryCallingCode,
      number = _extractCountryCallin.number; // Choose a country by `countryCallingCode`.


  var country;

  if (countryCallingCode) {
    metadata.selectNumberingPlan(countryCallingCode);
  } // If `formattedPhoneNumber` is in "national" format
  // then `number` is defined and `countryCallingCode` isn't.
  else if (number && (defaultCountry || defaultCallingCode)) {
      metadata.selectNumberingPlan(defaultCountry, defaultCallingCode);

      if (defaultCountry) {
        country = defaultCountry;
      } else {
        /* istanbul ignore if */
        if (USE_NON_GEOGRAPHIC_COUNTRY_CODE) {
          if (metadata.isNonGeographicCallingCode(defaultCallingCode)) {
            country = '001';
          }
        }
      }

      countryCallingCode = defaultCallingCode || (0, _getCountryCallingCode["default"])(defaultCountry, metadata.metadata);
    } else return {};

  if (!number) {
    return {
      countryCallingCode: countryCallingCode
    };
  }

  var _extractNationalNumbe = (0, _extractNationalNumber["default"])((0, _parseIncompletePhoneNumber["default"])(number), metadata),
      nationalNumber = _extractNationalNumbe.nationalNumber,
      carrierCode = _extractNationalNumbe.carrierCode; // Sometimes there are several countries
  // corresponding to the same country phone code
  // (e.g. NANPA countries all having `1` country phone code).
  // Therefore, to reliably determine the exact country,
  // national (significant) number should have been parsed first.
  //
  // When `metadata.json` is generated, all "ambiguous" country phone codes
  // get their countries populated with the full set of
  // "phone number type" regular expressions.
  //


  var exactCountry = (0, _getCountryByCallingCode["default"])(countryCallingCode, nationalNumber, metadata);

  if (exactCountry) {
    country = exactCountry;
    /* istanbul ignore if */

    if (exactCountry === '001') {// Can't happen with `USE_NON_GEOGRAPHIC_COUNTRY_CODE` being `false`.
      // If `USE_NON_GEOGRAPHIC_COUNTRY_CODE` is set to `true` for some reason,
      // then remove the "istanbul ignore if".
    } else {
      metadata.country(country);
    }
  }

  return {
    country: country,
    countryCallingCode: countryCallingCode,
    nationalNumber: nationalNumber,
    carrierCode: carrierCode
  };
}

},{"./ParseError":9,"./PhoneNumber":10,"./constants":12,"./getCountryCallingCode":30,"./helpers/RFC3966":33,"./helpers/extension/extractExtension":37,"./helpers/extractCountryCallingCode":38,"./helpers/extractCountryCallingCodeFromInternationalNumberWithoutPlusSign":39,"./helpers/extractNationalNumber":40,"./helpers/getCountryByCallingCode":43,"./helpers/isViablePhoneNumber":46,"./helpers/matchesEntirely":47,"./helpers/stripIddPrefix":50,"./isPossibleNumber_":52,"./metadata":55,"./parseIncompletePhoneNumber":57}],63:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = searchNumbers;

var _parsePhoneNumber = require("./parsePhoneNumber");

var _PhoneNumberMatcher = _interopRequireDefault(require("./PhoneNumberMatcher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @return ES6 `for ... of` iterator.
 */
function searchNumbers() {
  var _normalizeArguments = (0, _parsePhoneNumber.normalizeArguments)(arguments),
      text = _normalizeArguments.text,
      options = _normalizeArguments.options,
      metadata = _normalizeArguments.metadata;

  var matcher = new _PhoneNumberMatcher["default"](text, options, metadata);
  return _defineProperty({}, Symbol.iterator, function () {
    return {
      next: function next() {
        if (matcher.hasNext()) {
          return {
            done: false,
            value: matcher.next()
          };
        }

        return {
          done: true
        };
      }
    };
  });
}

},{"./PhoneNumberMatcher":11,"./parsePhoneNumber":58}],64:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = searchPhoneNumbersInText;

var _searchNumbers = _interopRequireDefault(require("./searchNumbers"));

var _findPhoneNumbersInText = require("./findPhoneNumbersInText");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function searchPhoneNumbersInText(text, defaultCountry, options, metadata) {
  var args = (0, _findPhoneNumbersInText.getArguments)(defaultCountry, options, metadata);
  return (0, _searchNumbers["default"])(text, args.options, args.metadata);
}

},{"./findPhoneNumbersInText":24,"./searchNumbers":63}],65:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

// Copy-pasted from:
// https://github.com/substack/semver-compare/blob/master/index.js
//
// Inlining this function because some users reported issues with
// importing from `semver-compare` in a browser with ES6 "native" modules.
//
// Fixes `semver-compare` not being able to compare versions with alpha/beta/etc "tags".
// https://github.com/catamphetamine/libphonenumber-js/issues/381
function _default(a, b) {
  a = a.split('-');
  b = b.split('-');
  var pa = a[0].split('.');
  var pb = b[0].split('.');

  for (var i = 0; i < 3; i++) {
    var na = Number(pa[i]);
    var nb = Number(pb[i]);
    if (na > nb) return 1;
    if (nb > na) return -1;
    if (!isNaN(na) && isNaN(nb)) return 1;
    if (isNaN(na) && !isNaN(nb)) return -1;
  }

  if (a[1] && b[1]) {
    return a[1] > b[1] ? 1 : a[1] < b[1] ? -1 : 0;
  }

  return !a[1] && b[1] ? 1 : a[1] && !b[1] ? -1 : 0;
}

},{}],66:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isValidNumber;

var _validate_ = _interopRequireDefault(require("./validate_"));

var _getNumberType = require("./getNumberType");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Finds out national phone number type (fixed line, mobile, etc)
function isValidNumber() {
  var _normalizeArguments = (0, _getNumberType.normalizeArguments)(arguments),
      input = _normalizeArguments.input,
      options = _normalizeArguments.options,
      metadata = _normalizeArguments.metadata;

  return (0, _validate_["default"])(input, options, metadata);
}

},{"./getNumberType":32,"./validate_":67}],67:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = isValidNumber;

var _metadata = _interopRequireDefault(require("./metadata"));

var _matchesEntirely = _interopRequireDefault(require("./helpers/matchesEntirely"));

var _getNumberType = _interopRequireDefault(require("./helpers/getNumberType"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Checks if a given phone number is valid.
 *
 * If the `number` is a string, it will be parsed to an object,
 * but only if it contains only valid phone number characters (including punctuation).
 * If the `number` is an object, it is used as is.
 *
 * The optional `defaultCountry` argument is the default country.
 * I.e. it does not restrict to just that country,
 * e.g. in those cases where several countries share
 * the same phone numbering rules (NANPA, Britain, etc).
 * For example, even though the number `07624 369230`
 * belongs to the Isle of Man ("IM" country code)
 * calling `isValidNumber('07624369230', 'GB', metadata)`
 * still returns `true` because the country is not restricted to `GB`,
 * it's just that `GB` is the default one for the phone numbering rules.
 * For restricting the country see `isValidNumberForRegion()`
 * though restricting a country might not be a good idea.
 * https://github.com/googlei18n/libphonenumber/blob/master/FAQ.md#when-should-i-use-isvalidnumberforregion
 *
 * Examples:
 *
 * ```js
 * isValidNumber('+78005553535', metadata)
 * isValidNumber('8005553535', 'RU', metadata)
 * isValidNumber('88005553535', 'RU', metadata)
 * isValidNumber({ phone: '8005553535', country: 'RU' }, metadata)
 * ```
 */
function isValidNumber(input, options, metadata) {
  // If assigning the `{}` default value is moved to the arguments above,
  // code coverage would decrease for some weird reason.
  options = options || {};
  metadata = new _metadata["default"](metadata); // This is just to support `isValidNumber({})`
  // for cases when `parseNumber()` returns `{}`.

  if (!input.country) {
    return false;
  }

  metadata.selectNumberingPlan(input.country, input.countryCallingCode); // By default, countries only have type regexps when it's required for
  // distinguishing different countries having the same `countryCallingCode`.

  if (metadata.hasTypes()) {
    return (0, _getNumberType["default"])(input, options, metadata.metadata) !== undefined;
  } // If there are no type regexps for this country in metadata then use
  // `nationalNumberPattern` as a "better than nothing" replacement.


  var national_number = options.v2 ? input.nationalNumber : input.phone;
  return (0, _matchesEntirely["default"])(national_number, metadata.nationalNumberPattern());
}

},{"./helpers/getNumberType":45,"./helpers/matchesEntirely":47,"./metadata":55}],68:[function(require,module,exports){
'use strict'

var parsePhoneNumberFromString = require('../build/parsePhoneNumberFromString').default

// ES5 `require()` "default" "interoperability" hack.
// https://github.com/babel/babel/issues/2212#issuecomment-131827986
// An alternative approach:
// https://www.npmjs.com/package/babel-plugin-add-module-exports
exports = module.exports = parsePhoneNumberFromString
exports['default'] = parsePhoneNumberFromString

exports.ParseError = require('../build/ParseError').default
var parsePhoneNumberWithError = require('../build/parsePhoneNumber').default
// `parsePhoneNumber()` named export has been renamed to `parsePhoneNumberWithError()`.
exports.parsePhoneNumberWithError = parsePhoneNumberWithError
exports.parsePhoneNumber = parsePhoneNumberWithError

// `parsePhoneNumberFromString()` named export is now considered legacy:
// it has been promoted to a default export due to being too verbose.
exports.parsePhoneNumberFromString = parsePhoneNumberFromString

exports.findNumbers = require('../build/findNumbers').default
exports.searchNumbers = require('../build/searchNumbers').default
exports.findPhoneNumbersInText = require('../build/findPhoneNumbersInText').default
exports.searchPhoneNumbersInText = require('../build/searchPhoneNumbersInText').default
exports.PhoneNumberMatcher = require('../build/PhoneNumberMatcher').default

exports.AsYouType = require('../build/AsYouType').default

exports.Metadata = require('../build/metadata').default
exports.isSupportedCountry = require('../build/metadata').isSupportedCountry
exports.getCountries = require('../build/getCountries').default
exports.getCountryCallingCode = require('../build/metadata').getCountryCallingCode
exports.getExtPrefix = require('../build/metadata').getExtPrefix

exports.getExampleNumber = require('../build/getExampleNumber').default

exports.formatIncompletePhoneNumber = require('../build/formatIncompletePhoneNumber').default

exports.parseIncompletePhoneNumber = require('../build/parseIncompletePhoneNumber').default
exports.parsePhoneNumberCharacter = require('../build/parseIncompletePhoneNumber').parsePhoneNumberCharacter
exports.parseDigits = require('../build/helpers/parseDigits').default
exports.DIGIT_PLACEHOLDER = require('../build/AsYouTypeFormatter').DIGIT_PLACEHOLDER

exports.parseRFC3966 = require('../build/helpers/RFC3966').parseRFC3966
exports.formatRFC3966 = require('../build/helpers/RFC3966').formatRFC3966
},{"../build/AsYouType":3,"../build/AsYouTypeFormatter":5,"../build/ParseError":9,"../build/PhoneNumberMatcher":11,"../build/findNumbers":13,"../build/findPhoneNumbersInText":24,"../build/formatIncompletePhoneNumber":27,"../build/getCountries":29,"../build/getExampleNumber":31,"../build/helpers/RFC3966":33,"../build/helpers/parseDigits":49,"../build/metadata":55,"../build/parseIncompletePhoneNumber":57,"../build/parsePhoneNumber":58,"../build/parsePhoneNumberFromString":59,"../build/searchNumbers":63,"../build/searchPhoneNumbersInText":64}],69:[function(require,module,exports){
'use strict'

var min = require('./min/index.commonjs')
var metadata = require('./metadata.min.json')

function withMetadata(func, _arguments) {
	var args = Array.prototype.slice.call(_arguments)
	args.push(metadata)
	return func.apply(this, args)
}

// ES5 `require()` "default" "interoperability" hack.
// https://github.com/babel/babel/issues/2212#issuecomment-131827986
// An alternative approach:
// https://www.npmjs.com/package/babel-plugin-add-module-exports
exports = module.exports = min.parsePhoneNumberFromString
exports['default'] = min.parsePhoneNumberFromString

// `parsePhoneNumberFromString()` named export is now considered legacy:
// it has been promoted to a default export due to being too verbose.
exports.parsePhoneNumberFromString = min.parsePhoneNumberFromString

exports.ParseError = min.ParseError

// `parsePhoneNumber()` named export has been renamed to `parsePhoneNumberWithError()`.
exports.parsePhoneNumber = min.parsePhoneNumberWithError
exports.parsePhoneNumberWithError = min.parsePhoneNumberWithError

// `parse()` and `parseNumber()` functions are deprecated.
var parse_ = require('./build/parse').default
exports.parse = function parse() {
	return withMetadata(parse_, arguments)
}
exports.parseNumber = exports.parse

// `format()` and `formatNumber()` functions are deprecated.
var format_ = require('./build/format').default
exports.format = function format() {
	return withMetadata(format_, arguments)
}
exports.formatNumber = exports.format

// Deprecated.
var getNumberType_ = require('./build/getNumberType').default
exports.getNumberType = function getNumberType() {
	return withMetadata(getNumberType_, arguments)
}

// Deprecated.
var isPossibleNumber_ = require('./build/isPossibleNumber').default
exports.isPossibleNumber = function isPossibleNumber() {
	return withMetadata(isPossibleNumber_, arguments)
}

// Deprecated.
var isValidNumber_ = require('./build/validate').default
exports.isValidNumber = function isValidNumber() {
	return withMetadata(isValidNumber_, arguments)
}

// Deprecated.
var isValidNumberForRegion_ = require('./build/isValidNumberForRegion').default
exports.isValidNumberForRegion = function isValidNumberForRegion() {
	return withMetadata(isValidNumberForRegion_, arguments)
}

exports.getExampleNumber = min.getExampleNumber
exports.Metadata = min.Metadata

// Deprecated.
var findPhoneNumbers_ = require('./build/findPhoneNumbers').default
exports.findPhoneNumbers = function findPhoneNumbers() {
	return withMetadata(findPhoneNumbers_, arguments)
}

// Deprecated.
var searchPhoneNumbers_ = require('./build/findPhoneNumbers').searchPhoneNumbers
exports.searchPhoneNumbers = function searchPhoneNumbers() {
	return withMetadata(searchPhoneNumbers_, arguments)
}

// Deprecated.
var PhoneNumberSearch_ = require('./build/findPhoneNumbers_').PhoneNumberSearch
exports.PhoneNumberSearch = function PhoneNumberSearch(text, options) {
	return PhoneNumberSearch_.call(this, text, options, metadata)
}
exports.PhoneNumberSearch.prototype = Object.create(PhoneNumberSearch_.prototype, {})
exports.PhoneNumberSearch.prototype.constructor = exports.PhoneNumberSearch

// Deprecated.
exports.findNumbers = min.findNumbers
// Deprecated.
exports.searchNumbers = min.searchNumbers

exports.findPhoneNumbersInText = min.findPhoneNumbersInText
exports.searchPhoneNumbersInText = min.searchPhoneNumbersInText
exports.PhoneNumberMatcher = min.PhoneNumberMatcher

exports.AsYouType = min.AsYouType

exports.getCountries = min.getCountries
exports.getCountryCallingCode = min.getCountryCallingCode
exports.isSupportedCountry = min.isSupportedCountry
exports.getExtPrefix = min.getExtPrefix

exports.parseRFC3966 = min.parseRFC3966
exports.formatRFC3966 = min.formatRFC3966

// Deprecated: `DIGITS` were used by `react-phone-number-input`.
// Replaced by `parseDigits()`.
exports.DIGITS = require('./build/helpers/parseDigits').DIGITS
exports.DIGIT_PLACEHOLDER = min.DIGIT_PLACEHOLDER

// `getPhoneCode` name is deprecated
exports.getPhoneCode = min.getCountryCallingCode

exports.formatIncompletePhoneNumber = min.formatIncompletePhoneNumber
exports.parseIncompletePhoneNumber = min.parseIncompletePhoneNumber
exports.parsePhoneNumberCharacter = min.parsePhoneNumberCharacter
exports.parseDigits = min.parseDigits
},{"./build/findPhoneNumbers":23,"./build/findPhoneNumbers_":25,"./build/format":26,"./build/getNumberType":32,"./build/helpers/parseDigits":49,"./build/isPossibleNumber":51,"./build/isValidNumberForRegion":53,"./build/parse":56,"./build/validate":66,"./metadata.min.json":70,"./min/index.commonjs":71}],70:[function(require,module,exports){
module.exports={"version":4,"country_calling_codes":{"1":["US","AG","AI","AS","BB","BM","BS","CA","DM","DO","GD","GU","JM","KN","KY","LC","MP","MS","PR","SX","TC","TT","VC","VG","VI"],"7":["RU","KZ"],"20":["EG"],"27":["ZA"],"30":["GR"],"31":["NL"],"32":["BE"],"33":["FR"],"34":["ES"],"36":["HU"],"39":["IT","VA"],"40":["RO"],"41":["CH"],"43":["AT"],"44":["GB","GG","IM","JE"],"45":["DK"],"46":["SE"],"47":["NO","SJ"],"48":["PL"],"49":["DE"],"51":["PE"],"52":["MX"],"53":["CU"],"54":["AR"],"55":["BR"],"56":["CL"],"57":["CO"],"58":["VE"],"60":["MY"],"61":["AU","CC","CX"],"62":["ID"],"63":["PH"],"64":["NZ"],"65":["SG"],"66":["TH"],"81":["JP"],"82":["KR"],"84":["VN"],"86":["CN"],"90":["TR"],"91":["IN"],"92":["PK"],"93":["AF"],"94":["LK"],"95":["MM"],"98":["IR"],"211":["SS"],"212":["MA","EH"],"213":["DZ"],"216":["TN"],"218":["LY"],"220":["GM"],"221":["SN"],"222":["MR"],"223":["ML"],"224":["GN"],"225":["CI"],"226":["BF"],"227":["NE"],"228":["TG"],"229":["BJ"],"230":["MU"],"231":["LR"],"232":["SL"],"233":["GH"],"234":["NG"],"235":["TD"],"236":["CF"],"237":["CM"],"238":["CV"],"239":["ST"],"240":["GQ"],"241":["GA"],"242":["CG"],"243":["CD"],"244":["AO"],"245":["GW"],"246":["IO"],"247":["AC"],"248":["SC"],"249":["SD"],"250":["RW"],"251":["ET"],"252":["SO"],"253":["DJ"],"254":["KE"],"255":["TZ"],"256":["UG"],"257":["BI"],"258":["MZ"],"260":["ZM"],"261":["MG"],"262":["RE","YT"],"263":["ZW"],"264":["NA"],"265":["MW"],"266":["LS"],"267":["BW"],"268":["SZ"],"269":["KM"],"290":["SH","TA"],"291":["ER"],"297":["AW"],"298":["FO"],"299":["GL"],"350":["GI"],"351":["PT"],"352":["LU"],"353":["IE"],"354":["IS"],"355":["AL"],"356":["MT"],"357":["CY"],"358":["FI","AX"],"359":["BG"],"370":["LT"],"371":["LV"],"372":["EE"],"373":["MD"],"374":["AM"],"375":["BY"],"376":["AD"],"377":["MC"],"378":["SM"],"380":["UA"],"381":["RS"],"382":["ME"],"383":["XK"],"385":["HR"],"386":["SI"],"387":["BA"],"389":["MK"],"420":["CZ"],"421":["SK"],"423":["LI"],"500":["FK"],"501":["BZ"],"502":["GT"],"503":["SV"],"504":["HN"],"505":["NI"],"506":["CR"],"507":["PA"],"508":["PM"],"509":["HT"],"590":["GP","BL","MF"],"591":["BO"],"592":["GY"],"593":["EC"],"594":["GF"],"595":["PY"],"596":["MQ"],"597":["SR"],"598":["UY"],"599":["CW","BQ"],"670":["TL"],"672":["NF"],"673":["BN"],"674":["NR"],"675":["PG"],"676":["TO"],"677":["SB"],"678":["VU"],"679":["FJ"],"680":["PW"],"681":["WF"],"682":["CK"],"683":["NU"],"685":["WS"],"686":["KI"],"687":["NC"],"688":["TV"],"689":["PF"],"690":["TK"],"691":["FM"],"692":["MH"],"850":["KP"],"852":["HK"],"853":["MO"],"855":["KH"],"856":["LA"],"880":["BD"],"886":["TW"],"960":["MV"],"961":["LB"],"962":["JO"],"963":["SY"],"964":["IQ"],"965":["KW"],"966":["SA"],"967":["YE"],"968":["OM"],"970":["PS"],"971":["AE"],"972":["IL"],"973":["BH"],"974":["QA"],"975":["BT"],"976":["MN"],"977":["NP"],"992":["TJ"],"993":["TM"],"994":["AZ"],"995":["GE"],"996":["KG"],"998":["UZ"]},"countries":{"AC":["247","00","(?:[01589]\\d|[46])\\d{4}",[5,6]],"AD":["376","00","(?:1|6\\d)\\d{7}|[135-9]\\d{5}",[6,8,9],[["(\\d{3})(\\d{3})","$1 $2",["[135-9]"]],["(\\d{4})(\\d{4})","$1 $2",["1"]],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["6"]]]],"AE":["971","00","(?:[4-7]\\d|9[0-689])\\d{7}|800\\d{2,9}|[2-4679]\\d{7}",[5,6,7,8,9,10,11,12],[["(\\d{3})(\\d{2,9})","$1 $2",["60|8"]],["(\\d)(\\d{3})(\\d{4})","$1 $2 $3",["[236]|[479][2-8]"],"0$1"],["(\\d{3})(\\d)(\\d{5})","$1 $2 $3",["[479]"]],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["5"],"0$1"]],"0"],"AF":["93","00","[2-7]\\d{8}",[9],[["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["[2-7]"],"0$1"]],"0"],"AG":["1","011","(?:268|[58]\\d\\d|900)\\d{7}",[10],0,"1",0,"1|([457]\\d{6})$","268$1",0,"268"],"AI":["1","011","(?:264|[58]\\d\\d|900)\\d{7}",[10],0,"1",0,"1|([2457]\\d{6})$","264$1",0,"264"],"AL":["355","00","(?:700\\d\\d|900)\\d{3}|8\\d{5,7}|(?:[2-5]|6\\d)\\d{7}",[6,7,8,9],[["(\\d{3})(\\d{3,4})","$1 $2",["80|9"],"0$1"],["(\\d)(\\d{3})(\\d{4})","$1 $2 $3",["4[2-6]"],"0$1"],["(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["[2358][2-5]|4"],"0$1"],["(\\d{3})(\\d{5})","$1 $2",["[23578]"],"0$1"],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["6"],"0$1"]],"0"],"AM":["374","00","(?:[1-489]\\d|55|60|77)\\d{6}",[8],[["(\\d{3})(\\d{2})(\\d{3})","$1 $2 $3",["[89]0"],"0 $1"],["(\\d{3})(\\d{5})","$1 $2",["2|3[12]"],"(0$1)"],["(\\d{2})(\\d{6})","$1 $2",["1|47"],"(0$1)"],["(\\d{2})(\\d{6})","$1 $2",["[3-9]"],"0$1"]],"0"],"AO":["244","00","[29]\\d{8}",[9],[["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[29]"]]]],"AR":["54","00","11\\d{8}|(?:[2368]|9\\d)\\d{9}",[10,11],[["(\\d{4})(\\d{2})(\\d{4})","$1 $2-$3",["2(?:2[024-9]|3[0-59]|47|6[245]|9[02-8])|3(?:3[28]|4[03-9]|5[2-46-8]|7[1-578]|8[2-9])","2(?:[23]02|6(?:[25]|4[6-8])|9(?:[02356]|4[02568]|72|8[23]))|3(?:3[28]|4(?:[04679]|3[5-8]|5[4-68]|8[2379])|5(?:[2467]|3[237]|8[2-5])|7[1-578]|8(?:[2469]|3[2578]|5[4-8]|7[36-8]|8[5-8]))|2(?:2[24-9]|3[1-59]|47)","2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3[78]|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8[23])|7[1-578]|8(?:[2469]|3[278]|5[56][46]|86[3-6]))|2(?:2[24-9]|3[1-59]|47)|38(?:[58][78]|7[378])|3(?:4[35][56]|58[45]|8(?:[38]5|54|76))[4-6]","2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3(?:5(?:4[0-25689]|[56])|[78])|58|8[2379])|5(?:[2467]|3[237]|8(?:[23]|4(?:[45]|60)|5(?:4[0-39]|5|64)))|7[1-578]|8(?:[2469]|3[278]|54(?:4|5[13-7]|6[89])|86[3-6]))|2(?:2[24-9]|3[1-59]|47)|38(?:[58][78]|7[378])|3(?:454|85[56])[46]|3(?:4(?:36|5[56])|8(?:[38]5|76))[4-6]"],"0$1",1],["(\\d{2})(\\d{4})(\\d{4})","$1 $2-$3",["1"],"0$1",1],["(\\d{3})(\\d{3})(\\d{4})","$1-$2-$3",["[68]"],"0$1"],["(\\d{3})(\\d{3})(\\d{4})","$1 $2-$3",["[23]"],"0$1",1],["(\\d)(\\d{4})(\\d{2})(\\d{4})","$2 15-$3-$4",["9(?:2[2-469]|3[3-578])","9(?:2(?:2[024-9]|3[0-59]|47|6[245]|9[02-8])|3(?:3[28]|4[03-9]|5[2-46-8]|7[1-578]|8[2-9]))","9(?:2(?:[23]02|6(?:[25]|4[6-8])|9(?:[02356]|4[02568]|72|8[23]))|3(?:3[28]|4(?:[04679]|3[5-8]|5[4-68]|8[2379])|5(?:[2467]|3[237]|8[2-5])|7[1-578]|8(?:[2469]|3[2578]|5[4-8]|7[36-8]|8[5-8])))|92(?:2[24-9]|3[1-59]|47)","9(?:2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3[78]|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8[23])|7[1-578]|8(?:[2469]|3[278]|5(?:[56][46]|[78])|7[378]|8(?:6[3-6]|[78]))))|92(?:2[24-9]|3[1-59]|47)|93(?:4[35][56]|58[45]|8(?:[38]5|54|76))[4-6]","9(?:2(?:[23]02|6(?:[25]|4(?:64|[78]))|9(?:[02356]|4(?:[0268]|5[2-6])|72|8[23]))|3(?:3[28]|4(?:[04679]|3(?:5(?:4[0-25689]|[56])|[78])|5(?:4[46]|8)|8[2379])|5(?:[2467]|3[237]|8(?:[23]|4(?:[45]|60)|5(?:4[0-39]|5|64)))|7[1-578]|8(?:[2469]|3[278]|5(?:4(?:4|5[13-7]|6[89])|[56][46]|[78])|7[378]|8(?:6[3-6]|[78]))))|92(?:2[24-9]|3[1-59]|47)|93(?:4(?:36|5[56])|8(?:[38]5|76))[4-6]"],"0$1",0,"$1 $2 $3-$4"],["(\\d)(\\d{2})(\\d{4})(\\d{4})","$2 15-$3-$4",["91"],"0$1",0,"$1 $2 $3-$4"],["(\\d)(\\d{3})(\\d{3})(\\d{4})","$2 15-$3-$4",["9"],"0$1",0,"$1 $2 $3-$4"]],"0",0,"0?(?:(11|2(?:2(?:02?|[13]|2[13-79]|4[1-6]|5[2457]|6[124-8]|7[1-4]|8[13-6]|9[1267])|3(?:02?|1[467]|2[03-6]|3[13-8]|[49][2-6]|5[2-8]|[67])|4(?:7[3-578]|9)|6(?:[0136]|2[24-6]|4[6-8]?|5[15-8])|80|9(?:0[1-3]|[19]|2\\d|3[1-6]|4[02568]?|5[2-4]|6[2-46]|72?|8[23]?))|3(?:3(?:2[79]|6|8[2578])|4(?:0[0-24-9]|[12]|3[5-8]?|4[24-7]|5[4-68]?|6[02-9]|7[126]|8[2379]?|9[1-36-8])|5(?:1|2[1245]|3[237]?|4[1-46-9]|6[2-4]|7[1-6]|8[2-5]?)|6[24]|7(?:[069]|1[1568]|2[15]|3[145]|4[13]|5[14-8]|7[2-57]|8[126])|8(?:[01]|2[15-7]|3[2578]?|4[13-6]|5[4-8]?|6[1-357-9]|7[36-8]?|8[5-8]?|9[124])))15)?","9$1"],"AS":["1","011","(?:[58]\\d\\d|684|900)\\d{7}",[10],0,"1",0,"1|([267]\\d{6})$","684$1",0,"684"],"AT":["43","00","1\\d{3,12}|2\\d{6,12}|43(?:(?:0\\d|5[02-9])\\d{3,9}|2\\d{4,5}|[3467]\\d{4}|8\\d{4,6}|9\\d{4,7})|5\\d{4,12}|8\\d{7,12}|9\\d{8,12}|(?:[367]\\d|4[0-24-9])\\d{4,11}",[4,5,6,7,8,9,10,11,12,13],[["(\\d)(\\d{3,12})","$1 $2",["1(?:11|[2-9])"],"0$1"],["(\\d{3})(\\d{2})","$1 $2",["517"],"0$1"],["(\\d{2})(\\d{3,5})","$1 $2",["5[079]"],"0$1"],["(\\d{3})(\\d{3,10})","$1 $2",["(?:31|4)6|51|6(?:5[0-3579]|[6-9])|7(?:20|32|8)|[89]"],"0$1"],["(\\d{4})(\\d{3,9})","$1 $2",["[2-467]|5[2-6]"],"0$1"],["(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["5"],"0$1"],["(\\d{2})(\\d{4})(\\d{4,7})","$1 $2 $3",["5"],"0$1"]],"0"],"AU":["61","001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011","1(?:[0-79]\\d{7,8}|8[0-24-9]\\d{7})|[2-478]\\d{8}|1\\d{4,7}",[5,6,7,8,9,10],[["(\\d{2})(\\d{3,4})","$1 $2",["16"],"0$1"],["(\\d{2})(\\d{3})(\\d{2,4})","$1 $2 $3",["16"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["14|4"],"0$1"],["(\\d)(\\d{4})(\\d{4})","$1 $2 $3",["[2378]"],"(0$1)"],["(\\d{4})(\\d{3})(\\d{3})","$1 $2 $3",["1(?:30|[89])"]]],"0",0,"0|(183[12])",0,0,0,[["8(?:51(?:0(?:0[03-9]|[12479]\\d|3[2-9]|5[0-8]|6[1-9]|8[0-7])|1(?:[0235689]\\d|1[0-69]|4[0-589]|7[0-47-9])|2(?:0[0-7]|3[2-4]|[4-6]\\d))|91(?:[0-57-9]\\d|6[0135-9])\\d)\\d{3}|(?:2(?:[0-26-9]\\d|3[0-8]|4[02-9]|5[0135-9])|3(?:[0-3589]\\d|4[0-578]|6[1-9]|7[0-35-9])|7(?:[013-57-9]\\d|2[0-8])|8(?:6[0-8]|[78]\\d|9[02-9]))\\d{6}",[9]],["4(?:83[0-38]|93[0-4])\\d{5}|4(?:[0-3]\\d|4[047-9]|5[0-25-9]|6[06-9]|7[02-9]|8[0-24-9]|9[0-27-9])\\d{6}",[9]],["180(?:0\\d{3}|2)\\d{3}",[7,10]],["190[0-26]\\d{6}",[10]],0,0,0,["163\\d{2,6}",[5,6,7,8,9]],["14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}",[9]],["13(?:00\\d{3}|45[0-4])\\d{3}|13\\d{4}",[6,8,10]]],"0011"],"AW":["297","00","(?:[25-79]\\d\\d|800)\\d{4}",[7],[["(\\d{3})(\\d{4})","$1 $2",["[25-9]"]]]],"AX":["358","00|99(?:[01469]|5(?:[14]1|3[23]|5[59]|77|88|9[09]))","2\\d{4,9}|35\\d{4,5}|(?:60\\d\\d|800)\\d{4,6}|7\\d{5,11}|(?:[14]\\d|3[0-46-9]|50)\\d{4,8}",[5,6,7,8,9,10,11,12],0,"0",0,0,0,0,"18",0,"00"],"AZ":["994","00","365\\d{6}|(?:[124579]\\d|60|88)\\d{7}",[9],[["(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["90"],"0$1"],["(\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["1[28]|2|365|46","1[28]|2|365|46","1[28]|2|365(?:[0-46-9]|5[0-35-9])|46"],"(0$1)"],["(\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[13-9]"],"0$1"]],"0"],"BA":["387","00","6\\d{8}|(?:[35689]\\d|49|70)\\d{6}",[8,9],[["(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["6[1-3]|[7-9]"],"0$1"],["(\\d{2})(\\d{3})(\\d{3})","$1 $2-$3",["[3-5]|6[56]"],"0$1"],["(\\d{2})(\\d{2})(\\d{2})(\\d{3})","$1 $2 $3 $4",["6"],"0$1"]],"0"],"BB":["1","011","(?:246|[58]\\d\\d|900)\\d{7}",[10],0,"1",0,"1|([2-9]\\d{6})$","246$1",0,"246"],"BD":["880","00","1\\d{9}|2\\d{7,8}|88\\d{4,6}|(?:8[0-79]|9\\d)\\d{4,8}|(?:[346]\\d|[57])\\d{5,8}",[6,7,8,9,10],[["(\\d{2})(\\d{4,6})","$1-$2",["31[5-8]|[459]1"],"0$1"],["(\\d{3})(\\d{3,7})","$1-$2",["3(?:[67]|8[013-9])|4(?:6[168]|7|[89][18])|5(?:6[128]|9)|6(?:28|4[14]|5)|7[2-589]|8(?:0[014-9]|[12])|9[358]|(?:3[2-5]|4[235]|5[2-578]|6[0389]|76|8[3-7]|9[24])1|(?:44|66)[01346-9]"],"0$1"],["(\\d{4})(\\d{3,6})","$1-$2",["[13-9]"],"0$1"],["(\\d)(\\d{7,8})","$1-$2",["2"],"0$1"]],"0"],"BE":["32","00","4\\d{8}|[1-9]\\d{7}",[8,9],[["(\\d{3})(\\d{2})(\\d{3})","$1 $2 $3",["(?:80|9)0"],"0$1"],["(\\d)(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[239]|4[23]"],"0$1"],["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[15-8]"],"0$1"],["(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["4"],"0$1"]],"0"],"BF":["226","00","[025-7]\\d{7}",[8],[["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[025-7]"]]]],"BG":["359","00","[2-7]\\d{6,7}|[89]\\d{6,8}|2\\d{5}",[6,7,8,9],[["(\\d)(\\d)(\\d{2})(\\d{2})","$1 $2 $3 $4",["2"],"0$1"],["(\\d{3})(\\d{4})","$1 $2",["43[1-6]|70[1-9]"],"0$1"],["(\\d)(\\d{3})(\\d{3,4})","$1 $2 $3",["2"],"0$1"],["(\\d{2})(\\d{3})(\\d{2,3})","$1 $2 $3",["[356]|4[124-7]|7[1-9]|8[1-6]|9[1-7]"],"0$1"],["(\\d{3})(\\d{2})(\\d{3})","$1 $2 $3",["(?:70|8)0"],"0$1"],["(\\d{3})(\\d{3})(\\d{2})","$1 $2 $3",["43[1-7]|7"],"0$1"],["(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["[48]|9[08]"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["9"],"0$1"]],"0"],"BH":["973","00","[136-9]\\d{7}",[8],[["(\\d{4})(\\d{4})","$1 $2",["[13679]|8[047]"]]]],"BI":["257","00","(?:[267]\\d|31)\\d{6}",[8],[["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[2367]"]]]],"BJ":["229","00","(?:[2689]\\d|51)\\d{6}",[8],[["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[25689]"]]]],"BL":["590","00","(?:590|69\\d|976)\\d{6}",[9],0,"0",0,0,0,0,0,[["590(?:2[7-9]|5[12]|87)\\d{4}"],["69(?:0\\d\\d|1(?:2[29]|3[0-5]))\\d{4}"],0,0,0,0,0,0,["976[01]\\d{5}"]]],"BM":["1","011","(?:441|[58]\\d\\d|900)\\d{7}",[10],0,"1",0,"1|([2-8]\\d{6})$","441$1",0,"441"],"BN":["673","00","[2-578]\\d{6}",[7],[["(\\d{3})(\\d{4})","$1 $2",["[2-578]"]]]],"BO":["591","00(?:1\\d)?","(?:[2-467]\\d\\d|8001)\\d{5}",[8,9],[["(\\d)(\\d{7})","$1 $2",["[23]|4[46]"]],["(\\d{8})","$1",["[67]"]],["(\\d{3})(\\d{2})(\\d{4})","$1 $2 $3",["8"]]],"0",0,"0(1\\d)?"],"BQ":["599","00","(?:[34]1|7\\d)\\d{5}",[7],0,0,0,0,0,0,"[347]"],"BR":["55","00(?:1[245]|2[1-35]|31|4[13]|[56]5|99)","(?:[1-46-9]\\d\\d|5(?:[0-46-9]\\d|5[0-24679]))\\d{8}|[1-9]\\d{9}|[3589]\\d{8}|[34]\\d{7}",[8,9,10,11],[["(\\d{4})(\\d{4})","$1-$2",["300|4(?:0[02]|37)","4(?:02|37)0|[34]00"]],["(\\d{3})(\\d{2,3})(\\d{4})","$1 $2 $3",["(?:[358]|90)0"],"0$1"],["(\\d{2})(\\d{4})(\\d{4})","$1 $2-$3",["(?:[14689][1-9]|2[12478]|3[1-578]|5[13-5]|7[13-579])[2-57]"],"($1)"],["(\\d{2})(\\d{5})(\\d{4})","$1 $2-$3",["[16][1-9]|[2-57-9]"],"($1)"]],"0",0,"(?:0|90)(?:(1[245]|2[1-35]|31|4[13]|[56]5|99)(\\d{10,11}))?","$2"],"BS":["1","011","(?:242|[58]\\d\\d|900)\\d{7}",[10],0,"1",0,"1|([3-8]\\d{6})$","242$1",0,"242"],"BT":["975","00","[17]\\d{7}|[2-8]\\d{6}",[7,8],[["(\\d)(\\d{3})(\\d{3})","$1 $2 $3",["[2-68]|7[246]"]],["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["1[67]|7"]]]],"BW":["267","00","(?:0800|(?:[37]|800)\\d)\\d{6}|(?:[2-6]\\d|90)\\d{5}",[7,8,10],[["(\\d{2})(\\d{5})","$1 $2",["90"]],["(\\d{3})(\\d{4})","$1 $2",["[24-6]|3[15-79]"]],["(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["[37]"]],["(\\d{4})(\\d{3})(\\d{3})","$1 $2 $3",["0"]],["(\\d{3})(\\d{4})(\\d{3})","$1 $2 $3",["8"]]]],"BY":["375","810","(?:[12]\\d|33|44|902)\\d{7}|8(?:0[0-79]\\d{5,7}|[1-7]\\d{9})|8(?:1[0-489]|[5-79]\\d)\\d{7}|8[1-79]\\d{6,7}|8[0-79]\\d{5}|8\\d{5}",[6,7,8,9,10,11],[["(\\d{3})(\\d{3})","$1 $2",["800"],"8 $1"],["(\\d{3})(\\d{2})(\\d{2,4})","$1 $2 $3",["800"],"8 $1"],["(\\d{4})(\\d{2})(\\d{3})","$1 $2-$3",["1(?:5[169]|6[3-5]|7[179])|2(?:1[35]|2[34]|3[3-5])","1(?:5[169]|6(?:3[1-3]|4|5[125])|7(?:1[3-9]|7[0-24-6]|9[2-7]))|2(?:1[35]|2[34]|3[3-5])"],"8 0$1"],["(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2-$3-$4",["1(?:[56]|7[467])|2[1-3]"],"8 0$1"],["(\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1 $2-$3-$4",["[1-4]"],"8 0$1"],["(\\d{3})(\\d{3,4})(\\d{4})","$1 $2 $3",["[89]"],"8 $1"]],"8",0,"0|80?",0,0,0,0,"8~10"],"BZ":["501","00","(?:0800\\d|[2-8])\\d{6}",[7,11],[["(\\d{3})(\\d{4})","$1-$2",["[2-8]"]],["(\\d)(\\d{3})(\\d{4})(\\d{3})","$1-$2-$3-$4",["0"]]]],"CA":["1","011","(?:[2-8]\\d|90)\\d{8}",[10],0,"1",0,0,0,0,0,[["(?:2(?:04|[23]6|[48]9|50)|3(?:06|43|6[57])|4(?:03|1[68]|3[178]|50)|5(?:06|1[49]|48|79|8[17])|6(?:04|13|39|47|72)|7(?:0[59]|78|8[02])|8(?:[06]7|19|25|73)|90[25])[2-9]\\d{6}"],[""],["8(?:00|33|44|55|66|77|88)[2-9]\\d{6}"],["900[2-9]\\d{6}"],["52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|(?:5(?:00|2[12]|33|44|66|77|88)|622)[2-9]\\d{6}"],0,0,0,["600[2-9]\\d{6}"]]],"CC":["61","001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011","1(?:[0-79]\\d|8[0-24-9])\\d{7}|[148]\\d{8}|1\\d{5,7}",[6,7,8,9,10],0,"0",0,"0|([59]\\d{7})$","8$1",0,0,[["8(?:51(?:0(?:02|31|60|89)|118)|91(?:0(?:1[0-2]|29)|1(?:[28]2|50|79)|2(?:10|64)|3(?:[06]8|22)|4[29]8|62\\d|70[23]|959))\\d{3}",[9]],["4(?:83[0-38]|93[0-4])\\d{5}|4(?:[0-3]\\d|4[047-9]|5[0-25-9]|6[06-9]|7[02-9]|8[0-24-9]|9[0-27-9])\\d{6}",[9]],["180(?:0\\d{3}|2)\\d{3}",[7,10]],["190[0-26]\\d{6}",[10]],0,0,0,0,["14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}",[9]],["13(?:00\\d{3}|45[0-4])\\d{3}|13\\d{4}",[6,8,10]]],"0011"],"CD":["243","00","[189]\\d{8}|[1-68]\\d{6}",[7,9],[["(\\d{2})(\\d{2})(\\d{3})","$1 $2 $3",["88"],"0$1"],["(\\d{2})(\\d{5})","$1 $2",["[1-6]"],"0$1"],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["1"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[89]"],"0$1"]],"0"],"CF":["236","00","(?:[27]\\d{3}|8776)\\d{4}",[8],[["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[278]"]]]],"CG":["242","00","222\\d{6}|(?:0\\d|80)\\d{7}",[9],[["(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["801"]],["(\\d)(\\d{4})(\\d{4})","$1 $2 $3",["8"]],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["[02]"]]]],"CH":["41","00","8\\d{11}|[2-9]\\d{8}",[9],[["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["8[047]|90"],"0$1"],["(\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[2-79]|81"],"0$1"],["(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4 $5",["8"],"0$1"]],"0"],"CI":["225","00","[02]\\d{9}|[02-9]\\d{7}",[8,10],[["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[03-9]|2[0-4]"]],["(\\d{2})(\\d{2})(\\d)(\\d{5})","$1 $2 $3 $4",["2"]],["(\\d{2})(\\d{2})(\\d{2})(\\d{4})","$1 $2 $3 $4",["0"]]]],"CK":["682","00","[2-578]\\d{4}",[5],[["(\\d{2})(\\d{3})","$1 $2",["[2-578]"]]]],"CL":["56","(?:0|1(?:1[0-69]|2[02-5]|5[13-58]|69|7[0167]|8[018]))0","12300\\d{6}|6\\d{9,10}|[2-9]\\d{8}",[9,10,11],[["(\\d{5})(\\d{4})","$1 $2",["219","2196"],"($1)"],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["44"]],["(\\d)(\\d{4})(\\d{4})","$1 $2 $3",["2[1-3]"],"($1)"],["(\\d)(\\d{4})(\\d{4})","$1 $2 $3",["9[2-9]"]],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["3[2-5]|[47]|5[1-3578]|6[13-57]|8(?:0[1-9]|[1-9])"],"($1)"],["(\\d{3})(\\d{3})(\\d{3,4})","$1 $2 $3",["60|8"]],["(\\d{4})(\\d{3})(\\d{4})","$1 $2 $3",["1"]],["(\\d{3})(\\d{3})(\\d{2})(\\d{3})","$1 $2 $3 $4",["60"]]]],"CM":["237","00","(?:[26]\\d\\d|88)\\d{6}",[8,9],[["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["88"]],["(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4 $5",["[26]"]]]],"CN":["86","00|1(?:[12]\\d|79)\\d\\d00","1[127]\\d{8,9}|2\\d{9}(?:\\d{2})?|[12]\\d{6,7}|86\\d{6}|(?:1[03-689]\\d|6)\\d{7,9}|(?:[3-579]\\d|8[0-57-9])\\d{6,9}",[7,8,9,10,11,12],[["(\\d{2})(\\d{5,6})","$1 $2",["(?:10|2[0-57-9])[19]","(?:10|2[0-57-9])(?:10|9[56])","(?:10|2[0-57-9])(?:100|9[56])"],"0$1"],["(\\d{3})(\\d{5,6})","$1 $2",["3(?:[157]|35|49|9[1-68])|4(?:[17]|2[179]|6[47-9]|8[23])|5(?:[1357]|2[37]|4[36]|6[1-46]|80)|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]|4[13]|5[1-5])|(?:4[35]|59|85)[1-9]","(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[1-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))[19]","85[23](?:10|95)|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[14-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:10|9[56])","85[23](?:100|95)|(?:3(?:[157]\\d|35|49|9[1-68])|4(?:[17]\\d|2[179]|[35][1-9]|6[47-9]|8[23])|5(?:[1357]\\d|2[37]|4[36]|6[1-46]|80|9[1-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]\\d|2[248]|3[014-9]|4[3-6]|6[023689])|8(?:1[236-8]|2[5-7]|[37]\\d|5[14-9]|8[36-8]|9[1-8])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:100|9[56])"],"0$1"],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["(?:4|80)0"]],["(\\d{2})(\\d{4})(\\d{4})","$1 $2 $3",["10|2(?:[02-57-9]|1[1-9])","10|2(?:[02-57-9]|1[1-9])","10[0-79]|2(?:[02-57-9]|1[1-79])|(?:10|21)8(?:0[1-9]|[1-9])"],"0$1",1],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["3(?:[3-59]|7[02-68])|4(?:[26-8]|3[3-9]|5[2-9])|5(?:3[03-9]|[468]|7[028]|9[2-46-9])|6|7(?:[0-247]|3[04-9]|5[0-4689]|6[2368])|8(?:[1-358]|9[1-7])|9(?:[013479]|5[1-5])|(?:[34]1|55|79|87)[02-9]"],"0$1",1],["(\\d{3})(\\d{7,8})","$1 $2",["9"]],["(\\d{4})(\\d{3})(\\d{4})","$1 $2 $3",["80"],"0$1",1],["(\\d{3})(\\d{4})(\\d{4})","$1 $2 $3",["[3-578]"],"0$1",1],["(\\d{3})(\\d{4})(\\d{4})","$1 $2 $3",["1[3-9]"]],["(\\d{2})(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3 $4",["[12]"],"0$1",1]],"0",0,"0|(1(?:[12]\\d|79)\\d\\d)",0,0,0,0,"00"],"CO":["57","00(?:4(?:[14]4|56)|[579])","(?:1\\d|3)\\d{9}|[124-8]\\d{7}",[8,10,11],[["(\\d)(\\d{7})","$1 $2",["[14][2-9]|[25-8]"],"($1)"],["(\\d{3})(\\d{7})","$1 $2",["3"]],["(\\d)(\\d{3})(\\d{7})","$1-$2-$3",["1"],"0$1",0,"$1 $2 $3"]],"0",0,"0([3579]|4(?:[14]4|56))?"],"CR":["506","00","(?:8\\d|90)\\d{8}|(?:[24-8]\\d{3}|3005)\\d{4}",[8,10],[["(\\d{4})(\\d{4})","$1 $2",["[2-7]|8[3-9]"]],["(\\d{3})(\\d{3})(\\d{4})","$1-$2-$3",["[89]"]]],0,0,"(19(?:0[0-2468]|1[09]|20|66|77|99))"],"CU":["53","119","[27]\\d{6,7}|[34]\\d{5,7}|(?:5|8\\d\\d)\\d{7}",[6,7,8,10],[["(\\d{2})(\\d{4,6})","$1 $2",["2[1-4]|[34]"],"(0$1)"],["(\\d)(\\d{6,7})","$1 $2",["7"],"(0$1)"],["(\\d)(\\d{7})","$1 $2",["5"],"0$1"],["(\\d{3})(\\d{7})","$1 $2",["8"],"0$1"]],"0"],"CV":["238","0","(?:[2-59]\\d\\d|800)\\d{4}",[7],[["(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3",["[2-589]"]]]],"CW":["599","00","(?:[34]1|60|(?:7|9\\d)\\d)\\d{5}",[7,8],[["(\\d{3})(\\d{4})","$1 $2",["[3467]"]],["(\\d)(\\d{3})(\\d{4})","$1 $2 $3",["9[4-8]"]]],0,0,0,0,0,"[69]"],"CX":["61","001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011","1(?:[0-79]\\d|8[0-24-9])\\d{7}|[148]\\d{8}|1\\d{5,7}",[6,7,8,9,10],0,"0",0,"0|([59]\\d{7})$","8$1",0,0,[["8(?:51(?:0(?:01|30|59|88)|1(?:17|46|75)|235)|91(?:00[6-9]|1(?:[28]1|49|78)|2(?:09|63)|3(?:12|26|75)|4(?:56|97)|64\\d|7(?:0[01]|1[0-2])|958))\\d{3}",[9]],["4(?:83[0-38]|93[0-4])\\d{5}|4(?:[0-3]\\d|4[047-9]|5[0-25-9]|6[06-9]|7[02-9]|8[0-24-9]|9[0-27-9])\\d{6}",[9]],["180(?:0\\d{3}|2)\\d{3}",[7,10]],["190[0-26]\\d{6}",[10]],0,0,0,0,["14(?:5(?:1[0458]|[23][458])|71\\d)\\d{4}",[9]],["13(?:00\\d{3}|45[0-4])\\d{3}|13\\d{4}",[6,8,10]]],"0011"],"CY":["357","00","(?:[279]\\d|[58]0)\\d{6}",[8],[["(\\d{2})(\\d{6})","$1 $2",["[257-9]"]]]],"CZ":["420","00","(?:[2-578]\\d|60)\\d{7}|9\\d{8,11}",[9],[["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[2-8]|9[015-7]"]],["(\\d{2})(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3 $4",["9"]],["(\\d{3})(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3 $4",["9"]]]],"DE":["49","00","[2579]\\d{5,14}|49(?:[34]0|69|8\\d)\\d\\d?|49(?:37|49|60|7[089]|9\\d)\\d{1,3}|49(?:[12]\\d|3[2-689]|7[1-7])\\d{1,8}|(?:1|[368]\\d|4[0-8])\\d{3,13}|49(?:[05]\\d|31|[46][1-8])\\d{1,9}",[4,5,6,7,8,9,10,11,12,13,14,15],[["(\\d{2})(\\d{3,13})","$1 $2",["3[02]|40|[68]9"],"0$1"],["(\\d{3})(\\d{3,12})","$1 $2",["2(?:0[1-389]|1[124]|2[18]|3[14])|3(?:[35-9][15]|4[015])|906|(?:2[4-9]|4[2-9]|[579][1-9]|[68][1-8])1","2(?:0[1-389]|12[0-8])|3(?:[35-9][15]|4[015])|906|2(?:[13][14]|2[18])|(?:2[4-9]|4[2-9]|[579][1-9]|[68][1-8])1"],"0$1"],["(\\d{4})(\\d{2,11})","$1 $2",["[24-6]|3(?:[3569][02-46-9]|4[2-4679]|7[2-467]|8[2-46-8])|70[2-8]|8(?:0[2-9]|[1-8])|90[7-9]|[79][1-9]","[24-6]|3(?:3(?:0[1-467]|2[127-9]|3[124578]|7[1257-9]|8[1256]|9[145])|4(?:2[135]|4[13578]|9[1346])|5(?:0[14]|2[1-3589]|6[1-4]|7[13468]|8[13568])|6(?:2[1-489]|3[124-6]|6[13]|7[12579]|8[1-356]|9[135])|7(?:2[1-7]|4[145]|6[1-5]|7[1-4])|8(?:21|3[1468]|6|7[1467]|8[136])|9(?:0[12479]|2[1358]|4[134679]|6[1-9]|7[136]|8[147]|9[1468]))|70[2-8]|8(?:0[2-9]|[1-8])|90[7-9]|[79][1-9]|3[68]4[1347]|3(?:47|60)[1356]|3(?:3[46]|46|5[49])[1246]|3[4579]3[1357]"],"0$1"],["(\\d{3})(\\d{4})","$1 $2",["138"],"0$1"],["(\\d{5})(\\d{2,10})","$1 $2",["3"],"0$1"],["(\\d{3})(\\d{5,11})","$1 $2",["181"],"0$1"],["(\\d{3})(\\d)(\\d{4,10})","$1 $2 $3",["1(?:3|80)|9"],"0$1"],["(\\d{3})(\\d{7,8})","$1 $2",["1[67]"],"0$1"],["(\\d{3})(\\d{7,12})","$1 $2",["8"],"0$1"],["(\\d{5})(\\d{6})","$1 $2",["185","1850","18500"],"0$1"],["(\\d{3})(\\d{4})(\\d{4})","$1 $2 $3",["7"],"0$1"],["(\\d{4})(\\d{7})","$1 $2",["18[68]"],"0$1"],["(\\d{5})(\\d{6})","$1 $2",["15[0568]"],"0$1"],["(\\d{4})(\\d{7})","$1 $2",["15[1279]"],"0$1"],["(\\d{3})(\\d{8})","$1 $2",["18"],"0$1"],["(\\d{3})(\\d{2})(\\d{7,8})","$1 $2 $3",["1(?:6[023]|7)"],"0$1"],["(\\d{4})(\\d{2})(\\d{7})","$1 $2 $3",["15[279]"],"0$1"],["(\\d{3})(\\d{2})(\\d{8})","$1 $2 $3",["15"],"0$1"]],"0"],"DJ":["253","00","(?:2\\d|77)\\d{6}",[8],[["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[27]"]]]],"DK":["45","00","[2-9]\\d{7}",[8],[["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[2-9]"]]]],"DM":["1","011","(?:[58]\\d\\d|767|900)\\d{7}",[10],0,"1",0,"1|([2-7]\\d{6})$","767$1",0,"767"],"DO":["1","011","(?:[58]\\d\\d|900)\\d{7}",[10],0,"1",0,0,0,0,"8001|8[024]9"],"DZ":["213","00","(?:[1-4]|[5-79]\\d|80)\\d{7}",[8,9],[["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[1-4]"],"0$1"],["(\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["9"],"0$1"],["(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[5-8]"],"0$1"]],"0"],"EC":["593","00","1\\d{9,10}|(?:[2-7]|9\\d)\\d{7}",[8,9,10,11],[["(\\d)(\\d{3})(\\d{4})","$1 $2-$3",["[2-7]"],"(0$1)",0,"$1-$2-$3"],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["9"],"0$1"],["(\\d{4})(\\d{3})(\\d{3,4})","$1 $2 $3",["1"]]],"0"],"EE":["372","00","8\\d{9}|[4578]\\d{7}|(?:[3-8]\\d|90)\\d{5}",[7,8,10],[["(\\d{3})(\\d{4})","$1 $2",["[369]|4[3-8]|5(?:[0-2]|5[0-478]|6[45])|7[1-9]|88","[369]|4[3-8]|5(?:[02]|1(?:[0-8]|95)|5[0-478]|6(?:4[0-4]|5[1-589]))|7[1-9]|88"]],["(\\d{4})(\\d{3,4})","$1 $2",["[45]|8(?:00|[1-49])","[45]|8(?:00[1-9]|[1-49])"]],["(\\d{2})(\\d{2})(\\d{4})","$1 $2 $3",["7"]],["(\\d{4})(\\d{3})(\\d{3})","$1 $2 $3",["8"]]]],"EG":["20","00","[189]\\d{8,9}|[24-6]\\d{8}|[135]\\d{7}",[8,9,10],[["(\\d)(\\d{7,8})","$1 $2",["[23]"],"0$1"],["(\\d{2})(\\d{6,7})","$1 $2",["1[35]|[4-6]|8[2468]|9[235-7]"],"0$1"],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["[189]"],"0$1"]],"0"],"EH":["212","00","[5-8]\\d{8}",[9],0,"0",0,0,0,0,"528[89]"],"ER":["291","00","[178]\\d{6}",[7],[["(\\d)(\\d{3})(\\d{3})","$1 $2 $3",["[178]"],"0$1"]],"0"],"ES":["34","00","[5-9]\\d{8}",[9],[["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[89]00"]],["(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[5-9]"]]]],"ET":["251","00","(?:11|[2-59]\\d)\\d{7}",[9],[["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["[1-59]"],"0$1"]],"0"],"FI":["358","00|99(?:[01469]|5(?:[14]1|3[23]|5[59]|77|88|9[09]))","[1-35689]\\d{4}|7\\d{10,11}|(?:[124-7]\\d|3[0-46-9])\\d{8}|[1-9]\\d{5,8}",[5,6,7,8,9,10,11,12],[["(\\d)(\\d{4,9})","$1 $2",["[2568][1-8]|3(?:0[1-9]|[1-9])|9"],"0$1"],["(\\d{3})(\\d{3,7})","$1 $2",["[12]00|[368]|70[07-9]"],"0$1"],["(\\d{2})(\\d{4,8})","$1 $2",["[1245]|7[135]"],"0$1"],["(\\d{2})(\\d{6,10})","$1 $2",["7"],"0$1"]],"0",0,0,0,0,"1[03-79]|[2-9]",0,"00"],"FJ":["679","0(?:0|52)","45\\d{5}|(?:0800\\d|[235-9])\\d{6}",[7,11],[["(\\d{3})(\\d{4})","$1 $2",["[235-9]|45"]],["(\\d{4})(\\d{3})(\\d{4})","$1 $2 $3",["0"]]],0,0,0,0,0,0,0,"00"],"FK":["500","00","[2-7]\\d{4}",[5]],"FM":["691","00","(?:[39]\\d\\d|820)\\d{4}",[7],[["(\\d{3})(\\d{4})","$1 $2",["[389]"]]]],"FO":["298","00","[2-9]\\d{5}",[6],[["(\\d{6})","$1",["[2-9]"]]],0,0,"(10(?:01|[12]0|88))"],"FR":["33","00","[1-9]\\d{8}",[9],[["(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["8"],"0 $1"],["(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4 $5",["[1-79]"],"0$1"]],"0"],"GA":["241","00","(?:[067]\\d|11)\\d{6}|[2-7]\\d{6}",[7,8],[["(\\d)(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[2-7]"],"0$1"],["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["11|[67]"],"0$1"],["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["0"]]],0,0,"0(11\\d{6}|6[256]\\d{6}|7[47]\\d{6})","$1"],"GB":["44","00","[1-357-9]\\d{9}|[18]\\d{8}|8\\d{6}",[7,9,10],[["(\\d{3})(\\d{4})","$1 $2",["800","8001","80011","800111","8001111"],"0$1"],["(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3",["845","8454","84546","845464"],"0$1"],["(\\d{3})(\\d{6})","$1 $2",["800"],"0$1"],["(\\d{5})(\\d{4,5})","$1 $2",["1(?:38|5[23]|69|76|94)","1(?:(?:38|69)7|5(?:24|39)|768|946)","1(?:3873|5(?:242|39[4-6])|(?:697|768)[347]|9467)"],"0$1"],["(\\d{4})(\\d{5,6})","$1 $2",["1(?:[2-69][02-9]|[78])"],"0$1"],["(\\d{2})(\\d{4})(\\d{4})","$1 $2 $3",["[25]|7(?:0|6[02-9])","[25]|7(?:0|6(?:[03-9]|2[356]))"],"0$1"],["(\\d{4})(\\d{6})","$1 $2",["7"],"0$1"],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["[1389]"],"0$1"]],"0",0,0,0,0,0,[["(?:1(?:1(?:3(?:[0-58]\\d\\d|73[03])|4(?:[0-5]\\d\\d|69[7-9])|(?:5[0-26-9]|6[0-4]|[78][0-49])\\d\\d)|(?:2(?:(?:0[024-9]|2[3-9]|3[3-79]|4[1-689]|[58][02-9]|6[0-47-9]|7[013-9]|9\\d)\\d|1(?:[0-7]\\d|8[02]))|(?:3(?:0\\d|1[0-8]|[25][02-9]|3[02-579]|[468][0-46-9]|7[1-35-79]|9[2-578])|4(?:0[03-9]|[137]\\d|[28][02-57-9]|4[02-69]|5[0-8]|[69][0-79])|5(?:0[1-35-9]|[16]\\d|2[024-9]|3[015689]|4[02-9]|5[03-9]|7[0-35-9]|8[0-468]|9[0-57-9])|6(?:0[034689]|1\\d|2[0-35689]|[38][013-9]|4[1-467]|5[0-69]|6[13-9]|7[0-8]|9[0-24578])|7(?:0[0246-9]|2\\d|3[0236-8]|4[03-9]|5[0-46-9]|6[013-9]|7[0-35-9]|8[024-9]|9[02-9])|8(?:0[35-9]|2[1-57-9]|3[02-578]|4[0-578]|5[124-9]|6[2-69]|7\\d|8[02-9]|9[02569])|9(?:0[02-589]|[18]\\d|2[02-689]|3[1-57-9]|4[2-9]|5[0-579]|6[2-47-9]|7[0-24578]|9[2-57]))\\d)\\d)|2(?:0[013478]|3[0189]|4[017]|8[0-46-9]|9[0-2])\\d{3})\\d{4}|1(?:2(?:0(?:46[1-4]|87[2-9])|545[1-79]|76(?:2\\d|3[1-8]|6[1-6])|9(?:7(?:2[0-4]|3[2-5])|8(?:2[2-8]|7[0-47-9]|8[3-5])))|3(?:6(?:38[2-5]|47[23])|8(?:47[04-9]|64[0157-9]))|4(?:044[1-7]|20(?:2[23]|8\\d)|6(?:0(?:30|5[2-57]|6[1-8]|7[2-8])|140)|8(?:052|87[1-3]))|5(?:2(?:4(?:3[2-79]|6\\d)|76\\d)|6(?:26[06-9]|686))|6(?:06(?:4\\d|7[4-79])|295[5-7]|35[34]\\d|47(?:24|61)|59(?:5[08]|6[67]|74)|9(?:55[0-4]|77[23]))|7(?:26(?:6[13-9]|7[0-7])|(?:442|688)\\d|50(?:2[0-3]|[3-68]2|76))|8(?:27[56]\\d|37(?:5[2-5]|8[239])|843[2-58])|9(?:0(?:0(?:6[1-8]|85)|52\\d)|3583|4(?:66[1-8]|9(?:2[01]|81))|63(?:23|3[1-4])|9561))\\d{3}",[9,10]],["7(?:457[0-57-9]|700[01]|911[028])\\d{5}|7(?:[1-3]\\d\\d|4(?:[0-46-9]\\d|5[0-689])|5(?:0[0-8]|[13-9]\\d|2[0-35-9])|7(?:0[1-9]|[1-7]\\d|8[02-9]|9[0-689])|8(?:[014-9]\\d|[23][0-8])|9(?:[024-9]\\d|1[02-9]|3[0-689]))\\d{6}",[10]],["80[08]\\d{7}|800\\d{6}|8001111"],["(?:8(?:4[2-5]|7[0-3])|9(?:[01]\\d|8[2-49]))\\d{7}|845464\\d",[7,10]],["70\\d{8}",[10]],0,["(?:3[0347]|55)\\d{8}",[10]],["76(?:464|652)\\d{5}|76(?:0[0-2]|2[356]|34|4[01347]|5[49]|6[0-369]|77|81|9[139])\\d{6}",[10]],["56\\d{8}",[10]]],0," x"],"GD":["1","011","(?:473|[58]\\d\\d|900)\\d{7}",[10],0,"1",0,"1|([2-9]\\d{6})$","473$1",0,"473"],"GE":["995","00","(?:[3-57]\\d\\d|800)\\d{6}",[9],[["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["70"],"0$1"],["(\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["32"],"0$1"],["(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[57]"]],["(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[348]"],"0$1"]],"0"],"GF":["594","00","(?:[56]94|976)\\d{6}",[9],[["(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[569]"],"0$1"]],"0"],"GG":["44","00","(?:1481|[357-9]\\d{3})\\d{6}|8\\d{6}(?:\\d{2})?",[7,9,10],0,"0",0,"0|([25-9]\\d{5})$","1481$1",0,0,[["1481[25-9]\\d{5}",[10]],["7(?:(?:781|839)\\d|911[17])\\d{5}",[10]],["80[08]\\d{7}|800\\d{6}|8001111"],["(?:8(?:4[2-5]|7[0-3])|9(?:[01]\\d|8[0-3]))\\d{7}|845464\\d",[7,10]],["70\\d{8}",[10]],0,["(?:3[0347]|55)\\d{8}",[10]],["76(?:464|652)\\d{5}|76(?:0[0-2]|2[356]|34|4[01347]|5[49]|6[0-369]|77|81|9[139])\\d{6}",[10]],["56\\d{8}",[10]]]],"GH":["233","00","(?:[235]\\d{3}|800)\\d{5}",[8,9],[["(\\d{3})(\\d{5})","$1 $2",["8"],"0$1"],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["[235]"],"0$1"]],"0"],"GI":["350","00","(?:[25]\\d\\d|606)\\d{5}",[8],[["(\\d{3})(\\d{5})","$1 $2",["2"]]]],"GL":["299","00","(?:19|[2-689]\\d)\\d{4}",[6],[["(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3",["19|[2-689]"]]]],"GM":["220","00","[2-9]\\d{6}",[7],[["(\\d{3})(\\d{4})","$1 $2",["[2-9]"]]]],"GN":["224","00","722\\d{6}|(?:3|6\\d)\\d{7}",[8,9],[["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["3"]],["(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[67]"]]]],"GP":["590","00","(?:590|69\\d|976)\\d{6}",[9],[["(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[569]"],"0$1"]],"0",0,0,0,0,0,[["590(?:0[1-68]|1[0-2]|2[0-68]|3[1289]|4[0-24-9]|5[3-579]|6[0189]|7[08]|8[0-689]|9\\d)\\d{4}"],["69(?:0\\d\\d|1(?:2[29]|3[0-5]))\\d{4}"],0,0,0,0,0,0,["976[01]\\d{5}"]]],"GQ":["240","00","222\\d{6}|(?:3\\d|55|[89]0)\\d{7}",[9],[["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[235]"]],["(\\d{3})(\\d{6})","$1 $2",["[89]"]]]],"GR":["30","00","5005000\\d{3}|8\\d{9,10}|(?:[269]\\d|70)\\d{8}",[10,11],[["(\\d{2})(\\d{4})(\\d{4})","$1 $2 $3",["21|7"]],["(\\d{4})(\\d{6})","$1 $2",["2(?:2|3[2-57-9]|4[2-469]|5[2-59]|6[2-9]|7[2-69]|8[2-49])|5"]],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["[2689]"]],["(\\d{3})(\\d{3})(\\d{5})","$1 $2 $3",["8"]]]],"GT":["502","00","(?:1\\d{3}|[2-7])\\d{7}",[8,11],[["(\\d{4})(\\d{4})","$1 $2",["[2-7]"]],["(\\d{4})(\\d{3})(\\d{4})","$1 $2 $3",["1"]]]],"GU":["1","011","(?:[58]\\d\\d|671|900)\\d{7}",[10],0,"1",0,"1|([3-9]\\d{6})$","671$1",0,"671"],"GW":["245","00","[49]\\d{8}|4\\d{6}",[7,9],[["(\\d{3})(\\d{4})","$1 $2",["40"]],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[49]"]]]],"GY":["592","001","(?:862\\d|9008)\\d{3}|(?:[2-46]\\d|77)\\d{5}",[7],[["(\\d{3})(\\d{4})","$1 $2",["[2-46-9]"]]]],"HK":["852","00(?:30|5[09]|[126-9]?)","8[0-46-9]\\d{6,7}|9\\d{4}(?:\\d(?:\\d(?:\\d{4})?)?)?|(?:[235-79]\\d|46)\\d{6}",[5,6,7,8,9,11],[["(\\d{3})(\\d{2,5})","$1 $2",["900","9003"]],["(\\d{4})(\\d{4})","$1 $2",["[2-7]|8[1-4]|9(?:0[1-9]|[1-8])"]],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["8"]],["(\\d{3})(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3 $4",["9"]]],0,0,0,0,0,0,0,"00"],"HN":["504","00","8\\d{10}|[237-9]\\d{7}",[8,11],[["(\\d{4})(\\d{4})","$1-$2",["[237-9]"]]]],"HR":["385","00","(?:[24-69]\\d|3[0-79])\\d{7}|80\\d{5,7}|[1-79]\\d{7}|6\\d{5,6}",[6,7,8,9],[["(\\d{2})(\\d{2})(\\d{2,3})","$1 $2 $3",["6[01]"],"0$1"],["(\\d{3})(\\d{2})(\\d{2,3})","$1 $2 $3",["8"],"0$1"],["(\\d)(\\d{4})(\\d{3})","$1 $2 $3",["1"],"0$1"],["(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["[67]"],"0$1"],["(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["9"],"0$1"],["(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["[2-5]"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["8"],"0$1"]],"0"],"HT":["509","00","[2-489]\\d{7}",[8],[["(\\d{2})(\\d{2})(\\d{4})","$1 $2 $3",["[2-489]"]]]],"HU":["36","00","[235-7]\\d{8}|[1-9]\\d{7}",[8,9],[["(\\d)(\\d{3})(\\d{4})","$1 $2 $3",["1"],"(06 $1)"],["(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["[27][2-9]|3[2-7]|4[24-9]|5[2-79]|6|8[2-57-9]|9[2-69]"],"(06 $1)"],["(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["[2-9]"],"06 $1"]],"06"],"ID":["62","00[89]","(?:(?:00[1-9]|8\\d)\\d{4}|[1-36])\\d{6}|00\\d{10}|[1-9]\\d{8,10}|[2-9]\\d{7}",[7,8,9,10,11,12,13],[["(\\d)(\\d{3})(\\d{3})","$1 $2 $3",["15"]],["(\\d{2})(\\d{5,9})","$1 $2",["2[124]|[36]1"],"(0$1)"],["(\\d{3})(\\d{5,7})","$1 $2",["800"],"0$1"],["(\\d{3})(\\d{5,8})","$1 $2",["[2-79]"],"(0$1)"],["(\\d{3})(\\d{3,4})(\\d{3})","$1-$2-$3",["8[1-35-9]"],"0$1"],["(\\d{3})(\\d{6,8})","$1 $2",["1"],"0$1"],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["804"],"0$1"],["(\\d{3})(\\d)(\\d{3})(\\d{3})","$1 $2 $3 $4",["80"],"0$1"],["(\\d{3})(\\d{4})(\\d{4,5})","$1-$2-$3",["8"],"0$1"]],"0"],"IE":["353","00","(?:1\\d|[2569])\\d{6,8}|4\\d{6,9}|7\\d{8}|8\\d{8,9}",[7,8,9,10],[["(\\d{2})(\\d{5})","$1 $2",["2[24-9]|47|58|6[237-9]|9[35-9]"],"(0$1)"],["(\\d{3})(\\d{5})","$1 $2",["[45]0"],"(0$1)"],["(\\d)(\\d{3,4})(\\d{4})","$1 $2 $3",["1"],"(0$1)"],["(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["[2569]|4[1-69]|7[14]"],"(0$1)"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["70"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["81"],"(0$1)"],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["[78]"],"0$1"],["(\\d{4})(\\d{3})(\\d{3})","$1 $2 $3",["1"]],["(\\d{2})(\\d{4})(\\d{4})","$1 $2 $3",["4"],"(0$1)"],["(\\d{2})(\\d)(\\d{3})(\\d{4})","$1 $2 $3 $4",["8"],"0$1"]],"0"],"IL":["972","0(?:0|1[2-9])","1\\d{6}(?:\\d{3,5})?|[57]\\d{8}|[1-489]\\d{7}",[7,8,9,10,11,12],[["(\\d{4})(\\d{3})","$1-$2",["125"]],["(\\d{4})(\\d{2})(\\d{2})","$1-$2-$3",["121"]],["(\\d)(\\d{3})(\\d{4})","$1-$2-$3",["[2-489]"],"0$1"],["(\\d{2})(\\d{3})(\\d{4})","$1-$2-$3",["[57]"],"0$1"],["(\\d{4})(\\d{3})(\\d{3})","$1-$2-$3",["12"]],["(\\d{4})(\\d{6})","$1-$2",["159"]],["(\\d)(\\d{3})(\\d{3})(\\d{3})","$1-$2-$3-$4",["1[7-9]"]],["(\\d{3})(\\d{1,2})(\\d{3})(\\d{4})","$1-$2 $3-$4",["15"]]],"0"],"IM":["44","00","1624\\d{6}|(?:[3578]\\d|90)\\d{8}",[10],0,"0",0,"0|([5-8]\\d{5})$","1624$1",0,"74576|(?:16|7[56])24"],"IN":["91","00","(?:000800|[2-9]\\d\\d)\\d{7}|1\\d{7,12}",[8,9,10,11,12,13],[["(\\d{8})","$1",["5(?:0|2[23]|3[03]|[67]1|88)","5(?:0|2(?:21|3)|3(?:0|3[23])|616|717|888)","5(?:0|2(?:21|3)|3(?:0|3[23])|616|717|8888)"],0,1],["(\\d{4})(\\d{4,5})","$1 $2",["180","1800"],0,1],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["140"],0,1],["(\\d{2})(\\d{4})(\\d{4})","$1 $2 $3",["11|2[02]|33|4[04]|79[1-7]|80[2-46]","11|2[02]|33|4[04]|79(?:[1-6]|7[19])|80(?:[2-4]|6[0-589])","11|2[02]|33|4[04]|79(?:[124-6]|3(?:[02-9]|1[0-24-9])|7(?:1|9[1-6]))|80(?:[2-4]|6[0-589])"],"0$1",1],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["1(?:2[0-249]|3[0-25]|4[145]|[68]|7[1257])|2(?:1[257]|3[013]|4[01]|5[0137]|6[0158]|78|8[1568])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|5[12]|[78]1)|6(?:12|[2-4]1|5[17]|6[13]|80)|7(?:12|3[134]|4[47]|61|88)|8(?:16|2[014]|3[126]|6[136]|7[078]|8[34]|91)|(?:43|59|75)[15]|(?:1[59]|29|67|72)[14]","1(?:2[0-24]|3[0-25]|4[145]|[59][14]|6[1-9]|7[1257]|8[1-57-9])|2(?:1[257]|3[013]|4[01]|5[0137]|6[058]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|[578]1|9[15])|674|7(?:(?:2[14]|3[34]|5[15])[2-6]|61[346]|88[0-8])|8(?:70[2-6]|84[235-7]|91[3-7])|(?:1(?:29|60|8[06])|261|552|6(?:12|[2-47]1|5[17]|6[13]|80)|7(?:12|31|4[47])|8(?:16|2[014]|3[126]|6[136]|7[78]|83))[2-7]","1(?:2[0-24]|3[0-25]|4[145]|[59][14]|6[1-9]|7[1257]|8[1-57-9])|2(?:1[257]|3[013]|4[01]|5[0137]|6[058]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|[578]1|9[15])|6(?:12(?:[2-6]|7[0-8])|74[2-7])|7(?:(?:2[14]|5[15])[2-6]|3171|61[346]|88(?:[2-7]|82))|8(?:70[2-6]|84(?:[2356]|7[19])|91(?:[3-6]|7[19]))|73[134][2-6]|(?:74[47]|8(?:16|2[014]|3[126]|6[136]|7[78]|83))(?:[2-6]|7[19])|(?:1(?:29|60|8[06])|261|552|6(?:[2-4]1|5[17]|6[13]|7(?:1|4[0189])|80)|7(?:12|88[01]))[2-7]"],"0$1",1],["(\\d{4})(\\d{3})(\\d{3})","$1 $2 $3",["1(?:[2-479]|5[0235-9])|[2-5]|6(?:1[1358]|2[2457-9]|3[2-5]|4[235-7]|5[2-689]|6[24578]|7[235689]|8[1-6])|7(?:1[013-9]|28|3[129]|4[1-35689]|5[29]|6[02-5]|70)|807","1(?:[2-479]|5[0235-9])|[2-5]|6(?:1[1358]|2(?:[2457]|84|95)|3(?:[2-4]|55)|4[235-7]|5[2-689]|6[24578]|7[235689]|8[1-6])|7(?:1(?:[013-8]|9[6-9])|28[6-8]|3(?:17|2[0-49]|9[2-57])|4(?:1[2-4]|[29][0-7]|3[0-8]|[56]|8[0-24-7])|5(?:2[1-3]|9[0-6])|6(?:0[5689]|2[5-9]|3[02-8]|4|5[0-367])|70[13-7])|807[19]","1(?:[2-479]|5(?:[0236-9]|5[013-9]))|[2-5]|6(?:2(?:84|95)|355|83)|73179|807(?:1|9[1-3])|(?:1552|6(?:1[1358]|2[2457]|3[2-4]|4[235-7]|5[2-689]|6[24578]|7[235689]|8[124-6])\\d|7(?:1(?:[013-8]\\d|9[6-9])|28[6-8]|3(?:2[0-49]|9[2-57])|4(?:1[2-4]|[29][0-7]|3[0-8]|[56]\\d|8[0-24-7])|5(?:2[1-3]|9[0-6])|6(?:0[5689]|2[5-9]|3[02-8]|4\\d|5[0-367])|70[13-7]))[2-7]"],"0$1",1],["(\\d{5})(\\d{5})","$1 $2",["[6-9]"],"0$1",1],["(\\d{4})(\\d{2,4})(\\d{4})","$1 $2 $3",["1(?:6|8[06])","1(?:6|8[06]0)"],0,1],["(\\d{4})(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3 $4",["18"],0,1]],"0"],"IO":["246","00","3\\d{6}",[7],[["(\\d{3})(\\d{4})","$1 $2",["3"]]]],"IQ":["964","00","(?:1|7\\d\\d)\\d{7}|[2-6]\\d{7,8}",[8,9,10],[["(\\d)(\\d{3})(\\d{4})","$1 $2 $3",["1"],"0$1"],["(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["[2-6]"],"0$1"],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["7"],"0$1"]],"0"],"IR":["98","00","[1-9]\\d{9}|(?:[1-8]\\d\\d|9)\\d{3,4}",[4,5,6,7,10],[["(\\d{4,5})","$1",["96"],"0$1"],["(\\d{2})(\\d{4,5})","$1 $2",["(?:1[137]|2[13-68]|3[1458]|4[145]|5[1468]|6[16]|7[1467]|8[13467])[12689]"],"0$1"],["(\\d{3})(\\d{3})(\\d{3,4})","$1 $2 $3",["9"],"0$1"],["(\\d{2})(\\d{4})(\\d{4})","$1 $2 $3",["[1-8]"],"0$1"]],"0"],"IS":["354","00|1(?:0(?:01|[12]0)|100)","(?:38\\d|[4-9])\\d{6}",[7,9],[["(\\d{3})(\\d{4})","$1 $2",["[4-9]"]],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["3"]]],0,0,0,0,0,0,0,"00"],"IT":["39","00","0\\d{5,10}|3[0-8]\\d{7,10}|55\\d{8}|8\\d{5}(?:\\d{2,4})?|(?:1\\d|39)\\d{7,8}",[6,7,8,9,10,11],[["(\\d{2})(\\d{4,6})","$1 $2",["0[26]"]],["(\\d{3})(\\d{3,6})","$1 $2",["0[13-57-9][0159]|8(?:03|4[17]|9[245])","0[13-57-9][0159]|8(?:03|4[17]|9(?:2|[45][0-4]))"]],["(\\d{4})(\\d{2,6})","$1 $2",["0(?:[13-579][2-46-8]|8[236-8])"]],["(\\d{4})(\\d{4})","$1 $2",["894"]],["(\\d{2})(\\d{3,4})(\\d{4})","$1 $2 $3",["0[26]|5"]],["(\\d{3})(\\d{3})(\\d{3,4})","$1 $2 $3",["1[4679]|[38]"]],["(\\d{3})(\\d{3,4})(\\d{4})","$1 $2 $3",["0[13-57-9][0159]"]],["(\\d{2})(\\d{4})(\\d{5})","$1 $2 $3",["0[26]"]],["(\\d{4})(\\d{3})(\\d{4})","$1 $2 $3",["0"]],["(\\d{3})(\\d{4})(\\d{4,5})","$1 $2 $3",["3"]]],0,0,0,0,0,0,[["0669[0-79]\\d{1,6}|0(?:1(?:[0159]\\d|[27][1-5]|31|4[1-4]|6[1356]|8[2-57])|2\\d\\d|3(?:[0159]\\d|2[1-4]|3[12]|[48][1-6]|6[2-59]|7[1-7])|4(?:[0159]\\d|[23][1-9]|4[245]|6[1-5]|7[1-4]|81)|5(?:[0159]\\d|2[1-5]|3[2-6]|4[1-79]|6[4-6]|7[1-578]|8[3-8])|6(?:[0-57-9]\\d|6[0-8])|7(?:[0159]\\d|2[12]|3[1-7]|4[2-46]|6[13569]|7[13-6]|8[1-59])|8(?:[0159]\\d|2[3-578]|3[1-356]|[6-8][1-5])|9(?:[0159]\\d|[238][1-5]|4[12]|6[1-8]|7[1-6]))\\d{2,7}"],["3[1-9]\\d{8}|3[2-9]\\d{7}",[9,10]],["80(?:0\\d{3}|3)\\d{3}",[6,9]],["(?:0878\\d\\d|89(?:2|4[5-9]\\d))\\d{3}|89[45][0-4]\\d\\d|(?:1(?:44|6[346])|89(?:5[5-9]|9))\\d{6}",[6,8,9,10]],["1(?:78\\d|99)\\d{6}",[9,10]],0,0,0,["55\\d{8}",[10]],["84(?:[08]\\d{3}|[17])\\d{3}",[6,9]]]],"JE":["44","00","1534\\d{6}|(?:[3578]\\d|90)\\d{8}",[10],0,"0",0,"0|([0-24-8]\\d{5})$","1534$1",0,0,[["1534[0-24-8]\\d{5}"],["7(?:(?:(?:50|82)9|937)\\d|7(?:00[378]|97[7-9]))\\d{5}"],["80(?:07(?:35|81)|8901)\\d{4}"],["(?:8(?:4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|7(?:0002|1206))|90(?:066[59]|1810|71(?:07|55)))\\d{4}"],["701511\\d{4}"],0,["(?:3(?:0(?:07(?:35|81)|8901)|3\\d{4}|4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|7(?:0002|1206))|55\\d{4})\\d{4}"],["76(?:464|652)\\d{5}|76(?:0[0-2]|2[356]|34|4[01347]|5[49]|6[0-369]|77|81|9[139])\\d{6}"],["56\\d{8}"]]],"JM":["1","011","(?:[58]\\d\\d|658|900)\\d{7}",[10],0,"1",0,0,0,0,"658|876"],"JO":["962","00","(?:(?:[2689]|7\\d)\\d|32|53)\\d{6}",[8,9],[["(\\d)(\\d{3})(\\d{4})","$1 $2 $3",["[2356]|87"],"(0$1)"],["(\\d{3})(\\d{5,6})","$1 $2",["[89]"],"0$1"],["(\\d{2})(\\d{7})","$1 $2",["70"],"0$1"],["(\\d)(\\d{4})(\\d{4})","$1 $2 $3",["7"],"0$1"]],"0"],"JP":["81","010","00[1-9]\\d{6,14}|[257-9]\\d{9}|(?:00|[1-9]\\d\\d)\\d{6}",[8,9,10,11,12,13,14,15,16,17],[["(\\d{3})(\\d{3})(\\d{3})","$1-$2-$3",["(?:12|57|99)0"],"0$1"],["(\\d{4})(\\d)(\\d{4})","$1-$2-$3",["1(?:26|3[79]|4[56]|5[4-68]|6[3-5])|499|5(?:76|97)|746|8(?:3[89]|47|51|63)|9(?:49|80|9[16])","1(?:267|3(?:7[247]|9[278])|466|5(?:47|58|64)|6(?:3[245]|48|5[4-68]))|499[2468]|5(?:76|97)9|7468|8(?:3(?:8[7-9]|96)|477|51[2-9]|636)|9(?:496|802|9(?:1[23]|69))|1(?:45|58)[67]","1(?:267|3(?:7[247]|9[278])|466|5(?:47|58|64)|6(?:3[245]|48|5[4-68]))|499[2468]|5(?:769|979[2-69])|7468|8(?:3(?:8[7-9]|96[2457-9])|477|51[2-9]|636[457-9])|9(?:496|802|9(?:1[23]|69))|1(?:45|58)[67]"],"0$1"],["(\\d{2})(\\d{3})(\\d{4})","$1-$2-$3",["60"],"0$1"],["(\\d)(\\d{4})(\\d{4})","$1-$2-$3",["[36]|4(?:2[09]|7[01])","[36]|4(?:2(?:0|9[02-69])|7(?:0[019]|1))"],"0$1"],["(\\d{2})(\\d{3})(\\d{4})","$1-$2-$3",["1(?:1|5[45]|77|88|9[69])|2(?:2[1-37]|3[0-269]|4[59]|5|6[24]|7[1-358]|8[1369]|9[0-38])|4(?:[28][1-9]|3[0-57]|[45]|6[248]|7[2-579]|9[29])|5(?:2|3[045]|4[0-369]|5[29]|8[02389]|9[0-389])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9[2-6])|8(?:2[124589]|3[27-9]|49|51|6|7[0-468]|8[68]|9[019])|9(?:[23][1-9]|4[15]|5[138]|6[1-3]|7[156]|8[189]|9[1-489])","1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2(?:[127]|3[014-9])|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|9[19])|62|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|8[1-9])|5(?:2|3[045]|4[0-369]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9[0-2469])|49|51|6(?:[0-24]|36|5[0-3589]|72|9[01459])|7[0-468]|8[68])|9(?:[23][1-9]|4[15]|5[138]|6[1-3]|7[156]|8[189]|9(?:[1289]|3[34]|4[0178]))|(?:49|55|83)[29]|(?:264|837)[016-9]|2(?:57|93)[015-9]|(?:25[0468]|422|838)[01]|(?:47[59]|59[89]|8(?:6[68]|9))[019]","1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2[127]|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|9(?:17|99))|6(?:2|4[016-9])|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|9[29])|5(?:2|3[045]|4[0-369]|5[29]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9[0169])|3(?:[29]|7(?:[017-9]|6[6-8]))|49|51|6(?:[0-24]|36[23]|5(?:[0-389]|5[23])|6(?:[01]|9[178])|72|9[0145])|7[0-468]|8[68])|9(?:4[15]|5[138]|7[156]|8[189]|9(?:[1289]|3(?:31|4[357])|4[0178]))|(?:8294|96)[1-3]|2(?:57|93)[015-9]|(?:223|8699)[014-9]|(?:25[0468]|422|838)[01]|(?:48|8292|9[23])[1-9]|(?:47[59]|59[89]|8(?:68|9))[019]","1(?:1|5(?:4[018]|5[017])|77|88|9[69])|2(?:2[127]|3[0-269]|4[59]|5(?:[1-3]|5[0-69]|7[015-9]|9(?:17|99))|6(?:2|4[016-9])|7(?:[1-35]|8[0189])|8(?:[16]|3[0134]|9[0-5])|9(?:[028]|17|3[015-9]))|4(?:2(?:[13-79]|8[014-6])|3[0-57]|[45]|6[248]|7[2-47]|9[29])|5(?:2|3[045]|4[0-369]|5[29]|8[02389]|9[0-3])|7(?:2[02-46-9]|34|[58]|6[0249]|7[57]|9(?:[23]|4[0-59]|5[01569]|6[0167]))|8(?:2(?:[1258]|4[0-39]|9(?:[019]|4[1-3]|6(?:[0-47-9]|5[01346-9])))|3(?:[29]|7(?:[017-9]|6[6-8]))|49|51|6(?:[0-24]|36[23]|5(?:[0-389]|5[23])|6(?:[01]|9[178])|72|9[0145])|7[0-468]|8[68])|9(?:4[15]|5[138]|6[1-3]|7[156]|8[189]|9(?:[1289]|3(?:31|4[357])|4[0178]))|(?:223|8699)[014-9]|(?:25[0468]|422|838)[01]|(?:48|829(?:2|66)|9[23])[1-9]|(?:47[59]|59[89]|8(?:68|9))[019]"],"0$1"],["(\\d{3})(\\d{2})(\\d{4})","$1-$2-$3",["[14]|[289][2-9]|5[3-9]|7[2-4679]"],"0$1"],["(\\d{3})(\\d{3})(\\d{4})","$1-$2-$3",["800"],"0$1"],["(\\d{2})(\\d{4})(\\d{4})","$1-$2-$3",["[257-9]"],"0$1"]],"0"],"KE":["254","000","(?:[17]\\d\\d|900)\\d{6}|(?:2|80)0\\d{6,7}|[4-6]\\d{6,8}",[7,8,9,10],[["(\\d{2})(\\d{5,7})","$1 $2",["[24-6]"],"0$1"],["(\\d{3})(\\d{6})","$1 $2",["[17]"],"0$1"],["(\\d{3})(\\d{3})(\\d{3,4})","$1 $2 $3",["[89]"],"0$1"]],"0"],"KG":["996","00","8\\d{9}|(?:[235-8]\\d|99)\\d{7}",[9,10],[["(\\d{4})(\\d{5})","$1 $2",["3(?:1[346]|[24-79])"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[235-79]|88"],"0$1"],["(\\d{3})(\\d{3})(\\d)(\\d{2,3})","$1 $2 $3 $4",["8"],"0$1"]],"0"],"KH":["855","00[14-9]","1\\d{9}|[1-9]\\d{7,8}",[8,9,10],[["(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["[1-9]"],"0$1"],["(\\d{4})(\\d{3})(\\d{3})","$1 $2 $3",["1"]]],"0"],"KI":["686","00","(?:[37]\\d|6[0-79])\\d{6}|(?:[2-48]\\d|50)\\d{3}",[5,8],0,"0"],"KM":["269","00","[3478]\\d{6}",[7],[["(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3",["[3478]"]]]],"KN":["1","011","(?:[58]\\d\\d|900)\\d{7}",[10],0,"1",0,"1|([2-7]\\d{6})$","869$1",0,"869"],"KP":["850","00|99","85\\d{6}|(?:19\\d|[2-7])\\d{7}",[8,10],[["(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["8"],"0$1"],["(\\d)(\\d{3})(\\d{4})","$1 $2 $3",["[2-7]"],"0$1"],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["1"],"0$1"]],"0"],"KR":["82","00(?:[125689]|3(?:[46]5|91)|7(?:00|27|3|55|6[126]))","00[1-9]\\d{8,11}|(?:[12]|5\\d{3})\\d{7}|[13-6]\\d{9}|(?:[1-6]\\d|80)\\d{7}|[3-6]\\d{4,5}|(?:00|7)0\\d{8}",[5,6,8,9,10,11,12,13,14],[["(\\d{2})(\\d{3,4})","$1-$2",["(?:3[1-3]|[46][1-4]|5[1-5])1"],"0$1"],["(\\d{4})(\\d{4})","$1-$2",["1"]],["(\\d)(\\d{3,4})(\\d{4})","$1-$2-$3",["2"],"0$1"],["(\\d{2})(\\d{3})(\\d{4})","$1-$2-$3",["60|8"],"0$1"],["(\\d{2})(\\d{3,4})(\\d{4})","$1-$2-$3",["[1346]|5[1-5]"],"0$1"],["(\\d{2})(\\d{4})(\\d{4})","$1-$2-$3",["[57]"],"0$1"],["(\\d{2})(\\d{5})(\\d{4})","$1-$2-$3",["5"],"0$1"]],"0",0,"0(8(?:[1-46-8]|5\\d\\d))?"],"KW":["965","00","(?:18|[2569]\\d\\d)\\d{5}",[7,8],[["(\\d{4})(\\d{3,4})","$1 $2",["[169]|2(?:[235]|4[1-35-9])|52"]],["(\\d{3})(\\d{5})","$1 $2",["[25]"]]]],"KY":["1","011","(?:345|[58]\\d\\d|900)\\d{7}",[10],0,"1",0,"1|([2-9]\\d{6})$","345$1",0,"345"],"KZ":["7","810","33622\\d{5}|(?:7\\d|80)\\d{8}",[10],0,"8",0,0,0,0,"33|7",0,"8~10"],"LA":["856","00","[23]\\d{9}|3\\d{8}|(?:[235-8]\\d|41)\\d{6}",[8,9,10],[["(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["2[13]|3[14]|[4-8]"],"0$1"],["(\\d{2})(\\d{2})(\\d{2})(\\d{3})","$1 $2 $3 $4",["30[013-9]"],"0$1"],["(\\d{2})(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3 $4",["[23]"],"0$1"]],"0"],"LB":["961","00","[7-9]\\d{7}|[13-9]\\d{6}",[7,8],[["(\\d)(\\d{3})(\\d{3})","$1 $2 $3",["[13-69]|7(?:[2-57]|62|8[0-7]|9[04-9])|8[02-9]"],"0$1"],["(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["[7-9]"]]],"0"],"LC":["1","011","(?:[58]\\d\\d|758|900)\\d{7}",[10],0,"1",0,"1|([2-8]\\d{6})$","758$1",0,"758"],"LI":["423","00","90\\d{5}|(?:[2378]|6\\d\\d)\\d{6}",[7,9],[["(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3",["[237-9]"]],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["69"]],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["6"]]],"0",0,"0|(1001)"],"LK":["94","00","[1-9]\\d{8}",[9],[["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["7"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[1-689]"],"0$1"]],"0"],"LR":["231","00","(?:2|33|5\\d|77|88)\\d{7}|[4-6]\\d{6}",[7,8,9],[["(\\d)(\\d{3})(\\d{3})","$1 $2 $3",["[4-6]"],"0$1"],["(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["2"],"0$1"],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["[3578]"],"0$1"]],"0"],"LS":["266","00","(?:[256]\\d\\d|800)\\d{5}",[8],[["(\\d{4})(\\d{4})","$1 $2",["[2568]"]]]],"LT":["370","00","(?:[3469]\\d|52|[78]0)\\d{6}",[8],[["(\\d)(\\d{3})(\\d{4})","$1 $2 $3",["52[0-7]"],"(8-$1)",1],["(\\d{3})(\\d{2})(\\d{3})","$1 $2 $3",["[7-9]"],"8 $1",1],["(\\d{2})(\\d{6})","$1 $2",["37|4(?:[15]|6[1-8])"],"(8-$1)",1],["(\\d{3})(\\d{5})","$1 $2",["[3-6]"],"(8-$1)",1]],"8",0,"[08]"],"LU":["352","00","35[013-9]\\d{4,8}|6\\d{8}|35\\d{2,4}|(?:[2457-9]\\d|3[0-46-9])\\d{2,9}",[4,5,6,7,8,9,10,11],[["(\\d{2})(\\d{3})","$1 $2",["2(?:0[2-689]|[2-9])|[3-57]|8(?:0[2-9]|[13-9])|9(?:0[89]|[2-579])"]],["(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3",["2(?:0[2-689]|[2-9])|[3-57]|8(?:0[2-9]|[13-9])|9(?:0[89]|[2-579])"]],["(\\d{2})(\\d{2})(\\d{3})","$1 $2 $3",["20[2-689]"]],["(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})","$1 $2 $3 $4",["2(?:[0367]|4[3-8])"]],["(\\d{3})(\\d{2})(\\d{3})","$1 $2 $3",["80[01]|90[015]"]],["(\\d{2})(\\d{2})(\\d{2})(\\d{3})","$1 $2 $3 $4",["20"]],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["6"]],["(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})","$1 $2 $3 $4 $5",["2(?:[0367]|4[3-8])"]],["(\\d{2})(\\d{2})(\\d{2})(\\d{1,5})","$1 $2 $3 $4",["[3-57]|8[13-9]|9(?:0[89]|[2-579])|(?:2|80)[2-9]"]]],0,0,"(15(?:0[06]|1[12]|[35]5|4[04]|6[26]|77|88|99)\\d)"],"LV":["371","00","(?:[268]\\d|90)\\d{6}",[8],[["(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["[269]|8[01]"]]]],"LY":["218","00","[2-9]\\d{8}",[9],[["(\\d{2})(\\d{7})","$1-$2",["[2-9]"],"0$1"]],"0"],"MA":["212","00","[5-8]\\d{8}",[9],[["(\\d{5})(\\d{4})","$1-$2",["5(?:29|38)","5(?:29|38)[89]","5(?:29|38)[89]0"],"0$1"],["(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["5[45]"],"0$1"],["(\\d{4})(\\d{5})","$1-$2",["5(?:2[2-489]|3[5-9]|9)|892","5(?:2(?:[2-49]|8[235-9])|3[5-9]|9)|892"],"0$1"],["(\\d{2})(\\d{7})","$1-$2",["8"],"0$1"],["(\\d{3})(\\d{6})","$1-$2",["[5-7]"],"0$1"]],"0",0,0,0,0,0,[["5(?:29(?:[189][05]|2[29]|3[01])|38[89][05])\\d{4}|5(?:2(?:[015-7]\\d|2[02-9]|3[0-578]|4[02-46-8]|8[0235-7]|90)|3(?:[0-47]\\d|5[02-9]|6[02-8]|80|9[3-9])|(?:4[067]|5[03])\\d)\\d{5}"],["(?:6(?:[0-79]\\d|8[0-247-9])|7(?:0[0-8]|6[1267]|7[0-37]))\\d{6}"],["80\\d{7}"],["89\\d{7}"],0,0,0,0,["592(?:4[0-2]|93)\\d{4}"]]],"MC":["377","00","870\\d{5}|(?:[349]|6\\d)\\d{7}",[8,9],[["(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["4"],"0$1"],["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[39]"]],["(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4 $5",["6"],"0$1"]],"0"],"MD":["373","00","(?:[235-7]\\d|[89]0)\\d{6}",[8],[["(\\d{3})(\\d{5})","$1 $2",["[89]"],"0$1"],["(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["22|3"],"0$1"],["(\\d{3})(\\d{2})(\\d{3})","$1 $2 $3",["[25-7]"],"0$1"]],"0"],"ME":["382","00","(?:20|[3-79]\\d)\\d{6}|80\\d{6,7}",[8,9],[["(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["[2-9]"],"0$1"]],"0"],"MF":["590","00","(?:590|69\\d|976)\\d{6}",[9],0,"0",0,0,0,0,0,[["590(?:0[079]|[14]3|[27][79]|30|5[0-268]|87)\\d{4}"],["69(?:0\\d\\d|1(?:2[29]|3[0-5]))\\d{4}"],0,0,0,0,0,0,["976[01]\\d{5}"]]],"MG":["261","00","[23]\\d{8}",[9],[["(\\d{2})(\\d{2})(\\d{3})(\\d{2})","$1 $2 $3 $4",["[23]"],"0$1"]],"0",0,"0|([24-9]\\d{6})$","20$1"],"MH":["692","011","329\\d{4}|(?:[256]\\d|45)\\d{5}",[7],[["(\\d{3})(\\d{4})","$1-$2",["[2-6]"]]],"1"],"MK":["389","00","[2-578]\\d{7}",[8],[["(\\d)(\\d{3})(\\d{4})","$1 $2 $3",["2"],"0$1"],["(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["[347]"],"0$1"],["(\\d{3})(\\d)(\\d{2})(\\d{2})","$1 $2 $3 $4",["[58]"],"0$1"]],"0"],"ML":["223","00","[24-9]\\d{7}",[8],[["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[24-9]"]]]],"MM":["95","00","1\\d{5,7}|95\\d{6}|(?:[4-7]|9[0-46-9])\\d{6,8}|(?:2|8\\d)\\d{5,8}",[6,7,8,9,10],[["(\\d)(\\d{2})(\\d{3})","$1 $2 $3",["16|2"],"0$1"],["(\\d{2})(\\d{2})(\\d{3})","$1 $2 $3",["[45]|6(?:0[23]|[1-689]|7[235-7])|7(?:[0-4]|5[2-7])|8[1-6]"],"0$1"],["(\\d)(\\d{3})(\\d{3,4})","$1 $2 $3",["[12]"],"0$1"],["(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["[4-7]|8[1-35]"],"0$1"],["(\\d)(\\d{3})(\\d{4,6})","$1 $2 $3",["9(?:2[0-4]|[35-9]|4[137-9])"],"0$1"],["(\\d)(\\d{4})(\\d{4})","$1 $2 $3",["2"],"0$1"],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["8"],"0$1"],["(\\d)(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3 $4",["92"],"0$1"],["(\\d)(\\d{5})(\\d{4})","$1 $2 $3",["9"],"0$1"]],"0"],"MN":["976","001","[12]\\d{7,9}|[57-9]\\d{7}",[8,9,10],[["(\\d{2})(\\d{2})(\\d{4})","$1 $2 $3",["[12]1"],"0$1"],["(\\d{4})(\\d{4})","$1 $2",["[57-9]"]],["(\\d{3})(\\d{5,6})","$1 $2",["[12]2[1-3]"],"0$1"],["(\\d{4})(\\d{5,6})","$1 $2",["[12](?:27|3[2-8]|4[2-68]|5[1-4689])","[12](?:27|3[2-8]|4[2-68]|5[1-4689])[0-3]"],"0$1"],["(\\d{5})(\\d{4,5})","$1 $2",["[12]"],"0$1"]],"0"],"MO":["853","00","(?:28|[68]\\d)\\d{6}",[8],[["(\\d{4})(\\d{4})","$1 $2",["[268]"]]]],"MP":["1","011","[58]\\d{9}|(?:67|90)0\\d{7}",[10],0,"1",0,"1|([2-9]\\d{6})$","670$1",0,"670"],"MQ":["596","00","69\\d{7}|(?:59|97)6\\d{6}",[9],[["(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[569]"],"0$1"]],"0"],"MR":["222","00","(?:[2-4]\\d\\d|800)\\d{5}",[8],[["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[2-48]"]]]],"MS":["1","011","(?:[58]\\d\\d|664|900)\\d{7}",[10],0,"1",0,"1|([34]\\d{6})$","664$1",0,"664"],"MT":["356","00","3550\\d{4}|(?:[2579]\\d\\d|800)\\d{5}",[8],[["(\\d{4})(\\d{4})","$1 $2",["[2357-9]"]]]],"MU":["230","0(?:0|[24-7]0|3[03])","(?:[2-468]|5\\d)\\d{6}",[7,8],[["(\\d{3})(\\d{4})","$1 $2",["[2-46]|8[013]"]],["(\\d{4})(\\d{4})","$1 $2",["5"]]],0,0,0,0,0,0,0,"020"],"MV":["960","0(?:0|19)","(?:800|9[0-57-9]\\d)\\d{7}|[34679]\\d{6}",[7,10],[["(\\d{3})(\\d{4})","$1-$2",["[3467]|9[13-9]"]],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["[89]"]]],0,0,0,0,0,0,0,"00"],"MW":["265","00","1\\d{6}(?:\\d{2})?|(?:[23]1|77|88|99)\\d{7}",[7,9],[["(\\d)(\\d{3})(\\d{3})","$1 $2 $3",["1[2-9]"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["2"],"0$1"],["(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[137-9]"],"0$1"]],"0"],"MX":["52","0[09]","(?:1(?:[01467]\\d|[2359][1-9]|8[1-79])|[2-9]\\d)\\d{8}",[10,11],[["(\\d{2})(\\d{4})(\\d{4})","$1 $2 $3",["33|5[56]|81"],0,1],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["[2-9]"],0,1],["(\\d)(\\d{2})(\\d{4})(\\d{4})","$2 $3 $4",["1(?:33|5[56]|81)"],0,1],["(\\d)(\\d{3})(\\d{3})(\\d{4})","$2 $3 $4",["1"],0,1]],"01",0,"0(?:[12]|4[45])|1",0,0,0,0,"00"],"MY":["60","00","1\\d{8,9}|(?:3\\d|[4-9])\\d{7}",[8,9,10],[["(\\d)(\\d{3})(\\d{4})","$1-$2 $3",["[4-79]"],"0$1"],["(\\d{2})(\\d{3})(\\d{3,4})","$1-$2 $3",["1(?:[02469]|[378][1-9])|8"],"0$1"],["(\\d)(\\d{4})(\\d{4})","$1-$2 $3",["3"],"0$1"],["(\\d)(\\d{3})(\\d{2})(\\d{4})","$1-$2-$3-$4",["1[36-8]"]],["(\\d{3})(\\d{3})(\\d{4})","$1-$2 $3",["15"],"0$1"],["(\\d{2})(\\d{4})(\\d{4})","$1-$2 $3",["1"],"0$1"]],"0"],"MZ":["258","00","(?:2|8\\d)\\d{7}",[8,9],[["(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["2|8[2-79]"]],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["8"]]]],"NA":["264","00","[68]\\d{7,8}",[8,9],[["(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["88"],"0$1"],["(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["6"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["87"],"0$1"],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["8"],"0$1"]],"0"],"NC":["687","00","[2-57-9]\\d{5}",[6],[["(\\d{2})(\\d{2})(\\d{2})","$1.$2.$3",["[2-57-9]"]]]],"NE":["227","00","[027-9]\\d{7}",[8],[["(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["08"]],["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[089]|2[013]|7[04]"]]]],"NF":["672","00","[13]\\d{5}",[6],[["(\\d{2})(\\d{4})","$1 $2",["1[0-3]"]],["(\\d)(\\d{5})","$1 $2",["[13]"]]],0,0,"([0-258]\\d{4})$","3$1"],"NG":["234","009","(?:[124-7]|9\\d{3})\\d{6}|[1-9]\\d{7}|[78]\\d{9,13}",[7,8,10,11,12,13,14],[["(\\d{2})(\\d{2})(\\d{3})","$1 $2 $3",["78"],"0$1"],["(\\d)(\\d{3})(\\d{3,4})","$1 $2 $3",["[12]|9(?:0[3-9]|[1-9])"],"0$1"],["(\\d{2})(\\d{3})(\\d{2,3})","$1 $2 $3",["[3-7]|8[2-9]"],"0$1"],["(\\d{3})(\\d{3})(\\d{3,4})","$1 $2 $3",["[7-9]"],"0$1"],["(\\d{3})(\\d{4})(\\d{4,5})","$1 $2 $3",["[78]"],"0$1"],["(\\d{3})(\\d{5})(\\d{5,6})","$1 $2 $3",["[78]"],"0$1"]],"0"],"NI":["505","00","(?:1800|[25-8]\\d{3})\\d{4}",[8],[["(\\d{4})(\\d{4})","$1 $2",["[125-8]"]]]],"NL":["31","00","(?:[124-7]\\d\\d|3(?:[02-9]\\d|1[0-8]))\\d{6}|[89]\\d{6,9}|1\\d{4,5}",[5,6,7,8,9,10],[["(\\d{3})(\\d{4,7})","$1 $2",["[89]0"],"0$1"],["(\\d{2})(\\d{7})","$1 $2",["66"],"0$1"],["(\\d)(\\d{8})","$1 $2",["6"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["1[16-8]|2[259]|3[124]|4[17-9]|5[124679]"],"0$1"],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["[1-57-9]"],"0$1"]],"0"],"NO":["47","00","(?:0|[2-9]\\d{3})\\d{4}",[5,8],[["(\\d{3})(\\d{2})(\\d{3})","$1 $2 $3",["[489]|5[89]"]],["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[235-7]"]]],0,0,0,0,0,"[02-689]|7[0-8]"],"NP":["977","00","(?:1\\d|9)\\d{9}|[1-9]\\d{7}",[8,10,11],[["(\\d)(\\d{7})","$1-$2",["1[2-6]"],"0$1"],["(\\d{2})(\\d{6})","$1-$2",["1[01]|[2-8]|9(?:[1-579]|6[2-6])"],"0$1"],["(\\d{3})(\\d{7})","$1-$2",["9"]]],"0"],"NR":["674","00","(?:444|(?:55|8\\d)\\d|666)\\d{4}",[7],[["(\\d{3})(\\d{4})","$1 $2",["[4-68]"]]]],"NU":["683","00","(?:[47]|888\\d)\\d{3}",[4,7],[["(\\d{3})(\\d{4})","$1 $2",["8"]]]],"NZ":["64","0(?:0|161)","[29]\\d{7,9}|50\\d{5}(?:\\d{2,3})?|6[0-35-9]\\d{6}|7\\d{7,8}|8\\d{4,9}|(?:11\\d|[34])\\d{7}",[5,6,7,8,9,10],[["(\\d{2})(\\d{3,8})","$1 $2",["8[1-579]"],"0$1"],["(\\d{3})(\\d{2})(\\d{2,3})","$1 $2 $3",["50[036-8]|[89]0","50(?:[0367]|88)|[89]0"],"0$1"],["(\\d)(\\d{3})(\\d{4})","$1-$2 $3",["24|[346]|7[2-57-9]|9[2-9]"],"0$1"],["(\\d{3})(\\d{3})(\\d{3,4})","$1 $2 $3",["2(?:10|74)|[59]|80"],"0$1"],["(\\d{2})(\\d{3,4})(\\d{4})","$1 $2 $3",["1|2[028]"],"0$1"],["(\\d{2})(\\d{3})(\\d{3,5})","$1 $2 $3",["2(?:[169]|7[0-35-9])|7|86"],"0$1"]],"0",0,0,0,0,0,0,"00"],"OM":["968","00","(?:1505|[279]\\d{3}|500)\\d{4}|800\\d{5,6}",[7,8,9],[["(\\d{3})(\\d{4,6})","$1 $2",["[58]"]],["(\\d{2})(\\d{6})","$1 $2",["2"]],["(\\d{4})(\\d{4})","$1 $2",["[179]"]]]],"PA":["507","00","8\\d{9}|[68]\\d{7}|[1-57-9]\\d{6}",[7,8,10],[["(\\d{3})(\\d{4})","$1-$2",["[1-57-9]"]],["(\\d{4})(\\d{4})","$1-$2",["[68]"]],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["8"]]]],"PE":["51","19(?:1[124]|77|90)00","(?:[14-8]|9\\d)\\d{7}",[8,9],[["(\\d{3})(\\d{5})","$1 $2",["80"],"(0$1)"],["(\\d)(\\d{7})","$1 $2",["1"],"(0$1)"],["(\\d{2})(\\d{6})","$1 $2",["[4-8]"],"(0$1)"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["9"]]],"0",0,0,0,0,0,0,0," Anexo "],"PF":["689","00","[48]\\d{7}|4\\d{5}",[6,8],[["(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3",["44"]],["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[48]"]]]],"PG":["675","00|140[1-3]","(?:180|[78]\\d{3})\\d{4}|(?:[2-589]\\d|64)\\d{5}",[7,8],[["(\\d{3})(\\d{4})","$1 $2",["18|[2-69]|85"]],["(\\d{4})(\\d{4})","$1 $2",["[78]"]]],0,0,0,0,0,0,0,"00"],"PH":["63","00","1800\\d{7,9}|(?:2|[89]\\d{4})\\d{5}|[2-8]\\d{8}|[28]\\d{7}",[6,8,9,10,11,12,13],[["(\\d)(\\d{5})","$1 $2",["2"],"(0$1)"],["(\\d)(\\d{3})(\\d{4})","$1 $2 $3",["2"],"(0$1)"],["(\\d{4})(\\d{4,6})","$1 $2",["3(?:23|39|46)|4(?:2[3-6]|[35]9|4[26]|76)|544|88[245]|(?:52|64|86)2","3(?:230|397|461)|4(?:2(?:35|[46]4|51)|396|4(?:22|63)|59[347]|76[15])|5(?:221|446)|642[23]|8(?:622|8(?:[24]2|5[13]))"],"(0$1)"],["(\\d{5})(\\d{4})","$1 $2",["346|4(?:27|9[35])|883","3469|4(?:279|9(?:30|56))|8834"],"(0$1)"],["(\\d)(\\d{4})(\\d{4})","$1 $2 $3",["2"],"(0$1)"],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["[3-7]|8[2-8]"],"(0$1)"],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["[89]"],"0$1"],["(\\d{4})(\\d{3})(\\d{4})","$1 $2 $3",["1"]],["(\\d{4})(\\d{1,2})(\\d{3})(\\d{4})","$1 $2 $3 $4",["1"]]],"0"],"PK":["92","00","122\\d{6}|[24-8]\\d{10,11}|9(?:[013-9]\\d{8,10}|2(?:[01]\\d\\d|2(?:[06-8]\\d|1[01]))\\d{7})|(?:[2-8]\\d{3}|92(?:[0-7]\\d|8[1-9]))\\d{6}|[24-9]\\d{8}|[89]\\d{7}",[8,9,10,11,12],[["(\\d{3})(\\d{3})(\\d{2,7})","$1 $2 $3",["[89]0"],"0$1"],["(\\d{4})(\\d{5})","$1 $2",["1"]],["(\\d{3})(\\d{6,7})","$1 $2",["2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356])|9(?:2[2-8]|3[27-9]|4[2-6]|6[3569]|9[25-8])","9(?:2[3-8]|98)|(?:2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356])|9(?:22|3[27-9]|4[2-6]|6[3569]|9[25-7]))[2-9]"],"(0$1)"],["(\\d{2})(\\d{7,8})","$1 $2",["(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)[2-9]"],"(0$1)"],["(\\d{5})(\\d{5})","$1 $2",["58"],"(0$1)"],["(\\d{3})(\\d{7})","$1 $2",["3"],"0$1"],["(\\d{2})(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3 $4",["2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91"],"(0$1)"],["(\\d{3})(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3 $4",["[24-9]"],"(0$1)"]],"0"],"PL":["48","00","6\\d{5}(?:\\d{2})?|8\\d{9}|[1-9]\\d{6}(?:\\d{2})?",[6,7,8,9,10],[["(\\d{5})","$1",["19"]],["(\\d{3})(\\d{3})","$1 $2",["11|64"]],["(\\d{2})(\\d{2})(\\d{3})","$1 $2 $3",["(?:1[2-8]|2[2-69]|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145])1","(?:1[2-8]|2[2-69]|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145])19"]],["(\\d{3})(\\d{2})(\\d{2,3})","$1 $2 $3",["64"]],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["39|45|5[0137]|6[0469]|7[02389]|8(?:0[14]|8)"]],["(\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["1[2-8]|[2-7]|8[1-79]|9[145]"]],["(\\d{3})(\\d{3})(\\d{3,4})","$1 $2 $3",["8"]]]],"PM":["508","00","[45]\\d{5}",[6],[["(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3",["[45]"],"0$1"]],"0"],"PR":["1","011","(?:[589]\\d\\d|787)\\d{7}",[10],0,"1",0,0,0,0,"787|939"],"PS":["970","00","[2489]2\\d{6}|(?:1\\d|5)\\d{8}",[8,9,10],[["(\\d)(\\d{3})(\\d{4})","$1 $2 $3",["[2489]"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["5"],"0$1"],["(\\d{4})(\\d{3})(\\d{3})","$1 $2 $3",["1"]]],"0"],"PT":["351","00","(?:[26-9]\\d|30)\\d{7}",[9],[["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["2[12]"]],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[236-9]"]]]],"PW":["680","01[12]","(?:[24-8]\\d\\d|345|900)\\d{4}",[7],[["(\\d{3})(\\d{4})","$1 $2",["[2-9]"]]]],"PY":["595","00","59\\d{4,6}|9\\d{5,10}|(?:[2-46-8]\\d|5[0-8])\\d{4,7}",[6,7,8,9,10,11],[["(\\d{3})(\\d{3,6})","$1 $2",["[2-9]0"],"0$1"],["(\\d{2})(\\d{5})","$1 $2",["[26]1|3[289]|4[1246-8]|7[1-3]|8[1-36]"],"(0$1)"],["(\\d{3})(\\d{4,5})","$1 $2",["2[279]|3[13-5]|4[359]|5|6(?:[34]|7[1-46-8])|7[46-8]|85"],"(0$1)"],["(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["2[14-68]|3[26-9]|4[1246-8]|6(?:1|75)|7[1-35]|8[1-36]"],"(0$1)"],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["87"]],["(\\d{3})(\\d{6})","$1 $2",["9(?:[5-79]|8[1-6])"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[2-8]"],"0$1"],["(\\d{4})(\\d{3})(\\d{4})","$1 $2 $3",["9"]]],"0"],"QA":["974","00","[2-7]\\d{7}|(?:2\\d\\d|800)\\d{4}",[7,8],[["(\\d{3})(\\d{4})","$1 $2",["2[126]|8"]],["(\\d{4})(\\d{4})","$1 $2",["[2-7]"]]]],"RE":["262","00","9769\\d{5}|(?:26|[68]\\d)\\d{7}",[9],[["(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[2689]"],"0$1"]],"0",0,0,0,0,"26[23]|69|[89]"],"RO":["40","00","(?:[237]\\d|[89]0)\\d{7}|[23]\\d{5}",[6,9],[["(\\d{3})(\\d{3})","$1 $2",["2[3-6]","2[3-6]\\d9"],"0$1"],["(\\d{2})(\\d{4})","$1 $2",["219|31"],"0$1"],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["[23]1"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[237-9]"],"0$1"]],"0",0,0,0,0,0,0,0," int "],"RS":["381","00","38[02-9]\\d{6,9}|6\\d{7,9}|90\\d{4,8}|38\\d{5,6}|(?:7\\d\\d|800)\\d{3,9}|(?:[12]\\d|3[0-79])\\d{5,10}",[6,7,8,9,10,11,12],[["(\\d{3})(\\d{3,9})","$1 $2",["(?:2[389]|39)0|[7-9]"],"0$1"],["(\\d{2})(\\d{5,10})","$1 $2",["[1-36]"],"0$1"]],"0"],"RU":["7","810","[347-9]\\d{9}",[10],[["(\\d{4})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["7(?:1[0-8]|2[1-9])","7(?:1(?:[0-6]2|7|8[27])|2(?:1[23]|[2-9]2))","7(?:1(?:[0-6]2|7|8[27])|2(?:13[03-69]|62[013-9]))|72[1-57-9]2"],"8 ($1)",1],["(\\d{5})(\\d)(\\d{2})(\\d{2})","$1 $2 $3 $4",["7(?:1[0-68]|2[1-9])","7(?:1(?:[06][3-6]|[18]|2[35]|[3-5][3-5])|2(?:[13][3-5]|[24-689]|7[457]))","7(?:1(?:0(?:[356]|4[023])|[18]|2(?:3[013-9]|5)|3[45]|43[013-79]|5(?:3[1-8]|4[1-7]|5)|6(?:3[0-35-9]|[4-6]))|2(?:1(?:3[178]|[45])|[24-689]|3[35]|7[457]))|7(?:14|23)4[0-8]|71(?:33|45)[1-79]"],"8 ($1)",1],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["7"],"8 ($1)",1],["(\\d{3})(\\d{3})(\\d{2})(\\d{2})","$1 $2-$3-$4",["[3489]"],"8 ($1)",1]],"8",0,0,0,0,"3[04-689]|[489]",0,"8~10"],"RW":["250","00","(?:06|[27]\\d\\d|[89]00)\\d{6}",[8,9],[["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["0"]],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[7-9]"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["2"]]],"0"],"SA":["966","00","92\\d{7}|(?:[15]|8\\d)\\d{8}",[9,10],[["(\\d{4})(\\d{5})","$1 $2",["9"]],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["1"],"0$1"],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["5"],"0$1"],["(\\d{3})(\\d{3})(\\d{3,4})","$1 $2 $3",["81"],"0$1"],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["8"]]],"0"],"SB":["677","0[01]","(?:[1-6]|[7-9]\\d\\d)\\d{4}",[5,7],[["(\\d{2})(\\d{5})","$1 $2",["7|8[4-9]|9(?:[1-8]|9[0-8])"]]]],"SC":["248","010|0[0-2]","8000\\d{3}|(?:[249]\\d|64)\\d{5}",[7],[["(\\d)(\\d{3})(\\d{3})","$1 $2 $3",["[246]|9[57]"]]],0,0,0,0,0,0,0,"00"],"SD":["249","00","[19]\\d{8}",[9],[["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["[19]"],"0$1"]],"0"],"SE":["46","00","(?:[26]\\d\\d|9)\\d{9}|[1-9]\\d{8}|[1-689]\\d{7}|[1-4689]\\d{6}|2\\d{5}",[6,7,8,9,10],[["(\\d{2})(\\d{2,3})(\\d{2})","$1-$2 $3",["20"],"0$1",0,"$1 $2 $3"],["(\\d{3})(\\d{4})","$1-$2",["9(?:00|39|44)"],"0$1",0,"$1 $2"],["(\\d{2})(\\d{3})(\\d{2})","$1-$2 $3",["[12][136]|3[356]|4[0246]|6[03]|90[1-9]"],"0$1",0,"$1 $2 $3"],["(\\d)(\\d{2,3})(\\d{2})(\\d{2})","$1-$2 $3 $4",["8"],"0$1",0,"$1 $2 $3 $4"],["(\\d{3})(\\d{2,3})(\\d{2})","$1-$2 $3",["1[2457]|2(?:[247-9]|5[0138])|3[0247-9]|4[1357-9]|5[0-35-9]|6(?:[125689]|4[02-57]|7[0-2])|9(?:[125-8]|3[02-5]|4[0-3])"],"0$1",0,"$1 $2 $3"],["(\\d{3})(\\d{2,3})(\\d{3})","$1-$2 $3",["9(?:00|39|44)"],"0$1",0,"$1 $2 $3"],["(\\d{2})(\\d{2,3})(\\d{2})(\\d{2})","$1-$2 $3 $4",["1[13689]|2[0136]|3[1356]|4[0246]|54|6[03]|90[1-9]"],"0$1",0,"$1 $2 $3 $4"],["(\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1-$2 $3 $4",["10|7"],"0$1",0,"$1 $2 $3 $4"],["(\\d)(\\d{3})(\\d{3})(\\d{2})","$1-$2 $3 $4",["8"],"0$1",0,"$1 $2 $3 $4"],["(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1-$2 $3 $4",["[13-5]|2(?:[247-9]|5[0138])|6(?:[124-689]|7[0-2])|9(?:[125-8]|3[02-5]|4[0-3])"],"0$1",0,"$1 $2 $3 $4"],["(\\d{3})(\\d{2})(\\d{2})(\\d{3})","$1-$2 $3 $4",["9"],"0$1",0,"$1 $2 $3 $4"],["(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1-$2 $3 $4 $5",["[26]"],"0$1",0,"$1 $2 $3 $4 $5"]],"0"],"SG":["65","0[0-3]\\d","(?:(?:1\\d|8)\\d\\d|7000)\\d{7}|[3689]\\d{7}",[8,10,11],[["(\\d{4})(\\d{4})","$1 $2",["[369]|8(?:0[1-3]|[1-9])"]],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["8"]],["(\\d{4})(\\d{4})(\\d{3})","$1 $2 $3",["7"]],["(\\d{4})(\\d{3})(\\d{4})","$1 $2 $3",["1"]]]],"SH":["290","00","(?:[256]\\d|8)\\d{3}",[4,5],0,0,0,0,0,0,"[256]"],"SI":["386","00|10(?:22|66|88|99)","[1-7]\\d{7}|8\\d{4,7}|90\\d{4,6}",[5,6,7,8],[["(\\d{2})(\\d{3,6})","$1 $2",["8[09]|9"],"0$1"],["(\\d{3})(\\d{5})","$1 $2",["59|8"],"0$1"],["(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["[37][01]|4[0139]|51|6"],"0$1"],["(\\d)(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[1-57]"],"(0$1)"]],"0",0,0,0,0,0,0,"00"],"SJ":["47","00","0\\d{4}|(?:[4589]\\d|79)\\d{6}",[5,8],0,0,0,0,0,0,"79"],"SK":["421","00","[2-689]\\d{8}|[2-59]\\d{6}|[2-5]\\d{5}",[6,7,9],[["(\\d)(\\d{2})(\\d{3,4})","$1 $2 $3",["21"],"0$1"],["(\\d{2})(\\d{2})(\\d{2,3})","$1 $2 $3",["[3-5][1-8]1","[3-5][1-8]1[67]"],"0$1"],["(\\d)(\\d{3})(\\d{3})(\\d{2})","$1/$2 $3 $4",["2"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[689]"],"0$1"],["(\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1/$2 $3 $4",["[3-5]"],"0$1"]],"0"],"SL":["232","00","(?:[2378]\\d|66|99)\\d{6}",[8],[["(\\d{2})(\\d{6})","$1 $2",["[236-9]"],"(0$1)"]],"0"],"SM":["378","00","(?:0549|[5-7]\\d)\\d{6}",[8,10],[["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[5-7]"]],["(\\d{4})(\\d{6})","$1 $2",["0"]]],0,0,"([89]\\d{5})$","0549$1"],"SN":["221","00","(?:[378]\\d{4}|93330)\\d{4}",[9],[["(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["8"]],["(\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[379]"]]]],"SO":["252","00","[346-9]\\d{8}|[12679]\\d{7}|[1-5]\\d{6}|[1348]\\d{5}",[6,7,8,9],[["(\\d{2})(\\d{4})","$1 $2",["8[125]"]],["(\\d{6})","$1",["[134]"]],["(\\d)(\\d{6})","$1 $2",["[15]|2[0-79]|3[0-46-8]|4[0-7]"]],["(\\d)(\\d{7})","$1 $2",["24|[67]"]],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[3478]|64|90"]],["(\\d{2})(\\d{5,7})","$1 $2",["1|28|6[1-35-9]|9[2-9]"]]],"0"],"SR":["597","00","(?:[2-5]|68|[78]\\d)\\d{5}",[6,7],[["(\\d{2})(\\d{2})(\\d{2})","$1-$2-$3",["56"]],["(\\d{3})(\\d{3})","$1-$2",["[2-5]"]],["(\\d{3})(\\d{4})","$1-$2",["[6-8]"]]]],"SS":["211","00","[19]\\d{8}",[9],[["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[19]"],"0$1"]],"0"],"ST":["239","00","(?:22|9\\d)\\d{5}",[7],[["(\\d{3})(\\d{4})","$1 $2",["[29]"]]]],"SV":["503","00","[267]\\d{7}|[89]00\\d{4}(?:\\d{4})?",[7,8,11],[["(\\d{3})(\\d{4})","$1 $2",["[89]"]],["(\\d{4})(\\d{4})","$1 $2",["[267]"]],["(\\d{3})(\\d{4})(\\d{4})","$1 $2 $3",["[89]"]]]],"SX":["1","011","7215\\d{6}|(?:[58]\\d\\d|900)\\d{7}",[10],0,"1",0,"1|(5\\d{6})$","721$1",0,"721"],"SY":["963","00","[1-39]\\d{8}|[1-5]\\d{7}",[8,9],[["(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["[1-5]"],"0$1",1],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["9"],"0$1",1]],"0"],"SZ":["268","00","0800\\d{4}|(?:[237]\\d|900)\\d{6}",[8,9],[["(\\d{4})(\\d{4})","$1 $2",["[0237]"]],["(\\d{5})(\\d{4})","$1 $2",["9"]]]],"TA":["290","00","8\\d{3}",[4],0,0,0,0,0,0,"8"],"TC":["1","011","(?:[58]\\d\\d|649|900)\\d{7}",[10],0,"1",0,"1|([2-479]\\d{6})$","649$1",0,"649"],"TD":["235","00|16","(?:22|[69]\\d|77)\\d{6}",[8],[["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[2679]"]]],0,0,0,0,0,0,0,"00"],"TG":["228","00","[279]\\d{7}",[8],[["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[279]"]]]],"TH":["66","00[1-9]","1\\d{9}|[1689]\\d{8}|[1-57]\\d{7}",[8,9,10],[["(\\d)(\\d{3})(\\d{4})","$1 $2 $3",["2"],"0$1"],["(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["[13-9]"],"0$1"],["(\\d{4})(\\d{3})(\\d{3})","$1 $2 $3",["1"]]],"0"],"TJ":["992","810","(?:[02]0|11|[3-57-9]\\d)\\d{7}",[9],[["(\\d{6})(\\d)(\\d{2})","$1 $2 $3",["331","3317"],0,1],["(\\d{3})(\\d{2})(\\d{4})","$1 $2 $3",["[34]7|91[78]"],0,1],["(\\d{4})(\\d)(\\d{4})","$1 $2 $3",["3"],0,1],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["[02457-9]|11"],0,1]],"8",0,0,0,0,0,0,"8~10"],"TK":["690","00","[2-47]\\d{3,6}",[4,5,6,7]],"TL":["670","00","7\\d{7}|(?:[2-47]\\d|[89]0)\\d{5}",[7,8],[["(\\d{3})(\\d{4})","$1 $2",["[2-489]|70"]],["(\\d{4})(\\d{4})","$1 $2",["7"]]]],"TM":["993","810","[1-6]\\d{7}",[8],[["(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2-$3-$4",["12"],"(8 $1)"],["(\\d{3})(\\d)(\\d{2})(\\d{2})","$1 $2-$3-$4",["[1-5]"],"(8 $1)"],["(\\d{2})(\\d{6})","$1 $2",["6"],"8 $1"]],"8",0,0,0,0,0,0,"8~10"],"TN":["216","00","[2-57-9]\\d{7}",[8],[["(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["[2-57-9]"]]]],"TO":["676","00","(?:0800|[5-8]\\d{3})\\d{3}|[2-8]\\d{4}",[5,7],[["(\\d{2})(\\d{3})","$1-$2",["[2-4]|50|6[09]|7[0-24-69]|8[05]"]],["(\\d{4})(\\d{3})","$1 $2",["0"]],["(\\d{3})(\\d{4})","$1 $2",["[5-8]"]]]],"TR":["90","00","4\\d{6}|8\\d{11,12}|(?:[2-58]\\d\\d|900)\\d{7}",[7,10,12,13],[["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["512|8[01589]|90"],"0$1",1],["(\\d{3})(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["5(?:[0-59]|61)","5(?:[0-59]|616)","5(?:[0-59]|6161)"],"0$1",1],["(\\d{3})(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[24][1-8]|3[1-9]"],"(0$1)",1],["(\\d{3})(\\d{3})(\\d{6,7})","$1 $2 $3",["80"],"0$1",1]],"0"],"TT":["1","011","(?:[58]\\d\\d|900)\\d{7}",[10],0,"1",0,"1|([2-46-8]\\d{6})$","868$1",0,"868"],"TV":["688","00","(?:2|7\\d\\d|90)\\d{4}",[5,6,7],[["(\\d{2})(\\d{3})","$1 $2",["2"]],["(\\d{2})(\\d{4})","$1 $2",["90"]],["(\\d{2})(\\d{5})","$1 $2",["7"]]]],"TW":["886","0(?:0[25-79]|19)","[2-689]\\d{8}|7\\d{9,10}|[2-8]\\d{7}|2\\d{6}",[7,8,9,10,11],[["(\\d{2})(\\d)(\\d{4})","$1 $2 $3",["202"],"0$1"],["(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["[258]0"],"0$1"],["(\\d)(\\d{3,4})(\\d{4})","$1 $2 $3",["[23568]|4(?:0[02-48]|[1-47-9])|7[1-9]","[23568]|4(?:0[2-48]|[1-47-9])|(?:400|7)[1-9]"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[49]"],"0$1"],["(\\d{2})(\\d{4})(\\d{4,5})","$1 $2 $3",["7"],"0$1"]],"0",0,0,0,0,0,0,0,"#"],"TZ":["255","00[056]","(?:[26-8]\\d|41|90)\\d{7}",[9],[["(\\d{3})(\\d{2})(\\d{4})","$1 $2 $3",["[89]"],"0$1"],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["[24]"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[67]"],"0$1"]],"0"],"UA":["380","00","[89]\\d{9}|[3-9]\\d{8}",[9,10],[["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["6[12][29]|(?:3[1-8]|4[136-8]|5[12457]|6[49])2|(?:56|65)[24]","6[12][29]|(?:35|4[1378]|5[12457]|6[49])2|(?:56|65)[24]|(?:3[1-46-8]|46)2[013-9]"],"0$1"],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["4[45][0-5]|5(?:0|6[37])|6(?:[12][018]|[36-8])|7|89|9[1-9]|(?:48|57)[0137-9]","4[45][0-5]|5(?:0|6(?:3[14-7]|7))|6(?:[12][018]|[36-8])|7|89|9[1-9]|(?:48|57)[0137-9]"],"0$1"],["(\\d{4})(\\d{5})","$1 $2",["[3-6]"],"0$1"],["(\\d{3})(\\d{3})(\\d{3,4})","$1 $2 $3",["[89]"],"0$1"]],"0",0,0,0,0,0,0,"0~0"],"UG":["256","00[057]","800\\d{6}|(?:[29]0|[347]\\d)\\d{7}",[9],[["(\\d{4})(\\d{5})","$1 $2",["202","2024"],"0$1"],["(\\d{3})(\\d{6})","$1 $2",["[27-9]|4(?:6[45]|[7-9])"],"0$1"],["(\\d{2})(\\d{7})","$1 $2",["[34]"],"0$1"]],"0"],"US":["1","011","[2-9]\\d{9}",[10],[["(\\d{3})(\\d{3})(\\d{4})","($1) $2-$3",["[2-9]"],0,1,"$1-$2-$3"]],"1",0,0,0,0,0,[["(?:2(?:0[1-35-9]|1[02-9]|2[03-589]|3[149]|4[08]|5[1-46]|6[0279]|7[0269]|8[13])|3(?:0[1-57-9]|1[02-9]|2[01356]|3[0-24679]|4[167]|5[12]|6[014]|8[056])|4(?:0[124-9]|1[02-579]|2[3-5]|3[0245]|4[0235]|58|6[39]|7[0589]|8[04])|5(?:0[1-57-9]|1[0235-8]|20|3[0149]|4[01]|5[19]|6[1-47]|7[013-5]|8[056])|6(?:0[1-35-9]|1[024-9]|2[03689]|[34][016]|5[0179]|6[0-279]|78|8[0-29])|7(?:0[1-46-8]|1[2-9]|2[04-7]|3[1247]|4[037]|5[47]|6[02359]|7[02-59]|8[156])|8(?:0[1-68]|1[02-8]|2[08]|3[0-289]|4[3578]|5[046-9]|6[02-5]|7[028])|9(?:0[1346-9]|1[02-9]|2[0589]|3[0146-8]|4[0179]|5[12469]|7[0-389]|8[04-69]))[2-9]\\d{6}"],[""],["8(?:00|33|44|55|66|77|88)[2-9]\\d{6}"],["900[2-9]\\d{6}"],["52(?:3(?:[2-46-9][02-9]\\d|5(?:[02-46-9]\\d|5[0-46-9]))|4(?:[2-478][02-9]\\d|5(?:[034]\\d|2[024-9]|5[0-46-9])|6(?:0[1-9]|[2-9]\\d)|9(?:[05-9]\\d|2[0-5]|49)))\\d{4}|52[34][2-9]1[02-9]\\d{4}|5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}"]]],"UY":["598","0(?:0|1[3-9]\\d)","4\\d{9}|[249]\\d{7}|(?:[49]\\d|80)\\d{5}",[7,8,10],[["(\\d{3})(\\d{4})","$1 $2",["405|8|90"],"0$1"],["(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["9"],"0$1"],["(\\d{4})(\\d{4})","$1 $2",["[24]"]],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["4"],"0$1"]],"0",0,0,0,0,0,0,"00"," int. "],"UZ":["998","810","55501\\d{4}|(?:33|[679]\\d|88)\\d{7}",[9],[["(\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[35-9]"],"8 $1"]],"8",0,0,0,0,0,0,"8~10"],"VA":["39","00","0\\d{5,10}|3[0-8]\\d{7,10}|55\\d{8}|8\\d{5}(?:\\d{2,4})?|(?:1\\d|39)\\d{7,8}",[6,7,8,9,10,11],0,0,0,0,0,0,"06698"],"VC":["1","011","(?:[58]\\d\\d|784|900)\\d{7}",[10],0,"1",0,"1|([2-7]\\d{6})$","784$1",0,"784"],"VE":["58","00","[68]00\\d{7}|(?:[24]\\d|[59]0)\\d{8}",[10],[["(\\d{3})(\\d{7})","$1-$2",["[24-689]"],"0$1"]],"0"],"VG":["1","011","(?:284|[58]\\d\\d|900)\\d{7}",[10],0,"1",0,"1|([2-578]\\d{6})$","284$1",0,"284"],"VI":["1","011","[58]\\d{9}|(?:34|90)0\\d{7}",[10],0,"1",0,"1|([2-9]\\d{6})$","340$1",0,"340"],"VN":["84","00","[12]\\d{9}|[135-9]\\d{8}|[16]\\d{7}|[16-8]\\d{6}",[7,8,9,10],[["(\\d{2})(\\d{5})","$1 $2",["80"],"0$1",1],["(\\d{4})(\\d{4,6})","$1 $2",["1"],0,1],["(\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[69]"],"0$1",1],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[3578]"],"0$1",1],["(\\d{2})(\\d{4})(\\d{4})","$1 $2 $3",["2[48]"],"0$1",1],["(\\d{3})(\\d{4})(\\d{3})","$1 $2 $3",["2"],"0$1",1]],"0"],"VU":["678","00","[48]8\\d{3}|(?:[23]|[579]\\d\\d)\\d{4}",[5,7],[["(\\d{3})(\\d{4})","$1 $2",["[579]"]]]],"WF":["681","00","(?:[45]0|68|72|8\\d)\\d{4}",[6],[["(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3",["[4-8]"]]]],"WS":["685","0","(?:[2-6]|8\\d{5})\\d{4}|[78]\\d{6}|[68]\\d{5}",[5,6,7,10],[["(\\d{5})","$1",["[2-5]|6[1-9]"]],["(\\d{3})(\\d{3,7})","$1 $2",["[68]"]],["(\\d{2})(\\d{5})","$1 $2",["7"]]]],"XK":["383","00","[23]\\d{7,8}|(?:4\\d\\d|[89]00)\\d{5}",[8,9],[["(\\d{3})(\\d{5})","$1 $2",["[89]"],"0$1"],["(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["[2-4]"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[23]"],"0$1"]],"0"],"YE":["967","00","(?:1|7\\d)\\d{7}|[1-7]\\d{6}",[7,8,9],[["(\\d)(\\d{3})(\\d{3,4})","$1 $2 $3",["[1-6]|7[24-68]"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["7"],"0$1"]],"0"],"YT":["262","00","80\\d{7}|(?:26|63)9\\d{6}",[9],0,"0",0,0,0,0,"269|63"],"ZA":["27","00","[1-79]\\d{8}|8\\d{4,9}",[5,6,7,8,9,10],[["(\\d{2})(\\d{3,4})","$1 $2",["8[1-4]"],"0$1"],["(\\d{2})(\\d{3})(\\d{2,3})","$1 $2 $3",["8[1-4]"],"0$1"],["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["860"],"0$1"],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["[1-9]"],"0$1"],["(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["8"],"0$1"]],"0"],"ZM":["260","00","(?:63|80)0\\d{6}|(?:21|[79]\\d)\\d{7}",[9],[["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[28]"],"0$1"],["(\\d{2})(\\d{7})","$1 $2",["[79]"],"0$1"]],"0"],"ZW":["263","00","2(?:[0-57-9]\\d{6,8}|6[0-24-9]\\d{6,7})|[38]\\d{9}|[35-8]\\d{8}|[3-6]\\d{7}|[1-689]\\d{6}|[1-3569]\\d{5}|[1356]\\d{4}",[5,6,7,8,9,10],[["(\\d{3})(\\d{3,5})","$1 $2",["2(?:0[45]|2[278]|[49]8)|3(?:[09]8|17)|6(?:[29]8|37|75)|[23][78]|(?:33|5[15]|6[68])[78]"],"0$1"],["(\\d)(\\d{3})(\\d{2,4})","$1 $2 $3",["[49]"],"0$1"],["(\\d{3})(\\d{4})","$1 $2",["80"],"0$1"],["(\\d{2})(\\d{7})","$1 $2",["24|8[13-59]|(?:2[05-79]|39|5[45]|6[15-8])2","2(?:02[014]|4|[56]20|[79]2)|392|5(?:42|525)|6(?:[16-8]21|52[013])|8[13-59]"],"(0$1)"],["(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["7"],"0$1"],["(\\d{3})(\\d{3})(\\d{3,4})","$1 $2 $3",["2(?:1[39]|2[0157]|[378]|[56][14])|3(?:12|29)","2(?:1[39]|2[0157]|[378]|[56][14])|3(?:123|29)"],"0$1"],["(\\d{4})(\\d{6})","$1 $2",["8"],"0$1"],["(\\d{2})(\\d{3,5})","$1 $2",["1|2(?:0[0-36-9]|12|29|[56])|3(?:1[0-689]|[24-6])|5(?:[0236-9]|1[2-4])|6(?:[013-59]|7[0-46-9])|(?:33|55|6[68])[0-69]|(?:29|3[09]|62)[0-79]"],"0$1"],["(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["29[013-9]|39|54"],"0$1"],["(\\d{4})(\\d{3,5})","$1 $2",["(?:25|54)8","258|5483"],"0$1"]],"0"]},"nonGeographic":{"800":["800",0,"[1-9]\\d{7}",[8],[["(\\d{4})(\\d{4})","$1 $2",["[1-9]"]]],0,0,0,0,0,0,[0,0,["[1-9]\\d{7}"]]],"808":["808",0,"[1-9]\\d{7}",[8],[["(\\d{4})(\\d{4})","$1 $2",["[1-9]"]]],0,0,0,0,0,0,[0,0,0,0,0,0,0,0,0,["[1-9]\\d{7}"]]],"870":["870",0,"7\\d{11}|[35-7]\\d{8}",[9,12],[["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[35-7]"]]],0,0,0,0,0,0,[0,["(?:[356]|774[45])\\d{8}|7[6-8]\\d{7}"]]],"878":["878",0,"10\\d{10}",[12],[["(\\d{2})(\\d{5})(\\d{5})","$1 $2 $3",["1"]]],0,0,0,0,0,0,[0,0,0,0,0,0,0,0,["10\\d{10}"]]],"881":["881",0,"[0-36-9]\\d{8}",[9],[["(\\d)(\\d{3})(\\d{5})","$1 $2 $3",["[0-36-9]"]]],0,0,0,0,0,0,[0,["[0-36-9]\\d{8}"]]],"882":["882",0,"[13]\\d{6}(?:\\d{2,5})?|285\\d{9}|[19]\\d{7}",[7,8,9,10,11,12],[["(\\d{2})(\\d{5})","$1 $2",["16|342"]],["(\\d{2})(\\d{2})(\\d{4})","$1 $2 $3",["[19]"]],["(\\d{2})(\\d{4})(\\d{3})","$1 $2 $3",["3[23]"]],["(\\d{2})(\\d{3,4})(\\d{4})","$1 $2 $3",["1"]],["(\\d{2})(\\d{4})(\\d{4})","$1 $2 $3",["34[57]"]],["(\\d{3})(\\d{4})(\\d{4})","$1 $2 $3",["34"]],["(\\d{2})(\\d{4,5})(\\d{5})","$1 $2 $3",["[1-3]"]]],0,0,0,0,0,0,[0,["3(?:37\\d\\d|42)\\d{4}|3(?:2|47|7\\d{3})\\d{7}",[7,9,10,12]],0,0,0,0,0,0,["1(?:3(?:0[0347]|[13][0139]|2[035]|4[013568]|6[0459]|7[06]|8[15-8]|9[0689])\\d{4}|6\\d{5,10})|(?:(?:285\\d\\d|3(?:45|[69]\\d{3}))\\d|9[89])\\d{6}"]]],"883":["883",0,"51\\d{7}(?:\\d{3})?",[9,12],[["(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["510"]],["(\\d{3})(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3 $4",["510"]],["(\\d{4})(\\d{4})(\\d{4})","$1 $2 $3",["5"]]],0,0,0,0,0,0,[0,0,0,0,0,0,0,0,["51[013]0\\d{8}|5100\\d{5}"]]],"888":["888",0,"\\d{11}",[11],[["(\\d{3})(\\d{3})(\\d{5})","$1 $2 $3"]],0,0,0,0,0,0,[0,0,0,0,0,0,["\\d{11}"]]],"979":["979",0,"[1359]\\d{8}",[9],[["(\\d)(\\d{4})(\\d{4})","$1 $2 $3",["[1359]"]]],0,0,0,0,0,0,[0,0,0,["[1359]\\d{8}"]]]}}
},{}],71:[function(require,module,exports){
'use strict'

var metadata = require('../metadata.min.json')
var core = require('../core/index.commonjs')

function call(func, _arguments) {
	var args = Array.prototype.slice.call(_arguments)
	args.push(metadata)
	return func.apply(this, args)
}

function parsePhoneNumberFromString() {
	return call(core.parsePhoneNumberFromString, arguments)
}

// ES5 `require()` "default" "interoperability" hack.
// https://github.com/babel/babel/issues/2212#issuecomment-131827986
// An alternative approach:
// https://www.npmjs.com/package/babel-plugin-add-module-exports
exports = module.exports = parsePhoneNumberFromString
exports['default'] = parsePhoneNumberFromString

exports.ParseError = core.ParseError

function parsePhoneNumberWithError() {
	return call(core.parsePhoneNumberWithError, arguments)
}

// `parsePhoneNumber()` named export has been renamed to `parsePhoneNumberWithError()`.
exports.parsePhoneNumber = parsePhoneNumberWithError
exports.parsePhoneNumberWithError = parsePhoneNumberWithError

// `parsePhoneNumberFromString()` named export is now considered legacy:
// it has been promoted to a default export due to being too verbose.
exports.parsePhoneNumberFromString = parsePhoneNumberFromString

exports.findNumbers = function findNumbers() {
	return call(core.findNumbers, arguments)
}

exports.searchNumbers = function searchNumbers() {
	return call(core.searchNumbers, arguments)
}

exports.findPhoneNumbersInText = function findPhoneNumbersInText() {
	return call(core.findPhoneNumbersInText, arguments)
}

exports.searchPhoneNumbersInText = function searchPhoneNumbersInText() {
	return call(core.searchPhoneNumbersInText, arguments)
}

exports.PhoneNumberMatcher = function PhoneNumberMatcher(text, options) {
	return core.PhoneNumberMatcher.call(this, text, options, metadata)
}
exports.PhoneNumberMatcher.prototype = Object.create(core.PhoneNumberMatcher.prototype, {})
exports.PhoneNumberMatcher.prototype.constructor = exports.PhoneNumberMatcher

exports.AsYouType = function AsYouType(country) {
	return core.AsYouType.call(this, country, metadata)
}
exports.AsYouType.prototype = Object.create(core.AsYouType.prototype, {})
exports.AsYouType.prototype.constructor = exports.AsYouType

exports.isSupportedCountry = function isSupportedCountry(country) {
	return call(core.isSupportedCountry, arguments)
}

exports.getCountries = function getCountries() {
	return call(core.getCountries, arguments)
}

exports.getCountryCallingCode = function getCountryCallingCode() {
	return call(core.getCountryCallingCode, arguments)
}

exports.getExtPrefix = function getExtPrefix(country) {
	return call(core.getExtPrefix, arguments)
}

exports.getExampleNumber = function getExampleNumber() {
	return call(core.getExampleNumber, arguments)
}

exports.Metadata = function Metadata() {
	return core.Metadata.call(this, metadata)
}
exports.Metadata.prototype = Object.create(core.Metadata.prototype, {})
exports.Metadata.prototype.constructor = exports.Metadata

exports.formatIncompletePhoneNumber = function formatIncompletePhoneNumber() {
	return call(core.formatIncompletePhoneNumber, arguments)
}

exports.parseIncompletePhoneNumber = core.parseIncompletePhoneNumber
exports.parsePhoneNumberCharacter = core.parsePhoneNumberCharacter
exports.parseDigits = core.parseDigits
exports.DIGIT_PLACEHOLDER = core.DIGIT_PLACEHOLDER

exports.parseRFC3966 = core.parseRFC3966
exports.formatRFC3966 = core.formatRFC3966
},{"../core/index.commonjs":68,"../metadata.min.json":70}],72:[function(require,module,exports){
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.mongoose=e():t.mongoose=e()}("undefined"!=typeof self?self:this,(function(){return function(t){var e={};function r(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,r),o.l=!0,o.exports}return r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)r.d(n,o,function(e){return t[e]}.bind(null,o));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=93)}([function(t,e,r){"use strict";e.arrayAtomicsSymbol=Symbol("mongoose#Array#_atomics"),e.arrayParentSymbol=Symbol("mongoose#Array#_parent"),e.arrayPathSymbol=Symbol("mongoose#Array#_path"),e.arraySchemaSymbol=Symbol("mongoose#Array#_schema"),e.documentArrayParent=Symbol("mongoose:documentArrayParent"),e.documentIsSelected=Symbol("mongoose#Document#isSelected"),e.documentIsModified=Symbol("mongoose#Document#isModified"),e.documentModifiedPaths=Symbol("mongoose#Document#modifiedPaths"),e.documentSchemaSymbol=Symbol("mongoose#Document#schema"),e.getSymbol=Symbol("mongoose#Document#get"),e.modelSymbol=Symbol("mongoose#Model"),e.objectIdSymbol=Symbol("mongoose#ObjectId"),e.populateModelSymbol=Symbol("mongoose.PopulateOptions#Model"),e.schemaTypeSymbol=Symbol("mongoose#schemaType"),e.sessionNewDocuments=Symbol("mongoose:ClientSession#newDocuments"),e.scopeSymbol=Symbol("mongoose#Document#scope"),e.validatorErrorSymbol=Symbol("mongoose:validatorError")},function(t,e,r){"use strict";(function(t){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <http://feross.org>
 * @license  MIT
 */
var n=r(95),o=r(96),i=r(97);function s(){return u.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function a(t,e){if(s()<e)throw new RangeError("Invalid typed array length");return u.TYPED_ARRAY_SUPPORT?(t=new Uint8Array(e)).__proto__=u.prototype:(null===t&&(t=new u(e)),t.length=e),t}function u(t,e,r){if(!(u.TYPED_ARRAY_SUPPORT||this instanceof u))return new u(t,e,r);if("number"==typeof t){if("string"==typeof e)throw new Error("If encoding is specified then the first argument must be a string");return f(this,t)}return c(this,t,e,r)}function c(t,e,r,n){if("number"==typeof e)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&e instanceof ArrayBuffer?function(t,e,r,n){if(e.byteLength,r<0||e.byteLength<r)throw new RangeError("'offset' is out of bounds");if(e.byteLength<r+(n||0))throw new RangeError("'length' is out of bounds");e=void 0===r&&void 0===n?new Uint8Array(e):void 0===n?new Uint8Array(e,r):new Uint8Array(e,r,n);u.TYPED_ARRAY_SUPPORT?(t=e).__proto__=u.prototype:t=p(t,e);return t}(t,e,r,n):"string"==typeof e?function(t,e,r){"string"==typeof r&&""!==r||(r="utf8");if(!u.isEncoding(r))throw new TypeError('"encoding" must be a valid string encoding');var n=0|y(e,r),o=(t=a(t,n)).write(e,r);o!==n&&(t=t.slice(0,o));return t}(t,e,r):function(t,e){if(u.isBuffer(e)){var r=0|h(e.length);return 0===(t=a(t,r)).length||e.copy(t,0,0,r),t}if(e){if("undefined"!=typeof ArrayBuffer&&e.buffer instanceof ArrayBuffer||"length"in e)return"number"!=typeof e.length||(n=e.length)!=n?a(t,0):p(t,e);if("Buffer"===e.type&&i(e.data))return p(t,e.data)}var n;throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}(t,e)}function l(t){if("number"!=typeof t)throw new TypeError('"size" argument must be a number');if(t<0)throw new RangeError('"size" argument must not be negative')}function f(t,e){if(l(e),t=a(t,e<0?0:0|h(e)),!u.TYPED_ARRAY_SUPPORT)for(var r=0;r<e;++r)t[r]=0;return t}function p(t,e){var r=e.length<0?0:0|h(e.length);t=a(t,r);for(var n=0;n<r;n+=1)t[n]=255&e[n];return t}function h(t){if(t>=s())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+s().toString(16)+" bytes");return 0|t}function y(t,e){if(u.isBuffer(t))return t.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(t)||t instanceof ArrayBuffer))return t.byteLength;"string"!=typeof t&&(t=""+t);var r=t.length;if(0===r)return 0;for(var n=!1;;)switch(e){case"ascii":case"latin1":case"binary":return r;case"utf8":case"utf-8":case void 0:return L(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*r;case"hex":return r>>>1;case"base64":return U(t).length;default:if(n)return L(t).length;e=(""+e).toLowerCase(),n=!0}}function d(t,e,r){var n=!1;if((void 0===e||e<0)&&(e=0),e>this.length)return"";if((void 0===r||r>this.length)&&(r=this.length),r<=0)return"";if((r>>>=0)<=(e>>>=0))return"";for(t||(t="utf8");;)switch(t){case"hex":return x(this,e,r);case"utf8":case"utf-8":return j(this,e,r);case"ascii":return $(this,e,r);case"latin1":case"binary":return P(this,e,r);case"base64":return E(this,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return N(this,e,r);default:if(n)throw new TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),n=!0}}function _(t,e,r){var n=t[e];t[e]=t[r],t[r]=n}function m(t,e,r,n,o){if(0===t.length)return-1;if("string"==typeof r?(n=r,r=0):r>2147483647?r=2147483647:r<-2147483648&&(r=-2147483648),r=+r,isNaN(r)&&(r=o?0:t.length-1),r<0&&(r=t.length+r),r>=t.length){if(o)return-1;r=t.length-1}else if(r<0){if(!o)return-1;r=0}if("string"==typeof e&&(e=u.from(e,n)),u.isBuffer(e))return 0===e.length?-1:v(t,e,r,n,o);if("number"==typeof e)return e&=255,u.TYPED_ARRAY_SUPPORT&&"function"==typeof Uint8Array.prototype.indexOf?o?Uint8Array.prototype.indexOf.call(t,e,r):Uint8Array.prototype.lastIndexOf.call(t,e,r):v(t,[e],r,n,o);throw new TypeError("val must be string, number or Buffer")}function v(t,e,r,n,o){var i,s=1,a=t.length,u=e.length;if(void 0!==n&&("ucs2"===(n=String(n).toLowerCase())||"ucs-2"===n||"utf16le"===n||"utf-16le"===n)){if(t.length<2||e.length<2)return-1;s=2,a/=2,u/=2,r/=2}function c(t,e){return 1===s?t[e]:t.readUInt16BE(e*s)}if(o){var l=-1;for(i=r;i<a;i++)if(c(t,i)===c(e,-1===l?0:i-l)){if(-1===l&&(l=i),i-l+1===u)return l*s}else-1!==l&&(i-=i-l),l=-1}else for(r+u>a&&(r=a-u),i=r;i>=0;i--){for(var f=!0,p=0;p<u;p++)if(c(t,i+p)!==c(e,p)){f=!1;break}if(f)return i}return-1}function g(t,e,r,n){r=Number(r)||0;var o=t.length-r;n?(n=Number(n))>o&&(n=o):n=o;var i=e.length;if(i%2!=0)throw new TypeError("Invalid hex string");n>i/2&&(n=i/2);for(var s=0;s<n;++s){var a=parseInt(e.substr(2*s,2),16);if(isNaN(a))return s;t[r+s]=a}return s}function b(t,e,r,n){return V(L(e,t.length-r),t,r,n)}function w(t,e,r,n){return V(function(t){for(var e=[],r=0;r<t.length;++r)e.push(255&t.charCodeAt(r));return e}(e),t,r,n)}function O(t,e,r,n){return w(t,e,r,n)}function S(t,e,r,n){return V(U(e),t,r,n)}function A(t,e,r,n){return V(function(t,e){for(var r,n,o,i=[],s=0;s<t.length&&!((e-=2)<0);++s)r=t.charCodeAt(s),n=r>>8,o=r%256,i.push(o),i.push(n);return i}(e,t.length-r),t,r,n)}function E(t,e,r){return 0===e&&r===t.length?n.fromByteArray(t):n.fromByteArray(t.slice(e,r))}function j(t,e,r){r=Math.min(t.length,r);for(var n=[],o=e;o<r;){var i,s,a,u,c=t[o],l=null,f=c>239?4:c>223?3:c>191?2:1;if(o+f<=r)switch(f){case 1:c<128&&(l=c);break;case 2:128==(192&(i=t[o+1]))&&(u=(31&c)<<6|63&i)>127&&(l=u);break;case 3:i=t[o+1],s=t[o+2],128==(192&i)&&128==(192&s)&&(u=(15&c)<<12|(63&i)<<6|63&s)>2047&&(u<55296||u>57343)&&(l=u);break;case 4:i=t[o+1],s=t[o+2],a=t[o+3],128==(192&i)&&128==(192&s)&&128==(192&a)&&(u=(15&c)<<18|(63&i)<<12|(63&s)<<6|63&a)>65535&&u<1114112&&(l=u)}null===l?(l=65533,f=1):l>65535&&(l-=65536,n.push(l>>>10&1023|55296),l=56320|1023&l),n.push(l),o+=f}return function(t){var e=t.length;if(e<=4096)return String.fromCharCode.apply(String,t);var r="",n=0;for(;n<e;)r+=String.fromCharCode.apply(String,t.slice(n,n+=4096));return r}(n)}e.Buffer=u,e.SlowBuffer=function(t){+t!=t&&(t=0);return u.alloc(+t)},e.INSPECT_MAX_BYTES=50,u.TYPED_ARRAY_SUPPORT=void 0!==t.TYPED_ARRAY_SUPPORT?t.TYPED_ARRAY_SUPPORT:function(){try{var t=new Uint8Array(1);return t.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===t.foo()&&"function"==typeof t.subarray&&0===t.subarray(1,1).byteLength}catch(t){return!1}}(),e.kMaxLength=s(),u.poolSize=8192,u._augment=function(t){return t.__proto__=u.prototype,t},u.from=function(t,e,r){return c(null,t,e,r)},u.TYPED_ARRAY_SUPPORT&&(u.prototype.__proto__=Uint8Array.prototype,u.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&u[Symbol.species]===u&&Object.defineProperty(u,Symbol.species,{value:null,configurable:!0})),u.alloc=function(t,e,r){return function(t,e,r,n){return l(e),e<=0?a(t,e):void 0!==r?"string"==typeof n?a(t,e).fill(r,n):a(t,e).fill(r):a(t,e)}(null,t,e,r)},u.allocUnsafe=function(t){return f(null,t)},u.allocUnsafeSlow=function(t){return f(null,t)},u.isBuffer=function(t){return!(null==t||!t._isBuffer)},u.compare=function(t,e){if(!u.isBuffer(t)||!u.isBuffer(e))throw new TypeError("Arguments must be Buffers");if(t===e)return 0;for(var r=t.length,n=e.length,o=0,i=Math.min(r,n);o<i;++o)if(t[o]!==e[o]){r=t[o],n=e[o];break}return r<n?-1:n<r?1:0},u.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},u.concat=function(t,e){if(!i(t))throw new TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return u.alloc(0);var r;if(void 0===e)for(e=0,r=0;r<t.length;++r)e+=t[r].length;var n=u.allocUnsafe(e),o=0;for(r=0;r<t.length;++r){var s=t[r];if(!u.isBuffer(s))throw new TypeError('"list" argument must be an Array of Buffers');s.copy(n,o),o+=s.length}return n},u.byteLength=y,u.prototype._isBuffer=!0,u.prototype.swap16=function(){var t=this.length;if(t%2!=0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var e=0;e<t;e+=2)_(this,e,e+1);return this},u.prototype.swap32=function(){var t=this.length;if(t%4!=0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var e=0;e<t;e+=4)_(this,e,e+3),_(this,e+1,e+2);return this},u.prototype.swap64=function(){var t=this.length;if(t%8!=0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(var e=0;e<t;e+=8)_(this,e,e+7),_(this,e+1,e+6),_(this,e+2,e+5),_(this,e+3,e+4);return this},u.prototype.toString=function(){var t=0|this.length;return 0===t?"":0===arguments.length?j(this,0,t):d.apply(this,arguments)},u.prototype.equals=function(t){if(!u.isBuffer(t))throw new TypeError("Argument must be a Buffer");return this===t||0===u.compare(this,t)},u.prototype.inspect=function(){var t="",r=e.INSPECT_MAX_BYTES;return this.length>0&&(t=this.toString("hex",0,r).match(/.{2}/g).join(" "),this.length>r&&(t+=" ... ")),"<Buffer "+t+">"},u.prototype.compare=function(t,e,r,n,o){if(!u.isBuffer(t))throw new TypeError("Argument must be a Buffer");if(void 0===e&&(e=0),void 0===r&&(r=t?t.length:0),void 0===n&&(n=0),void 0===o&&(o=this.length),e<0||r>t.length||n<0||o>this.length)throw new RangeError("out of range index");if(n>=o&&e>=r)return 0;if(n>=o)return-1;if(e>=r)return 1;if(this===t)return 0;for(var i=(o>>>=0)-(n>>>=0),s=(r>>>=0)-(e>>>=0),a=Math.min(i,s),c=this.slice(n,o),l=t.slice(e,r),f=0;f<a;++f)if(c[f]!==l[f]){i=c[f],s=l[f];break}return i<s?-1:s<i?1:0},u.prototype.includes=function(t,e,r){return-1!==this.indexOf(t,e,r)},u.prototype.indexOf=function(t,e,r){return m(this,t,e,r,!0)},u.prototype.lastIndexOf=function(t,e,r){return m(this,t,e,r,!1)},u.prototype.write=function(t,e,r,n){if(void 0===e)n="utf8",r=this.length,e=0;else if(void 0===r&&"string"==typeof e)n=e,r=this.length,e=0;else{if(!isFinite(e))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");e|=0,isFinite(r)?(r|=0,void 0===n&&(n="utf8")):(n=r,r=void 0)}var o=this.length-e;if((void 0===r||r>o)&&(r=o),t.length>0&&(r<0||e<0)||e>this.length)throw new RangeError("Attempt to write outside buffer bounds");n||(n="utf8");for(var i=!1;;)switch(n){case"hex":return g(this,t,e,r);case"utf8":case"utf-8":return b(this,t,e,r);case"ascii":return w(this,t,e,r);case"latin1":case"binary":return O(this,t,e,r);case"base64":return S(this,t,e,r);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return A(this,t,e,r);default:if(i)throw new TypeError("Unknown encoding: "+n);n=(""+n).toLowerCase(),i=!0}},u.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function $(t,e,r){var n="";r=Math.min(t.length,r);for(var o=e;o<r;++o)n+=String.fromCharCode(127&t[o]);return n}function P(t,e,r){var n="";r=Math.min(t.length,r);for(var o=e;o<r;++o)n+=String.fromCharCode(t[o]);return n}function x(t,e,r){var n=t.length;(!e||e<0)&&(e=0),(!r||r<0||r>n)&&(r=n);for(var o="",i=e;i<r;++i)o+=F(t[i]);return o}function N(t,e,r){for(var n=t.slice(e,r),o="",i=0;i<n.length;i+=2)o+=String.fromCharCode(n[i]+256*n[i+1]);return o}function T(t,e,r){if(t%1!=0||t<0)throw new RangeError("offset is not uint");if(t+e>r)throw new RangeError("Trying to access beyond buffer length")}function k(t,e,r,n,o,i){if(!u.isBuffer(t))throw new TypeError('"buffer" argument must be a Buffer instance');if(e>o||e<i)throw new RangeError('"value" argument is out of bounds');if(r+n>t.length)throw new RangeError("Index out of range")}function C(t,e,r,n){e<0&&(e=65535+e+1);for(var o=0,i=Math.min(t.length-r,2);o<i;++o)t[r+o]=(e&255<<8*(n?o:1-o))>>>8*(n?o:1-o)}function R(t,e,r,n){e<0&&(e=4294967295+e+1);for(var o=0,i=Math.min(t.length-r,4);o<i;++o)t[r+o]=e>>>8*(n?o:3-o)&255}function D(t,e,r,n,o,i){if(r+n>t.length)throw new RangeError("Index out of range");if(r<0)throw new RangeError("Index out of range")}function B(t,e,r,n,i){return i||D(t,0,r,4),o.write(t,e,r,n,23,4),r+4}function M(t,e,r,n,i){return i||D(t,0,r,8),o.write(t,e,r,n,52,8),r+8}u.prototype.slice=function(t,e){var r,n=this.length;if((t=~~t)<0?(t+=n)<0&&(t=0):t>n&&(t=n),(e=void 0===e?n:~~e)<0?(e+=n)<0&&(e=0):e>n&&(e=n),e<t&&(e=t),u.TYPED_ARRAY_SUPPORT)(r=this.subarray(t,e)).__proto__=u.prototype;else{var o=e-t;r=new u(o,void 0);for(var i=0;i<o;++i)r[i]=this[i+t]}return r},u.prototype.readUIntLE=function(t,e,r){t|=0,e|=0,r||T(t,e,this.length);for(var n=this[t],o=1,i=0;++i<e&&(o*=256);)n+=this[t+i]*o;return n},u.prototype.readUIntBE=function(t,e,r){t|=0,e|=0,r||T(t,e,this.length);for(var n=this[t+--e],o=1;e>0&&(o*=256);)n+=this[t+--e]*o;return n},u.prototype.readUInt8=function(t,e){return e||T(t,1,this.length),this[t]},u.prototype.readUInt16LE=function(t,e){return e||T(t,2,this.length),this[t]|this[t+1]<<8},u.prototype.readUInt16BE=function(t,e){return e||T(t,2,this.length),this[t]<<8|this[t+1]},u.prototype.readUInt32LE=function(t,e){return e||T(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},u.prototype.readUInt32BE=function(t,e){return e||T(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},u.prototype.readIntLE=function(t,e,r){t|=0,e|=0,r||T(t,e,this.length);for(var n=this[t],o=1,i=0;++i<e&&(o*=256);)n+=this[t+i]*o;return n>=(o*=128)&&(n-=Math.pow(2,8*e)),n},u.prototype.readIntBE=function(t,e,r){t|=0,e|=0,r||T(t,e,this.length);for(var n=e,o=1,i=this[t+--n];n>0&&(o*=256);)i+=this[t+--n]*o;return i>=(o*=128)&&(i-=Math.pow(2,8*e)),i},u.prototype.readInt8=function(t,e){return e||T(t,1,this.length),128&this[t]?-1*(255-this[t]+1):this[t]},u.prototype.readInt16LE=function(t,e){e||T(t,2,this.length);var r=this[t]|this[t+1]<<8;return 32768&r?4294901760|r:r},u.prototype.readInt16BE=function(t,e){e||T(t,2,this.length);var r=this[t+1]|this[t]<<8;return 32768&r?4294901760|r:r},u.prototype.readInt32LE=function(t,e){return e||T(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},u.prototype.readInt32BE=function(t,e){return e||T(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},u.prototype.readFloatLE=function(t,e){return e||T(t,4,this.length),o.read(this,t,!0,23,4)},u.prototype.readFloatBE=function(t,e){return e||T(t,4,this.length),o.read(this,t,!1,23,4)},u.prototype.readDoubleLE=function(t,e){return e||T(t,8,this.length),o.read(this,t,!0,52,8)},u.prototype.readDoubleBE=function(t,e){return e||T(t,8,this.length),o.read(this,t,!1,52,8)},u.prototype.writeUIntLE=function(t,e,r,n){(t=+t,e|=0,r|=0,n)||k(this,t,e,r,Math.pow(2,8*r)-1,0);var o=1,i=0;for(this[e]=255&t;++i<r&&(o*=256);)this[e+i]=t/o&255;return e+r},u.prototype.writeUIntBE=function(t,e,r,n){(t=+t,e|=0,r|=0,n)||k(this,t,e,r,Math.pow(2,8*r)-1,0);var o=r-1,i=1;for(this[e+o]=255&t;--o>=0&&(i*=256);)this[e+o]=t/i&255;return e+r},u.prototype.writeUInt8=function(t,e,r){return t=+t,e|=0,r||k(this,t,e,1,255,0),u.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),this[e]=255&t,e+1},u.prototype.writeUInt16LE=function(t,e,r){return t=+t,e|=0,r||k(this,t,e,2,65535,0),u.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):C(this,t,e,!0),e+2},u.prototype.writeUInt16BE=function(t,e,r){return t=+t,e|=0,r||k(this,t,e,2,65535,0),u.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):C(this,t,e,!1),e+2},u.prototype.writeUInt32LE=function(t,e,r){return t=+t,e|=0,r||k(this,t,e,4,4294967295,0),u.TYPED_ARRAY_SUPPORT?(this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t):R(this,t,e,!0),e+4},u.prototype.writeUInt32BE=function(t,e,r){return t=+t,e|=0,r||k(this,t,e,4,4294967295,0),u.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):R(this,t,e,!1),e+4},u.prototype.writeIntLE=function(t,e,r,n){if(t=+t,e|=0,!n){var o=Math.pow(2,8*r-1);k(this,t,e,r,o-1,-o)}var i=0,s=1,a=0;for(this[e]=255&t;++i<r&&(s*=256);)t<0&&0===a&&0!==this[e+i-1]&&(a=1),this[e+i]=(t/s>>0)-a&255;return e+r},u.prototype.writeIntBE=function(t,e,r,n){if(t=+t,e|=0,!n){var o=Math.pow(2,8*r-1);k(this,t,e,r,o-1,-o)}var i=r-1,s=1,a=0;for(this[e+i]=255&t;--i>=0&&(s*=256);)t<0&&0===a&&0!==this[e+i+1]&&(a=1),this[e+i]=(t/s>>0)-a&255;return e+r},u.prototype.writeInt8=function(t,e,r){return t=+t,e|=0,r||k(this,t,e,1,127,-128),u.TYPED_ARRAY_SUPPORT||(t=Math.floor(t)),t<0&&(t=255+t+1),this[e]=255&t,e+1},u.prototype.writeInt16LE=function(t,e,r){return t=+t,e|=0,r||k(this,t,e,2,32767,-32768),u.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8):C(this,t,e,!0),e+2},u.prototype.writeInt16BE=function(t,e,r){return t=+t,e|=0,r||k(this,t,e,2,32767,-32768),u.TYPED_ARRAY_SUPPORT?(this[e]=t>>>8,this[e+1]=255&t):C(this,t,e,!1),e+2},u.prototype.writeInt32LE=function(t,e,r){return t=+t,e|=0,r||k(this,t,e,4,2147483647,-2147483648),u.TYPED_ARRAY_SUPPORT?(this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24):R(this,t,e,!0),e+4},u.prototype.writeInt32BE=function(t,e,r){return t=+t,e|=0,r||k(this,t,e,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),u.TYPED_ARRAY_SUPPORT?(this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t):R(this,t,e,!1),e+4},u.prototype.writeFloatLE=function(t,e,r){return B(this,t,e,!0,r)},u.prototype.writeFloatBE=function(t,e,r){return B(this,t,e,!1,r)},u.prototype.writeDoubleLE=function(t,e,r){return M(this,t,e,!0,r)},u.prototype.writeDoubleBE=function(t,e,r){return M(this,t,e,!1,r)},u.prototype.copy=function(t,e,r,n){if(r||(r=0),n||0===n||(n=this.length),e>=t.length&&(e=t.length),e||(e=0),n>0&&n<r&&(n=r),n===r)return 0;if(0===t.length||0===this.length)return 0;if(e<0)throw new RangeError("targetStart out of bounds");if(r<0||r>=this.length)throw new RangeError("sourceStart out of bounds");if(n<0)throw new RangeError("sourceEnd out of bounds");n>this.length&&(n=this.length),t.length-e<n-r&&(n=t.length-e+r);var o,i=n-r;if(this===t&&r<e&&e<n)for(o=i-1;o>=0;--o)t[o+e]=this[o+r];else if(i<1e3||!u.TYPED_ARRAY_SUPPORT)for(o=0;o<i;++o)t[o+e]=this[o+r];else Uint8Array.prototype.set.call(t,this.subarray(r,r+i),e);return i},u.prototype.fill=function(t,e,r,n){if("string"==typeof t){if("string"==typeof e?(n=e,e=0,r=this.length):"string"==typeof r&&(n=r,r=this.length),1===t.length){var o=t.charCodeAt(0);o<256&&(t=o)}if(void 0!==n&&"string"!=typeof n)throw new TypeError("encoding must be a string");if("string"==typeof n&&!u.isEncoding(n))throw new TypeError("Unknown encoding: "+n)}else"number"==typeof t&&(t&=255);if(e<0||this.length<e||this.length<r)throw new RangeError("Out of range index");if(r<=e)return this;var i;if(e>>>=0,r=void 0===r?this.length:r>>>0,t||(t=0),"number"==typeof t)for(i=e;i<r;++i)this[i]=t;else{var s=u.isBuffer(t)?t:L(new u(t,n).toString()),a=s.length;for(i=0;i<r-e;++i)this[i+e]=s[i%a]}return this};var I=/[^+\/0-9A-Za-z-_]/g;function F(t){return t<16?"0"+t.toString(16):t.toString(16)}function L(t,e){var r;e=e||1/0;for(var n=t.length,o=null,i=[],s=0;s<n;++s){if((r=t.charCodeAt(s))>55295&&r<57344){if(!o){if(r>56319){(e-=3)>-1&&i.push(239,191,189);continue}if(s+1===n){(e-=3)>-1&&i.push(239,191,189);continue}o=r;continue}if(r<56320){(e-=3)>-1&&i.push(239,191,189),o=r;continue}r=65536+(o-55296<<10|r-56320)}else o&&(e-=3)>-1&&i.push(239,191,189);if(o=null,r<128){if((e-=1)<0)break;i.push(r)}else if(r<2048){if((e-=2)<0)break;i.push(r>>6|192,63&r|128)}else if(r<65536){if((e-=3)<0)break;i.push(r>>12|224,r>>6&63|128,63&r|128)}else{if(!(r<1114112))throw new Error("Invalid code point");if((e-=4)<0)break;i.push(r>>18|240,r>>12&63|128,r>>6&63|128,63&r|128)}}return i}function U(t){return n.toByteArray(function(t){if((t=function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}(t).replace(I,"")).length<2)return"";for(;t.length%4!=0;)t+="=";return t}(t))}function V(t,e,r,n){for(var o=0;o<n&&!(o+r>=e.length||o>=t.length);++o)e[o+r]=t[o];return o}}).call(this,r(11))},function(t,e,r){"use strict";(function(t){
/*!
 * Module dependencies.
 */
function n(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return o(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return o(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,i=function(){};return{s:i,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,a=!0,u=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return a=t.done,t},e:function(t){u=!0,s=t},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw s}}}}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var s,a=r(111),u=r(46),c=r(62),l=r(63).Buffer,f=r(20),p=r(13),h=r(114),y=r(28),d=r(21),_=r(66),m=r(65),v=r(29),g=r(24),b=r(47);function w(t){if(Array.isArray(t.populate)){var r=[];t.populate.forEach((function(t){if(/[\s]/.test(t.path)){var n=Object.assign({},t);n.path.split(" ").forEach((function(t){n.path=t,r.push(e.populate(n)[0])}))}else r.push(e.populate(t)[0])})),t.populate=e.populate(r)}else null!=t.populate&&"object"===i(t.populate)&&(t.populate=e.populate(t.populate));var o=[],s=t.path.split(" ");null!=t.options&&(t.options=e.clone(t.options));var a,u=n(s);try{for(u.s();!(a=u.n()).done;){var c=a.value;o.push(new h(Object.assign({},t,{path:c})))}}catch(t){u.e(t)}finally{u.f()}return o}
/*!
 * Return the value of `obj` at the given `path`.
 *
 * @param {String} path
 * @param {Object} obj
 */e.specialProperties=b,
/*!
 * Produces a collection name from model `name`. By default, just returns
 * the model name
 *
 * @param {String} name a model name
 * @param {Function} pluralize function that pluralizes the collection name
 * @return {String} a collection name
 * @api private
 */
e.toCollectionName=function(t,e){return"system.profile"===t||"system.indexes"===t?t:"function"==typeof e?e(t):t},
/*!
 * Determines if `a` and `b` are deep equal.
 *
 * Modified from node/lib/assert.js
 *
 * @param {any} a a value to compare to `b`
 * @param {any} b a value to compare to `a`
 * @return {Boolean}
 * @api private
 */
e.deepEqual=function t(r,n){if(r===n)return!0;if("object"!==i(r)&&"object"!==i(n))return r===n;if(r instanceof Date&&n instanceof Date)return r.getTime()===n.getTime();if(_(r,"ObjectID")&&_(n,"ObjectID")||_(r,"Decimal128")&&_(n,"Decimal128"))return r.toString()===n.toString();if(r instanceof RegExp&&n instanceof RegExp)return r.source===n.source&&r.ignoreCase===n.ignoreCase&&r.multiline===n.multiline&&r.global===n.global;if(null==r||null==n)return!1;if(r.prototype!==n.prototype)return!1;if(r instanceof Map&&n instanceof Map)return t(Array.from(r.keys()),Array.from(n.keys()))&&t(Array.from(r.values()),Array.from(n.values()));if(r instanceof Number&&n instanceof Number)return r.valueOf()===n.valueOf();if(l.isBuffer(r))return e.buffer.areEqual(r,n);if(Array.isArray(r)&&Array.isArray(n)){var o=r.length;if(o!==n.length)return!1;for(var s=0;s<o;++s)if(!t(r[s],n[s]))return!1;return!0}null!=r.$__?r=r._doc:v(r)&&(r=r.toObject()),null!=n.$__?n=n._doc:v(n)&&(n=n.toObject());var a=Object.keys(r),u=Object.keys(n),c=a.length;if(c!==u.length)return!1;a.sort(),u.sort();for(var f=c-1;f>=0;f--)if(a[f]!==u[f])return!1;for(var p=0,h=a;p<h.length;p++){var y=h[p];if(!t(r[y],n[y]))return!1}return!0},
/*!
 * Get the last element of an array
 */
e.last=function(t){if(t.length>0)return t[t.length-1]},e.clone=y,
/*!
 * ignore
 */
e.promiseOrCallback=g,
/*!
 * ignore
 */
e.omit=function(t,e){if(null==e)return Object.assign({},t);Array.isArray(e)||(e=[e]);var r,o=Object.assign({},t),i=n(e);try{for(i.s();!(r=i.n()).done;){delete o[r.value]}}catch(t){i.e(t)}finally{i.f()}return o},
/*!
 * Shallow copies defaults into options.
 *
 * @param {Object} defaults
 * @param {Object} options
 * @return {Object} the merged object
 * @api private
 */
e.options=function(t,e){var r,n=Object.keys(t),o=n.length;for(e=e||{};o--;)(r=n[o])in e||(e[r]=t[r]);return e},
/*!
 * Generates a random string
 *
 * @api private
 */
e.random=function(){return Math.random().toString().substr(3)},
/*!
 * Merges `from` into `to` without overwriting existing properties.
 *
 * @param {Object} to
 * @param {Object} from
 * @api private
 */
e.merge=function t(r,n,o,i){o=o||{};var s,a=Object.keys(n),u=0,c=a.length;i=i||"";for(var l=o.omitNested||{};u<c;)if(s=a[u++],!(o.omit&&o.omit[s]||l[i]||b.has(s)))if(null==r[s])r[s]=n[s];else if(e.isObject(n[s])){if(e.isObject(r[s])||(r[s]={}),null!=n[s]){if(o.isDiscriminatorSchemaMerge&&n[s].$isSingleNested&&r[s].$isMongooseDocumentArray||n[s].$isMongooseDocumentArray&&r[s].$isSingleNested)continue;if(n[s].instanceOfSchema){r[s].instanceOfSchema?r[s].add(n[s].clone()):r[s]=n[s].clone();continue}if(n[s]instanceof p){r[s]=new p(n[s]);continue}}t(r[s],n[s],o,i?i+"."+s:s)}else o.overwrite&&(r[s]=n[s])},
/*!
 * Applies toObject recursively.
 *
 * @param {Document|Array|Object} obj
 * @return {Object}
 * @api private
 */
e.toObject=function t(o){var i;if(s||(s=r(6)),null==o)return o;if(o instanceof s)return o.toObject();if(Array.isArray(o)){i=[];var a,u=n(o);try{for(u.s();!(a=u.n()).done;){var c=a.value;i.push(t(c))}}catch(t){u.e(t)}finally{u.f()}return i}if(e.isPOJO(o)){for(var l in i={},o)b.has(l)||(i[l]=t(o[l]));return i}return o},e.isObject=d,
/*!
 * Determines if `arg` is a plain old JavaScript object (POJO). Specifically,
 * `arg` must be an object but not an instance of any special class, like String,
 * ObjectId, etc.
 *
 * `Object.getPrototypeOf()` is part of ES5: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @api private
 * @return {Boolean}
 */
e.isPOJO=function(t){if(null==t||"object"!==i(t))return!1;var e=Object.getPrototypeOf(t);return!e||"Object"===e.constructor.name},
/*!
 * Determines if `obj` is a built-in object like an array, date, boolean,
 * etc.
 */
e.isNativeObject=function(t){return Array.isArray(t)||t instanceof Date||t instanceof Boolean||t instanceof Number||t instanceof String},
/*!
 * Determines if `val` is an object that has no own keys
 */
e.isEmptyObject=function(t){return null!=t&&"object"===i(t)&&0===Object.keys(t).length},
/*!
 * Search if `obj` or any POJOs nested underneath `obj` has a property named
 * `key`
 */
e.hasKey=function(t,r){for(var n=0,o=Object.keys(t);n<o.length;n++){var i=o[n];if(i===r)return!0;if(e.isPOJO(t[i])&&e.hasKey(t[i],r))return!0}return!1},
/*!
 * A faster Array.prototype.slice.call(arguments) alternative
 * @api private
 */
e.args=c,
/*!
 * process.nextTick helper.
 *
 * Wraps `callback` in a try/catch + nextTick.
 *
 * node-mongodb-native has a habit of state corruption when an error is immediately thrown from within a collection callback.
 *
 * @param {Function} callback
 * @api private
 */
e.tick=function(e){if("function"==typeof e)return function(){try{e.apply(this,arguments)}catch(e){t.nextTick((function(){throw e}))}}},
/*!
 * Returns true if `v` is an object that can be serialized as a primitive in
 * MongoDB
 */
e.isMongooseType=function(t){return t instanceof p||t instanceof f||t instanceof l},e.isMongooseObject=v,
/*!
 * Converts `expires` options of index objects to `expiresAfterSeconds` options for MongoDB.
 *
 * @param {Object} object
 * @api private
 */
e.expires=function(t){var e;t&&"Object"===t.constructor.name&&("expires"in t&&(e="string"!=typeof t.expires?t.expires:Math.round(a(t.expires)/1e3),t.expireAfterSeconds=e,delete t.expires))},
/*!
 * populate helper
 */
e.populate=function(t,r,n,o,s,a,u,c){var l=null;if(1===arguments.length){if(t instanceof h)return[t];if(Array.isArray(t)){var f=p(t);return f.map((function(t){return e.populate(t)[0]}))}l=e.isObject(t)?Object.assign({},t):{path:t}}else l="object"===i(n)?{path:t,select:r,match:n,options:o}:{path:t,select:r,model:n,match:o,options:s,populate:a,justOne:u,count:c};if("string"!=typeof l.path)throw new TypeError("utils.populate: invalid path. Expected string. Got typeof `"+i(t)+"`");return w(l);function p(t){var e=[];return t.forEach((function(t){/[\s]/.test(t.path)?t.path.split(" ").forEach((function(r){var n=Object.assign({},t);n.path=r,e.push(n)})):e.push(t)})),e}},e.getValue=function(t,e,r){return u.get(t,e,"_doc",r)},
/*!
 * Sets the value of `obj` at the given `path`.
 *
 * @param {String} path
 * @param {Anything} val
 * @param {Object} obj
 */
e.setValue=function(t,e,r,n,o){u.set(t,e,r,"_doc",n,o)},
/*!
 * Returns an array of values from object `o`.
 *
 * @param {Object} o
 * @return {Array}
 * @private
 */
e.object={},e.object.vals=function(t){for(var e=Object.keys(t),r=e.length,n=[];r--;)n.push(t[e[r]]);return n},
/*!
 * @see exports.options
 */
e.object.shallowCopy=e.options;
/*!
 * Safer helper for hasOwnProperty checks
 *
 * @param {Object} obj
 * @param {String} prop
 */
var O=Object.prototype.hasOwnProperty;e.object.hasOwnProperty=function(t,e){return O.call(t,e)},
/*!
 * Determine if `val` is null or undefined
 *
 * @return {Boolean}
 */
e.isNullOrUndefined=function(t){return null==t},
/*!
 * ignore
 */
e.array={},
/*!
 * Flattens an array.
 *
 * [ 1, [ 2, 3, [4] ]] -> [1,2,3,4]
 *
 * @param {Array} arr
 * @param {Function} [filter] If passed, will be invoked with each item in the array. If `filter` returns a falsy value, the item will not be included in the results.
 * @return {Array}
 * @private
 */
e.array.flatten=function t(e,r,n){return n||(n=[]),e.forEach((function(e){Array.isArray(e)?t(e,r,n):r&&!r(e)||n.push(e)})),n};
/*!
 * ignore
 */
var S=Object.prototype.hasOwnProperty;e.hasUserDefinedProperty=function(t,r){if(null==t)return!1;if(Array.isArray(r)){var o,s=n(r);try{for(s.s();!(o=s.n()).done;){var a=o.value;if(e.hasUserDefinedProperty(t,a))return!0}}catch(t){s.e(t)}finally{s.f()}return!1}if(S.call(t,r))return!0;if("object"===i(t)&&r in t){var u=t[r];return u!==Object.prototype[r]&&u!==Array.prototype[r]}return!1};
/*!
 * ignore
 */
var A=Math.pow(2,32)-1;e.isArrayIndex=function(t){return"number"==typeof t?t>=0&&t<=A:"string"==typeof t&&(!!/^\d+$/.test(t)&&((t=+t)>=0&&t<=A))},
/*!
 * Removes duplicate values from an array
 *
 * [1, 2, 3, 3, 5] => [1, 2, 3, 5]
 * [ ObjectId("550988ba0c19d57f697dc45e"), ObjectId("550988ba0c19d57f697dc45e") ]
 *    => [ObjectId("550988ba0c19d57f697dc45e")]
 *
 * @param {Array} arr
 * @return {Array}
 * @private
 */
e.array.unique=function(t){var e,r={},o={},i=[],s=n(t);try{for(s.s();!(e=s.n()).done;){var a=e.value;if("number"==typeof a||"string"==typeof a||null==a){if(r[a])continue;i.push(a),r[a]=!0}else if(a instanceof p){if(o[a.toString()])continue;i.push(a),o[a.toString()]=!0}else i.push(a)}}catch(t){s.e(t)}finally{s.f()}return i},
/*!
 * Determines if two buffers are equal.
 *
 * @param {Buffer} a
 * @param {Object} b
 */
e.buffer={},e.buffer.areEqual=function(t,e){if(!l.isBuffer(t))return!1;if(!l.isBuffer(e))return!1;if(t.length!==e.length)return!1;for(var r=0,n=t.length;r<n;++r)if(t[r]!==e[r])return!1;return!0},e.getFunctionName=m,
/*!
 * Decorate buffers
 */
e.decorate=function(t,e){for(var r in e)b.has(r)||(t[r]=e[r])},e.mergeClone=function(t,r){v(r)&&(r=r.toObject({transform:!1,virtuals:!1,depopulate:!0,getters:!1,flattenDecimals:!1}));for(var n,o=Object.keys(r),i=o.length,s=0;s<i;)if(n=o[s++],!b.has(n))if(void 0===t[n])t[n]=e.clone(r[n],{transform:!1,virtuals:!1,depopulate:!0,getters:!1,flattenDecimals:!1});else{var a=r[n];if(null==a||!a.valueOf||a instanceof Date||(a=a.valueOf()),e.isObject(a)){var u=a;v(a)&&!a.isMongooseBuffer&&(u=u.toObject({transform:!1,virtuals:!1,depopulate:!0,getters:!1,flattenDecimals:!1})),a.isMongooseBuffer&&(u=l.from(u)),e.mergeClone(t[n],u)}else t[n]=e.clone(a,{flattenDecimals:!1})}},e.each=function(t,e){var r,o=n(t);try{for(o.s();!(r=o.n()).done;){e(r.value)}}catch(t){o.e(t)}finally{o.f()}},
/*!
 * ignore
 */
e.getOption=function(t){var e,r=Array.prototype.slice.call(arguments,1),o=n(r);try{for(o.s();!(e=o.n()).done;){var i=e.value;if(null!=i[t])return i[t]}}catch(t){o.e(t)}finally{o.f()}return null},
/*!
 * ignore
 */
e.noop=function(){}}).call(this,r(8))},function(t,e,r){"use strict";
/*!
 * Simplified lodash.get to work around the annoying null quirk. See:
 * https://github.com/lodash/lodash/issues/3659
 */function n(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return o(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return o(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,i=function(){};return{s:i,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,a=!0,u=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return a=t.done,t},e:function(t){u=!0,s=t},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw s}}}}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function i(t,e){return null==t?t:t instanceof Map?t.get(e):t[e]}t.exports=function(t,e,r){var o,s=e.split("."),a=e,u=t,c=n(s);try{for(c.s();!(o=c.n()).done;){var l=o.value;if(null==u)return r;if(null!=u[a])return u[a];u=i(u,l),a=a.substr(l.length+1)}}catch(t){c.e(t)}finally{c.f()}return null==u?r:u}},function(t,e,r){(function(t){function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o=Object.getOwnPropertyDescriptors||function(t){for(var e=Object.keys(t),r={},n=0;n<e.length;n++)r[e[n]]=Object.getOwnPropertyDescriptor(t,e[n]);return r},i=/%[sdj%]/g;e.format=function(t){if(!v(t)){for(var e=[],r=0;r<arguments.length;r++)e.push(u(arguments[r]));return e.join(" ")}r=1;for(var n=arguments,o=n.length,s=String(t).replace(i,(function(t){if("%%"===t)return"%";if(r>=o)return t;switch(t){case"%s":return String(n[r++]);case"%d":return Number(n[r++]);case"%j":try{return JSON.stringify(n[r++])}catch(t){return"[Circular]"}default:return t}})),a=n[r];r<o;a=n[++r])_(a)||!w(a)?s+=" "+a:s+=" "+u(a);return s},e.deprecate=function(r,n){if(void 0!==t&&!0===t.noDeprecation)return r;if(void 0===t)return function(){return e.deprecate(r,n).apply(this,arguments)};var o=!1;return function(){if(!o){if(t.throwDeprecation)throw new Error(n);t.traceDeprecation?console.trace(n):console.error(n),o=!0}return r.apply(this,arguments)}};var s,a={};function u(t,r){var n={seen:[],stylize:l};return arguments.length>=3&&(n.depth=arguments[2]),arguments.length>=4&&(n.colors=arguments[3]),d(r)?n.showHidden=r:r&&e._extend(n,r),g(n.showHidden)&&(n.showHidden=!1),g(n.depth)&&(n.depth=2),g(n.colors)&&(n.colors=!1),g(n.customInspect)&&(n.customInspect=!0),n.colors&&(n.stylize=c),f(n,t,n.depth)}function c(t,e){var r=u.styles[e];return r?"["+u.colors[r][0]+"m"+t+"["+u.colors[r][1]+"m":t}function l(t,e){return t}function f(t,r,n){if(t.customInspect&&r&&A(r.inspect)&&r.inspect!==e.inspect&&(!r.constructor||r.constructor.prototype!==r)){var o=r.inspect(n,t);return v(o)||(o=f(t,o,n)),o}var i=function(t,e){if(g(e))return t.stylize("undefined","undefined");if(v(e)){var r="'"+JSON.stringify(e).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return t.stylize(r,"string")}if(m(e))return t.stylize(""+e,"number");if(d(e))return t.stylize(""+e,"boolean");if(_(e))return t.stylize("null","null")}(t,r);if(i)return i;var s=Object.keys(r),a=function(t){var e={};return t.forEach((function(t,r){e[t]=!0})),e}(s);if(t.showHidden&&(s=Object.getOwnPropertyNames(r)),S(r)&&(s.indexOf("message")>=0||s.indexOf("description")>=0))return p(r);if(0===s.length){if(A(r)){var u=r.name?": "+r.name:"";return t.stylize("[Function"+u+"]","special")}if(b(r))return t.stylize(RegExp.prototype.toString.call(r),"regexp");if(O(r))return t.stylize(Date.prototype.toString.call(r),"date");if(S(r))return p(r)}var c,l="",w=!1,E=["{","}"];(y(r)&&(w=!0,E=["[","]"]),A(r))&&(l=" [Function"+(r.name?": "+r.name:"")+"]");return b(r)&&(l=" "+RegExp.prototype.toString.call(r)),O(r)&&(l=" "+Date.prototype.toUTCString.call(r)),S(r)&&(l=" "+p(r)),0!==s.length||w&&0!=r.length?n<0?b(r)?t.stylize(RegExp.prototype.toString.call(r),"regexp"):t.stylize("[Object]","special"):(t.seen.push(r),c=w?function(t,e,r,n,o){for(var i=[],s=0,a=e.length;s<a;++s)x(e,String(s))?i.push(h(t,e,r,n,String(s),!0)):i.push("");return o.forEach((function(o){o.match(/^\d+$/)||i.push(h(t,e,r,n,o,!0))})),i}(t,r,n,a,s):s.map((function(e){return h(t,r,n,a,e,w)})),t.seen.pop(),function(t,e,r){if(t.reduce((function(t,e){return e.indexOf("\n")>=0&&0,t+e.replace(/\u001b\[\d\d?m/g,"").length+1}),0)>60)return r[0]+(""===e?"":e+"\n ")+" "+t.join(",\n  ")+" "+r[1];return r[0]+e+" "+t.join(", ")+" "+r[1]}(c,l,E)):E[0]+l+E[1]}function p(t){return"["+Error.prototype.toString.call(t)+"]"}function h(t,e,r,n,o,i){var s,a,u;if((u=Object.getOwnPropertyDescriptor(e,o)||{value:e[o]}).get?a=u.set?t.stylize("[Getter/Setter]","special"):t.stylize("[Getter]","special"):u.set&&(a=t.stylize("[Setter]","special")),x(n,o)||(s="["+o+"]"),a||(t.seen.indexOf(u.value)<0?(a=_(r)?f(t,u.value,null):f(t,u.value,r-1)).indexOf("\n")>-1&&(a=i?a.split("\n").map((function(t){return"  "+t})).join("\n").substr(2):"\n"+a.split("\n").map((function(t){return"   "+t})).join("\n")):a=t.stylize("[Circular]","special")),g(s)){if(i&&o.match(/^\d+$/))return a;(s=JSON.stringify(""+o)).match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(s=s.substr(1,s.length-2),s=t.stylize(s,"name")):(s=s.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),s=t.stylize(s,"string"))}return s+": "+a}function y(t){return Array.isArray(t)}function d(t){return"boolean"==typeof t}function _(t){return null===t}function m(t){return"number"==typeof t}function v(t){return"string"==typeof t}function g(t){return void 0===t}function b(t){return w(t)&&"[object RegExp]"===E(t)}function w(t){return"object"===n(t)&&null!==t}function O(t){return w(t)&&"[object Date]"===E(t)}function S(t){return w(t)&&("[object Error]"===E(t)||t instanceof Error)}function A(t){return"function"==typeof t}function E(t){return Object.prototype.toString.call(t)}function j(t){return t<10?"0"+t.toString(10):t.toString(10)}e.debuglog=function(r){if(g(s)&&(s=t.env.NODE_DEBUG||""),r=r.toUpperCase(),!a[r])if(new RegExp("\\b"+r+"\\b","i").test(s)){var n=t.pid;a[r]=function(){var t=e.format.apply(e,arguments);console.error("%s %d: %s",r,n,t)}}else a[r]=function(){};return a[r]},e.inspect=u,u.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},u.styles={special:"cyan",number:"yellow",boolean:"yellow",undefined:"grey",null:"bold",string:"green",date:"magenta",regexp:"red"},e.isArray=y,e.isBoolean=d,e.isNull=_,e.isNullOrUndefined=function(t){return null==t},e.isNumber=m,e.isString=v,e.isSymbol=function(t){return"symbol"===n(t)},e.isUndefined=g,e.isRegExp=b,e.isObject=w,e.isDate=O,e.isError=S,e.isFunction=A,e.isPrimitive=function(t){return null===t||"boolean"==typeof t||"number"==typeof t||"string"==typeof t||"symbol"===n(t)||void 0===t},e.isBuffer=r(100);var $=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];function P(){var t=new Date,e=[j(t.getHours()),j(t.getMinutes()),j(t.getSeconds())].join(":");return[t.getDate(),$[t.getMonth()],e].join(" ")}function x(t,e){return Object.prototype.hasOwnProperty.call(t,e)}e.log=function(){console.log("%s - %s",P(),e.format.apply(e,arguments))},e.inherits=r(101),e._extend=function(t,e){if(!e||!w(e))return t;for(var r=Object.keys(e),n=r.length;n--;)t[r[n]]=e[r[n]];return t};var N="undefined"!=typeof Symbol?Symbol("util.promisify.custom"):void 0;function T(t,e){if(!t){var r=new Error("Promise was rejected with a falsy value");r.reason=t,t=r}return e(t)}e.promisify=function(t){if("function"!=typeof t)throw new TypeError('The "original" argument must be of type Function');if(N&&t[N]){var e;if("function"!=typeof(e=t[N]))throw new TypeError('The "util.promisify.custom" argument must be of type Function');return Object.defineProperty(e,N,{value:e,enumerable:!1,writable:!1,configurable:!0}),e}function e(){for(var e,r,n=new Promise((function(t,n){e=t,r=n})),o=[],i=0;i<arguments.length;i++)o.push(arguments[i]);o.push((function(t,n){t?r(t):e(n)}));try{t.apply(this,o)}catch(t){r(t)}return n}return Object.setPrototypeOf(e,Object.getPrototypeOf(t)),N&&Object.defineProperty(e,N,{value:e,enumerable:!1,writable:!1,configurable:!0}),Object.defineProperties(e,o(t))},e.promisify.custom=N,e.callbackify=function(e){if("function"!=typeof e)throw new TypeError('The "original" argument must be of type Function');function r(){for(var r=[],n=0;n<arguments.length;n++)r.push(arguments[n]);var o=r.pop();if("function"!=typeof o)throw new TypeError("The last argument must be of type Function");var i=this,s=function(){return o.apply(i,arguments)};e.apply(this,r).then((function(e){t.nextTick(s,null,e)}),(function(e){t.nextTick(T,e,s)}))}return Object.setPrototypeOf(r,Object.getPrototypeOf(e)),Object.defineProperties(r,o(e)),r}}).call(this,r(8))},function(t,e,r){"use strict";var n=r(14);
/*!
 * Module exports.
 */t.exports=n,n.messages=r(127),n.Messages=n.messages,n.DocumentNotFoundError=r(128),n.CastError=r(12),n.ValidationError=r(31),n.ValidatorError=r(71),n.VersionError=r(129),n.ParallelSaveError=r(130),n.OverwriteModelError=r(131),n.MissingSchemaError=r(132),n.DivergentArrayError=r(133),n.StrictModeError=r(32)},function(t,e,r){"use strict";(function(e,n){
/*!
 * Module dependencies.
 */
function o(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function i(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return s(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return s(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,a=!0,u=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return a=t.done,t},e:function(t){u=!0,i=t},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw i}}}}function s(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function a(t){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var u,c,l,f=r(19).EventEmitter,p=r(109),h=r(5),y=r(25),d=r(73),_=r(135),m=r(136),v=r(52),g=r(32),b=r(31),w=r(71),O=r(53),S=r(24),A=r(84),E=r(57).compile,j=r(57).defineKey,$=r(172).flatten,P=r(3),x=r(173),N=r(88),T=r(174),k=r(58),C=r(175),R=r(4).inspect,D=r(17).internalToObjectOptions,B=r(46),M=r(176),I=r(2),F=r(178),L=I.clone,U=I.deepEqual,V=I.isMongooseObject,q=Symbol("mongoose.Array#atomicsBackup"),W=r(0).arrayAtomicsSymbol,H=r(0).documentArrayParent,Y=r(0).documentIsSelected,K=r(0).documentIsModified,z=r(0).documentModifiedPaths,Q=r(0).documentSchemaSymbol,J=r(0).getSymbol,G=r(0).populateModelSymbol,X=r(0).scopeSymbol,Z=I.specialProperties;function tt(t,e,r,n){var o=this;"object"===a(r)&&null!=r&&(r=(n=r).skipId),n=Object.assign({},n);var s=P(n,"defaults",!0);if(n.defaults=s,null==this.schema){var u=I.isObject(e)&&!e.instanceOfSchema?new v(e):e;this.$__setSchema(u),e=r,r=n,n=arguments[4]||{}}if(this.$__=new p,this.$__.emitter=new f,this.isNew=!("isNew"in n)||n.isNew,this.errors=void 0,this.$__.$options=n||{},this.$locals={},this.$op=null,null!=t&&"object"!==a(t))throw new _(t,"obj","Document");var c=this.schema;"boolean"==typeof e||"throw"===e?(this.$__.strictMode=e,e=void 0):(this.$__.strictMode=c.options.strict,this.$__.selected=e);var l,h=c.requiredPaths(!0),y=i(h);try{for(y.s();!(l=y.n()).done;){var d=l.value;this.$__.activePaths.require(d)}}catch(t){y.e(t)}finally{y.f()}this.$__.emitter.setMaxListeners(0);var m=null;I.isPOJO(e)&&(m=C(e));var g=!1===m&&e?rt(e):{};if(null==this._doc&&(this.$__buildDoc(t,e,r,m,g,!1),s&&nt(this,e,r,m,g,!0,{isNew:this.isNew})),t&&(this.$__original_set?this.$__original_set(t,void 0,!0):this.$set(t,void 0,!0),t instanceof tt&&(this.isNew=t.isNew)),n.willInit&&s?f.prototype.once.call(this,"init",(function(){nt(o,e,r,m,g,!1,n.skipDefaults,o.isNew)})):s&&nt(this,e,r,m,g,!1,n.skipDefaults,this.isNew),this.$__._id=this._id,!this.$__.strictMode&&t){var b=this,w=Object.keys(this._doc);w.forEach((function(t){t in c.tree||j(t,null,b)}))}at(this)}
/*!
 * Document exposes the NodeJS event emitter API, so you can use
 * `on`, `once`, etc.
 */for(var et in I.each(["on","once","emit","listeners","removeListener","setMaxListeners","removeAllListeners","addListener"],(function(t){tt.prototype[t]=function(){return this.$__.emitter[t].apply(this.$__.emitter,arguments)}})),tt.prototype.constructor=tt,f.prototype)tt[et]=f.prototype[et];
/*!
 * ignore
 */
function rt(t){for(var e={},r=0,n=Object.keys(t);r<n.length;r++){var o,s=[],a=i(n[r].split("."));try{for(a.s();!(o=a.n()).done;){var u=o.value;s.push(u),e[s.join(".")]=1}}catch(t){a.e(t)}finally{a.f()}}return e}
/*!
 * ignore
 */function nt(t,e,r,n,o,i,s){for(var a=Object.keys(t.schema.paths),u=a.length,c=0;c<u;++c){var l=void 0,f="",p=a[c];if("_id"!==p||!r)for(var h=t.schema.paths[p],y=-1===p.indexOf(".")?[p]:p.split("."),d=y.length,_=!1,m=t._doc,v=0;v<d&&null!=m;++v){var g=y[v];if(f+=(f.length?".":"")+g,!0===n){if(f in e)break}else if(!1===n&&e&&!_)if(f in e)_=!0;else if(!o[f])break;if(v===d-1){if(void 0!==m[g])break;if("function"==typeof h.defaultValue){if(!h.defaultValue.$runBeforeSetters&&i)break;if(h.defaultValue.$runBeforeSetters&&!i)break}else if(!i)continue;if(s&&s[f])break;if(e&&null!==n){if(!0===n){if(p in e)continue;try{l=h.getDefault(t,!1)}catch(e){t.invalidate(p,e);break}void 0!==l&&(m[g]=l,t.$__.activePaths.default(p))}else if(_){try{l=h.getDefault(t,!1)}catch(e){t.invalidate(p,e);break}void 0!==l&&(m[g]=l,t.$__.activePaths.default(p))}}else{try{l=h.getDefault(t,!1)}catch(e){t.invalidate(p,e);break}void 0!==l&&(m[g]=l,t.$__.activePaths.default(p))}}else m=m[g]}}}function ot(t){if(null==t)return!0;if("object"!==a(t)||Array.isArray(t))return!1;for(var e=0,r=Object.keys(t);e<r.length;e++){if(!ot(t[r[e]]))return!1}return!0}
/*!
 * ignore
 */
function it(t){var e={};!
/*!
 * ignore
 */
function(t){Object.keys(t.$__.activePaths.states.require).forEach((function(e){var r=t.schema.path(e);null!=r&&"function"==typeof r.originalRequiredValue&&(t.$__.cachedRequired[e]=r.originalRequiredValue.call(t,t))}))}(t);var r=new Set(Object.keys(t.$__.activePaths.states.require).filter((function(e){return!(!t.isSelected(e)&&!t.isModified(e))&&(!(e in t.$__.cachedRequired)||t.$__.cachedRequired[e])})));function n(t){r.add(t)}Object.keys(t.$__.activePaths.states.init).forEach(n),Object.keys(t.$__.activePaths.states.modify).forEach(n),Object.keys(t.$__.activePaths.states.default).forEach(n);var o,s=t.$__getAllSubdocs(),a=t.modifiedPaths(),u=i(s);try{for(u.s();!(o=u.n()).done;){var c=o.value;if(c.$basePath){var l,f=i(r);try{for(f.s();!(l=f.n()).done;){var p=l.value;(null===p||p.startsWith(c.$basePath+"."))&&r.delete(p)}}catch(t){f.e(t)}finally{f.f()}!t.isModified(c.$basePath,a)||t.isDirectModified(c.$basePath)||t.$isDefault(c.$basePath)||(r.add(c.$basePath),e[c.$basePath]=!0)}}}catch(t){u.e(t)}finally{u.f()}var h,y=i(r);try{for(y.s();!(h=y.n()).done;){var d=h.value,_=t.schema.path(d);if(_&&_.$isMongooseArray&&(!_.$isMongooseDocumentArray||P(_,"schemaOptions.required")))m(t.$__getValue(d),r,d)}}catch(t){y.e(t)}finally{y.f()}function m(t,e,r){if(null!=t)for(var n=t.length,o=0;o<n;++o)Array.isArray(t[o])?m(t[o],e,r+"."+o):e.add(r+"."+o)}var v,g={skipArrays:!0},b=i(r);try{for(b.s();!(v=b.n()).done;){var w=v.value;if(t.schema.nested[w]){var O=t.$__getValue(w);V(O)&&(O=O.toObject({transform:!1}));var S=$(O,w,g,t.schema);Object.keys(S).forEach(n)}}}catch(t){b.e(t)}finally{b.f()}var A,E=i(r);try{for(E.s();!(A=E.n()).done;){var j=A.value;if(t.schema.singleNestedPaths.hasOwnProperty(j))r.delete(j);else{var x=t.schema.path(j);if(x&&x.$isSchemaMap){var N=t.$__getValue(j);if(null!=N){var T,k=i(N.keys());try{for(k.s();!(T=k.n()).done;){var C=T.value;r.add(j+"."+C)}}catch(t){k.e(t)}finally{k.f()}}}}}}catch(t){E.e(t)}finally{E.f()}return[r=Array.from(r),e]}
/*!
 * ignore
 */
/*!
 * ignore
 */
function st(t,e){var r,n=new Set(e),o=new Map([]),s=i(e);try{for(s.s();!(r=s.n()).done;){var a=r.value;if(-1!==a.indexOf("."))for(var u=a.split("."),c=u[0],l=1;l<u.length;++l)o.set(c,a),c=c+"."+u[l]}}catch(t){s.e(t)}finally{s.f()}var f,p=[],h=i(t);try{for(h.s();!(f=h.n()).done;){var y=f.value;n.has(y)?p.push(y):o.has(y)&&p.push(o.get(y))}}catch(t){h.e(t)}finally{h.f()}return p}
/*!
 * Runs queued functions
 */
function at(t){var e=t.schema&&t.schema.callQueue;if(e.length){var r,n=i(e);try{for(n.s();!(r=n.n()).done;){var o=r.value;"pre"!==o[0]&&"post"!==o[0]&&"on"!==o[0]&&t[o[0]].apply(t,o[1])}}catch(t){n.e(t)}finally{n.f()}}}
/*!
 * ignore
 */
/*!
 * Applies virtuals properties to `json`.
 */
function ut(t,e,r,n){var o,i,s,a=t.schema,u=Object.keys(a.virtuals),c=u.length,l=c,f=t._doc,p=P(n,"aliases",!0);if(!f)return e;for(r=r||{},c=0;c<l;++c)if(o=u[c],p||!a.aliases.hasOwnProperty(o)){if(i=o,null!=r.path){if(!o.startsWith(r.path+"."))continue;i=o.substr(r.path.length+1)}var h=i.split(".");if(void 0!==(s=L(t.get(o),r))){var y=h.length;f=e;for(var d=0;d<y-1;++d)f[h[d]]=f[h[d]]||{},f=f[h[d]];f[h[y-1]]=s}}return e}
/*!
 * Applies virtuals properties to `json`.
 *
 * @param {Document} self
 * @param {Object} json
 * @return {Object} `json`
 */function ct(t,e){if(F(e))throw new Error("`transform` function must be synchronous, but the transform on path `"+t+"` returned a promise.")}
/*!
 * ignore
 */tt.prototype.schema,Object.defineProperty(tt.prototype,"$locals",{configurable:!1,enumerable:!1,writable:!0}),tt.prototype.isNew,tt.prototype.id,tt.prototype.errors,tt.prototype.$op,tt.prototype.$__buildDoc=function(t,e,r,n,o){for(var i={},s=Object.keys(this.schema.paths).filter((function(t){return!t.includes("$*")})),a=s.length,u=0;u<a;++u){var c=s[u];if("_id"===c){if(r)continue;if(t&&"_id"in t)continue}for(var l=c.split("."),f=l.length,p=f-1,h="",y=i,d=!1,_=0;_<f;++_){var m=l[_];if(h+=(h.length?".":"")+m,!0===n){if(h in e)break}else if(!1===n&&e&&!d)if(h in e)d=!0;else if(!o[h])break;_<p&&(y=y[m]||(y[m]={}))}}this._doc=i},
/*!
 * Converts to POJO when you use the document for querying
 */
tt.prototype.toBSON=function(){return this.toObject(D)},tt.prototype.init=function(t,e,r){return"function"==typeof e&&(r=e,e=null),this.$__init(t,e),r&&r(null,this),this},
/*!
 * ignore
 */
tt.prototype.$__init=function(t,e){if(this.isNew=!1,this.$init=!0,e=e||{},null!=t._id&&e.populated&&e.populated.length){var r,n=String(t._id),o=i(e.populated);try{for(o.s();!(r=o.n()).done;){var s=r.value;if(s.isVirtual?this.populated(s.path,I.getValue(s.path,t),s):this.populated(s.path,s._docs[n],s),null!=s._childDocs){var a,u=i(s._childDocs);try{for(u.s();!(a=u.n()).done;){var c=a.value;null!=c&&null!=c.$__&&(c.$__.parent=this)}}catch(t){u.e(t)}finally{u.f()}}}}catch(t){o.e(t)}finally{o.f()}}
/*!
 * Init helper.
 *
 * @param {Object} self document instance
 * @param {Object} obj raw mongodb doc
 * @param {Object} doc object we are initializing
 * @api private
 */
return function t(e,r,n,o,i){i=i||"";var s,a,u,c=Object.keys(r),l=c.length,f=0;for(;f<l;)p(f++);function p(l){if(u=c[l],a=i+u,s=e.schema.path(a),!e.schema.$isRootDiscriminator||e.isSelected(a))if(!s&&I.isPOJO(r[u]))n[u]||(n[u]={}),t(e,r[u],n[u],o,a+".");else if(s){if(null===r[u])n[u]=s._castNullish(null);else if(void 0!==r[u]){var f=(r[u].$__||{}).wasPopulated||null;if(s&&!f)try{n[u]=s.cast(r[u],e,!0)}catch(t){e.invalidate(t.path,new w({path:t.path,message:t.message,type:"cast",value:t.value,reason:t}))}else n[u]=r[u]}e.isModified(a)||e.$__.activePaths.init(a)}else n[u]=r[u]}}(this,t,this._doc,e),
/*!
 * If populating a path within a document array, make sure each
 * subdoc within the array knows its subpaths are populated.
 *
 * ####Example:
 *     const doc = await Article.findOne().populate('comments.author');
 *     doc.comments[0].populated('author'); // Should be set
 */
function(t,e){if(null==t._id||null==e||0===e.length)return;var r,n=String(t._id),o=i(e);try{for(o.s();!(r=o.n()).done;){var s=r.value;if(!s.isVirtual)for(var a=s.path.split("."),u=0;u<a.length-1;++u){var c=a.slice(0,u+1).join("."),l=a.slice(u+1).join("."),f=t.get(c);if(null!=f&&f.isMongooseDocumentArray){for(var p=0;p<f.length;++p)f[p].populated(l,null==s._docs[n]?[]:s._docs[n][p],s);break}}}}catch(t){o.e(t)}finally{o.f()}}(this,e.populated),this.emit("init",this),this.constructor.emit("init",this),this.$__._id=this._id,this},tt.prototype.update=function(){var t=I.args(arguments);t.unshift({_id:this._id});var e=this.constructor.update.apply(this.constructor,t);return null!=this.$session()&&("session"in e.options||(e.options.session=this.$session())),e},tt.prototype.updateOne=function(t,e,r){var n=this,o=this.constructor.updateOne({_id:this._id},t,e);return o._pre((function(t){n.constructor._middleware.execPre("updateOne",n,[n],t)})),o._post((function(t){n.constructor._middleware.execPost("updateOne",n,[n],{},t)})),null!=this.$session()&&("session"in o.options||(o.options.session=this.$session())),null!=r?o.exec(r):o},tt.prototype.replaceOne=function(){var t=I.args(arguments);return t.unshift({_id:this._id}),this.constructor.replaceOne.apply(this.constructor,t)},tt.prototype.$session=function(t){if(0===arguments.length)return this.$__.session;if(this.$__.session=t,!this.ownerDocument){var e,r=this.$__getAllSubdocs(),n=i(r);try{for(n.s();!(e=n.n()).done;){var o=e.value;o.$session(t)}}catch(t){n.e(t)}finally{n.f()}}return t},tt.prototype.overwrite=function(t){for(var e=0,r=Array.from(new Set(Object.keys(this._doc).concat(Object.keys(t))));e<r.length;e++){var n=r[e];"_id"!==n&&(this.schema.options.versionKey&&n===this.schema.options.versionKey||this.schema.options.discriminatorKey&&n===this.schema.options.discriminatorKey||this.$set(n,t[n]))}return this},tt.prototype.$set=function(t,e,r,n){var s=this;I.isPOJO(r)&&(n=r,r=void 0);var u,c,l,f,p=(n=n||{}).merge,_=r&&!0!==r,m=!0===r,v=0,b="strict"in n?n.strict:this.$__.strictMode;if(_&&((this.$__.adhocPaths||(this.$__.adhocPaths={}))[t]=this.schema.interpretAsType(t,r,this.schema.options)),null==t){var w=t;t=e,e=w}else{if("string"!=typeof t){t instanceof tt&&(t=t.$__isNested?t.toObject():t._doc),f=e?e+".":"";var O=(u=Object.keys(t)).length,S=P(n,"_skipMinimizeTopLevel",!1);if(0===O&&S)return delete n._skipMinimizeTopLevel,e&&this.$set(e,{}),this;for(var E=0;E<O;++E){var j=f+(l=u[E]);if(c=this.schema.pathType(j),!0!==r||f||null==t[l]||"nested"!==c||null==this._doc[l]||0!==Object.keys(this._doc[l]).length||(delete this._doc[l],n=Object.assign({},n,{_skipMinimizeTopLevel:!0})),!("object"!==a(t[l])||I.isNativeObject(t[l])||I.isMongooseType(t[l])||null==t[l]||"virtual"===c||"real"===c||"adhocOrUndefined"===c||this.$__path(j)instanceof y||this.schema.paths[j]&&this.schema.paths[j].options&&this.schema.paths[j].options.ref))this.$__.$setCalled.add(f+l),this.$set(t[l],f+l,m,n);else if(b){if(m&&void 0===t[l]&&void 0!==this.get(j))continue;if("adhocOrUndefined"===c&&(c=x(this,j,{typeOnly:!0})),"real"===c||"virtual"===c){var $=t[l];this.schema.paths[j]&&this.schema.paths[j].$isSingleNested&&t[l]instanceof tt&&($=$.toObject({virtuals:!1,transform:!1})),this.$set(f+l,$,m,n)}else if("nested"===c&&t[l]instanceof tt)this.$set(f+l,t[l].toObject({transform:!1}),m,n);else if("throw"===b)throw"nested"===c?new d(l,t[l]):new g(l)}else void 0!==t[l]&&this.$set(f+l,t[l],m,n)}return this}this.$__.$setCalled.add(t)}var T,k=this.schema.pathType(t);if("adhocOrUndefined"===k&&(k=x(this,t,{typeOnly:!0})),e=N(e),"nested"===k&&e){if("object"===a(e)&&null!=e){var C=null!=this.$__.savedState&&this.$__.savedState.hasOwnProperty(t);if(null!=this.$__.savedState&&!this.isNew&&!this.$__.savedState.hasOwnProperty(t)){var R=this.$__getValue(t);this.$__.savedState[t]=R;for(var D=0,M=Object.keys(R||{});D<M.length;D++){var F=M[D];this.$__.savedState[t+"."+F]=R[F]}}if(p)return this.$set(e,t,m);this.$__setValue(t,null),A(this,t);var L=Object.keys(e);this.$__setValue(t,{});for(var U=0,V=L;U<V.length;U++){var q=V[U];this.$set(t+"."+q,e[q],m)}return C&&I.deepEqual(this.$__.savedState[t],e)?this.unmarkModified(t):this.markModified(t),A(this,t,{skipDocArrays:!0}),this}return this.invalidate(t,new h.CastError("Object",e,t)),this}var W=-1===t.indexOf(".")?[t]:t.split(".");if("string"==typeof this.schema.aliases[W[0]]&&(W[0]=this.schema.aliases[W[0]]),"adhocOrUndefined"===k&&b){var H;for(v=0;v<W.length;++v){var Y=W.slice(0,v+1).join(".");if(v+1<W.length&&"virtual"===this.schema.pathType(Y))return B.set(t,e,this),this;if(null!=(T=this.schema.path(Y))&&T instanceof y){H=!0;break}}if(null==T&&(T=x(this,t)),!H&&!T){if("throw"===b)throw new g(t);return this}}else{if("virtual"===k)return(T=this.schema.virtualpath(t)).applySetters(e,this),this;T=this.$__path(t)}var K,z=this._doc,Q="";for(v=0;v<W.length-1;++v)z=z[W[v]],Q+=(Q.length>0?".":"")+W[v],z||(this.$set(Q,{}),this.isSelected(Q)||this.unmarkModified(Q),z=this.$__getValue(Q));if(W.length<=1)K=t;else{for(v=0;v<W.length;++v){var J=W.slice(0,v+1).join(".");if(null===this.get(J,null,{getters:!1})){K=J;break}}K||(K=t)}var X=null!=s.$__.$options.priorDoc?s.$__.$options.priorDoc.$__getValue(t):m?void 0:s.$__getValue(t);if(!T)return this.$__set(K,t,m,W,T,e,X),this;if((T.$isSingleNested||T.$isMongooseArray)&&
/*!
 * ignore
 */
function(t,e){if(!t.$__.validationError)return;for(var r=Object.keys(t.$__.validationError.errors),n=0,o=r;n<o.length;n++){var i=o[n];i.startsWith(e+".")&&delete t.$__.validationError.errors[i]}0===Object.keys(t.$__.validationError.errors).length&&(t.$__.validationError=null)}
/*!
 * ignore
 */(this,t),T.$isSingleNested&&null!=e&&p){e instanceof tt&&(e=e.toObject({virtuals:!1,transform:!1}));for(var Z=0,et=Object.keys(e);Z<et.length;Z++){var rt=et[Z];this.$set(t+"."+rt,e[rt],m,n)}return this}var nt=!0;try{var ot,it=function(){if(null==T.options)return!1;if(!(e instanceof tt))return!1;var t=e.constructor,r=T.options.ref;if(null!=r&&(r===t.modelName||r===t.baseModelName))return!0;var n=T.options.refPath;if(null==n)return!1;var o=e.get(n);return o===t.modelName||o===t.baseModelName}(),st=!1;if(it&&e instanceof tt&&(this.populated(t,e._id,o({},G,e.constructor)),e.$__.wasPopulated=!0,st=!0),T.options&&Array.isArray(T.options[this.schema.options.typeKey])&&T.options[this.schema.options.typeKey].length&&T.options[this.schema.options.typeKey][0].ref&&
/*!
 * ignore
 */
function(t,e){if(!Array.isArray(t))return!1;if(0===t.length)return!1;var r,n=i(t);try{for(n.s();!(r=n.n()).done;){var o=r.value;if(!(o instanceof tt))return!1;if(null==o.constructor.modelName)return!1;if(o.constructor.modelName!=e&&o.constructor.baseModelName!=e)return!1}}catch(t){n.e(t)}finally{n.f()}return!0}(e,T.options[this.schema.options.typeKey][0].ref)){this.ownerDocument?(ot=o({},G,e[0].constructor),this.ownerDocument().populated(this.$__fullPath(t),e.map((function(t){return t._id})),ot)):(ot=o({},G,e[0].constructor),this.populated(t,e.map((function(t){return t._id})),ot));var at,ut=i(e);try{for(ut.s();!(at=ut.n()).done;){at.value.$__.wasPopulated=!0}}catch(t){ut.e(t)}finally{ut.f()}st=!0}if(null==this.schema.singleNestedPaths[t]&&(e=T.applySetters(e,this,!1,X)),T.$isMongooseDocumentArray&&Array.isArray(e)&&e.length>0&&null!=e[0]&&null!=e[0].$__&&null!=e[0].$__.populated){for(var ct=Object.keys(e[0].$__.populated),lt=function(){var r=pt[ft];s.populated(t+"."+r,e.map((function(t){return t.populated(r)})),e[0].$__.populated[r].options)},ft=0,pt=ct;ft<pt.length;ft++)lt();st=!0}if(!st&&this.$__.populated){if(Array.isArray(e)&&this.$__.populated[t])for(var ht=0;ht<e.length;++ht)e[ht]instanceof tt&&(e[ht]=e[ht]._id);delete this.$__.populated[t]}T.$isSingleNested&&null!=e&&function(t,e,r){var n=e.schema;if(null==n)return;for(var o=0,i=Object.keys(n.paths);o<i.length;o++){var s=i[o],a=n.paths[s];if(null!=a.$immutableSetter){var u=null==r?void 0:r.$__getValue(s);a.$immutableSetter.call(t,u)}}}(e,T,X),this.$markValid(t)}catch(r){r instanceof h.StrictModeError&&r.isImmutableError?this.invalidate(t,r):r instanceof h.CastError?(this.invalidate(r.path,r),r.$originalErrorPath&&this.invalidate(t,new h.CastError(T.instance,e,t,r.$originalErrorPath))):this.invalidate(t,new h.CastError(T.instance,e,t,r)),nt=!1}return nt&&(this.$__set(K,t,m,W,T,e,X),null!=this.$__.savedState&&(this.isNew||this.$__.savedState.hasOwnProperty(t)?this.$__.savedState.hasOwnProperty(t)&&I.deepEqual(e,this.$__.savedState[t])&&this.unmarkModified(t):this.$__.savedState[t]=X)),T.$isSingleNested&&(this.isDirectModified(t)||null==e)&&A(this,t),this},tt.prototype.set=tt.prototype.$set,tt.prototype.$__shouldModify=function(t,e,r,n,o,i,s){return!!this.isNew||null==this.schema.singleNestedPaths[e]&&(void 0===i&&!this.isSelected(e)||(void 0!==i||!(e in this.$__.activePaths.states.default))&&(!(this.populated(e)&&i instanceof tt&&U(i._id,s))&&(!U(i,s||I.getValue(e,this))||!(r||null==i||!(e in this.$__.activePaths.states.default)||!U(i,o.getDefault(this,r))))))},tt.prototype.$__set=function(t,e,n,o,i,s,a){l=l||r(26);var u=this.$__shouldModify(t,e,n,o,i,s,a),f=this;u&&(this.markModified(t),c||(c=r(82)),s&&s.isMongooseArray&&(s._registerAtomic("$set",s),s.isMongooseDocumentArray&&s.forEach((function(t){t&&t.__parentArray&&(t.__parentArray=s)})),this.$__.activePaths.forEach((function(t){t.startsWith(e+".")&&f.$__.activePaths.ignore(t)}))));for(var p=this._doc,h=0,y=o.length,d="";h<y;h++){var _=h+1===y;if(d+=d?"."+o[h]:o[h],Z.has(o[h]))return;_?p instanceof Map?p.set(o[h],s):p[o[h]]=s:(I.isPOJO(p[o[h]])||p[o[h]]&&p[o[h]]instanceof l||p[o[h]]&&p[o[h]].$isSingleNested||p[o[h]]&&Array.isArray(p[o[h]])||(p[o[h]]=p[o[h]]||{}),p=p[o[h]])}},tt.prototype.$__getValue=function(t){return I.getValue(t,this._doc)},tt.prototype.$__setValue=function(t,e){return I.setValue(t,e,this._doc),this},tt.prototype.get=function(t,e,r){var n;r=r||{},e&&(n=this.schema.interpretAsType(t,e,this.schema.options));var o=this.$__path(t);if(null==o&&(o=this.schema.virtualpath(t)),o instanceof y){var i=this.schema.virtualpath(t);null!=i&&(o=i)}var s=t.split("."),a=this._doc;if(o instanceof O)return o.applyGetters(void 0,this);"string"==typeof this.schema.aliases[s[0]]&&(s[0]=this.schema.aliases[s[0]]);for(var u=0,c=s.length;u<c;u++)a&&a._doc&&(a=a._doc),a=null==a?void 0:a instanceof Map?a.get(s[u],{getters:!1}):u===c-1?I.getValue(s[u],a):a[s[u]];if(n&&(a=n.cast(a)),null!=o&&!1!==r.getters)a=o.applyGetters(a,this);else if(this.schema.nested[t]&&r.virtuals)return ut(this,I.clone(a)||{},{path:t});return a},
/*!
 * ignore
 */
tt.prototype[J]=tt.prototype.get,tt.prototype.$__path=function(t){var e=this.$__.adhocPaths,r=e&&e.hasOwnProperty(t)?e[t]:null;return r||this.schema.path(t)},tt.prototype.markModified=function(t,e){this.$__.activePaths.modify(t),null==e||this.ownerDocument||(this.$__.pathsToScopes[t]=e)},tt.prototype.unmarkModified=function(t){this.$__.activePaths.init(t),delete this.$__.pathsToScopes[t]},tt.prototype.$ignore=function(t){this.$__.activePaths.ignore(t)},tt.prototype.directModifiedPaths=function(){return Object.keys(this.$__.activePaths.states.modify)},tt.prototype.$isEmpty=function(t){var e={minimize:!0,virtuals:!1,getters:!1,transform:!1};if(arguments.length>0){var r=this.get(t);return null==r||"object"===a(r)&&(I.isPOJO(r)?ot(r):0===Object.keys(r.toObject(e)).length)}return 0===Object.keys(this.toObject(e)).length},tt.prototype.modifiedPaths=function(t){t=t||{};var e=Object.keys(this.$__.activePaths.states.modify),r=this;return e.reduce((function(e,n){var o=n.split(".");if(e=e.concat(o.reduce((function(t,e,r){return t.concat(o.slice(0,r).concat(e).join("."))}),[]).filter((function(t){return-1===e.indexOf(t)}))),!t.includeChildren)return e;var s=r.get(n);if(null!=s&&"object"===a(s))if(s._doc&&(s=s._doc),Array.isArray(s)){for(var u=s.length,c=0;c<u;++c)if(-1===e.indexOf(n+"."+c)&&(e.push(n+"."+c),null!=s[c]&&s[c].$__)){var l,f=i(s[c].modifiedPaths());try{for(f.s();!(l=f.n()).done;){var p=l.value;e.push(n+"."+c+"."+p)}}catch(t){f.e(t)}finally{f.f()}}}else Object.keys(s).filter((function(t){return-1===e.indexOf(n+"."+t)})).forEach((function(t){e.push(n+"."+t)}));return e}),[])},tt.prototype[z]=tt.prototype.modifiedPaths,tt.prototype.isModified=function(t,e){if(t){Array.isArray(t)||(t=t.split(" "));var r=e||this[z](),n=Object.keys(this.$__.activePaths.states.modify);return t.some((function(t){return!!~r.indexOf(t)}))||t.some((function(t){return n.some((function(e){return e===t||t.startsWith(e+".")}))}))}return this.$__.activePaths.some("modify")},tt.prototype[K]=tt.prototype.isModified,tt.prototype.$isDefault=function(t){var e=this;if(null==t)return this.$__.activePaths.some("default");if("string"==typeof t&&-1===t.indexOf(" "))return this.$__.activePaths.states.default.hasOwnProperty(t);var r=t;return Array.isArray(r)||(r=r.split(" ")),r.some((function(t){return e.$__.activePaths.states.default.hasOwnProperty(t)}))},tt.prototype.$isDeleted=function(t){return 0===arguments.length?!!this.$__.isDeleted:(this.$__.isDeleted=!!t,this)},tt.prototype.isDirectModified=function(t){var e=this;if(null==t)return this.$__.activePaths.some("modify");if("string"==typeof t&&-1===t.indexOf(" "))return this.$__.activePaths.states.modify.hasOwnProperty(t);var r=t;return Array.isArray(r)||(r=r.split(" ")),r.some((function(t){return e.$__.activePaths.states.modify.hasOwnProperty(t)}))},tt.prototype.isInit=function(t){var e=this;if(null==t)return this.$__.activePaths.some("init");if("string"==typeof t&&-1===t.indexOf(" "))return this.$__.activePaths.states.init.hasOwnProperty(t);var r=t;return Array.isArray(r)||(r=r.split(" ")),r.some((function(t){return e.$__.activePaths.states.init.hasOwnProperty(t)}))},tt.prototype.isSelected=function(t){var e=this;if(null==this.$__.selected)return!0;if("_id"===t)return 0!==this.$__.selected._id;if(-1!==t.indexOf(" ")&&(t=t.split(" ")),Array.isArray(t))return t.some((function(t){return e.isSelected(t)}));var r=Object.keys(this.$__.selected),n=null;if(1===r.length&&"_id"===r[0])return 0===this.$__.selected._id;for(var o=0,i=r;o<i.length;o++){var s=i[o];if("_id"!==s&&k(this.$__.selected[s])){n=!!this.$__.selected[s];break}}if(null===n)return!0;if(t in this.$__.selected)return n;for(var a=t+".",u=0,c=r;u<c.length;u++){var l=c[u];if("_id"!==l){if(l.startsWith(a))return n||l!==a;if(a.startsWith(l+"."))return n}}return!n},tt.prototype[Y]=tt.prototype.isSelected,tt.prototype.isDirectSelected=function(t){var e=this;if(null==this.$__.selected)return!0;if("_id"===t)return 0!==this.$__.selected._id;if(-1!==t.indexOf(" ")&&(t=t.split(" ")),Array.isArray(t))return t.some((function(t){return e.isDirectSelected(t)}));var r=Object.keys(this.$__.selected),n=null;if(1===r.length&&"_id"===r[0])return 0===this.$__.selected._id;for(var o=0,i=r;o<i.length;o++){var s=i[o];if("_id"!==s&&k(this.$__.selected[s])){n=!!this.$__.selected[s];break}}return null===n||(this.$__.selected.hasOwnProperty(t)?n:!n)},tt.prototype.validate=function(t,e,r){var n,o=this;return this.$op="validate",null!=this.ownerDocument||(this.$__.validating?n=new m(this,{parentStack:e&&e.parentStack,conflictStack:this.$__.validating.stack}):this.$__.validating=new m(this,{parentStack:e&&e.parentStack})),"function"==typeof t?(r=t,e=null,t=null):"function"==typeof e&&(r=e,e=t,t=null),S(r,(function(r){if(null!=n)return r(n);o.$__validate(t,e,(function(t){o.$op=null,r(t)}))}),this.constructor.events)},tt.prototype.$__validate=function(t,r,n){var o=this;"function"==typeof t?(n=t,r=null,t=null):"function"==typeof r&&(n=r,r=null);var i,s=r&&"object"===a(r)&&"validateModifiedOnly"in r;i=s?!!r.validateModifiedOnly:this.schema.options.validateModifiedOnly;var u=this,c=function(){var t=o.$__.validationError;if(o.$__.validationError=void 0,i&&null!=t){for(var e=0,r=Object.keys(t.errors);e<r.length;e++){var n=r[e];o.isModified(n)||delete t.errors[n]}0===Object.keys(t.errors).length&&(t=void 0)}if(o.$__.cachedRequired={},o.emit("validate",u),o.constructor.emit("validate",u),o.$__.validating=null,t){for(var s in t.errors)!o[H]&&t.errors[s]instanceof h.CastError&&o.invalidate(s,t.errors[s]);return t}},l=it(this),f=i?l[0].filter((function(t){return o.isModified(t)})):l[0],p=l[1];if(Array.isArray(t)&&(f=st(f,t)),0===f.length)return e.nextTick((function(){var t=c();if(t)return u.schema.s.hooks.execPost("validate:error",u,[u],{error:t},(function(t){n(t)}));n(null,u)}));for(var y={},d=0,_=function(){var t=c();if(t)return u.schema.s.hooks.execPost("validate:error",u,[u],{error:t},(function(t){n(t)}));n(null,u)},m=function(t){null==t||y[t]||(y[t]=!0,d++,e.nextTick((function(){var e=u.schema.path(t);if(!e)return--d||_();if(u.$isValid(t)){var r,n=u.$__getValue(t);null==n&&(r=u.populated(t))&&(n=r);var o=t in u.$__.pathsToScopes?u.$__.pathsToScopes[t]:u,i={skipSchemaValidators:p[t],path:t};e.doValidate(n,(function(r){if(r&&(!e.$isMongooseDocumentArray||r.$isArrayValidatorError)){if(e.$isSingleNested&&r instanceof b&&!1===e.schema.options.storeSubdocValidationError)return--d||_();u.invalidate(t,r,void 0,!0)}--d||_()}),o,i)}else--d||_()})))},v=f.length,g=0;g<v;++g)m(f[g])},tt.prototype.validateSync=function(t,e){var r,n=this,o=this;r=e&&"object"===a(e)&&"validateModifiedOnly"in e?!!e.validateModifiedOnly:this.schema.options.validateModifiedOnly,"string"==typeof t&&(t=t.split(" "));var i=it(this),s=r?i[0].filter((function(t){return n.isModified(t)})):i[0],u=i[1];Array.isArray(t)&&(s=st(s,t));var c={};s.forEach((function(t){if(!c[t]){c[t]=!0;var e=o.schema.path(t);if(e&&o.$isValid(t)){var r=o.$__getValue(t),n=e.doValidateSync(r,o,{skipSchemaValidators:u[t],path:t});if(n&&(!e.$isMongooseDocumentArray||n.$isArrayValidatorError)){if(e.$isSingleNested&&n instanceof b&&!1===e.schema.options.storeSubdocValidationError)return;o.invalidate(t,n,void 0,!0)}}}}));var l=o.$__.validationError;if(o.$__.validationError=void 0,o.emit("validate",o),o.constructor.emit("validate",o),l)for(var f in l.errors)l.errors[f]instanceof h.CastError&&o.invalidate(f,l.errors[f]);return l},tt.prototype.invalidate=function(t,e,r,n){if(this.$__.validationError||(this.$__.validationError=new b(this)),!this.$__.validationError.errors[t])return e&&"string"!=typeof e||(e=new w({path:t,message:e,type:n||"user defined",value:r})),this.$__.validationError===e||this.$__.validationError.addError(t,e),this.$__.validationError},tt.prototype.$markValid=function(t){this.$__.validationError&&this.$__.validationError.errors[t]&&(delete this.$__.validationError.errors[t],0===Object.keys(this.$__.validationError.errors).length&&(this.$__.validationError=null))},tt.prototype.$isValid=function(t){var e=this;return null==this.$__.validationError||0===Object.keys(this.$__.validationError.errors).length||null!=t&&(-1!==t.indexOf(" ")&&(t=t.split(" ")),Array.isArray(t)?t.some((function(t){return null==e.$__.validationError.errors[t]})):null==this.$__.validationError.errors[t])},tt.prototype.$__reset=function(){var t=this;return u||(u=r(18)),this.$__.activePaths.map("init","modify",(function(e){return t.$__getValue(e)})).filter((function(t){return t&&t instanceof Array&&t.isMongooseDocumentArray&&t.length})).forEach((function(e){for(var r=e.length;r--;){var n=e[r];n&&n.$__reset()}t.$__.activePaths.init(e.$path()),e[q]=e[W],e[W]={}})),this.$__.activePaths.map("init","modify",(function(e){return t.$__getValue(e)})).filter((function(t){return t&&t.$isSingleNested})).forEach((function(e){e.$__reset(),t.$__.activePaths.init(e.$basePath)})),this.$__dirty().forEach((function(t){var e=t.value;e&&e[W]&&(e[q]=e[W],e[W]={})})),this.$__.backup={},this.$__.backup.activePaths={modify:Object.assign({},this.$__.activePaths.states.modify),default:Object.assign({},this.$__.activePaths.states.default)},this.$__.backup.validationError=this.$__.validationError,this.$__.backup.errors=this.errors,this.$__.activePaths.clear("modify"),this.$__.activePaths.clear("default"),this.$__.validationError=void 0,this.errors=void 0,t=this,this.schema.requiredPaths().forEach((function(e){t.$__.activePaths.require(e)})),this},
/*!
 * ignore
 */
tt.prototype.$__undoReset=function(){if(null!=this.$__.backup&&null!=this.$__.backup.activePaths){this.$__.activePaths.states.modify=this.$__.backup.activePaths.modify,this.$__.activePaths.states.default=this.$__.backup.activePaths.default,this.$__.validationError=this.$__.backup.validationError,this.errors=this.$__.backup.errors;var t,e=i(this.$__dirty());try{for(e.s();!(t=e.n()).done;){var r=t.value.value;r&&r[W]&&r[q]&&(r[W]=r[q])}}catch(t){e.e(t)}finally{e.f()}var n,o=i(this.$__getAllSubdocs());try{for(o.s();!(n=o.n()).done;){n.value.$__undoReset()}}catch(t){o.e(t)}finally{o.f()}}},tt.prototype.$__dirty=function(){var t=this,e=this.$__.activePaths.map("modify",(function(e){return{path:e,value:t.$__getValue(e),schema:t.$__path(e)}}));(e=e.concat(this.$__.activePaths.map("default",(function(e){if("_id"!==e&&null!=t.$__getValue(e))return{path:e,value:t.$__getValue(e),schema:t.$__path(e)}})))).sort((function(t,e){return t.path<e.path?-1:t.path>e.path?1:0}));var r,n,o=[];return e.forEach((function(t){t&&(null==r||0!==t.path.indexOf(r)?(r=t.path+".",o.push(t),n=t):null!=n&&null!=n.value&&null!=n.value[W]&&n.value.hasAtomics()&&(n.value[W]={},n.value[W].$set=n.value))})),n=r=null,o},tt.prototype.$__setSchema=function(t){t.plugin(T,{deduplicate:!0}),E(t.tree,this,void 0,t.options);for(var e=0,r=Object.keys(t.virtuals);e<r.length;e++){var n=r[e];t.virtuals[n]._applyDefaultGetters()}this.schema=t,this[Q]=t},tt.prototype.$__getArrayPathsToValidate=function(){return u||(u=r(18)),this.$__.activePaths.map("init","modify",function(t){return this.$__getValue(t)}.bind(this)).filter((function(t){return t&&t instanceof Array&&t.isMongooseDocumentArray&&t.length})).reduce((function(t,e){return t.concat(e)}),[]).filter((function(t){return t}))},tt.prototype.$__getAllSubdocs=function(){u||(u=r(18)),l=l||r(26);var t=this;return Object.keys(this._doc).reduce((function(e,r){return function t(e,r,n){var o=e;return n&&(o=e instanceof tt&&e[Q].paths[n]?e._doc[n]:e[n]),o instanceof l?r.push(o):o instanceof Map?r=Array.from(o.keys()).reduce((function(e,r){return t(o.get(r),e,null)}),r):o&&o.$isSingleNested?(r=Object.keys(o._doc).reduce((function(e,r){return t(o._doc,e,r)}),r)).push(o):o&&o.isMongooseDocumentArray?o.forEach((function(e){e&&e._doc&&(r=Object.keys(e._doc).reduce((function(r,n){return t(e._doc,r,n)}),r),e instanceof l&&r.push(e))})):o instanceof tt&&o.$__isNested&&(r=Object.keys(o).reduce((function(e,r){return t(o,e,r)}),r)),r}(t,e,r)}),[])},tt.prototype.$__handleReject=function(t){this.listeners("error").length?this.emit("error",t):this.constructor.listeners&&this.constructor.listeners("error").length&&this.constructor.emit("error",t)},tt.prototype.$toObject=function(t,e){var r,o={transform:!0,flattenDecimals:!0},i=e?"toJSON":"toObject",s=P(this,"constructor.base.options."+i,{}),a=P(this,"schema.options",{});o=I.options(o,L(s)),o=I.options(o,L(a[i]||{})),(t=I.isPOJO(t)?L(t):{})._calledWithOptions=t._calledWithOptions||L(t),"flattenMaps"in t||(t.flattenMaps=o.flattenMaps),r=null!=t._calledWithOptions.minimize?t.minimize:null!=o.minimize?o.minimize:a.minimize;var u=Object.assign(I.clone(t),{_isNested:!0,json:e,minimize:r});if(I.hasUserDefinedProperty(t,"getters")&&(u.getters=t.getters),I.hasUserDefinedProperty(t,"virtuals")&&(u.virtuals=t.virtuals),(t.depopulate||P(t,"_parentOptions.depopulate",!1))&&t._isNested&&this.$__.wasPopulated)return L(this._id,u);(t=I.options(o,t))._isNested=!0,t.json=e,t.minimize=r,u._parentOptions=t,u._skipSingleNestedGetters=!0;var c=Object.assign({},u);c._skipSingleNestedGetters=!1;var l=t.transform,f=L(this._doc,u)||{};t.getters&&(!function(t,e,r){var n,o,i=t.schema,s=Object.keys(i.paths),a=s.length,u=t._doc;if(!u)return e;for(;a--;){var c=(n=s[a]).split("."),l=c.length,f=l-1,p=e,h=void 0;if(u=t._doc,t.isSelected(n))for(var y=0;y<l;++y){if(h=c[y],o=u[h],y===f){var d=t.get(n);p[h]=L(d,r)}else{if(null==o){h in u&&(p[h]=o);break}p=p[h]||(p[h]={})}u=o}}}
/*!
 * Applies schema type transforms to `json`.
 *
 * @param {Document} self
 * @param {Object} json
 * @return {Object} `json`
 */(this,f,c),t.minimize&&(f=
/*!
 * Minimizes an object, removing undefined values and empty objects
 *
 * @param {Object} object to minimize
 * @return {Object}
 */
function t(e){var r,o,i,s=Object.keys(e),a=s.length;for(;a--;)o=s[a],i=e[o],I.isObject(i)&&!n.isBuffer(i)&&(e[o]=t(i)),void 0!==e[o]?r=!0:delete e[o];return r?e:void 0}(f)||{})),(t.virtuals||t.getters&&!1!==t.virtuals)&&ut(this,f,c,t),!1===t.versionKey&&this.schema.options.versionKey&&delete f[this.schema.options.versionKey];var p=t.transform;if(p&&function(t,e){var r=t.schema,n=Object.keys(r.paths||{});if(!t._doc)return e;for(var o=0,i=n;o<i.length;o++){var s=i[o],a=r.paths[s];if("function"==typeof a.options.transform){var u=t.get(s),c=a.options.transform.call(t,u);ct(s,c),I.setValue(s,c,e)}else if(null!=a.$embeddedSchemaType&&"function"==typeof a.$embeddedSchemaType.options.transform){for(var l=[].concat(t.get(s)),f=a.$embeddedSchemaType.options.transform,p=0;p<l.length;++p){var h=f.call(t,l[p]);l[p]=h,ct(s,h)}e[s]=l}}}(this,f),t.useProjection&&function(t,e){var r=t.schema,n=Object.keys(r.paths||{});if(!t._doc)return e;var o=t.$__.selected;void 0===o&&(o={},M.applyPaths(o,r));if(null==o||0===Object.keys(o).length)return e;for(var i=0,s=n;i<s.length;i++){var a=s[i];null==o[a]||o[a]||delete e[a]}}(this,f),!0===p||a.toObject&&p){var h=t.json?a.toJSON:a.toObject;h&&(p="function"==typeof t.transform?t.transform:h.transform)}else t.transform=l;if("function"==typeof p){var y=p(this,f,t);void 0!==y&&(f=y)}return f},tt.prototype.toObject=function(t){return this.$toObject(t)},tt.prototype.toJSON=function(t){return this.$toObject(t,!0)},tt.prototype.parent=function(){return this.$__.parent},tt.prototype.$parent=tt.prototype.parent,tt.prototype.inspect=function(t){var e;I.isPOJO(t)&&((e=t).minimize=!1);var r=this.toObject(e);return null==r?"MongooseDocument { "+r+" }":r},R.custom&&(
/*!
  * Avoid Node deprecation warning DEP0079
  */
tt.prototype[R.custom]=tt.prototype.inspect),tt.prototype.toString=function(){var t=this.inspect();return"string"==typeof t?t:R(t)},tt.prototype.equals=function(t){if(!t)return!1;var e=this.$__getValue("_id"),r=null!=t.$__?t.$__getValue("_id"):t;return e||r?e&&e.equals?e.equals(r):e===r:U(this,t)},tt.prototype.populate=function(){if(0===arguments.length)return this;var t,e=this.$__.populate||(this.$__.populate={}),r=I.args(arguments);if("function"==typeof r[r.length-1]&&(t=r.pop()),r.length){var n,o=I.populate.apply(null,r),s=i(o);try{for(s.s();!(n=s.n()).done;){var a=n.value;e[a.path]=a}}catch(t){s.e(t)}finally{s.f()}}if(t){var u=I.object.vals(e);this.$__.populate=void 0;var c=this.constructor;if(this.$__isNested){c=this.$__[X].constructor;var l=this.$__.nestedPath;u.forEach((function(t){t.path=l+"."+t.path}))}if(null!=this.$session()){var f=this.$session();u.forEach((function(t){null!=t.options?"session"in t.options||(t.options.session=f):t.options={session:f}}))}c.populate(this,u,t)}return this},tt.prototype.execPopulate=function(t){var e=this,r=null!=t&&"function"!=typeof t;return r?this.populate.apply(this,arguments).execPopulate():S(t,(function(t){e.populate(t)}),this.constructor.events)},tt.prototype.populated=function(t,e,r){if(null==e){if(!this.$__.populated)return;var n=this.$__.populated[t];return n?n.value:void 0}if(!0===e){if(!this.$__.populated)return;return this.$__.populated[t]}this.$__.populated||(this.$__.populated={}),this.$__.populated[t]={value:e,options:r};for(var o=t.split("."),i=0;i<o.length-1;++i){var s=o.slice(0,i+1).join("."),a=this.get(s);if(null!=a&&null!=a.$__&&this.populated(s)){var u=o.slice(i+1).join(".");a.populated(u,e,r);break}}return e},tt.prototype.depopulate=function(t){var e;"string"==typeof t&&(t=t.split(" "));var r=this.$$populatedVirtuals?Object.keys(this.$$populatedVirtuals):[],n=P(this,"$__.populated",{});if(0===arguments.length){var o,s=i(r);try{for(s.s();!(o=s.n()).done;){var a=o.value;delete this.$$populatedVirtuals[a],delete this._doc[a],delete n[a]}}catch(t){s.e(t)}finally{s.f()}for(var u=Object.keys(n),c=0,l=u;c<l.length;c++){var f=l[c];(e=this.populated(f))&&(delete n[f],this.$set(f,e))}return this}var p,h=i(t);try{for(h.s();!(p=h.n()).done;){var y=p.value;e=this.populated(y),delete n[y],-1!==r.indexOf(y)?(delete this.$$populatedVirtuals[y],delete this._doc[y]):e&&this.$set(y,e)}}catch(t){h.e(t)}finally{h.f()}return this},tt.prototype.$__fullPath=function(t){return t||""},tt.prototype.getChanges=function(){var t=this.$__delta();return t?t[1]:{}},
/*!
 * Module exports.
 */
tt.ValidationError=b,t.exports=tt}).call(this,r(8),r(1).Buffer)},function(t,e,r){"use strict";(function(n){
/*!
 * Module dependencies.
 */
function o(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return i(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return i(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,a=!0,u=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return a=t.done,t},e:function(t){u=!0,s=t},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw s}}}}function i(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function s(t){return(s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var a=r(5),u=r(9),c=r(48),l=r(72),f=r(3),p=r(134),h=r(50),y=r(0).schemaTypeSymbol,d=r(4),_=r(2),m=r(0).validatorErrorSymbol,v=r(0).documentIsSelected,g=r(0).documentIsModified,b=a.CastError,w=a.ValidatorError;function O(t,e,r){this[y]=!0,this.path=t,this.instance=r,this.validators=[],this.getters=this.constructor.hasOwnProperty("getters")?this.constructor.getters.slice():[],this.setters=[],e=e||{};for(var n=this.constructor.defaultOptions||{},o=0,i=Object.keys(n);o<i.length;o++){var a=i[o];n.hasOwnProperty(a)&&!e.hasOwnProperty(a)&&(e[a]=n[a])}null==e.select&&delete e.select;var c=this.OptionsConstructor||u;this.options=new c(e),this._index=null,_.hasUserDefinedProperty(this.options,"immutable")&&(this.$immutable=this.options.immutable,p(this));for(var l=0,f=Object.keys(this.options);l<f.length;l++){var h=f[l];if("cast"!==h){if(_.hasUserDefinedProperty(this.options,h)&&"function"==typeof this[h]){if("index"===h&&this._index){if(!1===e.index){var d=this._index;if("object"===s(d)&&null!=d){if(d.unique)throw new Error('Path "'+this.path+'" may not have `index` set to false and `unique` set to true');if(d.sparse)throw new Error('Path "'+this.path+'" may not have `index` set to false and `sparse` set to true')}this._index=!1}continue}var m=e[h];if("default"===h){this.default(m);continue}var v=Array.isArray(m)?m:[m];this[h].apply(this,v)}}else this.castFunction(this.options[h])}Object.defineProperty(this,"$$context",{enumerable:!1,configurable:!1,writable:!0,value:null})}
/*!
 * ignore
 */O.prototype.OptionsConstructor=u,O.cast=function(t){return 0===arguments.length||(!1===t&&(t=function(t){return t}),this._cast=t),this._cast},O.prototype.castFunction=function(t){return 0===arguments.length||(!1===t&&(t=this.constructor._defaultCaster||function(t){return t}),this._castFunction=t),this._castFunction},O.set=function(t,e){this.hasOwnProperty("defaultOptions")||(this.defaultOptions=Object.assign({},this.defaultOptions)),this.defaultOptions[t]=e},O.get=function(t){this.getters=this.hasOwnProperty("getters")?this.getters:[],this.getters.push(t)},O.prototype.default=function(t){if(1===arguments.length){if(void 0===t)return void(this.defaultValue=void 0);if(null!=t&&t.instanceOfSchema)throw new a("Cannot set default value of path `"+this.path+"` to a mongoose Schema instance.");return this.defaultValue=t,this.defaultValue}return arguments.length>1&&(this.defaultValue=_.args(arguments)),this.defaultValue},O.prototype.index=function(t){return this._index=t,_.expires(this._index),this},O.prototype.unique=function(t){if(!1===this._index){if(!t)return;throw new Error('Path "'+this.path+'" may not have `index` set to false and `unique` set to true')}return null==this._index||!0===this._index?this._index={}:"string"==typeof this._index&&(this._index={type:this._index}),this._index.unique=t,this},O.prototype.text=function(t){if(!1===this._index){if(!t)return;throw new Error('Path "'+this.path+'" may not have `index` set to false and `text` set to true')}return null===this._index||void 0===this._index||"boolean"==typeof this._index?this._index={}:"string"==typeof this._index&&(this._index={type:this._index}),this._index.text=t,this},O.prototype.sparse=function(t){if(!1===this._index){if(!t)return;throw new Error('Path "'+this.path+'" may not have `index` set to false and `sparse` set to true')}return null==this._index||"boolean"==typeof this._index?this._index={}:"string"==typeof this._index&&(this._index={type:this._index}),this._index.sparse=t,this},O.prototype.immutable=function(t){return this.$immutable=t,p(this),this},O.prototype.transform=function(t){return this.options.transform=t,this},O.prototype.set=function(t){if("function"!=typeof t)throw new TypeError("A setter must be a function.");return this.setters.push(t),this},O.prototype.get=function(t){if("function"!=typeof t)throw new TypeError("A getter must be a function.");return this.getters.push(t),this},O.prototype.validate=function(t,e,r){var n,o,i,u;if("function"==typeof t||t&&"RegExp"===_.getFunctionName(t.constructor))return"function"==typeof e?(n={validator:t,message:e}).type=r||"user defined":e instanceof Object&&!r?((n=_.clone(e)).message||(n.message=n.msg),n.validator=t,n.type=n.type||"user defined"):(null==e&&(e=a.messages.general.default),r||(r="user defined"),n={message:e,type:r,validator:t}),n.isAsync&&S(),this.validators.push(n),this;for(o=0,i=arguments.length;o<i;o++){if(u=arguments[o],!_.isPOJO(u)){var c="Invalid validator. Received ("+s(u)+") "+u+". See http://mongoosejs.com/docs/api.html#schematype_SchemaType-validate";throw new Error(c)}this.validate(u.validator,u)}return this};
/*!
 * ignore
 */
var S=d.deprecate((function(){}),"Mongoose: the `isAsync` option for custom validators is deprecated. Make your async validators return a promise instead: https://mongoosejs.com/docs/validation.html#async-custom-validators");
/*!
 * ignore
 */
function A(t){return this.castForQuery(t)}
/*!
 * ignore
 */
/*!
 * Just like handleArray, except also allows `[]` because surprisingly
 * `$in: [1, []]` works fine
 */
function E(t){var e=this;return Array.isArray(t)?t.map((function(t){return Array.isArray(t)&&0===t.length?t:e.castForQuery(t)})):[this.castForQuery(t)]}
/*!
 * ignore
 */O.prototype.required=function(t,e){var r={};if(arguments.length>0&&null==t)return this.validators=this.validators.filter((function(t){return t.validator!==this.requiredValidator}),this),this.isRequired=!1,delete this.originalRequiredValue,this;if("object"===s(t)&&(e=(r=t).message||e,t=t.isRequired),!1===t)return this.validators=this.validators.filter((function(t){return t.validator!==this.requiredValidator}),this),this.isRequired=!1,delete this.originalRequiredValue,this;var n=this;this.isRequired=!0,this.requiredValidator=function(e){var r=f(this,"$__.cachedRequired");if(null!=r&&!this[v](n.path)&&!this[g](n.path))return!0;if(null!=r&&n.path in r){var o=!r[n.path]||n.checkRequired(e,this);return delete r[n.path],o}return"function"==typeof t&&!t.apply(this)||n.checkRequired(e,this)},this.originalRequiredValue=t,"string"==typeof t&&(e=t,t=void 0);var o=e||a.messages.general.required;return this.validators.unshift(Object.assign({},r,{validator:this.requiredValidator,message:o,type:"required"})),this},O.prototype.ref=function(t){return this.options.ref=t,this},O.prototype.getDefault=function(t,e){var r="function"==typeof this.defaultValue?this.defaultValue.call(t):this.defaultValue;if(null!=r){"object"!==s(r)||this.options&&this.options.shared||(r=_.clone(r));var n=this.applySetters(r,t,e);return n&&n.$isSingleNested&&(n.$__parent=t),n}return r},
/*!
 * Applies setters without casting
 *
 * @api private
 */
O.prototype._applySetters=function(t,e){var r,n=t,i=this.setters,s=o(_.clone(i).reverse());try{for(s.s();!(r=s.n()).done;){n=r.value.call(e,n,this)}}catch(t){s.e(t)}finally{s.f()}return n},
/*!
 * ignore
 */
O.prototype._castNullish=function(t){return t},O.prototype.applySetters=function(t,e,r,n,o){var i=this._applySetters(t,e,r,n,o);return null==i?this._castNullish(i):i=this.cast(i,e,r,n,o)},O.prototype.applyGetters=function(t,e){var r=t,n=this.getters,o=n.length;if(0===o)return r;for(var i=0;i<o;++i)r=n[i].call(e,r,this);return r},O.prototype.select=function(t){return this.selected=!!t,this},O.prototype.doValidate=function(t,e,r,n){var o=!1,i=this.path,a=this.validators.filter((function(t){return null!=t&&"object"===s(t)})),u=a.length;if(!u)return e(null);var c=this;function l(t,r){if(!o)if(void 0===t||t)--u<=0&&h((function(){e(null)}));else{var n=r.ErrorConstructor||w;(o=new n(r))[m]=!0,h((function(){e(o)}))}}a.forEach((function(e){if(!o){var s,a=e.validator,u=_.clone(e);if(u.path=n&&n.path?n.path:i,u.value=t,a instanceof RegExp)l(a.test(t),u);else if("function"==typeof a)if(void 0!==t||a===c.requiredValidator)if(u.isAsync)!
/*!
 * Handle async validators
 */
function(t,e,r,n,o){var i=!1,s=t.call(e,r,(function(t,e){i||(i=!0,e&&(n.message=e),o(t,n))}));"boolean"==typeof s?(i=!0,o(s,n)):s&&"function"==typeof s.then&&s.then((function(t){i||(i=!0,o(t,n))}),(function(t){i||(i=!0,n.reason=t,n.message=t.message,o(!1,n))}))}(a,r,t,u,l);else{try{s=u.propsParameter?a.call(r,t,u):a.call(r,t)}catch(t){s=!1,u.reason=t,t.message&&(u.message=t.message)}null!=s&&"function"==typeof s.then?s.then((function(t){l(t,u)}),(function(t){u.reason=t,u.message=t.message,l(s=!1,u)})):l(s,u)}else l(!0,u)}}))},O.prototype.doValidateSync=function(t,e,r){var n=this.path;if(!this.validators.length)return null;var o=this.validators;if(void 0===t){if(!(this.validators.length>0&&"required"===this.validators[0].type))return null;o=[this.validators[0]]}var i=null;return o.forEach((function(o){if(!i&&null!=o&&"object"===s(o)){var u,c=o.validator,l=_.clone(o);if(l.path=r&&r.path?r.path:n,l.value=t,!c.isAsync)if(c instanceof RegExp)a(c.test(t),l);else if("function"==typeof c){try{u=l.propsParameter?c.call(e,t,l):c.call(e,t)}catch(t){u=!1,l.reason=t}null!=u&&"function"==typeof u.then||a(u,l)}}})),i;function a(t,e){if(!i&&void 0!==t&&!t){var r=e.ErrorConstructor||w;(i=new r(e))[m]=!0}}},O._isRef=function(t,e,r,o){var i=o&&t.options&&(t.options.ref||t.options.refPath);if(!i&&r&&null!=r.$__){var s=r.$__fullPath(t.path);i=(r.ownerDocument?r.ownerDocument():r).populated(s)||r.populated(t.path)}if(i){if(null==e)return!0;if(!n.isBuffer(e)&&"Binary"!==e._bsontype&&_.isObject(e))return!0}return!1},O.prototype.$conditionalHandlers={$all:function(t){var e=this;return Array.isArray(t)?t.map((function(t){return e.castForQuery(t)})):[this.castForQuery(t)]},$eq:A,$in:E,$ne:A,$nin:E,$exists:c,$type:l},
/*!
 * Wraps `castForQuery` to handle context
 */
O.prototype.castForQueryWrapper=function(t){if(this.$$context=t.context,"$conditional"in t){var e=this.castForQuery(t.$conditional,t.val);return this.$$context=null,e}if(t.$skipQueryCastForUpdate||t.$applySetters){var r=this._castForQuery(t.val);return this.$$context=null,r}var n=this.castForQuery(t.val);return this.$$context=null,n},O.prototype.castForQuery=function(t,e){var r;if(2===arguments.length){if(!(r=this.$conditionalHandlers[t]))throw new Error("Can't use "+t);return r.call(this,e)}return e=t,this._castForQuery(e)},
/*!
 * Internal switch for runSetters
 *
 * @api private
 */
O.prototype._castForQuery=function(t){return this.applySetters(t,this.$$context)},O.checkRequired=function(t){return arguments.length>0&&(this._checkRequired=t),this._checkRequired},O.prototype.checkRequired=function(t){return null!=t},
/*!
 * ignore
 */
O.prototype.clone=function(){var t=Object.assign({},this.options),e=new this.constructor(this.path,t,this.instance);return e.validators=this.validators.slice(),void 0!==this.requiredValidator&&(e.requiredValidator=this.requiredValidator),void 0!==this.defaultValue&&(e.defaultValue=this.defaultValue),void 0!==this.$immutable&&void 0===this.options.immutable&&(e.$immutable=this.$immutable,p(e)),void 0!==this._index&&(e._index=this._index),void 0!==this.selected&&(e.selected=this.selected),void 0!==this.isRequired&&(e.isRequired=this.isRequired),void 0!==this.originalRequiredValue&&(e.originalRequiredValue=this.originalRequiredValue),e.getters=this.getters.slice(),e.setters=this.setters.slice(),e},
/*!
 * Module exports.
 */
t.exports=e=O,e.CastError=b,e.ValidatorError=w}).call(this,r(1).Buffer)},function(t,e){var r,n,o=t.exports={};function i(){throw new Error("setTimeout has not been defined")}function s(){throw new Error("clearTimeout has not been defined")}function a(t){if(r===setTimeout)return setTimeout(t,0);if((r===i||!r)&&setTimeout)return r=setTimeout,setTimeout(t,0);try{return r(t,0)}catch(e){try{return r.call(null,t,0)}catch(e){return r.call(this,t,0)}}}!function(){try{r="function"==typeof setTimeout?setTimeout:i}catch(t){r=i}try{n="function"==typeof clearTimeout?clearTimeout:s}catch(t){n=s}}();var u,c=[],l=!1,f=-1;function p(){l&&u&&(l=!1,u.length?c=u.concat(c):f=-1,c.length&&h())}function h(){if(!l){var t=a(p);l=!0;for(var e=c.length;e;){for(u=c,c=[];++f<e;)u&&u[f].run();f=-1,e=c.length}u=null,l=!1,function(t){if(n===clearTimeout)return clearTimeout(t);if((n===s||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(t);try{n(t)}catch(e){try{return n.call(null,t)}catch(e){return n.call(this,t)}}}(t)}}function y(t,e){this.fun=t,this.array=e}function d(){}o.nextTick=function(t){var e=new Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)e[r-1]=arguments[r];c.push(new y(t,e)),1!==c.length||l||a(h)},y.prototype.run=function(){this.fun.apply(null,this.array)},o.title="browser",o.browser=!0,o.env={},o.argv=[],o.version="",o.versions={},o.on=d,o.addListener=d,o.once=d,o.off=d,o.removeListener=d,o.removeAllListeners=d,o.emit=d,o.prependListener=d,o.prependOnceListener=d,o.listeners=function(t){return[]},o.binding=function(t){throw new Error("process.binding is not supported")},o.cwd=function(){return"/"},o.chdir=function(t){throw new Error("process.chdir is not supported")},o.umask=function(){return 0}},function(t,e,r){"use strict";var n=r(28),o=function t(e){if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),null==e)return this;Object.assign(this,n(e))},i=r(10);Object.defineProperty(o.prototype,"type",i),Object.defineProperty(o.prototype,"validate",i),Object.defineProperty(o.prototype,"cast",i),Object.defineProperty(o.prototype,"required",i),Object.defineProperty(o.prototype,"default",i),Object.defineProperty(o.prototype,"ref",i),Object.defineProperty(o.prototype,"select",i),Object.defineProperty(o.prototype,"index",i),Object.defineProperty(o.prototype,"unique",i),Object.defineProperty(o.prototype,"immutable",i),Object.defineProperty(o.prototype,"sparse",i),Object.defineProperty(o.prototype,"text",i),Object.defineProperty(o.prototype,"transform",i),t.exports=o},function(t,e,r){"use strict";t.exports=Object.freeze({enumerable:!0,configurable:!0,writable:!0,value:void 0})},function(t,e){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"===("undefined"==typeof window?"undefined":r(window))&&(n=window)}t.exports=n},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function s(t,e){return(s=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function a(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=c(t);if(e){var o=c(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return u(this,r)}}function u(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function c(t){return(c=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var l=r(14),f=r(3),p=r(4),h=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&s(t,e)}(l,t);var e,r,n,c=a(l);function l(t,e,r,n,i){var s;if(o(this,l),arguments.length>0){var a=y(e),f=d(i),p=_(null,t,a,r,f);(s=c.call(this,p)).init(t,e,r,n,i)}else s=c.call(this,_());return u(s)}
/*!
   * ignore
   */return e=l,(r=[{key:"init",value:function(t,e,r,n,o){this.stringValue=y(e),this.messageFormat=d(o),this.kind=t,this.value=e,this.path=r,this.reason=n}
/*!
     * ignore
     * @param {Readonly<CastError>} other
     */},{key:"copy",value:function(t){this.messageFormat=t.messageFormat,this.stringValue=t.stringValue,this.kind=t.kind,this.value=t.value,this.path=t.path,this.reason=t.reason,this.message=t.message}
/*!
     * ignore
     */},{key:"setModel",value:function(t){this.model=t,this.message=_(t,this.kind,this.stringValue,this.path,this.messageFormat)}}])&&i(e.prototype,r),n&&i(e,n),l}(l);function y(t){var e=p.inspect(t);return(e=e.replace(/^'|'$/g,'"')).startsWith('"')||(e='"'+e+'"'),e}function d(t){var e=f(t,"options.cast",null);if("string"==typeof e)return e}
/*!
 * ignore
 */function _(t,e,r,n,o){if(null!=o){var i=o.replace("{KIND}",e).replace("{VALUE}",r).replace("{PATH}",n);return null!=t&&(i=i.replace("{MODEL}",t.modelName)),i}var s="Cast to "+e+" failed for value "+r+' at path "'+n+'"';return null!=t&&(s+=' for model "'+t.modelName+'"'),s}
/*!
 * exports
 */Object.defineProperty(h.prototype,"name",{value:"CastError"}),t.exports=h},function(t,e,r){"use strict";var n=r(15).get().ObjectId,o=r(0).objectIdSymbol;
/*!
 * Getter for convenience with populate, see gh-6115
 */
Object.defineProperty(n.prototype,"_id",{enumerable:!1,configurable:!0,get:function(){return this}}),n.prototype[o]=!0,t.exports=n},function(t,e,r){"use strict";
/*!
 * ignore
 */function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function s(t){var e="function"==typeof Map?new Map:void 0;return(s=function(t){if(null===t||(r=t,-1===Function.toString.call(r).indexOf("[native code]")))return t;var r;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,n)}function n(){return a(t,arguments,l(this).constructor)}return n.prototype=Object.create(t.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),c(n,t)})(t)}function a(t,e,r){return(a=u()?Reflect.construct:function(t,e,r){var n=[null];n.push.apply(n,e);var o=new(Function.bind.apply(t,n));return r&&c(o,r.prototype),o}).apply(null,arguments)}function u(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}function c(t,e){return(c=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function l(t){return(l=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var f=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&c(t,e)}(s,t);var e,r,n=(e=s,r=u(),function(){var t,n=l(e);if(r){var o=l(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return i(this,t)});function s(){return o(this,s),n.apply(this,arguments)}return s}(s(Error));Object.defineProperty(f.prototype,"name",{value:"MongooseError"}),t.exports=f},function(t,e,r){"use strict";
/*!
 * ignore
 */var n=null;t.exports.get=function(){return n},t.exports.set=function(t){n=t}},function(t,e,r){"use strict";(function(e){function r(t,r){return new e(t,r)}t.exports={normalizedFunctionString:function(t){return t.toString().replace(/function *\(/,"function (")},allocBuffer:"function"==typeof e.alloc?function(){return e.alloc.apply(e,arguments)}:r,toBuffer:"function"==typeof e.from?function(){return e.from.apply(e,arguments)}:r}}).call(this,r(1).Buffer)},function(t,e,r){"use strict";
/*!
 * ignore
 */e.internalToObjectOptions={transform:!1,virtuals:!1,getters:!1,_skipDepopulateTopLevel:!0,depopulate:!0,flattenDecimals:!1}},function(t,e,r){"use strict";(function(e){
/*!
 * Module dependencies.
 */
function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return i(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return i(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,a=!0,u=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return a=t.done,t},e:function(t){u=!0,s=t},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw s}}}}function i(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function s(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function a(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function u(t,e,r){return(u="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,r){var n=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=p(t)););return t}(t,e);if(n){var o=Object.getOwnPropertyDescriptor(n,e);return o.get?o.get.call(r):o.value}})(t,e,r||t)}function c(t,e){return(c=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function l(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=p(t);if(e){var o=p(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return f(this,r)}}function f(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function p(t){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var h=r(83),y=r(6),d=r(13),_=r(86),m=r(34),v=r(17).internalToObjectOptions,g=r(4),b=r(2),w=r(0).arrayAtomicsSymbol,O=r(0).arrayParentSymbol,S=r(0).arrayPathSymbol,A=r(0).arraySchemaSymbol,E=r(0).documentArrayParent,j=Array.prototype.push,$=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&c(t,e)}(n,t);var r=l(n);function n(){return s(this,n),r.apply(this,arguments)}return function(t,e,r){e&&a(t.prototype,e),r&&a(t,r)}(n,[{key:"toBSON",
/*!
     * ignore
     */
value:function(){return this.toObject(v)}
/*!
     * ignore
     */},{key:"map",value:function(){var t=u(p(n.prototype),"map",this).apply(this,arguments);return t[A]=null,t[S]=null,t[O]=null,t}},{key:"_cast",value:function(t,r){if(null==this[A])return t;var n=this[A].casterConstructor;if((n.$isMongooseDocumentArray?t&&t.isMongooseDocumentArray:t instanceof n)||t&&t.constructor&&t.constructor.baseCasterConstructor===n)return t[E]&&t.__parentArray||(t[E]=this[O],t.__parentArray=this),t.$setIndex(r),t;if(null==t)return null;if((e.isBuffer(t)||t instanceof d||!b.isObject(t))&&(t={_id:t}),t&&n.discriminators&&n.schema&&n.schema.options&&n.schema.options.discriminatorKey)if("string"==typeof t[n.schema.options.discriminatorKey]&&n.discriminators[t[n.schema.options.discriminatorKey]])n=n.discriminators[t[n.schema.options.discriminatorKey]];else{var o=m(n,t[n.schema.options.discriminatorKey]);o&&(n=o)}return n.$isMongooseDocumentArray?n.cast(t,this,void 0,void 0,r):new n(t,this,void 0,void 0,r)}},{key:"id",value:function(t){var e,r,n;try{e=_(t).toString()}catch(t){e=null}var i,s=o(this);try{for(s.s();!(i=s.n()).done;){var a=i.value;if(a&&null!=(n=a.get("_id")))if(n instanceof y){if(r||(r=String(t)),r==n._id)return a}else if(t instanceof d||n instanceof d){if(e==n)return a}else if(t==n||b.deepEqual(t,n))return a}}catch(t){s.e(t)}finally{s.f()}return null}},{key:"toObject",value:function(t){return[].concat(this.map((function(e){return null==e?null:"function"!=typeof e.toObject?e:e.toObject(t)})))}},{key:"slice",value:function(){var t=u(p(n.prototype),"slice",this).apply(this,arguments);return t[O]=this[O],t[S]=this[S],t}},{key:"push",value:function(){var t=u(p(n.prototype),"push",this).apply(this,arguments);return P(this),t}},{key:"pull",value:function(){var t=u(p(n.prototype),"pull",this).apply(this,arguments);return P(this),t}},{key:"shift",value:function(){var t=u(p(n.prototype),"shift",this).apply(this,arguments);return P(this),t}},{key:"splice",value:function(){var t=u(p(n.prototype),"splice",this).apply(this,arguments);return P(this),t}},{key:"inspect",value:function(){return this.toObject()}},{key:"create",value:function(t){var e=this[A].casterConstructor;if(t&&e.discriminators&&e.schema&&e.schema.options&&e.schema.options.discriminatorKey)if("string"==typeof t[e.schema.options.discriminatorKey]&&e.discriminators[t[e.schema.options.discriminatorKey]])e=e.discriminators[t[e.schema.options.discriminatorKey]];else{var r=m(e,t[e.schema.options.discriminatorKey]);r&&(e=r)}return new e(t,this)}
/*!
     * ignore
     */},{key:"notify",value:function(t){var e=this;return function r(n,o){for(var i=(o=o||e).length;i--;)if(null!=o[i]){switch(t){case"save":n=e[i]}o[i].isMongooseArray?r(n,o[i]):o[i]&&o[i].emit(t,n)}}}},{key:"isMongooseDocumentArray",get:function(){return!0}}]),n}(h);
/*!
 * If this is a document array, each element may contain single
 * populated paths, so we need to modify the top-level document's
 * populated cache. See gh-8247, gh-8265.
 */
function P(t){var e=t[O];if(e&&null!=e.$__.populated){var r,n=o(Object.keys(e.$__.populated).filter((function(e){return e.startsWith(t[S]+".")})));try{var i=function(){var n=r.value,o=n.slice((t[S]+".").length);if(!Array.isArray(e.$__.populated[n].value))return"continue";e.$__.populated[n].value=t.map((function(t){return t.populated(o)}))};for(n.s();!(r=n.n()).done;)i()}catch(t){n.e(t)}finally{n.f()}}}g.inspect.custom&&($.prototype[g.inspect.custom]=$.prototype.inspect),
/*!
 * Module exports.
 */
t.exports=function(t,e,r){var n=new $;if(n[w]={},n[A]=void 0,Array.isArray(t)&&(t[S]===e&&t[O]===r&&(n[w]=Object.assign({},t[w])),t.forEach((function(t){j.call(n,t)}))),n[S]=e,r&&r instanceof y)for(n[O]=r,n[A]=r.schema.path(e);null!=n&&null!=n[A]&&n[A].$isMongooseArray&&!n[A].$isMongooseDocumentArray;)n[A]=n[A].casterConstructor;return n}}).call(this,r(1).Buffer)},function(t,e,r){"use strict";function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o,i="object"===("undefined"==typeof Reflect?"undefined":n(Reflect))?Reflect:null,s=i&&"function"==typeof i.apply?i.apply:function(t,e,r){return Function.prototype.apply.call(t,e,r)};o=i&&"function"==typeof i.ownKeys?i.ownKeys:Object.getOwnPropertySymbols?function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:function(t){return Object.getOwnPropertyNames(t)};var a=Number.isNaN||function(t){return t!=t};function u(){u.init.call(this)}t.exports=u,t.exports.once=function(t,e){return new Promise((function(r,n){function o(){void 0!==i&&t.removeListener("error",i),r([].slice.call(arguments))}var i;"error"!==e&&(i=function(r){t.removeListener(e,o),n(r)},t.once("error",i)),t.once(e,o)}))},u.EventEmitter=u,u.prototype._events=void 0,u.prototype._eventsCount=0,u.prototype._maxListeners=void 0;var c=10;function l(t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+n(t))}function f(t){return void 0===t._maxListeners?u.defaultMaxListeners:t._maxListeners}function p(t,e,r,n){var o,i,s,a;if(l(r),void 0===(i=t._events)?(i=t._events=Object.create(null),t._eventsCount=0):(void 0!==i.newListener&&(t.emit("newListener",e,r.listener?r.listener:r),i=t._events),s=i[e]),void 0===s)s=i[e]=r,++t._eventsCount;else if("function"==typeof s?s=i[e]=n?[r,s]:[s,r]:n?s.unshift(r):s.push(r),(o=f(t))>0&&s.length>o&&!s.warned){s.warned=!0;var u=new Error("Possible EventEmitter memory leak detected. "+s.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");u.name="MaxListenersExceededWarning",u.emitter=t,u.type=e,u.count=s.length,a=u,console&&console.warn&&console.warn(a)}return t}function h(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function y(t,e,r){var n={fired:!1,wrapFn:void 0,target:t,type:e,listener:r},o=h.bind(n);return o.listener=r,n.wrapFn=o,o}function d(t,e,r){var n=t._events;if(void 0===n)return[];var o=n[e];return void 0===o?[]:"function"==typeof o?r?[o.listener||o]:[o]:r?function(t){for(var e=new Array(t.length),r=0;r<e.length;++r)e[r]=t[r].listener||t[r];return e}(o):m(o,o.length)}function _(t){var e=this._events;if(void 0!==e){var r=e[t];if("function"==typeof r)return 1;if(void 0!==r)return r.length}return 0}function m(t,e){for(var r=new Array(e),n=0;n<e;++n)r[n]=t[n];return r}Object.defineProperty(u,"defaultMaxListeners",{enumerable:!0,get:function(){return c},set:function(t){if("number"!=typeof t||t<0||a(t))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+t+".");c=t}}),u.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},u.prototype.setMaxListeners=function(t){if("number"!=typeof t||t<0||a(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this},u.prototype.getMaxListeners=function(){return f(this)},u.prototype.emit=function(t){for(var e=[],r=1;r<arguments.length;r++)e.push(arguments[r]);var n="error"===t,o=this._events;if(void 0!==o)n=n&&void 0===o.error;else if(!n)return!1;if(n){var i;if(e.length>0&&(i=e[0]),i instanceof Error)throw i;var a=new Error("Unhandled error."+(i?" ("+i.message+")":""));throw a.context=i,a}var u=o[t];if(void 0===u)return!1;if("function"==typeof u)s(u,this,e);else{var c=u.length,l=m(u,c);for(r=0;r<c;++r)s(l[r],this,e)}return!0},u.prototype.addListener=function(t,e){return p(this,t,e,!1)},u.prototype.on=u.prototype.addListener,u.prototype.prependListener=function(t,e){return p(this,t,e,!0)},u.prototype.once=function(t,e){return l(e),this.on(t,y(this,t,e)),this},u.prototype.prependOnceListener=function(t,e){return l(e),this.prependListener(t,y(this,t,e)),this},u.prototype.removeListener=function(t,e){var r,n,o,i,s;if(l(e),void 0===(n=this._events))return this;if(void 0===(r=n[t]))return this;if(r===e||r.listener===e)0==--this._eventsCount?this._events=Object.create(null):(delete n[t],n.removeListener&&this.emit("removeListener",t,r.listener||e));else if("function"!=typeof r){for(o=-1,i=r.length-1;i>=0;i--)if(r[i]===e||r[i].listener===e){s=r[i].listener,o=i;break}if(o<0)return this;0===o?r.shift():function(t,e){for(;e+1<t.length;e++)t[e]=t[e+1];t.pop()}(r,o),1===r.length&&(n[t]=r[0]),void 0!==n.removeListener&&this.emit("removeListener",t,s||e)}return this},u.prototype.off=u.prototype.removeListener,u.prototype.removeAllListeners=function(t){var e,r,n;if(void 0===(r=this._events))return this;if(void 0===r.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==r[t]&&(0==--this._eventsCount?this._events=Object.create(null):delete r[t]),this;if(0===arguments.length){var o,i=Object.keys(r);for(n=0;n<i.length;++n)"removeListener"!==(o=i[n])&&this.removeAllListeners(o);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(e=r[t]))this.removeListener(t,e);else if(void 0!==e)for(n=e.length-1;n>=0;n--)this.removeListener(t,e[n]);return this},u.prototype.listeners=function(t){return d(this,t,!0)},u.prototype.rawListeners=function(t){return d(this,t,!1)},u.listenerCount=function(t,e){return"function"==typeof t.listenerCount?t.listenerCount(e):_.call(t,e)},u.prototype.listenerCount=_,u.prototype.eventNames=function(){return this._eventsCount>0?o(this._events):[]}},function(t,e,r){"use strict";t.exports=r(15).get().Decimal128},function(t,e,r){"use strict";(function(e){
/*!
 * Determines if `arg` is an object.
 *
 * @param {Object|Array|String|Function|RegExp|any} arg
 * @api private
 * @return {Boolean}
 */
t.exports=function(t){return!!e.isBuffer(t)||"[object Object]"===Object.prototype.toString.call(t)}}).call(this,r(1).Buffer)},function(t,e,r){"use strict";(function(e){function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o=r(115);
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */function i(t,e){if(t===e)return 0;for(var r=t.length,n=e.length,o=0,i=Math.min(r,n);o<i;++o)if(t[o]!==e[o]){r=t[o],n=e[o];break}return r<n?-1:n<r?1:0}function s(t){return e.Buffer&&"function"==typeof e.Buffer.isBuffer?e.Buffer.isBuffer(t):!(null==t||!t._isBuffer)}var a=r(4),u=Object.prototype.hasOwnProperty,c=Array.prototype.slice,l="foo"===function(){}.name;function f(t){return Object.prototype.toString.call(t)}function p(t){return!s(t)&&("function"==typeof e.ArrayBuffer&&("function"==typeof ArrayBuffer.isView?ArrayBuffer.isView(t):!!t&&(t instanceof DataView||!!(t.buffer&&t.buffer instanceof ArrayBuffer))))}var h=t.exports=g,y=/\s*function\s+([^\(\s]*)\s*/;function d(t){if(a.isFunction(t)){if(l)return t.name;var e=t.toString().match(y);return e&&e[1]}}function _(t,e){return"string"==typeof t?t.length<e?t:t.slice(0,e):t}function m(t){if(l||!a.isFunction(t))return a.inspect(t);var e=d(t);return"[Function"+(e?": "+e:"")+"]"}function v(t,e,r,n,o){throw new h.AssertionError({message:r,actual:t,expected:e,operator:n,stackStartFunction:o})}function g(t,e){t||v(t,!0,e,"==",h.ok)}function b(t,e,r,o){if(t===e)return!0;if(s(t)&&s(e))return 0===i(t,e);if(a.isDate(t)&&a.isDate(e))return t.getTime()===e.getTime();if(a.isRegExp(t)&&a.isRegExp(e))return t.source===e.source&&t.global===e.global&&t.multiline===e.multiline&&t.lastIndex===e.lastIndex&&t.ignoreCase===e.ignoreCase;if(null!==t&&"object"===n(t)||null!==e&&"object"===n(e)){if(p(t)&&p(e)&&f(t)===f(e)&&!(t instanceof Float32Array||t instanceof Float64Array))return 0===i(new Uint8Array(t.buffer),new Uint8Array(e.buffer));if(s(t)!==s(e))return!1;var u=(o=o||{actual:[],expected:[]}).actual.indexOf(t);return-1!==u&&u===o.expected.indexOf(e)||(o.actual.push(t),o.expected.push(e),function(t,e,r,n){if(null==t||null==e)return!1;if(a.isPrimitive(t)||a.isPrimitive(e))return t===e;if(r&&Object.getPrototypeOf(t)!==Object.getPrototypeOf(e))return!1;var o=w(t),i=w(e);if(o&&!i||!o&&i)return!1;if(o)return t=c.call(t),e=c.call(e),b(t,e,r);var s,u,l=A(t),f=A(e);if(l.length!==f.length)return!1;for(l.sort(),f.sort(),u=l.length-1;u>=0;u--)if(l[u]!==f[u])return!1;for(u=l.length-1;u>=0;u--)if(s=l[u],!b(t[s],e[s],r,n))return!1;return!0}(t,e,r,o))}return r?t===e:t==e}function w(t){return"[object Arguments]"==Object.prototype.toString.call(t)}function O(t,e){if(!t||!e)return!1;if("[object RegExp]"==Object.prototype.toString.call(e))return e.test(t);try{if(t instanceof e)return!0}catch(t){}return!Error.isPrototypeOf(e)&&!0===e.call({},t)}function S(t,e,r,n){var o;if("function"!=typeof e)throw new TypeError('"block" argument must be a function');"string"==typeof r&&(n=r,r=null),o=function(t){var e;try{t()}catch(t){e=t}return e}(e),n=(r&&r.name?" ("+r.name+").":".")+(n?" "+n:"."),t&&!o&&v(o,r,"Missing expected exception"+n);var i="string"==typeof n,s=!t&&o&&!r;if((!t&&a.isError(o)&&i&&O(o,r)||s)&&v(o,r,"Got unwanted exception"+n),t&&o&&r&&!O(o,r)||!t&&o)throw o}h.AssertionError=function(t){this.name="AssertionError",this.actual=t.actual,this.expected=t.expected,this.operator=t.operator,t.message?(this.message=t.message,this.generatedMessage=!1):(this.message=function(t){return _(m(t.actual),128)+" "+t.operator+" "+_(m(t.expected),128)}(this),this.generatedMessage=!0);var e=t.stackStartFunction||v;if(Error.captureStackTrace)Error.captureStackTrace(this,e);else{var r=new Error;if(r.stack){var n=r.stack,o=d(e),i=n.indexOf("\n"+o);if(i>=0){var s=n.indexOf("\n",i+1);n=n.substring(s+1)}this.stack=n}}},a.inherits(h.AssertionError,Error),h.fail=v,h.ok=g,h.equal=function(t,e,r){t!=e&&v(t,e,r,"==",h.equal)},h.notEqual=function(t,e,r){t==e&&v(t,e,r,"!=",h.notEqual)},h.deepEqual=function(t,e,r){b(t,e,!1)||v(t,e,r,"deepEqual",h.deepEqual)},h.deepStrictEqual=function(t,e,r){b(t,e,!0)||v(t,e,r,"deepStrictEqual",h.deepStrictEqual)},h.notDeepEqual=function(t,e,r){b(t,e,!1)&&v(t,e,r,"notDeepEqual",h.notDeepEqual)},h.notDeepStrictEqual=function t(e,r,n){b(e,r,!0)&&v(e,r,n,"notDeepStrictEqual",t)},h.strictEqual=function(t,e,r){t!==e&&v(t,e,r,"===",h.strictEqual)},h.notStrictEqual=function(t,e,r){t===e&&v(t,e,r,"!==",h.notStrictEqual)},h.throws=function(t,e,r){S(!0,t,e,r)},h.doesNotThrow=function(t,e,r){S(!1,t,e,r)},h.ifError=function(t){if(t)throw t},h.strict=o((function t(e,r){e||v(e,!0,r,"==",t)}),h,{equal:h.strictEqual,deepEqual:h.deepStrictEqual,notEqual:h.notStrictEqual,notDeepEqual:h.notDeepStrictEqual}),h.strict.strict=h.strict;var A=Object.keys||function(t){var e=[];for(var r in t)u.call(t,r)&&e.push(r);return e}}).call(this,r(11))},function(t,e){function r(t,e){if(!(this instanceof r))return new r(t,e);this._bsontype="Long",this.low_=0|t,this.high_=0|e}r.prototype.toInt=function(){return this.low_},r.prototype.toNumber=function(){return this.high_*r.TWO_PWR_32_DBL_+this.getLowBitsUnsigned()},r.prototype.toJSON=function(){return this.toString()},r.prototype.toString=function(t){var e=t||10;if(e<2||36<e)throw Error("radix out of range: "+e);if(this.isZero())return"0";if(this.isNegative()){if(this.equals(r.MIN_VALUE)){var n=r.fromNumber(e),o=this.div(n),i=o.multiply(n).subtract(this);return o.toString(e)+i.toInt().toString(e)}return"-"+this.negate().toString(e)}var s=r.fromNumber(Math.pow(e,6));i=this;for(var a="";!i.isZero();){var u=i.div(s),c=i.subtract(u.multiply(s)).toInt().toString(e);if((i=u).isZero())return c+a;for(;c.length<6;)c="0"+c;a=""+c+a}},r.prototype.getHighBits=function(){return this.high_},r.prototype.getLowBits=function(){return this.low_},r.prototype.getLowBitsUnsigned=function(){return this.low_>=0?this.low_:r.TWO_PWR_32_DBL_+this.low_},r.prototype.getNumBitsAbs=function(){if(this.isNegative())return this.equals(r.MIN_VALUE)?64:this.negate().getNumBitsAbs();for(var t=0!==this.high_?this.high_:this.low_,e=31;e>0&&0==(t&1<<e);e--);return 0!==this.high_?e+33:e+1},r.prototype.isZero=function(){return 0===this.high_&&0===this.low_},r.prototype.isNegative=function(){return this.high_<0},r.prototype.isOdd=function(){return 1==(1&this.low_)},r.prototype.equals=function(t){return this.high_===t.high_&&this.low_===t.low_},r.prototype.notEquals=function(t){return this.high_!==t.high_||this.low_!==t.low_},r.prototype.lessThan=function(t){return this.compare(t)<0},r.prototype.lessThanOrEqual=function(t){return this.compare(t)<=0},r.prototype.greaterThan=function(t){return this.compare(t)>0},r.prototype.greaterThanOrEqual=function(t){return this.compare(t)>=0},r.prototype.compare=function(t){if(this.equals(t))return 0;var e=this.isNegative(),r=t.isNegative();return e&&!r?-1:!e&&r?1:this.subtract(t).isNegative()?-1:1},r.prototype.negate=function(){return this.equals(r.MIN_VALUE)?r.MIN_VALUE:this.not().add(r.ONE)},r.prototype.add=function(t){var e=this.high_>>>16,n=65535&this.high_,o=this.low_>>>16,i=65535&this.low_,s=t.high_>>>16,a=65535&t.high_,u=t.low_>>>16,c=0,l=0,f=0,p=0;return f+=(p+=i+(65535&t.low_))>>>16,p&=65535,l+=(f+=o+u)>>>16,f&=65535,c+=(l+=n+a)>>>16,l&=65535,c+=e+s,c&=65535,r.fromBits(f<<16|p,c<<16|l)},r.prototype.subtract=function(t){return this.add(t.negate())},r.prototype.multiply=function(t){if(this.isZero())return r.ZERO;if(t.isZero())return r.ZERO;if(this.equals(r.MIN_VALUE))return t.isOdd()?r.MIN_VALUE:r.ZERO;if(t.equals(r.MIN_VALUE))return this.isOdd()?r.MIN_VALUE:r.ZERO;if(this.isNegative())return t.isNegative()?this.negate().multiply(t.negate()):this.negate().multiply(t).negate();if(t.isNegative())return this.multiply(t.negate()).negate();if(this.lessThan(r.TWO_PWR_24_)&&t.lessThan(r.TWO_PWR_24_))return r.fromNumber(this.toNumber()*t.toNumber());var e=this.high_>>>16,n=65535&this.high_,o=this.low_>>>16,i=65535&this.low_,s=t.high_>>>16,a=65535&t.high_,u=t.low_>>>16,c=65535&t.low_,l=0,f=0,p=0,h=0;return p+=(h+=i*c)>>>16,h&=65535,f+=(p+=o*c)>>>16,p&=65535,f+=(p+=i*u)>>>16,p&=65535,l+=(f+=n*c)>>>16,f&=65535,l+=(f+=o*u)>>>16,f&=65535,l+=(f+=i*a)>>>16,f&=65535,l+=e*c+n*u+o*a+i*s,l&=65535,r.fromBits(p<<16|h,l<<16|f)},r.prototype.div=function(t){if(t.isZero())throw Error("division by zero");if(this.isZero())return r.ZERO;if(this.equals(r.MIN_VALUE)){if(t.equals(r.ONE)||t.equals(r.NEG_ONE))return r.MIN_VALUE;if(t.equals(r.MIN_VALUE))return r.ONE;var e=this.shiftRight(1).div(t).shiftLeft(1);if(e.equals(r.ZERO))return t.isNegative()?r.ONE:r.NEG_ONE;var n=this.subtract(t.multiply(e));return e.add(n.div(t))}if(t.equals(r.MIN_VALUE))return r.ZERO;if(this.isNegative())return t.isNegative()?this.negate().div(t.negate()):this.negate().div(t).negate();if(t.isNegative())return this.div(t.negate()).negate();var o=r.ZERO;for(n=this;n.greaterThanOrEqual(t);){e=Math.max(1,Math.floor(n.toNumber()/t.toNumber()));for(var i=Math.ceil(Math.log(e)/Math.LN2),s=i<=48?1:Math.pow(2,i-48),a=r.fromNumber(e),u=a.multiply(t);u.isNegative()||u.greaterThan(n);)e-=s,u=(a=r.fromNumber(e)).multiply(t);a.isZero()&&(a=r.ONE),o=o.add(a),n=n.subtract(u)}return o},r.prototype.modulo=function(t){return this.subtract(this.div(t).multiply(t))},r.prototype.not=function(){return r.fromBits(~this.low_,~this.high_)},r.prototype.and=function(t){return r.fromBits(this.low_&t.low_,this.high_&t.high_)},r.prototype.or=function(t){return r.fromBits(this.low_|t.low_,this.high_|t.high_)},r.prototype.xor=function(t){return r.fromBits(this.low_^t.low_,this.high_^t.high_)},r.prototype.shiftLeft=function(t){if(0===(t&=63))return this;var e=this.low_;if(t<32){var n=this.high_;return r.fromBits(e<<t,n<<t|e>>>32-t)}return r.fromBits(0,e<<t-32)},r.prototype.shiftRight=function(t){if(0===(t&=63))return this;var e=this.high_;if(t<32){var n=this.low_;return r.fromBits(n>>>t|e<<32-t,e>>t)}return r.fromBits(e>>t-32,e>=0?0:-1)},r.prototype.shiftRightUnsigned=function(t){if(0===(t&=63))return this;var e=this.high_;if(t<32){var n=this.low_;return r.fromBits(n>>>t|e<<32-t,e>>>t)}return 32===t?r.fromBits(e,0):r.fromBits(e>>>t-32,0)},r.fromInt=function(t){if(-128<=t&&t<128){var e=r.INT_CACHE_[t];if(e)return e}var n=new r(0|t,t<0?-1:0);return-128<=t&&t<128&&(r.INT_CACHE_[t]=n),n},r.fromNumber=function(t){return isNaN(t)||!isFinite(t)?r.ZERO:t<=-r.TWO_PWR_63_DBL_?r.MIN_VALUE:t+1>=r.TWO_PWR_63_DBL_?r.MAX_VALUE:t<0?r.fromNumber(-t).negate():new r(t%r.TWO_PWR_32_DBL_|0,t/r.TWO_PWR_32_DBL_|0)},r.fromBits=function(t,e){return new r(t,e)},r.fromString=function(t,e){if(0===t.length)throw Error("number format error: empty string");var n=e||10;if(n<2||36<n)throw Error("radix out of range: "+n);if("-"===t.charAt(0))return r.fromString(t.substring(1),n).negate();if(t.indexOf("-")>=0)throw Error('number format error: interior "-" character: '+t);for(var o=r.fromNumber(Math.pow(n,8)),i=r.ZERO,s=0;s<t.length;s+=8){var a=Math.min(8,t.length-s),u=parseInt(t.substring(s,s+a),n);if(a<8){var c=r.fromNumber(Math.pow(n,a));i=i.multiply(c).add(r.fromNumber(u))}else i=(i=i.multiply(o)).add(r.fromNumber(u))}return i},r.INT_CACHE_={},r.TWO_PWR_16_DBL_=65536,r.TWO_PWR_24_DBL_=1<<24,r.TWO_PWR_32_DBL_=r.TWO_PWR_16_DBL_*r.TWO_PWR_16_DBL_,r.TWO_PWR_31_DBL_=r.TWO_PWR_32_DBL_/2,r.TWO_PWR_48_DBL_=r.TWO_PWR_32_DBL_*r.TWO_PWR_16_DBL_,r.TWO_PWR_64_DBL_=r.TWO_PWR_32_DBL_*r.TWO_PWR_32_DBL_,r.TWO_PWR_63_DBL_=r.TWO_PWR_64_DBL_/2,r.ZERO=r.fromInt(0),r.ONE=r.fromInt(1),r.NEG_ONE=r.fromInt(-1),r.MAX_VALUE=r.fromBits(-1,2147483647),r.MIN_VALUE=r.fromBits(0,-2147483648),r.TWO_PWR_24_=r.fromInt(1<<24),t.exports=r,t.exports.Long=r},function(t,e,r){"use strict";(function(e){var n=r(67),o=Symbol.for("mongoose:emitted");t.exports=function(t,r,i,s){return"function"==typeof t?r((function(r){if(null==r)t.apply(this,arguments);else{null!=i&&i.listeners("error").length>0&&!r[o]&&(r[o]=!0,i.emit("error",r));try{t(r)}catch(r){return e.nextTick((function(){throw r}))}}})):new(s=s||n.get())((function(t,e){r((function(r,n){return null!=r?(null!=i&&i.listeners("error").length>0&&!r[o]&&(r[o]=!0,i.emit("error",r)),e(r)):arguments.length>2?t(Array.prototype.slice.call(arguments,1)):void t(n)}))}))}}).call(this,r(8))},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */var n=r(7),o=r(51),i=r(21);function s(t,e){if(e&&e.default){var r=e.default;Array.isArray(r)&&0===r.length?e.default=Array:!e.shared&&i(r)&&0===Object.keys(r).length&&(e.default=function(){return{}})}n.call(this,t,e,"Mixed"),this[o.schemaMixedSymbol]=!0}s.schemaName="Mixed",s.defaultOptions={},
/*!
 * Inherits from SchemaType.
 */
s.prototype=Object.create(n.prototype),s.prototype.constructor=s,s.get=n.get,s.set=n.set,s.prototype.cast=function(t){return t},s.prototype.castForQuery=function(t,e){return 2===arguments.length?e:t},
/*!
 * Module exports.
 */
t.exports=s},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */var n=r(61)(),o=r(19).EventEmitter,i=r(31),s=r(50),a=r(17).internalToObjectOptions,u=r(3),c=r(24),l=r(4),f=r(0).documentArrayParent,p=r(0).validatorErrorSymbol;function h(t,e,r,o,i){var s={};null!=e&&e.isMongooseDocumentArray?(this.__parentArray=e,this[f]=e.$parent()):(this.__parentArray=void 0,this[f]=void 0),this.$setIndex(i),this.$isDocumentArrayElement=!0,null!=this[f]&&(s.defaults=this[f].$__.$options.defaults),n.call(this,t,o,r,s);var a=this;this.on("isNew",(function(t){a.isNew=t})),a.on("save",(function(){a.constructor.emit("save",a)}))}
/*!
 * Inherit from Document
 */for(var y in h.prototype=Object.create(n.prototype),h.prototype.constructor=h,o.prototype)h[y]=o.prototype[y];h.prototype.toBSON=function(){return this.toObject(a)},
/*!
 * ignore
 */
h.prototype.$setIndex=function(t){if(this.__index=t,null!=u(this,"$__.validationError",null))for(var e=0,r=Object.keys(this.$__.validationError.errors);e<r.length;e++){var n=r[e];this.invalidate(n,this.$__.validationError.errors[n])}},h.prototype.markModified=function(t){if(this.$__.activePaths.modify(t),this.__parentArray){var e=this.__parentArray.$path()+".0."+t;this.isNew&&this.ownerDocument().isSelected(e)?this.__parentArray._markModified():this.__parentArray._markModified(this,t)}},
/*!
 * ignore
 */
h.prototype.populate=function(){throw new Error('Mongoose does not support calling populate() on nested docs. Instead of `doc.arr[0].populate("path")`, use `doc.populate("arr.0.path")`')},h.prototype.save=function(t,e){var r=this;return"function"==typeof t&&(e=t,t={}),(t=t||{}).suppressWarning||console.warn("mongoose: calling `save()` on a subdoc does **not** save the document to MongoDB, it only runs save middleware. Use `subdoc.save({ suppressWarning: true })` to hide this warning if you're sure this behavior is right for your app."),c(e,(function(t){r.$__save(t)}))},h.prototype.$__save=function(t){var e=this;return s((function(){return t(null,e)}))},
/*!
 * no-op for hooks
 */
h.prototype.$__remove=function(t){return t(null,this)},h.prototype.remove=function(t,e){if("function"!=typeof t||e||(e=t,t=void 0),!this.__parentArray||t&&t.noop)return e&&e(null),this;var r;if(!this.willRemove){if(!(r=this._doc._id))throw new Error("For your own good, Mongoose does not know how to remove an EmbeddedDocument that has no _id");this.__parentArray.pull({_id:r}),this.willRemove=!0,
/*!
 * Registers remove event listeners for triggering
 * on subdocuments.
 *
 * @param {EmbeddedDocument} sub
 * @api private
 */
function(t){var e=t.ownerDocument();function r(){e.removeListener("save",r),e.removeListener("remove",r),t.emit("remove",t),t.constructor.emit("remove",t),e=t=null}e.on("save",r),e.on("remove",r)}(this)}return e&&e(null),this},h.prototype.update=function(){throw new Error("The #update method is not available on EmbeddedDocuments")},h.prototype.inspect=function(){return this.toObject({transform:!1,virtuals:!1,flattenDecimals:!1})},l.inspect.custom&&(
/*!
  * Avoid Node deprecation warning DEP0079
  */
h.prototype[l.inspect.custom]=h.prototype.inspect),h.prototype.invalidate=function(t,e,r){if(n.prototype.invalidate.call(this,t,e,r),!this[f]||null==this.__index){if(e[p]||e instanceof i)return this.ownerDocument().$__.validationError;throw e}var o=this.__index,s=[this.__parentArray.$path(),o,t].join(".");return this[f].invalidate(s,e,r),this.ownerDocument().$__.validationError},h.prototype.$markValid=function(t){if(this[f]){var e=this.__index;if(void 0!==e){var r=[this.__parentArray.$path(),e,t].join(".");this[f].$markValid(r)}}},
/*!
 * ignore
 */
h.prototype.$ignore=function(t){if(n.prototype.$ignore.call(this,t),this[f]){var e=this.__index;if(void 0!==e){var r=[this.__parentArray.$path(),e,t].join(".");this[f].$ignore(r)}}},h.prototype.$isValid=function(t){return void 0===this.__index||!this[f]||(!this[f].$__.validationError||!this[f].$__.validationError.errors[this.$__fullPath(t)])},h.prototype.ownerDocument=function(){if(this.$__.ownerDocument)return this.$__.ownerDocument;var t=this[f];if(!t)return this;for(;t[f]||t.$__parent;)t=t[f]||t.$__parent;return this.$__.ownerDocument=t,this.$__.ownerDocument},h.prototype.$__fullPath=function(t){if(!this.$__.fullPath){var e=this;if(!e[f])return t;for(var r=[];e[f]||e.$__parent;)e[f]?r.unshift(e.__parentArray.$path()):r.unshift(e.$basePath),e=e[f]||e.$__parent;this.$__.fullPath=r.join("."),this.$__.ownerDocument||(this.$__.ownerDocument=e)}return t?this.$__.fullPath+"."+t:this.$__.fullPath},h.prototype.parent=function(){return this[f]},h.prototype.$parent=h.prototype.parent,h.prototype.parentArray=function(){return this.__parentArray},
/*!
 * Module exports.
 */
t.exports=h},function(t,e,r){(function(e){if(void 0!==e)var n=r(1).Buffer;var o=r(16);function i(t,e){if(!(this instanceof i))return new i(t,e);if(!(null==t||"string"==typeof t||n.isBuffer(t)||t instanceof Uint8Array||Array.isArray(t)))throw new Error("only String, Buffer, Uint8Array or Array accepted");if(this._bsontype="Binary",t instanceof Number?(this.sub_type=t,this.position=0):(this.sub_type=null==e?s:e,this.position=0),null==t||t instanceof Number)void 0!==n?this.buffer=o.allocBuffer(i.BUFFER_SIZE):"undefined"!=typeof Uint8Array?this.buffer=new Uint8Array(new ArrayBuffer(i.BUFFER_SIZE)):this.buffer=new Array(i.BUFFER_SIZE),this.position=0;else{if("string"==typeof t)if(void 0!==n)this.buffer=o.toBuffer(t);else{if("undefined"==typeof Uint8Array&&"[object Array]"!==Object.prototype.toString.call(t))throw new Error("only String, Buffer, Uint8Array or Array accepted");this.buffer=a(t)}else this.buffer=t;this.position=t.length}}i.prototype.put=function(t){if(null!=t.length&&"number"!=typeof t&&1!==t.length)throw new Error("only accepts single character String, Uint8Array or Array");if("number"!=typeof t&&t<0||t>255)throw new Error("only accepts number in a valid unsigned byte range 0-255");var e=null;if(e="string"==typeof t?t.charCodeAt(0):null!=t.length?t[0]:t,this.buffer.length>this.position)this.buffer[this.position++]=e;else if(void 0!==n&&n.isBuffer(this.buffer)){var r=o.allocBuffer(i.BUFFER_SIZE+this.buffer.length);this.buffer.copy(r,0,0,this.buffer.length),this.buffer=r,this.buffer[this.position++]=e}else{r=null,r="[object Uint8Array]"===Object.prototype.toString.call(this.buffer)?new Uint8Array(new ArrayBuffer(i.BUFFER_SIZE+this.buffer.length)):new Array(i.BUFFER_SIZE+this.buffer.length);for(var s=0;s<this.buffer.length;s++)r[s]=this.buffer[s];this.buffer=r,this.buffer[this.position++]=e}},i.prototype.write=function(t,e){if(e="number"==typeof e?e:this.position,this.buffer.length<e+t.length){var r=null;if(void 0!==n&&n.isBuffer(this.buffer))r=o.allocBuffer(this.buffer.length+t.length),this.buffer.copy(r,0,0,this.buffer.length);else if("[object Uint8Array]"===Object.prototype.toString.call(this.buffer)){r=new Uint8Array(new ArrayBuffer(this.buffer.length+t.length));for(var i=0;i<this.position;i++)r[i]=this.buffer[i]}this.buffer=r}if(void 0!==n&&n.isBuffer(t)&&n.isBuffer(this.buffer))t.copy(this.buffer,e,0,t.length),this.position=e+t.length>this.position?e+t.length:this.position;else if(void 0!==n&&"string"==typeof t&&n.isBuffer(this.buffer))this.buffer.write(t,e,"binary"),this.position=e+t.length>this.position?e+t.length:this.position;else if("[object Uint8Array]"===Object.prototype.toString.call(t)||"[object Array]"===Object.prototype.toString.call(t)&&"string"!=typeof t){for(i=0;i<t.length;i++)this.buffer[e++]=t[i];this.position=e>this.position?e:this.position}else if("string"==typeof t){for(i=0;i<t.length;i++)this.buffer[e++]=t.charCodeAt(i);this.position=e>this.position?e:this.position}},i.prototype.read=function(t,e){if(e=e&&e>0?e:this.position,this.buffer.slice)return this.buffer.slice(t,t+e);for(var r="undefined"!=typeof Uint8Array?new Uint8Array(new ArrayBuffer(e)):new Array(e),n=0;n<e;n++)r[n]=this.buffer[t++];return r},i.prototype.value=function(t){if((t=null!=t&&t)&&void 0!==n&&n.isBuffer(this.buffer)&&this.buffer.length===this.position)return this.buffer;if(void 0!==n&&n.isBuffer(this.buffer))return t?this.buffer.slice(0,this.position):this.buffer.toString("binary",0,this.position);if(t){if(null!=this.buffer.slice)return this.buffer.slice(0,this.position);for(var e="[object Uint8Array]"===Object.prototype.toString.call(this.buffer)?new Uint8Array(new ArrayBuffer(this.position)):new Array(this.position),r=0;r<this.position;r++)e[r]=this.buffer[r];return e}return u(this.buffer,0,this.position)},i.prototype.length=function(){return this.position},i.prototype.toJSON=function(){return null!=this.buffer?this.buffer.toString("base64"):""},i.prototype.toString=function(t){return null!=this.buffer?this.buffer.slice(0,this.position).toString(t):""};var s=0,a=function(t){for(var e="undefined"!=typeof Uint8Array?new Uint8Array(new ArrayBuffer(t.length)):new Array(t.length),r=0;r<t.length;r++)e[r]=t.charCodeAt(r);return e},u=function(t,e,r){for(var n="",o=e;o<r;o++)n+=String.fromCharCode(t[o]);return n};i.BUFFER_SIZE=256,i.SUBTYPE_DEFAULT=0,i.SUBTYPE_FUNCTION=1,i.SUBTYPE_BYTE_ARRAY=2,i.SUBTYPE_UUID_OLD=3,i.SUBTYPE_UUID=4,i.SUBTYPE_MD5=5,i.SUBTYPE_USER_DEFINED=128,t.exports=i,t.exports.Binary=i}).call(this,r(11))},function(t,e,r){"use strict";function n(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return o(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return o(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,i=function(){};return{s:i,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,a=!0,u=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return a=t.done,t},e:function(t){u=!0,s=t},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw s}}}}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}var i=r(64),s=r(20),a=r(13),u=r(47),c=r(29),l=r(65),f=r(66),p=r(21),h=r(0),y=r(2);
/*!
 * Object clone with Mongoose natives support.
 *
 * If options.minimize is true, creates a minimal data object. Empty objects and undefined values will not be cloned. This makes the data payload sent to MongoDB as small as possible.
 *
 * Functions are never cloned.
 *
 * @param {Object} obj the object to clone
 * @param {Object} options
 * @param {Boolean} isArrayChild true if cloning immediately underneath an array. Special case for minimize.
 * @return {Object} the cloned object
 * @api private
 */
function d(t,e,r){if(null==t)return t;if(Array.isArray(t))return function(t,e){var r,o=[],i=n(t);try{for(i.s();!(r=i.n()).done;){var s=r.value;o.push(d(s,e,!0))}}catch(t){i.e(t)}finally{i.f()}return o}(t,e);if(c(t))return e&&e._skipSingleNestedGetters&&t.$isSingleNested&&(e=Object.assign({},e,{getters:!1})),y.isPOJO(t)&&null!=t.$__&&null!=t._doc?t._doc:e&&e.json&&"function"==typeof t.toJSON?t.toJSON(e):t.toObject(e);if(t.constructor)switch(l(t.constructor)){case"Object":return _(t,e,r);case"Date":return new t.constructor(+t);case"RegExp":return i(t)}return t instanceof a?new a(t.id):f(t,"Decimal128")?e&&e.flattenDecimals?t.toJSON():s.fromString(t.toString()):!t.constructor&&p(t)?_(t,e,r):t[h.schemaTypeSymbol]?t.clone():e&&e.bson&&"function"==typeof t.toBSON?t:null!=t.valueOf?t.valueOf():_(t,e,r)}
/*!
 * ignore
 */
function _(t,e,r){var n,o=e&&e.minimize,i={};for(var s in t)if(!u.has(s)){var a=d(t[s],e);o&&void 0===a||(!1===o&&void 0===a?delete i[s]:(n||(n=!0),i[s]=a))}return o&&!r?n&&i:i}t.exports=d},function(t,e,r){"use strict";
/*!
 * Returns if `v` is a mongoose object that has a `toObject()` method we can use.
 *
 * This is for compatibility with libs like Date.js which do foolish things to Natives.
 *
 * @param {any} v
 * @api private
 */t.exports=function(t){return null!=t&&(null!=t.$__||t.isMongooseArray||t.isMongooseBuffer||t.$isMongooseMap)}},function(t,e,r){"use strict";var n=["find","findOne","update","updateMany","updateOne","replaceOne","remove","count","distinct","findAndModify","aggregate","findStream","deleteOne","deleteMany"];function o(){}for(var i=0,s=n.length;i<s;++i){var a=n[i];o.prototype[a]=u(a)}function u(t){return function(){throw new Error("collection."+t+" not implemented")}}t.exports=o,o.methods=n},function(t,e,r){"use strict";
/*!
 * Module requirements
 */function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function s(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=u(t);if(e){var o=u(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return a(this,r)}}function a(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function u(t){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var c=r(14),l=r(4),f=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}(u,t);var e,r,n,a=s(u);function u(t){var e,r;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,u),r=t&&"model"===t.constructor.name?t.constructor.modelName+" validation failed":"Validation failed",(e=a.call(this,r)).errors={},e._message=r,t&&(t.errors=e.errors),e}return e=u,(r=[{key:"toString",value:function(){return this.name+": "+p(this)}
/*!
     * inspect helper
     */},{key:"inspect",value:function(){return Object.assign(new Error(this.message),this)}
/*!
    * add message
    */},{key:"addError",value:function(t,e){this.errors[t]=e,this.message=this._message+": "+p(this)}}])&&o(e.prototype,r),n&&o(e,n),u}(c);
/*!
 * ignore
 */
function p(t){for(var e,r=Object.keys(t.errors||{}),n=r.length,o=[],i=0;i<n;++i)e=r[i],t!==t.errors[e]&&o.push(e+": "+t.errors[e].message);return o.join(", ")}
/*!
 * Module exports
 */l.inspect.custom&&(
/*!
  * Avoid Node deprecation warning DEP0079
  */
f.prototype[l.inspect.custom]=f.prototype.inspect)
/*!
 * Helper for JSON.stringify
 */,Object.defineProperty(f.prototype,"toJSON",{enumerable:!1,writable:!1,configurable:!0,value:function(){return Object.assign({},this,{message:this.message})}}),Object.defineProperty(f.prototype,"name",{value:"ValidationError"}),t.exports=f},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){return(o=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function i(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=a(t);if(e){var o=a(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return s(this,r)}}function s(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var u=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&o(t,e)}(r,t);var e=i(r);function r(t,n,o){var i;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,r),n=n||"Field `"+t+"` is not in schema and strict mode is set to throw.",(i=e.call(this,n)).isImmutableError=!!o,i.path=t,i}return r}(r(5));Object.defineProperty(u.prototype,"name",{value:"StrictModeError"}),t.exports=u},function(t,e,r){"use strict";
/*!
 * Module requirements.
 */var n=r(78);
/*!
 * @ignore
 */
/*!
 * @ignore
 */
function o(t){return n.cast()(t)}e.castToNumber=o,e.castArraysOfNumbers=function t(e,r){e.forEach((function(n,i){Array.isArray(n)?t(n,r):e[i]=o.call(r,n)}))}},function(t,e,r){"use strict";
/*!
* returns discriminator by discriminatorMapping.value
*
* @param {Model} model
* @param {string} value
*/t.exports=function(t,e){var r=null;if(!t.discriminators)return r;for(var n in t.discriminators){var o=t.discriminators[n];if(o.schema&&o.schema.discriminatorMapping&&o.schema.discriminatorMapping.value==e){r=o;break}}return r}},function(t,e,r){"use strict";var n=r(59),o=r(23),i=r(36),s=r(37),a=r(38),u=r(39),c=r(40),l=r(60),f=r(41),p=r(42),h=r(43),y=r(44),d=r(45),_=r(27),m=r(102),v=r(103),g=r(105),b=r(16),w=b.allocBuffer(17825792),O=function(){};O.prototype.serialize=function(t,e){var r="boolean"==typeof(e=e||{}).checkKeys&&e.checkKeys,n="boolean"==typeof e.serializeFunctions&&e.serializeFunctions,o="boolean"!=typeof e.ignoreUndefined||e.ignoreUndefined,i="number"==typeof e.minInternalBufferSize?e.minInternalBufferSize:17825792;w.length<i&&(w=b.allocBuffer(i));var s=v(w,t,r,0,0,n,o,[]),a=b.allocBuffer(s);return w.copy(a,0,0,a.length),a},O.prototype.serializeWithBufferAndIndex=function(t,e,r){var n="boolean"==typeof(r=r||{}).checkKeys&&r.checkKeys,o="boolean"==typeof r.serializeFunctions&&r.serializeFunctions,i="boolean"!=typeof r.ignoreUndefined||r.ignoreUndefined,s="number"==typeof r.index?r.index:0;return v(e,t,n,s||0,0,o,i)-1},O.prototype.deserialize=function(t,e){return m(t,e)},O.prototype.calculateObjectSize=function(t,e){var r="boolean"==typeof(e=e||{}).serializeFunctions&&e.serializeFunctions,n="boolean"!=typeof e.ignoreUndefined||e.ignoreUndefined;return g(t,r,n)},O.prototype.deserializeStream=function(t,e,r,n,o,i){i=null!=i?i:{};for(var s=e,a=0;a<r;a++){var u=t[s]|t[s+1]<<8|t[s+2]<<16|t[s+3]<<24;i.index=s,n[o+a]=this.deserialize(t,i),s+=u}return s},O.BSON_INT32_MAX=2147483647,O.BSON_INT32_MIN=-2147483648,O.BSON_INT64_MAX=Math.pow(2,63)-1,O.BSON_INT64_MIN=-Math.pow(2,63),O.JS_INT_MAX=9007199254740992,O.JS_INT_MIN=-9007199254740992,O.BSON_DATA_NUMBER=1,O.BSON_DATA_STRING=2,O.BSON_DATA_OBJECT=3,O.BSON_DATA_ARRAY=4,O.BSON_DATA_BINARY=5,O.BSON_DATA_OID=7,O.BSON_DATA_BOOLEAN=8,O.BSON_DATA_DATE=9,O.BSON_DATA_NULL=10,O.BSON_DATA_REGEXP=11,O.BSON_DATA_CODE=13,O.BSON_DATA_SYMBOL=14,O.BSON_DATA_CODE_W_SCOPE=15,O.BSON_DATA_INT=16,O.BSON_DATA_TIMESTAMP=17,O.BSON_DATA_LONG=18,O.BSON_DATA_MIN_KEY=255,O.BSON_DATA_MAX_KEY=127,O.BSON_BINARY_SUBTYPE_DEFAULT=0,O.BSON_BINARY_SUBTYPE_FUNCTION=1,O.BSON_BINARY_SUBTYPE_BYTE_ARRAY=2,O.BSON_BINARY_SUBTYPE_UUID=3,O.BSON_BINARY_SUBTYPE_MD5=4,O.BSON_BINARY_SUBTYPE_USER_DEFINED=128,t.exports=O,t.exports.Code=f,t.exports.Map=n,t.exports.Symbol=c,t.exports.BSON=O,t.exports.DBRef=d,t.exports.Binary=_,t.exports.ObjectID=a,t.exports.Long=o,t.exports.Timestamp=s,t.exports.Double=i,t.exports.Int32=l,t.exports.MinKey=h,t.exports.MaxKey=y,t.exports.BSONRegExp=u,t.exports.Decimal128=p},function(t,e){function r(t){if(!(this instanceof r))return new r(t);this._bsontype="Double",this.value=t}r.prototype.valueOf=function(){return this.value},r.prototype.toJSON=function(){return this.value},t.exports=r,t.exports.Double=r},function(t,e){function r(t,e){if(!(this instanceof r))return new r(t,e);this._bsontype="Timestamp",this.low_=0|t,this.high_=0|e}r.prototype.toInt=function(){return this.low_},r.prototype.toNumber=function(){return this.high_*r.TWO_PWR_32_DBL_+this.getLowBitsUnsigned()},r.prototype.toJSON=function(){return this.toString()},r.prototype.toString=function(t){var e=t||10;if(e<2||36<e)throw Error("radix out of range: "+e);if(this.isZero())return"0";if(this.isNegative()){if(this.equals(r.MIN_VALUE)){var n=r.fromNumber(e),o=this.div(n),i=o.multiply(n).subtract(this);return o.toString(e)+i.toInt().toString(e)}return"-"+this.negate().toString(e)}var s=r.fromNumber(Math.pow(e,6));i=this;for(var a="";!i.isZero();){var u=i.div(s),c=i.subtract(u.multiply(s)).toInt().toString(e);if((i=u).isZero())return c+a;for(;c.length<6;)c="0"+c;a=""+c+a}},r.prototype.getHighBits=function(){return this.high_},r.prototype.getLowBits=function(){return this.low_},r.prototype.getLowBitsUnsigned=function(){return this.low_>=0?this.low_:r.TWO_PWR_32_DBL_+this.low_},r.prototype.getNumBitsAbs=function(){if(this.isNegative())return this.equals(r.MIN_VALUE)?64:this.negate().getNumBitsAbs();for(var t=0!==this.high_?this.high_:this.low_,e=31;e>0&&0==(t&1<<e);e--);return 0!==this.high_?e+33:e+1},r.prototype.isZero=function(){return 0===this.high_&&0===this.low_},r.prototype.isNegative=function(){return this.high_<0},r.prototype.isOdd=function(){return 1==(1&this.low_)},r.prototype.equals=function(t){return this.high_===t.high_&&this.low_===t.low_},r.prototype.notEquals=function(t){return this.high_!==t.high_||this.low_!==t.low_},r.prototype.lessThan=function(t){return this.compare(t)<0},r.prototype.lessThanOrEqual=function(t){return this.compare(t)<=0},r.prototype.greaterThan=function(t){return this.compare(t)>0},r.prototype.greaterThanOrEqual=function(t){return this.compare(t)>=0},r.prototype.compare=function(t){if(this.equals(t))return 0;var e=this.isNegative(),r=t.isNegative();return e&&!r?-1:!e&&r?1:this.subtract(t).isNegative()?-1:1},r.prototype.negate=function(){return this.equals(r.MIN_VALUE)?r.MIN_VALUE:this.not().add(r.ONE)},r.prototype.add=function(t){var e=this.high_>>>16,n=65535&this.high_,o=this.low_>>>16,i=65535&this.low_,s=t.high_>>>16,a=65535&t.high_,u=t.low_>>>16,c=0,l=0,f=0,p=0;return f+=(p+=i+(65535&t.low_))>>>16,p&=65535,l+=(f+=o+u)>>>16,f&=65535,c+=(l+=n+a)>>>16,l&=65535,c+=e+s,c&=65535,r.fromBits(f<<16|p,c<<16|l)},r.prototype.subtract=function(t){return this.add(t.negate())},r.prototype.multiply=function(t){if(this.isZero())return r.ZERO;if(t.isZero())return r.ZERO;if(this.equals(r.MIN_VALUE))return t.isOdd()?r.MIN_VALUE:r.ZERO;if(t.equals(r.MIN_VALUE))return this.isOdd()?r.MIN_VALUE:r.ZERO;if(this.isNegative())return t.isNegative()?this.negate().multiply(t.negate()):this.negate().multiply(t).negate();if(t.isNegative())return this.multiply(t.negate()).negate();if(this.lessThan(r.TWO_PWR_24_)&&t.lessThan(r.TWO_PWR_24_))return r.fromNumber(this.toNumber()*t.toNumber());var e=this.high_>>>16,n=65535&this.high_,o=this.low_>>>16,i=65535&this.low_,s=t.high_>>>16,a=65535&t.high_,u=t.low_>>>16,c=65535&t.low_,l=0,f=0,p=0,h=0;return p+=(h+=i*c)>>>16,h&=65535,f+=(p+=o*c)>>>16,p&=65535,f+=(p+=i*u)>>>16,p&=65535,l+=(f+=n*c)>>>16,f&=65535,l+=(f+=o*u)>>>16,f&=65535,l+=(f+=i*a)>>>16,f&=65535,l+=e*c+n*u+o*a+i*s,l&=65535,r.fromBits(p<<16|h,l<<16|f)},r.prototype.div=function(t){if(t.isZero())throw Error("division by zero");if(this.isZero())return r.ZERO;if(this.equals(r.MIN_VALUE)){if(t.equals(r.ONE)||t.equals(r.NEG_ONE))return r.MIN_VALUE;if(t.equals(r.MIN_VALUE))return r.ONE;var e=this.shiftRight(1).div(t).shiftLeft(1);if(e.equals(r.ZERO))return t.isNegative()?r.ONE:r.NEG_ONE;var n=this.subtract(t.multiply(e));return e.add(n.div(t))}if(t.equals(r.MIN_VALUE))return r.ZERO;if(this.isNegative())return t.isNegative()?this.negate().div(t.negate()):this.negate().div(t).negate();if(t.isNegative())return this.div(t.negate()).negate();var o=r.ZERO;for(n=this;n.greaterThanOrEqual(t);){e=Math.max(1,Math.floor(n.toNumber()/t.toNumber()));for(var i=Math.ceil(Math.log(e)/Math.LN2),s=i<=48?1:Math.pow(2,i-48),a=r.fromNumber(e),u=a.multiply(t);u.isNegative()||u.greaterThan(n);)e-=s,u=(a=r.fromNumber(e)).multiply(t);a.isZero()&&(a=r.ONE),o=o.add(a),n=n.subtract(u)}return o},r.prototype.modulo=function(t){return this.subtract(this.div(t).multiply(t))},r.prototype.not=function(){return r.fromBits(~this.low_,~this.high_)},r.prototype.and=function(t){return r.fromBits(this.low_&t.low_,this.high_&t.high_)},r.prototype.or=function(t){return r.fromBits(this.low_|t.low_,this.high_|t.high_)},r.prototype.xor=function(t){return r.fromBits(this.low_^t.low_,this.high_^t.high_)},r.prototype.shiftLeft=function(t){if(0===(t&=63))return this;var e=this.low_;if(t<32){var n=this.high_;return r.fromBits(e<<t,n<<t|e>>>32-t)}return r.fromBits(0,e<<t-32)},r.prototype.shiftRight=function(t){if(0===(t&=63))return this;var e=this.high_;if(t<32){var n=this.low_;return r.fromBits(n>>>t|e<<32-t,e>>t)}return r.fromBits(e>>t-32,e>=0?0:-1)},r.prototype.shiftRightUnsigned=function(t){if(0===(t&=63))return this;var e=this.high_;if(t<32){var n=this.low_;return r.fromBits(n>>>t|e<<32-t,e>>>t)}return 32===t?r.fromBits(e,0):r.fromBits(e>>>t-32,0)},r.fromInt=function(t){if(-128<=t&&t<128){var e=r.INT_CACHE_[t];if(e)return e}var n=new r(0|t,t<0?-1:0);return-128<=t&&t<128&&(r.INT_CACHE_[t]=n),n},r.fromNumber=function(t){return isNaN(t)||!isFinite(t)?r.ZERO:t<=-r.TWO_PWR_63_DBL_?r.MIN_VALUE:t+1>=r.TWO_PWR_63_DBL_?r.MAX_VALUE:t<0?r.fromNumber(-t).negate():new r(t%r.TWO_PWR_32_DBL_|0,t/r.TWO_PWR_32_DBL_|0)},r.fromBits=function(t,e){return new r(t,e)},r.fromString=function(t,e){if(0===t.length)throw Error("number format error: empty string");var n=e||10;if(n<2||36<n)throw Error("radix out of range: "+n);if("-"===t.charAt(0))return r.fromString(t.substring(1),n).negate();if(t.indexOf("-")>=0)throw Error('number format error: interior "-" character: '+t);for(var o=r.fromNumber(Math.pow(n,8)),i=r.ZERO,s=0;s<t.length;s+=8){var a=Math.min(8,t.length-s),u=parseInt(t.substring(s,s+a),n);if(a<8){var c=r.fromNumber(Math.pow(n,a));i=i.multiply(c).add(r.fromNumber(u))}else i=(i=i.multiply(o)).add(r.fromNumber(u))}return i},r.INT_CACHE_={},r.TWO_PWR_16_DBL_=65536,r.TWO_PWR_24_DBL_=1<<24,r.TWO_PWR_32_DBL_=r.TWO_PWR_16_DBL_*r.TWO_PWR_16_DBL_,r.TWO_PWR_31_DBL_=r.TWO_PWR_32_DBL_/2,r.TWO_PWR_48_DBL_=r.TWO_PWR_32_DBL_*r.TWO_PWR_16_DBL_,r.TWO_PWR_64_DBL_=r.TWO_PWR_32_DBL_*r.TWO_PWR_32_DBL_,r.TWO_PWR_63_DBL_=r.TWO_PWR_64_DBL_/2,r.ZERO=r.fromInt(0),r.ONE=r.fromInt(1),r.NEG_ONE=r.fromInt(-1),r.MAX_VALUE=r.fromBits(-1,2147483647),r.MIN_VALUE=r.fromBits(0,-2147483648),r.TWO_PWR_24_=r.fromInt(1<<24),t.exports=r,t.exports.Timestamp=r},function(t,e,r){(function(e,n){var o="inspect",i=r(16),s=parseInt(16777215*Math.random(),10),a=new RegExp("^[0-9a-fA-F]{24}$");try{if(e&&e.from){var u=!0;o=r(4).inspect.custom||"inspect"}}catch(t){u=!1}for(var c=function t(e){if(e instanceof t)return e;if(!(this instanceof t))return new t(e);if(this._bsontype="ObjectID",null==e||"number"==typeof e)return this.id=this.generate(e),void(t.cacheHexString&&(this.__id=this.toString("hex")));var r=t.isValid(e);if(!r&&null!=e)throw new Error("Argument passed in must be a single String of 12 bytes or a string of 24 hex characters");if(r&&"string"==typeof e&&24===e.length&&u)return new t(i.toBuffer(e,"hex"));if(r&&"string"==typeof e&&24===e.length)return t.createFromHexString(e);if(null==e||12!==e.length){if(null!=e&&"function"==typeof e.toHexString)return e;throw new Error("Argument passed in must be a single String of 12 bytes or a string of 24 hex characters")}this.id=e,t.cacheHexString&&(this.__id=this.toString("hex"))},l=[],f=0;f<256;f++)l[f]=(f<=15?"0":"")+f.toString(16);c.prototype.toHexString=function(){if(c.cacheHexString&&this.__id)return this.__id;var t="";if(!this.id||!this.id.length)throw new Error("invalid ObjectId, ObjectId.id must be either a string or a Buffer, but is ["+JSON.stringify(this.id)+"]");if(this.id instanceof h)return t=y(this.id),c.cacheHexString&&(this.__id=t),t;for(var e=0;e<this.id.length;e++)t+=l[this.id.charCodeAt(e)];return c.cacheHexString&&(this.__id=t),t},c.prototype.get_inc=function(){return c.index=(c.index+1)%16777215},c.prototype.getInc=function(){return this.get_inc()},c.prototype.generate=function(t){"number"!=typeof t&&(t=~~(Date.now()/1e3));var e=(void 0===n||1===n.pid?Math.floor(1e5*Math.random()):n.pid)%65535,r=this.get_inc(),o=i.allocBuffer(12);return o[3]=255&t,o[2]=t>>8&255,o[1]=t>>16&255,o[0]=t>>24&255,o[6]=255&s,o[5]=s>>8&255,o[4]=s>>16&255,o[8]=255&e,o[7]=e>>8&255,o[11]=255&r,o[10]=r>>8&255,o[9]=r>>16&255,o},c.prototype.toString=function(t){return this.id&&this.id.copy?this.id.toString("string"==typeof t?t:"hex"):this.toHexString()},c.prototype[o]=c.prototype.toString,c.prototype.toJSON=function(){return this.toHexString()},c.prototype.equals=function(t){return t instanceof c?this.toString()===t.toString():"string"==typeof t&&c.isValid(t)&&12===t.length&&this.id instanceof h?t===this.id.toString("binary"):"string"==typeof t&&c.isValid(t)&&24===t.length?t.toLowerCase()===this.toHexString():"string"==typeof t&&c.isValid(t)&&12===t.length?t===this.id:!(null==t||!(t instanceof c||t.toHexString))&&t.toHexString()===this.toHexString()},c.prototype.getTimestamp=function(){var t=new Date,e=this.id[3]|this.id[2]<<8|this.id[1]<<16|this.id[0]<<24;return t.setTime(1e3*Math.floor(e)),t},c.index=~~(16777215*Math.random()),c.createPk=function(){return new c},c.createFromTime=function(t){var e=i.toBuffer([0,0,0,0,0,0,0,0,0,0,0,0]);return e[3]=255&t,e[2]=t>>8&255,e[1]=t>>16&255,e[0]=t>>24&255,new c(e)};var p=[];for(f=0;f<10;)p[48+f]=f++;for(;f<16;)p[55+f]=p[87+f]=f++;var h=e,y=function(t){return t.toString("hex")};c.createFromHexString=function(t){if(void 0===t||null!=t&&24!==t.length)throw new Error("Argument passed in must be a single String of 12 bytes or a string of 24 hex characters");if(u)return new c(i.toBuffer(t,"hex"));for(var e=new h(12),r=0,n=0;n<24;)e[r++]=p[t.charCodeAt(n++)]<<4|p[t.charCodeAt(n++)];return new c(e)},c.isValid=function(t){return null!=t&&("number"==typeof t||("string"==typeof t?12===t.length||24===t.length&&a.test(t):t instanceof c||(t instanceof h||"function"==typeof t.toHexString&&(t.id instanceof h||"string"==typeof t.id)&&(12===t.id.length||24===t.id.length&&a.test(t.id)))))},Object.defineProperty(c.prototype,"generationTime",{enumerable:!0,get:function(){return this.id[3]|this.id[2]<<8|this.id[1]<<16|this.id[0]<<24},set:function(t){this.id[3]=255&t,this.id[2]=t>>8&255,this.id[1]=t>>16&255,this.id[0]=t>>24&255}}),t.exports=c,t.exports.ObjectID=c,t.exports.ObjectId=c}).call(this,r(1).Buffer,r(8))},function(t,e){function r(t,e){if(!(this instanceof r))return new r;this._bsontype="BSONRegExp",this.pattern=t||"",this.options=e||"";for(var n=0;n<this.options.length;n++)if("i"!==this.options[n]&&"m"!==this.options[n]&&"x"!==this.options[n]&&"l"!==this.options[n]&&"s"!==this.options[n]&&"u"!==this.options[n])throw new Error("the regular expression options ["+this.options[n]+"] is not supported")}t.exports=r,t.exports.BSONRegExp=r},function(t,e,r){(function(e){var n=e&&r(4).inspect.custom||"inspect";function o(t){if(!(this instanceof o))return new o(t);this._bsontype="Symbol",this.value=t}o.prototype.valueOf=function(){return this.value},o.prototype.toString=function(){return this.value},o.prototype[n]=function(){return this.value},o.prototype.toJSON=function(){return this.value},t.exports=o,t.exports.Symbol=o}).call(this,r(1).Buffer)},function(t,e){var r=function t(e,r){if(!(this instanceof t))return new t(e,r);this._bsontype="Code",this.code=e,this.scope=r};r.prototype.toJSON=function(){return{scope:this.scope,code:this.code}},t.exports=r,t.exports.Code=r},function(t,e,r){"use strict";var n=r(23),o=/^(\+|-)?(\d+|(\d*\.\d*))?(E|e)?([-+])?(\d+)?$/,i=/^(\+|-)?(Infinity|inf)$/i,s=/^(\+|-)?NaN$/i,a=6176,u=[124,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0].reverse(),c=[248,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0].reverse(),l=[120,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0].reverse(),f=/^([-+])?(\d+)?$/,p=r(16),h=function(t){return!isNaN(parseInt(t,10))},y=function(t){var e=n.fromNumber(1e9),r=n.fromNumber(0),o=0;if(!(t.parts[0]||t.parts[1]||t.parts[2]||t.parts[3]))return{quotient:t,rem:r};for(o=0;o<=3;o++)r=(r=r.shiftLeft(32)).add(new n(t.parts[o],0)),t.parts[o]=r.div(e).low_,r=r.modulo(e);return{quotient:t,rem:r}},d=function(t){this._bsontype="Decimal128",this.bytes=t};d.fromString=function(t){var e,r=!1,y=!1,_=!1,m=0,v=0,g=0,b=0,w=0,O=[0],S=0,A=0,E=0,j=0,$=0,P=0,x=[0,0],N=[0,0],T=0;if((t=t.trim()).length>=7e3)throw new Error(t+" not a valid Decimal128 string");var k=t.match(o),C=t.match(i),R=t.match(s);if(!k&&!C&&!R||0===t.length)throw new Error(t+" not a valid Decimal128 string");if(k&&k[4]&&void 0===k[2])throw new Error(t+" not a valid Decimal128 string");if("+"!==t[T]&&"-"!==t[T]||(r="-"===t[T++]),!h(t[T])&&"."!==t[T]){if("i"===t[T]||"I"===t[T])return new d(p.toBuffer(r?c:l));if("N"===t[T])return new d(p.toBuffer(u))}for(;h(t[T])||"."===t[T];)if("."!==t[T])S<34&&("0"!==t[T]||_)&&(_||(w=v),_=!0,O[A++]=parseInt(t[T],10),S+=1),_&&(g+=1),y&&(b+=1),v+=1,T+=1;else{if(y)return new d(p.toBuffer(u));y=!0,T+=1}if(y&&!v)throw new Error(t+" not a valid Decimal128 string");if("e"===t[T]||"E"===t[T]){var D=t.substr(++T).match(f);if(!D||!D[2])return new d(p.toBuffer(u));$=parseInt(D[0],10),T+=D[0].length}if(t[T])return new d(p.toBuffer(u));if(E=0,S){if(j=S-1,m=g,0!==$&&1!==m)for(;"0"===t[w+m-1];)m-=1}else E=0,j=0,O[0]=0,g=1,S=1,m=0;for($<=b&&b-$>16384?$=-6176:$-=b;$>6111;){if((j+=1)-E>34){var B=O.join("");if(B.match(/^0+$/)){$=6111;break}return new d(p.toBuffer(r?c:l))}$-=1}for(;$<-6176||S<g;){if(0===j){$=-6176,m=0;break}if(S<g?g-=1:j-=1,!($<6111)){if((B=O.join("")).match(/^0+$/)){$=6111;break}return new d(p.toBuffer(r?c:l))}$+=1}if(j-E+1<m&&"0"!==t[m]){var M=v;y&&-6176===$&&(w+=1,M+=1);var I=parseInt(t[w+j+1],10),F=0;if(I>=5&&(F=1,5===I))for(F=O[j]%2==1,P=w+j+2;P<M;P++)if(parseInt(t[P],10)){F=1;break}if(F)for(var L=j;L>=0&&++O[L]>9;L--)if(O[L]=0,0===L){if(!($<6111))return new d(p.toBuffer(r?c:l));$+=1,O[L]=1}}if(x=n.fromNumber(0),N=n.fromNumber(0),0===m)x=n.fromNumber(0),N=n.fromNumber(0);else if(j-E<17)for(L=E,N=n.fromNumber(O[L++]),x=new n(0,0);L<=j;L++)N=(N=N.multiply(n.fromNumber(10))).add(n.fromNumber(O[L]));else{for(L=E,x=n.fromNumber(O[L++]);L<=j-17;L++)x=(x=x.multiply(n.fromNumber(10))).add(n.fromNumber(O[L]));for(N=n.fromNumber(O[L++]);L<=j;L++)N=(N=N.multiply(n.fromNumber(10))).add(n.fromNumber(O[L]))}var U,V,q,W,H=function(t,e){if(!t&&!e)return{high:n.fromNumber(0),low:n.fromNumber(0)};var r=t.shiftRightUnsigned(32),o=new n(t.getLowBits(),0),i=e.shiftRightUnsigned(32),s=new n(e.getLowBits(),0),a=r.multiply(i),u=r.multiply(s),c=o.multiply(i),l=o.multiply(s);return a=a.add(u.shiftRightUnsigned(32)),u=new n(u.getLowBits(),0).add(c).add(l.shiftRightUnsigned(32)),{high:a=a.add(u.shiftRightUnsigned(32)),low:l=u.shiftLeft(32).add(new n(l.getLowBits(),0))}}(x,n.fromString("100000000000000000"));H.low=H.low.add(N),U=H.low,V=N,q=U.high_>>>0,W=V.high_>>>0,(q<W||q===W&&U.low_>>>0<V.low_>>>0)&&(H.high=H.high.add(n.fromNumber(1))),e=$+a;var Y={low:n.fromNumber(0),high:n.fromNumber(0)};H.high.shiftRightUnsigned(49).and(n.fromNumber(1)).equals(n.fromNumber)?(Y.high=Y.high.or(n.fromNumber(3).shiftLeft(61)),Y.high=Y.high.or(n.fromNumber(e).and(n.fromNumber(16383).shiftLeft(47))),Y.high=Y.high.or(H.high.and(n.fromNumber(0x7fffffffffff)))):(Y.high=Y.high.or(n.fromNumber(16383&e).shiftLeft(49)),Y.high=Y.high.or(H.high.and(n.fromNumber(562949953421311)))),Y.low=H.low,r&&(Y.high=Y.high.or(n.fromString("9223372036854775808")));var K=p.allocBuffer(16);return T=0,K[T++]=255&Y.low.low_,K[T++]=Y.low.low_>>8&255,K[T++]=Y.low.low_>>16&255,K[T++]=Y.low.low_>>24&255,K[T++]=255&Y.low.high_,K[T++]=Y.low.high_>>8&255,K[T++]=Y.low.high_>>16&255,K[T++]=Y.low.high_>>24&255,K[T++]=255&Y.high.low_,K[T++]=Y.high.low_>>8&255,K[T++]=Y.high.low_>>16&255,K[T++]=Y.high.low_>>24&255,K[T++]=255&Y.high.high_,K[T++]=Y.high.high_>>8&255,K[T++]=Y.high.high_>>16&255,K[T++]=Y.high.high_>>24&255,new d(K)};a=6176,d.prototype.toString=function(){for(var t,e,r,o,i,s,u=0,c=new Array(36),l=0;l<c.length;l++)c[l]=0;var f,p,h,d,_,m=0,v=!1,g={parts:new Array(4)},b=[];m=0;var w=this.bytes;if(o=w[m++]|w[m++]<<8|w[m++]<<16|w[m++]<<24,r=w[m++]|w[m++]<<8|w[m++]<<16|w[m++]<<24,e=w[m++]|w[m++]<<8|w[m++]<<16|w[m++]<<24,t=w[m++]|w[m++]<<8|w[m++]<<16|w[m++]<<24,m=0,{low:new n(o,r),high:new n(e,t)}.high.lessThan(n.ZERO)&&b.push("-"),(i=t>>26&31)>>3==3){if(30===i)return b.join("")+"Infinity";if(31===i)return"NaN";s=t>>15&16383,h=8+(t>>14&1)}else h=t>>14&7,s=t>>17&16383;if(f=s-a,g.parts[0]=(16383&t)+((15&h)<<14),g.parts[1]=e,g.parts[2]=r,g.parts[3]=o,0===g.parts[0]&&0===g.parts[1]&&0===g.parts[2]&&0===g.parts[3])v=!0;else for(_=3;_>=0;_--){var O=0,S=y(g);if(g=S.quotient,O=S.rem.low_)for(d=8;d>=0;d--)c[9*_+d]=O%10,O=Math.floor(O/10)}if(v)u=1,c[m]=0;else for(u=36,l=0;!c[m];)l++,u-=1,m+=1;if((p=u-1+f)>=34||p<=-7||f>0){for(b.push(c[m++]),(u-=1)&&b.push("."),l=0;l<u;l++)b.push(c[m++]);b.push("E"),p>0?b.push("+"+p):b.push(p)}else if(f>=0)for(l=0;l<u;l++)b.push(c[m++]);else{var A=u+f;if(A>0)for(l=0;l<A;l++)b.push(c[m++]);else b.push("0");for(b.push(".");A++<0;)b.push("0");for(l=0;l<u-Math.max(A-1,0);l++)b.push(c[m++])}return b.join("")},d.prototype.toJSON=function(){return{$numberDecimal:this.toString()}},t.exports=d,t.exports.Decimal128=d},function(t,e){function r(){if(!(this instanceof r))return new r;this._bsontype="MinKey"}t.exports=r,t.exports.MinKey=r},function(t,e){function r(){if(!(this instanceof r))return new r;this._bsontype="MaxKey"}t.exports=r,t.exports.MaxKey=r},function(t,e){function r(t,e,n){if(!(this instanceof r))return new r(t,e,n);this._bsontype="DBRef",this.namespace=t,this.oid=e,this.db=n}r.prototype.toJSON=function(){return{$ref:this.namespace,$id:this.oid,$db:null==this.db?"":this.db}},t.exports=r,t.exports.DBRef=r},function(t,e,r){"use strict";t.exports=r(112)},function(t,e,r){"use strict";t.exports=new Set(["__proto__","constructor","prototype"])},function(t,e,r){"use strict";var n=r(49);
/*!
 * ignore
 */t.exports=function(t){var e=null!=this?this.path:null;return n(t,e)}},function(t,e,r){"use strict";var n=r(12);
/*!
 * Given a value, cast it to a boolean, or throw a `CastError` if the value
 * cannot be casted. `null` and `undefined` are considered valid.
 *
 * @param {Any} value
 * @param {String} [path] optional the path to set on the CastError
 * @return {Boolean|null|undefined}
 * @throws {CastError} if `value` is not one of the allowed values
 * @api private
 */t.exports=function(e,r){if(t.exports.convertToTrue.has(e))return!0;if(t.exports.convertToFalse.has(e))return!1;if(null==e)return e;throw new n("boolean",e,r)},t.exports.convertToTrue=new Set([!0,"true",1,"1","yes"]),t.exports.convertToFalse=new Set([!1,"false",0,"0","no"])},function(t,e,r){"use strict";(function(e){
/*!
 * Centralize this so we can more easily work around issues with people
 * stubbing out `process.nextTick()` in tests using sinon:
 * https://github.com/sinonjs/lolex#automatically-incrementing-mocked-time
 * See gh-6074
 */
t.exports=function(t){return e.nextTick(t)}}).call(this,r(8))},function(t,e,r){"use strict";e.schemaMixedSymbol=Symbol.for("mongoose:schema_mixed"),e.builtInMiddleware=Symbol.for("mongoose:built-in-middleware")},function(t,e,r){"use strict";(function(n){
/*!
 * Module dependencies.
 */
function o(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function s(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return a(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return a(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var i,s=!0,u=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return s=t.done,t},e:function(t){u=!0,i=t},f:function(){try{s||null==r.return||r.return()}finally{if(u)throw i}}}}function a(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}var u,c=r(19).EventEmitter,l=r(137),f=r(14),p=r(7),h=r(9),y=r(138),d=r(53),_=r(74),m=r(0).arrayParentSymbol,v=r(3),g=r(139),b=r(140),w=r(46),O=r(15).get().ReadPreference,S=r(141),A=r(4),E=r(2),j=r(145),$=r(146).middlewareFunctions,P=r(76).middlewareFunctions,x=$.concat(P).reduce((function(t,e){return t.add(e)}),new Set),N=0;function T(t,e){if(!(this instanceof T))return new T(t,e);if(this.obj=t,this.paths={},this.aliases={},this.subpaths={},this.virtuals={},this.singleNestedPaths={},this.nested={},this.inherits={},this.callQueue=[],this._indexes=[],this.methods={},this.methodOptions={},this.statics={},this.tree={},this.query={},this.childSchemas=[],this.plugins=[],this.$id=++N,this.s={hooks:new l},this.options=this.defaultOptions(e),Array.isArray(t)){var r,n=s(t);try{for(n.s();!(r=n.n()).done;){var o=r.value;this.add(o)}}catch(t){n.e(t)}finally{n.f()}}else t&&this.add(t);var i=t&&t._id&&E.isObject(t._id);!this.paths._id&&!this.options.noId&&this.options._id&&!i&&_(this),this.setupTimestamp(this.options.timestamps)}
/*!
 * Create virtual properties with alias field
 */
/*!
 * Inherit from EventEmitter.
 */
T.prototype=Object.create(c.prototype),T.prototype.constructor=T,T.prototype.instanceOfSchema=!0,
/*!
 * ignore
 */
Object.defineProperty(T.prototype,"$schemaType",{configurable:!1,enumerable:!1,writable:!0}),Object.defineProperty(T.prototype,"childSchemas",{configurable:!1,enumerable:!0,writable:!0}),T.prototype.obj,T.prototype.paths,T.prototype.tree,T.prototype.clone=function(){var t=this,e=new(null==this.base?T:this.base.Schema)({},this._userProvidedOptions);return e.base=this.base,e.obj=this.obj,e.options=E.clone(this.options),e.callQueue=this.callQueue.map((function(t){return t})),e.methods=E.clone(this.methods),e.methodOptions=E.clone(this.methodOptions),e.statics=E.clone(this.statics),e.query=E.clone(this.query),e.plugins=Array.prototype.slice.call(this.plugins),e._indexes=E.clone(this._indexes),e.s.hooks=this.s.hooks.clone(),e.tree=E.clone(this.tree),e.paths=E.clone(this.paths),e.nested=E.clone(this.nested),e.subpaths=E.clone(this.subpaths),e.singleNestedPaths=E.clone(this.singleNestedPaths),e.childSchemas=
/*!
 * ignore
 */
function(t){for(var e=[],r=0,n=Object.keys(t.paths);r<n.length;r++){var o=n[r],i=t.paths[o];(i.$isMongooseDocumentArray||i.$isSingleNested)&&e.push({schema:i.schema,model:i.caster})}return e}
/*!
 * ignore
 */(e),e.virtuals=E.clone(this.virtuals),e.$globalPluginsApplied=this.$globalPluginsApplied,e.$isRootDiscriminator=this.$isRootDiscriminator,e.$implicitlyCreated=this.$implicitlyCreated,null!=this.discriminatorMapping&&(e.discriminatorMapping=Object.assign({},this.discriminatorMapping)),null!=this.discriminators&&(e.discriminators=Object.assign({},this.discriminators)),e.aliases=Object.assign({},this.aliases),e.on("init",(function(e){return t.emit("init",e)})),e},T.prototype.pick=function(t,e){var r=new T({},e||this.options);if(!Array.isArray(t))throw new f('Schema#pick() only accepts an array argument, got "'+i(t)+'"');var n,a=s(t);try{for(a.s();!(n=a.n()).done;){var u=n.value;if(this.nested[u])r.add(o({},u,v(this.tree,u)));else{var c=this.path(u);if(null==c)throw new f("Path `"+u+"` is not in the schema");r.add(o({},u,c))}}}catch(t){a.e(t)}finally{a.f()}return r},T.prototype.defaultOptions=function(t){t&&!1===t.safe&&(t.safe={w:0}),t&&t.safe&&0===t.safe.w&&(t.versionKey=!1),this._userProvidedOptions=null==t?{}:E.clone(t);var e=v(this,"base.options",{});if((t=E.options({strict:!("strict"in e)||e.strict,strictQuery:"strictQuery"in e&&e.strictQuery,bufferCommands:!0,capped:!1,versionKey:"__v",optimisticConcurrency:!1,discriminatorKey:"__t",minimize:!0,autoIndex:null,shardKey:null,read:null,validateBeforeSave:!0,noId:!1,_id:!0,noVirtualId:!1,id:!0,typeKey:"type",typePojoToMixed:!("typePojoToMixed"in e)||e.typePojoToMixed},E.clone(t))).read&&(t.read=O(t.read)),t.optimisticConcurrency&&!t.versionKey)throw new f("Must set `versionKey` if using `optimisticConcurrency`");return t},T.prototype.add=function(t,e){if(t instanceof T||null!=t&&t.instanceOfSchema)return b(this,t),this;!1===t._id&&null==e&&(this.options._id=!1),e=e||"";for(var r=0,n=Object.keys(t);r<n.length;r++){var i=n[r],a=e+i;if(null==t[i])throw new TypeError("Invalid value for schema path `"+a+'`, got value "'+t[i]+'"');if("_id"!==i||!1!==t[i])if(t[i]instanceof d||"VirtualType"===v(t[i],"constructor.name",null))this.virtual(t[i]);else{if(Array.isArray(t[i])&&1===t[i].length&&null==t[i][0])throw new TypeError("Invalid value for schema Array path `"+a+'`, got value "'+t[i][0]+'"');if(E.isPOJO(t[i])||t[i]instanceof h)if(Object.keys(t[i]).length<1)e&&(this.nested[e.substr(0,e.length-1)]=!0),this.path(a,t[i]);else if(!t[i][this.options.typeKey]||"type"===this.options.typeKey&&t[i].type.type)this.nested[a]=!0,this.add(t[i],a+".");else if(!this.options.typePojoToMixed&&E.isPOJO(t[i][this.options.typeKey])){e&&(this.nested[e.substr(0,e.length-1)]=!0);var u=new T(t[i][this.options.typeKey],{typePojoToMixed:!1}),c=Object.assign({},t[i],o({},this.options.typeKey,u));this.path(e+i,c)}else e&&(this.nested[e.substr(0,e.length-1)]=!0),this.path(e+i,t[i]);else e&&(this.nested[e.substr(0,e.length-1)]=!0),this.path(e+i,t[i])}}return function(t,e){var r,n=s(e=e||Object.keys(t.paths));try{for(n.s();!(r=n.n()).done;){var o=r.value,i=v(t.paths[o],"options");if(null!=i){var a=t.paths[o].path,u=i.alias;if(u){if("string"!=typeof u)throw new Error("Invalid value for alias option on "+a+", got "+u);t.aliases[u]=a,t.virtual(u).get(function(t){return function(){return"function"==typeof this.get?this.get(t):this[t]}}(a)).set(function(t){return function(e){return this.$set(t,e)}}(a))}}}}catch(t){n.e(t)}finally{n.f()}}(this,Object.keys(t).map((function(t){return e?e+t:t}))),this},T.reserved=Object.create(null),T.prototype.reserved=T.reserved;var k=T.reserved;
/*!
 * ignore
 */
function C(t){return/\.\d+/.test(t)?t.replace(/\.\d+\./g,".$.").replace(/\.\d+$/,".$"):t}
/*!
 * ignore
 */function R(t,e){for(var r=0,n=Object.keys(t.paths);r<n.length;r++){var o=n[r];if(o.includes(".$*"))if(new RegExp("^"+o.replace(/\.\$\*/g,"\\.[^.]+")+"$").test(e))return t.paths[o]}return null}
/*!
 * ignore. Deprecated re: #6405
 */
function D(t,e){var r=e.split(/\.(\d+)\.|\.(\d+)$/).filter(Boolean);if(r.length<2)return t.paths.hasOwnProperty(r[0])?t.paths[r[0]]:"adhocOrUndefined";var n=t.path(r[0]),o=!1;if(!n)return"adhocOrUndefined";for(var i=r.length-1,s=1;s<r.length;++s){o=!1;var a=r[s];if(s===i&&n&&!/\D/.test(a)){n=n.$isMongooseDocumentArray?n.$embeddedSchemaType:n instanceof u.Array?n.caster:void 0;break}if(/\D/.test(a)){if(!n||!n.schema){n=void 0;break}o="nested"===n.schema.pathType(a),n=n.schema.path(a)}else n instanceof u.Array&&s!==i&&(n=n.caster)}return t.subpaths[e]=n,n?"real":o?"nested":"adhocOrUndefined"}
/*!
 * ignore
 */k.prototype=k.emit=k.listeners=k.on=k.removeListener=k.collection=k.errors=k.get=k.init=k.isModified=k.isNew=k.populated=k.remove=k.save=k.schema=k.toObject=k.validate=1,T.prototype.path=function(t,e){var r=C(t);if(void 0===e){var n=function(t,e,r){if(t.paths.hasOwnProperty(e))return t.paths[e];if(t.subpaths.hasOwnProperty(r))return t.subpaths[r];if(t.singleNestedPaths.hasOwnProperty(r)&&"object"===i(t.singleNestedPaths[r]))return t.singleNestedPaths[r];return null}(this,t,r);if(null!=n)return n;var o=R(this,t);return null!=o?o:null!=(n=this.hasMixedParent(r))?n:/\.\d+\.?.*$/.test(t)?function(t,e){return D(t,e),t.subpaths[e]}(this,t):void 0}var a=t.split(".")[0];if(k[a])throw new Error("`"+a+"` may not be used as a schema pathname");"object"===i(e)&&E.hasUserDefinedProperty(e,"ref")&&j(e.ref,t);var u,c=t.split(/\./),l=c.pop(),f=this.tree,h="",y=s(c);try{for(y.s();!(u=y.n()).done;){var d=u.value;if(h=h+=(h.length>0?".":"")+d,f[d]||(this.nested[h]=!0,f[d]={}),"object"!==i(f[d])){var _="Cannot set nested path `"+t+"`. Parent path `"+h+"` already set to type "+f[d].name+".";throw new Error(_)}f=f[d]}}catch(t){y.e(t)}finally{y.f()}f[l]=E.clone(e),this.paths[t]=this.interpretAsType(t,e,this.options);var m=this.paths[t];if(m.$isSchemaMap){var v=t+".$*",g={type:{}};if(E.hasUserDefinedProperty(e,"of"))g=E.isPOJO(e.of)&&Object.keys(e.of).length>0&&!E.hasUserDefinedProperty(e.of,this.options.typeKey)?new T(e.of):e.of;this.paths[v]=this.interpretAsType(v,g,this.options),m.$__schemaType=this.paths[v]}if(m.$isSingleNested){for(var b in m.schema.paths)this.singleNestedPaths[t+"."+b]=m.schema.paths[b];for(var w in m.schema.singleNestedPaths)this.singleNestedPaths[t+"."+w]=m.schema.singleNestedPaths[w];for(var O in m.schema.subpaths)this.singleNestedPaths[t+"."+O]=m.schema.subpaths[O];for(var S in m.schema.nested)this.singleNestedPaths[t+"."+S]="nested";Object.defineProperty(m.schema,"base",{configurable:!0,enumerable:!1,writable:!1,value:this.base}),m.caster.base=this.base,this.childSchemas.push({schema:m.schema,model:m.caster})}else m.$isMongooseDocumentArray&&(Object.defineProperty(m.schema,"base",{configurable:!0,enumerable:!1,writable:!1,value:this.base}),m.casterConstructor.base=this.base,this.childSchemas.push({schema:m.schema,model:m.casterConstructor}));if(m.$isMongooseArray&&m.caster instanceof p){for(var A=t,$=m,P=[];$.$isMongooseArray;)A+=".$",$.$isMongooseDocumentArray?($.$embeddedSchemaType._arrayPath=A,$.$embeddedSchemaType._arrayParentPath=t,$=$.$embeddedSchemaType.clone()):($.caster._arrayPath=A,$.caster._arrayParentPath=t,$=$.caster.clone()),$.path=A,P.push($);for(var x=0,N=P;x<N.length;x++){var B=N[x];this.subpaths[B.path]=B}}if(m.$isMongooseDocumentArray){for(var M=0,I=Object.keys(m.schema.paths);M<I.length;M++){var F=I[M];this.subpaths[t+"."+F]=m.schema.paths[F],m.schema.paths[F].$isUnderneathDocArray=!0}for(var L=0,U=Object.keys(m.schema.subpaths);L<U.length;L++){var V=U[L];this.subpaths[t+"."+V]=m.schema.subpaths[V],m.schema.subpaths[V].$isUnderneathDocArray=!0}for(var q=0,W=Object.keys(m.schema.singleNestedPaths);q<W.length;q++){var H=W[q];"object"===i(m.schema.singleNestedPaths[r])&&(this.subpaths[t+"."+H]=m.schema.singleNestedPaths[H],m.schema.singleNestedPaths[H].$isUnderneathDocArray=!0)}}return this},Object.defineProperty(T.prototype,"base",{configurable:!0,enumerable:!1,writable:!0,value:null}),T.prototype.interpretAsType=function(t,e,r){if(e instanceof p){if(e.path===t)return e;var o=e.clone();return o.path=t,o}var s=null!=this.base?this.base.Schema.Types:T.Types;if(!(E.isPOJO(e)||e instanceof h)&&"Object"!==E.getFunctionName(e.constructor)){var a=e;(e={})[r.typeKey]=a}var u,c=!e[r.typeKey]||"type"===r.typeKey&&e.type.type?{}:e[r.typeKey];if(E.isPOJO(c)||"mixed"===c)return new s.Mixed(t,e);if(Array.isArray(c)||c===Array||"array"===c||c===s.Array){var l=c===Array||"array"===c?e.cast||e.of:c[0];if(l&&l.instanceOfSchema)return new s.DocumentArray(t,l,e);if(l&&l[r.typeKey]&&l[r.typeKey].instanceOfSchema)return new s.DocumentArray(t,l[r.typeKey],e,l);if(Array.isArray(l))return new s.Array(t,this.interpretAsType(t,l,r),e);if("string"==typeof l)l=s[l.charAt(0).toUpperCase()+l.substring(1)];else if(l&&(!l[r.typeKey]||"type"===r.typeKey&&l.type.type)&&E.isPOJO(l)){if(Object.keys(l).length){var f={minimize:r.minimize};r.typeKey&&(f.typeKey=r.typeKey),r.hasOwnProperty("strict")&&(f.strict=r.strict),r.hasOwnProperty("typePojoToMixed")&&(f.typePojoToMixed=r.typePojoToMixed),this._userProvidedOptions.hasOwnProperty("_id")?f._id=this._userProvidedOptions._id:T.Types.DocumentArray.defaultOptions&&null!=T.Types.DocumentArray.defaultOptions._id&&(f._id=T.Types.DocumentArray.defaultOptions._id);var y=new T(l,f);return y.$implicitlyCreated=!0,new s.DocumentArray(t,y,e)}return new s.Array(t,s.Mixed,e)}if(l&&(u="string"==typeof(c=!l[r.typeKey]||"type"===r.typeKey&&l.type.type?l:l[r.typeKey])?c:c.schemaName||E.getFunctionName(c),!s.hasOwnProperty(u)))throw new TypeError("Invalid schema configuration: "+"`".concat(u,"` is not a valid type within the array `").concat(t,"`.")+"See http://bit.ly/mongoose-schematypes for a list of valid schema types.");return new s.Array(t,l||s.Mixed,e,r)}if(c&&c.instanceOfSchema)return new s.Embedded(c,t,e);if((u=n.isBuffer(c)?"Buffer":"function"==typeof c||"object"===i(c)?c.schemaName||E.getFunctionName(c):null==c?""+c:c.toString())&&(u=u.charAt(0).toUpperCase()+u.substring(1)),"ObjectID"===u&&(u="ObjectId"),null==s[u])throw new TypeError("Invalid schema configuration: `".concat(u,"` is not ")+"a valid type at path `".concat(t,"`. See ")+"http://bit.ly/mongoose-schematypes for a list of valid schema types.");return new s[u](t,e)},T.prototype.eachPath=function(t){for(var e=Object.keys(this.paths),r=e.length,n=0;n<r;++n)t(e[n],this.paths[e[n]]);return this},T.prototype.requiredPaths=function(t){if(this._requiredpaths&&!t)return this._requiredpaths;for(var e=Object.keys(this.paths),r=e.length,n=[];r--;){var o=e[r];this.paths[o].isRequired&&n.push(o)}return this._requiredpaths=n,this._requiredpaths},T.prototype.indexedPaths=function(){return this._indexedpaths||(this._indexedpaths=this.indexes()),this._indexedpaths},T.prototype.pathType=function(t){var e=C(t);if(this.paths.hasOwnProperty(t))return"real";if(this.virtuals.hasOwnProperty(t))return"virtual";if(this.nested.hasOwnProperty(t))return"nested";if(this.subpaths.hasOwnProperty(e)||this.subpaths.hasOwnProperty(t))return"real";var r=this.singleNestedPaths.hasOwnProperty(e)||this.singleNestedPaths.hasOwnProperty(t);return r?"nested"===r?"nested":"real":null!=R(this,t)?"real":/\.\d+\.|\.\d+$/.test(t)?D(this,t):"adhocOrUndefined"},T.prototype.hasMixedParent=function(t){var e=t.split(/\./g);t="";for(var r=0;r<e.length;++r)if((t=r>0?t+"."+e[r]:e[r])in this.paths&&this.paths[t]instanceof u.Mixed)return this.paths[t];return null},T.prototype.setupTimestamp=function(t){return S(this,t)},T.prototype.queue=function(t,e){return this.callQueue.push([t,e]),this},T.prototype.pre=function(t){if(t instanceof RegExp){var e,r=Array.prototype.slice.call(arguments,1),n=s(x);try{for(n.s();!(e=n.n()).done;){var o=e.value;t.test(o)&&this.pre.apply(this,[o].concat(r))}}catch(t){n.e(t)}finally{n.f()}return this}if(Array.isArray(t)){var i,a=Array.prototype.slice.call(arguments,1),u=s(t);try{for(u.s();!(i=u.n()).done;){var c=i.value;this.pre.apply(this,[c].concat(a))}}catch(t){u.e(t)}finally{u.f()}return this}return this.s.hooks.pre.apply(this.s.hooks,arguments),this},T.prototype.post=function(t){if(t instanceof RegExp){var e,r=Array.prototype.slice.call(arguments,1),n=s(x);try{for(n.s();!(e=n.n()).done;){var o=e.value;t.test(o)&&this.post.apply(this,[o].concat(r))}}catch(t){n.e(t)}finally{n.f()}return this}if(Array.isArray(t)){var i,a=Array.prototype.slice.call(arguments,1),u=s(t);try{for(u.s();!(i=u.n()).done;){var c=i.value;this.post.apply(this,[c].concat(a))}}catch(t){u.e(t)}finally{u.f()}return this}return this.s.hooks.post.apply(this.s.hooks,arguments),this},T.prototype.plugin=function(t,e){if("function"!=typeof t)throw new Error('First param to `schema.plugin()` must be a function, got "'+i(t)+'"');if(e&&e.deduplicate){var r,n=s(this.plugins);try{for(n.s();!(r=n.n()).done;){if(r.value.fn===t)return this}}catch(t){n.e(t)}finally{n.f()}}return this.plugins.push({fn:t,opts:e}),t(this,e),this},T.prototype.method=function(t,e,r){if("string"!=typeof t)for(var n in t)this.methods[n]=t[n],this.methodOptions[n]=E.clone(r);else this.methods[t]=e,this.methodOptions[t]=E.clone(r);return this},T.prototype.static=function(t,e){if("string"!=typeof t)for(var r in t)this.statics[r]=t[r];else this.statics[t]=e;return this},T.prototype.index=function(t,e){return t||(t={}),e||(e={}),e.expires&&E.expires(e),this._indexes.push([t,e]),this},T.prototype.set=function(t,e,r){if(1===arguments.length)return this.options[t];switch(t){case"read":this.options[t]=O(e,r),this._userProvidedOptions[t]=this.options[t];break;case"safe":B(this.options,e),this._userProvidedOptions[t]=this.options[t];break;case"timestamps":this.setupTimestamp(e),this.options[t]=e,this._userProvidedOptions[t]=this.options[t];break;case"_id":this.options[t]=e,this._userProvidedOptions[t]=this.options[t],e&&!this.paths._id?_(this):!e&&null!=this.paths._id&&this.paths._id.auto&&this.remove("_id");break;default:this.options[t]=e,this._userProvidedOptions[t]=this.options[t]}return this};
/*!
 * ignore
 */
var B=A.deprecate((function(t,e){t.safe=!1===e?{w:0}:e}),"Mongoose: The `safe` option for schemas is deprecated. Use the `writeConcern` option instead: http://bit.ly/mongoose-write-concern");T.prototype.get=function(t){return this.options[t]};var M="2d 2dsphere hashed text".split(" ");
/*!
 * ignore
 */
function I(t,e){var r,n=e.split("."),o=n.pop(),i=t.tree,a=s(n);try{for(a.s();!(r=a.n()).done;){i=i[r.value]}}catch(t){a.e(t)}finally{a.f()}delete i[o]}
/*!
 * ignore
 */
function F(t){return t.startsWith("$[")&&t.endsWith("]")}
/*!
 * Module exports.
 */Object.defineProperty(T,"indexTypes",{get:function(){return M},set:function(){throw new Error("Cannot overwrite Schema.indexTypes")}}),T.prototype.indexes=function(){return g(this)},T.prototype.virtual=function(t,e){var r=this;if(t instanceof d||null!=t&&"VirtualType"===t.constructor.name)return this.virtual(t.path,t.options);if(e=new y(e),E.hasUserDefinedProperty(e,["ref","refPath"])){if(null==e.localField)throw new Error("Reference virtuals require `localField` option");if(null==e.foreignField)throw new Error("Reference virtuals require `foreignField` option");this.pre("init",(function(r){if(w.has(t,r)){var n=w.get(t,r);this.$$populatedVirtuals||(this.$$populatedVirtuals={}),e.justOne||e.count?this.$$populatedVirtuals[t]=Array.isArray(n)?n[0]:n:this.$$populatedVirtuals[t]=Array.isArray(n)?n:null==n?[]:[n],w.unset(t,r)}}));var n=this.virtual(t);return n.options=e,n.set((function(r){this.$$populatedVirtuals||(this.$$populatedVirtuals={}),e.justOne||e.count?(this.$$populatedVirtuals[t]=Array.isArray(r)?r[0]:r,"object"!==i(this.$$populatedVirtuals[t])&&(this.$$populatedVirtuals[t]=e.count?r:null)):(this.$$populatedVirtuals[t]=Array.isArray(r)?r:null==r?[]:[r],this.$$populatedVirtuals[t]=this.$$populatedVirtuals[t].filter((function(t){return t&&"object"===i(t)})))})),"function"==typeof e.get&&n.get(e.get),n}var o=this.virtuals,s=t.split(".");if("real"===this.pathType(t))throw new Error('Virtual path "'+t+'" conflicts with a real path in the schema');o[t]=s.reduce((function(r,n,o){return r[n]||(r[n]=o===s.length-1?new d(e,t):{}),r[n]}),this.tree);for(var a=s[0],u=0;u<s.length-1;++u){if(null!=this.paths[a]&&this.paths[a].$isMongooseDocumentArray)if("break"===function(){var t=s.slice(u+1).join(".");return r.paths[a].schema.virtual(t).get((function(e,r,n){var o=n.__parentArray[m],i=a+"."+n.__index+"."+t;return o.get(i)})),"break"}())break;a+="."+s[u+1]}return o[t]},T.prototype.virtualpath=function(t){return this.virtuals.hasOwnProperty(t)?this.virtuals[t]:null},T.prototype.remove=function(t){return"string"==typeof t&&(t=[t]),Array.isArray(t)&&t.forEach((function(t){if(null!=this.path(t)||this.nested[t]){if(this.nested[t]){var e,r=s(Object.keys(this.paths).concat(Object.keys(this.nested)));try{for(r.s();!(e=r.n()).done;){var n=e.value;n.startsWith(t+".")&&(delete this.paths[n],delete this.nested[n],I(this,n))}}catch(t){r.e(t)}finally{r.f()}return delete this.nested[t],void I(this,t)}delete this.paths[t],I(this,t)}}),this),this},T.prototype.loadClass=function(t,e){return t===Object.prototype||t===Function.prototype||t.prototype.hasOwnProperty("$isMongooseModelPrototype")||(this.loadClass(Object.getPrototypeOf(t)),e||Object.getOwnPropertyNames(t).forEach((function(e){if(!e.match(/^(length|name|prototype)$/)){var r=Object.getOwnPropertyDescriptor(t,e);"function"==typeof r.value&&this.static(e,r.value)}}),this),Object.getOwnPropertyNames(t.prototype).forEach((function(r){if(!r.match(/^(constructor)$/)){var n=Object.getOwnPropertyDescriptor(t.prototype,r);e||"function"==typeof n.value&&this.method(r,n.value),"function"==typeof n.get&&this.virtual(r).get(n.get),"function"==typeof n.set&&this.virtual(r).set(n.set)}}),this)),this},
/*!
 * ignore
 */
T.prototype._getSchema=function(t){var e=this.path(t),r=[];if(e)return e.$fullPath=t,e;for(var n=t.split("."),o=0;o<n.length;++o)("$"===n[o]||F(n[o]))&&(n[o]="0");return function t(e,n){for(var o,i,s=e.length+1;s--;)if(i=e.slice(0,s).join("."),o=n.path(i)){if(r.push(i),o.caster){if(o.caster instanceof u.Mixed)return o.caster.$fullPath=r.join("."),o.caster;if(s!==e.length&&o.schema){var a=void 0;return"$"===e[s]||F(e[s])?s+1===e.length?o:((a=t(e.slice(s+1),o.schema))&&(a.$isUnderneathDocArray=a.$isUnderneathDocArray||!o.schema.$isSingleNested),a):((a=t(e.slice(s),o.schema))&&(a.$isUnderneathDocArray=a.$isUnderneathDocArray||!o.schema.$isSingleNested),a)}}else if(o.$isSchemaMap){return s+1>=e.length?o.$__schemaType:t(e.slice(s+1),o.$__schemaType.schema)}return o.$fullPath=r.join("."),o}}(n,this)},
/*!
 * ignore
 */
T.prototype._getPathType=function(t){if(this.path(t))return"real";return function t(e,r){for(var n,o,i=e.length+1;i--;){if(o=e.slice(0,i).join("."),n=r.path(o))return n.caster?n.caster instanceof u.Mixed?{schema:n,pathType:"mixed"}:i!==e.length&&n.schema?"$"===e[i]||F(e[i])?i===e.length-1?{schema:n,pathType:"nested"}:t(e.slice(i+1),n.schema):t(e.slice(i),n.schema):{schema:n,pathType:n.$isSingleNested?"nested":"array"}:{schema:n,pathType:"real"};if(i===e.length&&r.nested[o])return{schema:r,pathType:"nested"}}return{schema:n||r,pathType:"undefined"}}(t.split("."),this)},t.exports=e=T,T.Types=u=r(54),
/*!
 * ignore
 */
e.ObjectId=u.ObjectId}).call(this,r(1).Buffer)},function(t,e,r){"use strict";var n=r(2);function o(t,e){this.path=e,this.getters=[],this.setters=[],this.options=Object.assign({},t)}o.prototype._applyDefaultGetters=function(){if(!(this.getters.length>0||this.setters.length>0)){var t="$"+this.path;this.getters.push((function(){return this[t]})),this.setters.push((function(e){this[t]=e}))}},
/*!
 * ignore
 */
o.prototype.clone=function(){var t=new o(this.options,this.path);return t.getters=[].concat(this.getters),t.setters=[].concat(this.setters),t},o.prototype.get=function(t){return this.getters.push(t),this},o.prototype.set=function(t){return this.setters.push(t),this},o.prototype.applyGetters=function(t,e){n.hasUserDefinedProperty(this.options,["ref","refPath"])&&e.$$populatedVirtuals&&e.$$populatedVirtuals.hasOwnProperty(this.path)&&(t=e.$$populatedVirtuals[this.path]);for(var r=t,o=this.getters.length-1;o>=0;o--)r=this.getters[o].call(e,r,this,e);return r},o.prototype.applySetters=function(t,e){for(var r=t,n=this.setters.length-1;n>=0;n--)r=this.setters[n].call(e,r,this,e);return r},
/*!
 * exports
 */
t.exports=o},function(t,e,r){"use strict";
/*!
 * Module exports.
 */e.String=r(147),e.Number=r(78),e.Boolean=r(151),e.DocumentArray=r(152),e.Embedded=r(159),e.Array=r(55),e.Buffer=r(161),e.Date=r(163),e.ObjectId=r(166),e.Mixed=r(25),e.Decimal128=e.Decimal=r(168),e.Map=r(170),e.Oid=e.ObjectId,e.Object=e.Mixed,e.Bool=e.Boolean,e.ObjectID=e.ObjectId},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */function n(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return o(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return o(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,i=function(){};return{s:i,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,a=!0,u=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return a=t.done,t},e:function(t){u=!0,s=t},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw s}}}}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}var i,s,a=r(48),u=r(72),c=r(14),l=r(153),f=r(7),p=f.CastError,h=r(25),y=r(154),d=r(155),_=r(3),m=r(80),v=r(4),g=r(2),b=r(33).castToNumber,w=r(81),O=r(34),S=Symbol("mongoose#isNestedArray");function A(t,e,n,o){s||(s=r(56).Embedded);var i,a,u="type";if(o&&o.typeKey&&(u=o.typeKey),this.schemaOptions=o,e){var c={};g.isPOJO(e)&&(e[u]?(delete(c=g.clone(e))[u],e=e[u]):e=h),e===Object&&(e=h);var l="string"==typeof e?e:g.getFunctionName(e),p=r(54),y=p.hasOwnProperty(l)?p[l]:e;this.casterConstructor=y,this.casterConstructor instanceof A&&(this.casterConstructor[S]=!0),"function"!=typeof y||y.$isArraySubdocument||y.$isSchemaMap?this.caster=y:this.caster=new y(null,c),this.$embeddedSchemaType=this.caster,this.caster instanceof s||(this.caster.path=t)}if(this.$isMongooseArray=!0,f.call(this,t,n,"Array"),null!=this.defaultValue&&(i=this.defaultValue,a="function"==typeof i),!("defaultValue"in this)||void 0!==this.defaultValue){var d=function(){var t=[];return a?t=i.call(this):null!=i&&(t=t.concat(i)),t};d.$runBeforeSetters=!a,this.default(d)}}A.schemaName="Array",A.options={castNonArrays:!0},A.defaultOptions={},A.set=f.set,
/*!
 * Inherits from SchemaType.
 */
A.prototype=Object.create(f.prototype),A.prototype.constructor=A,A.prototype.OptionsConstructor=l,
/*!
 * ignore
 */
A._checkRequired=f.prototype.checkRequired,A.checkRequired=f.checkRequired,A.prototype.checkRequired=function(t,e){return f._isRef(this,t,e,!0)?!!t:("function"==typeof this.constructor.checkRequired?this.constructor.checkRequired():A.checkRequired())(t)},A.prototype.enum=function(){for(var t=this;;){var e=_(t,"caster.instance");if("Array"!==e){if("String"!==e&&"Number"!==e)throw new Error("`enum` can only be set on an array of strings or numbers , not "+e);break}t=t.caster}var r=arguments;return!Array.isArray(arguments)&&g.isObject(arguments)&&(r=g.object.vals(r)),t.caster.enum.apply(t.caster,r),this},A.prototype.applyGetters=function(t,e){return this.caster.options&&this.caster.options.ref?t:f.prototype.applyGetters.call(this,t,e)},A.prototype._applySetters=function(t,e,r,n){if(this.casterConstructor instanceof A&&A.options.castNonArrays&&!this[S]){for(var o=0,i=this;null!=i&&i instanceof A&&!i.$isMongooseDocumentArray;)++o,i=i.casterConstructor;if(null!=t&&t.length>0){var s=y(t);if(s.min===s.max&&s.max<o&&s.containsNonArrayItem)for(var a=s.max;a<o;++a)t=[t]}}return f.prototype._applySetters.call(this,t,e,r,n)},A.prototype.cast=function(t,e,n,o,s){var a,u;if(i||(i=r(56).Array),Array.isArray(t)){if(!t.length&&e){var l=e.schema.indexedPaths(),f=this.path;for(a=0,u=l.length;a<u;++a){var y=l[a][0][f];if("2dsphere"===y||"2d"===y)return}var d=this.path.endsWith(".coordinates")?this.path.substr(0,this.path.lastIndexOf(".")):null;if(null!=d)for(a=0,u=l.length;a<u;++a){if("2dsphere"===l[a][0][d])return}}if(t&&t.isMongooseArray?t&&t.isMongooseArray&&(t=i(t,_(s,"path",null)||this._arrayPath||this.path,e,this)):t=i(t,_(s,"path",null)||this._arrayPath||this.path,e,this),null!=e&&null!=e.$__&&e.populated(this.path))return t;var m=this.caster;if(m&&this.casterConstructor!==h)try{var g=t.length;for(a=0;a<g;a++){if("Number"===m.instance&&void 0===t[a])throw new c("Mongoose number arrays disallow storing undefined");var b={};m.$isMongooseArray&&(null!=s&&null!=s.arrayPath?b.arrayPath=s.arrayPath+"."+a:null!=this.caster._arrayParentPath&&(b.arrayPath=this.caster._arrayParentPath+"."+a)),t[a]=m.applySetters(t[a],e,n,void 0,b)}}catch(e){throw new p("["+e.kind+"]",v.inspect(t),this.path+"."+a,e,this)}return t}if(n||A.options.castNonArrays)return e&&n&&e.markModified(this.path),this.cast([t],e,n);throw new p("Array",v.inspect(t),this.path,null,this)},
/*!
 * Ignore
 */
A.prototype.discriminator=function(t,e){for(var r=this;r.$isMongooseArray&&!r.$isMongooseDocumentArray;)if(null==(r=r.casterConstructor)||"function"==typeof r)throw new c("You can only add an embedded discriminator on a document array, "+this.path+" is a plain array");return r.discriminator(t,e)},
/*!
 * ignore
 */
A.prototype.clone=function(){var t=Object.assign({},this.options),e=new this.constructor(this.path,this.caster,t,this.schemaOptions);return e.validators=this.validators.slice(),void 0!==this.requiredValidator&&(e.requiredValidator=this.requiredValidator),e},A.prototype.castForQuery=function(t,e){var r,n,o=this;if(2===arguments.length){if(!(r=this.$conditionalHandlers[t]))throw new Error("Can't use "+t+" with Array.");n=r.call(this,e)}else{n=t;var i=this.casterConstructor;if(n&&i.discriminators&&i.schema&&i.schema.options&&i.schema.options.discriminatorKey)if("string"==typeof n[i.schema.options.discriminatorKey]&&i.discriminators[n[i.schema.options.discriminatorKey]])i=i.discriminators[n[i.schema.options.discriminatorKey]];else{var s=O(i,n[i.schema.options.discriminatorKey]);s&&(i=s)}var a=this.casterConstructor.prototype,u=a&&(a.castForQuery||a.cast);!u&&i.castForQuery&&(u=i.castForQuery);var c=this.caster;Array.isArray(n)?(this.setters.reverse().forEach((function(t){n=t.call(o,n,o)})),n=n.map((function(t){return g.isObject(t)&&t.$elemMatch?t:u?t=u.call(c,t):null!=t?t=new i(t):t}))):u?n=u.call(c,n):null!=n&&(n=new i(n))}return n};var E=A.prototype.$conditionalHandlers={};function j(t){return function(e){if(!Array.isArray(e))throw new TypeError("conditional "+t+" requires an array");var r,o=[],i=n(e);try{for(i.s();!(r=i.n()).done;){var s=r.value;o.push(d(this.casterConstructor.schema,s))}}catch(t){i.e(t)}finally{i.f()}return o}}E.$all=function(t){return Array.isArray(t)||(t=[t]),t=t.map((function(t){if(g.isObject(t)){var e={};return e[this.path]=t,d(this.casterConstructor.schema,e)[this.path]}return t}),this),this.castForQuery(t)},E.$options=String,E.$elemMatch=function(t){for(var e=Object.keys(t),r=e.length,n=0;n<r;++n){var o=e[n],i=t[o];m(o)&&null!=i&&(t[o]=this.castForQuery(o,i))}var s=_(this,"casterConstructor.schema.options.discriminatorKey"),a=_(this,"casterConstructor.schema.discriminators",{});return null!=s&&null!=t[s]&&null!=a[t[s]]?d(a[t[s]],t):d(this.casterConstructor.schema,t)},E.$geoIntersects=w.cast$geoIntersects,E.$or=j("$or"),E.$and=j("$and"),E.$nor=j("$nor"),E.$near=E.$nearSphere=w.cast$near,E.$within=E.$geoWithin=w.cast$within,E.$size=E.$minDistance=E.$maxDistance=b,E.$exists=a,E.$type=u,E.$eq=E.$gt=E.$gte=E.$lt=E.$lte=E.$ne=E.$regex=A.prototype.castForQuery,E.$nin=f.prototype.$conditionalHandlers.$nin,E.$in=f.prototype.$conditionalHandlers.$in,
/*!
 * Module exports.
 */
t.exports=A},function(t,e,r){"use strict";
/*!
 * Module exports.
 */e.Array=r(82),e.Buffer=r(85),e.Document=e.Embedded=r(26),e.DocumentArray=r(18),e.Decimal128=r(20),e.ObjectId=r(13),e.Map=r(87),e.Subdocument=r(89)},function(t,e,r){"use strict";var n,o=r(0).documentSchemaSymbol,i=r(3),s=r(17).internalToObjectOptions,a=r(2),u=r(0).getSymbol,c=r(0).scopeSymbol;
/*!
 * Compiles schemas.
 */
function l(t,e,o,i){n=n||r(6);for(var s,u,c=Object.keys(t),l=c.length,p=0;p<l;++p){s=t[u=c[p]],f(u,a.isPOJO(s)&&Object.keys(s).length&&(!s[i.typeKey]||"type"===i.typeKey&&s.type.type)?s:null,e,o,c,i)}}
/*!
 * Defines the accessor named prop on the incoming prototype.
 */function f(t,e,f,p,h,y){n=n||r(6);var d=(p?p+".":"")+t;p=p||"",e?Object.defineProperty(f,t,{enumerable:!0,configurable:!0,get:function(){var t,r,s=this;if(this.$__.getters||(this.$__.getters={}),!this.$__.getters[d]){var u=Object.create(n.prototype,(t=this,r={},Object.getOwnPropertyNames(t).forEach((function(e){r[e]=Object.getOwnPropertyDescriptor(t,e),r[e].get?delete r[e]:r[e].enumerable=-1===["isNew","$__","errors","_doc","$locals","$op","__parentArray","__index","$isDocumentArrayElement"].indexOf(e)})),r));p||(u.$__[c]=this),u.$__.nestedPath=d,Object.defineProperty(u,"schema",{enumerable:!1,configurable:!0,writable:!1,value:f.schema}),Object.defineProperty(u,o,{enumerable:!1,configurable:!0,writable:!1,value:f.schema}),Object.defineProperty(u,"toObject",{enumerable:!1,configurable:!0,writable:!1,value:function(){return a.clone(s.get(d,null,{virtuals:i(this,"schema.options.toObject.virtuals",null)}))}}),Object.defineProperty(u,"$__get",{enumerable:!1,configurable:!0,writable:!1,value:function(){return s.get(d,null,{virtuals:i(this,"schema.options.toObject.virtuals",null)})}}),Object.defineProperty(u,"toJSON",{enumerable:!1,configurable:!0,writable:!1,value:function(){return s.get(d,null,{virtuals:i(s,"schema.options.toJSON.virtuals",null)})}}),Object.defineProperty(u,"$__isNested",{enumerable:!1,configurable:!0,writable:!1,value:!0});var h=Object.freeze({minimize:!0,virtuals:!1,getters:!1,transform:!1});Object.defineProperty(u,"$isEmpty",{enumerable:!1,configurable:!0,writable:!1,value:function(){return 0===Object.keys(this.get(d,null,h)||{}).length}}),Object.defineProperty(u,"$__parent",{enumerable:!1,configurable:!0,writable:!1,value:this}),l(e,u,d,y),this.$__.getters[d]=u}return this.$__.getters[d]},set:function(t){null!=t&&t.$__isNested?t=t.$__get():t instanceof n&&!t.$__isNested&&(t=t.toObject(s)),(this.$__[c]||this).$set(d,t)}}):Object.defineProperty(f,t,{enumerable:!0,configurable:!0,get:function(){return this[u].call(this.$__[c]||this,d)},set:function(t){this.$set.call(this.$__[c]||this,d,t)}})}
/*!
 * exports
 */
e.compile=l,e.defineKey=f},function(t,e,r){"use strict";
/*!
 * ignore
 */function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}t.exports=function(t){return null==t||("object"!==n(t)||!("$meta"in t)&&!("$slice"in t))}},function(t,e,r){"use strict";(function(e){if(void 0!==e.Map)t.exports=e.Map,t.exports.Map=e.Map;else{var r=function(t){this._keys=[],this._values={};for(var e=0;e<t.length;e++)if(null!=t[e]){var r=t[e],n=r[0],o=r[1];this._keys.push(n),this._values[n]={v:o,i:this._keys.length-1}}};r.prototype.clear=function(){this._keys=[],this._values={}},r.prototype.delete=function(t){var e=this._values[t];return null!=e&&(delete this._values[t],this._keys.splice(e.i,1),!0)},r.prototype.entries=function(){var t=this,e=0;return{next:function(){var r=t._keys[e++];return{value:void 0!==r?[r,t._values[r].v]:void 0,done:void 0===r}}}},r.prototype.forEach=function(t,e){e=e||this;for(var r=0;r<this._keys.length;r++){var n=this._keys[r];t.call(e,this._values[n].v,n,e)}},r.prototype.get=function(t){return this._values[t]?this._values[t].v:void 0},r.prototype.has=function(t){return null!=this._values[t]},r.prototype.keys=function(){var t=this,e=0;return{next:function(){var r=t._keys[e++];return{value:void 0!==r?r:void 0,done:void 0===r}}}},r.prototype.set=function(t,e){return this._values[t]?(this._values[t].v=e,this):(this._keys.push(t),this._values[t]={v:e,i:this._keys.length-1},this)},r.prototype.values=function(){var t=this,e=0;return{next:function(){var r=t._keys[e++];return{value:void 0!==r?t._values[r].v:void 0,done:void 0===r}}}},Object.defineProperty(r.prototype,"size",{enumerable:!0,get:function(){return this._keys.length}}),t.exports=r,t.exports.Map=r}}).call(this,r(11))},function(t,e){var r=function t(e){if(!(this instanceof t))return new t(e);this._bsontype="Int32",this.value=e};r.prototype.valueOf=function(){return this.value},r.prototype.toJSON=function(){return this.value},t.exports=r,t.exports.Int32=r},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */var n=r(6),o=r(179),i=!1;t.exports=function(){return i?o:n},
/*!
 * ignore
 */
t.exports.setBrowser=function(t){i=t}},function(t,e){t.exports=function(t,e,r){var n=[],o=t.length;if(0===o)return n;var i=e<0?Math.max(0,e+o):e||0;for(void 0!==r&&(o=r<0?r+o:r);o-- >i;)n[o-i]=t[o];return n}},function(t,e,r){
/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var n=r(1),o=n.Buffer;function i(t,e){for(var r in t)e[r]=t[r]}function s(t,e,r){return o(t,e,r)}o.from&&o.alloc&&o.allocUnsafe&&o.allocUnsafeSlow?t.exports=n:(i(n,e),e.Buffer=s),s.prototype=Object.create(o.prototype),i(o,s),s.from=function(t,e,r){if("number"==typeof t)throw new TypeError("Argument must not be a number");return o(t,e,r)},s.alloc=function(t,e,r){if("number"!=typeof t)throw new TypeError("Argument must be a number");var n=o(t);return void 0!==e?"string"==typeof r?n.fill(e,r):n.fill(e):n.fill(0),n},s.allocUnsafe=function(t){if("number"!=typeof t)throw new TypeError("Argument must be a number");return o(t)},s.allocUnsafeSlow=function(t){if("number"!=typeof t)throw new TypeError("Argument must be a number");return n.SlowBuffer(t)}},function(t,e){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var n=Object.prototype.toString;t.exports=function(t){if("object"!=r(e=t)||"[object RegExp]"!=n.call(e))throw new TypeError("Not a RegExp");var e,o=[];t.global&&o.push("g"),t.multiline&&o.push("m"),t.ignoreCase&&o.push("i"),t.dotAll&&o.push("s"),t.unicode&&o.push("u"),t.sticky&&o.push("y");var i=new RegExp(t.source,o.join(""));return"number"==typeof t.lastIndex&&(i.lastIndex=t.lastIndex),i}},function(t,e,r){"use strict";t.exports=function(t){return t.name?t.name:(t.toString().trim().match(/^function\s*([^\s(]+)/)||[])[1]}},function(t,e,r){"use strict";var n=r(3);
/*!
 * Get the bson type, if it exists
 */t.exports=function(t,e){return n(t,"_bsontype",void 0)===e}},function(t,e,r){"use strict";(function(e){
/*!
 * ignore
 */
var n=r(22),o=r(116),i={_promise:null,get:function(){return i._promise},set:function(t){n.ok("function"==typeof t,"mongoose.Promise must be a function, got ".concat(t)),i._promise=t,o.Promise=t}};
/*!
 * Use native promises by default
 */
i.set(e.Promise),t.exports=i}).call(this,r(11))},function(t,e,r){"use strict";(function(t,n){
/*!
 * Module dependencies.
 */
function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var i=r(118).Buffer,s=r(64),a=["__proto__","constructor","prototype"],u=e.clone=function t(r,n){if(null==r)return r;if(Array.isArray(r))return e.cloneArray(r,n);if(r.constructor){if(/ObjectI[dD]$/.test(r.constructor.name))return"function"==typeof r.clone?r.clone():new r.constructor(r.id);if("ReadPreference"===r.constructor.name)return new r.constructor(r.mode,t(r.tags,n));if("Binary"==r._bsontype&&r.buffer&&r.value)return"function"==typeof r.clone?r.clone():new r.constructor(r.value(!0),r.sub_type);if("Date"===r.constructor.name||"Function"===r.constructor.name)return new r.constructor(+r);if("RegExp"===r.constructor.name)return s(r);if("Buffer"===r.constructor.name)return e.cloneBuffer(r)}return l(r)?e.cloneObject(r,n):r.valueOf?r.valueOf():void 0};
/*!
 * ignore
 */
e.cloneObject=function(t,e){var r,n,o,i=e&&e.minimize,s={};for(o in t)-1===a.indexOf(o)&&(n=u(t[o],e),i&&void 0===n||(r||(r=!0),s[o]=n));return i?r&&s:s},e.cloneArray=function(t,e){for(var r=[],n=0,o=t.length;n<o;n++)r.push(u(t[n],e));return r},e.tick=function(t){if("function"==typeof t)return function(){var e=arguments;f((function(){t.apply(this,e)}))}},e.merge=function t(r,n){for(var o,i=Object.keys(n),s=i.length;s--;)o=i[s],-1===a.indexOf(o)&&(void 0===r[o]?r[o]=n[o]:e.isObject(n[o])?t(r[o],n[o]):r[o]=n[o])},e.mergeClone=function t(r,n){for(var o,i=Object.keys(n),s=i.length;s--;)void 0===r[o=i[s]]?r[o]=u(n[o]):e.isObject(n[o])?t(r[o],n[o]):r[o]=u(n[o])},e.readPref=function(t){switch(t){case"p":t="primary";break;case"pp":t="primaryPreferred";break;case"s":t="secondary";break;case"sp":t="secondaryPreferred";break;case"n":t="nearest"}return t},e.readConcern=function(t){if("string"==typeof t){switch(t){case"l":t="local";break;case"a":t="available";break;case"m":t="majority";break;case"lz":t="linearizable";break;case"s":t="snapshot"}t={level:t}}return t};var c=Object.prototype.toString;e.toString=function(t){return c.call(t)};var l=e.isObject=function(t){return"[object Object]"==e.toString(t)};e.isArray=function(t){return Array.isArray(t)||"object"==o(t)&&"[object Array]"==e.toString(t)},e.keys=Object.keys||function(t){var e=[];for(var r in t)t.hasOwnProperty(r)&&e.push(r);return e},e.create="function"==typeof Object.create?Object.create:function(t){if(arguments.length>1)throw new Error("Adding properties is not supported");function e(){}return e.prototype=t,new e},e.inherits=function(t,r){t.prototype=e.create(r.prototype),t.prototype.constructor=t};var f=e.soon="function"==typeof t?t:n.nextTick;e.cloneBuffer=function(t){var e=i.alloc(t.length);return t.copy(e,0,0,t.length),e},e.isArgumentsObject=function(t){return"[object Arguments]"===Object.prototype.toString.call(t)}}).call(this,r(69).setImmediate,r(8))},function(t,e,r){(function(t){var n=void 0!==t&&t||"undefined"!=typeof self&&self||window,o=Function.prototype.apply;function i(t,e){this._id=t,this._clearFn=e}e.setTimeout=function(){return new i(o.call(setTimeout,n,arguments),clearTimeout)},e.setInterval=function(){return new i(o.call(setInterval,n,arguments),clearInterval)},e.clearTimeout=e.clearInterval=function(t){t&&t.close()},i.prototype.unref=i.prototype.ref=function(){},i.prototype.close=function(){this._clearFn.call(n,this._id)},e.enroll=function(t,e){clearTimeout(t._idleTimeoutId),t._idleTimeout=e},e.unenroll=function(t){clearTimeout(t._idleTimeoutId),t._idleTimeout=-1},e._unrefActive=e.active=function(t){clearTimeout(t._idleTimeoutId);var e=t._idleTimeout;e>=0&&(t._idleTimeoutId=setTimeout((function(){t._onTimeout&&t._onTimeout()}),e))},r(117),e.setImmediate="undefined"!=typeof self&&self.setImmediate||void 0!==t&&t.setImmediate||this&&this.setImmediate,e.clearImmediate="undefined"!=typeof self&&self.clearImmediate||void 0!==t&&t.clearImmediate||this&&this.clearImmediate}).call(this,r(11))},function(t,e,r){"use strict";(function(t,r,n,o){function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}e.isNode=void 0!==t&&"object"==i(r)&&"object"==(void 0===n?"undefined":i(n))&&"function"==typeof o&&t.argv,e.isMongo=!e.isNode&&"function"==typeof printjson&&"function"==typeof ObjectId&&"function"==typeof rs&&"function"==typeof sh,e.isBrowser=!e.isNode&&!e.isMongo&&"undefined"!=typeof window,e.type=e.isNode?"node":e.isMongo?"mongo":e.isBrowser?"browser":"unknown"}).call(this,r(8),r(123)(t),r(11),r(1).Buffer)},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function s(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=u(t);if(e){var o=u(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return a(this,r)}}function a(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function u(t){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var c=r(5),l=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}(u,t);var e,r,n,a=s(u);function u(t){var e;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,u);var r=t.message;r||(r=c.messages.general.default);var n=f(r,t);return e=a.call(this,n),t=Object.assign({},t,{message:n}),e.properties=t,e.kind=t.type,e.path=t.path,e.value=t.value,e.reason=t.reason,e}
/*!
   * toString helper
   * TODO remove? This defaults to `${this.name}: ${this.message}`
   */return e=u,(r=[{key:"toString",value:function(){return this.message}
/*!
     * Ensure `name` and `message` show up in toJSON output re: gh-9296
     */},{key:"toJSON",value:function(){return Object.assign({name:this.name,message:this.message},this)}}])&&o(e.prototype,r),n&&o(e,n),u}(c);
/*!
 * Formats error messages
 */
function f(t,e){if("function"==typeof t)return t(e);for(var r=0,n=Object.keys(e);r<n.length;r++){var o=n[r];"message"!==o&&(t=t.replace("{"+o.toUpperCase()+"}",e[o]))}return t}
/*!
 * exports
 */Object.defineProperty(l.prototype,"name",{value:"ValidatorError"}),
/*!
 * The object used to define this validator. Not enumerable to hide
 * it from `require('util').inspect()` output re: gh-3925
 */
Object.defineProperty(l.prototype,"properties",{enumerable:!1,writable:!0,value:null}),l.prototype.formatMessage=f,t.exports=l},function(t,e,r){"use strict";
/*!
 * ignore
 */t.exports=function(t){if(Array.isArray(t)){if(!t.every((function(t){return"number"==typeof t||"string"==typeof t})))throw new Error("$type array values must be strings or numbers");return t}if("number"!=typeof t&&"string"!=typeof t)throw new Error("$type parameter must be number, string, or array of numbers and strings");return t}},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){return(o=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function i(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=a(t);if(e){var o=a(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return s(this,r)}}function s(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var u=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&o(t,e)}(r,t);var e=i(r);function r(t,n){var o;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,r);var i=Array.isArray(n)?"array":"primitive value";return(o=e.call(this,"Tried to set nested object field `"+t+"` to ".concat(i," `")+n+"` and strict mode is set to throw.")).path=t,o}return r}(r(5));Object.defineProperty(u.prototype,"name",{value:"ObjectExpectedError"}),t.exports=u},function(t,e,r){"use strict";t.exports=function(t){var e={_id:{auto:!0}};e._id[t.options.typeKey]="ObjectId",t.add(e)}},function(t,e,r){"use strict";t.exports=
/*!
 * ignore
 */
function(t,e){if(null==t)return null;if("boolean"==typeof t)return e;if("boolean"==typeof t[e])return t[e]?e:null;if(!(e in t))return e;return t[e]}},function(t,e,r){"use strict";var n=r(51),o=r(24);
/*!
 * Register hooks for this model
 *
 * @param {Model} model
 * @param {Schema} schema
 */
function i(t,e,r){var s={useErrorHandlers:!0,numCallbackParams:1,nullResultByDefault:!0,contextParameter:!0},a=(r=r||{}).decorateDoc?t:t.prototype;t.$appliedHooks=!0;for(var u=0,c=Object.keys(e.paths);u<c.length;u++){var l=c[u],f=e.paths[l],p=null;if(f.$isSingleNested)p=f.caster;else{if(!f.$isMongooseDocumentArray)continue;p=f.Constructor}if(!p.$appliedHooks&&(i(p,f.schema,r),null!=p.discriminators))for(var h=0,y=Object.keys(p.discriminators);h<y.length;h++){var d=y[h];i(p.discriminators[d],p.discriminators[d].schema,r)}}var _=e.s.hooks.filter((function(t){return"updateOne"===t.name||"deleteOne"===t.name?!!t.document:"remove"===t.name||"init"===t.name?null==t.document||!!t.document:null==t.query&&null==t.document||!1!==t.document})).filter((function(t){return!e.methods[t.name]||!t.fn[n.builtInMiddleware]}));t._middleware=_,a.$__originalValidate=a.$__originalValidate||a.$__validate;for(var m=0,v=["save","validate","remove","deleteOne"];m<v.length;m++){var g=v[m],b="validate"===g?"$__originalValidate":"$__".concat(g),w=_.createWrapper(g,a[b],null,s);a["$__".concat(g)]=w}a.$__init=_.createWrapperSync("init",a.$__init,null,s);for(var O=Object.keys(e.methods),S=Object.assign({},s,{checkForPromise:!0}),A=function(){var e=j[E];if(!_.hasHooks(e))return"continue";var r=a[e];a[e]=function(){var r=this,n=Array.prototype.slice.call(arguments),i=n.slice(-1).pop(),s="function"==typeof i?n.slice(0,n.length-1):n;return o(i,(function(t){return r["$__".concat(e)].apply(r,s.concat([t]))}),t.events)},a["$__".concat(e)]=_.createWrapper(e,r,null,S)},E=0,j=O;E<j.length;E++)A()}
/*!
 * ignore
 */
t.exports=i,
/*!
 * ignore
 */
i.middlewareFunctions=["deleteOne","save","validate","remove","updateOne","init"]},function(t,e,r){"use strict";var n=r(12);
/*!
 * Given a value, cast it to a string, or throw a `CastError` if the value
 * cannot be casted. `null` and `undefined` are considered valid.
 *
 * @param {Any} value
 * @param {String} [path] optional the path to set on the CastError
 * @return {string|null|undefined}
 * @throws {CastError}
 * @api private
 */t.exports=function(t,e){if(null==t)return t;if(t._id&&"string"==typeof t._id)return t._id;if(t.toString&&t.toString!==Object.prototype.toString&&!Array.isArray(t))return t.toString();throw new n("string",t,e)}},function(t,e,r){"use strict";(function(e){
/*!
 * Module requirements.
 */
var n,o=r(5),i=r(149),s=r(7),a=r(150),u=r(79),c=r(2),l=r(0).populateModelSymbol,f=s.CastError;function p(t,e){s.call(this,t,e,"Number")}
/*!
 * ignore
 */
function h(t){return this.cast(t)}p.get=s.get,p.set=s.set,
/*!
 * ignore
 */
p._cast=a,p.cast=function(t){return 0===arguments.length||(!1===t&&(t=this._defaultCaster),this._cast=t),this._cast},
/*!
 * ignore
 */
p._defaultCaster=function(t){if("number"!=typeof t)throw new Error;return t},p.schemaName="Number",p.defaultOptions={},
/*!
 * Inherits from SchemaType.
 */
p.prototype=Object.create(s.prototype),p.prototype.constructor=p,p.prototype.OptionsConstructor=i,
/*!
 * ignore
 */
p._checkRequired=function(t){return"number"==typeof t||t instanceof Number},p.checkRequired=s.checkRequired,p.prototype.checkRequired=function(t,e){return s._isRef(this,t,e,!0)?!!t:("function"==typeof this.constructor.checkRequired?this.constructor.checkRequired():p.checkRequired())(t)},p.prototype.min=function(t,e){if(this.minValidator&&(this.validators=this.validators.filter((function(t){return t.validator!==this.minValidator}),this)),null!=t){var r=e||o.messages.Number.min;r=r.replace(/{MIN}/,t),this.validators.push({validator:this.minValidator=function(e){return null==e||e>=t},message:r,type:"min",min:t})}return this},p.prototype.max=function(t,e){if(this.maxValidator&&(this.validators=this.validators.filter((function(t){return t.validator!==this.maxValidator}),this)),null!=t){var r=e||o.messages.Number.max;r=r.replace(/{MAX}/,t),this.validators.push({validator:this.maxValidator=function(e){return null==e||e<=t},message:r,type:"max",max:t})}return this},p.prototype.enum=function(t,e){return this.enumValidator&&(this.validators=this.validators.filter((function(t){return t.validator!==this.enumValidator}),this)),Array.isArray(t)||(t=c.isObject(t)?c.object.vals(t):Array.prototype.slice.call(arguments),e=o.messages.Number.enum),e=null==e?o.messages.Number.enum:e,this.enumValidator=function(e){return null==e||-1!==t.indexOf(e)},this.validators.push({validator:this.enumValidator,message:e,type:"enum",enumValues:t}),this},p.prototype.cast=function(t,o,i){if(s._isRef(this,t,o,i)){if(null==t)return t;if(n||(n=r(6)),t instanceof n)return t.$__.wasPopulated=!0,t;if("number"==typeof t)return t;if(e.isBuffer(t)||!c.isObject(t))throw new f("Number",t,this.path,null,this);var a=o.$__fullPath(this.path),u=new((o.ownerDocument?o.ownerDocument():o).populated(a,!0).options[l])(t);return u.$__.wasPopulated=!0,u}var h,y=t&&void 0!==t._id?t._id:t;h="function"==typeof this._castFunction?this._castFunction:"function"==typeof this.constructor.cast?this.constructor.cast():p.cast();try{return h(y)}catch(t){throw new f("Number",y,this.path,t,this)}},p.prototype.$conditionalHandlers=c.options(s.prototype.$conditionalHandlers,{$bitsAllClear:u,$bitsAnyClear:u,$bitsAllSet:u,$bitsAnySet:u,$gt:h,$gte:h,$lt:h,$lte:h,$mod:function(t){var e=this;return Array.isArray(t)?t.map((function(t){return e.cast(t)})):[this.cast(t)]}}),p.prototype.castForQuery=function(t,e){var r;if(2===arguments.length){if(!(r=this.$conditionalHandlers[t]))throw new f("number",e,this.path,null,this);return r.call(this,e)}return e=this._castForQuery(t)},
/*!
 * Module exports.
 */
t.exports=p}).call(this,r(1).Buffer)},function(t,e,r){"use strict";(function(e){
/*!
 * Module requirements.
 */
var n=r(12);
/*!
 * ignore
 */
/*!
 * ignore
 */
function o(t,e){var r=Number(e);if(isNaN(r))throw new n("number",e,t);return r}t.exports=function(t){var r=this;return Array.isArray(t)?t.map((function(t){return o(r.path,t)})):e.isBuffer(t)?t:o(r.path,t)}}).call(this,r(1).Buffer)},function(t,e,r){"use strict";var n=new Set(["$ref","$id","$db"]);t.exports=function(t){return t.startsWith("$")&&!n.has(t)}},function(t,e,r){"use strict";
/*!
 * Module requirements.
 */var n=r(33).castArraysOfNumbers,o=r(33).castToNumber;function i(t,e){switch(t.$geometry.type){case"Polygon":case"LineString":case"Point":n(t.$geometry.coordinates,e)}return s(e,t),t}function s(t,e){e.$maxDistance&&(e.$maxDistance=o.call(t,e.$maxDistance)),e.$minDistance&&(e.$minDistance=o.call(t,e.$minDistance))}
/*!
 * ignore
 */
e.cast$geoIntersects=function(t){if(!t.$geometry)return;return i(t,this),t},e.cast$near=function(t){var e=r(55);if(Array.isArray(t))return n(t,this),t;if(s(this,t),t&&t.$geometry)return i(t,this);if(!Array.isArray(t))throw new TypeError("$near must be either an array or an object with a $geometry property");return e.prototype.castForQuery.call(this,t)},e.cast$within=function(t){var e=this;if(s(this,t),t.$box||t.$polygon){var r=t.$box?"$box":"$polygon";t[r].forEach((function(t){if(!Array.isArray(t))throw new TypeError("Invalid $within $box argument. Expected an array, received "+t);t.forEach((function(r,n){t[n]=o.call(e,r)}))}))}else if(t.$center||t.$centerSphere){var n=t.$center?"$center":"$centerSphere";t[n].forEach((function(r,i){Array.isArray(r)?r.forEach((function(t,n){r[n]=o.call(e,t)})):t[n][i]=o.call(e,r)}))}else t.$geometry&&i(t,this);return t}},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */var n=r(83),o=r(6),i=r(0).arrayAtomicsSymbol,s=r(0).arrayParentSymbol,a=r(0).arrayPathSymbol,u=r(0).arraySchemaSymbol,c=Array.prototype.push;
/*!
 * Module exports.
 */
t.exports=function(t,e,r,l){var f=new n;if(f[i]={},Array.isArray(t)){for(var p=t.length,h=0;h<p;++h)c.call(f,t[h]);null!=t[i]&&(f[i]=t[i])}return f[a]=e,f[u]=void 0,r&&r instanceof o&&(f[s]=r,f[u]=l||r.schema.path(e)),f}},function(t,e,r){"use strict";(function(e){function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return i(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return i(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,a=!0,u=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return a=t.done,t},e:function(t){u=!0,s=t},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw s}}}}function i(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function s(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function a(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function u(t,e,r){return(u="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,r){var n=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=y(t)););return t}(t,e);if(n){var o=Object.getOwnPropertyDescriptor(n,e);return o.get?o.get.call(r):o.value}})(t,e,r||t)}function c(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function l(t){var e="function"==typeof Map?new Map:void 0;return(l=function(t){if(null===t||(r=t,-1===Function.toString.call(r).indexOf("[native code]")))return t;var r;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,n)}function n(){return f(t,arguments,y(this).constructor)}return n.prototype=Object.create(t.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),h(n,t)})(t)}function f(t,e,r){return(f=p()?Reflect.construct:function(t,e,r){var n=[null];n.push.apply(n,e);var o=new(Function.bind.apply(t,n));return r&&h(o,r.prototype),o}).apply(null,arguments)}function p(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}function h(t,e){return(h=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function y(t){return(y=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var d=r(6),_=r(26),m=r(14),v=r(13),g=r(84),b=r(3),w=r(17).internalToObjectOptions,O=r(2),S=r(4),A=r(0).arrayAtomicsSymbol,E=r(0).arrayParentSymbol,j=r(0).arrayPathSymbol,$=r(0).arraySchemaSymbol,P=r(0).populateModelSymbol,x=Symbol("mongoose#Array#sliced"),N=Array.prototype.push,T=Symbol("mongoose#MongooseCoreArray#validators"),k=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&h(t,e)}(S,t);var r,n,o,i,l,f=(r=S,n=p(),function(){var t,e=y(r);if(n){var o=y(this).constructor;t=Reflect.construct(e,arguments,o)}else t=e.apply(this,arguments);return c(this,t)});function S(){return s(this,S),f.apply(this,arguments)}return o=S,(i=[{key:"$__getAtomics",value:function(){var t=[],e=Object.keys(this[A]||{}),r=e.length,n=Object.assign({},w,{_isNested:!0});if(0===r)return t[0]=["$set",this.toObject(n)],t;for(;r--;){var o=e[r],i=this[A][o];O.isMongooseObject(i)?i=i.toObject(n):Array.isArray(i)?i=this.toObject.call(i,n):null!=i&&Array.isArray(i.$each)?i.$each=this.toObject.call(i.$each,n):null!=i&&"function"==typeof i.valueOf&&(i=i.valueOf()),"$addToSet"===o&&(i={$each:i}),t.push([o,i])}return t}
/*!
     * ignore
     */},{key:"$atomics",value:function(){return this[A]}
/*!
     * ignore
     */},{key:"$parent",value:function(){return this[E]}
/*!
     * ignore
     */},{key:"$path",value:function(){return this[j]}},{key:"$shift",value:function(){if(this._registerAtomic("$pop",-1),this._markModified(),!this._shifted)return this._shifted=!0,[].shift.call(this)}},{key:"$pop",value:function(){if(this._registerAtomic("$pop",1),this._markModified(),!this._popped)return this._popped=!0,[].pop.call(this)}
/*!
     * ignore
     */},{key:"$schema",value:function(){return this[$]}},{key:"_cast",value:function(t){var r,n=!1;return this[E]&&(n=this[E].populated(this[j],!0)),n&&null!=t?(r=n.options[P],(e.isBuffer(t)||t instanceof v||!O.isObject(t))&&(t={_id:t}),t.schema&&t.schema.discriminatorMapping&&void 0!==t.schema.discriminatorMapping.key||(t=new r(t)),this[$].caster.applySetters(t,this[E],!0)):this[$].caster.applySetters(t,this[E],!1)}},{key:"_mapCast",value:function(t,e){return this._cast(t,this.length+e)}},{key:"_markModified",value:function(t,e){var r,n=this[E];if(n){if(r=this[j],arguments.length&&(r=null!=e?r+"."+this.indexOf(t)+"."+e:r+"."+t),null!=r&&r.endsWith(".$"))return this;n.markModified(r,arguments.length>0?t:n)}return this}},{key:"_registerAtomic",value:function(t,e){if(!this[x]){if("$set"===t)return this[A]={$set:e},g(this[E],this[j]),this._markModified(),this;var r,n=this[A];if("$pop"===t&&!("$pop"in n)){var o=this;this[E].once("save",(function(){o._popped=o._shifted=null}))}if(this[A].$set||Object.keys(n).length&&!(t in n))return this[A]={$set:this},this;if("$pullAll"===t||"$addToSet"===t)n[t]||(n[t]=[]),n[t]=n[t].concat(e);else if("$pullDocs"===t){var i=n.$pull||(n.$pull={});e[0]instanceof _?(r=i.$or||(i.$or=[]),Array.prototype.push.apply(r,e.map((function(t){return t.toObject({transform:!1,virtuals:!1})})))):(r=i._id||(i._id={$in:[]})).$in=r.$in.concat(e)}else"$push"===t?(n.$push=n.$push||{$each:[]},null!=e&&O.hasUserDefinedProperty(e,"$each")?n.$push=e:n.$push.$each=n.$push.$each.concat(e)):n[t]=e;return this}}},{key:"addToSet",value:function(){C(this,arguments);var t=[].map.call(arguments,this._mapCast,this);t=this[$].applySetters(t,this[E]);var e=[],r="";return t[0]instanceof _?r="doc":t[0]instanceof Date&&(r="date"),t.forEach((function(t){var n,o=+t;switch(r){case"doc":n=this.some((function(e){return e.equals(t)}));break;case"date":n=this.some((function(t){return+t===o}));break;default:n=~this.indexOf(t)}n||([].push.call(this,t),this._registerAtomic("$addToSet",t),this._markModified(),[].push.call(e,t))}),this),e}},{key:"hasAtomics",value:function(){return O.isPOJO(this[A])?Object.keys(this[A]).length:0}},{key:"includes",value:function(t,e){return-1!==this.indexOf(t,e)}},{key:"indexOf",value:function(t,e){t instanceof v&&(t=t.toString()),e=null==e?0:e;for(var r=this.length,n=e;n<r;++n)if(t==this[n])return n;return-1}},{key:"inspect",value:function(){return JSON.stringify(this)}},{key:"nonAtomicPush",value:function(){var t=[].map.call(arguments,this._mapCast,this),e=[].push.apply(this,t);return this._registerAtomic("$set",this),this._markModified(),e}},{key:"pop",value:function(){var t=[].pop.call(this);return this._registerAtomic("$set",this),this._markModified(),t}},{key:"pull",value:function(){for(var t,e=[].map.call(arguments,this._cast,this),r=this[E].get(this[j]),n=r.length;n--;)if((t=r[n])instanceof d){var o=e.some((function(e){return t.equals(e)}));o&&[].splice.call(r,n,1)}else~r.indexOf.call(e,t)&&[].splice.call(r,n,1);return e[0]instanceof _?this._registerAtomic("$pullDocs",e.map((function(t){return t.$__getValue("_id")||t}))):this._registerAtomic("$pullAll",e),this._markModified(),g(this[E],this[j])>0&&this._registerAtomic("$set",this),this}},{key:"push",value:function(){var t=arguments,e=t,r=null!=t[0]&&O.hasUserDefinedProperty(t[0],"$each");if(r&&(e=t[0],t=t[0].$each),null==this[$])return N.apply(this,t);C(this,t);var n,o=this[E];t=[].map.call(t,this._mapCast,this),t=this[$].applySetters(t,o,void 0,void 0,{skipDocumentArrayCast:!0});var i=this[A];if(r){if(e.$each=t,b(i,"$push.$each.length",0)>0&&i.$push.$position!=i.$position)throw new m("Cannot call `Array#push()` multiple times with different `$position`");null!=e.$position?([].splice.apply(this,[e.$position,0].concat(t)),n=this.length):n=[].push.apply(this,t)}else{if(b(i,"$push.$each.length",0)>0&&null!=i.$push.$position)throw new m("Cannot call `Array#push()` multiple times with different `$position`");e=t,n=[].push.apply(this,t)}return this._registerAtomic("$push",e),this._markModified(),n}},{key:"remove",value:function(){return this.pull.apply(this,arguments)}},{key:"set",value:function(t,e){var r=this._cast(e,t);return this[t]=r,this._markModified(t),this}},{key:"shift",value:function(){var t=[].shift.call(this);return this._registerAtomic("$set",this),this._markModified(),t}},{key:"sort",value:function(){var t=[].sort.apply(this,arguments);return this._registerAtomic("$set",this),t}},{key:"splice",value:function(){var t;if(C(this,Array.prototype.slice.call(arguments,2)),arguments.length){var e;if(null==this[$])e=arguments;else{e=[];for(var r=0;r<arguments.length;++r)e[r]=r<2?arguments[r]:this._cast(arguments[r],arguments[0]+(r-2))}t=[].splice.apply(this,e),this._registerAtomic("$set",this)}return t}
/*!
     * ignore
     */},{key:"slice",value:function(){var t=u(y(S.prototype),"slice",this).apply(this,arguments);return t[E]=this[E],t[$]=this[$],t[A]=this[A],t[j]=this[j],t[x]=!0,t}
/*!
     * ignore
     */},{key:"filter",value:function(){var t=u(y(S.prototype),"filter",this).apply(this,arguments);return t[E]=this[E],t[$]=this[$],t[A]=this[A],t[j]=this[j],t}
/*!
     * ignore
     */},{key:"toBSON",value:function(){return this.toObject(w)}},{key:"toObject",value:function(t){return t&&t.depopulate?((t=O.clone(t))._isNested=!0,[].concat(this).map((function(e){return e instanceof d?e.toObject(t):e}))):[].concat(this)}},{key:"unshift",value:function(){var t;return C(this,arguments),null==this[$]?t=arguments:(t=[].map.call(arguments,this._cast,this),t=this[$].applySetters(t,this[E])),[].unshift.apply(this,t),this._registerAtomic("$set",this),this._markModified(),this.length}},{key:"isMongooseArray",get:function(){return!0}},{key:"validators",get:function(){return this[T]},set:function(t){this[T]=t}}])&&a(o.prototype,i),l&&a(o,l),S}(l(Array));
/*!
 * ignore
 */
function C(t,e){var r,n,i,s=null==t?null:b(t[$],"caster.options.ref",null);0===t.length&&e.length>0&&
/*!
 * ignore
 */
function(t,e){if(!e)return!1;var r,n=o(t);try{for(n.s();!(r=n.n()).done;){var i=r.value;if(null==i)return!1;var s=i.constructor;if(!(i instanceof d)||s.modelName!==e&&s.baseModelName!==e)return!1}}catch(t){n.e(t)}finally{n.f()}return!0}(e,s)&&t[E].populated(t[j],[],(r={},n=P,i=e[0].constructor,n in r?Object.defineProperty(r,n,{value:i,enumerable:!0,configurable:!0,writable:!0}):r[n]=i,r))}S.inspect.custom&&(k.prototype[S.inspect.custom]=k.prototype.inspect),t.exports=k}).call(this,r(1).Buffer)},function(t,e,r){"use strict";
/*!
 * ignore
 */t.exports=function(t,e,r){var n=(r=r||{}).skipDocArrays,o=0;if(!t)return o;for(var i=0,s=Object.keys(t.$__.activePaths.states.modify);i<s.length;i++){var a=s[i];if(n){var u=t.schema.path(a);if(u&&u.$isMongooseDocumentArray)continue}a.startsWith(e+".")&&(delete t.$__.activePaths.states.modify[a],++o)}return o}},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */var n=r(15).get().Binary,o=r(2),i=r(63).Buffer;function s(t,e,r){var n,a,c,l,f,p=arguments.length;return n=0===p||null==arguments[0]?0:t,Array.isArray(e)?(c=e[0],l=e[1]):a=e,f="number"==typeof n||n instanceof Number?i.alloc(n):i.from(n,a,r),o.decorate(f,s.mixin),f.isMongooseBuffer=!0,f[s.pathSymbol]=c,f[u]=l,f._subtype=0,f}var a=Symbol.for("mongoose#Buffer#_path"),u=Symbol.for("mongoose#Buffer#_parent");s.pathSymbol=a,
/*!
 * Inherit from Buffer.
 */
s.mixin={_subtype:void 0,_markModified:function(){var t=this[u];return t&&t.markModified(this[s.pathSymbol]),this},write:function(){var t=i.prototype.write.apply(this,arguments);return t>0&&this._markModified(),t},copy:function(t){var e=i.prototype.copy.apply(this,arguments);return t&&t.isMongooseBuffer&&t._markModified(),e}},
/*!
 * Compile other Buffer methods marking this buffer as modified.
 */
"writeUInt8 writeUInt16 writeUInt32 writeInt8 writeInt16 writeInt32 writeFloat writeDouble fill utf8Write binaryWrite asciiWrite set writeUInt16LE writeUInt16BE writeUInt32LE writeUInt32BE writeInt16LE writeInt16BE writeInt32LE writeInt32BE writeFloatLE writeFloatBE writeDoubleLE writeDoubleBE".split(" ").forEach((function(t){i.prototype[t]&&(s.mixin[t]=function(){var e=i.prototype[t].apply(this,arguments);return this._markModified(),e})})),s.mixin.toObject=function(t){var e="number"==typeof t?t:this._subtype||0;return new n(i.from(this),e)},s.mixin.toBSON=function(){return new n(this,this._subtype||0)},s.mixin.equals=function(t){if(!i.isBuffer(t))return!1;if(this.length!==t.length)return!1;for(var e=0;e<this.length;++e)if(this[e]!==t[e])return!1;return!0},s.mixin.subtype=function(t){if("number"!=typeof t)throw new TypeError("Invalid subtype. Expected a number");this._subtype!==t&&this._markModified(),this._subtype=t},
/*!
 * Module exports.
 */
s.Binary=n,t.exports=s},function(t,e,r){"use strict";var n=r(15).get().ObjectId,o=r(22);t.exports=function(t){if(null==t)return t;if(t instanceof n)return t;if(t._id){if(t._id instanceof n)return t._id;if(t._id.toString instanceof Function)return new n(t._id.toString())}if(t.toString instanceof Function)return new n(t.toString());o.ok(!1)}},function(t,e,r){"use strict";function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return i(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return i(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,a=!0,u=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return a=t.done,t},e:function(t){u=!0,s=t},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw s}}}}function i(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function s(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function a(t,e,r){return(a="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,r){var n=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=h(t)););return t}(t,e);if(n){var o=Object.getOwnPropertyDescriptor(n,e);return o.get?o.get.call(r):o.value}})(t,e,r||t)}function u(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function c(t){var e="function"==typeof Map?new Map:void 0;return(c=function(t){if(null===t||(r=t,-1===Function.toString.call(r).indexOf("[native code]")))return t;var r;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,n)}function n(){return l(t,arguments,h(this).constructor)}return n.prototype=Object.create(t.prototype,{constructor:{value:n,enumerable:!1,writable:!0,configurable:!0}}),p(n,t)})(t)}function l(t,e,r){return(l=f()?Reflect.construct:function(t,e,r){var n=[null];n.push.apply(n,e);var o=new(Function.bind.apply(t,n));return r&&p(o,r.prototype),o}).apply(null,arguments)}function f(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}function p(t,e){return(p=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function h(t){return(h=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var y=r(25),d=r(2).deepEqual,_=r(3),m=r(88),v=r(4),g=r(47),b=r(0).populateModelSymbol,w=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&p(t,e)}(v,t);var e,r,n,i,c,l=(e=v,r=f(),function(){var t,n=h(e);if(r){var o=h(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return u(this,t)});function v(t,e,r,n){var o;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,v),null!=t&&"Object"===t.constructor.name&&(t=Object.keys(t).reduce((function(e,r){return e.concat([[r,t[r]]])}),[])),(o=l.call(this,t)).$__parent=null!=r&&null!=r.$__?r:null,o.$__path=e,o.$__schemaType=null==n?new y(e):n,o.$__runDeferred(),o}return n=v,(i=[{key:"$init",value:function(t,e){O(t),a(h(v.prototype),"set",this).call(this,t,e),null!=e&&e.$isSingleNested&&(e.$basePath=this.$__path+"."+t)}},{key:"$__set",value:function(t,e){a(h(v.prototype),"set",this).call(this,t,e)}},{key:"get",value:function(t,e){return!1===(e=e||{}).getters?a(h(v.prototype),"get",this).call(this,t):this.$__schemaType.applyGetters(a(h(v.prototype),"get",this).call(this,t),this.$__parent)}},{key:"set",value:function(t,e){if(O(t),e=m(e),null==this.$__schemaType)return this.$__deferred=this.$__deferred||[],void this.$__deferred.push({key:t,value:e});var r=this.$__path+"."+t,n=null!=this.$__parent&&this.$__parent.$__?this.$__parent.populated(r)||this.$__parent.populated(this.$__path):null,o=this.get(t);if(null!=n)null==e.$__&&(e=new n.options[b](e)),e.$__.wasPopulated=!0;else try{e=this.$__schemaType.applySetters(e,this.$__parent,!1,this.get(t))}catch(t){if(null!=this.$__parent&&null!=this.$__parent.$__)return void this.$__parent.invalidate(r,t);throw t}a(h(v.prototype),"set",this).call(this,t,e),null!=e&&e.$isSingleNested&&(e.$basePath=this.$__path+"."+t);var i=this.$__parent;null==i||null==i.$__||d(e,o)||i.markModified(this.$__path+"."+t)}},{key:"clear",value:function(){a(h(v.prototype),"clear",this).call(this);var t=this.$__parent;null!=t&&t.markModified(this.$__path)}},{key:"delete",value:function(t){this.set(t,void 0),a(h(v.prototype),"delete",this).call(this,t)}},{key:"toBSON",value:function(){return new Map(this)}},{key:"toObject",value:function(t){if(_(t,"flattenMaps")){var e,r={},n=o(this.keys());try{for(n.s();!(e=n.n()).done;){var i=e.value;r[i]=this.get(i)}}catch(t){n.e(t)}finally{n.f()}return r}return new Map(this)}},{key:"toJSON",value:function(){var t,e={},r=o(this.keys());try{for(r.s();!(t=r.n()).done;){var n=t.value;e[n]=this.get(n)}}catch(t){r.e(t)}finally{r.f()}return e}},{key:"inspect",value:function(){return new Map(this)}},{key:"$__runDeferred",value:function(){if(this.$__deferred){var t,e=o(this.$__deferred);try{for(e.s();!(t=e.n()).done;){var r=t.value;this.set(r.key,r.value)}}catch(t){e.e(t)}finally{e.f()}this.$__deferred=null}}}])&&s(n.prototype,i),c&&s(n,c),v}(c(Map));
/*!
 * Since maps are stored as objects under the hood, keys must be strings
 * and can't contain any invalid characters
 */
function O(t){var e=n(t);if("string"!==e)throw new TypeError("Mongoose maps only support string keys, got ".concat(e));if(t.startsWith("$"))throw new Error('Mongoose maps do not support keys that start with "$", got "'.concat(t,'"'));if(t.includes("."))throw new Error('Mongoose maps do not support keys that contain ".", got "'.concat(t,'"'));if(g.has(t))throw new Error('Mongoose maps do not support reserved key name "'.concat(t,'"'))}v.inspect.custom&&Object.defineProperty(w.prototype,v.inspect.custom,{enumerable:!1,writable:!1,configurable:!1,value:w.prototype.inspect}),Object.defineProperty(w.prototype,"$__set",{enumerable:!1,writable:!0,configurable:!1}),Object.defineProperty(w.prototype,"$__parent",{enumerable:!1,writable:!0,configurable:!1}),Object.defineProperty(w.prototype,"$__path",{enumerable:!1,writable:!0,configurable:!1}),Object.defineProperty(w.prototype,"$__schemaType",{enumerable:!1,writable:!0,configurable:!1}),Object.defineProperty(w.prototype,"$isMongooseMap",{enumerable:!1,writable:!1,configurable:!1,value:!0}),Object.defineProperty(w.prototype,"$__deferredCalls",{enumerable:!1,writable:!1,configurable:!1,value:!0}),t.exports=w},function(t,e,r){"use strict";var n=r(2);t.exports=function(t){return n.isPOJO(t)&&null!=t.$__&&null!=t._doc?t._doc:t}},function(t,e,r){"use strict";function n(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return o(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return o(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,i=function(){};return{s:i,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,a=!0,u=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return a=t.done,t},e:function(t){u=!0,s=t},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw s}}}}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}var i=r(6),s=r(50),a=r(17).internalToObjectOptions,u=r(24),c=r(0).documentArrayParent;function l(t,e,r,o,s){var a=this;this.$isSingleNested=!0;var u=null!=s&&s.priorDoc,c=null;if(u&&(this._doc=Object.assign({},s.priorDoc._doc),delete this._doc[this.schema.options.discriminatorKey],c=Object.keys(s.priorDoc._doc||{}).filter((function(t){return t!==a.schema.options.discriminatorKey}))),null!=r&&(s=Object.assign({},s,{isNew:r.isNew,defaults:r.$__.$options.defaults})),i.call(this,t,e,o,s),u){var l,f=n(c);try{for(f.s();!(l=f.n()).done;){var p=l.value;if(!this.$__.activePaths.states.modify[p]&&!this.$__.activePaths.states.default[p]&&!this.$__.$setCalled.has(p)){var h=this.schema.path(p),y=null==h?void 0:h.getDefault(this);void 0===y?delete this._doc[p]:(this._doc[p]=y,this.$__.activePaths.default(p))}}}catch(t){f.e(t)}finally{f.f()}delete s.priorDoc,delete this.$__.$options.priorDoc}}t.exports=l,l.prototype=Object.create(i.prototype),l.prototype.toBSON=function(){return this.toObject(a)},l.prototype.save=function(t,e){var r=this;return"function"==typeof t&&(e=t,t={}),(t=t||{}).suppressWarning||console.warn("mongoose: calling `save()` on a subdoc does **not** save the document to MongoDB, it only runs save middleware. Use `subdoc.save({ suppressWarning: true })` to hide this warning if you're sure this behavior is right for your app."),u(e,(function(t){r.$__save(t)}))},l.prototype.$__save=function(t){var e=this;return s((function(){return t(null,e)}))},l.prototype.$isValid=function(t){return this.$__parent&&this.$basePath?this.$__parent.$isValid([this.$basePath,t].join(".")):i.prototype.$isValid.call(this,t)},l.prototype.markModified=function(t){if(i.prototype.markModified.call(this,t),this.$__parent&&this.$basePath){if(this.$__parent.isDirectModified(this.$basePath))return;this.$__parent.markModified([this.$basePath,t].join("."),this)}},l.prototype.isModified=function(t,e){var r=this;return this.$__parent&&this.$basePath?Array.isArray(t)||"string"==typeof t?(t=(t=Array.isArray(t)?t:t.split(" ")).map((function(t){return[r.$basePath,t].join(".")})),this.$__parent.isModified(t,e)):this.$__parent.isModified(this.$basePath):i.prototype.isModified.call(this,t,e)},l.prototype.$markValid=function(t){i.prototype.$markValid.call(this,t),this.$__parent&&this.$basePath&&this.$__parent.$markValid([this.$basePath,t].join("."))},
/*!
 * ignore
 */
l.prototype.invalidate=function(t,e,r){if(e!==this.ownerDocument().$__.validationError&&i.prototype.invalidate.call(this,t,e,r),this.$__parent&&this.$basePath)this.$__parent.invalidate([this.$basePath,t].join("."),e,r);else if("cast"===e.kind||"CastError"===e.name)throw e;return this.ownerDocument().$__.validationError},
/*!
 * ignore
 */
l.prototype.$ignore=function(t){i.prototype.$ignore.call(this,t),this.$__parent&&this.$basePath&&this.$__parent.$ignore([this.$basePath,t].join("."))},l.prototype.ownerDocument=function(){if(this.$__.ownerDocument)return this.$__.ownerDocument;var t=this.$__parent;if(!t)return this;for(;t.$__parent||t[c];)t=t.$__parent||t[c];return this.$__.ownerDocument=t,this.$__.ownerDocument},l.prototype.parent=function(){return this.$__parent},l.prototype.$parent=l.prototype.parent,
/*!
 * no-op for hooks
 */
l.prototype.$__remove=function(t){return t(null,this)},l.prototype.remove=function(t,e){"function"==typeof t&&(e=t,t=null),
/*!
 * Registers remove event listeners for triggering
 * on subdocuments.
 *
 * @param {Subdocument} sub
 * @api private
 */
function(t){var e=t.ownerDocument();function r(){e.removeListener("save",r),e.removeListener("remove",r),t.emit("remove",t),t.constructor.emit("remove",t),e=t=null}e.on("save",r),e.on("remove",r)}(this),t&&t.noop||this.$__parent.set(this.$basePath,null),"function"==typeof e&&e(null)},
/*!
 * ignore
 */
l.prototype.populate=function(){throw new Error('Mongoose does not support calling populate() on nested docs. Instead of `doc.nested.populate("path")`, use `doc.populate("nested.path")`')}},function(t,e,r){"use strict";function n(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return o(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return o(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,i=function(){};return{s:i,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,a=!0,u=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return a=t.done,t},e:function(t){u=!0,s=t},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw s}}}}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}var i=r(25),s=r(57).defineKey,a=r(3),u=r(2),c={toJSON:!0,toObject:!0,_id:!0,id:!0};
/*!
 * ignore
 */
t.exports=function(t,e,r,o,l){if(!r||!r.instanceOfSchema)throw new Error("You must pass a valid discriminator Schema");if(t.schema.discriminatorMapping&&!t.schema.discriminatorMapping.isRoot)throw new Error('Discriminator "'+e+'" can only be a discriminator of the root model');if(l){var f=a(t.base,"options.applyPluginsToDiscriminators",!1);t.base._applyPlugins(r,{skipTopLevel:!f})}var p=t.schema.options.discriminatorKey,h=t.schema.path(p);if(null!=h)u.hasUserDefinedProperty(h.options,"select")||(h.options.select=!0),h.options.$skipDiscriminatorCheck=!0;else{var y={};y[p]={default:void 0,select:!0,$skipDiscriminatorCheck:!0},y[p][t.schema.options.typeKey]=String,t.schema.add(y),s(p,null,t.prototype,null,[p],t.schema.options)}if(r.path(p)&&!0!==r.path(p).options.$skipDiscriminatorCheck)throw new Error('Discriminator "'+e+'" cannot have field with name "'+p+'"');var d=e;if("string"==typeof o&&o.length&&(d=o),function(e,r){e._baseSchema=r,r.paths._id&&r.paths._id.options&&!r.paths._id.options.auto&&e.remove("_id");for(var o=[],s=0,a=Object.keys(r.paths);s<a.length;s++){var l=a[s];if(e.nested[l])o.push(l);else if(-1!==l.indexOf(".")){var f,y="",_=n(l.split(".").slice(0,-1));try{for(_.s();!(f=_.n()).done;){var m=f.value;y+=(y.length?".":"")+m,(e.paths[y]instanceof i||e.singleNestedPaths[y]instanceof i)&&o.push(l)}}catch(t){_.e(t)}finally{_.f()}}}u.merge(e,r,{isDiscriminatorSchemaMerge:!0,omit:{discriminators:!0,base:!0},omitNested:o.reduce((function(t,e){return t["tree."+e]=!0,t}),{})});for(var v=0,g=o;v<g.length;v++){var b=g[v];delete e.paths[b]}e.childSchemas.forEach((function(t){t.model.prototype.$__setSchema(t.schema)}));var w={};w[p]={default:d,select:!0,set:function(t){if(t===d)return d;throw new Error("Can't set discriminator key \""+p+'"')},$skipDiscriminatorCheck:!0},w[p][e.options.typeKey]=h?h.instance:String,e.add(w),e.discriminatorMapping={key:p,value:d,isRoot:!1},r.options.collection&&(e.options.collection=r.options.collection);var O=e.options.toJSON,S=e.options.toObject,A=e.options._id,E=e.options.id,j=Object.keys(e.options);e.options.discriminatorKey=r.options.discriminatorKey;for(var $=0,P=j;$<P.length;$++){var x=P[$];if(!c[x]){if("pluralization"===x&&1==e.options[x]&&null==r.options[x])continue;if(!u.deepEqual(e.options[x],r.options[x]))throw new Error("Can't customize discriminator option "+x+" (can only modify "+Object.keys(c).join(", ")+")")}}e.options=u.clone(r.options),O&&(e.options.toJSON=O),S&&(e.options.toObject=S),void 0!==A&&(e.options._id=A),e.options.id=E,e.s.hooks=t.schema.s.hooks.merge(e.s.hooks),e.plugins=Array.prototype.slice.call(r.plugins),e.callQueue=r.callQueue.concat(e.callQueue),delete e._requiredpaths}(r,t.schema),t.discriminators||(t.discriminators={}),t.schema.discriminatorMapping||(t.schema.discriminatorMapping={key:p,value:null,isRoot:!0}),t.schema.discriminators||(t.schema.discriminators={}),t.schema.discriminators[e]=r,t.discriminators[e])throw new Error('Discriminator with name "'+e+'" already exists');return r}},function(t,e,r){"use strict";var n=r(74);t.exports=function(t,e){return null==e||null==e._id||(t=t.clone(),e._id?t.paths._id||(n(t),t.options._id=!0):(t.remove("_id"),t.options._id=!1)),t}},function(t,e,r){"use strict";var n=r(34);
/*!
 * Find the correct constructor, taking into account discriminators
 */t.exports=function(t,e){var r=t.schema.options.discriminatorKey;if(null!=e&&t.discriminators&&null!=e[r])if(t.discriminators[e[r]])t=t.discriminators[e[r]];else{var o=n(t,e[r]);o&&(t=o)}return t}},function(t,e,r){"use strict";t.exports=r(94)},function(t,e,r){"use strict";(function(n){function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function s(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=u(t);if(e){var o=u(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return a(this,r)}}function a(t,e){return!e||"object"!==o(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function u(t){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}r(15).set(r(98));var c=r(61),l=r(67);c.setBrowser(!0),Object.defineProperty(e,"Promise",{get:function(){return l.get()},set:function(t){l.set(t)}}),e.PromiseProvider=l,e.Error=r(5),e.Schema=r(52),e.Types=r(56),e.VirtualType=r(53),e.SchemaType=r(7),e.utils=r(2),e.Document=c(),e.model=function(t,r){var n=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}(n,t);var e=s(n);function n(t,o){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,n),e.call(this,t,r,o)}return n}(e.Document);return n.modelName=t,n},
/*!
 * Module exports.
 */
"undefined"!=typeof window&&(window.mongoose=t.exports,window.Buffer=n)}).call(this,r(1).Buffer)},function(t,e,r){"use strict";e.byteLength=function(t){var e=c(t),r=e[0],n=e[1];return 3*(r+n)/4-n},e.toByteArray=function(t){var e,r,n=c(t),s=n[0],a=n[1],u=new i(function(t,e,r){return 3*(e+r)/4-r}(0,s,a)),l=0,f=a>0?s-4:s;for(r=0;r<f;r+=4)e=o[t.charCodeAt(r)]<<18|o[t.charCodeAt(r+1)]<<12|o[t.charCodeAt(r+2)]<<6|o[t.charCodeAt(r+3)],u[l++]=e>>16&255,u[l++]=e>>8&255,u[l++]=255&e;2===a&&(e=o[t.charCodeAt(r)]<<2|o[t.charCodeAt(r+1)]>>4,u[l++]=255&e);1===a&&(e=o[t.charCodeAt(r)]<<10|o[t.charCodeAt(r+1)]<<4|o[t.charCodeAt(r+2)]>>2,u[l++]=e>>8&255,u[l++]=255&e);return u},e.fromByteArray=function(t){for(var e,r=t.length,o=r%3,i=[],s=0,a=r-o;s<a;s+=16383)i.push(l(t,s,s+16383>a?a:s+16383));1===o?(e=t[r-1],i.push(n[e>>2]+n[e<<4&63]+"==")):2===o&&(e=(t[r-2]<<8)+t[r-1],i.push(n[e>>10]+n[e>>4&63]+n[e<<2&63]+"="));return i.join("")};for(var n=[],o=[],i="undefined"!=typeof Uint8Array?Uint8Array:Array,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=0,u=s.length;a<u;++a)n[a]=s[a],o[s.charCodeAt(a)]=a;function c(t){var e=t.length;if(e%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var r=t.indexOf("=");return-1===r&&(r=e),[r,r===e?0:4-r%4]}function l(t,e,r){for(var o,i,s=[],a=e;a<r;a+=3)o=(t[a]<<16&16711680)+(t[a+1]<<8&65280)+(255&t[a+2]),s.push(n[(i=o)>>18&63]+n[i>>12&63]+n[i>>6&63]+n[63&i]);return s.join("")}o["-".charCodeAt(0)]=62,o["_".charCodeAt(0)]=63},function(t,e){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
e.read=function(t,e,r,n,o){var i,s,a=8*o-n-1,u=(1<<a)-1,c=u>>1,l=-7,f=r?o-1:0,p=r?-1:1,h=t[e+f];for(f+=p,i=h&(1<<-l)-1,h>>=-l,l+=a;l>0;i=256*i+t[e+f],f+=p,l-=8);for(s=i&(1<<-l)-1,i>>=-l,l+=n;l>0;s=256*s+t[e+f],f+=p,l-=8);if(0===i)i=1-c;else{if(i===u)return s?NaN:1/0*(h?-1:1);s+=Math.pow(2,n),i-=c}return(h?-1:1)*s*Math.pow(2,i-n)},e.write=function(t,e,r,n,o,i){var s,a,u,c=8*i-o-1,l=(1<<c)-1,f=l>>1,p=23===o?Math.pow(2,-24)-Math.pow(2,-77):0,h=n?0:i-1,y=n?1:-1,d=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(a=isNaN(e)?1:0,s=l):(s=Math.floor(Math.log(e)/Math.LN2),e*(u=Math.pow(2,-s))<1&&(s--,u*=2),(e+=s+f>=1?p/u:p*Math.pow(2,1-f))*u>=2&&(s++,u/=2),s+f>=l?(a=0,s=l):s+f>=1?(a=(e*u-1)*Math.pow(2,o),s+=f):(a=e*Math.pow(2,f-1)*Math.pow(2,o),s=0));o>=8;t[r+h]=255&a,h+=y,a/=256,o-=8);for(s=s<<o|a,c+=o;c>0;t[r+h]=255&s,h+=y,s/=256,c-=8);t[r+h-y]|=128*d}},function(t,e){var r={}.toString;t.exports=Array.isArray||function(t){return"[object Array]"==r.call(t)}},function(t,e,r){"use strict";
/*!
 * Module exports.
 */e.Binary=r(99),e.Collection=function(){throw new Error("Cannot create a collection from browser library")},e.Decimal128=r(106),e.ObjectId=r(107),e.ReadPreference=r(108)},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */var n=r(35).Binary;
/*!
 * Module exports.
 */t.exports=n},function(t,e){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}t.exports=function(t){return t&&"object"===r(t)&&"function"==typeof t.copy&&"function"==typeof t.fill&&"function"==typeof t.readUInt8}},function(t,e){"function"==typeof Object.create?t.exports=function(t,e){t.super_=e,t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}})}:t.exports=function(t,e){t.super_=e;var r=function(){};r.prototype=e.prototype,t.prototype=new r,t.prototype.constructor=t}},function(module,exports,__webpack_require__){"use strict";var Long=__webpack_require__(23).Long,Double=__webpack_require__(36).Double,Timestamp=__webpack_require__(37).Timestamp,ObjectID=__webpack_require__(38).ObjectID,_Symbol=__webpack_require__(40).Symbol,Code=__webpack_require__(41).Code,MinKey=__webpack_require__(43).MinKey,MaxKey=__webpack_require__(44).MaxKey,Decimal128=__webpack_require__(42),Int32=__webpack_require__(60),DBRef=__webpack_require__(45).DBRef,BSONRegExp=__webpack_require__(39).BSONRegExp,Binary=__webpack_require__(27).Binary,utils=__webpack_require__(16),deserialize=function(t,e,r){var n=(e=null==e?{}:e)&&e.index?e.index:0,o=t[n]|t[n+1]<<8|t[n+2]<<16|t[n+3]<<24;if(o<5||t.length<o||o+n>t.length)throw new Error("corrupt bson message");if(0!==t[n+o-1])throw new Error("One object, sized correctly, with a spot for an EOO, but the EOO isn't 0x00");return deserializeObject(t,n,e,r)},deserializeObject=function t(e,r,n,o){var i=null!=n.evalFunctions&&n.evalFunctions,s=null!=n.cacheFunctions&&n.cacheFunctions,a=null!=n.cacheFunctionsCrc32&&n.cacheFunctionsCrc32;if(!a)var u=null;var c=null==n.fieldsAsRaw?null:n.fieldsAsRaw,l=null!=n.raw&&n.raw,f="boolean"==typeof n.bsonRegExp&&n.bsonRegExp,p=null!=n.promoteBuffers&&n.promoteBuffers,h=null==n.promoteLongs||n.promoteLongs,y=null==n.promoteValues||n.promoteValues,d=r;if(e.length<5)throw new Error("corrupt bson message < 5 bytes long");var _=e[r++]|e[r++]<<8|e[r++]<<16|e[r++]<<24;if(_<5||_>e.length)throw new Error("corrupt bson message");for(var m=o?[]:{},v=0;;){var g=e[r++];if(0===g)break;for(var b=r;0!==e[b]&&b<e.length;)b++;if(b>=e.length)throw new Error("Bad BSON Document: illegal CString");var w=o?v++:e.toString("utf8",r,b);if(r=b+1,g===BSON.BSON_DATA_STRING){var O=e[r++]|e[r++]<<8|e[r++]<<16|e[r++]<<24;if(O<=0||O>e.length-r||0!==e[r+O-1])throw new Error("bad string length in bson");m[w]=e.toString("utf8",r,r+O-1),r+=O}else if(g===BSON.BSON_DATA_OID){var S=utils.allocBuffer(12);e.copy(S,0,r,r+12),m[w]=new ObjectID(S),r+=12}else if(g===BSON.BSON_DATA_INT&&!1===y)m[w]=new Int32(e[r++]|e[r++]<<8|e[r++]<<16|e[r++]<<24);else if(g===BSON.BSON_DATA_INT)m[w]=e[r++]|e[r++]<<8|e[r++]<<16|e[r++]<<24;else if(g===BSON.BSON_DATA_NUMBER&&!1===y)m[w]=new Double(e.readDoubleLE(r)),r+=8;else if(g===BSON.BSON_DATA_NUMBER)m[w]=e.readDoubleLE(r),r+=8;else if(g===BSON.BSON_DATA_DATE){var A=e[r++]|e[r++]<<8|e[r++]<<16|e[r++]<<24,E=e[r++]|e[r++]<<8|e[r++]<<16|e[r++]<<24;m[w]=new Date(new Long(A,E).toNumber())}else if(g===BSON.BSON_DATA_BOOLEAN){if(0!==e[r]&&1!==e[r])throw new Error("illegal boolean type value");m[w]=1===e[r++]}else if(g===BSON.BSON_DATA_OBJECT){var j=r,$=e[r]|e[r+1]<<8|e[r+2]<<16|e[r+3]<<24;if($<=0||$>e.length-r)throw new Error("bad embedded document length in bson");m[w]=l?e.slice(r,r+$):t(e,j,n,!1),r+=$}else if(g===BSON.BSON_DATA_ARRAY){j=r;var P=n,x=r+($=e[r]|e[r+1]<<8|e[r+2]<<16|e[r+3]<<24);if(c&&c[w]){for(var N in P={},n)P[N]=n[N];P.raw=!0}if(m[w]=t(e,j,P,!0),0!==e[(r+=$)-1])throw new Error("invalid array terminator byte");if(r!==x)throw new Error("corrupted array bson")}else if(g===BSON.BSON_DATA_UNDEFINED)m[w]=void 0;else if(g===BSON.BSON_DATA_NULL)m[w]=null;else if(g===BSON.BSON_DATA_LONG){A=e[r++]|e[r++]<<8|e[r++]<<16|e[r++]<<24,E=e[r++]|e[r++]<<8|e[r++]<<16|e[r++]<<24;var T=new Long(A,E);m[w]=h&&!0===y&&T.lessThanOrEqual(JS_INT_MAX_LONG)&&T.greaterThanOrEqual(JS_INT_MIN_LONG)?T.toNumber():T}else if(g===BSON.BSON_DATA_DECIMAL128){var k=utils.allocBuffer(16);e.copy(k,0,r,r+16),r+=16;var C=new Decimal128(k);m[w]=C.toObject?C.toObject():C}else if(g===BSON.BSON_DATA_BINARY){var R=e[r++]|e[r++]<<8|e[r++]<<16|e[r++]<<24,D=R,B=e[r++];if(R<0)throw new Error("Negative binary type element size found");if(R>e.length)throw new Error("Binary type size larger than document size");if(null!=e.slice){if(B===Binary.SUBTYPE_BYTE_ARRAY){if((R=e[r++]|e[r++]<<8|e[r++]<<16|e[r++]<<24)<0)throw new Error("Negative binary type element size found for subtype 0x02");if(R>D-4)throw new Error("Binary type with subtype 0x02 contains to long binary size");if(R<D-4)throw new Error("Binary type with subtype 0x02 contains to short binary size")}m[w]=p&&y?e.slice(r,r+R):new Binary(e.slice(r,r+R),B)}else{var M="undefined"!=typeof Uint8Array?new Uint8Array(new ArrayBuffer(R)):new Array(R);if(B===Binary.SUBTYPE_BYTE_ARRAY){if((R=e[r++]|e[r++]<<8|e[r++]<<16|e[r++]<<24)<0)throw new Error("Negative binary type element size found for subtype 0x02");if(R>D-4)throw new Error("Binary type with subtype 0x02 contains to long binary size");if(R<D-4)throw new Error("Binary type with subtype 0x02 contains to short binary size")}for(b=0;b<R;b++)M[b]=e[r+b];m[w]=p&&y?M:new Binary(M,B)}r+=R}else if(g===BSON.BSON_DATA_REGEXP&&!1===f){for(b=r;0!==e[b]&&b<e.length;)b++;if(b>=e.length)throw new Error("Bad BSON Document: illegal CString");var I=e.toString("utf8",r,b);for(b=r=b+1;0!==e[b]&&b<e.length;)b++;if(b>=e.length)throw new Error("Bad BSON Document: illegal CString");var F=e.toString("utf8",r,b);r=b+1;var L=new Array(F.length);for(b=0;b<F.length;b++)switch(F[b]){case"m":L[b]="m";break;case"s":L[b]="g";break;case"i":L[b]="i"}m[w]=new RegExp(I,L.join(""))}else if(g===BSON.BSON_DATA_REGEXP&&!0===f){for(b=r;0!==e[b]&&b<e.length;)b++;if(b>=e.length)throw new Error("Bad BSON Document: illegal CString");for(I=e.toString("utf8",r,b),b=r=b+1;0!==e[b]&&b<e.length;)b++;if(b>=e.length)throw new Error("Bad BSON Document: illegal CString");F=e.toString("utf8",r,b),r=b+1,m[w]=new BSONRegExp(I,F)}else if(g===BSON.BSON_DATA_SYMBOL){if((O=e[r++]|e[r++]<<8|e[r++]<<16|e[r++]<<24)<=0||O>e.length-r||0!==e[r+O-1])throw new Error("bad string length in bson");m[w]=new _Symbol(e.toString("utf8",r,r+O-1)),r+=O}else if(g===BSON.BSON_DATA_TIMESTAMP)A=e[r++]|e[r++]<<8|e[r++]<<16|e[r++]<<24,E=e[r++]|e[r++]<<8|e[r++]<<16|e[r++]<<24,m[w]=new Timestamp(A,E);else if(g===BSON.BSON_DATA_MIN_KEY)m[w]=new MinKey;else if(g===BSON.BSON_DATA_MAX_KEY)m[w]=new MaxKey;else if(g===BSON.BSON_DATA_CODE){if((O=e[r++]|e[r++]<<8|e[r++]<<16|e[r++]<<24)<=0||O>e.length-r||0!==e[r+O-1])throw new Error("bad string length in bson");var U=e.toString("utf8",r,r+O-1);if(i)if(s){var V=a?u(U):U;m[w]=isolateEvalWithHash(functionCache,V,U,m)}else m[w]=isolateEval(U);else m[w]=new Code(U);r+=O}else if(g===BSON.BSON_DATA_CODE_W_SCOPE){var q=e[r++]|e[r++]<<8|e[r++]<<16|e[r++]<<24;if(q<13)throw new Error("code_w_scope total size shorter minimum expected length");if((O=e[r++]|e[r++]<<8|e[r++]<<16|e[r++]<<24)<=0||O>e.length-r||0!==e[r+O-1])throw new Error("bad string length in bson");U=e.toString("utf8",r,r+O-1),j=r+=O,$=e[r]|e[r+1]<<8|e[r+2]<<16|e[r+3]<<24;var W=t(e,j,n,!1);if(r+=$,q<8+$+O)throw new Error("code_w_scope total size is to short, truncating scope");if(q>8+$+O)throw new Error("code_w_scope total size is to long, clips outer document");i?(s?(V=a?u(U):U,m[w]=isolateEvalWithHash(functionCache,V,U,m)):m[w]=isolateEval(U),m[w].scope=W):m[w]=new Code(U,W)}else{if(g!==BSON.BSON_DATA_DBPOINTER)throw new Error("Detected unknown BSON type "+g.toString(16)+' for fieldname "'+w+'", are you using the latest BSON parser');if((O=e[r++]|e[r++]<<8|e[r++]<<16|e[r++]<<24)<=0||O>e.length-r||0!==e[r+O-1])throw new Error("bad string length in bson");var H=e.toString("utf8",r,r+O-1);r+=O;var Y=utils.allocBuffer(12);e.copy(Y,0,r,r+12),S=new ObjectID(Y),r+=12;var K=H.split("."),z=K.shift(),Q=K.join(".");m[w]=new DBRef(Q,S,z)}}if(_!==r-d){if(o)throw new Error("corrupt array bson");throw new Error("corrupt object bson")}return null!=m.$id&&(m=new DBRef(m.$ref,m.$id,m.$db)),m},isolateEvalWithHash=function isolateEvalWithHash(functionCache,hash,functionString,object){var value=null;return null==functionCache[hash]&&(eval("value = "+functionString),functionCache[hash]=value),functionCache[hash].bind(object)},isolateEval=function isolateEval(functionString){var value=null;return eval("value = "+functionString),value},BSON={},functionCache=BSON.functionCache={};BSON.BSON_DATA_NUMBER=1,BSON.BSON_DATA_STRING=2,BSON.BSON_DATA_OBJECT=3,BSON.BSON_DATA_ARRAY=4,BSON.BSON_DATA_BINARY=5,BSON.BSON_DATA_UNDEFINED=6,BSON.BSON_DATA_OID=7,BSON.BSON_DATA_BOOLEAN=8,BSON.BSON_DATA_DATE=9,BSON.BSON_DATA_NULL=10,BSON.BSON_DATA_REGEXP=11,BSON.BSON_DATA_DBPOINTER=12,BSON.BSON_DATA_CODE=13,BSON.BSON_DATA_SYMBOL=14,BSON.BSON_DATA_CODE_W_SCOPE=15,BSON.BSON_DATA_INT=16,BSON.BSON_DATA_TIMESTAMP=17,BSON.BSON_DATA_LONG=18,BSON.BSON_DATA_DECIMAL128=19,BSON.BSON_DATA_MIN_KEY=255,BSON.BSON_DATA_MAX_KEY=127,BSON.BSON_BINARY_SUBTYPE_DEFAULT=0,BSON.BSON_BINARY_SUBTYPE_FUNCTION=1,BSON.BSON_BINARY_SUBTYPE_BYTE_ARRAY=2,BSON.BSON_BINARY_SUBTYPE_UUID=3,BSON.BSON_BINARY_SUBTYPE_MD5=4,BSON.BSON_BINARY_SUBTYPE_USER_DEFINED=128,BSON.BSON_INT32_MAX=2147483647,BSON.BSON_INT32_MIN=-2147483648,BSON.BSON_INT64_MAX=Math.pow(2,63)-1,BSON.BSON_INT64_MIN=-Math.pow(2,63),BSON.JS_INT_MAX=9007199254740992,BSON.JS_INT_MIN=-9007199254740992;var JS_INT_MAX_LONG=Long.fromNumber(9007199254740992),JS_INT_MIN_LONG=Long.fromNumber(-9007199254740992);module.exports=deserialize},function(t,e,r){"use strict";(function(e){function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o=r(104).writeIEEE754,i=r(23).Long,s=r(59),a=r(27).Binary,u=r(16).normalizedFunctionString,c=/\x00/,l=["$db","$ref","$id","$clusterTime"],f=function(t){return"object"===n(t)&&"[object Date]"===Object.prototype.toString.call(t)},p=function(t){return"[object RegExp]"===Object.prototype.toString.call(t)},h=function(t,e,r,n,o){t[n++]=R.BSON_DATA_STRING;var i=o?t.write(e,n,"ascii"):t.write(e,n,"utf8");t[(n=n+i+1)-1]=0;var s=t.write(r,n+4,"utf8");return t[n+3]=s+1>>24&255,t[n+2]=s+1>>16&255,t[n+1]=s+1>>8&255,t[n]=s+1&255,n=n+4+s,t[n++]=0,n},y=function(t,e,r,n,s){if(Math.floor(r)===r&&r>=R.JS_INT_MIN&&r<=R.JS_INT_MAX)if(r>=R.BSON_INT32_MIN&&r<=R.BSON_INT32_MAX){t[n++]=R.BSON_DATA_INT;var a=s?t.write(e,n,"ascii"):t.write(e,n,"utf8");n+=a,t[n++]=0,t[n++]=255&r,t[n++]=r>>8&255,t[n++]=r>>16&255,t[n++]=r>>24&255}else if(r>=R.JS_INT_MIN&&r<=R.JS_INT_MAX)t[n++]=R.BSON_DATA_NUMBER,n+=a=s?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0,o(t,r,n,"little",52,8),n+=8;else{t[n++]=R.BSON_DATA_LONG,n+=a=s?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0;var u=i.fromNumber(r),c=u.getLowBits(),l=u.getHighBits();t[n++]=255&c,t[n++]=c>>8&255,t[n++]=c>>16&255,t[n++]=c>>24&255,t[n++]=255&l,t[n++]=l>>8&255,t[n++]=l>>16&255,t[n++]=l>>24&255}else t[n++]=R.BSON_DATA_NUMBER,n+=a=s?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0,o(t,r,n,"little",52,8),n+=8;return n},d=function(t,e,r,n,o){return t[n++]=R.BSON_DATA_NULL,n+=o?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0,n},_=function(t,e,r,n,o){return t[n++]=R.BSON_DATA_BOOLEAN,n+=o?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0,t[n++]=r?1:0,n},m=function(t,e,r,n,o){t[n++]=R.BSON_DATA_DATE,n+=o?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0;var s=i.fromNumber(r.getTime()),a=s.getLowBits(),u=s.getHighBits();return t[n++]=255&a,t[n++]=a>>8&255,t[n++]=a>>16&255,t[n++]=a>>24&255,t[n++]=255&u,t[n++]=u>>8&255,t[n++]=u>>16&255,t[n++]=u>>24&255,n},v=function(t,e,r,n,o){if(t[n++]=R.BSON_DATA_REGEXP,n+=o?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0,r.source&&null!=r.source.match(c))throw Error("value "+r.source+" must not contain null bytes");return n+=t.write(r.source,n,"utf8"),t[n++]=0,r.global&&(t[n++]=115),r.ignoreCase&&(t[n++]=105),r.multiline&&(t[n++]=109),t[n++]=0,n},g=function(t,e,r,n,o){if(t[n++]=R.BSON_DATA_REGEXP,n+=o?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0,null!=r.pattern.match(c))throw Error("pattern "+r.pattern+" must not contain null bytes");return n+=t.write(r.pattern,n,"utf8"),t[n++]=0,n+=t.write(r.options.split("").sort().join(""),n,"utf8"),t[n++]=0,n},b=function(t,e,r,n,o){return null===r?t[n++]=R.BSON_DATA_NULL:"MinKey"===r._bsontype?t[n++]=R.BSON_DATA_MIN_KEY:t[n++]=R.BSON_DATA_MAX_KEY,n+=o?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0,n},w=function(t,e,r,n,o){if(t[n++]=R.BSON_DATA_OID,n+=o?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0,"string"==typeof r.id)t.write(r.id,n,"binary");else{if(!r.id||!r.id.copy)throw new Error("object ["+JSON.stringify(r)+"] is not a valid ObjectId");r.id.copy(t,n,0,12)}return n+12},O=function(t,e,r,n,o){t[n++]=R.BSON_DATA_BINARY,n+=o?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0;var i=r.length;return t[n++]=255&i,t[n++]=i>>8&255,t[n++]=i>>16&255,t[n++]=i>>24&255,t[n++]=R.BSON_BINARY_SUBTYPE_DEFAULT,r.copy(t,n,0,i),n+=i},S=function(t,e,r,n,o,i,s,a,u,c){for(var l=0;l<c.length;l++)if(c[l]===r)throw new Error("cyclic dependency detected");c.push(r),t[n++]=Array.isArray(r)?R.BSON_DATA_ARRAY:R.BSON_DATA_OBJECT,n+=u?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0;var f=C(t,r,o,n,i+1,s,a,c);return c.pop(),f},A=function(t,e,r,n,o){return t[n++]=R.BSON_DATA_DECIMAL128,n+=o?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0,r.bytes.copy(t,n,0,16),n+16},E=function(t,e,r,n,o){t[n++]="Long"===r._bsontype?R.BSON_DATA_LONG:R.BSON_DATA_TIMESTAMP,n+=o?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0;var i=r.getLowBits(),s=r.getHighBits();return t[n++]=255&i,t[n++]=i>>8&255,t[n++]=i>>16&255,t[n++]=i>>24&255,t[n++]=255&s,t[n++]=s>>8&255,t[n++]=s>>16&255,t[n++]=s>>24&255,n},j=function(t,e,r,n,o){return t[n++]=R.BSON_DATA_INT,n+=o?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0,t[n++]=255&r,t[n++]=r>>8&255,t[n++]=r>>16&255,t[n++]=r>>24&255,n},$=function(t,e,r,n,i){return t[n++]=R.BSON_DATA_NUMBER,n+=i?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0,o(t,r,n,"little",52,8),n+=8},P=function(t,e,r,n,o,i,s){t[n++]=R.BSON_DATA_CODE,n+=s?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0;var a=u(r),c=t.write(a,n+4,"utf8")+1;return t[n]=255&c,t[n+1]=c>>8&255,t[n+2]=c>>16&255,t[n+3]=c>>24&255,n=n+4+c-1,t[n++]=0,n},x=function(t,e,r,o,i,s,a,u,c){if(r.scope&&"object"===n(r.scope)){t[o++]=R.BSON_DATA_CODE_W_SCOPE;var l=c?t.write(e,o,"ascii"):t.write(e,o,"utf8");o+=l,t[o++]=0;var f=o,p="string"==typeof r.code?r.code:r.code.toString();o+=4;var h=t.write(p,o+4,"utf8")+1;t[o]=255&h,t[o+1]=h>>8&255,t[o+2]=h>>16&255,t[o+3]=h>>24&255,t[o+4+h-1]=0,o=o+h+4;var y=C(t,r.scope,i,o,s+1,a,u);o=y-1;var d=y-f;t[f++]=255&d,t[f++]=d>>8&255,t[f++]=d>>16&255,t[f++]=d>>24&255,t[o++]=0}else{t[o++]=R.BSON_DATA_CODE,o+=l=c?t.write(e,o,"ascii"):t.write(e,o,"utf8"),t[o++]=0,p=r.code.toString();var _=t.write(p,o+4,"utf8")+1;t[o]=255&_,t[o+1]=_>>8&255,t[o+2]=_>>16&255,t[o+3]=_>>24&255,o=o+4+_-1,t[o++]=0}return o},N=function(t,e,r,n,o){t[n++]=R.BSON_DATA_BINARY,n+=o?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0;var i=r.value(!0),s=r.position;return r.sub_type===a.SUBTYPE_BYTE_ARRAY&&(s+=4),t[n++]=255&s,t[n++]=s>>8&255,t[n++]=s>>16&255,t[n++]=s>>24&255,t[n++]=r.sub_type,r.sub_type===a.SUBTYPE_BYTE_ARRAY&&(s-=4,t[n++]=255&s,t[n++]=s>>8&255,t[n++]=s>>16&255,t[n++]=s>>24&255),i.copy(t,n,0,r.position),n+=r.position},T=function(t,e,r,n,o){t[n++]=R.BSON_DATA_SYMBOL,n+=o?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0;var i=t.write(r.value,n+4,"utf8")+1;return t[n]=255&i,t[n+1]=i>>8&255,t[n+2]=i>>16&255,t[n+3]=i>>24&255,n=n+4+i-1,t[n++]=0,n},k=function(t,e,r,n,o,i,s){t[n++]=R.BSON_DATA_OBJECT,n+=s?t.write(e,n,"ascii"):t.write(e,n,"utf8"),t[n++]=0;var a,u=n,c=(a=null!=r.db?C(t,{$ref:r.namespace,$id:r.oid,$db:r.db},!1,n,o+1,i):C(t,{$ref:r.namespace,$id:r.oid},!1,n,o+1,i))-u;return t[u++]=255&c,t[u++]=c>>8&255,t[u++]=c>>16&255,t[u++]=c>>24&255,a},C=function(t,r,o,i,a,u,C,R){i=i||0,(R=R||[]).push(r);var D=i+4;if(Array.isArray(r))for(var B=0;B<r.length;B++){var M=""+B,I=r[B];if(I&&I.toBSON){if("function"!=typeof I.toBSON)throw new Error("toBSON is not a function");I=I.toBSON()}var F=n(I);if("string"===F)D=h(t,M,I,D,!0);else if("number"===F)D=y(t,M,I,D,!0);else if("boolean"===F)D=_(t,M,I,D,!0);else if(I instanceof Date||f(I))D=m(t,M,I,D,!0);else if(void 0===I)D=d(t,M,0,D,!0);else if(null===I)D=d(t,M,0,D,!0);else if("ObjectID"===I._bsontype||"ObjectId"===I._bsontype)D=w(t,M,I,D,!0);else if(e.isBuffer(I))D=O(t,M,I,D,!0);else if(I instanceof RegExp||p(I))D=v(t,M,I,D,!0);else if("object"===F&&null==I._bsontype)D=S(t,M,I,D,o,a,u,C,!0,R);else if("object"===F&&"Decimal128"===I._bsontype)D=A(t,M,I,D,!0);else if("Long"===I._bsontype||"Timestamp"===I._bsontype)D=E(t,M,I,D,!0);else if("Double"===I._bsontype)D=$(t,M,I,D,!0);else if("function"==typeof I&&u)D=P(t,M,I,D,0,0,u);else if("Code"===I._bsontype)D=x(t,M,I,D,o,a,u,C,!0);else if("Binary"===I._bsontype)D=N(t,M,I,D,!0);else if("Symbol"===I._bsontype)D=T(t,M,I,D,!0);else if("DBRef"===I._bsontype)D=k(t,M,I,D,a,u,!0);else if("BSONRegExp"===I._bsontype)D=g(t,M,I,D,!0);else if("Int32"===I._bsontype)D=j(t,M,I,D,!0);else if("MinKey"===I._bsontype||"MaxKey"===I._bsontype)D=b(t,M,I,D,!0);else if(void 0!==I._bsontype)throw new TypeError("Unrecognized or invalid _bsontype: "+I._bsontype)}else if(r instanceof s)for(var L=r.entries(),U=!1;!U;){var V=L.next();if(!(U=V.done)){if(M=V.value[0],F=n(I=V.value[1]),"string"==typeof M&&-1===l.indexOf(M)){if(null!=M.match(c))throw Error("key "+M+" must not contain null bytes");if(o){if("$"===M[0])throw Error("key "+M+" must not start with '$'");if(~M.indexOf("."))throw Error("key "+M+" must not contain '.'")}}if("string"===F)D=h(t,M,I,D);else if("number"===F)D=y(t,M,I,D);else if("boolean"===F)D=_(t,M,I,D);else if(I instanceof Date||f(I))D=m(t,M,I,D);else if(null===I||void 0===I&&!1===C)D=d(t,M,0,D);else if("ObjectID"===I._bsontype||"ObjectId"===I._bsontype)D=w(t,M,I,D);else if(e.isBuffer(I))D=O(t,M,I,D);else if(I instanceof RegExp||p(I))D=v(t,M,I,D);else if("object"===F&&null==I._bsontype)D=S(t,M,I,D,o,a,u,C,!1,R);else if("object"===F&&"Decimal128"===I._bsontype)D=A(t,M,I,D);else if("Long"===I._bsontype||"Timestamp"===I._bsontype)D=E(t,M,I,D);else if("Double"===I._bsontype)D=$(t,M,I,D);else if("Code"===I._bsontype)D=x(t,M,I,D,o,a,u,C);else if("function"==typeof I&&u)D=P(t,M,I,D,0,0,u);else if("Binary"===I._bsontype)D=N(t,M,I,D);else if("Symbol"===I._bsontype)D=T(t,M,I,D);else if("DBRef"===I._bsontype)D=k(t,M,I,D,a,u);else if("BSONRegExp"===I._bsontype)D=g(t,M,I,D);else if("Int32"===I._bsontype)D=j(t,M,I,D);else if("MinKey"===I._bsontype||"MaxKey"===I._bsontype)D=b(t,M,I,D);else if(void 0!==I._bsontype)throw new TypeError("Unrecognized or invalid _bsontype: "+I._bsontype)}}else{if(r.toBSON){if("function"!=typeof r.toBSON)throw new Error("toBSON is not a function");if(null!=(r=r.toBSON())&&"object"!==n(r))throw new Error("toBSON function did not return an object")}for(M in r){if((I=r[M])&&I.toBSON){if("function"!=typeof I.toBSON)throw new Error("toBSON is not a function");I=I.toBSON()}if(F=n(I),"string"==typeof M&&-1===l.indexOf(M)){if(null!=M.match(c))throw Error("key "+M+" must not contain null bytes");if(o){if("$"===M[0])throw Error("key "+M+" must not start with '$'");if(~M.indexOf("."))throw Error("key "+M+" must not contain '.'")}}if("string"===F)D=h(t,M,I,D);else if("number"===F)D=y(t,M,I,D);else if("boolean"===F)D=_(t,M,I,D);else if(I instanceof Date||f(I))D=m(t,M,I,D);else if(void 0===I)!1===C&&(D=d(t,M,0,D));else if(null===I)D=d(t,M,0,D);else if("ObjectID"===I._bsontype||"ObjectId"===I._bsontype)D=w(t,M,I,D);else if(e.isBuffer(I))D=O(t,M,I,D);else if(I instanceof RegExp||p(I))D=v(t,M,I,D);else if("object"===F&&null==I._bsontype)D=S(t,M,I,D,o,a,u,C,!1,R);else if("object"===F&&"Decimal128"===I._bsontype)D=A(t,M,I,D);else if("Long"===I._bsontype||"Timestamp"===I._bsontype)D=E(t,M,I,D);else if("Double"===I._bsontype)D=$(t,M,I,D);else if("Code"===I._bsontype)D=x(t,M,I,D,o,a,u,C);else if("function"==typeof I&&u)D=P(t,M,I,D,0,0,u);else if("Binary"===I._bsontype)D=N(t,M,I,D);else if("Symbol"===I._bsontype)D=T(t,M,I,D);else if("DBRef"===I._bsontype)D=k(t,M,I,D,a,u);else if("BSONRegExp"===I._bsontype)D=g(t,M,I,D);else if("Int32"===I._bsontype)D=j(t,M,I,D);else if("MinKey"===I._bsontype||"MaxKey"===I._bsontype)D=b(t,M,I,D);else if(void 0!==I._bsontype)throw new TypeError("Unrecognized or invalid _bsontype: "+I._bsontype)}}R.pop(),t[D++]=0;var q=D-i;return t[i++]=255&q,t[i++]=q>>8&255,t[i++]=q>>16&255,t[i++]=q>>24&255,D},R={BSON_DATA_NUMBER:1,BSON_DATA_STRING:2,BSON_DATA_OBJECT:3,BSON_DATA_ARRAY:4,BSON_DATA_BINARY:5,BSON_DATA_UNDEFINED:6,BSON_DATA_OID:7,BSON_DATA_BOOLEAN:8,BSON_DATA_DATE:9,BSON_DATA_NULL:10,BSON_DATA_REGEXP:11,BSON_DATA_CODE:13,BSON_DATA_SYMBOL:14,BSON_DATA_CODE_W_SCOPE:15,BSON_DATA_INT:16,BSON_DATA_TIMESTAMP:17,BSON_DATA_LONG:18,BSON_DATA_DECIMAL128:19,BSON_DATA_MIN_KEY:255,BSON_DATA_MAX_KEY:127,BSON_BINARY_SUBTYPE_DEFAULT:0,BSON_BINARY_SUBTYPE_FUNCTION:1,BSON_BINARY_SUBTYPE_BYTE_ARRAY:2,BSON_BINARY_SUBTYPE_UUID:3,BSON_BINARY_SUBTYPE_MD5:4,BSON_BINARY_SUBTYPE_USER_DEFINED:128,BSON_INT32_MAX:2147483647,BSON_INT32_MIN:-2147483648};R.BSON_INT64_MAX=Math.pow(2,63)-1,R.BSON_INT64_MIN=-Math.pow(2,63),R.JS_INT_MAX=9007199254740992,R.JS_INT_MIN=-9007199254740992,t.exports=C}).call(this,r(1).Buffer)},function(t,e){e.readIEEE754=function(t,e,r,n,o){var i,s,a="big"===r,u=8*o-n-1,c=(1<<u)-1,l=c>>1,f=-7,p=a?0:o-1,h=a?1:-1,y=t[e+p];for(p+=h,i=y&(1<<-f)-1,y>>=-f,f+=u;f>0;i=256*i+t[e+p],p+=h,f-=8);for(s=i&(1<<-f)-1,i>>=-f,f+=n;f>0;s=256*s+t[e+p],p+=h,f-=8);if(0===i)i=1-l;else{if(i===c)return s?NaN:1/0*(y?-1:1);s+=Math.pow(2,n),i-=l}return(y?-1:1)*s*Math.pow(2,i-n)},e.writeIEEE754=function(t,e,r,n,o,i){var s,a,u,c="big"===n,l=8*i-o-1,f=(1<<l)-1,p=f>>1,h=23===o?Math.pow(2,-24)-Math.pow(2,-77):0,y=c?i-1:0,d=c?-1:1,_=e<0||0===e&&1/e<0?1:0;for(e=Math.abs(e),isNaN(e)||e===1/0?(a=isNaN(e)?1:0,s=f):(s=Math.floor(Math.log(e)/Math.LN2),e*(u=Math.pow(2,-s))<1&&(s--,u*=2),(e+=s+p>=1?h/u:h*Math.pow(2,1-p))*u>=2&&(s++,u/=2),s+p>=f?(a=0,s=f):s+p>=1?(a=(e*u-1)*Math.pow(2,o),s+=p):(a=e*Math.pow(2,p-1)*Math.pow(2,o),s=0));o>=8;t[r+y]=255&a,y+=d,a/=256,o-=8);for(s=s<<o|a,l+=o;l>0;t[r+y]=255&s,y+=d,s/=256,l-=8);t[r+y-d]|=128*_}},function(t,e,r){"use strict";(function(e){function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o=r(23).Long,i=r(36).Double,s=r(37).Timestamp,a=r(38).ObjectID,u=r(40).Symbol,c=r(39).BSONRegExp,l=r(41).Code,f=r(42),p=r(43).MinKey,h=r(44).MaxKey,y=r(45).DBRef,d=r(27).Binary,_=r(16).normalizedFunctionString,m=function(t,e,r){var n=5;if(Array.isArray(t))for(var o=0;o<t.length;o++)n+=v(o.toString(),t[o],e,!0,r);else for(var i in t.toBSON&&(t=t.toBSON()),t)n+=v(i,t[i],e,!1,r);return n};function v(t,r,v,b,w){switch(r&&r.toBSON&&(r=r.toBSON()),n(r)){case"string":return 1+e.byteLength(t,"utf8")+1+4+e.byteLength(r,"utf8")+1;case"number":return Math.floor(r)===r&&r>=g.JS_INT_MIN&&r<=g.JS_INT_MAX&&r>=g.BSON_INT32_MIN&&r<=g.BSON_INT32_MAX?(null!=t?e.byteLength(t,"utf8")+1:0)+5:(null!=t?e.byteLength(t,"utf8")+1:0)+9;case"undefined":return b||!w?(null!=t?e.byteLength(t,"utf8")+1:0)+1:0;case"boolean":return(null!=t?e.byteLength(t,"utf8")+1:0)+2;case"object":if(null==r||r instanceof p||r instanceof h||"MinKey"===r._bsontype||"MaxKey"===r._bsontype)return(null!=t?e.byteLength(t,"utf8")+1:0)+1;if(r instanceof a||"ObjectID"===r._bsontype||"ObjectId"===r._bsontype)return(null!=t?e.byteLength(t,"utf8")+1:0)+13;if(r instanceof Date||"object"===n(S=r)&&"[object Date]"===Object.prototype.toString.call(S))return(null!=t?e.byteLength(t,"utf8")+1:0)+9;if(void 0!==e&&e.isBuffer(r))return(null!=t?e.byteLength(t,"utf8")+1:0)+6+r.length;if(r instanceof o||r instanceof i||r instanceof s||"Long"===r._bsontype||"Double"===r._bsontype||"Timestamp"===r._bsontype)return(null!=t?e.byteLength(t,"utf8")+1:0)+9;if(r instanceof f||"Decimal128"===r._bsontype)return(null!=t?e.byteLength(t,"utf8")+1:0)+17;if(r instanceof l||"Code"===r._bsontype)return null!=r.scope&&Object.keys(r.scope).length>0?(null!=t?e.byteLength(t,"utf8")+1:0)+1+4+4+e.byteLength(r.code.toString(),"utf8")+1+m(r.scope,v,w):(null!=t?e.byteLength(t,"utf8")+1:0)+1+4+e.byteLength(r.code.toString(),"utf8")+1;if(r instanceof d||"Binary"===r._bsontype)return r.sub_type===d.SUBTYPE_BYTE_ARRAY?(null!=t?e.byteLength(t,"utf8")+1:0)+(r.position+1+4+1+4):(null!=t?e.byteLength(t,"utf8")+1:0)+(r.position+1+4+1);if(r instanceof u||"Symbol"===r._bsontype)return(null!=t?e.byteLength(t,"utf8")+1:0)+e.byteLength(r.value,"utf8")+4+1+1;if(r instanceof y||"DBRef"===r._bsontype){var O={$ref:r.namespace,$id:r.oid};return null!=r.db&&(O.$db=r.db),(null!=t?e.byteLength(t,"utf8")+1:0)+1+m(O,v,w)}return r instanceof RegExp||"[object RegExp]"===Object.prototype.toString.call(r)?(null!=t?e.byteLength(t,"utf8")+1:0)+1+e.byteLength(r.source,"utf8")+1+(r.global?1:0)+(r.ignoreCase?1:0)+(r.multiline?1:0)+1:r instanceof c||"BSONRegExp"===r._bsontype?(null!=t?e.byteLength(t,"utf8")+1:0)+1+e.byteLength(r.pattern,"utf8")+1+e.byteLength(r.options,"utf8")+1:(null!=t?e.byteLength(t,"utf8")+1:0)+m(r,v,w)+1;case"function":if(r instanceof RegExp||"[object RegExp]"===Object.prototype.toString.call(r)||"[object RegExp]"===String.call(r))return(null!=t?e.byteLength(t,"utf8")+1:0)+1+e.byteLength(r.source,"utf8")+1+(r.global?1:0)+(r.ignoreCase?1:0)+(r.multiline?1:0)+1;if(v&&null!=r.scope&&Object.keys(r.scope).length>0)return(null!=t?e.byteLength(t,"utf8")+1:0)+1+4+4+e.byteLength(_(r),"utf8")+1+m(r.scope,v,w);if(v)return(null!=t?e.byteLength(t,"utf8")+1:0)+1+4+e.byteLength(_(r),"utf8")+1}var S;return 0}var g={BSON_INT32_MAX:2147483647,BSON_INT32_MIN:-2147483648,JS_INT_MAX:9007199254740992,JS_INT_MIN:-9007199254740992};t.exports=m}).call(this,r(1).Buffer)},function(t,e,r){"use strict";
/*!
 * ignore
 */t.exports=r(35).Decimal128},function(t,e,r){"use strict";
/*!
 * [node-mongodb-native](https://github.com/mongodb/node-mongodb-native) ObjectId
 * @constructor NodeMongoDbObjectId
 * @see ObjectId
 */var n=r(35).ObjectID;
/*!
 * Getter for convenience with populate, see gh-6115
 */Object.defineProperty(n.prototype,"_id",{enumerable:!1,configurable:!0,get:function(){return this}}),
/*!
 * ignore
 */
t.exports=n},function(t,e,r){"use strict";
/*!
 * ignore
 */t.exports=function(){}},function(t,e,r){"use strict";
/*!
 * Dependencies
 */var n=r(110).ctor("require","modify","init","default","ignore");t.exports=function(){this.strictMode=void 0,this.selected=void 0,this.shardval=void 0,this.saveError=void 0,this.validationError=void 0,this.adhocPaths=void 0,this.removing=void 0,this.inserting=void 0,this.saving=void 0,this.version=void 0,this.getters={},this._id=void 0,this.populate=void 0,this.populated=void 0,this.wasPopulated=!1,this.scope=void 0,this.activePaths=new n,this.pathsToScopes={},this.cachedRequired={},this.session=null,this.$setCalled=new Set,this.ownerDocument=void 0,this.fullPath=void 0}},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */var n=r(2),o=t.exports=function(){};
/*!
 * StateMachine represents a minimal `interface` for the
 * constructors it builds via StateMachine.ctor(...).
 *
 * @api private
 */
/*!
 * StateMachine.ctor('state1', 'state2', ...)
 * A factory method for subclassing StateMachine.
 * The arguments are a list of states. For each state,
 * the constructor's prototype gets state transition
 * methods named after each state. These transition methods
 * place their path argument into the given state.
 *
 * @param {String} state
 * @param {String} [state]
 * @return {Function} subclass constructor
 * @private
 */
o.ctor=function(){var t=n.args(arguments),e=function(){o.apply(this,arguments),this.paths={},this.states={},this.stateNames=t;for(var e,r=t.length;r--;)e=t[r],this.states[e]={}};return e.prototype=new o,t.forEach((function(t){e.prototype[t]=function(e){this._changeState(e,t)}})),e},
/*!
 * This function is wrapped by the state change functions:
 *
 * - `require(path)`
 * - `modify(path)`
 * - `init(path)`
 *
 * @api private
 */
o.prototype._changeState=function(t,e){var r=this.states[this.paths[t]];r&&delete r[t],this.paths[t]=e,this.states[e][t]=!0},
/*!
 * ignore
 */
o.prototype.clear=function(t){for(var e,r=Object.keys(this.states[t]),n=r.length;n--;)e=r[n],delete this.states[t][e],delete this.paths[e]},
/*!
 * Checks to see if at least one path is in the states passed in via `arguments`
 * e.g., this.some('required', 'inited')
 *
 * @param {String} state that we want to check for.
 * @private
 */
o.prototype.some=function(){var t=this,e=arguments.length?arguments:this.stateNames;return Array.prototype.some.call(e,(function(e){return Object.keys(t.states[e]).length}))},
/*!
 * This function builds the functions that get assigned to `forEach` and `map`,
 * since both of those methods share a lot of the same logic.
 *
 * @param {String} iterMethod is either 'forEach' or 'map'
 * @return {Function}
 * @api private
 */
o.prototype._iter=function(t){return function(){var e=arguments.length,r=n.args(arguments,0,e-1),o=arguments[e-1];r.length||(r=this.stateNames);var i=this,s=r.reduce((function(t,e){return t.concat(Object.keys(i.states[e]))}),[]);return s[t]((function(t,e,r){return o(t,e,r)}))}},
/*!
 * Iterates over the paths that belong to one of the parameter states.
 *
 * The function profile can look like:
 * this.forEach(state1, fn);         // iterates over all paths in state1
 * this.forEach(state1, state2, fn); // iterates over all paths in state1 or state2
 * this.forEach(fn);                 // iterates over all paths in all states
 *
 * @param {String} [state]
 * @param {String} [state]
 * @param {Function} callback
 * @private
 */
o.prototype.forEach=function(){return this.forEach=this._iter("forEach"),this.forEach.apply(this,arguments)},
/*!
 * Maps over the paths that belong to one of the parameter states.
 *
 * The function profile can look like:
 * this.forEach(state1, fn);         // iterates over all paths in state1
 * this.forEach(state1, state2, fn); // iterates over all paths in state1 or state2
 * this.forEach(fn);                 // iterates over all paths in all states
 *
 * @param {String} [state]
 * @param {String} [state]
 * @param {Function} callback
 * @return {Array}
 * @private
 */
o.prototype.map=function(){return this.map=this._iter("map"),this.map.apply(this,arguments)}},function(t,e){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var n=1e3,o=6e4,i=60*o,s=24*i;function a(t,e,r,n){var o=e>=1.5*r;return Math.round(t/r)+" "+n+(o?"s":"")}t.exports=function(t,e){e=e||{};var u=r(t);if("string"===u&&t.length>0)return function(t){if((t=String(t)).length>100)return;var e=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(t);if(!e)return;var r=parseFloat(e[1]);switch((e[2]||"ms").toLowerCase()){case"years":case"year":case"yrs":case"yr":case"y":return 315576e5*r;case"weeks":case"week":case"w":return 6048e5*r;case"days":case"day":case"d":return r*s;case"hours":case"hour":case"hrs":case"hr":case"h":return r*i;case"minutes":case"minute":case"mins":case"min":case"m":return r*o;case"seconds":case"second":case"secs":case"sec":case"s":return r*n;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return r;default:return}}(t);if("number"===u&&isFinite(t))return e.long?function(t){var e=Math.abs(t);if(e>=s)return a(t,e,s,"day");if(e>=i)return a(t,e,i,"hour");if(e>=o)return a(t,e,o,"minute");if(e>=n)return a(t,e,n,"second");return t+" ms"}(t):function(t){var e=Math.abs(t);if(e>=s)return Math.round(t/s)+"d";if(e>=i)return Math.round(t/i)+"h";if(e>=o)return Math.round(t/o)+"m";if(e>=n)return Math.round(t/n)+"s";return t+"ms"}(t);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(t))}},function(t,e,r){function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o=r(113),i=["__proto__","constructor","prototype"];
/*!
 * Returns the value passed to it.
 */
function s(t){return t}e.get=function(t,r,n,i){var a;"function"==typeof n&&(n.length<2?(i=n,n=void 0):(a=n,n=void 0)),i||(i=s);var u="string"==typeof t?o(t):t;if(!Array.isArray(u))throw new TypeError("Invalid `path`. Must be either string or array");for(var c,l=r,f=0;f<u.length;++f){if(c=u[f],Array.isArray(l)&&!/^\d+$/.test(c)){var p=u.slice(f);return[].concat(l).map((function(t){return t?e.get(p,t,n||a,i):i(void 0)}))}if(a)l=a(l,c);else{var h=n&&l[n]?l[n]:l;l=h instanceof Map?h.get(c):h[c]}if(!l)return i(l)}return i(l)},e.has=function(t,e){var r="string"==typeof t?o(t):t;if(!Array.isArray(r))throw new TypeError("Invalid `path`. Must be either string or array");for(var i=r.length,s=e,a=0;a<i;++a){if(null==s||"object"!==n(s)||!(r[a]in s))return!1;s=s[r[a]]}return!0},e.unset=function(t,e){var r="string"==typeof t?o(t):t;if(!Array.isArray(r))throw new TypeError("Invalid `path`. Must be either string or array");for(var s=r.length,a=e,u=0;u<s;++u){if(null==a||"object"!==n(a)||!(r[u]in a))return!1;if(-1!==i.indexOf(r[u]))return!1;if(u===s-1)return delete a[r[u]],!0;a=a instanceof Map?a.get(r[u]):a[r[u]]}return!0},e.set=function(t,r,n,a,u,c){var l;"function"==typeof a&&(a.length<2?(u=a,a=void 0):(l=a,a=void 0)),u||(u=s);var f="string"==typeof t?o(t):t;if(!Array.isArray(f))throw new TypeError("Invalid `path`. Must be either string or array");if(null!=n){for(var p=0;p<f.length;++p)if(-1!==i.indexOf(f[p]))return;for(var h,y=c||/\$/.test(t)&&!1!==c,d=n,_=(p=0,f.length-1);p<_;++p)if("$"!=(h=f[p])){if(Array.isArray(d)&&!/^\d+$/.test(h)){var m=f.slice(p);if(!y&&Array.isArray(r))for(var v=0;v<d.length&&v<r.length;++v)e.set(m,r[v],d[v],a||l,u,y);else for(v=0;v<d.length;++v)e.set(m,r,d[v],a||l,u,y);return}if(l)d=l(d,h);else{var g=a&&d[a]?d[a]:d;d=g instanceof Map?g.get(h):g[h]}if(!d)return}else if(p==_-1)break;if(h=f[_],a&&d[a]&&(d=d[a]),Array.isArray(d)&&!/^\d+$/.test(h))if(!y&&Array.isArray(r))!
/*!
 * Recursively set nested arrays
 */
function t(e,r,n,o,i,s){for(var a,u=0;u<e.length&&u<r.length;++u)a=e[u],Array.isArray(a)&&Array.isArray(r[u])?t(a,r[u],n,o,i,s):a&&(o?o(a,n,s(r[u])):(a[i]&&(a=a[i]),a[n]=s(r[u])))}(d,r,h,l,a,u);else for(v=0;v<d.length;++v){var b=d[v];b&&(l?l(b,h,u(r)):(b[a]&&(b=b[a]),b[h]=u(r)))}else l?l(d,h,u(r)):d instanceof Map?d.set(h,u(r)):d[h]=u(r)}}},function(t,e,r){"use strict";t.exports=function(t){for(var e=[],r="",n="DEFAULT",o=0;o<t.length;++o)"IN_SQUARE_BRACKETS"!==n||/\d/.test(t[o])||"]"===t[o]||(n="DEFAULT",r=e[e.length-1]+"["+r,e.splice(e.length-1,1)),"["===t[o]?("IMMEDIATELY_AFTER_SQUARE_BRACKETS"!==n&&(e.push(r),r=""),n="IN_SQUARE_BRACKETS"):"]"===t[o]?"IN_SQUARE_BRACKETS"===n?(n="IMMEDIATELY_AFTER_SQUARE_BRACKETS",e.push(r),r=""):(n="DEFAULT",r+=t[o]):"."===t[o]?("IMMEDIATELY_AFTER_SQUARE_BRACKETS"!==n&&(e.push(r),r=""),n="DEFAULT"):r+=t[o];return"IMMEDIATELY_AFTER_SQUARE_BRACKETS"!==n&&e.push(r),e}},function(t,e,r){"use strict";function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o=r(28);t.exports=function t(e){if(function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this._docs={},this._childDocs=[],null!=e&&(e=o(e),Object.assign(this,e),"object"===n(e.subPopulate)&&(this.populate=e.subPopulate),null!=e.perDocumentLimit&&null!=e.limit))throw new Error("Can not use `limit` and `perDocumentLimit` at the same time. Path: `"+e.path+"`.")}},function(t,e,r){"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/var n=Object.getOwnPropertySymbols,o=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable;function s(t){if(null==t)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(t)}t.exports=function(){try{if(!Object.assign)return!1;var t=new String("abc");if(t[5]="de","5"===Object.getOwnPropertyNames(t)[0])return!1;for(var e={},r=0;r<10;r++)e["_"+String.fromCharCode(r)]=r;if("0123456789"!==Object.getOwnPropertyNames(e).map((function(t){return e[t]})).join(""))return!1;var n={};return"abcdefghijklmnopqrst".split("").forEach((function(t){n[t]=t})),"abcdefghijklmnopqrst"===Object.keys(Object.assign({},n)).join("")}catch(t){return!1}}()?Object.assign:function(t,e){for(var r,a,u=s(t),c=1;c<arguments.length;c++){for(var l in r=Object(arguments[c]))o.call(r,l)&&(u[l]=r[l]);if(n){a=n(r);for(var f=0;f<a.length;f++)i.call(r,a[f])&&(u[a[f]]=r[a[f]])}}return u}},function(t,e,r){"use strict";function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o=r(62),i=r(22),s=r(4),a=r(68),u=r(119)("mquery");function c(t,e){if(!(this instanceof c))return new c(t,e);var r=this.constructor.prototype;this.op=r.op||void 0,this.options=Object.assign({},r.options),this._conditions=r._conditions?a.clone(r._conditions):{},this._fields=r._fields?a.clone(r._fields):void 0,this._update=r._update?a.clone(r._update):void 0,this._path=r._path||void 0,this._distinct=r._distinct||void 0,this._collection=r._collection||void 0,this._traceFunction=r._traceFunction||void 0,e&&this.setOptions(e),t&&(t.find&&t.remove&&t.update?this.collection(t):this.find(t))}var l="$geoWithin";Object.defineProperty(c,"use$geoWithin",{get:function(){return"$geoWithin"==l},set:function(t){l=!0===t?"$geoWithin":"$within"}}),c.prototype.toConstructor=function(){function t(e,r){if(!(this instanceof t))return new t(e,r);c.call(this,e,r)}a.inherits(t,c);var e=t.prototype;return e.options={},e.setOptions(this.options),e.op=this.op,e._conditions=a.clone(this._conditions),e._fields=a.clone(this._fields),e._update=a.clone(this._update),e._path=this._path,e._distinct=this._distinct,e._collection=this._collection,e._traceFunction=this._traceFunction,t},c.prototype.setOptions=function(t){if(!t||!a.isObject(t))return this;for(var e,r=a.keys(t),n=0;n<r.length;++n)if("function"==typeof this[e=r[n]]){var o=a.isArray(t[e])?t[e]:[t[e]];this[e].apply(this,o)}else this.options[e]=t[e];return this},c.prototype.collection=function(t){return this._collection=new c.Collection(t),this},c.prototype.collation=function(t){return this.options.collation=t,this},c.prototype.$where=function(t){return this._conditions.$where=t,this},c.prototype.where=function(){if(!arguments.length)return this;this.op||(this.op="find");var t=n(arguments[0]);if("string"==t)return this._path=arguments[0],2===arguments.length&&(this._conditions[this._path]=arguments[1]),this;if("object"==t&&!Array.isArray(arguments[0]))return this.merge(arguments[0]);throw new TypeError("path must be a string or object")},c.prototype.equals=function(t){this._ensurePath("equals");var e=this._path;return this._conditions[e]=t,this},c.prototype.eq=function(t){this._ensurePath("eq");var e=this._path;return this._conditions[e]=t,this},c.prototype.or=function(t){var e=this._conditions.$or||(this._conditions.$or=[]);return a.isArray(t)||(t=[t]),e.push.apply(e,t),this},c.prototype.nor=function(t){var e=this._conditions.$nor||(this._conditions.$nor=[]);return a.isArray(t)||(t=[t]),e.push.apply(e,t),this},c.prototype.and=function(t){var e=this._conditions.$and||(this._conditions.$and=[]);return Array.isArray(t)||(t=[t]),e.push.apply(e,t),this},
/*!
 * gt, gte, lt, lte, ne, in, nin, all, regex, size, maxDistance
 *
 *     Thing.where('type').nin(array)
 */
"gt gte lt lte ne in nin all regex size maxDistance minDistance".split(" ").forEach((function(t){c.prototype[t]=function(){var e,r;1===arguments.length?(this._ensurePath(t),r=arguments[0],e=this._path):(r=arguments[1],e=arguments[0]);var o=null===this._conditions[e]||"object"===n(this._conditions[e])?this._conditions[e]:this._conditions[e]={};return o["$"+t]=r,this}})),c.prototype.mod=function(){var t,e;1===arguments.length?(this._ensurePath("mod"),t=arguments[0],e=this._path):2!==arguments.length||a.isArray(arguments[1])?3===arguments.length?(t=o(arguments,1),e=arguments[0]):(t=arguments[1],e=arguments[0]):(this._ensurePath("mod"),t=o(arguments),e=this._path);var r=this._conditions[e]||(this._conditions[e]={});return r.$mod=t,this},c.prototype.exists=function(){var t,e;0===arguments.length?(this._ensurePath("exists"),t=this._path,e=!0):1===arguments.length?"boolean"==typeof arguments[0]?(this._ensurePath("exists"),t=this._path,e=arguments[0]):(t=arguments[0],e=!0):2===arguments.length&&(t=arguments[0],e=arguments[1]);var r=this._conditions[t]||(this._conditions[t]={});return r.$exists=e,this},c.prototype.elemMatch=function(){if(null==arguments[0])throw new TypeError("Invalid argument");var t,e,r;if("function"==typeof arguments[0])this._ensurePath("elemMatch"),e=this._path,t=arguments[0];else if(a.isObject(arguments[0]))this._ensurePath("elemMatch"),e=this._path,r=arguments[0];else if("function"==typeof arguments[1])e=arguments[0],t=arguments[1];else{if(!arguments[1]||!a.isObject(arguments[1]))throw new TypeError("Invalid argument");e=arguments[0],r=arguments[1]}t&&(t(r=new c),r=r._conditions);var n=this._conditions[e]||(this._conditions[e]={});return n.$elemMatch=r,this},c.prototype.within=function(){if(this._ensurePath("within"),this._geoComparison=l,0===arguments.length)return this;if(2===arguments.length)return this.box.apply(this,arguments);if(2<arguments.length)return this.polygon.apply(this,arguments);var t=arguments[0];if(!t)throw new TypeError("Invalid argument");if(t.center)return this.circle(t);if(t.box)return this.box.apply(this,t.box);if(t.polygon)return this.polygon.apply(this,t.polygon);if(t.type&&t.coordinates)return this.geometry(t);throw new TypeError("Invalid argument")},c.prototype.box=function(){var t,e;if(3===arguments.length)t=arguments[0],e=[arguments[1],arguments[2]];else{if(2!==arguments.length)throw new TypeError("Invalid argument");this._ensurePath("box"),t=this._path,e=[arguments[0],arguments[1]]}var r=this._conditions[t]||(this._conditions[t]={});return r[this._geoComparison||l]={$box:e},this},c.prototype.polygon=function(){var t,e;"string"==typeof arguments[0]?(e=arguments[0],t=o(arguments,1)):(this._ensurePath("polygon"),e=this._path,t=o(arguments));var r=this._conditions[e]||(this._conditions[e]={});return r[this._geoComparison||l]={$polygon:t},this},c.prototype.circle=function(){var t,e;if(1===arguments.length)this._ensurePath("circle"),t=this._path,e=arguments[0];else{if(2!==arguments.length)throw new TypeError("Invalid argument");t=arguments[0],e=arguments[1]}if(!("radius"in e)||!e.center)throw new Error("center and radius are required");var r=this._conditions[t]||(this._conditions[t]={}),n=e.spherical?"$centerSphere":"$center",o=this._geoComparison||l;return r[o]={},r[o][n]=[e.center,e.radius],"unique"in e&&(r[o].$uniqueDocs=!!e.unique),this},c.prototype.near=function(){var t,e;if(this._geoComparison="$near",0===arguments.length)return this;if(1===arguments.length)this._ensurePath("near"),t=this._path,e=arguments[0];else{if(2!==arguments.length)throw new TypeError("Invalid argument");t=arguments[0],e=arguments[1]}if(!e.center)throw new Error("center is required");var r=this._conditions[t]||(this._conditions[t]={}),n=e.spherical?"$nearSphere":"$near";if(Array.isArray(e.center)){r[n]=e.center;var o="maxDistance"in e?e.maxDistance:null;null!=o&&(r.$maxDistance=o),null!=e.minDistance&&(r.$minDistance=e.minDistance)}else{if("Point"!=e.center.type||!Array.isArray(e.center.coordinates))throw new Error(s.format("Invalid GeoJSON specified for %s",n));r[n]={$geometry:e.center},"maxDistance"in e&&(r[n].$maxDistance=e.maxDistance),"minDistance"in e&&(r[n].$minDistance=e.minDistance)}return this},c.prototype.intersects=function(){if(this._ensurePath("intersects"),this._geoComparison="$geoIntersects",0===arguments.length)return this;var t=arguments[0];if(null!=t&&t.type&&t.coordinates)return this.geometry(t);throw new TypeError("Invalid argument")},c.prototype.geometry=function(){if("$within"!=this._geoComparison&&"$geoWithin"!=this._geoComparison&&"$near"!=this._geoComparison&&"$geoIntersects"!=this._geoComparison)throw new Error("geometry() must come after `within()`, `intersects()`, or `near()");var t,e;if(1!==arguments.length)throw new TypeError("Invalid argument");if(this._ensurePath("geometry"),e=this._path,!(t=arguments[0]).type||!Array.isArray(t.coordinates))throw new TypeError("Invalid argument");var r=this._conditions[e]||(this._conditions[e]={});return r[this._geoComparison]={$geometry:t},this},c.prototype.select=function(){var t=arguments[0];if(!t)return this;if(1!==arguments.length)throw new Error("Invalid select: select only takes 1 argument");this._validate("select");var e,r,o=this._fields||(this._fields={}),i=n(t);if(("string"==i||a.isArgumentsObject(t))&&"number"==typeof t.length||Array.isArray(t)){for("string"==i&&(t=t.split(/\s+/)),e=0,r=t.length;e<r;++e){var s=t[e];if(s){var u="-"==s[0]?0:1;0===u&&(s=s.substring(1)),o[s]=u}}return this}if(a.isObject(t)){var c=a.keys(t);for(e=0;e<c.length;++e)o[c[e]]=t[c[e]];return this}throw new TypeError("Invalid select() argument. Must be string or object.")},c.prototype.slice=function(){if(0===arguments.length)return this;var t,e;if(this._validate("slice"),1===arguments.length){var r=arguments[0];if("object"===n(r)&&!Array.isArray(r)){for(var i=Object.keys(r),s=i.length,a=0;a<s;++a)this.slice(i[a],r[i[a]]);return this}this._ensurePath("slice"),t=this._path,e=arguments[0]}else 2===arguments.length?"number"==typeof arguments[0]?(this._ensurePath("slice"),t=this._path,e=o(arguments)):(t=arguments[0],e=arguments[1]):3===arguments.length&&(t=arguments[0],e=o(arguments,1));var u=this._fields||(this._fields={});return u[t]={$slice:e},this},c.prototype.sort=function(t){if(!t)return this;var e,r,o;this._validate("sort");var i=n(t);if(Array.isArray(t)){for(r=t.length,e=0;e<t.length;++e){if(!Array.isArray(t[e]))throw new Error("Invalid sort() argument, must be array of arrays");h(this.options,t[e][0],t[e][1])}return this}if(1===arguments.length&&"string"==i){for(r=(t=t.split(/\s+/)).length,e=0;e<r;++e)if(o=t[e]){var s="-"==o[0]?-1:1;-1===s&&(o=o.substring(1)),p(this.options,o,s)}return this}if(a.isObject(t)){var u=a.keys(t);for(e=0;e<u.length;++e)o=u[e],p(this.options,o,t[o]);return this}if("undefined"!=typeof Map&&t instanceof Map)return y(this.options,t),this;throw new TypeError("Invalid sort() argument. Must be a string, object, or array.")};
/*!
 * @ignore
 */
var f={1:1,"-1":-1,asc:1,ascending:1,desc:-1,descending:-1};function p(t,e,r){if(Array.isArray(t.sort))throw new TypeError("Can't mix sort syntaxes. Use either array or object:\n- `.sort([['field', 1], ['test', -1]])`\n- `.sort({ field: 1, test: -1 })`");var n;if(r&&r.$meta)(n=t.sort||(t.sort={}))[e]={$meta:r.$meta};else{n=t.sort||(t.sort={});var o=String(r||1).toLowerCase();if(!(o=f[o]))throw new TypeError("Invalid sort value: { "+e+": "+r+" }");n[e]=o}}function h(t,e,r){if(t.sort=t.sort||[],!Array.isArray(t.sort))throw new TypeError("Can't mix sort syntaxes. Use either array or object:\n- `.sort([['field', 1], ['test', -1]])`\n- `.sort({ field: 1, test: -1 })`");var n=String(r||1).toLowerCase();if(!(n=f[n]))throw new TypeError("Invalid sort value: [ "+e+", "+r+" ]");t.sort.push([e,n])}function y(t,e){if(t.sort=t.sort||new Map,!(t.sort instanceof Map))throw new TypeError("Can't mix sort syntaxes. Use either array or object or map consistently");e.forEach((function(e,r){var n=String(e||1).toLowerCase();if(!(n=f[n]))throw new TypeError("Invalid sort value: < "+r+": "+e+" >");t.sort.set(r,n)}))}
/*!
 * limit, skip, maxScan, batchSize, comment
 *
 * Sets these associated options.
 *
 *     query.comment('feed query');
 */
/*!
 * Internal helper for update, updateMany, updateOne
 */
function d(t,e,r,n,o,i,s){return t.op=e,c.canMerge(r)&&t.merge(r),n&&t._mergeUpdate(n),a.isObject(o)&&t.setOptions(o),i||s?!t._update||!t.options.overwrite&&0===a.keys(t._update).length?(s&&a.soon(s.bind(null,null,0)),t):(o=t._optionsForExec(),s||(o.safe=!1),r=t._conditions,n=t._updateForExec(),u("update",t._collection.collectionName,r,n,o),s=t._wrapCallback(e,s,{conditions:r,doc:n,options:o}),t._collection[e](r,n,o,a.tick(s)),t):t}["limit","skip","maxScan","batchSize","comment"].forEach((function(t){c.prototype[t]=function(e){return this._validate(t),this.options[t]=e,this}})),c.prototype.maxTime=c.prototype.maxTimeMS=function(t){return this._validate("maxTime"),this.options.maxTimeMS=t,this},c.prototype.snapshot=function(){return this._validate("snapshot"),this.options.snapshot=!arguments.length||!!arguments[0],this},c.prototype.hint=function(){if(0===arguments.length)return this;this._validate("hint");var t=arguments[0];if(a.isObject(t)){var e=this.options.hint||(this.options.hint={});for(var r in t)e[r]=t[r];return this}if("string"==typeof t)return this.options.hint=t,this;throw new TypeError("Invalid hint. "+t)},c.prototype.j=function(t){return this.options.j=t,this},c.prototype.slaveOk=function(t){return this.options.slaveOk=!arguments.length||!!t,this},c.prototype.read=c.prototype.setReadPreference=function(t){return arguments.length>1&&!c.prototype.read.deprecationWarningIssued&&(console.error("Deprecation warning: 'tags' argument is not supported anymore in Query.read() method. Please use mongodb.ReadPreference object instead."),c.prototype.read.deprecationWarningIssued=!0),this.options.readPreference=a.readPref(t),this},c.prototype.readConcern=c.prototype.r=function(t){return this.options.readConcern=a.readConcern(t),this},c.prototype.tailable=function(){return this._validate("tailable"),this.options.tailable=!arguments.length||!!arguments[0],this},c.prototype.writeConcern=c.prototype.w=function(t){return"object"===n(t)?(void 0!==t.j&&(this.options.j=t.j),void 0!==t.w&&(this.options.w=t.w),void 0!==t.wtimeout&&(this.options.wtimeout=t.wtimeout)):this.options.w="m"===t?"majority":t,this},c.prototype.wtimeout=c.prototype.wTimeout=function(t){return this.options.wtimeout=t,this},c.prototype.merge=function(t){if(!t)return this;if(!c.canMerge(t))throw new TypeError("Invalid argument. Expected instanceof mquery or plain object");return t instanceof c?(t._conditions&&a.merge(this._conditions,t._conditions),t._fields&&(this._fields||(this._fields={}),a.merge(this._fields,t._fields)),t.options&&(this.options||(this.options={}),a.merge(this.options,t.options)),t._update&&(this._update||(this._update={}),a.mergeClone(this._update,t._update)),t._distinct&&(this._distinct=t._distinct),this):(a.merge(this._conditions,t),this)},c.prototype.find=function(t,e){if(this.op="find","function"==typeof t?(e=t,t=void 0):c.canMerge(t)&&this.merge(t),!e)return this;var r=this._conditions,n=this._optionsForExec();return this.$useProjection?n.projection=this._fieldsForExec():n.fields=this._fieldsForExec(),u("find",this._collection.collectionName,r,n),e=this._wrapCallback("find",e,{conditions:r,options:n}),this._collection.find(r,n,a.tick(e)),this},c.prototype.cursor=function(t){if(this.op){if("find"!==this.op)throw new TypeError(".cursor only support .find method")}else this.find(t);var e=this._conditions,r=this._optionsForExec();return this.$useProjection?r.projection=this._fieldsForExec():r.fields=this._fieldsForExec(),u("findCursor",this._collection.collectionName,e,r),this._collection.findCursor(e,r)},c.prototype.findOne=function(t,e){if(this.op="findOne","function"==typeof t?(e=t,t=void 0):c.canMerge(t)&&this.merge(t),!e)return this;var r=this._conditions,n=this._optionsForExec();return this.$useProjection?n.projection=this._fieldsForExec():n.fields=this._fieldsForExec(),u("findOne",this._collection.collectionName,r,n),e=this._wrapCallback("findOne",e,{conditions:r,options:n}),this._collection.findOne(r,n,a.tick(e)),this},c.prototype.count=function(t,e){if(this.op="count",this._validate(),"function"==typeof t?(e=t,t=void 0):c.canMerge(t)&&this.merge(t),!e)return this;var r=this._conditions,n=this._optionsForExec();return u("count",this._collection.collectionName,r,n),e=this._wrapCallback("count",e,{conditions:r,options:n}),this._collection.count(r,n,a.tick(e)),this},c.prototype.distinct=function(t,e,r){if(this.op="distinct",this._validate(),!r){switch(n(e)){case"function":r=e,"string"==typeof t&&(e=t,t=void 0);break;case"undefined":case"string":break;default:throw new TypeError("Invalid `field` argument. Must be string or function")}switch(n(t)){case"function":r=t,t=e=void 0;break;case"string":e=t,t=void 0}}if("string"==typeof e&&(this._distinct=e),c.canMerge(t)&&this.merge(t),!r)return this;if(!this._distinct)throw new Error("No value for `distinct` has been declared");var o=this._conditions,i=this._optionsForExec();return u("distinct",this._collection.collectionName,o,i),r=this._wrapCallback("distinct",r,{conditions:o,options:i}),this._collection.distinct(this._distinct,o,i,a.tick(r)),this},c.prototype.update=function(t,e,r,o){var i;switch(arguments.length){case 3:"function"==typeof r&&(o=r,r=void 0);break;case 2:"function"==typeof e&&(o=e,e=t,t=void 0);break;case 1:switch(n(t)){case"function":o=t,t=r=e=void 0;break;case"boolean":i=t,t=void 0;break;default:e=t,t=r=void 0}}return d(this,"update",t,e,r,i,o)},c.prototype.updateMany=function(t,e,r,o){var i;switch(arguments.length){case 3:"function"==typeof r&&(o=r,r=void 0);break;case 2:"function"==typeof e&&(o=e,e=t,t=void 0);break;case 1:switch(n(t)){case"function":o=t,t=r=e=void 0;break;case"boolean":i=t,t=void 0;break;default:e=t,t=r=void 0}}return d(this,"updateMany",t,e,r,i,o)},c.prototype.updateOne=function(t,e,r,o){var i;switch(arguments.length){case 3:"function"==typeof r&&(o=r,r=void 0);break;case 2:"function"==typeof e&&(o=e,e=t,t=void 0);break;case 1:switch(n(t)){case"function":o=t,t=r=e=void 0;break;case"boolean":i=t,t=void 0;break;default:e=t,t=r=void 0}}return d(this,"updateOne",t,e,r,i,o)},c.prototype.replaceOne=function(t,e,r,o){var i;switch(arguments.length){case 3:"function"==typeof r&&(o=r,r=void 0);break;case 2:"function"==typeof e&&(o=e,e=t,t=void 0);break;case 1:switch(n(t)){case"function":o=t,t=r=e=void 0;break;case"boolean":i=t,t=void 0;break;default:e=t,t=r=void 0}}return this.setOptions({overwrite:!0}),d(this,"replaceOne",t,e,r,i,o)},c.prototype.remove=function(t,e){var r;if(this.op="remove","function"==typeof t?(e=t,t=void 0):c.canMerge(t)?this.merge(t):!0===t&&(r=t,t=void 0),!r&&!e)return this;var n=this._optionsForExec();e||(n.safe=!1);var o=this._conditions;return u("remove",this._collection.collectionName,o,n),e=this._wrapCallback("remove",e,{conditions:o,options:n}),this._collection.remove(o,n,a.tick(e)),this},c.prototype.deleteOne=function(t,e){var r;if(this.op="deleteOne","function"==typeof t?(e=t,t=void 0):c.canMerge(t)?this.merge(t):!0===t&&(r=t,t=void 0),!r&&!e)return this;var n=this._optionsForExec();e||(n.safe=!1),delete n.justOne;var o=this._conditions;return u("deleteOne",this._collection.collectionName,o,n),e=this._wrapCallback("deleteOne",e,{conditions:o,options:n}),this._collection.deleteOne(o,n,a.tick(e)),this},c.prototype.deleteMany=function(t,e){var r;if(this.op="deleteMany","function"==typeof t?(e=t,t=void 0):c.canMerge(t)?this.merge(t):!0===t&&(r=t,t=void 0),!r&&!e)return this;var n=this._optionsForExec();e||(n.safe=!1),delete n.justOne;var o=this._conditions;return u("deleteOne",this._collection.collectionName,o,n),e=this._wrapCallback("deleteOne",e,{conditions:o,options:n}),this._collection.deleteMany(o,n,a.tick(e)),this},c.prototype.findOneAndUpdate=function(t,e,r,n){switch(this.op="findOneAndUpdate",this._validate(),arguments.length){case 3:"function"==typeof r&&(n=r,r={});break;case 2:"function"==typeof e&&(n=e,e=t,t=void 0),r=void 0;break;case 1:"function"==typeof t?(n=t,t=r=e=void 0):(e=t,t=r=void 0)}return c.canMerge(t)&&this.merge(t),e&&this._mergeUpdate(e),r&&this.setOptions(r),n?this._findAndModify("update",n):this},c.prototype.findOneAndRemove=c.prototype.findOneAndDelete=function(t,e,r){return this.op="findOneAndRemove",this._validate(),"function"==typeof e?(r=e,e=void 0):"function"==typeof t&&(r=t,t=void 0),c.canMerge(t)&&this.merge(t),e&&this.setOptions(e),r?this._findAndModify("remove",r):this},c.prototype._findAndModify=function(t,e){i.equal("function",n(e));var r,o=this._optionsForExec();if("remove"==t)o.remove=!0;else if("new"in o||(o.new=!0),"upsert"in o||(o.upsert=!1),!(r=this._updateForExec())){if(!o.upsert)return this.findOne(e);r={$set:{}}}null!=this._fieldsForExec()&&(this.$useProjection?o.projection=this._fieldsForExec():o.fields=this._fieldsForExec());var s=this._conditions;return u("findAndModify",this._collection.collectionName,s,r,o),e=this._wrapCallback("findAndModify",e,{conditions:s,doc:r,options:o}),this._collection.findAndModify(s,r,o,a.tick(e)),this},c.prototype._wrapCallback=function(t,e,r){var n=this._traceFunction||c.traceFunction;if(n){r.collectionName=this._collection.collectionName;var o=n&&n.call(null,t,r,this),i=(new Date).getTime();return function(t,r){if(o){var n=(new Date).getTime()-i;o.call(null,t,r,n)}e&&e.apply(null,arguments)}}return e},c.prototype.setTraceFunction=function(t){return this._traceFunction=t,this},c.prototype.exec=function(t,e){switch(n(t)){case"function":e=t,t=null;break;case"string":this.op=t}i.ok(this.op,"Missing query type: (find, update, etc)"),"update"!=this.op&&"remove"!=this.op||e||(e=!0);var r=this;if("function"!=typeof e)return new c.Promise((function(t,e){r[r.op]((function(r,n){r?e(r):t(n),t=e=null}))}));this[this.op](e)},c.prototype.thunk=function(){var t=this;return function(e){t.exec(e)}},c.prototype.then=function(t,e){var r=this;return new c.Promise((function(t,e){r.exec((function(r,n){r?e(r):t(n),t=e=null}))})).then(t,e)},c.prototype.stream=function(t){if("find"!=this.op)throw new Error("stream() is only available for find");var e=this._conditions,r=this._optionsForExec();return this.$useProjection?r.projection=this._fieldsForExec():r.fields=this._fieldsForExec(),u("stream",this._collection.collectionName,e,r,t),this._collection.findStream(e,r,t)},c.prototype.selected=function(){return!!(this._fields&&Object.keys(this._fields).length>0)},c.prototype.selectedInclusively=function(){if(!this._fields)return!1;var t=Object.keys(this._fields);if(0===t.length)return!1;for(var e=0;e<t.length;++e){var r=t[e];if(0===this._fields[r])return!1;if(this._fields[r]&&"object"===n(this._fields[r])&&this._fields[r].$meta)return!1}return!0},c.prototype.selectedExclusively=function(){if(!this._fields)return!1;var t=Object.keys(this._fields);if(0===t.length)return!1;for(var e=0;e<t.length;++e){var r=t[e];if(0===this._fields[r])return!0}return!1},c.prototype._mergeUpdate=function(t){this._update||(this._update={}),t instanceof c?t._update&&a.mergeClone(this._update,t._update):a.mergeClone(this._update,t)},c.prototype._optionsForExec=function(){return a.clone(this.options)},c.prototype._fieldsForExec=function(){return a.clone(this._fields)},c.prototype._updateForExec=function(){for(var t=a.clone(this._update),e=a.keys(t),r=e.length,n={};r--;){var o=e[r];this.options.overwrite?n[o]=t[o]:"$"!==o[0]?(n.$set||(t.$set?n.$set=t.$set:n.$set={}),n.$set[o]=t[o],e.splice(r,1),~e.indexOf("$set")||e.push("$set")):"$set"===o&&n.$set||(n[o]=t[o])}return this._compiledUpdate=n,n},c.prototype._ensurePath=function(t){if(!this._path)throw new Error(t+"() must be used after where() when called with these arguments")},
/*!
 * Permissions
 */
c.permissions=r(122),c._isPermitted=function(t,e){var r=c.permissions[e];return!r||!0!==r[t]},c.prototype._validate=function(t){var e,r;if(void 0===t){if("function"!=typeof(r=c.permissions[this.op]))return!0;e=r(this)}else c._isPermitted(t,this.op)||(e=t);if(e)throw new Error(e+" cannot be used with "+this.op)},c.canMerge=function(t){return t instanceof c||a.isObject(t)},c.setGlobalTraceFunction=function(t){c.traceFunction=t},
/*!
 * Exports.
 */
c.utils=a,c.env=r(70),c.Collection=r(124),c.BaseCollection=r(30),c.Promise=r(126),t.exports=c},function(t,e,r){(function(t,e){!function(t,r){"use strict";if(!t.setImmediate){var n,o,i,s,a,u=1,c={},l=!1,f=t.document,p=Object.getPrototypeOf&&Object.getPrototypeOf(t);p=p&&p.setTimeout?p:t,"[object process]"==={}.toString.call(t.process)?n=function(t){e.nextTick((function(){y(t)}))}:!function(){if(t.postMessage&&!t.importScripts){var e=!0,r=t.onmessage;return t.onmessage=function(){e=!1},t.postMessage("","*"),t.onmessage=r,e}}()?t.MessageChannel?((i=new MessageChannel).port1.onmessage=function(t){y(t.data)},n=function(t){i.port2.postMessage(t)}):f&&"onreadystatechange"in f.createElement("script")?(o=f.documentElement,n=function(t){var e=f.createElement("script");e.onreadystatechange=function(){y(t),e.onreadystatechange=null,o.removeChild(e),e=null},o.appendChild(e)}):n=function(t){setTimeout(y,0,t)}:(s="setImmediate$"+Math.random()+"$",a=function(e){e.source===t&&"string"==typeof e.data&&0===e.data.indexOf(s)&&y(+e.data.slice(s.length))},t.addEventListener?t.addEventListener("message",a,!1):t.attachEvent("onmessage",a),n=function(e){t.postMessage(s+e,"*")}),p.setImmediate=function(t){"function"!=typeof t&&(t=new Function(""+t));for(var e=new Array(arguments.length-1),r=0;r<e.length;r++)e[r]=arguments[r+1];var o={callback:t,args:e};return c[u]=o,n(u),u++},p.clearImmediate=h}function h(t){delete c[t]}function y(t){if(l)setTimeout(y,0,t);else{var e=c[t];if(e){l=!0;try{!function(t){var e=t.callback,r=t.args;switch(r.length){case 0:e();break;case 1:e(r[0]);break;case 2:e(r[0],r[1]);break;case 3:e(r[0],r[1],r[2]);break;default:e.apply(void 0,r)}}(e)}finally{h(t),l=!1}}}}}("undefined"==typeof self?void 0===t?this:t:self)}).call(this,r(11),r(8))},function(t,e,r){var n=r(1),o=n.Buffer;function i(t,e){for(var r in t)e[r]=t[r]}function s(t,e,r){return o(t,e,r)}o.from&&o.alloc&&o.allocUnsafe&&o.allocUnsafeSlow?t.exports=n:(i(n,e),e.Buffer=s),i(o,s),s.from=function(t,e,r){if("number"==typeof t)throw new TypeError("Argument must not be a number");return o(t,e,r)},s.alloc=function(t,e,r){if("number"!=typeof t)throw new TypeError("Argument must be a number");var n=o(t);return void 0!==e?"string"==typeof r?n.fill(e,r):n.fill(e):n.fill(0),n},s.allocUnsafe=function(t){if("number"!=typeof t)throw new TypeError("Argument must be a number");return o(t)},s.allocUnsafeSlow=function(t){if("number"!=typeof t)throw new TypeError("Argument must be a number");return n.SlowBuffer(t)}},function(t,e,r){(function(n){function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(){var t;try{t=e.storage.debug}catch(t){}return!t&&void 0!==n&&"env"in n&&(t=n.env.DEBUG),t}(e=t.exports=r(120)).log=function(){return"object"===("undefined"==typeof console?"undefined":o(console))&&console.log&&Function.prototype.apply.call(console.log,console,arguments)},e.formatArgs=function(t){var r=this.useColors;if(t[0]=(r?"%c":"")+this.namespace+(r?" %c":" ")+t[0]+(r?"%c ":" ")+"+"+e.humanize(this.diff),!r)return;var n="color: "+this.color;t.splice(1,0,n,"color: inherit");var o=0,i=0;t[0].replace(/%[a-zA-Z%]/g,(function(t){"%%"!==t&&(o++,"%c"===t&&(i=o))})),t.splice(i,0,n)},e.save=function(t){try{null==t?e.storage.removeItem("debug"):e.storage.debug=t}catch(t){}},e.load=i,e.useColors=function(){if("undefined"!=typeof window&&window.process&&"renderer"===window.process.type)return!0;if("undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))return!1;return"undefined"!=typeof document&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||"undefined"!=typeof window&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)},e.storage="undefined"!=typeof chrome&&void 0!==chrome.storage?chrome.storage.local:function(){try{return window.localStorage}catch(t){}}(),e.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"],e.formatters.j=function(t){try{return JSON.stringify(t)}catch(t){return"[UnexpectedJSONParseError]: "+t.message}},e.enable(i())}).call(this,r(8))},function(t,e,r){function n(t){var r;function n(){if(n.enabled){var t=n,o=+new Date,i=o-(r||o);t.diff=i,t.prev=r,t.curr=o,r=o;for(var s=new Array(arguments.length),a=0;a<s.length;a++)s[a]=arguments[a];s[0]=e.coerce(s[0]),"string"!=typeof s[0]&&s.unshift("%O");var u=0;s[0]=s[0].replace(/%([a-zA-Z%])/g,(function(r,n){if("%%"===r)return r;u++;var o=e.formatters[n];if("function"==typeof o){var i=s[u];r=o.call(t,i),s.splice(u,1),u--}return r})),e.formatArgs.call(t,s);var c=n.log||e.log||console.log.bind(console);c.apply(t,s)}}return n.namespace=t,n.enabled=e.enabled(t),n.useColors=e.useColors(),n.color=function(t){var r,n=0;for(r in t)n=(n<<5)-n+t.charCodeAt(r),n|=0;return e.colors[Math.abs(n)%e.colors.length]}(t),n.destroy=o,"function"==typeof e.init&&e.init(n),e.instances.push(n),n}function o(){var t=e.instances.indexOf(this);return-1!==t&&(e.instances.splice(t,1),!0)}(e=t.exports=n.debug=n.default=n).coerce=function(t){return t instanceof Error?t.stack||t.message:t},e.disable=function(){e.enable("")},e.enable=function(t){var r;e.save(t),e.names=[],e.skips=[];var n=("string"==typeof t?t:"").split(/[\s,]+/),o=n.length;for(r=0;r<o;r++)n[r]&&("-"===(t=n[r].replace(/\*/g,".*?"))[0]?e.skips.push(new RegExp("^"+t.substr(1)+"$")):e.names.push(new RegExp("^"+t+"$")));for(r=0;r<e.instances.length;r++){var i=e.instances[r];i.enabled=e.enabled(i.namespace)}},e.enabled=function(t){if("*"===t[t.length-1])return!0;var r,n;for(r=0,n=e.skips.length;r<n;r++)if(e.skips[r].test(t))return!1;for(r=0,n=e.names.length;r<n;r++)if(e.names[r].test(t))return!0;return!1},e.humanize=r(121),e.instances=[],e.names=[],e.skips=[],e.formatters={}},function(t,e){function r(t){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var n=1e3,o=6e4,i=60*o,s=24*i;function a(t,e,r){if(!(t<e))return t<1.5*e?Math.floor(t/e)+" "+r:Math.ceil(t/e)+" "+r+"s"}t.exports=function(t,e){e=e||{};var u,c=r(t);if("string"===c&&t.length>0)return function(t){if((t=String(t)).length>100)return;var e=/^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(t);if(!e)return;var r=parseFloat(e[1]);switch((e[2]||"ms").toLowerCase()){case"years":case"year":case"yrs":case"yr":case"y":return 315576e5*r;case"days":case"day":case"d":return r*s;case"hours":case"hour":case"hrs":case"hr":case"h":return r*i;case"minutes":case"minute":case"mins":case"min":case"m":return r*o;case"seconds":case"second":case"secs":case"sec":case"s":return r*n;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return r;default:return}}(t);if("number"===c&&!1===isNaN(t))return e.long?a(u=t,s,"day")||a(u,i,"hour")||a(u,o,"minute")||a(u,n,"second")||u+" ms":function(t){if(t>=s)return Math.round(t/s)+"d";if(t>=i)return Math.round(t/i)+"h";if(t>=o)return Math.round(t/o)+"m";if(t>=n)return Math.round(t/n)+"s";return t+"ms"}(t);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(t))}},function(t,e,r){"use strict";var n=e;n.distinct=function(t){return t._fields&&Object.keys(t._fields).length>0?"field selection and slice":(Object.keys(n.distinct).every((function(r){return!t.options[r]||(e=r,!1)})),e);var e},n.distinct.select=n.distinct.slice=n.distinct.sort=n.distinct.limit=n.distinct.skip=n.distinct.batchSize=n.distinct.comment=n.distinct.maxScan=n.distinct.snapshot=n.distinct.hint=n.distinct.tailable=!0,n.findOneAndUpdate=n.findOneAndRemove=function(t){var e;return Object.keys(n.findOneAndUpdate).every((function(r){return!t.options[r]||(e=r,!1)})),e},n.findOneAndUpdate.limit=n.findOneAndUpdate.skip=n.findOneAndUpdate.batchSize=n.findOneAndUpdate.maxScan=n.findOneAndUpdate.snapshot=n.findOneAndUpdate.hint=n.findOneAndUpdate.tailable=n.findOneAndUpdate.comment=!0,n.count=function(t){return t._fields&&Object.keys(t._fields).length>0?"field selection and slice":(Object.keys(n.count).every((function(r){return!t.options[r]||(e=r,!1)})),e);var e},n.count.slice=n.count.batchSize=n.count.comment=n.count.maxScan=n.count.snapshot=n.count.tailable=!0},function(t,e){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children||(t.children=[]),Object.defineProperty(t,"loaded",{enumerable:!0,get:function(){return t.l}}),Object.defineProperty(t,"id",{enumerable:!0,get:function(){return t.i}}),t.webpackPolyfill=1),t}},function(t,e,r){"use strict";var n=r(70);if("unknown"==n.type)throw new Error("Unknown environment");t.exports=n.isNode?r(125):(n.isMongo,r(30))},function(t,e,r){"use strict";var n=r(30);function o(t){this.collection=t,this.collectionName=t.collectionName}r(68).inherits(o,n),o.prototype.find=function(t,e,r){this.collection.find(t,e,(function(t,e){if(t)return r(t);try{e.toArray(r)}catch(t){r(t)}}))},o.prototype.findOne=function(t,e,r){this.collection.findOne(t,e,r)},o.prototype.count=function(t,e,r){this.collection.count(t,e,r)},o.prototype.distinct=function(t,e,r,n){this.collection.distinct(t,e,r,n)},o.prototype.update=function(t,e,r,n){this.collection.update(t,e,r,n)},o.prototype.updateMany=function(t,e,r,n){this.collection.updateMany(t,e,r,n)},o.prototype.updateOne=function(t,e,r,n){this.collection.updateOne(t,e,r,n)},o.prototype.replaceOne=function(t,e,r,n){this.collection.replaceOne(t,e,r,n)},o.prototype.deleteOne=function(t,e,r){this.collection.deleteOne(t,e,r)},o.prototype.deleteMany=function(t,e,r){this.collection.deleteMany(t,e,r)},o.prototype.remove=function(t,e,r){this.collection.remove(t,e,r)},o.prototype.findAndModify=function(t,e,r,n){var o=Array.isArray(r.sort)?r.sort:[];this.collection.findAndModify(t,o,e,r,n)},o.prototype.findStream=function(t,e,r){return this.collection.find(t,e).stream(r)},o.prototype.findCursor=function(t,e){return this.collection.find(t,e)},t.exports=o},function(t,e,r){(function(r,n,o){var i,s,a,u;function c(t){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}
/* @preserve
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013-2017 Petka Antonov
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */u=function(){var t,e,i;return function t(e,r,n){function o(s,a){if(!r[s]){if(!e[s]){var u="function"==typeof _dereq_&&_dereq_;if(!a&&u)return u(s,!0);if(i)return i(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var l=r[s]={exports:{}};e[s][0].call(l.exports,(function(t){var r=e[s][1][t];return o(r||t)}),l,l.exports,t,e,r,n)}return r[s].exports}for(var i="function"==typeof _dereq_&&_dereq_,s=0;s<n.length;s++)o(n[s]);return o}({1:[function(t,e,r){"use strict";e.exports=function(t){var e=t._SomePromiseArray;function r(t){var r=new e(t),n=r.promise();return r.setHowMany(1),r.setUnwrap(),r.init(),n}t.any=function(t){return r(t)},t.prototype.any=function(){return r(this)}}},{}],2:[function(t,e,n){"use strict";var o;try{throw new Error}catch(t){o=t}var i=t("./schedule"),s=t("./queue"),a=t("./util");function u(){this._customScheduler=!1,this._isTickUsed=!1,this._lateQueue=new s(16),this._normalQueue=new s(16),this._haveDrainedQueues=!1,this._trampolineEnabled=!0;var t=this;this.drainQueues=function(){t._drainQueues()},this._schedule=i}function c(t,e,r){this._lateQueue.push(t,e,r),this._queueTick()}function l(t,e,r){this._normalQueue.push(t,e,r),this._queueTick()}function f(t){this._normalQueue._pushOne(t),this._queueTick()}u.prototype.setScheduler=function(t){var e=this._schedule;return this._schedule=t,this._customScheduler=!0,e},u.prototype.hasCustomScheduler=function(){return this._customScheduler},u.prototype.enableTrampoline=function(){this._trampolineEnabled=!0},u.prototype.disableTrampolineIfNecessary=function(){a.hasDevTools&&(this._trampolineEnabled=!1)},u.prototype.haveItemsQueued=function(){return this._isTickUsed||this._haveDrainedQueues},u.prototype.fatalError=function(t,e){e?(r.stderr.write("Fatal "+(t instanceof Error?t.stack:t)+"\n"),r.exit(2)):this.throwLater(t)},u.prototype.throwLater=function(t,e){if(1===arguments.length&&(e=t,t=function(){throw e}),"undefined"!=typeof setTimeout)setTimeout((function(){t(e)}),0);else try{this._schedule((function(){t(e)}))}catch(t){throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n")}},a.hasDevTools?(u.prototype.invokeLater=function(t,e,r){this._trampolineEnabled?c.call(this,t,e,r):this._schedule((function(){setTimeout((function(){t.call(e,r)}),100)}))},u.prototype.invoke=function(t,e,r){this._trampolineEnabled?l.call(this,t,e,r):this._schedule((function(){t.call(e,r)}))},u.prototype.settlePromises=function(t){this._trampolineEnabled?f.call(this,t):this._schedule((function(){t._settlePromises()}))}):(u.prototype.invokeLater=c,u.prototype.invoke=l,u.prototype.settlePromises=f),u.prototype._drainQueue=function(t){for(;t.length()>0;){var e=t.shift();if("function"==typeof e){var r=t.shift(),n=t.shift();e.call(r,n)}else e._settlePromises()}},u.prototype._drainQueues=function(){this._drainQueue(this._normalQueue),this._reset(),this._haveDrainedQueues=!0,this._drainQueue(this._lateQueue)},u.prototype._queueTick=function(){this._isTickUsed||(this._isTickUsed=!0,this._schedule(this.drainQueues))},u.prototype._reset=function(){this._isTickUsed=!1},e.exports=u,e.exports.firstLineError=o},{"./queue":26,"./schedule":29,"./util":36}],3:[function(t,e,r){"use strict";e.exports=function(t,e,r,n){var o=!1,i=function(t,e){this._reject(e)},s=function(t,e){e.promiseRejectionQueued=!0,e.bindingPromise._then(i,i,null,this,t)},a=function(t,e){0==(50397184&this._bitField)&&this._resolveCallback(e.target)},u=function(t,e){e.promiseRejectionQueued||this._reject(t)};t.prototype.bind=function(i){o||(o=!0,t.prototype._propagateFrom=n.propagateFromFunction(),t.prototype._boundValue=n.boundValueFunction());var c=r(i),l=new t(e);l._propagateFrom(this,1);var f=this._target();if(l._setBoundTo(c),c instanceof t){var p={promiseRejectionQueued:!1,promise:l,target:f,bindingPromise:c};f._then(e,s,void 0,l,p),c._then(a,u,void 0,l,p),l._setOnCancel(c)}else l._resolveCallback(f);return l},t.prototype._setBoundTo=function(t){void 0!==t?(this._bitField=2097152|this._bitField,this._boundTo=t):this._bitField=-2097153&this._bitField},t.prototype._isBound=function(){return 2097152==(2097152&this._bitField)},t.bind=function(e,r){return t.resolve(r).bind(e)}}},{}],4:[function(t,e,r){"use strict";var n;"undefined"!=typeof Promise&&(n=Promise);var o=t("./promise")();o.noConflict=function(){try{Promise===o&&(Promise=n)}catch(t){}return o},e.exports=o},{"./promise":22}],5:[function(t,e,r){"use strict";var n=Object.create;if(n){var o=n(null),i=n(null);o[" size"]=i[" size"]=0}e.exports=function(e){var r=t("./util"),n=r.canEvaluate;function o(t){return function(t,n){var o;if(null!=t&&(o=t[n]),"function"!=typeof o){var i="Object "+r.classString(t)+" has no method '"+r.toString(n)+"'";throw new e.TypeError(i)}return o}(t,this.pop()).apply(t,this)}function i(t){return t[this]}function s(t){var e=+this;return e<0&&(e=Math.max(0,e+t.length)),t[e]}r.isIdentifier,e.prototype.call=function(t){var e=[].slice.call(arguments,1);return e.push(t),this._then(o,void 0,void 0,e,void 0)},e.prototype.get=function(t){var e;if("number"==typeof t)e=s;else if(n){var r=(void 0)(t);e=null!==r?r:i}else e=i;return this._then(e,void 0,void 0,t,void 0)}}},{"./util":36}],6:[function(t,e,r){"use strict";e.exports=function(e,r,n,o){var i=t("./util"),s=i.tryCatch,a=i.errorObj,u=e._async;e.prototype.break=e.prototype.cancel=function(){if(!o.cancellation())return this._warn("cancellation is disabled");for(var t=this,e=t;t._isCancellable();){if(!t._cancelBy(e)){e._isFollowing()?e._followee().cancel():e._cancelBranched();break}var r=t._cancellationParent;if(null==r||!r._isCancellable()){t._isFollowing()?t._followee().cancel():t._cancelBranched();break}t._isFollowing()&&t._followee().cancel(),t._setWillBeCancelled(),e=t,t=r}},e.prototype._branchHasCancelled=function(){this._branchesRemainingToCancel--},e.prototype._enoughBranchesHaveCancelled=function(){return void 0===this._branchesRemainingToCancel||this._branchesRemainingToCancel<=0},e.prototype._cancelBy=function(t){return t===this?(this._branchesRemainingToCancel=0,this._invokeOnCancel(),!0):(this._branchHasCancelled(),!!this._enoughBranchesHaveCancelled()&&(this._invokeOnCancel(),!0))},e.prototype._cancelBranched=function(){this._enoughBranchesHaveCancelled()&&this._cancel()},e.prototype._cancel=function(){this._isCancellable()&&(this._setCancelled(),u.invoke(this._cancelPromises,this,void 0))},e.prototype._cancelPromises=function(){this._length()>0&&this._settlePromises()},e.prototype._unsetOnCancel=function(){this._onCancelField=void 0},e.prototype._isCancellable=function(){return this.isPending()&&!this._isCancelled()},e.prototype.isCancellable=function(){return this.isPending()&&!this.isCancelled()},e.prototype._doInvokeOnCancel=function(t,e){if(i.isArray(t))for(var r=0;r<t.length;++r)this._doInvokeOnCancel(t[r],e);else if(void 0!==t)if("function"==typeof t){if(!e){var n=s(t).call(this._boundValue());n===a&&(this._attachExtraTrace(n.e),u.throwLater(n.e))}}else t._resultCancelled(this)},e.prototype._invokeOnCancel=function(){var t=this._onCancel();this._unsetOnCancel(),u.invoke(this._doInvokeOnCancel,this,t)},e.prototype._invokeInternalOnCancel=function(){this._isCancellable()&&(this._doInvokeOnCancel(this._onCancel(),!0),this._unsetOnCancel())},e.prototype._resultCancelled=function(){this.cancel()}}},{"./util":36}],7:[function(t,e,r){"use strict";e.exports=function(e){var r=t("./util"),n=t("./es5").keys,o=r.tryCatch,i=r.errorObj;return function(t,s,a){return function(u){var c=a._boundValue();t:for(var l=0;l<t.length;++l){var f=t[l];if(f===Error||null!=f&&f.prototype instanceof Error){if(u instanceof f)return o(s).call(c,u)}else if("function"==typeof f){var p=o(f).call(c,u);if(p===i)return p;if(p)return o(s).call(c,u)}else if(r.isObject(u)){for(var h=n(f),y=0;y<h.length;++y){var d=h[y];if(f[d]!=u[d])continue t}return o(s).call(c,u)}}return e}}}},{"./es5":13,"./util":36}],8:[function(t,e,r){"use strict";e.exports=function(t){var e=!1,r=[];function n(){this._trace=new n.CapturedTrace(o())}function o(){var t=r.length-1;if(t>=0)return r[t]}return t.prototype._promiseCreated=function(){},t.prototype._pushContext=function(){},t.prototype._popContext=function(){return null},t._peekContext=t.prototype._peekContext=function(){},n.prototype._pushContext=function(){void 0!==this._trace&&(this._trace._promiseCreated=null,r.push(this._trace))},n.prototype._popContext=function(){if(void 0!==this._trace){var t=r.pop(),e=t._promiseCreated;return t._promiseCreated=null,e}return null},n.CapturedTrace=null,n.create=function(){if(e)return new n},n.deactivateLongStackTraces=function(){},n.activateLongStackTraces=function(){var r=t.prototype._pushContext,i=t.prototype._popContext,s=t._peekContext,a=t.prototype._peekContext,u=t.prototype._promiseCreated;n.deactivateLongStackTraces=function(){t.prototype._pushContext=r,t.prototype._popContext=i,t._peekContext=s,t.prototype._peekContext=a,t.prototype._promiseCreated=u,e=!1},e=!0,t.prototype._pushContext=n.prototype._pushContext,t.prototype._popContext=n.prototype._popContext,t._peekContext=t.prototype._peekContext=o,t.prototype._promiseCreated=function(){var t=this._peekContext();t&&null==t._promiseCreated&&(t._promiseCreated=this)}},n}},{}],9:[function(t,e,n){"use strict";e.exports=function(e,n){var o,i,s,a=e._getDomain,u=e._async,l=t("./errors").Warning,f=t("./util"),p=f.canAttachTrace,h=/[\\\/]bluebird[\\\/]js[\\\/](release|debug|instrumented)/,y=/\((?:timers\.js):\d+:\d+\)/,d=/[\/<\(](.+?):(\d+):(\d+)\)?\s*$/,_=null,m=null,v=!1,g=!(0==f.env("BLUEBIRD_DEBUG")),b=!(0==f.env("BLUEBIRD_WARNINGS")||!g&&!f.env("BLUEBIRD_WARNINGS")),w=!(0==f.env("BLUEBIRD_LONG_STACK_TRACES")||!g&&!f.env("BLUEBIRD_LONG_STACK_TRACES")),O=0!=f.env("BLUEBIRD_W_FORGOTTEN_RETURN")&&(b||!!f.env("BLUEBIRD_W_FORGOTTEN_RETURN"));e.prototype.suppressUnhandledRejections=function(){var t=this._target();t._bitField=-1048577&t._bitField|524288},e.prototype._ensurePossibleRejectionHandled=function(){if(0==(524288&this._bitField)){this._setRejectionIsUnhandled();var t=this;setTimeout((function(){t._notifyUnhandledRejection()}),1)}},e.prototype._notifyUnhandledRejectionIsHandled=function(){W("rejectionHandled",o,void 0,this)},e.prototype._setReturnedNonUndefined=function(){this._bitField=268435456|this._bitField},e.prototype._returnedNonUndefined=function(){return 0!=(268435456&this._bitField)},e.prototype._notifyUnhandledRejection=function(){if(this._isRejectionUnhandled()){var t=this._settledValue();this._setUnhandledRejectionIsNotified(),W("unhandledRejection",i,t,this)}},e.prototype._setUnhandledRejectionIsNotified=function(){this._bitField=262144|this._bitField},e.prototype._unsetUnhandledRejectionIsNotified=function(){this._bitField=-262145&this._bitField},e.prototype._isUnhandledRejectionNotified=function(){return(262144&this._bitField)>0},e.prototype._setRejectionIsUnhandled=function(){this._bitField=1048576|this._bitField},e.prototype._unsetRejectionIsUnhandled=function(){this._bitField=-1048577&this._bitField,this._isUnhandledRejectionNotified()&&(this._unsetUnhandledRejectionIsNotified(),this._notifyUnhandledRejectionIsHandled())},e.prototype._isRejectionUnhandled=function(){return(1048576&this._bitField)>0},e.prototype._warn=function(t,e,r){return L(t,e,r||this)},e.onPossiblyUnhandledRejection=function(t){var e=a();i="function"==typeof t?null===e?t:f.domainBind(e,t):void 0},e.onUnhandledRejectionHandled=function(t){var e=a();o="function"==typeof t?null===e?t:f.domainBind(e,t):void 0};var S=function(){};e.longStackTraces=function(){if(u.haveItemsQueued()&&!X.longStackTraces)throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");if(!X.longStackTraces&&Y()){var t=e.prototype._captureStackTrace,r=e.prototype._attachExtraTrace;X.longStackTraces=!0,S=function(){if(u.haveItemsQueued()&&!X.longStackTraces)throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/MqrFmX\n");e.prototype._captureStackTrace=t,e.prototype._attachExtraTrace=r,n.deactivateLongStackTraces(),u.enableTrampoline(),X.longStackTraces=!1},e.prototype._captureStackTrace=I,e.prototype._attachExtraTrace=F,n.activateLongStackTraces(),u.disableTrampolineIfNecessary()}},e.hasLongStackTraces=function(){return X.longStackTraces&&Y()};var A=function(){try{if("function"==typeof CustomEvent){var t=new CustomEvent("CustomEvent");return f.global.dispatchEvent(t),function(t,e){var r=new CustomEvent(t.toLowerCase(),{detail:e,cancelable:!0});return!f.global.dispatchEvent(r)}}return"function"==typeof Event?(t=new Event("CustomEvent"),f.global.dispatchEvent(t),function(t,e){var r=new Event(t.toLowerCase(),{cancelable:!0});return r.detail=e,!f.global.dispatchEvent(r)}):((t=document.createEvent("CustomEvent")).initCustomEvent("testingtheevent",!1,!0,{}),f.global.dispatchEvent(t),function(t,e){var r=document.createEvent("CustomEvent");return r.initCustomEvent(t.toLowerCase(),!1,!0,e),!f.global.dispatchEvent(r)})}catch(t){}return function(){return!1}}(),E=f.isNode?function(){return r.emit.apply(r,arguments)}:f.global?function(t){var e="on"+t.toLowerCase(),r=f.global[e];return!!r&&(r.apply(f.global,[].slice.call(arguments,1)),!0)}:function(){return!1};function j(t,e){return{promise:e}}var $={promiseCreated:j,promiseFulfilled:j,promiseRejected:j,promiseResolved:j,promiseCancelled:j,promiseChained:function(t,e,r){return{promise:e,child:r}},warning:function(t,e){return{warning:e}},unhandledRejection:function(t,e,r){return{reason:e,promise:r}},rejectionHandled:j},P=function(t){var e=!1;try{e=E.apply(null,arguments)}catch(t){u.throwLater(t),e=!0}var r=!1;try{r=A(t,$[t].apply(null,arguments))}catch(t){u.throwLater(t),r=!0}return r||e};function x(){return!1}function N(t,e,r){var n=this;try{t(e,r,(function(t){if("function"!=typeof t)throw new TypeError("onCancel must be a function, got: "+f.toString(t));n._attachCancellationCallback(t)}))}catch(t){return t}}function T(t){if(!this._isCancellable())return this;var e=this._onCancel();void 0!==e?f.isArray(e)?e.push(t):this._setOnCancel([e,t]):this._setOnCancel(t)}function k(){return this._onCancelField}function C(t){this._onCancelField=t}function R(){this._cancellationParent=void 0,this._onCancelField=void 0}function D(t,e){if(0!=(1&e)){this._cancellationParent=t;var r=t._branchesRemainingToCancel;void 0===r&&(r=0),t._branchesRemainingToCancel=r+1}0!=(2&e)&&t._isBound()&&this._setBoundTo(t._boundTo)}e.config=function(t){if("longStackTraces"in(t=Object(t))&&(t.longStackTraces?e.longStackTraces():!t.longStackTraces&&e.hasLongStackTraces()&&S()),"warnings"in t){var r=t.warnings;X.warnings=!!r,O=X.warnings,f.isObject(r)&&"wForgottenReturn"in r&&(O=!!r.wForgottenReturn)}if("cancellation"in t&&t.cancellation&&!X.cancellation){if(u.haveItemsQueued())throw new Error("cannot enable cancellation after promises are in use");e.prototype._clearCancellationData=R,e.prototype._propagateFrom=D,e.prototype._onCancel=k,e.prototype._setOnCancel=C,e.prototype._attachCancellationCallback=T,e.prototype._execute=N,B=D,X.cancellation=!0}return"monitoring"in t&&(t.monitoring&&!X.monitoring?(X.monitoring=!0,e.prototype._fireEvent=P):!t.monitoring&&X.monitoring&&(X.monitoring=!1,e.prototype._fireEvent=x)),e},e.prototype._fireEvent=x,e.prototype._execute=function(t,e,r){try{t(e,r)}catch(t){return t}},e.prototype._onCancel=function(){},e.prototype._setOnCancel=function(t){},e.prototype._attachCancellationCallback=function(t){},e.prototype._captureStackTrace=function(){},e.prototype._attachExtraTrace=function(){},e.prototype._clearCancellationData=function(){},e.prototype._propagateFrom=function(t,e){};var B=function(t,e){0!=(2&e)&&t._isBound()&&this._setBoundTo(t._boundTo)};function M(){var t=this._boundTo;return void 0!==t&&t instanceof e?t.isFulfilled()?t.value():void 0:t}function I(){this._trace=new J(this._peekContext())}function F(t,e){if(p(t)){var r=this._trace;if(void 0!==r&&e&&(r=r._parent),void 0!==r)r.attachExtraTrace(t);else if(!t.__stackCleaned__){var n=V(t);f.notEnumerableProp(t,"stack",n.message+"\n"+n.stack.join("\n")),f.notEnumerableProp(t,"__stackCleaned__",!0)}}}function L(t,r,n){if(X.warnings){var o,i=new l(t);if(r)n._attachExtraTrace(i);else if(X.longStackTraces&&(o=e._peekContext()))o.attachExtraTrace(i);else{var s=V(i);i.stack=s.message+"\n"+s.stack.join("\n")}P("warning",i)||q(i,"",!0)}}function U(t){for(var e=[],r=0;r<t.length;++r){var n=t[r],o="    (No stack trace)"===n||_.test(n),i=o&&K(n);o&&!i&&(v&&" "!==n.charAt(0)&&(n="    "+n),e.push(n))}return e}function V(t){var e=t.stack,r=t.toString();return e="string"==typeof e&&e.length>0?function(t){for(var e=t.stack.replace(/\s+$/g,"").split("\n"),r=0;r<e.length;++r){var n=e[r];if("    (No stack trace)"===n||_.test(n))break}return r>0&&"SyntaxError"!=t.name&&(e=e.slice(r)),e}(t):["    (No stack trace)"],{message:r,stack:"SyntaxError"==t.name?e:U(e)}}function q(t,e,r){if("undefined"!=typeof console){var n;if(f.isObject(t)){var o=t.stack;n=e+m(o,t)}else n=e+String(t);"function"==typeof s?s(n,r):"function"!=typeof console.log&&"object"!==c(console.log)||console.log(n)}}function W(t,e,r,n){var o=!1;try{"function"==typeof e&&(o=!0,"rejectionHandled"===t?e(n):e(r,n))}catch(t){u.throwLater(t)}"unhandledRejection"===t?P(t,r,n)||o||q(r,"Unhandled rejection "):P(t,n)}function H(t){var e;if("function"==typeof t)e="[function "+(t.name||"anonymous")+"]";else{if(e=t&&"function"==typeof t.toString?t.toString():f.toString(t),/\[object [a-zA-Z0-9$_]+\]/.test(e))try{e=JSON.stringify(t)}catch(t){}0===e.length&&(e="(empty array)")}return"(<"+function(t){return t.length<41?t:t.substr(0,38)+"..."}(e)+">, no stack trace)"}function Y(){return"function"==typeof G}var K=function(){return!1},z=/[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;function Q(t){var e=t.match(z);if(e)return{fileName:e[1],line:parseInt(e[2],10)}}function J(t){this._parent=t,this._promisesCreated=0;var e=this._length=1+(void 0===t?0:t._length);G(this,J),e>32&&this.uncycle()}f.inherits(J,Error),n.CapturedTrace=J,J.prototype.uncycle=function(){var t=this._length;if(!(t<2)){for(var e=[],r={},n=0,o=this;void 0!==o;++n)e.push(o),o=o._parent;for(n=(t=this._length=n)-1;n>=0;--n){var i=e[n].stack;void 0===r[i]&&(r[i]=n)}for(n=0;n<t;++n){var s=r[e[n].stack];if(void 0!==s&&s!==n){s>0&&(e[s-1]._parent=void 0,e[s-1]._length=1),e[n]._parent=void 0,e[n]._length=1;var a=n>0?e[n-1]:this;s<t-1?(a._parent=e[s+1],a._parent.uncycle(),a._length=a._parent._length+1):(a._parent=void 0,a._length=1);for(var u=a._length+1,c=n-2;c>=0;--c)e[c]._length=u,u++;return}}}},J.prototype.attachExtraTrace=function(t){if(!t.__stackCleaned__){this.uncycle();for(var e=V(t),r=e.message,n=[e.stack],o=this;void 0!==o;)n.push(U(o.stack.split("\n"))),o=o._parent;!function(t){for(var e=t[0],r=1;r<t.length;++r){for(var n=t[r],o=e.length-1,i=e[o],s=-1,a=n.length-1;a>=0;--a)if(n[a]===i){s=a;break}for(a=s;a>=0;--a){var u=n[a];if(e[o]!==u)break;e.pop(),o--}e=n}}(n),function(t){for(var e=0;e<t.length;++e)(0===t[e].length||e+1<t.length&&t[e][0]===t[e+1][0])&&(t.splice(e,1),e--)}(n),f.notEnumerableProp(t,"stack",function(t,e){for(var r=0;r<e.length-1;++r)e[r].push("From previous event:"),e[r]=e[r].join("\n");return r<e.length&&(e[r]=e[r].join("\n")),t+"\n"+e.join("\n")}(r,n)),f.notEnumerableProp(t,"__stackCleaned__",!0)}};var G=function(){var t=/^\s*at\s*/,e=function(t,e){return"string"==typeof t?t:void 0!==e.name&&void 0!==e.message?e.toString():H(e)};if("number"==typeof Error.stackTraceLimit&&"function"==typeof Error.captureStackTrace){Error.stackTraceLimit+=6,_=t,m=e;var r=Error.captureStackTrace;return K=function(t){return h.test(t)},function(t,e){Error.stackTraceLimit+=6,r(t,e),Error.stackTraceLimit-=6}}var n,o=new Error;if("string"==typeof o.stack&&o.stack.split("\n")[0].indexOf("stackDetection@")>=0)return _=/@/,m=e,v=!0,function(t){t.stack=(new Error).stack};try{throw new Error}catch(t){n="stack"in t}return!("stack"in o)&&n&&"number"==typeof Error.stackTraceLimit?(_=t,m=e,function(t){Error.stackTraceLimit+=6;try{throw new Error}catch(e){t.stack=e.stack}Error.stackTraceLimit-=6}):(m=function(t,e){return"string"==typeof t?t:"object"!==c(e)&&"function"!=typeof e||void 0===e.name||void 0===e.message?H(e):e.toString()},null)}();"undefined"!=typeof console&&void 0!==console.warn&&(s=function(t){console.warn(t)},f.isNode&&r.stderr.isTTY?s=function(t,e){var r=e?"[33m":"[31m";console.warn(r+t+"[0m\n")}:f.isNode||"string"!=typeof(new Error).stack||(s=function(t,e){console.warn("%c"+t,e?"color: darkorange":"color: red")}));var X={warnings:b,longStackTraces:!1,cancellation:!1,monitoring:!1};return w&&e.longStackTraces(),{longStackTraces:function(){return X.longStackTraces},warnings:function(){return X.warnings},cancellation:function(){return X.cancellation},monitoring:function(){return X.monitoring},propagateFromFunction:function(){return B},boundValueFunction:function(){return M},checkForgottenReturns:function(t,e,r,n,o){if(void 0===t&&null!==e&&O){if(void 0!==o&&o._returnedNonUndefined())return;if(0==(65535&n._bitField))return;r&&(r+=" ");var i="",s="";if(e._trace){for(var a=e._trace.stack.split("\n"),u=U(a),c=u.length-1;c>=0;--c){var l=u[c];if(!y.test(l)){var f=l.match(d);f&&(i="at "+f[1]+":"+f[2]+":"+f[3]+" ");break}}if(u.length>0){var p=u[0];for(c=0;c<a.length;++c)if(a[c]===p){c>0&&(s="\n"+a[c-1]);break}}}var h="a promise was created in a "+r+"handler "+i+"but was not returned from it, see http://goo.gl/rRqMUw"+s;n._warn(h,!0,e)}},setBounds:function(t,e){if(Y()){for(var r,n,o=t.stack.split("\n"),i=e.stack.split("\n"),s=-1,a=-1,u=0;u<o.length;++u)if(c=Q(o[u])){r=c.fileName,s=c.line;break}for(u=0;u<i.length;++u){var c;if(c=Q(i[u])){n=c.fileName,a=c.line;break}}s<0||a<0||!r||!n||r!==n||s>=a||(K=function(t){if(h.test(t))return!0;var e=Q(t);return!!(e&&e.fileName===r&&s<=e.line&&e.line<=a)})}},warn:L,deprecated:function(t,e){var r=t+" is deprecated and will be removed in a future version.";return e&&(r+=" Use "+e+" instead."),L(r)},CapturedTrace:J,fireDomEvent:A,fireGlobalEvent:E}}},{"./errors":12,"./util":36}],10:[function(t,e,r){"use strict";e.exports=function(t){function e(){return this.value}function r(){throw this.reason}t.prototype.return=t.prototype.thenReturn=function(r){return r instanceof t&&r.suppressUnhandledRejections(),this._then(e,void 0,void 0,{value:r},void 0)},t.prototype.throw=t.prototype.thenThrow=function(t){return this._then(r,void 0,void 0,{reason:t},void 0)},t.prototype.catchThrow=function(t){if(arguments.length<=1)return this._then(void 0,r,void 0,{reason:t},void 0);var e=arguments[1],n=function(){throw e};return this.caught(t,n)},t.prototype.catchReturn=function(r){if(arguments.length<=1)return r instanceof t&&r.suppressUnhandledRejections(),this._then(void 0,e,void 0,{value:r},void 0);var n=arguments[1];n instanceof t&&n.suppressUnhandledRejections();var o=function(){return n};return this.caught(r,o)}}},{}],11:[function(t,e,r){"use strict";e.exports=function(t,e){var r=t.reduce,n=t.all;function o(){return n(this)}t.prototype.each=function(t){return r(this,t,e,0)._then(o,void 0,void 0,this,void 0)},t.prototype.mapSeries=function(t){return r(this,t,e,e)},t.each=function(t,n){return r(t,n,e,0)._then(o,void 0,void 0,t,void 0)},t.mapSeries=function(t,n){return r(t,n,e,e)}}},{}],12:[function(t,e,r){"use strict";var n,o,i=t("./es5"),s=i.freeze,a=t("./util"),u=a.inherits,c=a.notEnumerableProp;function l(t,e){function r(n){if(!(this instanceof r))return new r(n);c(this,"message","string"==typeof n?n:e),c(this,"name",t),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):Error.call(this)}return u(r,Error),r}var f=l("Warning","warning"),p=l("CancellationError","cancellation error"),h=l("TimeoutError","timeout error"),y=l("AggregateError","aggregate error");try{n=TypeError,o=RangeError}catch(t){n=l("TypeError","type error"),o=l("RangeError","range error")}for(var d="join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" "),_=0;_<d.length;++_)"function"==typeof Array.prototype[d[_]]&&(y.prototype[d[_]]=Array.prototype[d[_]]);i.defineProperty(y.prototype,"length",{value:0,configurable:!1,writable:!0,enumerable:!0}),y.prototype.isOperational=!0;var m=0;function v(t){if(!(this instanceof v))return new v(t);c(this,"name","OperationalError"),c(this,"message",t),this.cause=t,this.isOperational=!0,t instanceof Error?(c(this,"message",t.message),c(this,"stack",t.stack)):Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)}y.prototype.toString=function(){var t=Array(4*m+1).join(" "),e="\n"+t+"AggregateError of:\n";m++,t=Array(4*m+1).join(" ");for(var r=0;r<this.length;++r){for(var n=this[r]===this?"[Circular AggregateError]":this[r]+"",o=n.split("\n"),i=0;i<o.length;++i)o[i]=t+o[i];e+=(n=o.join("\n"))+"\n"}return m--,e},u(v,Error);var g=Error.__BluebirdErrorTypes__;g||(g=s({CancellationError:p,TimeoutError:h,OperationalError:v,RejectionError:v,AggregateError:y}),i.defineProperty(Error,"__BluebirdErrorTypes__",{value:g,writable:!1,enumerable:!1,configurable:!1})),e.exports={Error:Error,TypeError:n,RangeError:o,CancellationError:g.CancellationError,OperationalError:g.OperationalError,TimeoutError:g.TimeoutError,AggregateError:g.AggregateError,Warning:f}},{"./es5":13,"./util":36}],13:[function(t,e,r){var n=function(){"use strict";return void 0===this}();if(n)e.exports={freeze:Object.freeze,defineProperty:Object.defineProperty,getDescriptor:Object.getOwnPropertyDescriptor,keys:Object.keys,names:Object.getOwnPropertyNames,getPrototypeOf:Object.getPrototypeOf,isArray:Array.isArray,isES5:n,propertyIsWritable:function(t,e){var r=Object.getOwnPropertyDescriptor(t,e);return!(r&&!r.writable&&!r.set)}};else{var o={}.hasOwnProperty,i={}.toString,s={}.constructor.prototype,a=function(t){var e=[];for(var r in t)o.call(t,r)&&e.push(r);return e};e.exports={isArray:function(t){try{return"[object Array]"===i.call(t)}catch(t){return!1}},keys:a,names:a,defineProperty:function(t,e,r){return t[e]=r.value,t},getDescriptor:function(t,e){return{value:t[e]}},freeze:function(t){return t},getPrototypeOf:function(t){try{return Object(t).constructor.prototype}catch(t){return s}},isES5:n,propertyIsWritable:function(){return!0}}}},{}],14:[function(t,e,r){"use strict";e.exports=function(t,e){var r=t.map;t.prototype.filter=function(t,n){return r(this,t,n,e)},t.filter=function(t,n,o){return r(t,n,o,e)}}},{}],15:[function(t,e,r){"use strict";e.exports=function(e,r,n){var o=t("./util"),i=e.CancellationError,s=o.errorObj,a=t("./catch_filter")(n);function u(t,e,r){this.promise=t,this.type=e,this.handler=r,this.called=!1,this.cancelPromise=null}function c(t){this.finallyHandler=t}function l(t,e){return null!=t.cancelPromise&&(arguments.length>1?t.cancelPromise._reject(e):t.cancelPromise._cancel(),t.cancelPromise=null,!0)}function f(){return h.call(this,this.promise._target()._settledValue())}function p(t){if(!l(this,t))return s.e=t,s}function h(t){var o=this.promise,a=this.handler;if(!this.called){this.called=!0;var u=this.isFinallyHandler()?a.call(o._boundValue()):a.call(o._boundValue(),t);if(u===n)return u;if(void 0!==u){o._setReturnedNonUndefined();var h=r(u,o);if(h instanceof e){if(null!=this.cancelPromise){if(h._isCancelled()){var y=new i("late cancellation observer");return o._attachExtraTrace(y),s.e=y,s}h.isPending()&&h._attachCancellationCallback(new c(this))}return h._then(f,p,void 0,this,void 0)}}}return o.isRejected()?(l(this),s.e=t,s):(l(this),t)}return u.prototype.isFinallyHandler=function(){return 0===this.type},c.prototype._resultCancelled=function(){l(this.finallyHandler)},e.prototype._passThrough=function(t,e,r,n){return"function"!=typeof t?this.then():this._then(r,n,void 0,new u(this,e,t),void 0)},e.prototype.lastly=e.prototype.finally=function(t){return this._passThrough(t,0,h,h)},e.prototype.tap=function(t){return this._passThrough(t,1,h)},e.prototype.tapCatch=function(t){var r=arguments.length;if(1===r)return this._passThrough(t,1,void 0,h);var n,i=new Array(r-1),s=0;for(n=0;n<r-1;++n){var u=arguments[n];if(!o.isObject(u))return e.reject(new TypeError("tapCatch statement predicate: expecting an object but got "+o.classString(u)));i[s++]=u}i.length=s;var c=arguments[n];return this._passThrough(a(i,c,this),1,void 0,h)},u}},{"./catch_filter":7,"./util":36}],16:[function(t,e,r){"use strict";e.exports=function(e,r,n,o,i,s){var a=t("./errors").TypeError,u=t("./util"),c=u.errorObj,l=u.tryCatch,f=[];function p(t,r,o,i){if(s.cancellation()){var a=new e(n),u=this._finallyPromise=new e(n);this._promise=a.lastly((function(){return u})),a._captureStackTrace(),a._setOnCancel(this)}else(this._promise=new e(n))._captureStackTrace();this._stack=i,this._generatorFunction=t,this._receiver=r,this._generator=void 0,this._yieldHandlers="function"==typeof o?[o].concat(f):f,this._yieldedPromise=null,this._cancellationPhase=!1}u.inherits(p,i),p.prototype._isResolved=function(){return null===this._promise},p.prototype._cleanup=function(){this._promise=this._generator=null,s.cancellation()&&null!==this._finallyPromise&&(this._finallyPromise._fulfill(),this._finallyPromise=null)},p.prototype._promiseCancelled=function(){if(!this._isResolved()){var t;if(void 0!==this._generator.return)this._promise._pushContext(),t=l(this._generator.return).call(this._generator,void 0),this._promise._popContext();else{var r=new e.CancellationError("generator .return() sentinel");e.coroutine.returnSentinel=r,this._promise._attachExtraTrace(r),this._promise._pushContext(),t=l(this._generator.throw).call(this._generator,r),this._promise._popContext()}this._cancellationPhase=!0,this._yieldedPromise=null,this._continue(t)}},p.prototype._promiseFulfilled=function(t){this._yieldedPromise=null,this._promise._pushContext();var e=l(this._generator.next).call(this._generator,t);this._promise._popContext(),this._continue(e)},p.prototype._promiseRejected=function(t){this._yieldedPromise=null,this._promise._attachExtraTrace(t),this._promise._pushContext();var e=l(this._generator.throw).call(this._generator,t);this._promise._popContext(),this._continue(e)},p.prototype._resultCancelled=function(){if(this._yieldedPromise instanceof e){var t=this._yieldedPromise;this._yieldedPromise=null,t.cancel()}},p.prototype.promise=function(){return this._promise},p.prototype._run=function(){this._generator=this._generatorFunction.call(this._receiver),this._receiver=this._generatorFunction=void 0,this._promiseFulfilled(void 0)},p.prototype._continue=function(t){var r=this._promise;if(t===c)return this._cleanup(),this._cancellationPhase?r.cancel():r._rejectCallback(t.e,!1);var n=t.value;if(!0===t.done)return this._cleanup(),this._cancellationPhase?r.cancel():r._resolveCallback(n);var i=o(n,this._promise);if(i instanceof e||null!==(i=function(t,r,n){for(var i=0;i<r.length;++i){n._pushContext();var s=l(r[i])(t);if(n._popContext(),s===c){n._pushContext();var a=e.reject(c.e);return n._popContext(),a}var u=o(s,n);if(u instanceof e)return u}return null}(i,this._yieldHandlers,this._promise))){var s=(i=i._target())._bitField;0==(50397184&s)?(this._yieldedPromise=i,i._proxy(this,null)):0!=(33554432&s)?e._async.invoke(this._promiseFulfilled,this,i._value()):0!=(16777216&s)?e._async.invoke(this._promiseRejected,this,i._reason()):this._promiseCancelled()}else this._promiseRejected(new a("A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/MqrFmX\n\n".replace("%s",String(n))+"From coroutine:\n"+this._stack.split("\n").slice(1,-7).join("\n")))},e.coroutine=function(t,e){if("function"!=typeof t)throw new a("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");var r=Object(e).yieldHandler,n=p,o=(new Error).stack;return function(){var e=t.apply(this,arguments),i=new n(void 0,void 0,r,o),s=i.promise();return i._generator=e,i._promiseFulfilled(void 0),s}},e.coroutine.addYieldHandler=function(t){if("function"!=typeof t)throw new a("expecting a function but got "+u.classString(t));f.push(t)},e.spawn=function(t){if(s.deprecated("Promise.spawn()","Promise.coroutine()"),"function"!=typeof t)return r("generatorFunction must be a function\n\n    See http://goo.gl/MqrFmX\n");var n=new p(t,this),o=n.promise();return n._run(e.spawn),o}}},{"./errors":12,"./util":36}],17:[function(t,e,r){"use strict";e.exports=function(e,r,n,o,i,s){var a=t("./util");a.canEvaluate,a.tryCatch,a.errorObj,e.join=function(){var t,e=arguments.length-1;e>0&&"function"==typeof arguments[e]&&(t=arguments[e]);var n=[].slice.call(arguments);t&&n.pop();var o=new r(n).promise();return void 0!==t?o.spread(t):o}}},{"./util":36}],18:[function(t,e,r){"use strict";e.exports=function(e,r,n,o,i,s){var a=e._getDomain,u=t("./util"),l=u.tryCatch,f=u.errorObj,p=e._async;function h(t,e,r,n){this.constructor$(t),this._promise._captureStackTrace();var o=a();this._callback=null===o?e:u.domainBind(o,e),this._preservedValues=n===i?new Array(this.length()):null,this._limit=r,this._inFlight=0,this._queue=[],p.invoke(this._asyncInit,this,void 0)}function y(t,r,o,i){if("function"!=typeof r)return n("expecting a function but got "+u.classString(r));var s=0;if(void 0!==o){if("object"!==c(o)||null===o)return e.reject(new TypeError("options argument must be an object but it is "+u.classString(o)));if("number"!=typeof o.concurrency)return e.reject(new TypeError("'concurrency' must be a number but it is "+u.classString(o.concurrency)));s=o.concurrency}return new h(t,r,s="number"==typeof s&&isFinite(s)&&s>=1?s:0,i).promise()}u.inherits(h,r),h.prototype._asyncInit=function(){this._init$(void 0,-2)},h.prototype._init=function(){},h.prototype._promiseFulfilled=function(t,r){var n=this._values,i=this.length(),a=this._preservedValues,u=this._limit;if(r<0){if(n[r=-1*r-1]=t,u>=1&&(this._inFlight--,this._drainQueue(),this._isResolved()))return!0}else{if(u>=1&&this._inFlight>=u)return n[r]=t,this._queue.push(r),!1;null!==a&&(a[r]=t);var c=this._promise,p=this._callback,h=c._boundValue();c._pushContext();var y=l(p).call(h,t,r,i),d=c._popContext();if(s.checkForgottenReturns(y,d,null!==a?"Promise.filter":"Promise.map",c),y===f)return this._reject(y.e),!0;var _=o(y,this._promise);if(_ instanceof e){var m=(_=_._target())._bitField;if(0==(50397184&m))return u>=1&&this._inFlight++,n[r]=_,_._proxy(this,-1*(r+1)),!1;if(0==(33554432&m))return 0!=(16777216&m)?(this._reject(_._reason()),!0):(this._cancel(),!0);y=_._value()}n[r]=y}return++this._totalResolved>=i&&(null!==a?this._filter(n,a):this._resolve(n),!0)},h.prototype._drainQueue=function(){for(var t=this._queue,e=this._limit,r=this._values;t.length>0&&this._inFlight<e;){if(this._isResolved())return;var n=t.pop();this._promiseFulfilled(r[n],n)}},h.prototype._filter=function(t,e){for(var r=e.length,n=new Array(r),o=0,i=0;i<r;++i)t[i]&&(n[o++]=e[i]);n.length=o,this._resolve(n)},h.prototype.preservedValues=function(){return this._preservedValues},e.prototype.map=function(t,e){return y(this,t,e,null)},e.map=function(t,e,r,n){return y(t,e,r,n)}}},{"./util":36}],19:[function(t,e,r){"use strict";e.exports=function(e,r,n,o,i){var s=t("./util"),a=s.tryCatch;e.method=function(t){if("function"!=typeof t)throw new e.TypeError("expecting a function but got "+s.classString(t));return function(){var n=new e(r);n._captureStackTrace(),n._pushContext();var o=a(t).apply(this,arguments),s=n._popContext();return i.checkForgottenReturns(o,s,"Promise.method",n),n._resolveFromSyncValue(o),n}},e.attempt=e.try=function(t){if("function"!=typeof t)return o("expecting a function but got "+s.classString(t));var n,u=new e(r);if(u._captureStackTrace(),u._pushContext(),arguments.length>1){i.deprecated("calling Promise.try with more than 1 argument");var c=arguments[1],l=arguments[2];n=s.isArray(c)?a(t).apply(l,c):a(t).call(l,c)}else n=a(t)();var f=u._popContext();return i.checkForgottenReturns(n,f,"Promise.try",u),u._resolveFromSyncValue(n),u},e.prototype._resolveFromSyncValue=function(t){t===s.errorObj?this._rejectCallback(t.e,!1):this._resolveCallback(t,!0)}}},{"./util":36}],20:[function(t,e,r){"use strict";var n=t("./util"),o=n.maybeWrapAsError,i=t("./errors").OperationalError,s=t("./es5"),a=/^(?:name|message|stack|cause)$/;function u(t){var e;if(function(t){return t instanceof Error&&s.getPrototypeOf(t)===Error.prototype}(t)){(e=new i(t)).name=t.name,e.message=t.message,e.stack=t.stack;for(var r=s.keys(t),o=0;o<r.length;++o){var u=r[o];a.test(u)||(e[u]=t[u])}return e}return n.markAsOriginatingFromRejection(t),t}e.exports=function(t,e){return function(r,n){if(null!==t){if(r){var i=u(o(r));t._attachExtraTrace(i),t._reject(i)}else if(e){var s=[].slice.call(arguments,1);t._fulfill(s)}else t._fulfill(n);t=null}}}},{"./errors":12,"./es5":13,"./util":36}],21:[function(t,e,r){"use strict";e.exports=function(e){var r=t("./util"),n=e._async,o=r.tryCatch,i=r.errorObj;function s(t,e){if(!r.isArray(t))return a.call(this,t,e);var s=o(e).apply(this._boundValue(),[null].concat(t));s===i&&n.throwLater(s.e)}function a(t,e){var r=this._boundValue(),s=void 0===t?o(e).call(r,null):o(e).call(r,null,t);s===i&&n.throwLater(s.e)}function u(t,e){if(!t){var r=new Error(t+"");r.cause=t,t=r}var s=o(e).call(this._boundValue(),t);s===i&&n.throwLater(s.e)}e.prototype.asCallback=e.prototype.nodeify=function(t,e){if("function"==typeof t){var r=a;void 0!==e&&Object(e).spread&&(r=s),this._then(r,u,void 0,this,t)}return this}}},{"./util":36}],22:[function(t,e,n){"use strict";e.exports=function(){var n=function(){return new y("circular promise resolution chain\n\n    See http://goo.gl/MqrFmX\n")},o=function(){return new x.PromiseInspection(this._target())},i=function(t){return x.reject(new y(t))};function s(){}var a,u={},c=t("./util");a=c.isNode?function(){var t=r.domain;return void 0===t&&(t=null),t}:function(){return null},c.notEnumerableProp(x,"_getDomain",a);var l=t("./es5"),f=t("./async"),p=new f;l.defineProperty(x,"_async",{value:p});var h=t("./errors"),y=x.TypeError=h.TypeError;x.RangeError=h.RangeError;var d=x.CancellationError=h.CancellationError;x.TimeoutError=h.TimeoutError,x.OperationalError=h.OperationalError,x.RejectionError=h.OperationalError,x.AggregateError=h.AggregateError;var _=function(){},m={},v={},g=t("./thenables")(x,_),b=t("./promise_array")(x,_,g,i,s),w=t("./context")(x),O=w.create,S=t("./debuggability")(x,w),A=(S.CapturedTrace,t("./finally")(x,g,v)),E=t("./catch_filter")(v),j=t("./nodeback"),$=c.errorObj,P=c.tryCatch;function x(t){t!==_&&function(t,e){if(null==t||t.constructor!==x)throw new y("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/MqrFmX\n");if("function"!=typeof e)throw new y("expecting a function but got "+c.classString(e))}(this,t),this._bitField=0,this._fulfillmentHandler0=void 0,this._rejectionHandler0=void 0,this._promise0=void 0,this._receiver0=void 0,this._resolveFromExecutor(t),this._promiseCreated(),this._fireEvent("promiseCreated",this)}function N(t){this.promise._resolveCallback(t)}function T(t){this.promise._rejectCallback(t,!1)}function k(t){var e=new x(_);e._fulfillmentHandler0=t,e._rejectionHandler0=t,e._promise0=t,e._receiver0=t}return x.prototype.toString=function(){return"[object Promise]"},x.prototype.caught=x.prototype.catch=function(t){var e=arguments.length;if(e>1){var r,n=new Array(e-1),o=0;for(r=0;r<e-1;++r){var s=arguments[r];if(!c.isObject(s))return i("Catch statement predicate: expecting an object but got "+c.classString(s));n[o++]=s}return n.length=o,t=arguments[r],this.then(void 0,E(n,t,this))}return this.then(void 0,t)},x.prototype.reflect=function(){return this._then(o,o,void 0,this,void 0)},x.prototype.then=function(t,e){if(S.warnings()&&arguments.length>0&&"function"!=typeof t&&"function"!=typeof e){var r=".then() only accepts functions but was passed: "+c.classString(t);arguments.length>1&&(r+=", "+c.classString(e)),this._warn(r)}return this._then(t,e,void 0,void 0,void 0)},x.prototype.done=function(t,e){this._then(t,e,void 0,void 0,void 0)._setIsFinal()},x.prototype.spread=function(t){return"function"!=typeof t?i("expecting a function but got "+c.classString(t)):this.all()._then(t,void 0,void 0,m,void 0)},x.prototype.toJSON=function(){var t={isFulfilled:!1,isRejected:!1,fulfillmentValue:void 0,rejectionReason:void 0};return this.isFulfilled()?(t.fulfillmentValue=this.value(),t.isFulfilled=!0):this.isRejected()&&(t.rejectionReason=this.reason(),t.isRejected=!0),t},x.prototype.all=function(){return arguments.length>0&&this._warn(".all() was passed arguments but it does not take any"),new b(this).promise()},x.prototype.error=function(t){return this.caught(c.originatesFromRejection,t)},x.getNewLibraryCopy=e.exports,x.is=function(t){return t instanceof x},x.fromNode=x.fromCallback=function(t){var e=new x(_);e._captureStackTrace();var r=arguments.length>1&&!!Object(arguments[1]).multiArgs,n=P(t)(j(e,r));return n===$&&e._rejectCallback(n.e,!0),e._isFateSealed()||e._setAsyncGuaranteed(),e},x.all=function(t){return new b(t).promise()},x.cast=function(t){var e=g(t);return e instanceof x||((e=new x(_))._captureStackTrace(),e._setFulfilled(),e._rejectionHandler0=t),e},x.resolve=x.fulfilled=x.cast,x.reject=x.rejected=function(t){var e=new x(_);return e._captureStackTrace(),e._rejectCallback(t,!0),e},x.setScheduler=function(t){if("function"!=typeof t)throw new y("expecting a function but got "+c.classString(t));return p.setScheduler(t)},x.prototype._then=function(t,e,r,n,o){var i=void 0!==o,s=i?o:new x(_),u=this._target(),l=u._bitField;i||(s._propagateFrom(this,3),s._captureStackTrace(),void 0===n&&0!=(2097152&this._bitField)&&(n=0!=(50397184&l)?this._boundValue():u===this?void 0:this._boundTo),this._fireEvent("promiseChained",this,s));var f=a();if(0!=(50397184&l)){var h,y,m=u._settlePromiseCtx;0!=(33554432&l)?(y=u._rejectionHandler0,h=t):0!=(16777216&l)?(y=u._fulfillmentHandler0,h=e,u._unsetRejectionIsUnhandled()):(m=u._settlePromiseLateCancellationObserver,y=new d("late cancellation observer"),u._attachExtraTrace(y),h=e),p.invoke(m,u,{handler:null===f?h:"function"==typeof h&&c.domainBind(f,h),promise:s,receiver:n,value:y})}else u._addCallbacks(t,e,s,n,f);return s},x.prototype._length=function(){return 65535&this._bitField},x.prototype._isFateSealed=function(){return 0!=(117506048&this._bitField)},x.prototype._isFollowing=function(){return 67108864==(67108864&this._bitField)},x.prototype._setLength=function(t){this._bitField=-65536&this._bitField|65535&t},x.prototype._setFulfilled=function(){this._bitField=33554432|this._bitField,this._fireEvent("promiseFulfilled",this)},x.prototype._setRejected=function(){this._bitField=16777216|this._bitField,this._fireEvent("promiseRejected",this)},x.prototype._setFollowing=function(){this._bitField=67108864|this._bitField,this._fireEvent("promiseResolved",this)},x.prototype._setIsFinal=function(){this._bitField=4194304|this._bitField},x.prototype._isFinal=function(){return(4194304&this._bitField)>0},x.prototype._unsetCancelled=function(){this._bitField=-65537&this._bitField},x.prototype._setCancelled=function(){this._bitField=65536|this._bitField,this._fireEvent("promiseCancelled",this)},x.prototype._setWillBeCancelled=function(){this._bitField=8388608|this._bitField},x.prototype._setAsyncGuaranteed=function(){p.hasCustomScheduler()||(this._bitField=134217728|this._bitField)},x.prototype._receiverAt=function(t){var e=0===t?this._receiver0:this[4*t-4+3];if(e!==u)return void 0===e&&this._isBound()?this._boundValue():e},x.prototype._promiseAt=function(t){return this[4*t-4+2]},x.prototype._fulfillmentHandlerAt=function(t){return this[4*t-4+0]},x.prototype._rejectionHandlerAt=function(t){return this[4*t-4+1]},x.prototype._boundValue=function(){},x.prototype._migrateCallback0=function(t){t._bitField;var e=t._fulfillmentHandler0,r=t._rejectionHandler0,n=t._promise0,o=t._receiverAt(0);void 0===o&&(o=u),this._addCallbacks(e,r,n,o,null)},x.prototype._migrateCallbackAt=function(t,e){var r=t._fulfillmentHandlerAt(e),n=t._rejectionHandlerAt(e),o=t._promiseAt(e),i=t._receiverAt(e);void 0===i&&(i=u),this._addCallbacks(r,n,o,i,null)},x.prototype._addCallbacks=function(t,e,r,n,o){var i=this._length();if(i>=65531&&(i=0,this._setLength(0)),0===i)this._promise0=r,this._receiver0=n,"function"==typeof t&&(this._fulfillmentHandler0=null===o?t:c.domainBind(o,t)),"function"==typeof e&&(this._rejectionHandler0=null===o?e:c.domainBind(o,e));else{var s=4*i-4;this[s+2]=r,this[s+3]=n,"function"==typeof t&&(this[s+0]=null===o?t:c.domainBind(o,t)),"function"==typeof e&&(this[s+1]=null===o?e:c.domainBind(o,e))}return this._setLength(i+1),i},x.prototype._proxy=function(t,e){this._addCallbacks(void 0,void 0,e,t,null)},x.prototype._resolveCallback=function(t,e){if(0==(117506048&this._bitField)){if(t===this)return this._rejectCallback(n(),!1);var r=g(t,this);if(!(r instanceof x))return this._fulfill(t);e&&this._propagateFrom(r,2);var o=r._target();if(o!==this){var i=o._bitField;if(0==(50397184&i)){var s=this._length();s>0&&o._migrateCallback0(this);for(var a=1;a<s;++a)o._migrateCallbackAt(this,a);this._setFollowing(),this._setLength(0),this._setFollowee(o)}else if(0!=(33554432&i))this._fulfill(o._value());else if(0!=(16777216&i))this._reject(o._reason());else{var u=new d("late cancellation observer");o._attachExtraTrace(u),this._reject(u)}}else this._reject(n())}},x.prototype._rejectCallback=function(t,e,r){var n=c.ensureErrorObject(t),o=n===t;if(!o&&!r&&S.warnings()){var i="a promise was rejected with a non-error: "+c.classString(t);this._warn(i,!0)}this._attachExtraTrace(n,!!e&&o),this._reject(t)},x.prototype._resolveFromExecutor=function(t){if(t!==_){var e=this;this._captureStackTrace(),this._pushContext();var r=!0,n=this._execute(t,(function(t){e._resolveCallback(t)}),(function(t){e._rejectCallback(t,r)}));r=!1,this._popContext(),void 0!==n&&e._rejectCallback(n,!0)}},x.prototype._settlePromiseFromHandler=function(t,e,r,n){var o=n._bitField;if(0==(65536&o)){var i;n._pushContext(),e===m?r&&"number"==typeof r.length?i=P(t).apply(this._boundValue(),r):(i=$).e=new y("cannot .spread() a non-array: "+c.classString(r)):i=P(t).call(e,r);var s=n._popContext();0==(65536&(o=n._bitField))&&(i===v?n._reject(r):i===$?n._rejectCallback(i.e,!1):(S.checkForgottenReturns(i,s,"",n,this),n._resolveCallback(i)))}},x.prototype._target=function(){for(var t=this;t._isFollowing();)t=t._followee();return t},x.prototype._followee=function(){return this._rejectionHandler0},x.prototype._setFollowee=function(t){this._rejectionHandler0=t},x.prototype._settlePromise=function(t,e,r,n){var i=t instanceof x,a=this._bitField,u=0!=(134217728&a);0!=(65536&a)?(i&&t._invokeInternalOnCancel(),r instanceof A&&r.isFinallyHandler()?(r.cancelPromise=t,P(e).call(r,n)===$&&t._reject($.e)):e===o?t._fulfill(o.call(r)):r instanceof s?r._promiseCancelled(t):i||t instanceof b?t._cancel():r.cancel()):"function"==typeof e?i?(u&&t._setAsyncGuaranteed(),this._settlePromiseFromHandler(e,r,n,t)):e.call(r,n,t):r instanceof s?r._isResolved()||(0!=(33554432&a)?r._promiseFulfilled(n,t):r._promiseRejected(n,t)):i&&(u&&t._setAsyncGuaranteed(),0!=(33554432&a)?t._fulfill(n):t._reject(n))},x.prototype._settlePromiseLateCancellationObserver=function(t){var e=t.handler,r=t.promise,n=t.receiver,o=t.value;"function"==typeof e?r instanceof x?this._settlePromiseFromHandler(e,n,o,r):e.call(n,o,r):r instanceof x&&r._reject(o)},x.prototype._settlePromiseCtx=function(t){this._settlePromise(t.promise,t.handler,t.receiver,t.value)},x.prototype._settlePromise0=function(t,e,r){var n=this._promise0,o=this._receiverAt(0);this._promise0=void 0,this._receiver0=void 0,this._settlePromise(n,t,o,e)},x.prototype._clearCallbackDataAtIndex=function(t){var e=4*t-4;this[e+2]=this[e+3]=this[e+0]=this[e+1]=void 0},x.prototype._fulfill=function(t){var e=this._bitField;if(!((117506048&e)>>>16)){if(t===this){var r=n();return this._attachExtraTrace(r),this._reject(r)}this._setFulfilled(),this._rejectionHandler0=t,(65535&e)>0&&(0!=(134217728&e)?this._settlePromises():p.settlePromises(this))}},x.prototype._reject=function(t){var e=this._bitField;if(!((117506048&e)>>>16)){if(this._setRejected(),this._fulfillmentHandler0=t,this._isFinal())return p.fatalError(t,c.isNode);(65535&e)>0?p.settlePromises(this):this._ensurePossibleRejectionHandled()}},x.prototype._fulfillPromises=function(t,e){for(var r=1;r<t;r++){var n=this._fulfillmentHandlerAt(r),o=this._promiseAt(r),i=this._receiverAt(r);this._clearCallbackDataAtIndex(r),this._settlePromise(o,n,i,e)}},x.prototype._rejectPromises=function(t,e){for(var r=1;r<t;r++){var n=this._rejectionHandlerAt(r),o=this._promiseAt(r),i=this._receiverAt(r);this._clearCallbackDataAtIndex(r),this._settlePromise(o,n,i,e)}},x.prototype._settlePromises=function(){var t=this._bitField,e=65535&t;if(e>0){if(0!=(16842752&t)){var r=this._fulfillmentHandler0;this._settlePromise0(this._rejectionHandler0,r,t),this._rejectPromises(e,r)}else{var n=this._rejectionHandler0;this._settlePromise0(this._fulfillmentHandler0,n,t),this._fulfillPromises(e,n)}this._setLength(0)}this._clearCancellationData()},x.prototype._settledValue=function(){var t=this._bitField;return 0!=(33554432&t)?this._rejectionHandler0:0!=(16777216&t)?this._fulfillmentHandler0:void 0},x.defer=x.pending=function(){return S.deprecated("Promise.defer","new Promise"),{promise:new x(_),resolve:N,reject:T}},c.notEnumerableProp(x,"_makeSelfResolutionError",n),t("./method")(x,_,g,i,S),t("./bind")(x,_,g,S),t("./cancel")(x,b,i,S),t("./direct_resolve")(x),t("./synchronous_inspection")(x),t("./join")(x,b,g,_,p,a),x.Promise=x,x.version="3.5.1",t("./map.js")(x,b,i,g,_,S),t("./call_get.js")(x),t("./using.js")(x,i,g,O,_,S),t("./timers.js")(x,_,S),t("./generators.js")(x,i,_,g,s,S),t("./nodeify.js")(x),t("./promisify.js")(x,_),t("./props.js")(x,b,g,i),t("./race.js")(x,_,g,i),t("./reduce.js")(x,b,i,g,_,S),t("./settle.js")(x,b,S),t("./some.js")(x,b,i),t("./filter.js")(x,_),t("./each.js")(x,_),t("./any.js")(x),c.toFastProperties(x),c.toFastProperties(x.prototype),k({a:1}),k({b:2}),k({c:3}),k(1),k((function(){})),k(void 0),k(!1),k(new x(_)),S.setBounds(f.firstLineError,c.lastLineError),x}},{"./any.js":1,"./async":2,"./bind":3,"./call_get.js":5,"./cancel":6,"./catch_filter":7,"./context":8,"./debuggability":9,"./direct_resolve":10,"./each.js":11,"./errors":12,"./es5":13,"./filter.js":14,"./finally":15,"./generators.js":16,"./join":17,"./map.js":18,"./method":19,"./nodeback":20,"./nodeify.js":21,"./promise_array":23,"./promisify.js":24,"./props.js":25,"./race.js":27,"./reduce.js":28,"./settle.js":30,"./some.js":31,"./synchronous_inspection":32,"./thenables":33,"./timers.js":34,"./using.js":35,"./util":36}],23:[function(t,e,r){"use strict";e.exports=function(e,r,n,o,i){var s=t("./util");function a(t){var n=this._promise=new e(r);t instanceof e&&n._propagateFrom(t,3),n._setOnCancel(this),this._values=t,this._length=0,this._totalResolved=0,this._init(void 0,-2)}return s.isArray,s.inherits(a,i),a.prototype.length=function(){return this._length},a.prototype.promise=function(){return this._promise},a.prototype._init=function t(r,i){var a=n(this._values,this._promise);if(a instanceof e){var u=(a=a._target())._bitField;if(this._values=a,0==(50397184&u))return this._promise._setAsyncGuaranteed(),a._then(t,this._reject,void 0,this,i);if(0==(33554432&u))return 0!=(16777216&u)?this._reject(a._reason()):this._cancel();a=a._value()}if(null!==(a=s.asArray(a)))0!==a.length?this._iterate(a):-5===i?this._resolveEmptyArray():this._resolve(function(t){switch(t){case-2:return[];case-3:return{};case-6:return new Map}}(i));else{var c=o("expecting an array or an iterable object but got "+s.classString(a)).reason();this._promise._rejectCallback(c,!1)}},a.prototype._iterate=function(t){var r=this.getActualLength(t.length);this._length=r,this._values=this.shouldCopyValues()?new Array(r):this._values;for(var o=this._promise,i=!1,s=null,a=0;a<r;++a){var u=n(t[a],o);s=u instanceof e?(u=u._target())._bitField:null,i?null!==s&&u.suppressUnhandledRejections():null!==s?0==(50397184&s)?(u._proxy(this,a),this._values[a]=u):i=0!=(33554432&s)?this._promiseFulfilled(u._value(),a):0!=(16777216&s)?this._promiseRejected(u._reason(),a):this._promiseCancelled(a):i=this._promiseFulfilled(u,a)}i||o._setAsyncGuaranteed()},a.prototype._isResolved=function(){return null===this._values},a.prototype._resolve=function(t){this._values=null,this._promise._fulfill(t)},a.prototype._cancel=function(){!this._isResolved()&&this._promise._isCancellable()&&(this._values=null,this._promise._cancel())},a.prototype._reject=function(t){this._values=null,this._promise._rejectCallback(t,!1)},a.prototype._promiseFulfilled=function(t,e){return this._values[e]=t,++this._totalResolved>=this._length&&(this._resolve(this._values),!0)},a.prototype._promiseCancelled=function(){return this._cancel(),!0},a.prototype._promiseRejected=function(t){return this._totalResolved++,this._reject(t),!0},a.prototype._resultCancelled=function(){if(!this._isResolved()){var t=this._values;if(this._cancel(),t instanceof e)t.cancel();else for(var r=0;r<t.length;++r)t[r]instanceof e&&t[r].cancel()}},a.prototype.shouldCopyValues=function(){return!0},a.prototype.getActualLength=function(t){return t},a}},{"./util":36}],24:[function(t,e,r){"use strict";e.exports=function(e,r){var n={},o=t("./util"),i=t("./nodeback"),s=o.withAppended,a=o.maybeWrapAsError,u=o.canEvaluate,l=t("./errors").TypeError,f={__isPromisified__:!0},p=new RegExp("^(?:"+["arity","length","name","arguments","caller","callee","prototype","__isPromisified__"].join("|")+")$"),h=function(t){return o.isIdentifier(t)&&"_"!==t.charAt(0)&&"constructor"!==t};function y(t){return!p.test(t)}function d(t){try{return!0===t.__isPromisified__}catch(t){return!1}}function _(t,e,r){var n=o.getDataPropertyOrDefault(t,e+r,f);return!!n&&d(n)}function m(t,e,r,n){for(var i=o.inheritedDataKeys(t),s=[],a=0;a<i.length;++a){var u=i[a],c=t[u],f=n===h||h(u);"function"!=typeof c||d(c)||_(t,u,e)||!n(u,c,t,f)||s.push(u,c)}return function(t,e,r){for(var n=0;n<t.length;n+=2){var o=t[n];if(r.test(o))for(var i=o.replace(r,""),s=0;s<t.length;s+=2)if(t[s]===i)throw new l("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/MqrFmX\n".replace("%s",e))}}(s,e,r),s}var v=u?void 0:function(t,u,c,l,f,p){var h=function(){return this}(),y=t;function d(){var o=u;u===n&&(o=this);var c=new e(r);c._captureStackTrace();var l="string"==typeof y&&this!==h?this[y]:t,f=i(c,p);try{l.apply(o,s(arguments,f))}catch(t){c._rejectCallback(a(t),!0,!0)}return c._isFateSealed()||c._setAsyncGuaranteed(),c}return"string"==typeof y&&(t=l),o.notEnumerableProp(d,"__isPromisified__",!0),d};function g(t,e,r,i,s){for(var a=new RegExp(e.replace(/([$])/,"\\$")+"$"),u=m(t,e,a,r),c=0,l=u.length;c<l;c+=2){var f=u[c],p=u[c+1],h=f+e;if(i===v)t[h]=v(f,n,f,p,e,s);else{var y=i(p,(function(){return v(f,n,f,p,e,s)}));o.notEnumerableProp(y,"__isPromisified__",!0),t[h]=y}}return o.toFastProperties(t),t}e.promisify=function(t,e){if("function"!=typeof t)throw new l("expecting a function but got "+o.classString(t));if(d(t))return t;var r=function(t,e,r){return v(t,e,void 0,t,null,r)}(t,void 0===(e=Object(e)).context?n:e.context,!!e.multiArgs);return o.copyDescriptors(t,r,y),r},e.promisifyAll=function(t,e){if("function"!=typeof t&&"object"!==c(t))throw new l("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/MqrFmX\n");var r=!!(e=Object(e)).multiArgs,n=e.suffix;"string"!=typeof n&&(n="Async");var i=e.filter;"function"!=typeof i&&(i=h);var s=e.promisifier;if("function"!=typeof s&&(s=v),!o.isIdentifier(n))throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/MqrFmX\n");for(var a=o.inheritedDataKeys(t),u=0;u<a.length;++u){var f=t[a[u]];"constructor"!==a[u]&&o.isClass(f)&&(g(f.prototype,n,i,s,r),g(f,n,i,s,r))}return g(t,n,i,s,r)}}},{"./errors":12,"./nodeback":20,"./util":36}],25:[function(t,e,r){"use strict";e.exports=function(e,r,n,o){var i,s=t("./util"),a=s.isObject,u=t("./es5");"function"==typeof Map&&(i=Map);var c=function(){var t=0,e=0;function r(r,n){this[t]=r,this[t+e]=n,t++}return function(n){e=n.size,t=0;var o=new Array(2*n.size);return n.forEach(r,o),o}}();function l(t){var e,r=!1;if(void 0!==i&&t instanceof i)e=c(t),r=!0;else{var n=u.keys(t),o=n.length;e=new Array(2*o);for(var s=0;s<o;++s){var a=n[s];e[s]=t[a],e[s+o]=a}}this.constructor$(e),this._isMap=r,this._init$(void 0,r?-6:-3)}function f(t){var r,i=n(t);return a(i)?(r=i instanceof e?i._then(e.props,void 0,void 0,void 0,void 0):new l(i).promise(),i instanceof e&&r._propagateFrom(i,2),r):o("cannot await properties of a non-object\n\n    See http://goo.gl/MqrFmX\n")}s.inherits(l,r),l.prototype._init=function(){},l.prototype._promiseFulfilled=function(t,e){if(this._values[e]=t,++this._totalResolved>=this._length){var r;if(this._isMap)r=function(t){for(var e=new i,r=t.length/2|0,n=0;n<r;++n){var o=t[r+n],s=t[n];e.set(o,s)}return e}(this._values);else{r={};for(var n=this.length(),o=0,s=this.length();o<s;++o)r[this._values[o+n]]=this._values[o]}return this._resolve(r),!0}return!1},l.prototype.shouldCopyValues=function(){return!1},l.prototype.getActualLength=function(t){return t>>1},e.prototype.props=function(){return f(this)},e.props=function(t){return f(t)}}},{"./es5":13,"./util":36}],26:[function(t,e,r){"use strict";function n(t){this._capacity=t,this._length=0,this._front=0}n.prototype._willBeOverCapacity=function(t){return this._capacity<t},n.prototype._pushOne=function(t){var e=this.length();this._checkCapacity(e+1),this[this._front+e&this._capacity-1]=t,this._length=e+1},n.prototype.push=function(t,e,r){var n=this.length()+3;if(this._willBeOverCapacity(n))return this._pushOne(t),this._pushOne(e),void this._pushOne(r);var o=this._front+n-3;this._checkCapacity(n);var i=this._capacity-1;this[o+0&i]=t,this[o+1&i]=e,this[o+2&i]=r,this._length=n},n.prototype.shift=function(){var t=this._front,e=this[t];return this[t]=void 0,this._front=t+1&this._capacity-1,this._length--,e},n.prototype.length=function(){return this._length},n.prototype._checkCapacity=function(t){this._capacity<t&&this._resizeTo(this._capacity<<1)},n.prototype._resizeTo=function(t){var e=this._capacity;this._capacity=t,function(t,e,r,n,o){for(var i=0;i<o;++i)r[i+n]=t[i+e],t[i+e]=void 0}(this,0,this,e,this._front+this._length&e-1)},e.exports=n},{}],27:[function(t,e,r){"use strict";e.exports=function(e,r,n,o){var i=t("./util");function s(t,a){var u,c=n(t);if(c instanceof e)return(u=c).then((function(t){return s(t,u)}));if(null===(t=i.asArray(t)))return o("expecting an array or an iterable object but got "+i.classString(t));var l=new e(r);void 0!==a&&l._propagateFrom(a,3);for(var f=l._fulfill,p=l._reject,h=0,y=t.length;h<y;++h){var d=t[h];(void 0!==d||h in t)&&e.cast(d)._then(f,p,void 0,l,null)}return l}e.race=function(t){return s(t,void 0)},e.prototype.race=function(){return s(this,void 0)}}},{"./util":36}],28:[function(t,e,r){"use strict";e.exports=function(e,r,n,o,i,s){var a=e._getDomain,u=t("./util"),c=u.tryCatch;function l(t,r,n,o){this.constructor$(t);var s=a();this._fn=null===s?r:u.domainBind(s,r),void 0!==n&&(n=e.resolve(n))._attachCancellationCallback(this),this._initialValue=n,this._currentCancellable=null,this._eachValues=o===i?Array(this._length):0===o?null:void 0,this._promise._captureStackTrace(),this._init$(void 0,-5)}function f(t,e){this.isFulfilled()?e._resolve(t):e._reject(t)}function p(t,e,r,o){return"function"!=typeof e?n("expecting a function but got "+u.classString(e)):new l(t,e,r,o).promise()}function h(t){this.accum=t,this.array._gotAccum(t);var r=o(this.value,this.array._promise);return r instanceof e?(this.array._currentCancellable=r,r._then(y,void 0,void 0,this,void 0)):y.call(this,r)}function y(t){var r,n=this.array,o=n._promise,i=c(n._fn);o._pushContext(),(r=void 0!==n._eachValues?i.call(o._boundValue(),t,this.index,this.length):i.call(o._boundValue(),this.accum,t,this.index,this.length))instanceof e&&(n._currentCancellable=r);var a=o._popContext();return s.checkForgottenReturns(r,a,void 0!==n._eachValues?"Promise.each":"Promise.reduce",o),r}u.inherits(l,r),l.prototype._gotAccum=function(t){void 0!==this._eachValues&&null!==this._eachValues&&t!==i&&this._eachValues.push(t)},l.prototype._eachComplete=function(t){return null!==this._eachValues&&this._eachValues.push(t),this._eachValues},l.prototype._init=function(){},l.prototype._resolveEmptyArray=function(){this._resolve(void 0!==this._eachValues?this._eachValues:this._initialValue)},l.prototype.shouldCopyValues=function(){return!1},l.prototype._resolve=function(t){this._promise._resolveCallback(t),this._values=null},l.prototype._resultCancelled=function(t){if(t===this._initialValue)return this._cancel();this._isResolved()||(this._resultCancelled$(),this._currentCancellable instanceof e&&this._currentCancellable.cancel(),this._initialValue instanceof e&&this._initialValue.cancel())},l.prototype._iterate=function(t){var r,n;this._values=t;var o=t.length;if(void 0!==this._initialValue?(r=this._initialValue,n=0):(r=e.resolve(t[0]),n=1),this._currentCancellable=r,!r.isRejected())for(;n<o;++n){var i={accum:null,value:t[n],index:n,length:o,array:this};r=r._then(h,void 0,void 0,i,void 0)}void 0!==this._eachValues&&(r=r._then(this._eachComplete,void 0,void 0,this,void 0)),r._then(f,f,void 0,r,this)},e.prototype.reduce=function(t,e){return p(this,t,e,null)},e.reduce=function(t,e,r,n){return p(t,e,r,n)}}},{"./util":36}],29:[function(t,e,i){"use strict";var s,a,u,c,l,f=t("./util"),p=f.getNativePromise();if(f.isNode&&"undefined"==typeof MutationObserver){var h=n.setImmediate,y=r.nextTick;s=f.isRecentNode?function(t){h.call(n,t)}:function(t){y.call(r,t)}}else if("function"==typeof p&&"function"==typeof p.resolve){var d=p.resolve();s=function(t){d.then(t)}}else s="undefined"==typeof MutationObserver||"undefined"!=typeof window&&window.navigator&&(window.navigator.standalone||window.cordova)?void 0!==o?function(t){o(t)}:"undefined"!=typeof setTimeout?function(t){setTimeout(t,0)}:function(){throw new Error("No async scheduler available\n\n    See http://goo.gl/MqrFmX\n")}:(a=document.createElement("div"),u={attributes:!0},c=!1,l=document.createElement("div"),new MutationObserver((function(){a.classList.toggle("foo"),c=!1})).observe(l,u),function(t){var e=new MutationObserver((function(){e.disconnect(),t()}));e.observe(a,u),c||(c=!0,l.classList.toggle("foo"))});e.exports=s},{"./util":36}],30:[function(t,e,r){"use strict";e.exports=function(e,r,n){var o=e.PromiseInspection;function i(t){this.constructor$(t)}t("./util").inherits(i,r),i.prototype._promiseResolved=function(t,e){return this._values[t]=e,++this._totalResolved>=this._length&&(this._resolve(this._values),!0)},i.prototype._promiseFulfilled=function(t,e){var r=new o;return r._bitField=33554432,r._settledValueField=t,this._promiseResolved(e,r)},i.prototype._promiseRejected=function(t,e){var r=new o;return r._bitField=16777216,r._settledValueField=t,this._promiseResolved(e,r)},e.settle=function(t){return n.deprecated(".settle()",".reflect()"),new i(t).promise()},e.prototype.settle=function(){return e.settle(this)}}},{"./util":36}],31:[function(t,e,r){"use strict";e.exports=function(e,r,n){var o=t("./util"),i=t("./errors").RangeError,s=t("./errors").AggregateError,a=o.isArray,u={};function c(t){this.constructor$(t),this._howMany=0,this._unwrap=!1,this._initialized=!1}function l(t,e){if((0|e)!==e||e<0)return n("expecting a positive integer\n\n    See http://goo.gl/MqrFmX\n");var r=new c(t),o=r.promise();return r.setHowMany(e),r.init(),o}o.inherits(c,r),c.prototype._init=function(){if(this._initialized)if(0!==this._howMany){this._init$(void 0,-5);var t=a(this._values);!this._isResolved()&&t&&this._howMany>this._canPossiblyFulfill()&&this._reject(this._getRangeError(this.length()))}else this._resolve([])},c.prototype.init=function(){this._initialized=!0,this._init()},c.prototype.setUnwrap=function(){this._unwrap=!0},c.prototype.howMany=function(){return this._howMany},c.prototype.setHowMany=function(t){this._howMany=t},c.prototype._promiseFulfilled=function(t){return this._addFulfilled(t),this._fulfilled()===this.howMany()&&(this._values.length=this.howMany(),1===this.howMany()&&this._unwrap?this._resolve(this._values[0]):this._resolve(this._values),!0)},c.prototype._promiseRejected=function(t){return this._addRejected(t),this._checkOutcome()},c.prototype._promiseCancelled=function(){return this._values instanceof e||null==this._values?this._cancel():(this._addRejected(u),this._checkOutcome())},c.prototype._checkOutcome=function(){if(this.howMany()>this._canPossiblyFulfill()){for(var t=new s,e=this.length();e<this._values.length;++e)this._values[e]!==u&&t.push(this._values[e]);return t.length>0?this._reject(t):this._cancel(),!0}return!1},c.prototype._fulfilled=function(){return this._totalResolved},c.prototype._rejected=function(){return this._values.length-this.length()},c.prototype._addRejected=function(t){this._values.push(t)},c.prototype._addFulfilled=function(t){this._values[this._totalResolved++]=t},c.prototype._canPossiblyFulfill=function(){return this.length()-this._rejected()},c.prototype._getRangeError=function(t){var e="Input array must contain at least "+this._howMany+" items but contains only "+t+" items";return new i(e)},c.prototype._resolveEmptyArray=function(){this._reject(this._getRangeError(0))},e.some=function(t,e){return l(t,e)},e.prototype.some=function(t){return l(this,t)},e._SomePromiseArray=c}},{"./errors":12,"./util":36}],32:[function(t,e,r){"use strict";e.exports=function(t){function e(t){void 0!==t?(t=t._target(),this._bitField=t._bitField,this._settledValueField=t._isFateSealed()?t._settledValue():void 0):(this._bitField=0,this._settledValueField=void 0)}e.prototype._settledValue=function(){return this._settledValueField};var r=e.prototype.value=function(){if(!this.isFulfilled())throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/MqrFmX\n");return this._settledValue()},n=e.prototype.error=e.prototype.reason=function(){if(!this.isRejected())throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/MqrFmX\n");return this._settledValue()},o=e.prototype.isFulfilled=function(){return 0!=(33554432&this._bitField)},i=e.prototype.isRejected=function(){return 0!=(16777216&this._bitField)},s=e.prototype.isPending=function(){return 0==(50397184&this._bitField)},a=e.prototype.isResolved=function(){return 0!=(50331648&this._bitField)};e.prototype.isCancelled=function(){return 0!=(8454144&this._bitField)},t.prototype.__isCancelled=function(){return 65536==(65536&this._bitField)},t.prototype._isCancelled=function(){return this._target().__isCancelled()},t.prototype.isCancelled=function(){return 0!=(8454144&this._target()._bitField)},t.prototype.isPending=function(){return s.call(this._target())},t.prototype.isRejected=function(){return i.call(this._target())},t.prototype.isFulfilled=function(){return o.call(this._target())},t.prototype.isResolved=function(){return a.call(this._target())},t.prototype.value=function(){return r.call(this._target())},t.prototype.reason=function(){var t=this._target();return t._unsetRejectionIsUnhandled(),n.call(t)},t.prototype._value=function(){return this._settledValue()},t.prototype._reason=function(){return this._unsetRejectionIsUnhandled(),this._settledValue()},t.PromiseInspection=e}},{}],33:[function(t,e,r){"use strict";e.exports=function(e,r){var n=t("./util"),o=n.errorObj,i=n.isObject,s={}.hasOwnProperty;return function(t,a){if(i(t)){if(t instanceof e)return t;var u=function(t){try{return function(t){return t.then}(t)}catch(t){return o.e=t,o}}(t);if(u===o){a&&a._pushContext();var c=e.reject(u.e);return a&&a._popContext(),c}if("function"==typeof u)return function(t){try{return s.call(t,"_promise0")}catch(t){return!1}}(t)?(c=new e(r),t._then(c._fulfill,c._reject,void 0,c,null),c):function(t,i,s){var a=new e(r),u=a;s&&s._pushContext(),a._captureStackTrace(),s&&s._popContext();var c=n.tryCatch(i).call(t,(function(t){a&&(a._resolveCallback(t),a=null)}),(function(t){a&&(a._rejectCallback(t,!1,!0),a=null)}));return a&&c===o&&(a._rejectCallback(c.e,!0,!0),a=null),u}(t,u,a)}return t}}},{"./util":36}],34:[function(t,e,r){"use strict";e.exports=function(e,r,n){var o=t("./util"),i=e.TimeoutError;function s(t){this.handle=t}s.prototype._resultCancelled=function(){clearTimeout(this.handle)};var a=function(t){return u(+this).thenReturn(t)},u=e.delay=function(t,o){var i,u;return void 0!==o?(i=e.resolve(o)._then(a,null,null,t,void 0),n.cancellation()&&o instanceof e&&i._setOnCancel(o)):(i=new e(r),u=setTimeout((function(){i._fulfill()}),+t),n.cancellation()&&i._setOnCancel(new s(u)),i._captureStackTrace()),i._setAsyncGuaranteed(),i};function c(t){return clearTimeout(this.handle),t}function l(t){throw clearTimeout(this.handle),t}e.prototype.delay=function(t){return u(t,this)},e.prototype.timeout=function(t,e){var r,a;t=+t;var u=new s(setTimeout((function(){r.isPending()&&function(t,e,r){var n;n="string"!=typeof e?e instanceof Error?e:new i("operation timed out"):new i(e),o.markAsOriginatingFromRejection(n),t._attachExtraTrace(n),t._reject(n),null!=r&&r.cancel()}(r,e,a)}),t));return n.cancellation()?(a=this.then(),(r=a._then(c,l,void 0,u,void 0))._setOnCancel(u)):r=this._then(c,l,void 0,u,void 0),r}}},{"./util":36}],35:[function(t,e,r){"use strict";e.exports=function(e,r,n,o,i,s){var a=t("./util"),u=t("./errors").TypeError,c=t("./util").inherits,l=a.errorObj,f=a.tryCatch,p={};function h(t){setTimeout((function(){throw t}),0)}function y(t,r){var o=0,s=t.length,a=new e(i);return function i(){if(o>=s)return a._fulfill();var u=function(t){var e=n(t);return e!==t&&"function"==typeof t._isDisposable&&"function"==typeof t._getDisposer&&t._isDisposable()&&e._setDisposable(t._getDisposer()),e}(t[o++]);if(u instanceof e&&u._isDisposable()){try{u=n(u._getDisposer().tryDispose(r),t.promise)}catch(t){return h(t)}if(u instanceof e)return u._then(i,h,null,null,null)}i()}(),a}function d(t,e,r){this._data=t,this._promise=e,this._context=r}function _(t,e,r){this.constructor$(t,e,r)}function m(t){return d.isDisposer(t)?(this.resources[this.index]._setDisposable(t),t.promise()):t}function v(t){this.length=t,this.promise=null,this[t-1]=null}d.prototype.data=function(){return this._data},d.prototype.promise=function(){return this._promise},d.prototype.resource=function(){return this.promise().isFulfilled()?this.promise().value():p},d.prototype.tryDispose=function(t){var e=this.resource(),r=this._context;void 0!==r&&r._pushContext();var n=e!==p?this.doDispose(e,t):null;return void 0!==r&&r._popContext(),this._promise._unsetDisposable(),this._data=null,n},d.isDisposer=function(t){return null!=t&&"function"==typeof t.resource&&"function"==typeof t.tryDispose},c(_,d),_.prototype.doDispose=function(t,e){return this.data().call(t,t,e)},v.prototype._resultCancelled=function(){for(var t=this.length,r=0;r<t;++r){var n=this[r];n instanceof e&&n.cancel()}},e.using=function(){var t=arguments.length;if(t<2)return r("you must pass at least 2 arguments to Promise.using");var o,i=arguments[t-1];if("function"!=typeof i)return r("expecting a function but got "+a.classString(i));var u=!0;2===t&&Array.isArray(arguments[0])?(t=(o=arguments[0]).length,u=!1):(o=arguments,t--);for(var c=new v(t),p=0;p<t;++p){var h=o[p];if(d.isDisposer(h)){var _=h;(h=h.promise())._setDisposable(_)}else{var g=n(h);g instanceof e&&(h=g._then(m,null,null,{resources:c,index:p},void 0))}c[p]=h}var b=new Array(c.length);for(p=0;p<b.length;++p)b[p]=e.resolve(c[p]).reflect();var w=e.all(b).then((function(t){for(var e=0;e<t.length;++e){var r=t[e];if(r.isRejected())return l.e=r.error(),l;if(!r.isFulfilled())return void w.cancel();t[e]=r.value()}O._pushContext(),i=f(i);var n=u?i.apply(void 0,t):i(t),o=O._popContext();return s.checkForgottenReturns(n,o,"Promise.using",O),n})),O=w.lastly((function(){var t=new e.PromiseInspection(w);return y(c,t)}));return c.promise=O,O._setOnCancel(c),O},e.prototype._setDisposable=function(t){this._bitField=131072|this._bitField,this._disposer=t},e.prototype._isDisposable=function(){return(131072&this._bitField)>0},e.prototype._getDisposer=function(){return this._disposer},e.prototype._unsetDisposable=function(){this._bitField=-131073&this._bitField,this._disposer=void 0},e.prototype.disposer=function(t){if("function"==typeof t)return new _(t,this,o());throw new u}}},{"./errors":12,"./util":36}],36:[function(t,e,o){"use strict";var i=t("./es5"),s="undefined"==typeof navigator,a={e:{}},u,l="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==n?n:void 0!==this?this:null;function f(){try{var t=u;return u=null,t.apply(this,arguments)}catch(t){return a.e=t,a}}function p(t){return u=t,f}var h=function(t,e){var r={}.hasOwnProperty;function n(){for(var n in this.constructor=t,this.constructor$=e,e.prototype)r.call(e.prototype,n)&&"$"!==n.charAt(n.length-1)&&(this[n+"$"]=e.prototype[n])}return n.prototype=e.prototype,t.prototype=new n,t.prototype};function y(t){return null==t||!0===t||!1===t||"string"==typeof t||"number"==typeof t}function d(t){return"function"==typeof t||"object"===c(t)&&null!==t}function _(t){return y(t)?new Error(P(t)):t}function m(t,e){var r,n=t.length,o=new Array(n+1);for(r=0;r<n;++r)o[r]=t[r];return o[r]=e,o}function v(t,e,r){if(!i.isES5)return{}.hasOwnProperty.call(t,e)?t[e]:void 0;var n=Object.getOwnPropertyDescriptor(t,e);return null!=n?null==n.get&&null==n.set?n.value:r:void 0}function g(t,e,r){if(y(t))return t;var n={value:r,configurable:!0,enumerable:!1,writable:!0};return i.defineProperty(t,e,n),t}function b(t){throw t}var w=function(){var t=[Array.prototype,Object.prototype,Function.prototype],e=function(e){for(var r=0;r<t.length;++r)if(t[r]===e)return!0;return!1};if(i.isES5){var r=Object.getOwnPropertyNames;return function(t){for(var n=[],o=Object.create(null);null!=t&&!e(t);){var s;try{s=r(t)}catch(t){return n}for(var a=0;a<s.length;++a){var u=s[a];if(!o[u]){o[u]=!0;var c=Object.getOwnPropertyDescriptor(t,u);null!=c&&null==c.get&&null==c.set&&n.push(u)}}t=i.getPrototypeOf(t)}return n}}var n={}.hasOwnProperty;return function(r){if(e(r))return[];var o=[];t:for(var i in r)if(n.call(r,i))o.push(i);else{for(var s=0;s<t.length;++s)if(n.call(t[s],i))continue t;o.push(i)}return o}}(),O=/this\s*\.\s*\S+\s*=/;function S(t){try{if("function"==typeof t){var e=i.names(t.prototype),r=i.isES5&&e.length>1,n=e.length>0&&!(1===e.length&&"constructor"===e[0]),o=O.test(t+"")&&i.names(t).length>0;if(r||n||o)return!0}return!1}catch(t){return!1}}function A(t){function e(){}e.prototype=t;for(var r=8;r--;)new e;return t}var E=/^[a-z$_][a-z$_0-9]*$/i;function j(t){return E.test(t)}function $(t,e,r){for(var n=new Array(t),o=0;o<t;++o)n[o]=e+o+r;return n}function P(t){try{return t+""}catch(t){return"[no string representation]"}}function x(t){return t instanceof Error||null!==t&&"object"===c(t)&&"string"==typeof t.message&&"string"==typeof t.name}function N(t){try{g(t,"isOperational",!0)}catch(t){}}function T(t){return null!=t&&(t instanceof Error.__BluebirdErrorTypes__.OperationalError||!0===t.isOperational)}function k(t){return x(t)&&i.propertyIsWritable(t,"stack")}var C="stack"in new Error?function(t){return k(t)?t:new Error(P(t))}:function(t){if(k(t))return t;try{throw new Error(P(t))}catch(t){return t}};function R(t){return{}.toString.call(t)}function D(t,e,r){for(var n=i.names(t),o=0;o<n.length;++o){var s=n[o];if(r(s))try{i.defineProperty(e,s,i.getDescriptor(t,s))}catch(t){}}}var B=function(t){return i.isArray(t)?t:null};if("undefined"!=typeof Symbol&&Symbol.iterator){var M="function"==typeof Array.from?function(t){return Array.from(t)}:function(t){for(var e,r=[],n=t[Symbol.iterator]();!(e=n.next()).done;)r.push(e.value);return r};B=function(t){return i.isArray(t)?t:null!=t&&"function"==typeof t[Symbol.iterator]?M(t):null}}var I=void 0!==r&&"[object process]"===R(r).toLowerCase(),F=void 0!==r&&void 0!==r.env;function L(t){return F?r.env[t]:void 0}function U(){if("function"==typeof Promise)try{var t=new Promise((function(){}));if("[object Promise]"==={}.toString.call(t))return Promise}catch(t){}}function V(t,e){return t.bind(e)}var q={isClass:S,isIdentifier:j,inheritedDataKeys:w,getDataPropertyOrDefault:v,thrower:b,isArray:i.isArray,asArray:B,notEnumerableProp:g,isPrimitive:y,isObject:d,isError:x,canEvaluate:s,errorObj:a,tryCatch:p,inherits:h,withAppended:m,maybeWrapAsError:_,toFastProperties:A,filledRange:$,toString:P,canAttachTrace:k,ensureErrorObject:C,originatesFromRejection:T,markAsOriginatingFromRejection:N,classString:R,copyDescriptors:D,hasDevTools:"undefined"!=typeof chrome&&chrome&&"function"==typeof chrome.loadTimes,isNode:I,hasEnvVariables:F,env:L,global:l,getNativePromise:U,domainBind:V},W;q.isRecentNode=q.isNode&&(W=r.versions.node.split(".").map(Number),0===W[0]&&W[1]>10||W[0]>0),q.isNode&&q.toFastProperties(r);try{throw new Error}catch(t){q.lastLineError=t}e.exports=q},{"./es5":13}]},{},[4])(4)},"object"==c(e)&&void 0!==t?t.exports=u():(s=[],void 0===(a="function"==typeof(i=u)?i.apply(e,s):i)||(t.exports=a)),"undefined"!=typeof window&&null!==window?window.P=window.Promise:"undefined"!=typeof self&&null!==self&&(self.P=self.Promise)}).call(this,r(8),r(11),r(69).setImmediate)},function(t,e,r){"use strict";var n=t.exports={};n.DocumentNotFoundError=null,n.general={},n.general.default="Validator failed for path `{PATH}` with value `{VALUE}`",n.general.required="Path `{PATH}` is required.",n.Number={},n.Number.min="Path `{PATH}` ({VALUE}) is less than minimum allowed value ({MIN}).",n.Number.max="Path `{PATH}` ({VALUE}) is more than maximum allowed value ({MAX}).",n.Number.enum="`{VALUE}` is not a valid enum value for path `{PATH}`.",n.Date={},n.Date.min="Path `{PATH}` ({VALUE}) is before minimum allowed value ({MIN}).",n.Date.max="Path `{PATH}` ({VALUE}) is after maximum allowed value ({MAX}).",n.String={},n.String.enum="`{VALUE}` is not a valid enum value for path `{PATH}`.",n.String.match="Path `{PATH}` is invalid ({VALUE}).",n.String.minlength="Path `{PATH}` (`{VALUE}`) is shorter than the minimum allowed length ({MINLENGTH}).",n.String.maxlength="Path `{PATH}` (`{VALUE}`) is longer than the maximum allowed length ({MAXLENGTH})."},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){return(o=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function i(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=a(t);if(e){var o=a(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return s(this,r)}}function s(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var u=r(5),c=r(4),l=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&o(t,e)}(r,t);var e=i(r);
/*!
   * OverwriteModel Error constructor.
   */function r(t,n,o,i){var s,a;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,r);var l=u.messages;return a=null!=l.DocumentNotFoundError?"function"==typeof l.DocumentNotFoundError?l.DocumentNotFoundError(t,n):l.DocumentNotFoundError:'No document found for query "'+c.inspect(t)+'" on model "'+n+'"',(s=e.call(this,a)).result=i,s.numAffected=o,s.filter=t,s.query=t,s}return r}(u);Object.defineProperty(l.prototype,"name",{value:"DocumentNotFoundError"}),
/*!
 * exports
 */
t.exports=l},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){return(o=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function i(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=a(t);if(e){var o=a(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return s(this,r)}}function s(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var u=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&o(t,e)}(r,t);var e=i(r);function r(t,n,o){var i;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,r);var s=o.join(", ");return(i=e.call(this,'No matching document found for id "'+t._id+'" version '+n+' modifiedPaths "'+s+'"')).version=n,i.modifiedPaths=o,i}return r}(r(5));Object.defineProperty(u.prototype,"name",{value:"VersionError"}),
/*!
 * exports
 */
t.exports=u},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){return(o=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function i(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=a(t);if(e){var o=a(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return s(this,r)}}function s(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var u=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&o(t,e)}(r,t);var e=i(r);function r(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,r);return e.call(this,"Can't save() the same doc multiple times in parallel. Document: "+t._id)}return r}(r(5));Object.defineProperty(u.prototype,"name",{value:"ParallelSaveError"}),
/*!
 * exports
 */
t.exports=u},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){return(o=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function i(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=a(t);if(e){var o=a(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return s(this,r)}}function s(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var u=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&o(t,e)}(r,t);var e=i(r);
/*!
   * OverwriteModel Error constructor.
   * @param {String} name
   */function r(t){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,r),e.call(this,"Cannot overwrite `"+t+"` model once compiled.")}return r}(r(5));Object.defineProperty(u.prototype,"name",{value:"OverwriteModelError"}),
/*!
 * exports
 */
t.exports=u},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){return(o=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function i(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=a(t);if(e){var o=a(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return s(this,r)}}function s(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var u=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&o(t,e)}(r,t);var e=i(r);
/*!
   * MissingSchema Error constructor.
   * @param {String} name
   */function r(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,r);var n="Schema hasn't been registered for model \""+t+'".\nUse mongoose.model(name, schema)';return e.call(this,n)}return r}(r(5));Object.defineProperty(u.prototype,"name",{value:"MissingSchemaError"}),
/*!
 * exports
 */
t.exports=u},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){return(o=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function i(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=a(t);if(e){var o=a(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return s(this,r)}}function s(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var u=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&o(t,e)}(r,t);var e=i(r);
/*!
   * DivergentArrayError constructor.
   * @param {Array<String>} paths
   */function r(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,r);var n="For your own good, using `document.save()` to update an array which was selected using an $elemMatch projection OR populated using skip, limit, query conditions, or exclusion of the _id field when the operation results in a $pop or $set of the entire array is not supported. The following path(s) would have been modified unsafely:\n  "+t.join("\n  ")+"\nUse Model.update() to update these arrays instead.";return e.call(this,n)}return r}(r(5));Object.defineProperty(u.prototype,"name",{value:"DivergentArrayError"}),
/*!
 * exports
 */
t.exports=u},function(t,e,r){"use strict";var n=r(32);
/*!
 * ignore
 */t.exports=function(t){var e,r;t.$immutable?(t.$immutableSetter=(e=t.path,r=t.options.immutable,function(t){if(null==this||null==this.$__)return t;if(this.isNew)return t;if(!("function"==typeof r?r.call(this,this):r))return t;var o=this.$__getValue(e);if("throw"===this.$__.strictMode&&t!==o)throw new n(e,"Path `"+e+"` is immutable and strict mode is set to throw.",!0);return o}),t.set(t.$immutableSetter)):t.$immutableSetter&&(t.setters=t.setters.filter((function(e){return e!==t.$immutableSetter})),delete t.$immutableSetter)}},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){return(o=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function i(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=a(t);if(e){var o=a(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return s(this,r)}}function s(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var u=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&o(t,e)}(r,t);var e=i(r);function r(t,n,o){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,r),e.call(this,'Parameter "'+n+'" to '+o+"() must be an object, got "+t.toString())}return r}(r(5));Object.defineProperty(u.prototype,"name",{value:"ObjectParameterError"}),t.exports=u},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){return(o=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function i(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=a(t);if(e){var o=a(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return s(this,r)}}function s(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function a(t){return(a=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var u=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&o(t,e)}(r,t);var e=i(r);function r(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,r);return e.call(this,"Can't validate() the same doc multiple times in parallel. Document: "+t._id)}return r}(r(14));Object.defineProperty(u.prototype,"name",{value:"ParallelValidateError"}),
/*!
 * exports
 */
t.exports=u},function(t,e,r){"use strict";(function(e){function r(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return n(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return n(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var o=0,i=function(){};return{s:i,n:function(){return o>=t.length?{done:!0}:{done:!1,value:t[o++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,a=!0,u=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return a=t.done,t},e:function(t){u=!0,s=t},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw s}}}}function n(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function o(t){return(o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(){this._pres=new Map,this._posts=new Map}function s(t,e,r,n,o,i,s){if(i.useErrorHandlers){var a={error:e};return t.execPost(r,n,o,a,(function(t){return"function"==typeof s&&s(t)}))}return"function"==typeof s?s(e):void 0}function a(t,e,r){return t.has(e)?t.get(e):r}function u(t,e,r,n){var o;try{o=t.apply(e,r)}catch(t){return n(t)}c(o)&&o.then((function(){return n()}),(function(t){return n(t)}))}function c(t){return null!=t&&"function"==typeof t.then}function l(t){var r=!1,n=this;return function(){var o=arguments;if(!r)return r=!0,e.nextTick((function(){return t.apply(n,o)}))}}i.prototype.execPre=function(t,r,n,o){3===arguments.length&&(o=n,n=[]);var i=a(this._pres,t,[]),s=i.length,f=i.numAsync||0,p=0,h=f,y=!1,d=n;if(!s)return e.nextTick((function(){o(null)}));var _=function t(){if(!(p>=s)){var n=i[p];if(n.isAsync){var a=[l(m),l((function(t){if(t){if(y)return;return y=!0,o(t)}if(0==--h&&p>=s)return o(null)}))];u(n.fn,r,a,a[0])}else if(n.fn.length>0){a=[l(m)];for(var f=arguments.length>=2?arguments:[null].concat(d),_=1;_<f.length;++_)a.push(f[_]);u(n.fn,r,a,a[0])}else{var v=null;try{v=n.fn.call(r)}catch(t){if(null!=t)return o(t)}if(c(v))v.then((function(){return m()}),(function(t){return m(t)}));else{if(++p>=s)return h>0?void 0:e.nextTick((function(){o(null)}));t()}}}};function m(t){if(t){if(y)return;return y=!0,o(t)}if(++p>=s)return h>0?void 0:o(null);_.apply(r,arguments)}_.apply(null,[null].concat(n))},i.prototype.execPreSync=function(t,e,r){for(var n=a(this._pres,t,[]),o=n.length,i=0;i<o;++i)n[i].fn.apply(e,r||[])},i.prototype.execPost=function(t,r,n,o,i){arguments.length<5&&(i=o,o=null);var s=a(this._posts,t,[]),f=s.length,p=0,h=null;if(o&&o.error&&(h=o.error),!f)return e.nextTick((function(){i.apply(null,[h].concat(n))}));var y=function t(){for(var e=s[p].fn,o=0,a=n.length,y=[],d=0;d<a;++d)o+=n[d]&&n[d]._kareemIgnore?0:1,n[d]&&n[d]._kareemIgnore||y.push(n[d]);if(h)if(e.length===o+2){var _=l((function(e){if(e&&(h=e),++p>=f)return i.call(null,h);t()}));u(e,r,[h].concat(y).concat([_]),_)}else{if(++p>=f)return i.call(null,h);t()}else{var m=l((function(e){return e?(h=e,t()):++p>=f?i.apply(null,[null].concat(n)):void t()}));if(e.length===o+2)return++p>=f?i.apply(null,[null].concat(n)):t();if(e.length===o+1)u(e,r,y.concat([m]),m);else{var v,g;try{g=e.apply(r,y)}catch(t){v=t,h=t}if(c(g))return g.then((function(){return m()}),(function(t){return m(t)}));if(++p>=f)return i.apply(null,[v].concat(n));t()}}};y()},i.prototype.execPostSync=function(t,e,r){for(var n=a(this._posts,t,[]),o=n.length,i=0;i<o;++i)n[i].fn.apply(e,r||[])},i.prototype.createWrapperSync=function(t,e){var r=this;return function(){r.execPreSync(t,this,arguments);var n=e.apply(this,arguments);return r.execPostSync(t,this,[n]),n}},i.prototype.wrap=function(t,e,r,n,o){var i=n.length>0?n[n.length-1]:null,a=("function"==typeof i&&n.slice(0,n.length-1),this),u=(o=o||{}).checkForPromise;this.execPre(t,r,n,(function(c){if(c){for(var l=o.numCallbackParams||0,f=o.contextParameter?[r]:[],p=f.length;p<l;++p)f.push(null);return s(a,c,t,r,f,o,i)}var h="function"==typeof i?n.length-1:n.length,y=e.length,d=e.apply(r,n.slice(0,h).concat(_));if(u){if(null!=d&&"function"==typeof d.then)return d.then((function(t){return _(null,t)}),(function(t){return _(t)}));if(y<h+1)return _(null,d)}function _(){var e=Array.prototype.slice.call(arguments,1);if(o.nullResultByDefault&&0===e.length&&e.push(null),arguments[0])return s(a,arguments[0],t,r,e,o,i);a.execPost(t,r,e,(function(){return arguments[0]?"function"==typeof i?i(arguments[0]):void 0:"function"==typeof i?i.apply(r,arguments):void 0}))}}))},i.prototype.filter=function(t){for(var e=this,r=this.clone(),n=Array.from(r._pres.keys()),o=function(){var n=s[i],o=e._pres.get(n).map((function(t){return Object.assign({},t,{name:n})})).filter(t);if(0===o.length)return r._pres.delete(n),"continue";o.numAsync=o.filter((function(t){return t.isAsync})).length,r._pres.set(n,o)},i=0,s=n;i<s.length;i++)o();for(var a=Array.from(r._posts.keys()),u=function(){var n=l[c],o=e._posts.get(n).map((function(t){return Object.assign({},t,{name:n})})).filter(t);if(0===o.length)return r._posts.delete(n),"continue";r._posts.set(n,o)},c=0,l=a;c<l.length;c++)u();return r},i.prototype.hasHooks=function(t){return this._pres.has(t)||this._posts.has(t)},i.prototype.createWrapper=function(t,r,n,o){var i=this;return this.hasHooks(t)?function(){var e=n||this,s=Array.prototype.slice.call(arguments);i.wrap(t,r,e,s,o)}:function(){var t=arguments,n=this;e.nextTick((function(){return r.apply(n,t)}))}},i.prototype.pre=function(t,e,r,n,i){var s={};"object"===o(e)&&null!=e?e=(s=e).isAsync:"boolean"!=typeof arguments[1]&&(n=r,r=e,e=!1);var u=a(this._pres,t,[]);if(this._pres.set(t,u),e&&(u.numAsync=u.numAsync||0,++u.numAsync),"function"!=typeof r)throw new Error('pre() requires a function, got "'+o(r)+'"');return i?u.unshift(Object.assign({},s,{fn:r,isAsync:e})):u.push(Object.assign({},s,{fn:r,isAsync:e})),this},i.prototype.post=function(t,e,r,n){var i=a(this._posts,t,[]);if("function"==typeof e&&(n=!!r,r=e,e={}),"function"!=typeof r)throw new Error('post() requires a function, got "'+o(r)+'"');return n?i.unshift(Object.assign({},e,{fn:r})):i.push(Object.assign({},e,{fn:r})),this._posts.set(t,i),this},i.prototype.clone=function(){var t,e=new i,n=r(this._pres.keys());try{for(n.s();!(t=n.n()).done;){var o=t.value,s=this._pres.get(o).slice();s.numAsync=this._pres.get(o).numAsync,e._pres.set(o,s)}}catch(t){n.e(t)}finally{n.f()}var a,u=r(this._posts.keys());try{for(u.s();!(a=u.n()).done;){var c=a.value;e._posts.set(c,this._posts.get(c).slice())}}catch(t){u.e(t)}finally{u.f()}return e},i.prototype.merge=function(t,e){var n,o=(e=1===arguments.length||e)?this.clone():this,i=r(t._pres.keys());try{var s=function(){var e=n.value,r=a(o._pres,e,[]),i=t._pres.get(e).filter((function(t){return-1===r.map((function(t){return t.fn})).indexOf(t.fn)})),s=r.concat(i);s.numAsync=r.numAsync||0,s.numAsync+=i.filter((function(t){return t.isAsync})).length,o._pres.set(e,s)};for(i.s();!(n=i.n()).done;)s()}catch(t){i.e(t)}finally{i.f()}var u,c=r(t._posts.keys());try{var l=function(){var e=u.value,r=a(o._posts,e,[]),n=t._posts.get(e).filter((function(t){return-1===r.indexOf(t)}));o._posts.set(e,r.concat(n))};for(c.s();!(u=c.n()).done;)l()}catch(t){c.e(t)}finally{c.f()}return o},t.exports=i}).call(this,r(8))},function(t,e,r){"use strict";var n=r(10),o=function t(e){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),Object.assign(this,e),null!=e&&null!=e.options&&(this.options=Object.assign({},e.options))};Object.defineProperty(o.prototype,"ref",n),Object.defineProperty(o.prototype,"refPath",n),Object.defineProperty(o.prototype,"localField",n),Object.defineProperty(o.prototype,"foreignField",n),Object.defineProperty(o.prototype,"justOne",n),Object.defineProperty(o.prototype,"count",n),Object.defineProperty(o.prototype,"match",n),Object.defineProperty(o.prototype,"options",n),Object.defineProperty(o.prototype,"skip",n),Object.defineProperty(o.prototype,"limit",n),Object.defineProperty(o.prototype,"perDocumentLimit",n),t.exports=o},function(t,e,r){"use strict";var n=r(3),o=r(21);
/*!
 * Gather all indexes defined in the schema, including single nested,
 * document arrays, and embedded discriminators.
 */
t.exports=function(t){var e=[],r=new WeakMap,i=t.constructor.indexTypes,s=new Map;return function t(a,u,c){if(r.has(a))return;r.set(a,!0),u=u||"";for(var l=Object.keys(a.paths),f=0,p=l;f<p.length;f++){var h=p[f],y=a.paths[h];if(null==c||!c.paths[h]){if(y.$isMongooseDocumentArray||y.$isSingleNested){if(!0!==n(y,"options.excludeIndexes")&&!0!==n(y,"schemaOptions.excludeIndexes")&&!0!==n(y,"schema.options.excludeIndexes")&&t(y.schema,u+h+"."),null!=y.schema.discriminators)for(var d=y.schema.discriminators,_=Object.keys(d),m=0,v=_;m<v.length;m++){var g=v[m];t(d[g],u+h+".",y.schema)}if(y.$isMongooseDocumentArray)continue}var b=y._index||y.caster&&y.caster._index;if(!1!==b&&null!=b){var w={},O=o(b),S=O?b:{},A="string"==typeof b?b:!!O&&b.type;if(A&&-1!==i.indexOf(A))w[u+h]=A;else if(S.text)w[u+h]="text",delete S.text;else{var E=-1===Number(b);w[u+h]=E?-1:1}delete S.type,"background"in S||(S.background=!0),null!=a.options.autoIndex&&(S._autoIndex=a.options.autoIndex);var j=S&&S.name;"string"==typeof j&&s.has(j)?Object.assign(s.get(j),w):(e.push([w,S]),s.set(j,w))}}}r.delete(a),u?
/*!
   * Checks for indexes added to subdocs using Schema.index().
   * These indexes need their paths prefixed properly.
   *
   * schema._indexes = [ [indexObj, options], [indexObj, options] ..]
   */
function(t,r){for(var n=t._indexes,o=n.length,i=0;i<o;++i){for(var s=n[i][0],a=n[i][1],u=Object.keys(s),c=u.length,l={},f=0;f<c;++f){var p=u[f];l[r+p]=s[p]}var h=Object.assign({},a);if(null!=a&&null!=a.partialFilterExpression){h.partialFilterExpression={};for(var y=a.partialFilterExpression,d=0,_=Object.keys(y);d<_.length;d++){var m=_[d];h.partialFilterExpression[r+m]=y[m]}}e.push([l,h])}}(a,u):(a._indexes.forEach((function(t){"background"in t[1]||(t[1].background=!0)})),e=e.concat(a._indexes))}(t),e}},function(t,e,r){"use strict";t.exports=function(t,e){for(var r in t.add(e.tree||{}),t.callQueue=t.callQueue.concat(e.callQueue),t.method(e.methods),t.static(e.statics),e.query)t.query[r]=e.query[r];for(var n in e.virtuals)t.virtuals[n]=e.virtuals[n].clone();t.s.hooks.merge(e.s.hooks,!1)}},function(t,e,r){"use strict";var n=r(142),o=r(144),i=r(3),s=r(75),a=r(51);t.exports=function(t,e){var r=t.childSchemas.find((function(t){return!!t.schema.options.timestamps}));if(e||r){var u=s(e,"createdAt"),c=s(e,"updatedAt"),l=null!=e&&e.hasOwnProperty("currentTime")?e.currentTime:null,f={};t.$timestamps={createdAt:u,updatedAt:c},c&&!t.paths[c]&&(f[c]=Date),u&&!t.paths[u]&&(f[u]=Date),t.add(f),t.pre("save",(function(t){var e=i(this,"$__.saveOptions.timestamps");if(!1===e)return t();var r=null!=e&&!1===e.updatedAt,n=null!=e&&!1===e.createdAt,o=null!=l?l():(this.ownerDocument?this.ownerDocument():this).constructor.base.now(),s=this._id&&this._id.auto;if(!n&&u&&!this.get(u)&&this.isSelected(u)&&this.$set(u,s?this._id.getTimestamp():o),!r&&c&&(this.isNew||this.isModified())){var a=o;this.isNew&&(null!=u?a=this.$__getValue(u):s&&(a=this._id.getTimestamp())),this.$set(c,a)}t()})),t.methods.initializeTimestamps=function(){var t=null!=l?l():this.constructor.base.now();return u&&!this.get(u)&&this.$set(u,t),c&&!this.get(c)&&this.$set(c,t),this},h[a.builtInMiddleware]=!0;var p={query:!0,model:!1};t.pre("findOneAndUpdate",p,h),t.pre("replaceOne",p,h),t.pre("update",p,h),t.pre("updateOne",p,h),t.pre("updateMany",p,h)}function h(t){var e=null!=l?l():this.model.base.now();o(e,u,c,this.getUpdate(),this.options,this.schema),n(e,this.getUpdate(),this.model.schema),t()}}},function(t,e,r){"use strict";function n(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return o(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return o(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,i=function(){};return{s:i,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,a=!0,u=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return a=t.done,t},e:function(t){u=!0,s=t},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw s}}}}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}var i=r(143),s=r(75);
/*!
 * ignore
 */
function a(t,e,r){if(null!=e){if(Object.keys(e).some((function(t){return t.startsWith("$")}))){if(e.$push)for(var o=0,i=Object.keys(e.$push);o<i.length;o++){var a=i[o],c=r.path(a);e.$push[a]&&c&&c.$isMongooseDocumentArray&&c.schema.options.timestamps&&function(){var r=c.schema.options.timestamps,n=s(r,"createdAt"),o=s(r,"updatedAt");e.$push[a].$each?e.$push[a].$each.forEach((function(e){null!=o&&(e[o]=t),null!=n&&(e[n]=t)})):(null!=o&&(e.$push[a][o]=t),null!=n&&(e.$push[a][n]=t))}()}if(null!=e.$set)for(var l=0,f=Object.keys(e.$set);l<f.length;l++){u(r,f[l],e.$set,t)}}var p,h=n(Object.keys(e).filter((function(t){return!t.startsWith("$")})));try{for(h.s();!(p=h.n()).done;){u(r,p.value,e,t)}}catch(t){h.e(t)}finally{h.f()}}}function u(t,e,r,o){var u=i(e),c=t.path(u);if(c){for(var l=[],f=u.split("."),p=f.length-1;p>0;--p){var h=t.path(f.slice(0,p).join("."));null!=h&&(h.$isMongooseDocumentArray||h.$isSingleNested)&&l.push({parentPath:e.split(".").slice(0,p).join("."),parentSchemaType:h})}if(Array.isArray(r[e])&&c.$isMongooseDocumentArray)!function(t,e,r){var n=e.schema.options.timestamps;if(n)for(var o=t.length,i=s(n,"createdAt"),u=s(n,"updatedAt"),c=0;c<o;++c)null!=u&&(t[c][u]=r),null!=i&&(t[c][i]=r),a(r,t[c],e.schema)}(r[e],c,o);else if(r[e]&&c.$isSingleNested)!function(t,e,r){var n=e.schema.options.timestamps;if(n){var o=s(n,"createdAt"),i=s(n,"updatedAt");null!=i&&(t[i]=r),null!=o&&(t[o]=r),a(r,t,e.schema)}}(r[e],c,o);else if(l.length>0){var y,d=n(l);try{for(d.s();!(y=d.n()).done;){var _=y.value,m=_.parentPath,v=_.parentSchemaType,g=v.schema.options.timestamps,b=s(g,"updatedAt");if(g&&null!=b)if(v.$isSingleNested)r[m+"."+b]=o;else if(v.$isMongooseDocumentArray){var w=e.substr(m.length+1);if(/^\d+$/.test(w)){r[m+"."+w][b]=o;continue}var O=w.indexOf(".");r[m+"."+(w=-1!==O?w.substr(0,O):w)+"."+b]=o}}}catch(t){d.e(t)}finally{d.f()}}else if(null!=c.schema&&c.schema!=t&&r[e]){var S=c.schema.options.timestamps,A=s(S,"createdAt"),E=s(S,"updatedAt");if(!S)return;null!=E&&(r[e][E]=o),null!=A&&(r[e][A]=o)}}}t.exports=a},function(t,e,r){"use strict";t.exports=function(t){return t.replace(/\.\$(\[[^\]]*\])?\./g,".0.").replace(/\.(\[[^\]]*\])?\$$/g,".0")}},function(t,e,r){"use strict";
/*!
 * ignore
 */var n=r(3);t.exports=
/*!
 * ignore
 */
function(t,e,r,o,i){var s=o,a=s,u=n(i,"overwrite",!1),c=n(i,"timestamps",!0);if(!c||null==s)return o;var l=null!=c&&!1===c.createdAt,f=null!=c&&!1===c.updatedAt;if(u)return o&&o.$set&&(o=o.$set,s.$set={},a=s.$set),f||!r||o[r]||(a[r]=t),l||!e||o[e]||(a[e]=t),s;if(o=o||{},Array.isArray(s))return s.push({$set:{updatedAt:t}}),s;if(s.$set=s.$set||{},!f&&r&&(!o.$currentDate||!o.$currentDate[r])){var p=!1;if(-1!==r.indexOf("."))for(var h=r.split("."),y=1;y<h.length;++y){var d=h.slice(-y).join("."),_=h.slice(0,-y).join(".");if(null!=o[_]){o[_][d]=t,p=!0;break}if(o.$set&&o.$set[_]){o.$set[_][d]=t,p=!0;break}}p||(s.$set[r]=t),s.hasOwnProperty(r)&&delete s[r]}if(!l&&e){o[e]&&delete o[e],o.$set&&o.$set[e]&&delete o.$set[e];var m=!1;if(-1!==e.indexOf("."))for(var v=e.split("."),g=1;g<v.length;++g){var b=v.slice(-g).join("."),w=v.slice(0,-g).join(".");if(null!=o[w]){o[w][b]=t,m=!0;break}if(o.$set&&o.$set[w]){o.$set[w][b]=t,m=!0;break}}m||(s.$setOnInsert=s.$setOnInsert||{},s.$setOnInsert[e]=t)}0===Object.keys(s.$set).length&&delete s.$set;return s}},function(t,e,r){"use strict";var n=r(14),o=r(4);t.exports=function(t,e){if("string"==typeof t)return;if("function"==typeof t)return;throw new n('Invalid ref at path "'+e+'". Got '+o.inspect(t,{depth:0}))}},function(t,e,r){"use strict";
/*!
 * ignore
 */
/*!
 * Apply query middleware
 *
 * @param {Query} query constructor
 * @param {Model} model
 */
function n(t,e){var r={useErrorHandlers:!0,numCallbackParams:1,nullResultByDefault:!0},o=e.hooks.filter((function(t){var e=function(t){var e={};t.hasOwnProperty("query")&&(e.query=t.query);t.hasOwnProperty("document")&&(e.document=t.document);return e}(t);return"updateOne"===t.name?null==e.query||!!e.query:"deleteOne"===t.name?!!e.query||0===Object.keys(e).length:"validate"===t.name||"remove"===t.name?!!e.query:null==t.query&&null==t.document||!!t.query}));t.prototype._execUpdate=o.createWrapper("update",t.prototype._execUpdate,null,r),t.prototype.__distinct=o.createWrapper("distinct",t.prototype.__distinct,null,r),t.prototype.validate=o.createWrapper("validate",t.prototype.validate,null,r),n.middlewareFunctions.filter((function(t){return"update"!==t&&"distinct"!==t&&"validate"!==t})).forEach((function(e){t.prototype["_".concat(e)]=o.createWrapper(e,t.prototype["_".concat(e)],null,r)}))}t.exports=n,
/*!
 * ignore
 */
n.middlewareFunctions=["count","countDocuments","deleteMany","deleteOne","distinct","estimatedDocumentCount","find","findOne","findOneAndDelete","findOneAndRemove","findOneAndReplace","findOneAndUpdate","remove","replaceOne","update","updateMany","updateOne","validate"]},function(t,e,r){"use strict";(function(e){
/*!
 * Module dependencies.
 */
function n(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return o(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return o(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,i=function(){};return{s:i,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,a=!0,u=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return a=t.done,t},e:function(t){u=!0,s=t},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw s}}}}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}var i,s=r(7),a=r(5),u=r(148),c=r(77),l=r(2),f=r(0).populateModelSymbol,p=s.CastError;function h(t,e){this.enumValues=[],this.regExp=null,s.call(this,t,e,"String")}
/*!
 * ignore
 */
function y(t){return this.castForQuery(t)}h.schemaName="String",h.defaultOptions={},
/*!
 * Inherits from SchemaType.
 */
h.prototype=Object.create(s.prototype),h.prototype.constructor=h,Object.defineProperty(h.prototype,"OptionsConstructor",{configurable:!1,enumerable:!1,writable:!1,value:u}),
/*!
 * ignore
 */
h._cast=c,h.cast=function(t){return 0===arguments.length||(!1===t&&(t=this._defaultCaster),this._cast=t),this._cast},
/*!
 * ignore
 */
h._defaultCaster=function(t){if(null!=t&&"string"!=typeof t)throw new Error;return t},h.get=s.get,h.set=s.set,
/*!
 * ignore
 */
h._checkRequired=function(t){return(t instanceof String||"string"==typeof t)&&t.length},h.checkRequired=s.checkRequired,h.prototype.enum=function(){if(this.enumValidator&&(this.validators=this.validators.filter((function(t){return t.validator!==this.enumValidator}),this),this.enumValidator=!1),void 0===arguments[0]||!1===arguments[0])return this;var t,e;l.isObject(arguments[0])?Array.isArray(arguments[0].values)?(t=arguments[0].values,e=arguments[0].message):(t=l.object.vals(arguments[0]),e=a.messages.String.enum):(t=arguments,e=a.messages.String.enum);var r,o=n(t);try{for(o.s();!(r=o.n()).done;){var i=r.value;void 0!==i&&this.enumValues.push(this.cast(i))}}catch(t){o.e(t)}finally{o.f()}var s=this.enumValues;return this.enumValidator=function(t){return void 0===t||~s.indexOf(t)},this.validators.push({validator:this.enumValidator,message:e,type:"enum",enumValues:s}),this},h.prototype.lowercase=function(t){return arguments.length>0&&!t?this:this.set((function(t,e){return"string"!=typeof t&&(t=e.cast(t)),t?t.toLowerCase():t}))},h.prototype.uppercase=function(t){return arguments.length>0&&!t?this:this.set((function(t,e){return"string"!=typeof t&&(t=e.cast(t)),t?t.toUpperCase():t}))},h.prototype.trim=function(t){return arguments.length>0&&!t?this:this.set((function(t,e){return"string"!=typeof t&&(t=e.cast(t)),t?t.trim():t}))},h.prototype.minlength=function(t,e){if(this.minlengthValidator&&(this.validators=this.validators.filter((function(t){return t.validator!==this.minlengthValidator}),this)),null!=t){var r=e||a.messages.String.minlength;r=r.replace(/{MINLENGTH}/,t),this.validators.push({validator:this.minlengthValidator=function(e){return null===e||e.length>=t},message:r,type:"minlength",minlength:t})}return this},h.prototype.minLength=h.prototype.minlength,h.prototype.maxlength=function(t,e){if(this.maxlengthValidator&&(this.validators=this.validators.filter((function(t){return t.validator!==this.maxlengthValidator}),this)),null!=t){var r=e||a.messages.String.maxlength;r=r.replace(/{MAXLENGTH}/,t),this.validators.push({validator:this.maxlengthValidator=function(e){return null===e||e.length<=t},message:r,type:"maxlength",maxlength:t})}return this},h.prototype.maxLength=h.prototype.maxlength,h.prototype.match=function(t,e){var r=e||a.messages.String.match;return this.validators.push({validator:function(e){return!!t&&(t.lastIndex=0,null==e||""===e||t.test(e))},message:r,type:"regexp",regexp:t}),this},h.prototype.checkRequired=function(t,e){return s._isRef(this,t,e,!0)?!!t:("function"==typeof this.constructor.checkRequired?this.constructor.checkRequired():h.checkRequired())(t)},h.prototype.cast=function(t,n,o){if(s._isRef(this,t,n,o)){if(null==t)return t;if(i||(i=r(6)),t instanceof i)return t.$__.wasPopulated=!0,t;if("string"==typeof t)return t;if(e.isBuffer(t)||!l.isObject(t))throw new p("string",t,this.path,null,this);var a=n.$__fullPath(this.path),u=new((n.ownerDocument?n.ownerDocument():n).populated(a,!0).options[f])(t);return u.$__.wasPopulated=!0,u}var c;c="function"==typeof this._castFunction?this._castFunction:"function"==typeof this.constructor.cast?this.constructor.cast():h.cast();try{return c(t)}catch(e){throw new p("string",t,this.path,null,this)}};var d=l.options(s.prototype.$conditionalHandlers,{$all:function(t){var e=this;return Array.isArray(t)?t.map((function(t){return e.castForQuery(t)})):[this.castForQuery(t)]},$gt:y,$gte:y,$lt:y,$lte:y,$options:String,$regex:y,$not:y});Object.defineProperty(h.prototype,"$conditionalHandlers",{configurable:!1,enumerable:!1,writable:!1,value:Object.freeze(d)}),h.prototype.castForQuery=function(t,e){var r;if(2===arguments.length){if(!(r=this.$conditionalHandlers[t]))throw new Error("Can't use "+t+" with String.");return r.call(this,e)}return e=t,"[object RegExp]"===Object.prototype.toString.call(e)?e:this._castForQuery(e)},
/*!
 * Module exports.
 */
t.exports=h}).call(this,r(1).Buffer)},function(t,e,r){"use strict";function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function s(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=u(t);if(e){var o=u(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return a(this,r)}}function a(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function u(t){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var c=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}(r,t);var e=s(r);function r(){return o(this,r),e.apply(this,arguments)}return r}(r(9)),l=r(10);Object.defineProperty(c.prototype,"enum",l),Object.defineProperty(c.prototype,"match",l),Object.defineProperty(c.prototype,"lowercase",l),Object.defineProperty(c.prototype,"trim",l),Object.defineProperty(c.prototype,"uppercase",l),Object.defineProperty(c.prototype,"minLength",l),Object.defineProperty(c.prototype,"minlength",l),Object.defineProperty(c.prototype,"maxLength",l),Object.defineProperty(c.prototype,"maxlength",l),Object.defineProperty(c.prototype,"populate",l),
/*!
 * ignore
 */
t.exports=c},function(t,e,r){"use strict";function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function s(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=u(t);if(e){var o=u(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return a(this,r)}}function a(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function u(t){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var c=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}(r,t);var e=s(r);function r(){return o(this,r),e.apply(this,arguments)}return r}(r(9)),l=r(10);Object.defineProperty(c.prototype,"min",l),Object.defineProperty(c.prototype,"max",l),Object.defineProperty(c.prototype,"enum",l),Object.defineProperty(c.prototype,"populate",l),
/*!
 * ignore
 */
t.exports=c},function(t,e,r){"use strict";var n=r(22);
/*!
 * Given a value, cast it to a number, or throw a `CastError` if the value
 * cannot be casted. `null` and `undefined` are considered valid.
 *
 * @param {Any} value
 * @param {String} [path] optional the path to set on the CastError
 * @return {Boolean|null|undefined}
 * @throws {Error} if `value` is not one of the allowed values
 * @api private
 */t.exports=function(t){return null==t?t:""===t?null:("string"!=typeof t&&"boolean"!=typeof t||(t=Number(t)),n.ok(!isNaN(t)),t instanceof Number?t.valueOf():"number"==typeof t?t:Array.isArray(t)||"function"!=typeof t.valueOf?t.toString&&!Array.isArray(t)&&t.toString()==Number(t)?Number(t):void n.ok(!1):Number(t.valueOf()))}},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */var n=r(12),o=r(7),i=r(49),s=r(2);function a(t,e){o.call(this,t,e,"Boolean")}a.schemaName="Boolean",a.defaultOptions={},
/*!
 * Inherits from SchemaType.
 */
a.prototype=Object.create(o.prototype),a.prototype.constructor=a,
/*!
 * ignore
 */
a._cast=i,a.set=o.set,a.cast=function(t){return 0===arguments.length||(!1===t&&(t=this._defaultCaster),this._cast=t),this._cast},
/*!
 * ignore
 */
a._defaultCaster=function(t){if(null!=t&&"boolean"!=typeof t)throw new Error;return t},
/*!
 * ignore
 */
a._checkRequired=function(t){return!0===t||!1===t},a.checkRequired=o.checkRequired,a.prototype.checkRequired=function(t){return this.constructor._checkRequired(t)},Object.defineProperty(a,"convertToTrue",{get:function(){return i.convertToTrue},set:function(t){i.convertToTrue=t}}),Object.defineProperty(a,"convertToFalse",{get:function(){return i.convertToFalse},set:function(t){i.convertToFalse=t}}),a.prototype.cast=function(t){var e;e="function"==typeof this._castFunction?this._castFunction:"function"==typeof this.constructor.cast?this.constructor.cast():a.cast();try{return e(t)}catch(e){throw new n("Boolean",t,this.path,e,this)}},a.$conditionalHandlers=s.options(o.prototype.$conditionalHandlers,{}),a.prototype.castForQuery=function(t,e){var r;return 2===arguments.length?(r=a.$conditionalHandlers[t])?r.call(this,e):this._castForQuery(e):this._castForQuery(t)},a.prototype._castNullish=function(t){if(void 0===t&&null!=this.$$context&&null!=this.$$context._mongooseOptions&&this.$$context._mongooseOptions.omitUndefined)return t;var e="function"==typeof this.constructor.cast?this.constructor.cast():a.cast();return null==e?t:!(e.convertToFalse instanceof Set&&e.convertToFalse.has(t))&&(!!(e.convertToTrue instanceof Set&&e.convertToTrue.has(t))||t)},
/*!
 * Module exports.
 */
t.exports=a},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */var n,o,i=r(55),s=r(12),a=r(19).EventEmitter,u=r(158),c=r(7),l=r(31),f=r(90),p=r(3),h=r(91),y=r(4),d=r(2),_=r(92),m=r(0).arrayPathSymbol,v=r(0).documentArrayParent;function g(t,e,r,n){null!=n&&null!=n._id?e=h(e,n):null!=r&&null!=r._id&&(e=h(e,r));var o=b(e,r);o.prototype.$basePath=t,i.call(this,t,o,r),this.schema=e,this.schemaOptions=n||{},this.$isMongooseDocumentArray=!0,this.Constructor=o,o.base=e.base;var s=this.defaultValue;"defaultValue"in this&&void 0===s||this.default((function(){var t=s.call(this);return Array.isArray(t)||(t=[t]),t}));var a=this;this.$embeddedSchemaType=new c(t+".$",{required:p(this,"schemaOptions.required",!1)}),this.$embeddedSchemaType.cast=function(t,e,r){return a.cast(t,e,r)[0]},this.$embeddedSchemaType.$isMongooseDocumentArrayElement=!0,this.$embeddedSchemaType.caster=this.Constructor,this.$embeddedSchemaType.schema=this.schema}
/*!
 * Ignore
 */
function b(t,e,n){function i(){o.apply(this,arguments),this.$session(this.ownerDocument().$session())}o||(o=r(26));var s=null!=n?n.prototype:o.prototype;for(var u in i.prototype=Object.create(s),i.prototype.$__setSchema(t),i.schema=t,i.prototype.constructor=i,i.$isArraySubdocument=!0,i.events=new a,t.methods)i.prototype[u]=t.methods[u];for(var c in t.statics)i[c]=t.statics[c];for(var l in a.prototype)i[l]=a.prototype[l];return i.options=e,i}
/*!
 * Scopes paths selected in a query to this array.
 * Necessary for proper default application of subdocument values.
 *
 * @param {DocumentArrayPath} array - the array to scope `fields` paths
 * @param {Object|undefined} fields - the root fields selected in the query
 * @param {Boolean|undefined} init - if we are being created part of a query result
 */
function w(t,e,r){if(r&&e){for(var n,o,i,s=t.path+".",a=Object.keys(e),u=a.length,c={};u--;)if((o=a[u]).startsWith(s)){if("$"===(i=o.substring(s.length)))continue;i.startsWith("$.")&&(i=i.substr(2)),n||(n=!0),c[i]=e[o]}return n&&c||void 0}}g.schemaName="DocumentArray",g.options={castNonArrays:!0},
/*!
 * Inherits from ArrayType.
 */
g.prototype=Object.create(i.prototype),g.prototype.constructor=g,g.prototype.OptionsConstructor=u,g.prototype.discriminator=function(t,e,r){"function"==typeof t&&(t=d.getFunctionName(t));var n=b(e=f(this.casterConstructor,t,e,r),null,this.casterConstructor);n.baseCasterConstructor=this.casterConstructor;try{Object.defineProperty(n,"name",{value:t})}catch(t){}return this.casterConstructor.discriminators[t]=n,this.casterConstructor.discriminators[t]},g.prototype.doValidate=function(t,e,i,s){n||(n=r(18));var a=this;try{c.prototype.doValidate.call(this,t,(function(r){if(r)return r.$isArrayValidatorError=!0,e(r);var u,c=t&&t.length;if(!c)return e();if(s&&s.updateValidator)return e();t.isMongooseDocumentArray||(t=new n(t,a.path,i));function f(t){null!=t&&((u=t)instanceof l||(u.$isArrayValidatorError=!0)),--c||e(u)}for(var p=0,h=c;p<h;++p){var y=t[p];if(null!=y){if(!(y instanceof o)){var d=_(a.casterConstructor,t[p]);y=t[p]=new d(y,t,void 0,void 0,p)}y.$__validate(f)}else--c||e(u)}}),i)}catch(t){return t.$isArrayValidatorError=!0,e(t)}},g.prototype.doValidateSync=function(t,e){var r=c.prototype.doValidateSync.call(this,t,e);if(null!=r)return r.$isArrayValidatorError=!0,r;var n=t&&t.length,i=null;if(n){for(var s=0,a=n;s<a;++s){var u=t[s];if(u){if(!(u instanceof o)){var l=_(this.casterConstructor,t[s]);u=t[s]=new l(u,t,void 0,void 0,s)}var f=u.validateSync();f&&null==i&&(i=f)}}return i}},
/*!
 * ignore
 */
g.prototype.getDefault=function(t){var e="function"==typeof this.defaultValue?this.defaultValue.call(t):this.defaultValue;if(null==e)return e;n||(n=r(18)),Array.isArray(e)||(e=[e]),e=new n(e,this.path,t);for(var o=0;o<e.length;++o){var i=new(_(this.casterConstructor,e[o]))({},e,void 0,void 0,o);i.init(e[o]),i.isNew=!0,Object.assign(i.$__.activePaths.default,i.$__.activePaths.init),i.$__.activePaths.init={},e[o]=i}return e},g.prototype.cast=function(t,e,i,a,u){if(n||(n=r(18)),null!=t&&null!=t[m]&&t===a)return t;var c,l,f={transform:!1,virtuals:!1};if(u=u||{},!Array.isArray(t)){if(!i&&!g.options.castNonArrays)throw new s("DocumentArray",y.inspect(t),this.path,null,this);return e&&i&&e.markModified(this.path),this.cast([t],e,i,a,u)}t&&t.isMongooseDocumentArray||u.skipDocumentArrayCast?t&&t.isMongooseDocumentArray&&(t=new n(t,this.path,e)):t=new n(t,this.path,e),null!=u.arrayPath&&(t[m]=u.arrayPath);for(var p=t.length,h={skipId:!0,willInit:!0},b=0;b<p;++b)if(t[b]){var O=_(this.casterConstructor,t[b]);if(!t[b].$__||t[b]instanceof O&&t[b][v]===e||(t[b]=t[b].toObject({transform:!1,virtuals:t[b].schema===O.schema})),t[b]instanceof o)null==t[b].__index&&t[b].$setIndex(b);else if(null!=t[b])if(i)e?c||(c=w(this,e.$__.selected,i)):c=!0,l=new O(null,t,h,c,b),t[b]=l.init(t[b]);else if(a&&"function"==typeof a.id&&(l=a.id(t[b]._id)),a&&l&&d.deepEqual(l.toObject(f),t[b]))l.set(t[b]),t[b]=l;else try{l=new O(t[b],t,void 0,void 0,b),t[b]=l}catch(e){var S=y.inspect(t[b]);throw new s("embedded",S,t[m],e,this)}}return t},
/*!
 * ignore
 */
g.prototype.clone=function(){var t=Object.assign({},this.options),e=new this.constructor(this.path,this.schema,t,this.schemaOptions);return e.validators=this.validators.slice(),void 0!==this.requiredValidator&&(e.requiredValidator=this.requiredValidator),e.Constructor.discriminators=Object.assign({},this.Constructor.discriminators),e},g.defaultOptions={},g.set=c.set,
/*!
 * Module exports.
 */
t.exports=g},function(t,e,r){"use strict";function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function s(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=u(t);if(e){var o=u(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return a(this,r)}}function a(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function u(t){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var c=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}(r,t);var e=s(r);function r(){return o(this,r),e.apply(this,arguments)}return r}(r(9)),l=r(10);Object.defineProperty(c.prototype,"enum",l),Object.defineProperty(c.prototype,"enum",l),
/*!
 * ignore
 */
t.exports=c},function(t,e,r){"use strict";t.exports=function t(e){if(!Array.isArray(e))return{min:0,max:0,containsNonArrayItem:!0};if(0===e.length)return{min:1,max:1,containsNonArrayItem:!1};for(var r=t(e[0]),n=1;n<e.length;++n){var o=t(e[n]);o.min<r.min&&(r.min=o.min),o.max>r.max&&(r.max=o.max),r.containsNonArrayItem=r.containsNonArrayItem||o.containsNonArrayItem}return r.min=r.min+1,r.max=r.max+1,r}},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */function n(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return o(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return o(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,i=function(){};return{s:i,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:i}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,a=!0,u=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return a=t.done,t},e:function(t){u=!0,s=t},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw s}}}}function o(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function i(t){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var s=r(12),a=r(32),u=r(54),c=r(156),l=r(3),f=r(157),p=r(80),h=r(4),y=r(21),d=r(29),_=["Polygon","MultiPolygon"];function m(t,e,r){if(Array.isArray(t))t.forEach((function(n,o){if(Array.isArray(n)||y(n))return m(n,e,r);t[o]=e.castForQueryWrapper({val:n,context:r})}));else for(var n=Object.keys(t),o=n.length;o--;){var i=n[o],s=t[i];Array.isArray(s)||y(s)?(m(s,e,r),t[i]=s):t[i]=e.castForQuery({val:s,context:r})}}t.exports=function t(e,r,o,v){if(Array.isArray(r))throw new Error("Query filter must be an object, got an array ",h.inspect(r));if(null==r)return r;r.hasOwnProperty("_bsontype")&&"ObjectID"!==r._bsontype&&delete r._bsontype,null!=e&&null!=e.discriminators&&null!=r[e.options.discriminatorKey]&&(e=f(e,r[e.options.discriminatorKey])||e);var g,b,w,O,S,A,E=Object.keys(r),j=E.length;for(o=o||{};j--;)if(A=r[O=E[j]],"$or"===O||"$nor"===O||"$and"===O){if(!Array.isArray(A))throw new s("Array",A,O);for(var $=0;$<A.length;++$){if(null==A[$]||"object"!==i(A[$]))throw new s("Object",A[$],O+"."+$);A[$]=t(e,A[$],o,v)}}else{if("$where"===O){if("string"!==(S=i(A))&&"function"!==S)throw new Error("Must have a string or function for $where");"function"===S&&(r[O]=A.toString());continue}if("$elemMatch"===O)A=t(e,A,o,v);else if("$text"===O)A=c(A,O);else{if(!e)continue;if(!(b=e.path(O)))for(var P=O.split("."),x=P.length;x--;){var N=P.slice(0,x).join("."),T=P.slice(x).join("."),k=e.path(N),C=l(k,"schema.options.discriminatorKey");if(null!=k&&null!=l(k,"schema.discriminators")&&null!=C&&T!==C){var R=l(r,N+"."+C);null!=R&&(b=k.schema.discriminators[R].path(T))}}if(b){if(null==A)continue;if("Object"===A.constructor.name)if(Object.keys(A).some(p))for(var D=Object.keys(A),B=void 0,M=D.length;M--;)if(w=A[B=D[M]],"$not"===B){if(w&&b&&!b.caster){if((g=Object.keys(w)).length&&p(g[0]))for(var I in w)w[I]=b.castForQueryWrapper({$conditional:I,val:w[I],context:v});else A[B]=b.castForQueryWrapper({$conditional:B,val:w,context:v});continue}t(b.caster?b.caster.schema:e,w,o,v)}else A[B]=b.castForQueryWrapper({$conditional:B,val:w,context:v});else r[O]=b.castForQueryWrapper({val:A,context:v});else if(Array.isArray(A)&&-1===["Buffer","Array"].indexOf(b.instance)){var F,L=[],U=n(A);try{for(U.s();!(F=U.n()).done;){var V=F.value;L.push(b.castForQueryWrapper({val:V,context:v}))}}catch(t){U.e(t)}finally{U.f()}r[O]={$in:L}}else r[O]=b.castForQueryWrapper({val:A,context:v})}else{for(var q=O.split("."),W=q.length,H=void 0,Y=void 0,K=void 0;W--&&(H=q.slice(0,W).join("."),!(b=e.path(H))););if(b){b.caster&&b.caster.schema?((K={})[Y=q.slice(W).join(".")]=A,r[O]=t(b.caster.schema,K,o,v)[Y]):r[O]=A;continue}if(y(A)){var z="";if(A.$near?z="$near":A.$nearSphere?z="$nearSphere":A.$within?z="$within":A.$geoIntersects?z="$geoIntersects":A.$geoWithin&&(z="$geoWithin"),z){var Q=new u.Number("__QueryCasting__"),J=A[z];if(null!=A.$maxDistance&&(A.$maxDistance=Q.castForQueryWrapper({val:A.$maxDistance,context:v})),null!=A.$minDistance&&(A.$minDistance=Q.castForQueryWrapper({val:A.$minDistance,context:v})),"$within"===z){var G=J.$center||J.$centerSphere||J.$box||J.$polygon;if(!G)throw new Error("Bad $within parameter: "+JSON.stringify(A));J=G}else if("$near"===z&&"string"==typeof J.type&&Array.isArray(J.coordinates))J=J.coordinates;else if(("$near"===z||"$nearSphere"===z||"$geoIntersects"===z)&&J.$geometry&&"string"==typeof J.$geometry.type&&Array.isArray(J.$geometry.coordinates))null!=J.$maxDistance&&(J.$maxDistance=Q.castForQueryWrapper({val:J.$maxDistance,context:v})),null!=J.$minDistance&&(J.$minDistance=Q.castForQueryWrapper({val:J.$minDistance,context:v})),d(J.$geometry)&&(J.$geometry=J.$geometry.toObject({transform:!1,virtuals:!1})),J=J.$geometry.coordinates;else if("$geoWithin"===z)if(J.$geometry){d(J.$geometry)&&(J.$geometry=J.$geometry.toObject({virtuals:!1}));var X=J.$geometry.type;if(-1===_.indexOf(X))throw new Error('Invalid geoJSON type for $geoWithin "'+X+'", must be "Polygon" or "MultiPolygon"');J=J.$geometry.coordinates}else J=J.$box||J.$polygon||J.$center||J.$centerSphere,d(J)&&(J=J.toObject({virtuals:!1}));m(J,Q,v);continue}}if(e.nested[O])continue;if(o.upsert&&o.strict){if("throw"===o.strict)throw new a(O);throw new a(O,'Path "'+O+'" is not in schema, strict mode is `true`, and upsert is `true`.')}if("throw"===o.strictQuery)throw new a(O,'Path "'+O+"\" is not in schema and strictQuery is 'throw'.");o.strictQuery&&delete r[O]}}}return r}},function(t,e,r){"use strict";function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o=r(12),i=r(49),s=r(77);
/*!
 * Casts val to an object suitable for `$text`. Throws an error if the object
 * can't be casted.
 *
 * @param {Any} val value to cast
 * @param {String} [path] path to associate with any errors that occured
 * @return {Object} casted object
 * @see https://docs.mongodb.com/manual/reference/operator/query/text/
 * @api private
 */
t.exports=function(t,e){if(null==t||"object"!==n(t))throw new o("$text",t,e);return null!=t.$search&&(t.$search=s(t.$search,e+".$search")),null!=t.$language&&(t.$language=s(t.$language,e+".$language")),null!=t.$caseSensitive&&(t.$caseSensitive=i(t.$caseSensitive,e+".$castSensitive")),null!=t.$diacriticSensitive&&(t.$diacriticSensitive=i(t.$diacriticSensitive,e+".$diacriticSensitive")),t}},function(t,e,r){"use strict";
/*!
* returns discriminator by discriminatorMapping.value
*
* @param {Schema} schema
* @param {string} value
*/t.exports=function(t,e){if(null==t||null==t.discriminators)return null;for(var r=0,n=Object.keys(t.discriminators);r<n.length;r++){var o=n[r],i=t.discriminators[o];if(null!=i.discriminatorMapping&&i.discriminatorMapping.value===e)return i}return null}},function(t,e,r){"use strict";function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function s(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=u(t);if(e){var o=u(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return a(this,r)}}function a(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function u(t){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var c=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}(r,t);var e=s(r);function r(){return o(this,r),e.apply(this,arguments)}return r}(r(9)),l=r(10);Object.defineProperty(c.prototype,"excludeIndexes",l),Object.defineProperty(c.prototype,"_id",l),
/*!
 * ignore
 */
t.exports=c},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o,i=r(12),s=r(19).EventEmitter,a=r(73),u=r(160),c=r(7),l=r(48),f=r(33).castToNumber,p=r(90),h=r(81),y=r(3),d=r(92),_=r(91),m=r(17).internalToObjectOptions;function v(t,e,r){t=_(t,r),this.caster=g(t),this.caster.path=e,this.caster.prototype.$basePath=e,this.schema=t,this.$isSingleNested=!0,c.call(this,e,r,"Embedded")}
/*!
 * ignore
 */
/*!
 * ignore
 */
function g(t,e){o||(o=r(89));var n=function(t,e,r){var n=this;this.$__parent=r,o.apply(this,arguments),this.$session(this.ownerDocument().$session()),r&&(r.on("save",(function(){n.emit("save",n),n.constructor.emit("save",n)})),r.on("isNew",(function(t){n.isNew=t,n.emit("isNew",t),n.constructor.emit("isNew",t)})))},i=null!=e?e.prototype:o.prototype;for(var a in(n.prototype=Object.create(i)).$__setSchema(t),n.prototype.constructor=n,n.schema=t,n.$isSingleNested=!0,n.events=new s,n.prototype.toBSON=function(){return this.toObject(m)},t.methods)n.prototype[a]=t.methods[a];for(var u in t.statics)n[u]=t.statics[u];for(var c in s.prototype)n[c]=s.prototype[c];return n}
/*!
 * Special case for when users use a common location schema to represent
 * locations for use with $geoWithin.
 * https://docs.mongodb.org/manual/reference/operator/query/geoWithin/
 *
 * @param {Object} val
 * @api private
 */t.exports=v,v.prototype=Object.create(c.prototype),v.prototype.constructor=v,v.prototype.OptionsConstructor=u,v.prototype.$conditionalHandlers.$geoWithin=function(t){return{$geometry:this.castForQuery(t.$geometry)}},
/*!
 * ignore
 */
v.prototype.$conditionalHandlers.$near=v.prototype.$conditionalHandlers.$nearSphere=h.cast$near,v.prototype.$conditionalHandlers.$within=v.prototype.$conditionalHandlers.$geoWithin=h.cast$within,v.prototype.$conditionalHandlers.$geoIntersects=h.cast$geoIntersects,v.prototype.$conditionalHandlers.$minDistance=f,v.prototype.$conditionalHandlers.$maxDistance=f,v.prototype.$conditionalHandlers.$exists=l,v.prototype.cast=function(t,e,r,o){if(t&&t.$isSingleNested&&t.parent===e)return t;if(null!=t&&("object"!==n(t)||Array.isArray(t)))throw new a(this.path,t);var i,s=d(this.caster,t),u=y(e,"$__.selected",{}),c=this.path,l=Object.keys(u).reduce((function(t,e){return e.startsWith(c+".")&&(t[e.substr(c.length+1)]=u[e]),t}),{});return r?((i=new s(void 0,l,e)).init(t),i):0===Object.keys(t).length?new s({},l,e,void 0,{priorDoc:o}):new s(t,l,e,void 0,{priorDoc:o})},v.prototype.castForQuery=function(t,e,r){var n;if(2===arguments.length){if(!(n=this.$conditionalHandlers[t]))throw new Error("Can't use "+t);return n.call(this,e)}if(null==(e=t))return e;this.options.runSetters&&(e=this._applySetters(e));var o=d(this.caster,e),s=null!=r&&null!=r.strict?r.strict:void 0;try{e=new o(e,s)}catch(t){if(!(t instanceof i))throw new i("Embedded",e,this.path,t,this);throw t}return e},v.prototype.doValidate=function(t,e,r,n){var o=d(this.caster,t);if(n&&n.skipSchemaValidators)return t instanceof o||(t=new o(t,null,r)),t.validate(e);c.prototype.doValidate.call(this,t,(function(r){return r?e(r):t?void t.validate(e):e(null)}),r,n)},v.prototype.doValidateSync=function(t,e,r){if(!r||!r.skipSchemaValidators){var n=c.prototype.doValidateSync.call(this,t,e);if(n)return n}if(t)return t.validateSync()},v.prototype.discriminator=function(t,e,r){return e=p(this.caster,t,e,r),this.caster.discriminators[t]=g(e,this.caster),this.caster.discriminators[t]},v.defaultOptions={},v.set=c.set,
/*!
 * ignore
 */
v.prototype.clone=function(){var t=Object.assign({},this.options),e=new this.constructor(this.schema,this.path,t);return e.validators=this.validators.slice(),void 0!==this.requiredValidator&&(e.requiredValidator=this.requiredValidator),e.caster.discriminators=Object.assign({},this.caster.discriminators),e}},function(t,e,r){"use strict";function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function s(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=u(t);if(e){var o=u(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return a(this,r)}}function a(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function u(t){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var c=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}(r,t);var e=s(r);function r(){return o(this,r),e.apply(this,arguments)}return r}(r(9)),l=r(10);Object.defineProperty(c.prototype,"_id",l),t.exports=c},function(t,e,r){"use strict";(function(e){
/*!
 * Module dependencies.
 */
function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o,i=r(85),s=r(162),a=r(7),u=r(79),c=r(2),l=r(0).populateModelSymbol,f=i.Binary,p=a.CastError;function h(t,e){a.call(this,t,e,"Buffer")}
/*!
 * ignore
 */
function y(t){return this.castForQuery(t)}h.schemaName="Buffer",h.defaultOptions={},
/*!
 * Inherits from SchemaType.
 */
h.prototype=Object.create(a.prototype),h.prototype.constructor=h,h.prototype.OptionsConstructor=s,
/*!
 * ignore
 */
h._checkRequired=function(t){return!(!t||!t.length)},h.set=a.set,h.checkRequired=a.checkRequired,h.prototype.checkRequired=function(t,e){return a._isRef(this,t,e,!0)?!!t:this.constructor._checkRequired(t)},h.prototype.cast=function(t,s,u){var h;if(a._isRef(this,t,s,u)){if(null==t)return t;if(o||(o=r(6)),t instanceof o)return t.$__.wasPopulated=!0,t;if(e.isBuffer(t))return t;if(!c.isObject(t))throw new p("Buffer",t,this.path,null,this);var y=s.$__fullPath(this.path);return(h=new((s.ownerDocument?s.ownerDocument():s).populated(y,!0).options[l])(t)).$__.wasPopulated=!0,h}if(t&&t._id&&(t=t._id),t&&t.isMongooseBuffer)return t;if(e.isBuffer(t))return t&&t.isMongooseBuffer||(t=new i(t,[this.path,s]),null!=this.options.subtype&&(t._subtype=this.options.subtype)),t;if(t instanceof f){if(h=new i(t.value(!0),[this.path,s]),"number"!=typeof t.sub_type)throw new p("Buffer",t,this.path,null,this);return h._subtype=t.sub_type,h}if(null===t)return t;var d=n(t);if("string"===d||"number"===d||Array.isArray(t)||"object"===d&&"Buffer"===t.type&&Array.isArray(t.data))return"number"===d&&(t=[t]),h=new i(t,[this.path,s]),null!=this.options.subtype&&(h._subtype=this.options.subtype),h;throw new p("Buffer",t,this.path,null,this)},h.prototype.subtype=function(t){return this.options.subtype=t,this},h.prototype.$conditionalHandlers=c.options(a.prototype.$conditionalHandlers,{$bitsAllClear:u,$bitsAnyClear:u,$bitsAllSet:u,$bitsAnySet:u,$gt:y,$gte:y,$lt:y,$lte:y}),h.prototype.castForQuery=function(t,e){var r;if(2===arguments.length){if(!(r=this.$conditionalHandlers[t]))throw new Error("Can't use "+t+" with Buffer.");return r.call(this,e)}e=t;var n=this._castForQuery(e);return n?n.toObject({transform:!1,virtuals:!1}):n},
/*!
 * Module exports.
 */
t.exports=h}).call(this,r(1).Buffer)},function(t,e,r){"use strict";function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function s(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=u(t);if(e){var o=u(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return a(this,r)}}function a(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function u(t){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var c=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}(r,t);var e=s(r);function r(){return o(this,r),e.apply(this,arguments)}return r}(r(9)),l=r(10);Object.defineProperty(c.prototype,"subtype",l),
/*!
 * ignore
 */
t.exports=c},function(t,e,r){"use strict";
/*!
 * Module requirements.
 */var n=r(5),o=r(164),i=r(7),s=r(165),a=r(2),u=i.CastError;function c(t,e){i.call(this,t,e,"Date")}
/*!
 * Date Query casting.
 *
 * @api private
 */
function l(t){return this.cast(t)}c.schemaName="Date",c.defaultOptions={},
/*!
 * Inherits from SchemaType.
 */
c.prototype=Object.create(i.prototype),c.prototype.constructor=c,c.prototype.OptionsConstructor=o,
/*!
 * ignore
 */
c._cast=s,c.set=i.set,c.cast=function(t){return 0===arguments.length||(!1===t&&(t=this._defaultCaster),this._cast=t),this._cast},
/*!
 * ignore
 */
c._defaultCaster=function(t){if(null!=t&&!(t instanceof Date))throw new Error;return t},c.prototype.expires=function(t){return this._index&&"Object"===this._index.constructor.name||(this._index={}),this._index.expires=t,a.expires(this._index),this},
/*!
 * ignore
 */
c._checkRequired=function(t){return t instanceof Date},c.checkRequired=i.checkRequired,c.prototype.checkRequired=function(t,e){return i._isRef(this,t,e,!0)?!!t:("function"==typeof this.constructor.checkRequired?this.constructor.checkRequired():c.checkRequired())(t)},c.prototype.min=function(t,e){if(this.minValidator&&(this.validators=this.validators.filter((function(t){return t.validator!==this.minValidator}),this)),t){var r=e||n.messages.Date.min;"string"==typeof r&&(r=r.replace(/{MIN}/,t===Date.now?"Date.now()":t.toString()));var o=this;this.validators.push({validator:this.minValidator=function(e){var r=t;"function"==typeof t&&t!==Date.now&&(r=r.call(this));var n=r===Date.now?r():o.cast(r);return null===e||e.valueOf()>=n.valueOf()},message:r,type:"min",min:t})}return this},c.prototype.max=function(t,e){if(this.maxValidator&&(this.validators=this.validators.filter((function(t){return t.validator!==this.maxValidator}),this)),t){var r=e||n.messages.Date.max;"string"==typeof r&&(r=r.replace(/{MAX}/,t===Date.now?"Date.now()":t.toString()));var o=this;this.validators.push({validator:this.maxValidator=function(e){var r=t;"function"==typeof r&&r!==Date.now&&(r=r.call(this));var n=r===Date.now?r():o.cast(r);return null===e||e.valueOf()<=n.valueOf()},message:r,type:"max",max:t})}return this},c.prototype.cast=function(t){var e;e="function"==typeof this._castFunction?this._castFunction:"function"==typeof this.constructor.cast?this.constructor.cast():c.cast();try{return e(t)}catch(e){throw new u("date",t,this.path,e,this)}},c.prototype.$conditionalHandlers=a.options(i.prototype.$conditionalHandlers,{$gt:l,$gte:l,$lt:l,$lte:l}),c.prototype.castForQuery=function(t,e){if(2!==arguments.length)return this._castForQuery(t);var r=this.$conditionalHandlers[t];if(!r)throw new Error("Can't use "+t+" with Date.");return r.call(this,e)},
/*!
 * Module exports.
 */
t.exports=c},function(t,e,r){"use strict";function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function s(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=u(t);if(e){var o=u(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return a(this,r)}}function a(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function u(t){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var c=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}(r,t);var e=s(r);function r(){return o(this,r),e.apply(this,arguments)}return r}(r(9)),l=r(10);Object.defineProperty(c.prototype,"min",l),Object.defineProperty(c.prototype,"max",l),Object.defineProperty(c.prototype,"expires",l),
/*!
 * ignore
 */
t.exports=c},function(t,e,r){"use strict";var n=r(22);t.exports=function(t){return null==t||""===t?null:t instanceof Date?(n.ok(!isNaN(t.valueOf())),t):(n.ok("boolean"!=typeof t),e=t instanceof Number||"number"==typeof t?new Date(t):"string"==typeof t&&!isNaN(Number(t))&&(Number(t)>=275761||Number(t)<-271820)?new Date(Number(t)):"function"==typeof t.valueOf?new Date(t.valueOf()):new Date(t),isNaN(e.valueOf())?void n.ok(!1):e);var e}},function(t,e,r){"use strict";(function(e){
/*!
 * Module dependencies.
 */
var n,o=r(167),i=r(7),s=r(86),a=r(13),u=r(2),c=r(0).populateModelSymbol,l=i.CastError;function f(t,e){var r="string"==typeof t&&24===t.length&&/^[a-f0-9]+$/i.test(t),n=e&&e.suppressWarning;!r&&void 0!==t||n||(console.warn("mongoose: To create a new ObjectId please try `Mongoose.Types.ObjectId` instead of using `Mongoose.Schema.ObjectId`. Set the `suppressWarning` option if you're trying to create a hex char path in your schema."),console.trace()),i.call(this,t,e,"ObjectID")}
/*!
 * ignore
 */
function p(t){return this.cast(t)}
/*!
 * ignore
 */
function h(){return new a}function y(t){if(n||(n=r(6)),this instanceof n){if(void 0===t){var e=new a;return this.$__._id=e,e}this.$__._id=t}return t}
/*!
 * Module exports.
 */f.schemaName="ObjectId",f.defaultOptions={},
/*!
 * Inherits from SchemaType.
 */
f.prototype=Object.create(i.prototype),f.prototype.constructor=f,f.prototype.OptionsConstructor=o,f.get=i.get,f.set=i.set,f.prototype.auto=function(t){return t&&(this.default(h),this.set(y)),this},
/*!
 * ignore
 */
f._checkRequired=function(t){return t instanceof a},
/*!
 * ignore
 */
f._cast=s,f.cast=function(t){return 0===arguments.length||(!1===t&&(t=this._defaultCaster),this._cast=t),this._cast},
/*!
 * ignore
 */
f._defaultCaster=function(t){if(!(t instanceof a))throw new Error(t+" is not an instance of ObjectId");return t},f.checkRequired=i.checkRequired,f.prototype.checkRequired=function(t,e){return i._isRef(this,t,e,!0)?!!t:("function"==typeof this.constructor.checkRequired?this.constructor.checkRequired():f.checkRequired())(t)},f.prototype.cast=function(t,o,s){if(i._isRef(this,t,o,s)){if(null==t)return t;if(n||(n=r(6)),t instanceof n)return t.$__.wasPopulated=!0,t;if(t instanceof a)return t;if("objectid"===(t.constructor.name||"").toLowerCase())return new a(t.toHexString());if(e.isBuffer(t)||!u.isObject(t))throw new l("ObjectId",t,this.path,null,this);var p=o.$__fullPath(this.path),h=(o.ownerDocument?o.ownerDocument():o).populated(p,!0),y=t;return o.$__.populated&&o.$__.populated[p]&&o.$__.populated[p].options&&o.$__.populated[p].options.options&&o.$__.populated[p].options.options.lean||((y=new h.options[c](t)).$__.wasPopulated=!0),y}var d;d="function"==typeof this._castFunction?this._castFunction:"function"==typeof this.constructor.cast?this.constructor.cast():f.cast();try{return d(t)}catch(e){throw new l("ObjectId",t,this.path,e,this)}},f.prototype.$conditionalHandlers=u.options(i.prototype.$conditionalHandlers,{$gt:p,$gte:p,$lt:p,$lte:p}),h.$runBeforeSetters=!0,t.exports=f}).call(this,r(1).Buffer)},function(t,e,r){"use strict";function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function s(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=u(t);if(e){var o=u(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return a(this,r)}}function a(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function u(t){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var c=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}(r,t);var e=s(r);function r(){return o(this,r),e.apply(this,arguments)}return r}(r(9)),l=r(10);Object.defineProperty(c.prototype,"auto",l),Object.defineProperty(c.prototype,"populate",l),
/*!
 * ignore
 */
t.exports=c},function(t,e,r){"use strict";(function(e){
/*!
 * Module dependencies.
 */
var n,o=r(7),i=o.CastError,s=r(20),a=r(169),u=r(2),c=r(0).populateModelSymbol;function l(t,e){o.call(this,t,e,"Decimal128")}
/*!
 * ignore
 */
function f(t){return this.cast(t)}l.schemaName="Decimal128",l.defaultOptions={},
/*!
 * Inherits from SchemaType.
 */
l.prototype=Object.create(o.prototype),l.prototype.constructor=l,
/*!
 * ignore
 */
l._cast=a,l.set=o.set,l.cast=function(t){return 0===arguments.length||(!1===t&&(t=this._defaultCaster),this._cast=t),this._cast},
/*!
 * ignore
 */
l._defaultCaster=function(t){if(null!=t&&!(t instanceof s))throw new Error;return t},
/*!
 * ignore
 */
l._checkRequired=function(t){return t instanceof s},l.checkRequired=o.checkRequired,l.prototype.checkRequired=function(t,e){return o._isRef(this,t,e,!0)?!!t:("function"==typeof this.constructor.checkRequired?this.constructor.checkRequired():l.checkRequired())(t)},l.prototype.cast=function(t,a,f){if(o._isRef(this,t,a,f)){if(null==t)return t;if(n||(n=r(6)),t instanceof n)return t.$__.wasPopulated=!0,t;if(t instanceof s)return t;if(e.isBuffer(t)||!u.isObject(t))throw new i("Decimal128",t,this.path,null,this);var p=a.$__fullPath(this.path),h=(a.ownerDocument?a.ownerDocument():a).populated(p,!0),y=t;return a.$__.populated&&a.$__.populated[p]&&a.$__.populated[p].options&&a.$__.populated[p].options.options&&a.$__.populated[p].options.options.lean||((y=new h.options[c](t)).$__.wasPopulated=!0),y}var d;d="function"==typeof this._castFunction?this._castFunction:"function"==typeof this.constructor.cast?this.constructor.cast():l.cast();try{return d(t)}catch(e){throw new i("Decimal128",t,this.path,e,this)}},l.prototype.$conditionalHandlers=u.options(o.prototype.$conditionalHandlers,{$gt:f,$gte:f,$lt:f,$lte:f}),
/*!
 * Module exports.
 */
t.exports=l}).call(this,r(1).Buffer)},function(t,e,r){"use strict";(function(e){function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o=r(20),i=r(22);t.exports=function(t){return null==t?t:"object"===n(t)&&"string"==typeof t.$numberDecimal?o.fromString(t.$numberDecimal):t instanceof o?t:"string"==typeof t?o.fromString(t):e.isBuffer(t)?new o(t):"number"==typeof t?o.fromString(String(t)):"function"==typeof t.valueOf&&"string"==typeof t.valueOf()?o.fromString(t.valueOf()):void i.ok(!1)}}).call(this,r(1).Buffer)},function(t,e,r){"use strict";(function(e){
/*!
 * ignore
 */
function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return i(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return i(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,a=!0,u=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return a=t.done,t},e:function(t){u=!0,s=t},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw s}}}}function i(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function s(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}function a(t,e,r){return(a="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,r){var n=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=f(t)););return t}(t,e);if(n){var o=Object.getOwnPropertyDescriptor(n,e);return o.get?o.get.call(r):o.value}})(t,e,r||t)}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function c(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=f(t);if(e){var o=f(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return l(this,r)}}function l(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function f(t){return(f=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var p=r(87),h=r(171),y=r(7),d=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}(h,t);var r,n,i,l=c(h);function h(t,e){var r;return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,h),(r=l.call(this,t,e,"Map")).$isSchemaMap=!0,r}return r=h,(n=[{key:"set",value:function(t,e){return y.set(t,e)}},{key:"cast",value:function(t,r,n){if(t instanceof p)return t;var i=this.path;if(n){var s=new p({},i,r,this.$__schemaType);if(t instanceof e.Map){var a,u=o(t.keys());try{for(u.s();!(a=u.n()).done;){var c=a.value,l=t.get(c);l=null==l?s.$__schemaType._castNullish(l):s.$__schemaType.cast(l,r,!0,null,{path:i+"."+c}),s.$init(c,l)}}catch(t){u.e(t)}finally{u.f()}}else for(var f=0,h=Object.keys(t);f<h.length;f++){var y=h[f],d=t[y];d=null==d?s.$__schemaType._castNullish(d):s.$__schemaType.cast(d,r,!0,null,{path:i+"."+y}),s.$init(y,d)}return s}return new p(t,i,r,this.$__schemaType)}},{key:"clone",value:function(){var t=a(f(h.prototype),"clone",this).call(this);return null!=this.$__schemaType&&(t.$__schemaType=this.$__schemaType.clone()),t}}])&&s(r.prototype,n),i&&s(r,i),h}(y);d.prototype.OptionsConstructor=h,d.defaultOptions={},t.exports=d}).call(this,r(11))},function(t,e,r){"use strict";function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function i(t,e){return(i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function s(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var r,n=u(t);if(e){var o=u(this).constructor;r=Reflect.construct(n,arguments,o)}else r=n.apply(this,arguments);return a(this,r)}}function a(t,e){return!e||"object"!==n(e)&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function u(t){return(u=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var c=function(t){!function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&i(t,e)}(r,t);var e=s(r);function r(){return o(this,r),e.apply(this,arguments)}return r}(r(9)),l=r(10);Object.defineProperty(c.prototype,"of",l),t.exports=c},function(t,e,r){"use strict";(function(t){
/*!
 * Module dependencies.
 */
function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var o=r(15).get().Binary,i=r(20),s=r(13),a=r(29);
/*!
 * ignore
 */
function u(e){return e&&"object"===n(e)&&!(e instanceof Date)&&!(e instanceof s)&&(!Array.isArray(e)||e.length>0)&&!(e instanceof t)&&!(e instanceof i)&&!(e instanceof o)}e.flatten=
/*!
 * ignore
 */
function e(r,n,o,i){var s;s=r&&a(r)&&!t.isBuffer(r)?Object.keys(r.toObject({transform:!1,virtuals:!1})):Object.keys(r||{});var c=s.length,l={};n=n?n+".":"";for(var f=0;f<c;++f){var p=s[f],h=r[p];l[n+p]=h;var y=i&&i.path&&i.path(n+p),d=i&&i.nested&&i.nested[n+p];if(!y||"Mixed"!==y.instance){if(u(h)){if(o&&o.skipArrays&&Array.isArray(h))continue;var _=e(h,n+p,o,i);for(var m in _)l[m]=_[m];Array.isArray(h)&&(l[n+p]=h)}if(d)for(var v=Object.keys(i.paths),g=0,b=v;g<b.length;g++){var w=b[g];w.startsWith(n+p+".")&&!l.hasOwnProperty(w)&&(l[w]=void 0)}}}return l}
/*!
 * ignore
 */,e.modifiedPaths=function e(r,n,o){var i=Object.keys(r||{}),s=i.length;o=o||{},n=n?n+".":"";for(var c=0;c<s;++c){var l=i[c],f=r[l];o[n+l]=!0,a(f)&&!t.isBuffer(f)&&(f=f.toObject({transform:!1,virtuals:!1})),u(f)&&e(f,n+l,o)}return o}}).call(this,r(1).Buffer)},function(t,e,r){"use strict";var n=r(3);
/*!
 * Like `schema.path()`, except with a document, because impossible to
 * determine path type without knowing the embedded discriminator key.
 */t.exports=function t(e,r,o){for(var i=(o=o||{}).typeOnly,s=r.split("."),a=null,u="adhocOrUndefined",c=0;c<s.length;++c){var l=s.slice(0,c+1).join(".");if(null!=(a=e.schema.path(l))){if("Mixed"===a.instance)return i?"real":a;if(u=e.schema.pathType(l),(a.$isSingleNested||a.$isMongooseDocumentArrayElement)&&null!=a.schema.discriminators){var f=a.schema.discriminators,p=e.get(l+"."+n(a,"schema.options.discriminatorKey"));if(null==p||null==f[p])continue;var h=s.slice(c+1).join(".");return t(e.get(l),h,o)}}else u="adhocOrUndefined"}return i?u:a}},function(t,e,r){"use strict";
/*!
 * ignore
 */
/*!
 * Returns this documents _id cast to a string.
 */
function n(){return null!=this._id?String(this._id):null}t.exports=function(t){!t.paths.id&&!t.options.noVirtualId&&t.options.id&&t.virtual("id").get(n)}},function(t,e,r){"use strict";var n=r(58);
/*!
 * ignore
 */t.exports=function(t){var e=Object.keys(t),r=e.length,o=null;if(1===r&&"_id"===e[0])o=!!t[e[r]];else for(;r--;)if("_id"!==e[r]&&n(t[e[r]])){o=!t[e[r]];break}return o}},function(t,e,r){"use strict";
/*!
 * Module dependencies
 */function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function o(t,e){var r;if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(r=function(t,e){if(!t)return;if("string"==typeof t)return i(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);"Object"===r&&t.constructor&&(r=t.constructor.name);if("Map"===r||"Set"===r)return Array.from(t);if("Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return i(t,e)}(t))||e&&t&&"number"==typeof t.length){r&&(t=r);var n=0,o=function(){};return{s:o,n:function(){return n>=t.length?{done:!0}:{done:!1,value:t[n++]}},e:function(t){throw t},f:o}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var s,a=!0,u=!1;return{s:function(){r=t[Symbol.iterator]()},n:function(){var t=r.next();return a=t.done,t},e:function(t){u=!0,s=t},f:function(){try{a||null==r.return||r.return()}finally{if(u)throw s}}}}function i(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}var s=r(177),a=r(3),u=r(34),c=r(58),l=r(28);
/*!
 * Set each path query option to lean
 *
 * @param {Object} option
 */
function f(t){return function(e){e.options||(e.options={}),null!=t&&Array.isArray(t.virtuals)&&((t=Object.assign({},t)).virtuals=t.virtuals.filter((function(t){return"string"==typeof t&&t.startsWith(e.path+".")})).map((function(t){return t.slice(e.path.length+1)}))),e.options.lean=t}}
/*!
 * Handle the `WriteOpResult` from the server
 */
/*!
 * Prepare a set of path options for query population.
 *
 * @param {Query} query
 * @param {Object} options
 * @return {Array}
 */
e.preparePopulationOptions=function(t,e){var r=t.options.populate,n=Object.keys(r).reduce((function(t,e){return t.concat([r[e]])}),[]);return null!=e.lean&&n.filter((function(t){return null==a(t,"options.lean")})).forEach(f(e.lean)),n},
/*!
 * Prepare a set of path options for query population. This is the MongooseQuery
 * version
 *
 * @param {Query} query
 * @param {Object} options
 * @return {Array}
 */
e.preparePopulationOptionsMQ=function(t,e){var r=t._mongooseOptions.populate,n=Object.keys(r).reduce((function(t,e){return t.concat([r[e]])}),[]);null!=e.lean&&n.filter((function(t){return null==a(t,"options.lean")})).forEach(f(e.lean));var o=a(t,"options.session",null);null!=o&&n.forEach((function(t){null!=t.options?"session"in t.options||(t.options.session=o):t.options={session:o}}));var i=t._fieldsForExec();return n.forEach((function(t){t._queryProjection=i})),n},
/*!
 * If the document is a mapped discriminator type, it returns a model instance for that type, otherwise,
 * it returns an instance of the given model.
 *
 * @param {Model}  model
 * @param {Object} doc
 * @param {Object} fields
 *
 * @return {Document}
 */
e.createModel=function(t,r,n,o){t.hooks.execPreSync("createModel",r);var i=t.schema?t.schema.discriminatorMapping:null,s=i&&i.isRoot?i.key:null,a=r[s];if(s&&a&&t.discriminators){var c=t.discriminators[a]||u(t,a);if(c){var f=l(o);return e.applyPaths(f,c.schema),new c(void 0,f,!0)}}return new t(void 0,n,{skipId:!0,isNew:!1,willInit:!0})},
/*!
 * ignore
 */
e.applyPaths=function(t,e){var r,i,u;if(t)for(u=(i=Object.keys(t)).length;u--;)if("+"!==i[u][0]){var l=t[i[u]];if(c(l)){r=!l;break}}var f=[],p=[],h=[];switch(function e(o,u){if(u||(u=""),-1!==h.indexOf(o))return[];h.push(o);var c=[];return o.eachPath((function(o,l){u&&(o=u+"."+o);var h=function(e,o){var s="+"+e,u=t&&s in t;u&&delete t[s];if("boolean"!=typeof o.selected)return;if(u)return delete t[s],void(!1===r&&i.length>1&&!~i.indexOf(e)&&(t[e]=1));for(var c=e.split("."),l="",h=0;h<c.length;++h)if(l+=l.length?"."+c[h]:c[h],-1!==p.indexOf(l))return;if(!r&&a(o,"options.$skipDiscriminatorCheck",!1))for(var y="",d=0;d<c.length;++d){y+=(0===y.length?"":".")+c[d];var _=a(t,y,!1)||a(t,y+".$",!1);if(_&&"object"!==n(_))return}return(o.selected?f:p).push(e),e}(o,l);if(null!=h&&c.push(h),l.schema){var y=e(l.schema,o);!1===r&&s(t,o,l.schema,f,y)}})),h.pop(),c}(e),r){case!0:var y,d=o(p);try{for(d.s();!(y=d.n()).done;){var _=y.value;t[_]=0}}catch(t){d.e(t)}finally{d.f()}break;case!1:e&&e.paths._id&&e.paths._id.options&&!1===e.paths._id.options.select&&(t._id=0);var m,v=o(f);try{for(v.s();!(m=v.n()).done;){var g=m.value;t[g]=t[g]||1}}catch(t){v.e(t)}finally{v.f()}break;case void 0:if(null==t)break;for(var b=0,w=Object.keys(t||{});b<w.length;b++){var O=w[b];O.startsWith("+")&&delete t[O]}var S,A=o(p);try{for(A.s();!(S=A.n()).done;){var E=S.value;t[E]=0}}catch(t){A.e(t)}finally{A.f()}}},e.handleDeleteWriteOpResult=function(t){return function(e,r){if(e)return t(e);var n=Object.assign({},r.result);return null!=a(r,"result.n",null)&&(n.deletedCount=r.result.n),null!=r.deletedCount&&(n.deletedCount=r.deletedCount),t(null,n)}}},function(t,e,r){"use strict";t.exports=function(t,e,r,n,o){var i=Object.keys(t).reduce((function(t,r){return t||r.startsWith(e+".")}),!1),s=e+"."+r.options.discriminatorKey;i||1!==o.length||o[0]!==s||n.splice(n.indexOf(s),1)}},function(t,e,r){"use strict";function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}t.exports=function(t){return!!t&&("object"===n(t)||"function"==typeof t)&&"function"==typeof t.then}},function(t,e,r){"use strict";
/*!
 * Module dependencies.
 */var n=r(6),o=r(19).EventEmitter,i=r(5),s=r(52),a=r(13),u=i.ValidationError,c=r(76),l=r(21);function f(t,e,r,o,u){if(!(this instanceof f))return new f(t,e,r,o,u);if(l(e)&&!e.instanceOfSchema&&(e=new s(e)),e=this.schema||e,!this.schema&&e.options._id&&void 0===(t=t||{})._id&&(t._id=new a),!e)throw new i.MissingSchemaError;for(var p in this.$__setSchema(e),n.call(this,t,r,o,u),c(this,e,{decorateDoc:!0}),e.methods)this[p]=e.methods[p];for(var h in e.statics)this[h]=e.statics[h]}
/*!
 * Inherit from the NodeJS document
 */f.prototype=Object.create(n.prototype),f.prototype.constructor=f,
/*!
 * ignore
 */
f.events=new o,
/*!
 * Browser doc exposes the event emitter API
 */
f.$emitter=new o,["on","once","emit","listeners","removeListener","setMaxListeners","removeAllListeners","addListener"].forEach((function(t){f[t]=function(){return f.$emitter[t].apply(f.$emitter,arguments)}})),
/*!
 * Module exports.
 */
f.ValidationError=u,t.exports=f}])}));
},{}],"db":[function(require,module,exports){
// Frontend Database Exports.
// This code will only be available to khe.io, NOT staff.khe.io
module.exports = require('./shared');

},{"./shared":1}]},{},[]);
