import { Users } from "./Controllers";

const Routes: any = [

  {
    method: 'POST',
    path: '/user',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Users.save(req, res),
  },
  {
    method: 'POST',
    path: '/users',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Users.getDataBySearchCriteria(req, res),
        
  },
  {
    method: 'GET',
    path: '/user/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Users.getDetailById(req, res),
  },
  {
    method: 'GET',
    path: '/user/roleId/{roleId}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Users.getDataManyByRole(req, res),
  },
  {
    method: 'PUT',
    path: '/user/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Users.updateDataById(req, res),
        
  },
  {
    method: 'DELETE',
    path: '/user/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Users.deleteById(req, res),
  },
  {
    method: 'GET',
    path: '/user-all',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Users.getDataAll(req, res),
        
  },
];

export default Routes;