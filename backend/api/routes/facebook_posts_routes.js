const router = require('express').Router()
const {savePostsResults,getFacebookResults} = require('../controllers/facebook_posts_controller')
const {addSessionAnswer, getSessionsUser} = require("../controllers/session_answers_controller");

router.post('/saveFacebookPost',savePostsResults)
router.post('/getFacebookResults',getFacebookResults)
module.exports= router