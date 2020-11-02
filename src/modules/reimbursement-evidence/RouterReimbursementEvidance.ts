import { ReimbursementEvidences } from "./controller";

const Routes: any = [
  {
    method: 'GET',
    path: '/reimbursement-evidences/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => ReimbursementEvidences.getDetailByHeaderId(req, res),
  },
  {
    method: 'GET',
    path: '/reimbursement-evidences/image/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => ReimbursementEvidences.getEvidenceImage(req, res),
  },
  {
    method: 'GET',
    path: '/reimbursement-evidences/image/{id}/download',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => ReimbursementEvidences.getDownloadEvidence(req, res),
  },

];

export default Routes;