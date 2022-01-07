const { Router } = require('express');
const RawBookingMode = require('../model/RawBooking')
const OrderMode  = require('../model/Ordersend')
const router = Router();
var orderMode = new OrderMode
var customerMode = new RawBookingMode
router.post('/rawbooking',async function(req,res) {
    var data = {
        firstname : req.body.firstname,
        lastname: req.body.lastname
    }
    var x = await customerMode.SelectTable(data)
    console.log('is Order',x);
    res.send(x)
   })


router.post('/test_post', async (req,res) => {
    console.log('yo',req.body);
    res.status(200).send('ok')
})

module.exports = router;