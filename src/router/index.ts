import express from 'express';
import customers from './customers';
import deviceModels from './device-models';
import serviceLocations from './service-locations';
import enrollDevices from './enroll-devices';

const router = express.Router();

export default (): express.Router => {
  customers(router);
  deviceModels(router);
  serviceLocations(router);
  enrollDevices(router);
  return router;
};