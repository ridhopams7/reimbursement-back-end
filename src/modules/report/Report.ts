class Report {
  static getAmoebaLogo = async (req: any, res: any): Promise<object> => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      const file = `${process.cwd()}/public/logo/amoebaLogoSvg.svg`;

      return res.file(file);
    } catch (e) {
      console.log('error when getFeOpPeriod with error: ', e);
      return res.response({ message: `error when getFeOpPeriod with error: ${e}` }).code(200);
    }
  }
}

export default Report;
