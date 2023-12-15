import express from 'express';
import * as EnrollDevices from '../controllers/enroll-devices'
import { isAuthenticated } from '../middlewares/authentication';

const baseurl = '/v1/customer/:c_id/service-location/:loc_id'
export default (router: express.Router) => {
  router.post(`${baseurl}/device`, isAuthenticated, EnrollDevices.enrollDevice);
  router.get(`${baseurl}/devices`, isAuthenticated, EnrollDevices.getLocationDevices);
  router.put(`${baseurl}/device/:d_id`, isAuthenticated, EnrollDevices.updateDevice);
};
