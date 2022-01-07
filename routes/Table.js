const { Router } = require('express');
const Customer  = require('../model/Customer')
const router = Router();
customer = new Customer
router.get('/test', async function(req,res) {
    var x = await customer.getAllRawData()
    console.log("data = ", x);   
    res.send(customer.testInsert("สมชาย", "ทดสอบ", 4))


})

module.exports = router;