import { pool } from '../db';

const energyPriceTable = "ZipCodeEnergyPrices";

export const addPrice = async (req: any, res: any) => {
  try {
    // reason for taking timestamp from the request and not calculating it here is to avoid inconsistencies at the time of system crash. Assuming these requests are called via an event from thr energy dept.
    const { zipcode } = req.params;
    const { timestamp, price } = req.body;

    if (!zipcode || !timestamp || !price) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const insertQuery = `
      INSERT INTO ${energyPriceTable} (zipcode, timestamp, cost_per_kwh)
      VALUES ($1, $2, $3);
    `;
    const values = [zipcode, timestamp, price];
    await pool.query(insertQuery, values);

    res.status(201).json({ message: 'Energy Price added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while adding the energy price' });
  }
};

export const getPricesLastXhours = async (req: any, res: any) => {
  try {
    const { zipcode } = req.params;
    const { xHours } = req.body;

    if (!xHours || isNaN(xHours)) {
      return res.status(400).json({ error: 'Please provide a valid value for xHours.' });
    }

    const currentTime = new Date();
    const startTime = new Date(currentTime.getTime() - xHours * 60 * 60 * 1000);

    const query = `
      SELECT timestamp, cost_per_kwh
      FROM ZipCodeEnergyPrices
      WHERE zipcode = $1
      AND timestamp >= $2 AND timestamp <= $3
      ORDER BY timestamp asc
    `;
    const values = [zipcode, startTime, currentTime];
    const { rows } = await pool.query(query, values);

    // the time returned is in GMT
    res.status(200).json({ prices: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching energy prices.' });
  }
};
