/**
 * @author: dwi.setiyadi@gmail.com
*/

export const HttpResponse = (code: number, message: any): any => {
  let error: any;

  switch (true) {
    case code >= 100 && code < 300:
      error = null;
      break;

    case code >= 400:
      error = 'Bad Request';
      break;

    case code >= 500:
      error = 'Internal Server Error';
      break;
  
    default:
      break;
  }

  return {
    statusCode: code,
    error: error,
    message: message,
  };
};
