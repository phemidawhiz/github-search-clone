/* eslint-disable func-names */
import * as yup from 'yup';

yup.addMethod(yup.string, 'phonenumber', function () {
  return this.test('phone', 'Incorrect phone number format, expected format is similar to 08012345678', function (value) {
    // if (this.isType(value)) return value;

    const { path, createError } = this;
    const phoneNumberRegex = /^[+]?[234]?[0-9]{3}?[0-9]{4,10}$/im;

    const isValid = value && value.match(phoneNumberRegex);

    return isValid
      ? value
      : createError({
        message: 'Incorrect phone number format',
        path,
      });
  });
});

export default yup;
