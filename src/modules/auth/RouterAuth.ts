/**
 * @author Dwi Setiyadi
 */

import { Auths } from './controllers';

const Routes: any = [
  {
    method: 'POST',
    path: '/signin',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Auths.signIn(req, res),
  },
  {
    method: 'POST',
    path: '/signup',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Auths.signUp(req, res),
  },
];

export default Routes;
