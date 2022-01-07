const { Router } = require('express');
const TaxMode  = require('../model/Tax')
const CreditorMode = require('../model/creditor')
const router = Router();
taxMode = new TaxMode
creditorMode = new CreditorMode

router.get('/taxadree',async function(req,res) {
    var x = await taxMode.getAllRawData()
    console.log('is tax',x);
    res.send(x)
   })
   console.log();

   router.get('/creditoradree',async function(req,res) {
    var c = await creditorMode.getAllRawData()
    console.log('is Creditor',c);
    res.send(c)
   })
   console.log('finite');

   router.get('/creditoradree',async function(req,res) {
    var c = await creditorMode.getAllRawData()
    console.log('is Creditor',c);
    res.send(c)
   })
   console.log('finite');
module.exports = router;