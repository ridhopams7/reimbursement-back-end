import { RoleMenus } from "./Controllers";

const Routes: any = [
  {
    method: 'PUT',
    path: '/role-menu/{id}',
    handler: (req: any, res: any): object => RoleMenus.save(req, res),
    options: {
      auth: false,
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
      },
    },
  },
  {
    method: 'GET',
    path: '/role-menu/{roleId}/roleId',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => RoleMenus.getDetailByRoleId(req, res),
  },
  {
    method: 'GET',
    path: '/role-menu/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => RoleMenus.getDetailById(req, res),
  },

];

export default Routes;