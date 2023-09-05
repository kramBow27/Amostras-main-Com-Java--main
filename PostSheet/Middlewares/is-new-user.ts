import express = require('express');
import { db } from '../../db';
const trialReleaseDate = new Date('2023-08-26T00:00:00Z');

function calculateIsNewUser(): express.RequestHandler {
    return async function(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> {
      const user_id = request.currentSession.user_id;
      const user = await db.user.getUserById(user_id);
      const accountCreationDate = new Date(user.creation_date_time);
      response.locals.isNewUser = accountCreationDate > trialReleaseDate;
      next();
    };
  }
  
  export { calculateIsNewUser };