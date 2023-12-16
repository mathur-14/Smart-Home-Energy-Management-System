import express from 'express';
import * as Customer from '../controllers/customers';
import { isAuthenticated, isOwner } from '../middlewares/authentication';

export default (router: express.Router) => {
  router.post('/v1/customer/login', Customer.login);
  router.post('/v1/customer/register', Customer.createCustomer);
<<<<<<< HEAD
  router.get('/v1/customers', isAuthenticated, isOwner, Customer.getAllCustomers);
  router.get('/v1/customer/:c_id', isAuthenticated, Customer.getCustomer);
  router.put('/v1/customer/:c_id', isAuthenticated, Customer.updateCustomer);
  router.delete('/v1/customer/:c_id', isAuthenticated, Customer.deleteCustomer);
  router.put('/v1/customer/:c_id/pwd-reset', isAuthenticated, Customer.resetCustomerPassword);
=======
  router.get('/v1/customers', Customer.getAllCustomers);
  router.get('/v1/customer/:c_id', Customer.getCustomer);
  router.put('/v1/customer/:c_id', Customer.updateCustomer);
  router.delete('/v1/customer/:c_id', Customer.deleteCustomer);
  router.put('/v1/customer/:c_id/pwd-reset', Customer.resetCustomerPassword);
>>>>>>> 36f4193 (PDS without auth)
};
