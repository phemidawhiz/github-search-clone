/**
 * Combine a number of classes removing undefined values
 * @param {string} styles A list of classes to compose together
 */

export const composeClasses = (...styles: (string | boolean | undefined)[]): string => styles
  .filter(item => item)
  .join(' ');

export const capitalizeValue = (text: string): string => {
  if (text === null) return '';
  return text.toLowerCase().split(' ').map((eachText) => {
    eachText = String(eachText).trim();
    eachText = (eachText !== 'null' && eachText !== 'undefined') && eachText || '';
    return eachText.charAt(0).toUpperCase() + eachText.slice(1);
  }).join(' ');
};

export const objectIsEmpty = (obj: Object): boolean => Object.keys(obj).length === 0 && obj.constructor === Object;
