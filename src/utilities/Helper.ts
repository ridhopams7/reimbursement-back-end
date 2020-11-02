export const isDateValid = (value: string) => {
  const date = new Date(value);
  if (Object.prototype.toString.call(date) === "[object Date]") {
    // it is a date
    if (isNaN(date.getTime())) {
      // date is not valid
      return false;
    }

    // date is valid
    return true;
  }
  
  // not a date
  return false;
};