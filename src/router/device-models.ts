import express from 'express';
import * as Models from '../controllers/device-models'

export default (router: express.Router) => {
  router.post('/dev/device-model', Models.addDeviceModel);
  router.get('/v1/device-models', Models.getAllDeviceModels);
  router.get('/v1/device-models/device-types', Models.getAllDeviceTypes);
  router.get('/v1/device-models/:device_type', Models.getDeviceTypeModels);
  router.put('/dev/device-model/:m_num', Models.updateDeviceModel);
  router.delete('/dev/device-model/:m_num', Models.deleteDeviceModel);
};
