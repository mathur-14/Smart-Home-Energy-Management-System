import express from 'express';
import * as EnrollDevices from '../controllers/enroll-devices'

const baseurl = '/v1/customer/:c_id/service-location/:loc_id'
export default (router: express.Router) => {
  router.post(`${baseurl}/device`, EnrollDevices.enrollDevice);
  router.get(`${baseurl}/devices`, EnrollDevices.getLocationDevices);
  router.put(`${baseurl}/device/:d_id`, EnrollDevices.updateDevice);
};
