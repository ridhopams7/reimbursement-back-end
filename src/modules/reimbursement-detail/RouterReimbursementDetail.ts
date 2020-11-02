import { ReimbursementDetails } from "./controller";

const Routes: any = [
  {
    method: 'GET',
    path: '/reimbursement-details/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => ReimbursementDetails.getDetailByHeaderId(req, res),
  },

];

export default Routes;