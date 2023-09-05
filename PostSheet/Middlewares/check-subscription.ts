import express = require('express');
import { db } from '../../db';

const trialReleaseDate = new Date('2023-08-26T00:00:00Z');


function checkSubscription(): express.RequestHandler {
  return async function(request: express.Request, response: express.Response, next: express.NextFunction): Promise<void> {
    const user_id = request.currentSession.user_id;
    const user = await db.user.getUserById(user_id);
    if (!user.plan_id) {
      const accountCreationDate = new Date(user.creation_date_time);
      
      response.locals.isNewUser = accountCreationDate > trialReleaseDate;
      const trialEndDate = new Date(accountCreationDate);
      trialEndDate.setDate(accountCreationDate.getDate() + 14);
      const currentTime = new Date();

      if (currentTime > trialEndDate) {
        return response.redirect('/app/trial-ended');
      } else {
        const diffTime = currentTime.getTime() - trialEndDate.getTime();
        const diffDays = Math.abs(Math.round(diffTime / (1000 * 60 * 60 * 24)));
        response.locals.remainingTime = diffDays;
        
      }
    }
    next();
  };
}


module.exports.checkSubscription = checkSubscription;