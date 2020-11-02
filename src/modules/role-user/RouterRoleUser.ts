import { RoleUsers } from "./Controllers";

const Routes: any = [
  {
    method: 'PUT',
    path: '/role-user/{id}',
    handler: (req: any, res: any): object => RoleUsers.save(req, res),
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
    path: '/role-user/{roleId}/roleId',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => RoleUsers.getDetailByRoleId(req, res),
  },
  {
    method: 'GET',
    path: '/role-user/{id}',
    config: {
      auth: false,
    },
    handler: (req: any, res: any): object => RoleUsers.getDetailById(req, res),
  },

];

export default Routes;