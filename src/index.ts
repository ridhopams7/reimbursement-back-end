/**
 * @author Dwi Setiyadi
 */

import { App } from './bootstrap';
import { createConnection } from 'typeorm';
import { serverUnavailable } from '@hapi/boom';

App();

process.on('unhandledRejection', (error): void => {
  console.log(error);
  process.exit(1);
});

