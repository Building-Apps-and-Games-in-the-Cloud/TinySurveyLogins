import express from 'express';
import { surveyManager } from '../tinysurvey.mjs';
import { checkSurveys } from '../helpers/checkstorage.mjs';
import { authenticateToken } from '../helpers/authenticateToken.mjs';

const router = express.Router();

// Got the selections for a survey
router.post('/:topic', checkSurveys, authenticateToken, async (request, response) => {
    let topic = request.params.topic;
  
    let survey = await surveyManager.surveyExists(topic);
  
    if (!survey) {
      response.status(404).send('<h1>Survey not found</h1>');
    }
    else {
      // Start with an empty completed survey list
      // Look for the current topic in completedSurveys
      if (response.user.completedSurveys.includes(topic) == false) {
        // This survey has not been filled in at this browser
        // Get the text of the selected option
        let optionSelected = request.body.selections;
        // Build an increment description
        let incDetails = { topic: topic, option: optionSelected };
        // Increment the count 
        await surveyManager.incrementCount(incDetails);
        // Add the topic to the completed surveys
        response.user.completedSurveys.push(topic);
        await response.user.save();
      }
      let results = await surveyManager.getCounts(topic);
      // Direct to the manager page if the creator has just selected
      // their option
      if (results.creatorGUID == response.user._id) {
        response.render('displayresultsmanage.ejs', results);
      }
      else {
        response.render('displayresults.ejs', results);
      }
    }
  });
  

  export { router as recordselection };
