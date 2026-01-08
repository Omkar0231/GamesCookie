
const mailHtmlGames = require("../mail/html_games.js");
const mailResume = require("../mail/job_application.js");


// create Html Games
exports.createHtmlGames = (req, res) => {

  // array
  const data = {
    name: req.body.name,
    number: req.body.number,
    website_url: req.body.website_url
  };

  mailHtmlGames.sendEmail(data);

    return res.status(200).json({
        message: "Request send successfully!"
    });

};

// create Apply Job
exports.createApplyJob = (req, res) => {

  // array
  const data = {
    name: req.body.name,
    resume: process.env.BASE_URL +'/'+ req.body.resume
  };

  mailResume.sendEmail(data);

    return res.status(200).json({
        message: "Job application send successfully!"
    });



};