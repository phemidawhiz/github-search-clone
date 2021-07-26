
import format from 'date-fns/format';
import { ISearchResultReposInfo, ISearchResultUsersInfo } from 'types/interfaces';
import { IAuthInfo } from 'types/user';
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

// get repositories from localStorage 
export const getReposFromLocalStorage = (): ISearchResultReposInfo | null | undefined => {
  try { 
      const repos = JSON.parse(localStorage?.getItem("repos") as string) as ISearchResultReposInfo;

      return repos;
  } catch (e) {
      console.error(e.message);
      return null;
  }
};

// get users from localStorage 
export const getUsersFromLocalStorage = (): ISearchResultUsersInfo | null | undefined => {
  try { 
      const users = JSON.parse(localStorage?.getItem("users") as string) as ISearchResultUsersInfo;

      return users;
  } catch (e) {
      console.error(e.message);
      return null;
  }
};