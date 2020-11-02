import { Reimbursements } from "./controllers";

const Routes: any = [
  {
    method: 'PUT',
    path: '/reimbursement/{id}',
    handler: (req: any, res: any): object => Reimbursements.updateDataById(req, res),
    options: {
      auth: false,
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        maxBytes: 1000 * 1000 * 10, // 10 MB
      },
    },
  },
  {
    method: 'PUT',
    path: '/reimbursement/approval/{id}',
    handler: (req: any, res: any): object => Reimbursements.updateStatusById(req, res),
    config: {
      auth: false,
    },
  },

  {
    method: 'POST',
    path: '/reimbursement',
    handler: (req: any, res: any): object => Reimbursements.save(req, res),
    options: {
      auth: false,
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        maxBytes: 1000 * 1000 * 10, // 10 MB
      },
    },

  },
  {
    method: 'DELETE',
    path: '/reimbursement/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Reimbursements.deleteById(req, res),
  },
  {
    method: 'POST',
    path: '/reimbursements',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Reimbursements.getDataBySearchCriteria(req, res),
  },
  {
    method: 'POST',
    path: '/reimbursements-approval',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Reimbursements.getDataApprovalCriteria(req, res),
  },
  {
    method: 'POST',
    path: '/reimbursements/summary',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Reimbursements.summaryByUserStatus(req, res),
  },
  {
    method: 'GET',
    path: '/reimbursements/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Reimbursements.getDetailById(req, res),
  },
  {
    method: 'POST',
    path: '/reimbursement-code',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Reimbursements.getCode(req, res),
  },
];
export default Routes;