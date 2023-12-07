import express from 'express';
import * as Customer from '../controllers/customers'

export default (router: express.Router) => {
  router.post('/v1/customer', Customer.createCustomer);
  router.get('/v1/customers', Customer.getAllCustomers);
  router.get('/v1/customer/:c_id', Customer.getCustomer);
  router.put('/v1/customer/:c_id', Customer.updateCustomer);
  router.delete('/v1/customer/:c_id', Customer.deleteCustomer);
  router.put('/v1/customer/:c_id/pwd-reset', Customer.resetCustomerPassword);
};
