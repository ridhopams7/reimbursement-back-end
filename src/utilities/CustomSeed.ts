/**
 * @author: Dwi Setiyadi
 */

/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */

import 'dotenv/config';
import * as fs from 'fs-extra';
import { Client } from 'pg';

const exec = require('child_process').exec;

const InjectSeed = async (): Promise<any> => {
  try {
    fs.readFile(`${__dirname}/../../src/utilities/CustomSeed.sql`, (err, data) => {
      let sql = data.toString();
      sql = sql.replace(/TYPEORM_DATABASE/g, `${process.env.TYPEORM_DATABASE}`);
      sql = sql.replace(/TYPEORM_USERNAME/g, `${process.env.TYPEORM_USERNAME}`);
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      exec(`psql -h ${process.env.TYPEORM_HOST} -U ${process.env.TYPEORM_USERNAME} vanilla -c 'CREATE DATABASE "${process.env.TYPEORM_DATABASE}";'`, (error: any, stdout: any, stderr: any) => {
        if (error) {
          //   console.error(`exec error: ${error}`);
          //   return;
        }
        // console.log(`stdout: ${stdout}`);
        // console.log(`stderr: ${stderr}`);
      
        const config: any = {
          user: process.env.TYPEORM_USERNAME,
          host: process.env.TYPEORM_HOST,
          database: process.env.TYPEORM_DATABASE,
          password: process.env.TYPEORM_PASSWORD,
          port: process.env.TYPEORM_PORT,
        };
        const client = new Client(config);

        client.connect();
        client.query(sql, (err: any, res: any) => {
          // console.log(err, res);
          if (err) {
            console.log('err: ', err);
            console.log('error creating master data, skip it...');
          }
          if (res) {
            console.log('master data created');
          }
          client.end();
        });
      });
    });
  }
  catch (error) {
    console.log(error); // "oh, no!"
  }
};

InjectSeed();
