/**
 * @author: dwi.setiyadi@gmail.com
*/

import 'dotenv/config';
import { getConnection } from 'typeorm';
import { UserApp } from '../model/entities/UserApp';
import { RoleUser } from '../model/entities/RoleUser';
import { RoleMenu } from '../model/entities/RoleMenu';
// import { Role } from '../model/entities/Role';

const validate = async (decoded: any, request: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
  try {
    let query = getConnection().getRepository(UserApp)
      .createQueryBuilder("user")
      .select('user.activeFlag', "isActive")
      .addSelect('roleMenu.menuId', 'permission')
      // .addSelect('fnd_role.name', 'role')
      .leftJoin(RoleUser, "roleUser", '"roleUser"."userId" = userApp.userName')
      .leftJoin(RoleMenu, "roleMenu", '"roleMenu"."roleId" = "roleUser"."roleId"')
      .where("user.userName = :userName", { userName: decoded.agent.userName })
      .andWhere("user.password = :password", { password: decoded.agent.password })
      .andWhere("roleMenu.menuId = :fndRoleName", { fndRoleName: request.headers.role });
      // .andWhere("roleMenu. = :userFndRolePermission", { userFndRolePermission: request.headers.permission });

    const person = await query.getOne();
    const countPerson = await query.getCount();

    // const raw = await query.getRawMany();
    // console.log(raw);

    if (person && countPerson > 0) return { isValid: person.activeFlag };

    return { isValid: false };
  }
  catch (error) {
    console.log(error);
    return { isValid: false };
  }
};

const verifyOptions = {
  algorithms: [
    'HS256',
  ],
};

const options = {
  key: process.env.JWTSECRET,
  validate,
  verifyOptions,
};

export const STRATEGYNAME = 'jwt';
export const STRATEGYSCHEME = 'jwt';
export const STRATEGYOPTIONS = options;
