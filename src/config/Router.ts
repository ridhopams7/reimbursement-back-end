/**
 * @author Dwi Setiyadi
 */

import RouterAuth from '../modules/auth/RouterAuth';
import RouterHome from '../modules/home/RouterHome';

//foundation
import RouterAccountingPeriod from '../modules/accounting-periods/RouterAccountingPeriod';

//transaction
import RouterReport from '../modules/report/RouterReport';

import RouterMaster from '../modules/master/RouterMaster';

import RouterReimbursement from '../modules/reimbursement/RouterReimbursement';
import RouterReimbursementDetail from '../modules/reimbursement-detail/RouterReimbursementDetail';
import RouterReimbursementEvidance from '../modules/reimbursement-evidence/RouterReimbursementEvidance';
import RouterRole from '../modules/role/RouterRole';
import RouterMenu from '../modules/menu/RouterMenu';
import RouterUser from '../modules/user/RouterUser';
import RouterRoleMenu from '../modules/role-menu/RouterRoleMenu';
import RouterRoleUser from '../modules/role-user/RouterRoleUser';
import RouterGJReport from '../modules/report/general-journal/RouterGJReport';


//sample
export default [
  ...RouterAuth,
  ...RouterHome,

  //foundation
  ...RouterAccountingPeriod,
  ...RouterReport,
  ...RouterMaster,
  ...RouterReimbursement,
  ...RouterReimbursementDetail,
  ...RouterReimbursementEvidance,
  ...RouterRole,
  ...RouterMenu,
  ...RouterUser,
  ...RouterRoleMenu,
  ...RouterRoleUser,
  ...RouterGJReport,
];
