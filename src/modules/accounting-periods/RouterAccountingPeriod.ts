import { AccountingPeriods } from './controllers';

const Routes: any = [
  {
    method: 'GET',
    path: '/accounting-periods',
    handler: (): object => AccountingPeriods.getData(),
  },
  {
    method: 'GET',
    path: '/accounting-periods/stateactive',
    config: {
      auth: false,
    },
    handler: (): object => AccountingPeriods.getDataByStateActive(),
  },
  {
    method: 'POST',
    path: '/accounting-periods/state',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => AccountingPeriods.getDataByState_(req, res),
  },
  {
    method: 'POST',
    path: '/accounting-periods/all',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => AccountingPeriods.getDataAll(req, res),
  },
  {
    method: 'POST',
    path: '/accounting-periods/state/start-end-date',
    handler: (req: any, res: any): object => AccountingPeriods.getDateByState(req, res),
  },
];

export default Routes;