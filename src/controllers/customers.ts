import { pool } from '../db';

const custTable = "customers";
const loginTable = "login";

export const createCustomer = async (req: any, res: any) => {
  const client = await pool.connect();
  try {
    const { c_id, first_name, last_name, phn, billing_address, email, pwd_hash } = req.body;

    if (!c_id || !first_name || !last_name || !phn || !billing_address || !email || !pwd_hash) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const checkLoginQuery = `SELECT * FROM ${loginTable} WHERE username = $1 OR email = $2`;
    const loginValues = [c_id, email];
    const existingUser = await client.query(checkLoginQuery, loginValues);

    if (existingUser.rowCount) {
      return res.status(400).json({ error: "Username or email already exists"});
    }
    else {
      await client.query('BEGIN');

      const insertCustomerQuery = `
        INSERT INTO ${custTable} (c_id, first_name, last_name, phn, billing_address)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING c_id, first_name, last_name, phn, billing_address;
      `;
      const insertCustomerValues = [c_id, first_name, last_name, phn, billing_address];
      const newCustomer = await client.query(insertCustomerQuery, insertCustomerValues);

      const insertloginQuery = `
        INSERT INTO ${loginTable} (username, email, pwd_hash)
        VALUES ($1, $2, $3)
      `;
      const insertLoginValues = [c_id, email, pwd_hash];
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

export const resetCustomerPassword = async (req: any, res: any) => {
  try {
    const { c_id } = req.params;
    const { pwd, confirm_pwd} = req.body;

    const getQuery = `SELECT * FROM ${loginTable} WHERE username = $1`;
    const getValues = [c_id];
    const existingCustomer = await pool.query(getQuery, getValues);
    if(!existingCustomer.rowCount)
      res.status(400).json({ message: 'No such user exists'});
    else if(!pwd || !confirm_pwd || pwd.trim() === '')
      res.status(400).json({ message: 'Password can\'t be kept empty'})
    else if(pwd !== confirm_pwd)
      res.status(400).json({ message: 'Passwords don\'t match'})
    else if(existingCustomer.rows[0].pwd_hash == pwd)
      res.status(400).json({ message: 'Your new password must be different from your current password'})
    else {
      const modifiedDate = new Date();
      const updateQuery = `UPDATE ${loginTable} SET pwd_hash = $1, modified_at = $2 WHERE username = $3`;
      const updateValues = [pwd, modifiedDate, c_id];
      pool.query(updateQuery, updateValues, (err: Error, result: any) => {
        if (err)
          throw err;
        res.status(200).json({ message: 'User credentials updated successfully' });
      });
    }
  } catch (error) {
    console.error(error);
    return res.sendStatus(500).json({ error: 'An error occurred while resetting the password.' });;
  }
}

export const getAllCustomers = async (req: any, res: any) => {
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
    return res.sendStatus(500).json({ error: 'An error occurred while fetching all users.' });;
  }
};

export const getCustomer = async (req: any, res: any) => {
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
    return res.sendStatus(500).json({ error: 'An error occurred while fetching the user.' });;
  }
};

export const updateCustomer = async (req: any, res: any) => {
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
        res.status(400).json({ message: 'User\'s username does not exist' });
      else
        res.status(200).json({ message: 'User updated successfully' });
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500).json({ error: 'An error occurred while updating the user.' });;
  }
};

export const deleteCustomer = async (req:any, res:any) => {
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
