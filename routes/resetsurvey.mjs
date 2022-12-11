import express from 'express';
import { surveyManager } from '../tinysurvey.mjs';
import { checkSurveys } from '../helpers/checkstorage.mjs';
import { authenticateToken } from '../helpers/authenticateToken.mjs';

const router = express.Router();

function messageDisplay(message,response){
  let messageDescription = {
    heading: "Reset",
    message: message,
    menu: [
      {
        description: "Continue",
        route: "/"
      }
    ]
  };
  response.render('menupage.ejs', messageDescription);
}

router.get('/:topic', checkSurveys, authenticateToken, async (request, response) => {

  let topic = request.params.topic;

  let surveyOptions = await surveyManager.getOptions(topic);

  if (surveyOptions) {
    // Found the survey
    // Need to check if this person created the survey
    if (surveyOptions.creatorGUID == response.user._id) {
      // This is the owner of the survey - can reset the values
      await surveyManager.resetsurvey(topic);
      let results = await surveyManager.getCounts(topic);
      response.render('displayresultsmanage.ejs', results);
    }
    else{
      // Not the owner - display a message
      messageDisplay("You are not the creator of this survey",response);
      }
  }
  else {
    // Survey not found
    messageDisplay("The survey was not found",response);
   }
});

export { router as resetsurvey };
