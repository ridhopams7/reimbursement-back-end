import * as Hapi from '@hapi/hapi';
import {
  getConnection, Brackets,
} from "typeorm";
import * as moment from 'moment';
import {
  AccountingPeriod,
  Reimbursement,
} from '../../../../model/entities';
import { pdfGenerator, isDateValid } from '../../../../utilities';

class GeneralJournal {
  private static handleValidateAccountingPeriod = (data: any) => new Promise(async (resolve, reject) => {
    try {
      const {
        accountingPeriod,
        accountingDateStart,
        accountingDateEnd,
      } = data;

      const periodRepository = getConnection().getRepository(AccountingPeriod);
      const selectedAccountingPeriod = await periodRepository.findOne({
        where: {
          id: accountingPeriod.id,
        },
      });

      if (!selectedAccountingPeriod) {
        resolve({ isPassed: false, message: 'Selected Accounting Period not exist in our database' });
        return;
      }

      if (!selectedAccountingPeriod.activeFlag) {
        resolve({ isPassed: false, message: 'Selected Accounting Period is not available to be choosen' });
        return;
      }

      if (accountingDateStart && accountingDateEnd) {
        const accDateStart = new Date(accountingDateStart).getTime();
        const accDateEnd = new Date(accountingDateEnd).getTime();
        const isStartBiggerThanEnd = accDateStart > accDateEnd;

        if (isStartBiggerThanEnd) {
          resolve({ isPassed: false, message: 'Value on "Accounting Date From" must be less than value on "Accounting Date To"' });
          return;
        }

        const accPeriodStart = new Date(selectedAccountingPeriod.startDate).getTime();
        const accPeriodEnd = new Date(selectedAccountingPeriod.endDate).getTime();
        const isStartDateValid = accDateStart >= accPeriodStart && accDateStart <= accPeriodEnd;
        const isEndDateValid = accDateEnd >= accPeriodStart && accDateEnd <= accPeriodEnd;

        if (!isStartDateValid) {
          resolve({ isPassed: false, message: 'Start date is not in the selected accounting period range' });
          return;
        }

        if (!isEndDateValid) {
          resolve({ isPassed: false, message: 'End date is not in the selected accounting period range' });
          return;
        }
      }

      resolve({ isPassed: true, message: '' });
    } catch (e) {
      console.log(`error at handle Validate accounting period with error: ${e}`);
      reject({ isPassed: false, message: `error at handling validate accounting period with error: ${e}` });
    }
  })

  private static handleValidateInputForm = async (data: any) => {
    try {
      const {
        accountingPeriod,
        accountingDateStart,
        accountingDateEnd,
        organization,
      } = data;

      if (!organization || (organization && Object.keys(organization).length === 0)) {
        return { isPassed: false, message: 'Organization field cannot be empty' };
      }

      if (accountingDateStart && !isDateValid(accountingDateStart)) {
        return { isPassed: false, message: 'Value of Accounting Date From is not a valid date' };
      }

      if (accountingDateEnd && !isDateValid(accountingDateEnd)) {
        return { isPassed: false, message: 'Value of Accounting Date To is not a valid date' };
      }

      if (accountingPeriod && Object.keys(accountingPeriod).length > 0) {
        const isAccountingPeriodPassed: any = await GeneralJournal.handleValidateAccountingPeriod(data);
        if (!isAccountingPeriodPassed.isPassed) {
          return { isPassed: false, message: isAccountingPeriodPassed.message };
        }
      }

      return { isPassed: true, message: 'ok' };
    } catch (e) {
      console.log(`error at handling validate input form with error: ${e}`);
      return { isPassed: false, message: `error at handling validate input form with error: ${e}` };
    }
  }

