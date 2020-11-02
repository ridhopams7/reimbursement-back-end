/**
 * @author Dwi Setiyadi
 */

import { HttpResponse } from '../../../utilities';
class Dashboard {
  static welcome = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    return HttpResponse(200, 'welcome');
  }
}

export default Dashboard;
