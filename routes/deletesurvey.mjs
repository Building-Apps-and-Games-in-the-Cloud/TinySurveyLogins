import express from 'express';
import { surveyManager } from '../tinysurvey.mjs';
import { checkSurveys } from '../helpers/checkstorage.mjs';
import { messageDisplay } from '../helpers/messageDisplay.mjs';
import { authenticateToken } from '../helpers/authenticateToken.mjs';

const router = express.Router();

router.get('/:topic', checkSurveys, authenticateToken, async (request, response) => {

  let topic = request.params.topic;

  let surveyOptions = await surveyManager.getOptions(topic);

  if (surveyOptions) {
    // Found the survey
    // Need to check if this person created the survey
    if (surveyOptions.creatorGUID == response.user._id) {
      // This is the owner of the survey - can delete it
      await surveyManager.deleteSurvey(topic);
      messageDisplay("Delete OK", "The survey has been deleted",response);
    }
    else{
      // Not the owner - display a message
      messageDisplay("Delete failed", "You are not the creator of this survey",response);
      }
  }
  else {
    // Survey not found
    messageDisplay("Delete failed", "The survey was not found",response);
   }
});

export { router as deletesurvey };
