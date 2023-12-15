import express from 'express';
import * as Models from '../controllers/device-models'
import { isAuthenticated, isOwner } from '../middlewares/authentication';

export default (router: express.Router) => {
  router.post('/dev/device-model', isAuthenticated, isOwner, Models.addDeviceModel);
  router.get('/v1/device-models', isAuthenticated, Models.getAllDeviceModels);
  router.get('/v1/device-models/device-types', isAuthenticated, Models.getAllDeviceTypes);
  router.get('/v1/device-models/:device_type', isAuthenticated, Models.getDeviceTypeModels);
  router.put('/dev/device-model/:m_num', isAuthenticated, isOwner, Models.updateDeviceModel);
  router.delete('/dev/device-model/:m_num', isAuthenticated, isOwner, Models.deleteDeviceModel);
};
