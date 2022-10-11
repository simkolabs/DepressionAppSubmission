const router = require('express').Router()
const {addSessionAnswer, getSessionsUser,getSessionResults} = require('../controllers/session_answers_controller')
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './depression-detection/data')
    },
    filename: function (req, file, cb) {
        cb(null, "data.webm");
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'video/webm') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits: {fileSize: 1024 * 1024 * 500},
    fileFilter: fileFilter
});

router.post('/addSessionAnswer',upload.array('videos'),addSessionAnswer)
router.post('/getSessionsOfUser',getSessionsUser)
router.post('/getSessionResultsOfUser',getSessionResults)
module.exports= router