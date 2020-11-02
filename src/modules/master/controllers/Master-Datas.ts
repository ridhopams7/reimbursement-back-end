import { HttpResponse } from "../../../utilities/ResponseHandling";
import { Brackets, getConnection } from "typeorm";
import { MasterDetail } from "../../../model/entities/MasterDetail";
import { addDays } from "date-fns";
class MasterDatas {
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

          if (!validateData.code || !validateData.value || !validateData.description || !validateData.masterId) {
            if (!validateData.code) unFilledField.push('code');
            if (!validateData.value) unFilledField.push('value');
            if (!validateData.description) unFilledField.push('description');
            if (!validateData.masterId) unFilledField.push('type');
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
          code,
          value,
          masterId,
          masterCode,
          masterName,
          sort,
          description,
          parentId,
          createdBy,
          lastUpdatedBy,
        } = data;
        console.log();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const masterDetail = new MasterDetail();

        masterDetail.code = code;
        masterDetail.value = value;
        masterDetail.masterId = masterId;
        masterDetail.masterCode = masterCode;
        masterDetail.masterName = masterName;
        masterDetail.description = description;
        masterDetail.parentId = parentId;
        masterDetail.sort = sort;
        masterDetail.createdDate = new Date();
        masterDetail.lastUpdatedDate = new Date();
        masterDetail.createdBy = createdBy;
        masterDetail.lastUpdatedBy = lastUpdatedBy;
        masterDetail.activeFlag = true;

        await queryRunner.manager.save(masterDetail);
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
      let masterRepo = getConnection().getRepository(MasterDetail);
      const masterDetail = await masterRepo.find({
        id: req.params.id,
      });
      if (masterDetail.length > 0) {
        return HttpResponse(200, masterDetail);
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
      let masterId = "";
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
        searchText = req.payload.txtSearch || "";
        masterId = req.payload.masterId || "";
        dtcreatedDateFrom = req.payload.createdDateFrom || "1900-01-01";
        dtcreatedDateTo = req.payload.createdDateTo || "2100-01-01";
        ordered = req.payload.orderBy;
      }

      dtcreatedDateFrom = new Date(dtcreatedDateFrom);
      dtcreatedDateTo = addDays(new Date(dtcreatedDateTo), 1);

      let orderBy: any = { "Master.createdDate": "DESC" };

      switch (ordered) {
        case "code":
          orderBy = { "Master.code": direction };
          break;
        case "value":
          orderBy = { "Master.value": direction };
          break;
        case "type":
          orderBy = { "Master.masterName": direction };
          break;
        case "description":
          orderBy = { "Master.description": direction };
          break;
        case "createdDate":
          orderBy = { "Master.createdDate": direction };
          break;
        default:
          orderBy = {
            "Master.createdDate": direction,
          };
      }
      console.log(searchText);
      const posts = await getConnection()
        .getRepository(MasterDetail)
        .createQueryBuilder('Master')
        .where(new Brackets(qb => {
          qb.where("Master.activeFlag = :activeFlag", { activeFlag: true });
          if (masterId.trim()) {
            qb.andWhere("Master.masterId = :masterId ", { masterId: masterId });
          }
          if (searchText.trim()) {
            qb.andWhere("LOWER(Master.code) like LOWER(:code) or LOWER(Master.value) like LOWER(:value) ",
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
      const vouchers = {
        totalElements: postsTotal,
        pageSize,
        page: pagenumber,
        first: first,
        last: last,
        content: content,
      };
      return res.response(HttpResponse(200, vouchers));
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

          if (!validateData.code || !validateData.name || !validateData.description || !validateData.masterId) {
            if (!validateData.code) unFilledField.push('code');
            if (!validateData.value) unFilledField.push('value');
            if (!validateData.masterId) unFilledField.push('type');
            if (!validateData.description) unFilledField.push('description');
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
          code,
          value,
          masterId,
          masterCode,
          masterName,
          sort,
          parentId,
          description,
          lastUpdatedBy,
        } = data;
        console.log();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const master = await queryRunner.manager.findOne(MasterDetail, {
          where: {
            id: data.id,
          },
        });

        if (!master) {
          isValid = false;
          errorMessage = 'master type not found';
          return HttpResponse(400, errorMessage);
        }
        master.code = code;
        master.value = value;
        master.masterId = masterId;
        master.masterCode = masterCode;
        master.masterName = masterName;
        master.sort = sort;
        master.parentId = parentId;
        master.description = description;
        master.lastUpdatedDate = new Date();
        master.lastUpdatedBy = lastUpdatedBy;
        master.activeFlag = true;

        await queryRunner.manager.save(master);
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
  static getDataByParent = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars


    let parentId = "";
    let id = "";
    let activeFlag = true;
    if (req.payload) {
      id = req.payload.id || "";
      parentId = req.payload.parentId || "";
      activeFlag = req.payload.activeFlag || true;
    }
    // let masterDetail = null;
    try {
      const res = await getConnection()
        .getRepository(MasterDetail)
        .createQueryBuilder('MasterDetail')
        .where(new Brackets(qb => {
          qb.where("MasterDetail.activeFlag = :activeFlag", { activeFlag: activeFlag });
          if (parentId.trim()) {
            qb.andWhere("LOWER(MasterDetail.parentId) like LOWER(:parentId) ", { parentId: "%" + parentId.trim() + "%" });
          }
          if (id.trim()) {
            qb.andWhere("MasterDetail.id != :id ", { id: id.trim() });
          }
        })).getMany();
      //   const res = await masterDetailRepository.find({
      //     where: {
      //       activeFlag: true,
      //       parentId: req.params.id,    
      //     },
      //     order: {
      //       code: "ASC",
      //     },
      //   });

      const masterDetail = {
        masterDetails: res,
      };
      return HttpResponse(200, masterDetail);
    } catch (error) {
      console.log('error at getProduct with error: ', error);
      return HttpResponse(400, `failed to get Data By Parent, error: ${error}`);
    }
  }
  static getDataByType = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars

    let masterId = "";
    let parentId = "";
    let activeFlag = true;
    if (req.payload) {
      masterId = req.payload.masterId || "";
      parentId = req.payload.parentId || "";
      activeFlag = req.payload.activeFlag || true;
    }
    // let masterDetail = null;
    try {
      const res = await getConnection()
        .getRepository(MasterDetail)
        .createQueryBuilder('MasterDetail')
        .where(new Brackets(qb => {
          qb.where("MasterDetail.activeFlag = :activeFlag", { activeFlag: activeFlag });
          if (masterId.trim()) {
            qb.andWhere("MasterDetail.masterId = :masterId ", { masterId: masterId.trim() });
          }
          if (parentId.trim()) {
            qb.andWhere("MasterDetail.parentId = :parentId ", { parentId: parentId.trim() });
          }
        })).getMany();
      //   const res = await masterDetailRepository.find({
      //     where: {
      //       activeFlag: true,
      //       parentId: req.params.id,    
      //     },
      //     order: {
      //       code: "ASC",
      //     },
      //   });

      const masterDetail = {
        masterDetails: res,
      };
      return HttpResponse(200, masterDetail);
    } catch (error) {
      console.log('error at getProduct with error: ', error);
      return HttpResponse(400, `failed to get Data By Type, error: ${error}`);
    }
  }
}
export default MasterDatas;