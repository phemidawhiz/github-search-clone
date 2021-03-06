
import { TEXT_LENGTH, RECORDS_PER_PAGE } from 'config/constants';
import format from 'date-fns/format';
import { IAuthInfo } from 'types/user';

//comma separation of search result count
export const makeCountCommaSeperated = (num: string | number) => {
  const p = parseFloat(String(num)).toFixed(2).split('.');
  const formattedCount = `${p[0].split('').reverse().reduce((acc, num, i) => {
    return num === '-' ? acc : num + (i && !(i % 3) ? ',' : '') + acc;
  }, '')}.${p[1]}`;
  return formattedCount;
};

export const getPageNumbers = (resultCount: number): string => {
  let pageNumbersInfo: string = '';
  const pages: number = Math.floor(resultCount/RECORDS_PER_PAGE);
  try {
    for(let i=1; i<pages; i++) {
      pageNumbersInfo = pageNumbersInfo + '  ' + (String(i))
    }
  
    if(pages > 6) {
      return '1 2 3 4 5 6 ... ' + formatCount(pages);
    }
    return pageNumbersInfo;
  } catch(e) {
    console.error(e);
    return "";
  }
  
}

export const makeTextShorter = (param: string | null | undefined): string | null | undefined => {
  try {
    
    if (param !== null) {
      if(param && param?.length < TEXT_LENGTH) 
        return `${param?.substr(param?.length)}`
      return `${param?.substr(TEXT_LENGTH)}...`;
    }

    return null;
  } catch (e) {
      console.error(e.message);
      return null;
  }
}

//add K and M for counts above 1000 to prevent long numbers
export const formatCount = (resultCount: number | undefined): string => {
  if((resultCount) && (resultCount > 1000 && resultCount < 1000000)) {
    return `${(Math.floor(resultCount) / 1000).toFixed(2)}K`;
  } else if((resultCount) && resultCount > 1000000) {
    return `${(Math.floor(resultCount) / 1000000).toFixed(2)}M`;
  }

  return `${resultCount}`;
}

/**
 * @description Format date and time input
 * @param datetime
 * @param addTime
 * @param formatGBInputDate if the input format is in 21-07-2020
 */
export const formatDate = (datetime: Date | string, addTime = false, formatGBInputDate = false): string => {
  if (typeof datetime === "string" && formatGBInputDate) {
    const date = datetime.split('-');
    datetime = new Date(Number(date[2]), Number(date[1])-1, Number(date[0]));
  }

  return (datetime ? format(datetime, addTime && 'MMM D, YYYY hh:mm A' || 'MMM D, YYYY', {
  }) : '')
};

// fix for undefined localStorage item
export const getAuthToken = (): string | null => {
  try { //use try catch blocks to make sure page does not break when localStorage is not defined
      const userData = JSON.parse(localStorage?.getItem("user") as string) as IAuthInfo;
      if (userData.access_token !== null) {
          return userData.access_token;
      }

      return null;
  } catch (e) {
      console.error(e.message);
      return null;
  }
};