import { HttpResponse, sha256 } from "../../../utilities";
import { getConnection, Brackets } from "typeorm";
import { Role } from "../../../model/entities/Role";
import { addDays } from "date-fns";
import { UserApp } from "../../../model/entities/UserApp";
import { RoleUser } from "../../../model/entities/RoleUser";
class Users {
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

          if (!validateData.userName || !validateData.password || !validateData.email || !validateData.fullName) {
            if (!validateData.userName) unFilledField.push('userName');
            if (!validateData.password) unFilledField.push('password');
            if (!validateData.email) unFilledField.push('email');
            if (!validateData.fullName) unFilledField.push('fullName');
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
          fullName,
          email,
          password,
          userName,
          createdBy,
          lastUpdatedBy,
        } = data;
        console.log();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const user = new UserApp();

        user.fullName = fullName;
        user.email = email;
        user.userName = userName;
        user.password = sha256(password);
        user.createdDate = new Date();
        user.lastUpdatedDate = new Date();
        user.createdBy = createdBy;
        user.lastUpdatedBy = lastUpdatedBy;
        user.activeFlag = true;

        await queryRunner.manager.save(user);
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
      let userRepo = getConnection().getRepository(UserApp);
      const user = await userRepo.find({
        id: req.params.id,
      });
      if (user.length > 0) {
        return HttpResponse(200, user);
      }
      else {
        return HttpResponse(404, "Data not found");
      }

    } catch (error) {
      console.log('error at getDetailById with error: ', error);
      return HttpResponse(400, error);
    }
  }
  static getDataManyByRole = async (req: any, res: any): Promise<object> => {
    try {
      const queryUser = await getConnection()
        .getRepository(UserApp)
        .createQueryBuilder('userApp')
        .select('userApp.id, userApp.userName, userApp.fullName')
        .addSelect('roleUser.roleId', 'role')
        .leftJoin(RoleUser, "roleUser", '"roleUser"."userId" = userApp.userName')
        .where("roleUser.roleId = :roleId", { roleId: req.params.roleId });
      let personRawData: any = await queryUser.getRawMany();
      console.log(personRawData);
      if (personRawData.length > 0) {
        return HttpResponse(200, personRawData);
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
      let userId = "";
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
        userId = req.payload.userId || "";
        dtcreatedDateFrom = req.payload.createdDateFrom || "1900-01-01";
        dtcreatedDateTo = req.payload.createdDateTo || "2100-01-01";
        ordered = req.payload.orderBy;
      }

      dtcreatedDateFrom = new Date(dtcreatedDateFrom);
      dtcreatedDateTo = addDays(new Date(dtcreatedDateTo), 1);

      let orderBy: any = { "User.createdDate": "DESC" };

      switch (ordered) {
        case "userName":
          orderBy = { "User.userName": direction };
          break;
        case "fullName":
          orderBy = { "User.value": direction };
          break;
        case "email":
          orderBy = { "User.email": direction };
          break;
        case "createdDate":
          orderBy = { "User.createdDate": direction };
          break;
        default:
          orderBy = {
            "User.createdDate": direction,
          };
      }

      const posts = await getConnection()
        .getRepository(UserApp)
        .createQueryBuilder('User')
        .where(new Brackets(qb => {
          qb.where("User.activeFlag = :activeFlag", { activeFlag: true });
          if (searchText.trim()) {
            qb.andWhere("LOWER(User.userName) like LOWER(:userName) " +
              "or LOWER(User.fullName) like LOWER(:fullName) " +
              "or LOWER(User.email) like LOWER(:email)",
            {
              userName: "%" + searchText.trim() + "%",
              fullName: "%" + searchText.trim() + "%",
              email: "%" + searchText.trim() + "%",
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
      const users = {
        totalElements: postsTotal,
        pageSize,
        page: pagenumber,
        first: first,
        last: last,
        content: content,
      };
      return res.response(HttpResponse(200, users));
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

          if (!validateData.userName || !validateData.password
            || !validateData.email || !validateData.fullName) {
            if (!validateData.userName) unFilledField.push('userName');
            if (!validateData.password) unFilledField.push('password');
            if (!validateData.email) unFilledField.push('email');
            if (!validateData.fullName) unFilledField.push('fullName');
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
          fullName,
          email,
          //   password,
          userName,
          lastUpdatedBy,
        } = data;
        console.log();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const user = await queryRunner.manager.findOne(UserApp, {
          where: {
            id: req.params.id,
          },
        });

        if (!user) {
          isValid = false;
          errorMessage = 'role type not found';
          return HttpResponse(400, errorMessage);
        }
        user.userName = userName;
        user.email = email;
        user.fullName = fullName;
        user.lastUpdatedDate = new Date();
        user.lastUpdatedBy = lastUpdatedBy;
        user.activeFlag = true;

        await queryRunner.manager.save(user);
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
  static getDataAll = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars

    let userRepository = null;
    try {
      userRepository = getConnection().getRepository(UserApp);
      const res = await userRepository.find({
        where: {
          activeFlag: true,
        },
        order: {
          createdDate: "ASC",
        },
      });

      const users = {
        users: res,
      };
      return HttpResponse(200, users);
    } catch (error) {
      console.log('error at getProduct with error: ', error);
      return { res: 'failed to get product, error: ' + error };
    }
  }

}
export default Users;
