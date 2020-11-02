import Report from './Report';

const Routes: any = [
  {
    method: 'GET',
    path: '/amoeba-logo',
    handler: (req: any, res: any): object => Report.getAmoebaLogo(req, res),
    config: {
      auth: false,
    },
  },
];

export default Routes;
