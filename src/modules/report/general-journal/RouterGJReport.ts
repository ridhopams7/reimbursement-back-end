import { GJReport } from './controllers';

const Routes: any = [
  {
    method: 'POST',
    path: '/report/general-journal',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => GJReport.report(req, res),

  },
];

export default Routes;
