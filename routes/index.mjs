import express from 'express';
import { checkSurveys } from '../helpers/checkstorage.mjs';
import { authenticateToken } from '../helpers/authenticateToken.mjs';

const router = express.Router();

// Home page - just render the index
router.get('/',  checkSurveys, authenticateToken, (request, response) => {
  if(response.user.role == "admin"){
    response.render('adminindex.ejs', { name: response.user.name});
  }
  else {
    response.render('index.ejs', { name: response.user.name});
  }
});


export { router as index };