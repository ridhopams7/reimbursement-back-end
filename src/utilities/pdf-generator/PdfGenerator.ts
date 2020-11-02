import * as fs from "fs-extra";
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';

export const pdfGenerator = async (templateName: string, data: any): Promise<any> => {
  try {
    const compile = async (templateName: any, data: any) => {
      const filePath = path.resolve(`${process.cwd()}/src/utilities/pdf-generator/templates/${templateName}.hbs`);
      const html = await fs.readFileSync(filePath, 'utf8');
      return handlebars.compile(html)(data);
    };

    handlebars.registerHelper('lineNumber', (value: any) => {
      return parseInt(value) + 1;
    });

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: process.env.CHROME_BIN,
      args: ['--no-sandbox', '--headless', '--disable-gpu', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();

    const content = await compile(templateName, data);

    try {
      await page.goto(`data:text/html;charset=UTF-8,${content}`, {
        waitUntil: ['domcontentloaded', 'networkidle0', 'load', 'networkidle2'],
        timeout: 60000,
      });
    } catch (e) {
      console.log('error go to: ', e);
      await browser.close();
      return { message: `Timeout 60 seconds exceeded` };
    }

    await page.emulateMedia('print');

    const pdf = await page.pdf({
      format: data.pageFormat,
      printBackground: true,
      landscape: data.isLandscape,
      displayHeaderFooter: data.displayHeaderFooter || true,
      headerTemplate: data.headerTemplate || '<div style="display: none"></div>',
      footerTemplate: data.footerTemplate || `
      <style type="text/css">
        .footer_page {
          font-size: 10px;
          width: 100%;
          text-align: right;
          -webkit-print-color-adjust: exact;
          margin-right: 20px;
        }
      </style>
      
      <div class="footer_page">
        Page
        <span class='pageNumber'></span> 
        of 
        <span class='totalPages'></span>
      </div>
      `,
      margin: { top: data.marginTop || 30, bottom: data.marginBottom || 60 },
    });

    await browser.close();

    // const bitmap = Buffer.from(pdf).toString('base64');
    // const src = `data:;base64,${bitmap}`;
    const src = pdf;

    return { src, message: 'ok' };
  } catch (e) {
    console.log('error at pdfGenerator with error: ', e);
    return { message: `something went wrong: ${e}` };
  }
};

