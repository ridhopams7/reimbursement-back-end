import { MasterTypes, MasterDatas } from './controllers';


const Routes: any = [
    
  {
    method: 'POST',
    path: '/master-type',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => MasterTypes.save(req, res),
    // options: {
    //     payload: {
    //         output: 'stream',
    //         parse: true,
    //         allow: 'multipart/form-data',
    //         maxBytes: 1000 * 1000 * 10, // 10 MB
    //     },
    // },
  },
  {
    method: 'POST',
    path: '/master-data',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => MasterDatas.save(req, res),
    // options: {
    //     payload: {
    //         output: 'stream',
    //         parse: true,
    //         allow: 'multipart/form-data',
    //         maxBytes: 1000 * 1000 * 10, // 10 MB
    //     },
    // },
  },
  {
    method: 'PUT',
    path: '/master-type/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => MasterTypes.updateDataById(req, res),
        
  },
  {
    method: 'PUT',
    path: '/master-data/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => MasterDatas.updateDataById(req, res),
        
  },
  // {
  //     method: 'DELETE',
  //     path: '/je/{id}',
  //     handler: (req: any, res: any): object => JeHeaders.deleteById(req, res),
  // },
  {
    method: 'POST',
    path: '/master-types',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => MasterTypes.getDataBySearchCriteria(req, res),
        
  },
  {
    method: 'GET',
    path: '/master-types-all',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => MasterTypes.getDataAll(req, res),
        
  },
  {
    method: 'POST',
    path: '/master-datas',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => MasterDatas.getDataBySearchCriteria(req, res),
        
  },
  {
    method: 'GET',
    path: '/master-types/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => MasterTypes.getDetailById(req, res),
  },
  {
    method: 'GET',
    path: '/master-datas/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => MasterDatas.getDetailById(req, res),
  },
  {
    method: 'POST',
    path: '/master-datas/parent',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => MasterDatas.getDataByParent(req, res),
  },
  {
    method: 'POST',
    path: '/master-datas/type',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => MasterDatas.getDataByType(req, res),
  },
    
  // {
  //     method: 'GET',
  //     path: '/je-transaction-code',
  //     handler: (req: any, res: any): object => JeHeaders.getCode(req, res),
  // },
  // {
  //     method: 'GET',
  //     path: '/je-posting-code',
  //     handler: (req: any, res: any): object => JeHeaders.getPostingCode(req, res),
  // },
];

export default Routes;