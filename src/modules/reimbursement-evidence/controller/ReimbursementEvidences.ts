import { getConnection } from "typeorm";
import { ReimbursementEvidence } from "../../../model/entities";
import { HttpResponse, getContentType } from "../../../utilities";
import * as fs from "fs-extra";
import * as Hapi from '@hapi/hapi';
import { NoImage } from "../../../config";
class ReimbursementEvidences {
  static getDetailByHeaderId = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {

      let reimbursementEvidenceRepo = getConnection().getRepository(ReimbursementEvidence);
      const reimbursementEvidence = await reimbursementEvidenceRepo.find({
        reimbursement: req.params.id,
      });
      if (reimbursementEvidence.length > 0) {
        return HttpResponse(200, reimbursementEvidence);
      }
      else {
        return HttpResponse(404, "Data not found");
      }

    } catch (error) {
      console.log('error at getDetailById with error: ', error);
      return HttpResponse(400, error);
    }
  }
  static getEvidenceImage = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      let eviRepo = getConnection().getRepository(ReimbursementEvidence);
      const evidence: any = await eviRepo.findOne({
        id: req.params.id,
      });
      const modules = 'Reimbursement';
      const imageDir = `${process.cwd()}/uploads/${modules}/${evidence.folderCode}/${evidence.fileName}`;

      let src = '';
      let isFileAvailable = true;

      if (!fs.existsSync(imageDir)) {
        src = `data:;base64,${NoImage}`;
        isFileAvailable = false;
        return HttpResponse(200, { src, isFileAvailable });
      }

      const bitmap = fs.readFileSync(imageDir, 'base64');
      src = `data:;base64,${bitmap}`;
      return HttpResponse(200, { src, isFileAvailable });
      //   return res.response({ src, isFileAvailable }).code(200);
    } catch (e) {
      console.log('error at getEvidenceImage with error: ', e);
      return HttpResponse(400, 'failed to get image, error: ' + e);
      //   return { res: 'failed to get image, error: ' + e };
    }
  }

  static getDownloadEvidence = async (req: any, res: Hapi.ResponseToolkit): Promise<object> => {
    try {
      let eviRepo = getConnection().getRepository(ReimbursementEvidence);
      const evidence: any = await eviRepo.findOne({
        id: req.params.id,
      });
      const modules = 'Reimbursement';
      const contentType = getContentType(`.${evidence.fileName.split('.')[1]}`);
      const imageDir = `${process.cwd()}/uploads/${modules}/${evidence.folderCode}/${evidence.fileName}`;
      const fileName = evidence.fileName;

      let src = '';
      let isFileAvailable = true;
      let message = '';

      if (!fs.existsSync(imageDir)) {
        src = '';
        isFileAvailable = false;
        message = 'Something went wrong. File seems unable to be downloaded. Please ask your admin';
        return res.response({ src, isFileAvailable, message }).code(200);
        // HttpResponse(200, { src, isFileAvailable, message });
        
      }

      const bitmap = fs.readFileSync(imageDir, 'base64');
      src = `data:;base64,${bitmap}`;
      // return HttpResponse(200, { src, isFileAvailable, message }).header('Content-Type', contentType)
      //     .header('Content-Disposition', 'attachment; filename= ' + fileName);;
      return res.response({ src, isFileAvailable, message })
        .code(200)
        .header('Content-Type', contentType)
        .header('Content-Disposition', 'attachment; filename= ' + fileName);
    } catch (e) {
      console.log('error at getStatusTransaction with error: ', e);
      return HttpResponse(400, 'something went wrong went downloading the image, error: ' + e);

    }
  }
}

export default ReimbursementEvidences; 