  static report = async (req: any, res: Hapi.ResponseToolkit): Promise<object> => {
    try {
      const payload = { ...req.payload };

      // const validation = await GeneralJournal.handleValidateInputForm(payload);

      // if (!validation.isPassed) {
      //   return res.response({ message: validation.message }).code(200);
      // }
      console.log(payload);
      const {
        accountingPeriodCode,
        accountingPeriodName,
        accountingDateStart,
        accountingDateEnd,
      } = payload;

      const resultNew = await getConnection()
        .getRepository(Reimbursement)
        .createQueryBuilder('reimbursement')
        .where(new Brackets(qb => {
          qb.where("reimbursement.activeFlag = :activeFlag", { activeFlag: true });
          qb.andWhere("reimbursement.status = :status", { status: "4" });
          if (accountingPeriodCode) {
            qb.andWhere("reimbursement.accountingPeriodCode = :accountingPeriodCode", { accountingPeriodCode: accountingPeriodCode });
          }
        }))
        .orderBy('reimbursement.accountingPeriodCode', 'ASC')
        .addOrderBy('reimbursement.createdDate', 'ASC')
        .getMany();


      // const result = await getConnection()
      //   .getRepository(JeLines)
      //   .createQueryBuilder('je_lines')
      //   .addSelect('je_header.accountingDate', 'je_header_accountingDate')
      //   .addSelect('je_header.description', 'je_header_description')
      //   .innerJoin(JeHeader, 'je_header', '"jeHeaderId" = "headerId"')
      //   .where(new Brackets(qb => {
      //     // qb.where(`je_lines.organizationId = '${organization.id}'`);
      //     if (accountingDateStart) {
      //       qb.andWhere(`je_header.accountingDate >= '${moment(accountingDateStart).format('YYYY-MM-DD')}'`);
      //     }
      //     if (accountingDateEnd) {
      //       qb.andWhere(`je_header.accountingDate <= '${moment(accountingDateEnd).format('YYYY-MM-DD')}'`);
      //     }
      //     if (accountingPeriod && Object.keys(accountingPeriod).length > 0) {
      //       if (!accountingDateStart) {
      //         qb.andWhere(`je_header.accountingDate >= '${moment(accountingPeriod.startDate).format('YYYY-MM-DD')}'`);
      //       }

      //       if (!accountingDateEnd) {
      //         qb.andWhere(`je_header.accountingDate <= '${moment(accountingPeriod.endDate).format('YYYY-MM-DD')}'`);
      //       }
      //     }
      //     if (postingState && Object.keys(postingState).length > 0 && postingState.id) {
      //       qb.andWhere(`je_header.postingState = '${postingState.id}'`);
      //     }
      //   }))
      //   .orderBy('je_header.accountingDate', 'ASC')
      //   .addOrderBy('je_header.description', 'ASC')
      //   .addOrderBy('je_lines.lineNo', 'ASC')
      //   .getRawMany();
      console.log(resultNew);

      if (resultNew.length === 0) {
        return res.response({ message: 'No data match with your search criteria' }).code(200);
      }

      // console.log('result: ', result[0]);

      const dataArr: object[] = [];
      let template: any = {
        code: '',
        accountingPeriodCode: '',
        clientName: '',
        projectName: '',
        picName: '',
        description: '',
        actualAmount: '',
        createdBy: '',

      };

      resultNew.forEach((item: any) => {
        template = {};
        template.accountingPeriodCode = item.accountingPeriodCode;
        template.code = item.code;
        template.clientName = item.clientName;
        template.projectName = item.projectName;
        template.picName = item.picName;
        template.actualAmount = parseFloat(item.actualAmount).toLocaleString('en', { maximumFractionDigits: 4 });
        template.description = item.description;
        template.createdBy = item.createdBy;

        dataArr.push(template);
      });

      const headerTemplate = '<div style="display: none"></div>';
      const footerTemplate = `
        <style type="text/css">
          .container {
            width: 100% !important;
            font-size: 10px !important;
            overflow: hidden !important;
            border: 0px;
          }

          .pageNumb {
            text-align: right !important;
            -webkit-print-color-adjust: exact !important;
            margin-right: 20px !important;
            float: right !important;
          }

          .generateDate {
            text-align: left !important;
            -webkit-print-color-adjust: exact !important;
            margin-left: 20px !important;
            float: left !important;
          }
        </style>
        
        <div class="container">
          <div class="generateDate">
            Printed Date: ${moment().format('DD-MMM-YY')} (${moment().format('HH:mm')})
          </div>
          <div class="pageNumb">
            Page
            <span class='pageNumber'></span> 
            of 
            <span class='totalPages'></span>
          </div>
        </div>
        `;
      const marginTop = 30;
      const marginBottom = 50;
      const isLandscape = true;
      const pageFormat = 'A4';

      // const logo = `http://${process.env.HOST}:${process.env.PORT}/amoeba-logo`;

      const accPeriod =
        !accountingPeriodName
          ? 'All'
          : accountingPeriodName;

      const accDateFrom = !accountingDateStart ? '-' : moment(accountingDateStart).format('DD-MMM-YY');
      const accDateTo = !accountingDateEnd ? '-' : moment(accountingDateEnd).format('DD-MMM-YY');

      const data = {
        accountingPeriod: accPeriod,
        accountingDateFrom: accDateFrom,
        accountingDateTo: accDateTo,
        dataArr,
        isLandscape,
        pageFormat,
        headerTemplate,
        footerTemplate,
        marginTop,
        marginBottom,
        // logo,
      };

      // console.log('data: ', data);

      const content = await pdfGenerator('generalJournalReport', data);

      if (content && content.message === 'ok') {
        const src = content.src;

        return res.response({ src })
          .code(200)
          .header('Content-Type', 'application/pdf')
          .header('Content-Disposition', 'attachment; filename= ' + 'GeneralJournalReport.pdf');
      }

      const message = content.message;
      return res.response({ message }).code(200);
    } catch (e) {
      console.log('error at report GeneralJournal with error: ', e);
      return res.response({ message: `error at report GeneralJournal with error: ${e}` }).code(200);
    }
  }
}

export default GeneralJournal;
