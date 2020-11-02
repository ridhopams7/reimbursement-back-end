import { HttpResponse } from "../../../utilities";
import { getConnection } from "typeorm";
import { RoleMenu } from "../../../model/entities/RoleMenu";
import { Menu } from "../../../model/entities/Menu";

class RoleMenus {
  static getDetailById = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      let roleMenuRepo = getConnection().getRepository(RoleMenu);
      const roleMenu = await roleMenuRepo.find({
        id: req.params.id,
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
      const query = getConnection().getRepository(RoleMenu)
        .createQueryBuilder("roleMenu")
        .select("roleMenu.menuId, roleMenu.roleId, roleMenu.createdBy, roleMenu.createdDate")
        .addSelect('menu.menuDesc', 'menuDesc')
        .leftJoin(Menu, "menu", '"menu"."menuId" = roleMenu.menuId')
        .where("roleMenu.roleId = :roleId", { roleId: req.params.roleId });
    
      let roleMenu = await query.getRawMany();

      //   console.log(personRawData);
      //   console.log(roleMenu);

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

        let headerRepo = getConnection().getRepository(RoleMenu);

        await headerRepo.delete({ roleId: req.params.id });
        const dataLines: any[] = [];
        if (data.roleMenuDetail) {
          data.roleMenuDetail.forEach((item: any) => {
            if (item.menuId) {
              dataLines.push(item);
            }
          });
        }
        if (dataLines.length > 0) {
          let roleMenuArr: RoleMenu[] = [];
          //const keys = Object.keys(dataLines);
          for (const item of dataLines) {

            const roleMenu = new RoleMenu();
            const {
              roleId,
              menuId,
              createdBy,
              createdDate,
            } = item;


            roleMenu.roleId = roleId;
            roleMenu.menuId = menuId;
            roleMenu.createdBy = createdBy;
            roleMenu.createdDate = createdDate;
            roleMenu.activeFlag = true;
            roleMenuArr.push(roleMenu);
          }
          await queryRunner.manager.save(roleMenuArr);
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