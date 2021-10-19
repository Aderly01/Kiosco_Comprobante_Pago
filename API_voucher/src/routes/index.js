const {Router} = require('express');
const router =  Router();

const { getEmployee,updatePinEmploye,getInDePayslip,getTotalDed,insertRecPaPrint } = require('../controllers/index.controller'); 

router.get('/employee/:codigo',getEmployee)
router.get('/update-employee/:codigo/:newPin',updatePinEmploye)
router.get('/get-inde/:codigo/:fecha',getInDePayslip)
router.get('/get-totalDed/:codigo/:fecha',getTotalDed)
router.get('/insert-print/:codigo/:nombre',insertRecPaPrint)

module.exports = router;