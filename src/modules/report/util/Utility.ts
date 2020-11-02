import { getConnection } from "typeorm";
import {
  AccountingPeriod,
} from '../../../model/entities';

export const validateAccountingPeriod = async (id: string) => {
  try {
    if (!id) return { isPassed: false, message: 'Invalid Accounting Period Id' };

    const periodRepository = getConnection().getRepository(AccountingPeriod);
    const selectedAccountingPeriod = await periodRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!selectedAccountingPeriod) {
      return { isPassed: false, message: 'Selected Accounting Period not exist in our database' };
    }

    if (!selectedAccountingPeriod.activeFlag) {
      return { isPassed: false, message: 'Selected Accounting Period is not available to be choosen' };
    }

    return { isPassed: true, message: 'ok' };
  } catch (e) {
    console.log('err validate acc period: ', e);
    return { isPassed: false, message: `error validate accounting period: ${e}` };
  }
};



