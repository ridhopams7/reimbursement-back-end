import { HttpResponse } from "../../../utilities";
import { getConnection } from "typeorm";
import { RoleUser } from "../../../model/entities/RoleUser";
import { UserApp } from "../../../model/entities/UserApp";

class RoleMenus {
  static getDetailById = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      let roleUserRepo = getConnection().getRepository(RoleUser);
      const roleMenu = await roleUserRepo.find({
        roleId: req.params.id,
      });
      if (roleMenu.length > 0) {
        return HttpResponse(200, roleMenu);
      }
      else {
        return HttpResponse(404, "Data not found");
      }

    } catch (error) {
      console.log('error at getDetailById with error: ', error);
      return HttpResponse(400, error);
    }
  }
  static getDetailByRoleId = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      const query = getConnection().getRepository(RoleUser)
        .createQueryBuilder("roleUser")
        .select("roleUser.userId, roleUser.roleId, roleUser.createdBy, roleUser.createdDate")
        .addSelect('user.fullName', 'fullName')
        .leftJoin(UserApp, "user", '"user"."userName" = roleUser.userId')
        .where("roleUser.roleId = :roleId", { roleId: req.params.roleId });
    
      let roleUser = await query.getRawMany();

      //   console.log(personRawData);
      //   console.log(roleMenu);

      if (roleUser.length > 0) {
        return HttpResponse(200, roleUser);
      }
      else {
        return HttpResponse(404, "Data not found");
      }

    } catch (error) {
      console.log('error at getDetailById with error: ', error);
      return HttpResponse(400, error);
    }
  }
  static save = async (req: any, res: any): Promise<object> => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    let errorMessage = "";
    let isValid = true;

    try {

      if (req.payload) {
        const data = JSON.parse(req.payload.data);

        console.log(req.payload.data);
        console.log("#########", req.params.id);
        await queryRunner.connect();
        await queryRunner.startTransaction();

        let headerRepo = getConnection().getRepository(RoleUser);

        await headerRepo.delete({ roleId: req.params.id });
        const dataLines: any[] = [];
        if (data.roleUserDetail) {
          data.roleUserDetail.forEach((item: any) => {
            if (item.userId) {
              dataLines.push(item);
            }
          });
        }
        if (dataLines.length > 0) {
          let roleUserArr: RoleUser[] = [];
          //const keys = Object.keys(dataLines);
          for (const item of dataLines) {

            const roleUser = new RoleUser();
            const {
              roleId,
              userId,
              createdBy,
              createdDate,
            } = item;


            roleUser.roleId = roleId;
            roleUser.userId = userId;
            roleUser.createdBy = createdBy;
            roleUser.createdDate = createdDate;
            roleUser.activeFlag = true;
            roleUserArr.push(roleUser);
          }
          await queryRunner.manager.save(roleUserArr);
        }
        await queryRunner.commitTransaction();
      }

    } catch (error) {
      console.log('error at Update: ', error);
      isValid = false;
      errorMessage = error;
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      let message = 'Data Successfully Updated!';
      if (isValid) {
        return HttpResponse(200, message);
      }
      return HttpResponse(400, errorMessage);
    }
  }
}

export default RoleMenus;