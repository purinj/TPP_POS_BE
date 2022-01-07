const { Router } = require('express');
const ProductStock  = require('../model/ProductStock')
const router = Router();
const productStock = new ProductStock

router.get('/productstock',async function(req,res) {
    var x = await productStock.getAllRawData()
    console.log('is stock',x);
    res.send(x)
   })

router.get('/load_product_group',async function(req,res) {
    var group = await productStock.getAllGroup()
 
    res.status(200).send(
       group
    )
   })


router.post('/manage_stock',async function(req,res) {
    var query
    switch (req.body.method) {
        case 'ADD':
            query = await productStock.insertStock(req.body)
            break;
        case 'EDIT':
            query = await productStock.updateByID(req.body)
            break;
        case 'DELETE':
            query = await productStock.DeleteById(req.body.product_id)
            break;
    }
 
    res.status(200).send('ok')
   })

router.post('/get_dead_stock',async function(req,res) {
    const model = {
        age: req.body.age,
        group: req.body.group,
        sortType: req.body.sortType,
        fromProductId: req.body.fromProductId,
        toProductId: req.body.toProductId,
        balanced: req.body.balanced
    }
    var deadStock = await productStock.getDeadStock(model)
 
    res.status(200).send(
        deadStock
    )
   })
module.exports = router;