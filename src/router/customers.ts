import express from 'express';
import * as Customer from '../controllers/customers'

export default (router: express.Router) => {
  router.post('/customer', Customer.createCustomer);
  router.get('/customers', Customer.getAllCustomers);
  router.get('/customer/:c_id', Customer.getCustomer);
  router.put('/customer/:c_id', Customer.updateCustomer);
  router.delete('/customer/:c_id', Customer.deleteCustomer);
  router.put('/customer/:c_id/pwd-reset', Customer.resetCustomerPassword);
};
