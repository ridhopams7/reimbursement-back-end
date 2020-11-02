import { Menus } from "./Controllers";

const Routes: any = [

  {
    method: 'POST',
    path: '/menu',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Menus.save(req, res),
  },
  {
    method: 'POST',
    path: '/menus',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Menus.getDataBySearchCriteria(req, res),
        
  },
  {
    method: 'GET',
    path: '/menu/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Menus.getDetailById(req, res),
  },
  {
    method: 'PUT',
    path: '/menu/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Menus.updateDataById(req, res),
        
  },
  {
    method: 'DELETE',
    path: '/menu/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Menus.deleteById(req, res),
  },
  {
    method: 'GET',
    path: '/menus-all',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Menus.getDataAll(req, res),
        
  },
  {
    method: 'POST',
    path: '/menus-paging',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => Menus.getDataWithPaging(req, res),
        
  },
];

export default Routes;