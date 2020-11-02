/**
 * @author Dwi Setiyadi
 */

import { getConnection } from 'typeorm';
import { validate } from 'class-validator';
import * as _ from 'lodash';
// import { UserFndRole, FndRole } from '../../../model/entities';
import { HttpResponse, sha256, generateToken } from '../../../utilities';
import { UserApp } from '../../../model/entities/UserApp';
import { RoleUser } from '../../../model/entities/RoleUser';
import { RoleMenu } from '../../../model/entities/RoleMenu';

class Auths {
  static signIn = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      const queryRole = getConnection().getRepository(UserApp)
        .createQueryBuilder("userApp")
        .addSelect('roleUser.roleId', 'role')
        .leftJoin(RoleUser, "roleUser", '"roleUser"."userId" = userApp.userName')
        .where("userApp.userName = :userName", { userName: req.payload.username })
        .andWhere("userApp.password = :password", { password: sha256(req.headers.information).toString() });
      let person: any = await queryRole.getOne();
      let personRawData: any = await queryRole.getRawMany();
      
      if (person && personRawData) {

        let roles: any[] = [];
        for (let value of personRawData) {
          const {
            role,
          } = value;
          let roleformat = { role: "" };
          roleformat.role = role;
          roles.push(roleformat);

        }
        console.log(roles);
        person.roles = roles;

        const queryMenu = getConnection().getRepository(UserApp)
          .createQueryBuilder("userApp")
          .addSelect('roleMenu.menuId', 'menu')
          .leftJoin(RoleUser, "roleUser", '"roleUser"."userId" = userApp.userName')
          .leftJoin(RoleMenu, "roleMenu", '"roleMenu"."roleId" = "roleUser"."roleId"')
          .where("userApp.userName = :userName", { userName: req.payload.username })
          .andWhere("userApp.password = :password", { password: sha256(req.headers.information).toString() });
        let personMenuuRawData: any = await queryMenu.getRawMany();
        let menus: any[] = [];
        if (personMenuuRawData) {
          for (let value of personMenuuRawData) {
            const {
              menu,
            } = value;
            let menuformat = { menu: "" };
            menuformat.menu = menu;
            menus.push(menuformat);

          }

          person.menus = menus;
        }


        console.log(person);
        if (!person.activeFlag) return HttpResponse(401, 'This account is not activated yet, please contact your admin to activate it.');
        const exp: any = Math.floor(new Date().getTime() / 1000) + 1 * 24 * 60 * 60;
        const token: string = generateToken(person, exp);
        delete person.password;
        return res.response(HttpResponse(200, person)).header('content', token).header('exp', exp);
        // console.log(roles);
      }






      // if (person && personRawData) {
      //   const roles = _.chain(personRawData)
      //     .groupBy('role')
      //     .map((data: object[], role: string) => {
      //       return {
      //         role,
      //         permissions: data.map((row: any) => row.permission),
      //       };
      //     })
      //     .value();

      //   person.roles = roles;
      //   console.log(person);
      //   if (!person.isActive) return HttpResponse(401, 'This account is not activated yet, please contact your admin to activate it.');
      //   const exp: any = Math.floor(new Date().getTime() / 1000) + 1 * 24 * 60 * 60;
      //   const token: string = generateToken(person, exp);
      //   delete person.password;
      //   return res.response(HttpResponse(200, person)).header('content', token).header('exp', exp);
      // }
      return HttpResponse(401, 'Wrong combination username and password.');
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }

  static signUp = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      let user = new UserApp();
      user.email = req.payload.email;
      user.userName = req.payload.username;
      user.fullName = req.payload.fullName;
      user.password = sha256(req.headers.information).toString();

      /*
      nilai field dibawah ini harus false untuk mekanisme aktivasi user
      tapi untuk sementara bisa dibuat true dengan mengirim header "post=true"
      untuk sementara belum ada panel admin untuk aktivasi user
      */
      user.activeFlag = req.headers.post === 'true' ? true : false;

      const validation = await validate(user);
      if (validation.length) {
        let errors: any = Object.values(validation[0].constraints);
        if (req.headers.information.length < 8) {
          errors = [
            ...errors,
            'minimum password is 8 character.',
          ];
        }
        throw errors;
      }

      let userRepository = getConnection().getRepository(UserApp);

      await userRepository.save(user);

      const person = await userRepository.findOne({
        select: ["id", "email", "userName", "fullName", "activeFlag"],
        where: {
          userName: req.payload.username,
        },
      });

      if (person) return HttpResponse(201, person);
      return HttpResponse(204, {});
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }
}

export default Auths;
