import { Roles } from "./Controllers";

const Routes: any = [

  {
    method: 'POST',
    path: '/role',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Roles.save(req, res),
  },
  {
    method: 'POST',
    path: '/roles',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Roles.getDataBySearchCriteria(req, res),
        
  },
  {
    method: 'GET',
    path: '/role/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Roles.getDetailById(req, res),
  },
  {
    method: 'PUT',
    path: '/role/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Roles.updateDataById(req, res),
        
  },
  {
    method: 'DELETE',
    path: '/role/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Roles.deleteById(req, res),
  },
];

export default Routes;