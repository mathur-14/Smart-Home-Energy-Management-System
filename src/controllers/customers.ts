import { pool } from '../db';
import { random, authentication} from '../helper/index'
import express from 'express';

const custTable = "customers";
const loginTable = "login";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, pwd } = req.body;

    if (!email || !pwd) {
      return res.status(400);
    }

    const checkLoginQuery = `SELECT * FROM ${loginTable} WHERE email = $1`;
    const loginValues = [email];
    const existingUser = await pool.query(checkLoginQuery, loginValues);

    if (!existingUser.rowCount) {
      return res.status(400).json({ error: "No user with such email exists"});
    }
    
    const expectedHash = authentication(existingUser.rows[0].salt, pwd);

    if (existingUser.rows[0].pwd_hash != expectedHash) {
      return res.status(403);
    }

    const salt = random();
    const sessionToken = authentication(salt, existingUser.rows[0].username.toString());

    const updateQuery = `UPDATE ${loginTable} SET session_token = $1 WHERE email = $2`;
    const updateValues = [sessionToken, email];
    await pool.query(updateQuery, updateValues);

    res.cookie('PDS-AUTH', sessionToken, { domain: 'localhost', path: '/' });

    return res.status(200).json({message: 'User logged in successfully'});
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'An error occurred while logging in.' });
  }
};

export const createCustomer = async (req: express.Request, res: express.Response) => {
  const client = await pool.connect();
  try {
    const { c_id, first_name, last_name, phn, billing_address, email, pwd } = req.body;

    if (!c_id || !first_name || !last_name || !phn || !billing_address || !email || !pwd) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phn)) {
      return res.status(400).json({ error: 'Invalid phone number format.' });
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    const checkLoginQuery = `SELECT * FROM ${loginTable} WHERE username = $1 OR email = $2`;
    const loginValues = [c_id, email];
    const existingUser = await client.query(checkLoginQuery, loginValues);

    if (existingUser.rowCount) {
      return res.status(400).json({ error: "Username or email already exists"});
    }
    else {
      const salt = random();
      const pwd_hash = authentication(salt, pwd)

      await client.query('BEGIN');

      const insertCustomerQuery = `
        INSERT INTO ${custTable} (c_id, first_name, last_name, phn, billing_address)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING c_id, first_name, last_name, phn, billing_address;
      `;
      const insertCustomerValues = [c_id, first_name, last_name, phn, billing_address];
      const newCustomer = await client.query(insertCustomerQuery, insertCustomerValues);

      const insertloginQuery = `
        INSERT INTO ${loginTable} (username, email, pwd_hash, salt)
        VALUES ($1, $2, $3, $4)
      `;
      const insertLoginValues = [c_id, email, pwd_hash, salt];
      await client.query(insertloginQuery, insertLoginValues, (err) => {
        if (err) {
          if (err.message.includes(`relation ${custTable} does not exist`)) {
            return res.status(400).json({ error: 'Table not found' });
          }
          else
            throw err;
        }
      });

      await client.query('COMMIT');

      res.status(200).json({ message: 'User created successfully', user: newCustomer.rows[0] });
    }
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the user.' });
  } finally {
    client.release();
  }
};

export const resetCustomerPassword = async (req: express.Request, res: express.Response) => {
  try {
    const { c_id } = req.params;
    const { pwd, confirm_pwd} = req.body;

    const getQuery = `SELECT * FROM ${loginTable} WHERE username = $1`;
    const getValues = [c_id];
    const existingCustomer = await pool.query(getQuery, getValues);
    if(!existingCustomer.rowCount)
      res.status(400).json({ error: 'No such user exists'});
    else if(!pwd || !confirm_pwd || pwd.trim() === '')
      res.status(400).json({ error: 'Password can\'t be kept empty'})
    else if(pwd !== confirm_pwd)
      res.status(400).json({ error: 'Passwords don\'t match'})
    else if(existingCustomer.rows[0].pwd_hash == pwd)
      res.status(400).json({ error: 'Your new password must be different from your current password'})
    else {
      const modifiedDate = new Date();
      const salt = random();
      const pwd_hash = authentication(salt, pwd)

      const updateQuery = `UPDATE ${loginTable} SET pwd_hash = $1, modified_at = $2, salt = $3 WHERE username = $4`;
      const updateValues = [pwd_hash, modifiedDate, salt, c_id];
      pool.query(updateQuery, updateValues, (err: Error, result: any) => {
        if (err)
          throw err;
        res.status(200).json({ message: 'User credentials updated successfully' });
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while resetting the password.' });;
  }
}

export const getAllCustomers = async (req: express.Request, res: express.Response) => {
  try {
    const getQuery = `SELECT * FROM ${custTable}`;

    pool.query(getQuery, (err: Error, result: any) => {
      if (err) {
        if (err.message.includes(`relation ${custTable} does not exist`)) {
          return res.status(400).json({ error: 'Table not found' });
        }
        throw err;
      }
      res.status(200).json(result.rows);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while fetching all users.' });;
  }
};

export const getCustomer = async (req: express.Request, res: express.Response) => {
  try {
    const { c_id } = req.params;

    const getQuery = `SELECT * FROM ${custTable} WHERE c_id = $1`
    const values = [c_id];

    pool.query(getQuery, values, (err: Error, result: any) => {
      if (err) {
        if (err.message.includes(`relation ${custTable} does not exist`)) {
          return res.status(400).json({ error: 'Table not found' });
        }
        throw err;
      }
      res.status(200).json(result.rows[0]);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while fetching the user.' });;
  }
};

export const updateCustomer = async (req: express.Request, res: express.Response) => {
  try {
    const { c_id } = req.params;
    const { column, newValue } = req.body;

    const updateQuery = `UPDATE ${custTable} SET ${column} = $1 WHERE c_id = $2`;
    const values = [newValue, c_id];

    pool.query(updateQuery, values, (err: Error, result: any) => {
      if (err) {
        if (err.message.includes(`relation "${custTable}" does not exist`)) {
          return res.status(400).json({ error: 'Table not found' });
        }
        throw err;
      }
      if(!result.rowCount)
        res.status(400).json({ error: 'User\'s username does not exist' });
      else
        res.status(200).json({ message: 'User updated successfully' });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while updating the user.' });;
  }
};

export const deleteCustomer = async (req: express.Request, res: express.Response) => {
  try {
    const { c_id } = req.params;

    const deleteQuery = `
      DELETE FROM ${custTable}
      WHERE c_id = $1
      RETURNING c_id;
    `;
    const deletedCustomer = await pool.query(deleteQuery, [c_id]);

    res.status(200).json({
      message: `User with ID ${deletedCustomer.rows[0].c_id} deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the user' });
  }
};
