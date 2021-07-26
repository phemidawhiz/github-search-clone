import React, { useState } from 'react';
import omit from 'lodash.omit';
import yup from 'lib/yup';

import { composeClasses } from 'utils/generic';

import styles from './GitSearchInput.scss';

export enum InputValidationTypes {
  alphanumeric = 'alphanumeric', // support only alphanumeric character
  text = 'text', // support only alphabet
}

export interface IOptions {
  key: number;
  label?: string;
  value: string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  validation?: InputValidationTypes;
  maxlength?: number;
  isInHeader?: boolean;
  handleInputChange?: (e: any) => void;
}

export const Input = React.forwardRef<HTMLInputElement, IInputProps>(({ handleInputChange, isInHeader, maxlength, validation, ...props }, ref) => {

  const [validationError, setValidationError] = useState('');

  const onChangeValidation = async (event: any) => {

    // keep the value of the input in inputs state
    if (handleInputChange) {
      handleInputChange(event);
    }

    switch (validation) {
      case InputValidationTypes.text: {
        const schema = yup.string().matches(/^([A-Za-z.'"]|,|_|-|\s)*$/,
          { excludeEmptyString: true, message: 'Special characters and numbers are not allowed.' });
        const errMsg = await schema.validate(event.target.value)
          .then(() => '')
          .catch((err: yup.ValidationError) => {
            return err.message;
          });
        setValidationError(errMsg);
        break;
      }

      case InputValidationTypes.alphanumeric: {
        const schema = yup.string().matches(/^([\w\s',"/#.-])+$/i,
          { excludeEmptyString: true, message: 'Special characters are not allowed.' });
        const errMsg = await schema.validate(event.target.value)
          .then(() => '')
          .catch((err: yup.ValidationError) => {
            return err.message;
          });
        setValidationError(errMsg);
        break;
      }

      default:
        break;
    }
  };

  return (
    <>
      <input
        className={ isInHeader ? composeClasses(styles.smallInput, styles.input) : styles.input}
        maxLength={maxlength}
        onChange={validation && onChangeValidation}
        ref={ref}
        {...omit(props, ['className', 'validation'])}
      />
      {validationError !== '' ? <span className={styles.formErrors}>{validationError}</span> : ''}
    </>
  );
});

