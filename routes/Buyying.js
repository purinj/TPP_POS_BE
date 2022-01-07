const { Router } = require('express');
const OrderMode  = require('../model/Ordersend')
const BUYiNGPROCESS = require('../model/BuyingProcess')
const CREDITOR = require('../model/CreditorProcess')
const PREFIXID = require('../model/prefixid')
const router = Router();
var orderMode = new OrderMode
var creditorMode = new CREDITOR
var BuyyingMode = new BUYiNGPROCESS
var PrefixID = new PREFIXID

router.get('/orderadree',async function(req,res) {
    var x = await orderMode.getAllRawData()
    console.log('is Order',x);
    res.send(x)
   })

   router.get('/creditoradree',async function(req,res) {
    var c = await creditorMode.getAllRawData()
    console.log('is Creditor',c);
    res.send(c)
   })
   console.log('finite');

   router.get('/stockadree',async function(req,res) {
    var s = await stockMode.getAllRawData()
    console.log('is stock',s);
    res.send(s)
   })

   router.get('/customeradree',async function(req,res) {
    var cs = await customerMode.getAllRawData()
    console.log('is customer',cs);
    res.send(cs)
   })

   router.post('/save/buyying_data',async function(req,res) {
    const Model = {
        branch: req.body.branch,
        ownerCompany: req.body.ownerCompany, // วันที่ส่ง
        buyingType: req.body.buyingType,
        employee: req.body.employee,
        placeCode: req.body.placeCode,
        orderDate: req.body.orderDate,
        dueSentDate: req.body.dueSentDate,
        duePayDate: req.body.paidDays,
        dueDate: req.body.dueDate,
        taxType: req.body.taxType,
        productList: req.body.productList, // สินค้าที่เลือก

      };
      var owner = await creditorMode.checkownerCompany(Model.ownerCompany)
      owner = owner[0]
      console.log('checking',owner[0]);
      const order = await PrefixID.findRefNum('public.head_buyingorder','create_date')
      console.log('order',order);
      console.log('employee',req.body.employee);
      const headModel = {
        ref_num:order.refPlusNumber,
        prefix:3,
        creditor:Model.ownerCompany,
        orner:owner.company,
        address:owner.address1,
        tel:owner.tel,
        fax:owner.fax,
        saletype: Model.buyingType,
        employee:Model.employee,
        placcode:Model.placeCode,
        // Model.orderDate,
        duesentdate:Model.dueSentDate,
        duepaydate:Model.duePayDate,
        duedate:Model.dueDate,
        taxtype:Model.taxType,
        ordernumber: 'null'
      }
      await BuyyingMode.InsertHead(headModel)
      var sucess_raw = await BuyyingMode.getPriceDocumentHead(order.refPlusNumber,3)
      console.log('checking',Model.productList);
      for (item of Model.productList) {
        var insertRaw = await BuyyingMode.InsertRaw(
            sucess_raw[0].id, 
            item.product_id, 
            item.product_name, 
            item.orderedNumber, 
            item.price_lv1,
            )
      }
      var rawbuying = await BuyyingMode.getPriceDocumentRaw(sucess_raw[0].id)
      
      // const customer = await stockMode.customerData(checking.id)
      const findDocId = await PrefixID.getRealDocumentnumber('public.head_buyingorder',order.maxPlusId,true,true,'')
    const resModel = {
        documentId: findDocId, // เลขที่
        ownerCompany: owner, // 
        type: sucess_raw[0].type,
        employee: req.body.employee,
        placeCode: req.body.placeCode,
        orderDate: req.body.orderDate,
        dueSentDate: req.body.dueSentDate,
        duePayDate: req.body.duePayDate,
        dueDate: req.body.dueDate,
        taxType: req.body.taxType,
        productList: rawbuying, // สินค้าที่เลือก
      };
    res.status(200).send(resModel)
   })
   
   

//    router.get('/creditoradree',async function(req,res) {
//     var c = await creditorMode.getAllRawData()
//     console.log('is Creditor',c);
//     res.send(c)
//    })
//    console.log('finite');
module.exports = router;