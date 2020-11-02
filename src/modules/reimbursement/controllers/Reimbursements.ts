import { HttpResponse, getExtention, uploader } from "../../../utilities";
import { Brackets, getConnection } from "typeorm";
import { addDays } from "date-fns";
import * as fs from "fs-extra";
import { Reimbursement, TransactionCodeTemp, ReimbursementDetail, ReimbursementEvidence } from "../../../model/entities";
// import moment = require("moment");
class Reimbursements {
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

      let orderBy: any = { "Reimbursement.createdDate": "DESC" };

      switch (ordered) {
        case "code":
          orderBy = { "Reimbursement.code": direction };
          break;
        case "client":
          orderBy = { "Reimbursement.clientName": direction };
          break;
        case "project":
          orderBy = { "Reimbursement.projectName": direction };
          break;
        case "pic":
          orderBy = { "Reimbursement.picName": direction };
          break;
        case "description":
          orderBy = { "Reimbursement.description": direction };
          break;
        case "createdDate":
          orderBy = { "Reimbursement.createdDate": direction };
          break;
        default:
          orderBy = {
            "Reimbursement.createdDate": direction,
          };
      }
      console.log(req.headers.username);
      const posts = await getConnection()
        .getRepository(Reimbursement)
        .createQueryBuilder('Reimbursement')
        .where(new Brackets(qb => {
          qb.where("Reimbursement.createdBy = :createdBy", { createdBy: req.headers.username });
          qb.andWhere("Reimbursement.activeFlag = :activeFlag", { activeFlag: true });
          if (txtSearch.trim()) {
            qb.andWhere("LOWER(Reimbursement.code) like LOWER(:code) " +
              "or LOWER(Reimbursement.clientName) like LOWER(:clientName) " +
              "or LOWER(Reimbursement.projectName) like LOWER(:projectName) " +
              "or LOWER(Reimbursement.picName) like LOWER(:picName) " +
              "or LOWER(Reimbursement.description) like LOWER(:description)",
            {
              code: "%" + txtSearch.trim() + "%",
              clientName: "%" + txtSearch.trim() + "%",
              projectName: "%" + txtSearch.trim() + "%",
              picName: "%" + txtSearch.trim() + "%",
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
  static getDataApprovalCriteria = async (req: any, res: any): Promise<object> => {

    try {
      let pageSize = 5;
      let direction: any = "ASC";
      let page = 0;
      let skip = 0;
      let first: number = Number(skip) + 1;
      let last: number = pageSize;
      let txtSearch = "";
      let ordered = "";
      let status = "";
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
        status = req.payload.status;
      }

      dtcreatedDateFrom = new Date(dtcreatedDateFrom);
      dtcreatedDateTo = addDays(new Date(dtcreatedDateTo), 1);

      let orderBy: any = { "Reimbursement.createdDate": "DESC" };

      switch (ordered) {
        case "code":
          orderBy = { "Reimbursement.code": direction };
          break;
        case "client":
          orderBy = { "Reimbursement.clientName": direction };
          break;
        case "project":
          orderBy = { "Reimbursement.projectName": direction };
          break;
        case "pic":
          orderBy = { "Reimbursement.picName": direction };
          break;
        case "description":
          orderBy = { "Reimbursement.description": direction };
          break;
        case "createdDate":
          orderBy = { "Reimbursement.createdDate": direction };
          break;
        default:
          orderBy = {
            "Reimbursement.createdDate": direction,
          };
      }
      const posts = await getConnection()
        .getRepository(Reimbursement)
        .createQueryBuilder('Reimbursement')
        .where(new Brackets(qb => {
          qb.where("Reimbursement.activeFlag = :activeFlag", { activeFlag: true });
          qb.andWhere("Reimbursement.status = :status", { status: status });
          if (status === "1") {
            qb.andWhere("Reimbursement.picName = :picName", { picName: req.headers.username });
          }
          if (txtSearch.trim()) {
            qb.andWhere("LOWER(Reimbursement.code) like LOWER(:code) " +
              "or LOWER(Reimbursement.clientName) like LOWER(:clientName) " +
              "or LOWER(Reimbursement.projectName) like LOWER(:projectName) " +
              "or LOWER(Reimbursement.picName) like LOWER(:picName) " +
              "or LOWER(Reimbursement.description) like LOWER(:description)",
            {
              code: "%" + txtSearch.trim() + "%",
              clientName: "%" + txtSearch.trim() + "%",
              projectName: "%" + txtSearch.trim() + "%",
              picName: "%" + txtSearch.trim() + "%",
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
  static save = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();
    let isValid = true;
    let errMessage = "";
    try {


      let message = "";
      // console.log(req.payload);
      // console.log(JSON.parse(req.payload.data.reimbursement));
      // console.log(JSON.parse(req.payload.data.reimbursementDetail));
      if (req.payload) {
        const validateData = JSON.parse(req.payload.data);
        //#region validation

        // console.log(req.payload);
        if (req.payload.evidence) {
          let dataEvidence = req.payload.evidence;
          if (validateData.totalEvidence === 1) {
            dataEvidence = [dataEvidence];
          }
          console.log("##########");
          console.log(validateData.totalEvidence);
          console.log(dataEvidence);
          for (let value of dataEvidence) {
            const mimeType = value.hapi.headers['content-type'];
            if (getExtention(mimeType) === '') {
              isValid = false;
              errMessage = "Invalid Format evidence.";
            }
          }
        }

        if (validateData && validateData.reimbursement) {
          let unFilledField = [];

          if (!validateData.reimbursement.code || !validateData.reimbursement.clientId || !validateData.reimbursement.projectId) {
            if (!validateData.reimbursement.code) unFilledField.push('code');
            if (!validateData.reimbursement.clientId) unFilledField.push('client');
            if (!validateData.reimbursement.projectId) unFilledField.push('project');
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
          accountingPeriodId,
          accountingPeriodCode,
          clientId,
          clientCode,
          clientName,
          projectId,
          projectCode,
          projectName,
          picId,
          picName,
          status,
          actualAmount,
          description,
          createdBy,
        } = data.reimbursement;
        const totalEvidence = data.totalEvidence;
        // console.log(data.reimbursementDetail);

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const reimbursement = new Reimbursement();

        reimbursement.code = code;
        reimbursement.accountingPeriodId = accountingPeriodId;
        reimbursement.accountingPeriodCode = accountingPeriodCode;
        reimbursement.clientId = clientId;
        reimbursement.clientCode = clientCode;
        reimbursement.clientName = clientName;
        reimbursement.projectId = projectId;
        reimbursement.projectCode = projectCode;
        reimbursement.projectName = projectName;
        reimbursement.picId = picId;
        reimbursement.picName = picName;
        reimbursement.actualAmount = actualAmount;
        reimbursement.description = description;
        reimbursement.status = status;
        // reimbursement.isPosted = false;
        reimbursement.createdDate = new Date();
        // master.lastUpdatedDate = new Date();
        reimbursement.createdBy = createdBy;
        // master.lastUpdatedBy = lastUpdatedBy;
        reimbursement.activeFlag = true;

        const saveHeader = await queryRunner.manager.save(reimbursement);
        const dataLines: any[] = [];
        if (data.reimbursementDetail) {
          data.reimbursementDetail.forEach((item: any) => {
            if (item.transactionId) {
              dataLines.push(item);
            }
          });
        }
        if (dataLines.length > 0) {
          console.log(dataLines);
          let reimbursementDetailArr: ReimbursementDetail[] = [];
          //const keys = Object.keys(dataLines);
          for (const item of dataLines) {

            const reimbursDetail = new ReimbursementDetail();
            const {
              lineNo,
              description,
              transactionId,
              transactionCode,
              transactionName,
              amount,
            } = item;


            reimbursDetail.lineNo = lineNo;
            reimbursDetail.description = description;
            reimbursDetail.transactionId = transactionId;
            reimbursDetail.transactionCode = transactionCode;
            reimbursDetail.transactionName = transactionName;
            reimbursDetail.amount = amount || 0;
            reimbursDetail.createdBy = createdBy;
            reimbursDetail.createdDate = new Date();
            reimbursDetail.activeFlag = true;
            reimbursDetail.reimbursement = saveHeader;
            // console.log(reimbursDetail);
            reimbursementDetailArr.push(reimbursDetail);
          }
          // console.log(reimbursementDetailArr);
          await queryRunner.manager.save(reimbursementDetailArr);
        }

        let reimbursementEvidence = req.payload.evidence;
        const evidenceArr: ReimbursementEvidence[] = [];
        if (totalEvidence > 0 && reimbursementEvidence) {
          if (totalEvidence === 1) {
            reimbursementEvidence = [reimbursementEvidence];
          }

          for (let value of reimbursementEvidence) {
            const date = new Date();

            const modules = 'Reimbursement';
            const folderCode = saveHeader.code.replace(/[^a-zA-Z0-9]/g, '');
            console.log(folderCode);
            const upload = await uploader(value, { date, modules, folderCode });
            const reimbursementEvidenceData = new ReimbursementEvidence();
            reimbursementEvidenceData.fileName = upload.filename;
            reimbursementEvidenceData.originalName = upload.originalName;
            reimbursementEvidenceData.folderCode = folderCode;
            reimbursementEvidenceData.activeFlag = true;
            reimbursementEvidenceData.createdBy = createdBy;
            reimbursementEvidenceData.lastUpdatedBy = createdBy;
            reimbursementEvidenceData.createdDate = date;
            reimbursementEvidenceData.lastUpdatedDate = date;
            reimbursementEvidenceData.reimbursement = saveHeader;

            evidenceArr.push(reimbursementEvidenceData);
          };

          await queryRunner.manager.save(evidenceArr);
        }


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
  static updateDataById = async (req: any, res: any): Promise<object> => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    let errorMessage = "";
    let isValid = true;

    try {
      let message = "";
      if (req.payload) {
        const validateData = JSON.parse(req.payload.data);
        //#region validation

        if (req.payload.evidence) {

          let dataEvidence = req.payload.evidence;
          if (validateData.totalEvidence === 1) {
            dataEvidence = [dataEvidence];
          }
          for (let value of dataEvidence) {
            const mimeType = value.hapi.headers['content-type'];
            if (getExtention(mimeType) === '') {
              isValid = false;
              errorMessage = "Invalid Format evidence.";
            }
          }
        }

        if (validateData && validateData.reimbursement) {
          let unFilledField = [];

          if (!validateData.reimbursement.code || !validateData.reimbursement.clientId || !validateData.reimbursement.projectId) {
            if (!validateData.reimbursement.code) unFilledField.push('code');
            if (!validateData.reimbursement.clientId) unFilledField.push('client');
            if (!validateData.reimbursement.projectId) unFilledField.push('project');
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
          accountingPeriodId,
          accountingPeriodCode,
          clientId,
          clientCode,
          clientName,
          projectId,
          projectCode,
          projectName,
          status,
          picId,
          picName,
          // isPosted,
          description,
          actualAmount,
          lastUpdatedBy,
        } = data.reimbursement;

        await queryRunner.connect();
        await queryRunner.startTransaction();

        const reimbursement = await queryRunner.manager.findOne(Reimbursement, {
          where: {
            id: req.params.id,
          },
        });

        if (!reimbursement) {
          isValid = false;
          errorMessage = 'reimbursement not found';
          return HttpResponse(400, errorMessage);
        }
        await queryRunner.manager
          .createQueryBuilder()
          .delete()
          .from(ReimbursementDetail)
          .where('"reimbursementId" = :reimbursementId', { reimbursementId: req.params.id })
          .execute();

        reimbursement.accountingPeriodId = accountingPeriodId;
        reimbursement.accountingPeriodCode = accountingPeriodCode;
        reimbursement.clientId = clientId;
        reimbursement.clientCode = clientCode;
        reimbursement.clientName = clientName;
        reimbursement.projectId = projectId;
        reimbursement.projectCode = projectCode;
        reimbursement.projectName = projectName;
        reimbursement.picId = picId;
        reimbursement.picName = picName;
        reimbursement.actualAmount = actualAmount;
        reimbursement.description = description;
        reimbursement.status = status;
        // reimbursement.isPosted = isPosted;
        reimbursement.lastUpdatedDate = new Date();
        reimbursement.lastUpdatedBy = lastUpdatedBy;
        reimbursement.activeFlag = true;



        const saveHeader = await queryRunner.manager.save(reimbursement);
        const dataLines: any[] = [];
        if (data.reimbursementDetail) {
          data.reimbursementDetail.forEach((item: any) => {
            if (item.transactionId) {
              dataLines.push(item);
            }
          });
        }
        if (dataLines.length > 0) {
          let reimbursementDetailArr: ReimbursementDetail[] = [];
          //const keys = Object.keys(dataLines);
          for (const item of dataLines) {

            const reimbursDetail = new ReimbursementDetail();
            const {
              lineNo,
              description,
              transactionId,
              transactionCode,
              transactionName,
              amount,
            } = item;


            reimbursDetail.lineNo = lineNo;
            reimbursDetail.description = description;
            reimbursDetail.transactionId = transactionId;
            reimbursDetail.transactionCode = transactionCode;
            reimbursDetail.transactionName = transactionName;
            reimbursDetail.amount = amount || 0;
            reimbursDetail.createdBy = lastUpdatedBy;
            reimbursDetail.createdDate = new Date();
            reimbursDetail.lastUpdatedBy = lastUpdatedBy;
            reimbursDetail.lastUpdatedDate = new Date();
            reimbursDetail.activeFlag = true;
            reimbursDetail.reimbursement = saveHeader;
            // console.log(reimbursDetail);
            reimbursementDetailArr.push(reimbursDetail);
          }
          // console.log(reimbursementDetailArr);
          await queryRunner.manager.save(reimbursementDetailArr);
        }

        let reimbursementNewEvidence = req.payload.createdEvidence;
        if (reimbursementNewEvidence) {
          const evidenceArr: ReimbursementEvidence[] = [];
          if (req.payload.createdEvidenceLength) {
            if (req.payload.createdEvidenceLength === 1 || req.payload.createdEvidenceLength === '1') {
              reimbursementNewEvidence = [reimbursementNewEvidence];
            }
            for (let value of reimbursementNewEvidence) {
              const date = new Date();

              const modules = 'Reimbursement';
              const folderCode = saveHeader.code.replace(/[^a-zA-Z0-9]/g, '');
              console.log(folderCode);
              const upload = await uploader(value, { date, modules, folderCode });
              const reimbursementEvidenceData = new ReimbursementEvidence();
              reimbursementEvidenceData.fileName = upload.filename;
              reimbursementEvidenceData.originalName = upload.originalName;
              reimbursementEvidenceData.folderCode = folderCode;
              reimbursementEvidenceData.activeFlag = true;
              reimbursementEvidenceData.createdBy = lastUpdatedBy;
              reimbursementEvidenceData.lastUpdatedBy = lastUpdatedBy;
              reimbursementEvidenceData.createdDate = date;
              reimbursementEvidenceData.lastUpdatedDate = date;
              reimbursementEvidenceData.reimbursement = saveHeader;

              evidenceArr.push(reimbursementEvidenceData);
            };

            await queryRunner.manager.save(evidenceArr);
          }
        }

        if (req.payload.deletedEvidence) {
          let reimbursementDeletedEvidence = req.payload.deletedEvidence;
          if (req.payload.deletedEvidenceLength === 1 || req.payload.deletedEvidenceLength === '1') {
            reimbursementDeletedEvidence = [reimbursementDeletedEvidence];
          }

          const listDeletedId: string[] = [];
          reimbursementDeletedEvidence.forEach((item: any) => {
            const item_ = JSON.parse(item);
            listDeletedId.push(item_.id);
            const modules = 'Reimbursement';
            const folderCode = saveHeader.code.replace(/[^a-zA-Z0-9]/g, '');
            const filePath = `${process.cwd()}/uploads/${modules}/${folderCode}/${item_.fileName}`;
            fs.remove(filePath, (err: any) => {
              if (err) return console.log('err: ', err);

              console.log('success delete');
            });
          });

          await queryRunner.manager
            .createQueryBuilder()
            .delete()
            .from(ReimbursementEvidence)
            .where('"id" in (:...id)', { id: listDeletedId })
            .execute();
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
  static updateStatusById = async (req: any, res: any): Promise<object> => {
    const connection = getConnection();
    const queryRunner = connection.createQueryRunner();

    let errorMessage = "";
    let isValid = true;
    let action = "";
    try {
      // let message = "";
      const data = req.payload.data;
      const {

        status,
        approvedBy,
        rejectedBy,
      } = data;

      await queryRunner.connect();
      await queryRunner.startTransaction();

      const reimbursement = await queryRunner.manager.findOne(Reimbursement, {
        where: {
          id: req.params.id,
        },
      });

      if (!reimbursement) {
        isValid = false;
        errorMessage = 'reimbursement not found';
        return HttpResponse(400, errorMessage);
      }

      reimbursement.status = status;
      reimbursement.approvedBy = approvedBy;
      reimbursement.rejectedBy = rejectedBy;
      action = approvedBy ? 'Approved' : 'Rejected';


      await queryRunner.manager.save(reimbursement);

      await queryRunner.commitTransaction();


    } catch (error) {
      console.log('error at Update: ', error);
      isValid = false;
      errorMessage = error;
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
      let message = `Data Successfully ${action}!`;
      if (isValid) {
        return HttpResponse(200, message);
      }
      return HttpResponse(400, errorMessage);
    }
  }
  static deleteById = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      let headerRepo = getConnection().getRepository(Reimbursement);
      let linesRepo = getConnection().getRepository(ReimbursementDetail);
      let eviRepo = getConnection().getRepository(ReimbursementEvidence);

      const allEvidence = await eviRepo.find({
        where: {
          ajheader: req.params.id,
        },
      });
      const modules = 'Reimbursement';
      allEvidence.forEach((item: any) => {
        const filePath = `${process.cwd()}/uploads/${modules}/${item.folderCode}/${item.fileName}`;
        fs.remove(filePath, (err: any) => {
          if (err) return console.log('err: ', err);
          console.log('success delete');
        });
      });

      await eviRepo.delete({ reimbursement: req.params.id });
      await linesRepo.delete({ reimbursement: req.params.id });
      await headerRepo.delete({ id: req.params.id });
      var response = 'Data has been deleted!';

      return res.response(HttpResponse(200, response));
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }
  static summaryByUserStatus = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      let reimbursementRepo = getConnection().getRepository(Reimbursement);
      let needApproval = [];

      const open = await reimbursementRepo.find({
        where: {
          createdBy: req.payload.userName,
          status: 0,
        },
      });
      console.log(req.payload.role, req.payload.userName, req.payload.status);
      if (req.payload.role === "Development") {
        needApproval = await reimbursementRepo.find({
          where: {
            createdBy: req.payload.userName,
            status: req.payload.status,
          },
        });
      }
      else if (req.payload.role === "PIC")
      {
        needApproval = await reimbursementRepo.find({
          where: {
            picName: req.payload.userName,
            status: 1,
          },
        });
      }
      else
      {
        needApproval = await reimbursementRepo.find({
          where: {
            status: req.payload.status,
          },
        });
      }

      const finish = await reimbursementRepo.find({
        where: {
          createdBy: req.payload.userName,
          status: 4,
        },
      });
      const response = {
        open: open.length,
        needApproval: needApproval.length,
        finish: finish.length,
      };

      return res.response(HttpResponse(200, response));
    } catch (error) {
      console.log(error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }
  static getCode = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      // var today = new Date();
      // var dateToday = moment(today).format('ll');
      console.log(req.payload);
      var period = req.payload.periodCode;
      var clientName = `${req.payload.clientName.slice(0, 3).toUpperCase()}`;
      // console.log(period);

      let codeRepository = getConnection().getRepository(TransactionCodeTemp);
      const codeList: any = await codeRepository.find({
        where: { period: period },
      });

      var count = codeList.length;

      let sequenceNum: number;
      if (count == 0) {
        sequenceNum = 1;
      }
      else {
        sequenceNum = parseInt(codeList[count - 1].sequence) + 1;
      }

      var seq: string = sequenceNum.toString();
      var digit = seq.length;

      var sequence: string;
      if (digit == 1) { sequence = `0000${seq}`; }
      else if (digit == 2) { sequence = `000${seq}`; }
      else if (digit == 3) { sequence = `00${seq}`; }
      else if (digit == 4) { sequence = `0${seq}`; }
      else { sequence = seq; }

      const type: any = {
        template: "REIMBUSRSE",
      };
      // await paraRepository.findOne({ where: query });

      var codeTemp = new TransactionCodeTemp();
      codeTemp.sequence = sequence;
      codeTemp.period = period;
      codeTemp.type = type.template;
      codeTemp.createdBy = 'System';
      codeTemp.activeFlag = true;

      await codeRepository.save(codeTemp);

      const code = {
        reimbursementCode: `${sequence}/${period}/${clientName}`,
      };
      return res.response(HttpResponse(200, code));
    } catch (error) {
      console.log('error at getCode with error: ', error);
      if (error.message) return HttpResponse(400, error.message);
      return HttpResponse(500, error);
    }
  }
  static getDetailById = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      let masterRepo = getConnection().getRepository(Reimbursement);
      const reimbursement = await masterRepo.find({
        id: req.params.id,
      });
      if (reimbursement.length > 0) {
        return HttpResponse(200, reimbursement);
      }
      else {
        return HttpResponse(404, "Data not found");
      }

    } catch (error) {
      console.log('error at getDetailById with error: ', error);
      return HttpResponse(400, error);
    }
  }

}

export default Reimbursements;