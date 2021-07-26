/* eslint-disable @typescript-eslint/interface-name-prefix */
import { StringSchema } from 'yup';

declare module 'yup' {
  // Allow Typescript to recognize custom yup method
  interface StringSchema {
    phonenumber(): StringSchema;
  }
}
