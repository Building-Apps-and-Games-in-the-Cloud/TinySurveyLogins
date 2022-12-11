import express from 'express';
import { surveyManager } from '../tinysurvey.mjs';
import { checkSurveys } from '../helpers/checkstorage.mjs';
import { authenticateToken } from '../helpers/authenticateToken.mjs';

const router = express.Router();

router.post('/', checkSurveys, authenticateToken, async (request, response) => {

  let topic = request.body.topic;

  let surveyOptions = await surveyManager.getOptions(topic);

  if (surveyOptions) {
    // There is a survey with this topic
    // Need to check if this user created the survey
    if (surveyOptions.creatorGUID == response.user._id) {
      // Render survey management page
      let results = await surveyManager.getCounts(topic);
      response.render('displayresultsmanage.ejs', results);
    }
    else {
      // Need to check if the survey has already been filled in
      // by this user
      if (response.user.completedSurveys.includes(topic)) {
        let results = await surveyManager.getCounts(topic);
        response.render('displayresults.ejs', results);
      }
      else {
        // Survey not in the cookie
        // enter scores on an existing survey
        let surveyOptions = await surveyManager.getOptions(topic);
        response.render('selectoption.ejs', surveyOptions);
      }
    }
  }
  else {
    // There is no existing survey - need to make a new one
    // Might need to delete the topic from the completed surveys
    // Check if the topic is in the completed ones
    if (response.user.completedSurveys.includes(topic)) {
      // Delete the topic from the completedSurveys array
      let topicIndex = response.user.completedSurveys.indexOf(topic);
      response.user.completedSurveys.splice(topicIndex, 1);
      // Update the stored survey list
      await response.user.save();
    }
    // need to make a new survey
    response.render('enteroptions.ejs',
      { topic: topic, numberOfOptions: 5 });
  }
});

export { router as gottopic };
