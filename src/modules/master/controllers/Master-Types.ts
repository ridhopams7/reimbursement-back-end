import { HttpResponse } from "../../../utilities";
import { Brackets, getConnection } from "typeorm";
import { addDays } from "date-fns";
import { Master } from "../../../model/entities/Master";
class MasterTypes {
  static getDetailById = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      let masterRepo = getConnection().getRepository(Master);
      const master = await masterRepo.find({
        id: req.params.id,
      });
      if (master.length > 0) {
        return HttpResponse(200, master);
      }
      else {
        return HttpResponse(404, "Data not found");
      }

    } catch (error) {
      console.log('error at getDetailById with error: ', error);
      return HttpResponse(400, error);
    }
  }
  static getDataAll = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars

    let masterTypeRepository = null;    
    try {
      masterTypeRepository = getConnection().getRepository(Master);
      const res = await masterTypeRepository.find({
        where: {
          activeFlag: true,
              
        },
        order: {
          code: "ASC",
        },
      });
    
      const masterTypes = {
        masterTypes: res,
      };
      return HttpResponse(200, masterTypes);
    } catch (error) {
      console.log('error at getProduct with error: ', error);
      return { res: 'failed to get product, error: ' + error };
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
      let txtSearch = "";
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
        txtSearch = req.payload.txtSearch || "";
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
        case "name":
          orderBy = { "Master.name": direction };
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

      const posts = await getConnection()
        .getRepository(Master)
        .createQueryBuilder('Master')
        .where(new Brackets(qb => {
          qb.where("Master.activeFlag = :activeFlag", { activeFlag: true });
          if (txtSearch.trim()) {
            qb.andWhere("LOWER(Master.code) like LOWER(:code) " +
                                    "or LOWER(Master.name) like LOWER(:name) " +
                                    "or LOWER(Master.description) like LOWER(:description)",
            {
              code: "%" + txtSearch.trim() + "%",
              name: "%" + txtSearch.trim() + "%",
              description: "%" + txtSearch.trim() + "%",
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
      const masterTypes = {
        totalElements: postsTotal,
        pageSize,
        page: pagenumber,
        first: first,
        last: last,
        content: content,
      };
      return HttpResponse(200, masterTypes);
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

          if (!validateData.code || !validateData.name || !validateData.description) {
            if (!validateData.materialCode) unFilledField.push('code');
            if (!validateData.materialName) unFilledField.push('name');
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
          name,
          description,
          lastUpdatedBy,
        } = data;
        console.log();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const master = await queryRunner.manager.findOne(Master, {
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
        master.name = name;
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
  static save = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    let isValid = true;
    let errMessage = "";
    try {

      let message = "";
      if (req.payload) {
        const validateData = JSON.parse(req.payload.data);
        if (validateData) {
          let unFilledField = [];

          if (!validateData.code || !validateData.name || !validateData.description) {
            if (!validateData.code) unFilledField.push('code');
            if (!validateData.name) unFilledField.push('name');
            if (!validateData.description) unFilledField.push('description');
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
          name,
          description,
          createdBy,
          lastUpdatedBy,
        } = data;
        console.log();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        const master = new Master();

        master.code = code;
        master.name = name;
        master.description = description;
        master.createdDate = new Date();
        master.lastUpdatedDate = new Date();
        master.createdBy = createdBy;
        master.lastUpdatedBy = lastUpdatedBy;
        master.activeFlag = true;

        await queryRunner.manager.save(master);
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
}


export default MasterTypes;