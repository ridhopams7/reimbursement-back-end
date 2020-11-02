import { getConnection } from "typeorm";
import { AccountingPeriod } from "../../../model/entities/AccountingPeriod";
import { HttpResponse } from "../../../utilities";

class AccountingPeriods {
  static getData = async (): Promise<object> => {

    // get all data
    try {
      let accPeriodRepo = getConnection().getRepository(AccountingPeriod);
      let accountingPeriod = await accPeriodRepo.find({
        where: {
          activeFlag: true,
        },
        order: {
          sequence: 'ASC',
        },
      });

      return {
        accountingPeriod,
      };
    } catch (error) {
      console.log('error at getAccountingPeriodList with error: ', error);
      return { res: 'failed to get accounting period list, error: ' + error };
    }
  }
  static getDataByStateActive = async (): Promise<object> => {

    // get all data
    try {
      let accPeriodRepo = getConnection().getRepository(AccountingPeriod);
      let accountingPeriod = await accPeriodRepo.find({
        where: [
          {
            activeFlag: true,
            state: "OP",
          },
          {
            activeFlag: true,
            state: "FE",
          },
        ],
        order: {
          sequence: 'ASC',
        },
      });
      return {
        accountingPeriod,
      };
    } catch (error) {
      console.log('error at getAccountingPeriodList with error: ', error);
      return { res: 'failed to get accounting period list, error: ' + error };
    }
  }
  static getDataAll = async (req: any, res: any): Promise<object> => {

    // get all data
    try {
      let activeFlag = true;
      if (req.payload) {
        activeFlag = req.payload.activeFlag || true;
      }
      let accPeriodRepo = getConnection().getRepository(AccountingPeriod);
      let res = await accPeriodRepo.find({
        where:
        {
          activeFlag: activeFlag,
        },
        order: {
          sequence: 'ASC',
        },
      });
      const accountingPeriod = {
        accountingPeriods: res,
      };
      return HttpResponse(200, accountingPeriod);
    } catch (error) {
      console.log('error at getAccountingPeriodList with error: ', error);
      return HttpResponse(400, `failed to get Data By Type, error: ${error}`);
    }
  }

  static getDataByState_ = async (req: any, res: any): Promise<object> => {
    try {
      // get list acc period by state
     
      const periodRepository = getConnection().getRepository(AccountingPeriod);
      const period = await periodRepository.find({
        where: {
          activeFlag: true,
        },
        order: {
          sequence: 'ASC',
        },
      });

      const data = req.payload.state;

      const accountingPeriods = period.filter((obj): any => data.includes(obj.state));

      return res.response({ accountingPeriods, message: 'ok' }).code(200);
     
    } catch (e) {
      console.log('error when getFeOpPeriod with error: ', e);
      return HttpResponse(400, `failed to get Data By Type, error: ${e}`);
    }
  }

  static getDateByState = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars

    // get start and end date of accperiod by state
    let periodRepository;
    let minStartDate;
    let maxEndDate;

    try {
      periodRepository = getConnection().getRepository(AccountingPeriod);
      const period = await periodRepository.find({
        activeFlag: true,
      });

      const data = req.payload.state;

      const periodState = period.filter((obj): any => data.includes(obj.state));

      minStartDate = new Date(Math.min.apply(null, periodState.map((x): any => new Date(x.startDate))));
      maxEndDate = new Date(Math.max.apply(null, periodState.map((x): any => new Date(x.endDate))));

      const datePeriod = {
        startDate: minStartDate,
        endDate: maxEndDate,
      };

      return {
        datePeriod,
      };
    } catch (error) {
      console.log('error at getPeriod with error: ', error);
      return { res: 'failed to get period, error: ' + error };
    }
  }
}

export default AccountingPeriods;