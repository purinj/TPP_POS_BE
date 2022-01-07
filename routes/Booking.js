const { Router } = require('express');
const OrderMode  = require('../model/Ordersend')
const CreditorMode = require('../model/creditor')
const BOOKING = require('../model/BookingProcess')
const CustomerMode = require('../model/Customer')
const PREFIXID = require('../model/prefixid')
const STOCK = require('../model/ProductStock')
const router = Router();
var orderMode = new OrderMode
var creditorMode = new CreditorMode
var BookingMode = new BOOKING
var customerMode = new CustomerMode
var PrefixID = new PREFIXID
var stockQuery = new STOCK
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

   router.post('/save/booking_data',async function(req,res) {
    const Model = {
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
        employee: req.body.employee.employee_id, // พนักงาน
      };
      const checking = await customerMode.checkCustomer(Model.customer.firstName,Model.customer.lastName)
      console.log('checking',checking);
      const order = await PrefixID.findRefNum('public.head_bookingorder','create_date')
      console.log('order',order);
      console.log('order[0].id_sucess',order.id);
      console.log('order[0].prefix',order.prefixid);
      console.log('employee',req.body.employee);
      var insertHead
      if (checking.status == true) {
        insertHead = await BookingMode.InsertHead(
            order.refPlusNumber,
            2,
            checking.id,
            true,
            `null`,
            `null`,
            `${Model.sentDate}`,
            `${Model.dueDate}`,
            `0`,
            `${Model.employee}`,
            `${order.refPlusNumber}`
            )
        
      } else {
         insertHead = await BookingMode.InsertHead(
            order.refPlusNumber,
            2,
            `null`,
            false,
            `${Model.customer.firstName} ${Model.customer.lastName}`,
            `${Model.customer.address}`,
            `${Model.sentDate}`,
            `${Model.dueDate}`,
            `${Model.standardPriceDays}`,
            `${Model.employee}`,
            `${order.refPlusNumber}`)
      }
      var sucess_raw = await BookingMode.getPriceDocumentHead(order.refPlusNumber,order.maxPlusId)
      console.log('checking',Model.productList);
      for (item of Model.productList) {
        var insertRaw = await BookingMode.InsertRaw(
            sucess_raw[0].id, 
            item.product_id, 
            item.product_name, 
            item.left_amount, 
            item.price)

           await stockQuery.UpdateLeftAmount('-',item.left_amount, item.product_id)
      }
      var rawbooking = await BookingMode.getPriceDocumentRaw(sucess_raw[0].id)
      
      const docId = await PrefixID.getRealDocumentnumber('public.head_bookingorder',order.maxPlusId,true,true,'')
    console.log();
    console.log('list',rawbooking);
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
        productList: rawbooking, // สินค้าที่เลือก
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