const {Router} = require('express');
const router =  Router();

const { showHome,getEmployee,showSetPin,updatePIN,pdFormat,volver,showHomePost} = require('../controllers/index.controller');

router.get('/',showHome)
router.post('/',showHomePost)
router.post('/getEmployee',getEmployee)
router.post('/set-pin',showSetPin)
router.post('/pdf',pdFormat)
router.post('/volver',volver)
router.post('/update-pin',updatePIN)


module.exports = router;
