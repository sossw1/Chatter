import jwt, { Secret } from 'jsonwebtoken';
import { UserCollection } from '../models/User';

import { Request, Response, NextFunction } from 'express';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).send({ error: 'Not authenticated' });
    } else {
      const secret: Secret = process.env.JWT_SECRET || 'd^e#f@a*u$l%t';
      const decoded = await jwt.verify(token, secret);
      if (typeof decoded !== 'string') {
        const user = await UserCollection.findOne({
          _id: decoded._id,
          'tokens.token': token
        });

        if (!user) {
          throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
      } else {
        return res.status(401).send({ error: 'Not authenticated' });
      }
    }
  } catch (error) {
    return res.status(401).send({ error: 'Not authenticated' });
  }
};

export default auth;
