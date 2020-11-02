import { HttpResponse, getPager } from "../../../utilities";
import { getConnection, Brackets } from "typeorm";
import { addDays } from "date-fns";
import { Menu } from "../../../model/entities/Menu";
class Menus {
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

          if (!validateData.menuId || !validateData.menuDesc) {
            if (!validateData.menuId) unFilledField.push('menuId');
            if (!validateData.menuDesc) unFilledField.push('menuDesc');
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
          menuId,
          menuDesc,
          createdBy,
          lastUpdatedBy,
        } = data;
        console.log();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const menu = new Menu();

        menu.menuId = menuId;
        menu.menuDesc = menuDesc;
        menu.createdDate = new Date();
        menu.lastUpdatedDate = new Date();
        menu.createdBy = createdBy;
        menu.lastUpdatedBy = lastUpdatedBy;
        menu.activeFlag = true;

        await queryRunner.manager.save(menu);
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
  static getDetailById = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      let menuRepo = getConnection().getRepository(Menu);
      const menu = await menuRepo.find({
        menuId: req.params.id,
      });
      if (menu.length > 0) {
        return HttpResponse(200, menu);
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
      let menuId = "";
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
        menuId = req.payload.menuId || "";
        dtcreatedDateFrom = req.payload.createdDateFrom || "1900-01-01";
        dtcreatedDateTo = req.payload.createdDateTo || "2100-01-01";
        ordered = req.payload.orderBy;
      }

      dtcreatedDateFrom = new Date(dtcreatedDateFrom);
      dtcreatedDateTo = addDays(new Date(dtcreatedDateTo), 1);

      let orderBy: any = { "Menu.createdDate": "DESC" };

      switch (ordered) {
        case "menuId":
          orderBy = { "Menu.menuId": direction };
          break;
        case "menuDesc":
          orderBy = { "Menu.menuDesc": direction };
          break;
        case "createdDate":
          orderBy = { "Menu.createdDate": direction };
          break;
        default:
          orderBy = {
            "Menu.createdDate": direction,
          };
      }

      const posts = await getConnection()
        .getRepository(Menu)
        .createQueryBuilder('Menu')
        .where(new Brackets(qb => {
          qb.where("Menu.activeFlag = :activeFlag", { activeFlag: true });
          if (searchText.trim()) {
            qb.andWhere("LOWER(Menu.menuId) like LOWER(:menuId) or LOWER(menu.menuDesc) like LOWER(:menuDesc) ",
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
      const menus = {
        totalElements: postsTotal,
        pageSize,
        page: pagenumber,
        first: first,
        last: last,
        content: content,
      };
      return res.response(HttpResponse(200, menus));
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

          if (!validateData.menuId || !validateData.menuName) {
            if (!validateData.menuId) unFilledField.push('menu Id');
            if (!validateData.menuId) unFilledField.push('menu Name');
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
          menuId,
          menuDesc,
          lastUpdatedBy,
        } = data;
        console.log(req.payload.data);
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const menu = await queryRunner.manager.findOne(Menu, {
          where: {
            menuId: req.params.id,
          },
        });

        if (!menu) {
          isValid = false;
          errorMessage = 'menu type not found';
          return HttpResponse(400, errorMessage);
        }
        menu.menuId = menuId;
        menu.menuDesc = menuDesc;
        menu.lastUpdatedDate = new Date();
        menu.lastUpdatedBy = lastUpdatedBy;
        menu.activeFlag = true;

        await queryRunner.manager.save(menu);
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
  static deleteById = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      let headerRepo = getConnection().getRepository(Menu);
      await headerRepo.delete({ menuId: req.params.id });
      var response = 'Data has been deleted!';

      return res.response(HttpResponse(200, response));
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }

  static getDataAll = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars

    let menuRepository = null;
    try {
      menuRepository = getConnection().getRepository(Menu);
      const res = await menuRepository.find({
        where: {
          activeFlag: true,
        },
        order: {
          createdDate: "ASC",
        },
      });

      const menus = {
        menus: res,
      };
      return HttpResponse(200, menus);
    } catch (error) {
      console.log('error at getProduct with error: ', error);
      return { res: 'failed to get product, error: ' + error };
    }
  }
  static getDataWithPaging = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    let pageSize = 10;
    let direction: any = "ASC";
    let page = 0;
    let skip = 0;
    let first: number = Number(skip) + 1;
    let last: number = pageSize;
    let ordered= '';
    try {

      if (req.payload) {
        pageSize = Number(req.payload.pageSize) || 5;
        direction = req.payload.direction || "ASC";
        page = req.payload.page || 0;
        skip = Number(page) > 0 ? pageSize * page : 0;
        first = Number(skip) + 1;
        last = Number(page) === 0 ? pageSize : Number(Number(pageSize) + Number(skip));
        ordered = req.payload.orderBy;
      }
      let orderBy: any = { "Menu.createdBy": "DESC" };
      let receiveHeaderRepo: any = getConnection().getRepository(Menu);
      const posts = await receiveHeaderRepo.createQueryBuilder()
        .where(new Brackets(qb => {
          qb.where("Menu.activeFlag = :activeFlag", { activeFlag: true });
        }));
      const postsTotals = await posts.getCount();
      const content = await posts.orderBy(orderBy)
        .skip(skip)
        .take(pageSize)
        .getMany();
      const pagenumber: any = Number(page);
      const paging: any = await getPager(postsTotals, page, pageSize, direction, orderBy);
      const menus = {
        totalElements: postsTotals,
        pageSize,
        page: pagenumber + 1,
        totalPages: paging.totalPages,
        first: first,
        last: last,
        startPage: paging.startPage,
        endPage: paging.endPage,
        pages: paging.pages,
        direction: paging.direction,
        orderBy: ordered,
        content: content,
      };

      return HttpResponse(200, menus);
    } catch (error) {
      console.log('error at getMenuPaging with error: ', error);
      return { res: 'failed to get getMenuPaging, error: ' + error };
    }
  }
}
export default Menus;
