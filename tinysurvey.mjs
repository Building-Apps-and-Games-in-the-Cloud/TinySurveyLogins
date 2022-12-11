import { SurveyManager } from './helpers/surveymanagerdb.mjs';
import { UserManager } from './helpers/usermanager.mjs';

import express from 'express';
import cookieParser from 'cookie-parser';

import {index} from './routes/index.mjs';
import {gottopic} from './routes/gottopic.mjs';
import {setoptions} from './routes/setoptions.mjs';
import {recordselection} from './routes/recordselection.mjs';
import {displayresults} from './routes/displayresults.mjs';
import {deletesurvey} from './routes/deletesurvey.mjs';
import {displayresultsmanage} from './routes/displayresultsmanage.mjs';
import {resetsurvey} from './routes/resetsurvey.mjs';
import {login} from './routes/login.mjs';
import {register} from './routes/register.mjs';

// Create the express application
const app = express();

// Select the middleware to decode incoming posts
app.use(express.urlencoded({ extended: false }));

// Add the cookie parser middleware
app.use(cookieParser());

// Select ejs middleware
app.set('view-engine', 'ejs');

// Connect the route handlers to the routes
app.use('/index.html', index);
app.use('/', login);
app.use('/gottopic', gottopic);
app.use('/setoptions', setoptions);
app.use('/recordselection', recordselection);
app.use('/displayresults', displayresults);
app.use('/deletesurvey', deletesurvey);
app.use('/displayresultsmanage', displayresultsmanage);
app.use('/resetsurvey', resetsurvey);
app.use('/login', login);
app.use('/register', register);

// Create a survey manager
let surveyManager = new SurveyManager();
let userManager = new UserManager();

surveyManager.init().then(() => { 
  surveysLoaded = true; 
  userManager.init();
});

let surveysLoaded = false;

export {surveysLoaded };

// Export the survey manager for others to use
export {surveyManager as surveyManager};
export {userManager as userManager}; 

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("Server running");
})