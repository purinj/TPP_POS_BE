const { Router } = require('express');
const OrderMode  = require('../model/Ordersend')
const CreditorMode = require('../model/creditor')
const StockMode = require('../model/ProductStock')
const CustomerMode = require('../model/Customer')
const PREFIXID = require('../model/prefixid')
const router = Router();
var orderMode = new OrderMode
var creditorMode = new CreditorMode
var stockMode = new StockMode
var customerMode = new CustomerMode
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

   router.post('/save/pricing_data',async function(req,res) {
    const Model =  {
      customer: {
        firstName: req.body.customer.firstName,
        lastName: req.body.customer.lastName, // ลูกค้า
        address: req.body.customer.address,
        telephone: req.body.customer.telephone,
      },
      sentDate: req.body.sentDate, // วันที่ส่ง
      dueDate: req.body.dueDate, // กำหนดส่งของ
      standardPriceDays: req.body.standardPriceDays,
      productList: req.body.productList, // สินค้าที่เลือก
      employee: req.body.employee, // พนักงาน
    };
      const checking = await customerMode.checkCustomer(Model.customer.firstName,Model.customer.lastName)
      console.log('checking',Model.standardPriceDays);
      const order = await PrefixID.findRefNum('public.head_picepresentorder','create_date')
      console.log('order',order.order);
      console.log('id',order.id);
      var insertHead
      if (checking.status == true) {
        insertHead = await stockMode.InsertHead(
            order.refPlusNumber,
            1,
            checking.id,
            true,
            `null`,
            `null`,
            `${Model.sentDate}`,
            `${Model.dueDate}`,
            `${Model.standardPriceDays}`,
            `${order.order}`)
        
      } else {
         insertHead = await stockMode.InsertHead(
            order.id,
            order.prefixid,
            `null`,
            false,
            `${Model.customer.firstName} ${Model.customer.lastName}`,
            `${Model.customer.address}`,
            `${Model.sentDate}`,
            `${Model.dueDate}`,
            `${Model.standardPriceDays}`,
            `null`)
      }
      var sucess_raw = await stockMode.getPriceDocumentHead(order.refPlusNumber,order.maxPlusId)
      console.log('checking',Model.productList);
      for (item of Model.productList) {
        var insertRaw = await stockMode.InsertRaw(
            sucess_raw[0].id, 
            item.product_id, 
            item.product_name, 
            item.left_amount, 
            item.price)
            await stockMode.UpdateLeftAmount('-',item.left_amount, item.product_id)
      }
      var rawPricing = await stockMode.getPriceDocumentRaw(sucess_raw[0].id)
      
    const docId = await PrefixID.getRealDocumentnumber('public.head_picepresentorder',order.maxPlusId,true,true,'')
    const resModel = {
      documentId: docId[0].doccumentid, // เลขที่
      customer: {
        firstName: req.body.customer.firstName,
        lastName: req.body.customer.lastName, // ลูกค้า
        address: req.body.customer.address,
      },
      sentDate: sucess_raw[0].sentdate, // วันที่ส่ง
      dueDate:sucess_raw[0].duesentdate, // กำหนดส่งของ
      standardPriceDays: sucess_raw[0].standardPriceDays, // กำหนดยืนราคา
      productList: rawPricing, // สินค้าที่เลือก
      employee:  req.body.employee, // พนักงาน
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