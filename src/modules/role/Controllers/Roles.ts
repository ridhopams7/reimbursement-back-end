import { HttpResponse } from "../../../utilities";
import { getConnection, Brackets } from "typeorm";
import { Role } from "../../../model/entities/Role";
import { addDays } from "date-fns";
class Roles {
  static save = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    let isValid = true;
    let errMessage = "";
    try {

      let message = "";
      console.log(req.payload);
      if (req.payload) {
        const validateData = JSON.parse(req.payload.data);
        if (validateData) {
          let unFilledField = [];

          if (!validateData.roleId || !validateData.roleDesc) {
            if (!validateData.code) unFilledField.push('roleId');
            if (!validateData.value) unFilledField.push('roleDesc');
          }

          if (unFilledField.length > 0) {
            unFilledField.forEach((item: string) => {
              message += `${item}, `;
            });
            errMessage = `Required but not filled yet: ${message.slice(0, -2)}`;
            isValid = false;
          }
        }
        else {
          errMessage = `Required but not filled yet: ${message.slice(0, -2)}`;
          isValid = false;
        }
      }
      else {
        errMessage = "required must be fill";
        isValid = false;
      }
      if (isValid) {

        const data = JSON.parse(req.payload.data);
        const {
          roleId,
          roleDesc,
          createdBy,
          lastUpdatedBy,
        } = data;
        console.log();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const role = new Role();

        role.roleId = roleId;
        role.roleDesc = roleDesc;
        role.createdDate = new Date();
        role.lastUpdatedDate = new Date();
        role.createdBy = createdBy;
        role.lastUpdatedBy = lastUpdatedBy;
        role.activeFlag = true;

        await queryRunner.manager.save(role);
        await queryRunner.commitTransaction();
      }

    } catch (e) {
      // console.log('##################################');
      console.log('error at save: ', e);
      isValid = false;
      errMessage = e;
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      let message = 'Data Successfully Created!';
      if (isValid) {
        return HttpResponse(200, message);
      }
      return HttpResponse(400, errMessage);

    }
  }
  static deleteById = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      let headerRepo = getConnection().getRepository(Role);
      await headerRepo.delete({ roleId: req.params.id });
      var response = 'Data has been deleted!';

      return res.response(HttpResponse(200, response));
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }
  static getDetailById = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      let roleRepo = getConnection().getRepository(Role);
      const role = await roleRepo.find({
        roleId: req.params.id,
      });
      if (role.length > 0) {
        return HttpResponse(200, role);
      }
      else {
        return HttpResponse(404, "Data not found");
      }

    } catch (error) {
      console.log('error at getDetailById with error: ', error);
      return HttpResponse(400, error);
    }
  }
  static getDataBySearchCriteria = async (req: any, res: any): Promise<object> => {

    try {
      let pageSize = 5;
      let direction: any = "ASC";
      let page = 0;
      let skip = 0;
      let first: number = Number(skip) + 1;
      let last: number = pageSize;
      let searchText = "";
      let roleId = "";
      let ordered = "";
      let dtcreatedDateFrom: Date = new Date("1900-01-01");
      let dtcreatedDateTo: Date = new Date("2100-01-01");
      if (req.payload) {
        pageSize = Number(req.payload.pageSize) || 5;
        direction = req.payload.direction || "ASC";
        page = req.payload.page || 0;
        skip = Number(page) > 0 ? pageSize * page : 0;
        first = Number(skip) + 1;
        last = Number(page) === 0 ? pageSize : Number(Number(pageSize) + Number(skip));
        searchText = req.payload.searchtext || "";
        roleId = req.payload.roleId || "";
        dtcreatedDateFrom = req.payload.createdDateFrom || "1900-01-01";
        dtcreatedDateTo = req.payload.createdDateTo || "2100-01-01";
        ordered = req.payload.orderBy;
      }

      dtcreatedDateFrom = new Date(dtcreatedDateFrom);
      dtcreatedDateTo = addDays(new Date(dtcreatedDateTo), 1);

      let orderBy: any = { "Role.createdDate": "DESC" };

      switch (ordered) {
        case "code":
          orderBy = { "Role.code": direction };
          break;
        case "value":
          orderBy = { "Role.value": direction };
          break;
        case "sort":
          orderBy = { "Role.sort": direction };
          break;
        case "description":
          orderBy = { "Role.description": direction };
          break;
        case "createdDate":
          orderBy = { "Role.createdDate": direction };
          break;
        default:
          orderBy = {
            "Role.createdDate": direction,
          };
      }

      const posts = await getConnection()
        .getRepository(Role)
        .createQueryBuilder('Role')
        .where(new Brackets(qb => {
          qb.where("Role.activeFlag = :activeFlag", { activeFlag: true });
          if (searchText.trim()) {
            qb.andWhere("LOWER(Role.roleId) like LOWER(:roleId) or LOWER(Role.roleDesc) like LOWER(:roleDesc) ",
              {
                code: "%" + searchText.trim() + "%",
                value: "%" + searchText.trim() + "%",
              });
          }
        }));
      const postsTotals = await posts.getCount();
      const content = await posts.orderBy(orderBy)
        .skip(skip)
        .take(pageSize)
        .getMany();
      const postsTotal = postsTotals;
      if (postsTotal < last) {
        last = postsTotal;
      }

      const pagenumber: any = Number(page);
      const roles = {
        totalElements: postsTotal,
        pageSize,
        page: pagenumber,
        first: first,
        last: last,
        content: content,
      };
      return res.response(HttpResponse(200, roles));
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }
  static updateDataById = async (req: any, res: any): Promise<object> => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    let errorMessage = "";
    let isValid = true;

    try {
      let message = "";
      if (req.payload) {
        const validateData = JSON.parse(req.payload.data);
        if (validateData) {
          let unFilledField = [];

          if (!validateData.roleId || !validateData.roleName) {
            if (!validateData.roleId) unFilledField.push('Role Id');
            if (!validateData.roleId) unFilledField.push('Role Name');
          }

          if (unFilledField.length > 0) {
            unFilledField.forEach((item: string) => {
              message += `${item}, `;
            });
            errorMessage = `Required but not filled yet: ${message.slice(0, -2)}`;
            isValid = false;
          }
        }
        else {
          errorMessage = `Required but not filled yet: ${message.slice(0, -2)}`;
          isValid = false;
        }
      }
      else {
        errorMessage = "required must be fill";
        isValid = false;
      }
      if (isValid) {

        const data = JSON.parse(req.payload.data);
        const {
          roleId,
          roleDesc,
          lastUpdatedBy,
        } = data;
        console.log();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const role = await queryRunner.manager.findOne(Role, {
          where: {
            roleId: req.params.id,
          },
        });

        if (!role) {
          isValid = false;
          errorMessage = 'role type not found';
          return HttpResponse(400, errorMessage);
        }
        role.roleId = roleId;
        role.roleDesc = roleDesc;
        role.lastUpdatedDate = new Date();
        role.lastUpdatedBy = lastUpdatedBy;
        role.activeFlag = true;

        await queryRunner.manager.save(role);
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
export default Roles;
