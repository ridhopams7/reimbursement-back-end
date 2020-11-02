/**
 * @author Dwi Setiyadi
 */

import { Dashboard  } from './controllers';

const Routes: any = [
  {
    method: 'GET',
    path: '/',
    handler: (req: any, res: any): object => Dashboard.welcome(req, res),
    
  },
];

export default Routes;
