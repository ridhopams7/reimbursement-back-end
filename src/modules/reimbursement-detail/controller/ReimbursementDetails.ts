import { HttpResponse } from "../../../utilities";
import { getConnection } from "typeorm";
import { ReimbursementDetail } from "../../../model/entities";

class ReimbursementDetails {
  static getDetailByHeaderId = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
    
      let reimbursementDetailRepo = getConnection().getRepository(ReimbursementDetail);
      const reimbursementDetail = await reimbursementDetailRepo.find({
        reimbursement: req.params.id,
      });
      if (reimbursementDetail.length > 0) {
        return HttpResponse(200, reimbursementDetail);
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


export default ReimbursementDetails;