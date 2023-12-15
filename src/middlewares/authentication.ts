import express from 'express';
import { merge, get } from 'lodash';
import { pool } from '../db';

const loginTable = "login";

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const sessionToken = req.cookies['PDS-AUTH'];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const checkLoginQuery = `SELECT * FROM ${loginTable} WHERE session_token = $1`;
    const loginValues = [sessionToken];
    const existingUser = await pool.query(checkLoginQuery, loginValues);

    if (!existingUser.rowCount) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser.rows[0].username });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const ownerId = 'js5678';
    const currentUserId = get(req, 'identity') as unknown as string;

    if (!currentUserId) {
      return res.sendStatus(400);
    }
    console.log(ownerId,'n',currentUserId);
    if (currentUserId.toString() !== ownerId) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}