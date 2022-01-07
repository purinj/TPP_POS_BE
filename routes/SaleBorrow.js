const {
  Router
} = require('express');
const OrderMode = require('../model/Ordersend')
const CreditorMode = require('../model/creditor')
const StockMode = require('../model/ProductStock')
const SALEBORROWPROCESS = require('../model/SaleBorrowProcess')
const CustomerMode = require('../model/Customer')
const Employee = require('../model/Employee')
const PREFIXID = require('../model/prefixid')
const router = Router();
var stockMode = new StockMode
var SaleBorrowProcessMode = new SALEBORROWPROCESS
var creditorMode = new CreditorMode
// var BookingMode = new BOOKING
var customerMode = new CustomerMode
const EmployeeQuery = new Employee
var PrefixID = new PREFIXID
// บันทึกใบขาย
router.post('/save/saleborrow_data', async function (req, res) {
  var Model = {
    savedPlace: req.body.savedPlace, // บันทึกขายที่ ขาด V-model
    sellingType: req.body.sellingType, // ประเภทการขาย ขาด V-model
    customer: req.body.customerId,
    sellEmployee: req.body.sellEmployee, //  พนักงานขาย (ใช้รหัส) ขาด V-model
    cheerEmployee: req.body.cheerEmployee, // พนักงานเชียร์ (ใช้รหัส) ขาด V-model
    date: req.body.date, // วันที่ขาย ขาด V-model
    taxCalType: req.body.taxCalType, // คำนวณภาษีแบบ ขาด V-model
    payDueDate: req.body.payDueDate, // กำหนดชำระ ขาด V-model
    sellPriceLevel: req.body.sellPriceLevel, // ระดับการขาย ขาด V-model
    productList: req.body.productList
  };
  console.log('check',Model);
  const checking = await customerMode.getAllRawData(Model.customer)
  console.log('checking', checking);
  const order = await PrefixID.findRefNum('public.head_saleorder','create_date')
  console.log('order', order);
  console.log('checking cus', checking);
  var insertHead
  insertHead = await SaleBorrowProcessMode.InsertHead(Model, order, checking)
  var sucess_raw = await SaleBorrowProcessMode.getDocumentHead(order.maxPlusId)

  for (item of Model.productList) {
    console.log('checking', item);
    await SaleBorrowProcessMode.InsertRaw(item, order.maxPlusId)
    await stockMode.UpdateLeftAmount('-',item.amount,item.product_id)
  }

  const productList = await SaleBorrowProcessMode.getRawSale(order.maxPlusId)
  const docId = await PrefixID.getRealDocumentnumber('public.head_saleorder',order.maxPlusId,true,true,'')
  console.log();
  // console.log('list',rawbooking);
  var Model = {
    DocumentId: docId[0].doccumentid,
    savedPlace: sucess_raw[0].savedplace, // บันทึกขายที่ ขาด V-model
    sellingType: sucess_raw[0].sellingType, // ประเภทการขาย ขาด V-model
    customer: sucess_raw[0].customer,
    sellEmployee: {
      customername: sucess_raw[0].customername,
      customerid: sucess_raw[0].customer
    }, //  พนักงานขาย (ใช้รหัส) ขาด V-model
    cheerEmployee: sucess_raw[0].cheeremployee, // พนักงานเชียร์ (ใช้รหัส) ขาด V-model
    date: sucess_raw[0].date, // วันที่ขาย ขาด V-model
    taxCalType: sucess_raw[0].taxcaltype, // คำนวณภาษีแบบ ขาด V-model
    payDueDate: sucess_raw[0].payduedate, // กำหนดชำระ ขาด V-model
    sellPriceLevel: sucess_raw[0].sellpriceLevel, // ระดับการขาย ขาด V-model
    productList: productList
  };
  res.status(200).send(Model)
})

// บันทึกใบจ่าย
router.post('/save/out_port_invoice', async function (req, res){
  var model = {
    documentID: req.body.documentID// บันทึกขายที่  
  }
  const findHead = await SaleBorrowProcessMode.getDocumentHead(parseInt(model.documentID.slice(-4)))
  const findProductList = await SaleBorrowProcessMode.getRawSale(findHead[0].id)

  const responseModel = {
    documentID: req.body.documentID, // เลขเอกสาร
    savedPlace: req.body.savedPlace, // บันทึกขายที่ ขาด V-model
    sellingType:req.body.sellingType, // ประเภทการขาย ขาด V-model
    customer: req.body.customer, // รหัสลูกค้า ขาด V-model
    sellEmployee:req.body.sellEmployee, //  พนักงานขาย (ใช้รหัส) ขาด V-model
    cheerEmployee: req.body.cheerEmployee, // พนักงานเชียร์ (ใช้รหัส) ขาด V-model
    date: req.body.date, // วันที่ขาย ขาด V-model
    taxCalType: req.body.taxCalType, // คำนวณภาษีแบบ ขาด V-model
    payDueDate: req.body.payDueDate, // กำหนดชำระ ขาด V-model
    sellPriceLevel: req.body.sellPriceLevel, // ระดับการขาย ขาด V-model
    productList: findProductList
  }
 res.status(200).send(responseModel)
})

router.post('/query_sell_data',async function (req, res) {
  var model = {
    customerId:req.body.customerId ? req.body.customerId : '',
    productGroup:req.body.productGroup ? req.body.productGroup : '',
    fromDate:req.body.fromDate ? req.body.fromDate : '',
    toDate:req.body.toDate ? req.body.toDate : '',
    fromProductId:req.body.fromProductId ? req.body.fromProductId : '',
    toProductId:req.body.toProductId ? req.body.toProductId : '',
    supplier: req.body.supplier ? req.body.supplier : ''
  }

  const query = await SaleBorrowProcessMode.selectReportHeadSaleOrderData(model)
  res.status(200).send( {
    results: query
  })
})
router.post('/print_sale_order',async function (req, res) {


  const customer = await customerMode.getAllRawData(req.body.customer)
  const employee = await EmployeeQuery.selectById(req.body.sellEmployee)

  const query = await SaleBorrowProcessMode.getRawSale(req.body.ref_num)
  res.status(200).send( {
    model: req.body,
    results: query,
    customer: customer ,
    employee: employee
  })
})


module.exports = router;