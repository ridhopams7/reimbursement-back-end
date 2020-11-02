/**
 * @author Dwi Setiyadi
 */

/* eslint-disable no-console */

import * as Hapi from '@hapi/hapi';
import 'dotenv/config';
import "reflect-metadata";
import { createConnection } from "typeorm";
import {
  Plugins,
  Router,
  STRATEGYNAME, STRATEGYSCHEME, STRATEGYOPTIONS,
  Cors,
} from '../config';

const App = async (): Promise<void> => {
  const server = new Hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: { 
      cors: Cors,
    },
  });

  await server.register(Plugins);
  
  server.auth.strategy(STRATEGYNAME, STRATEGYSCHEME, STRATEGYOPTIONS);
  server.auth.default(STRATEGYNAME);
  server.route(Router);

  await createConnection();

  await server.start();
  console.log(`\nServer Service running at: ${server.info.uri}\n\n`);
};

export default App;
