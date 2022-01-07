const { Router } = require('express');
const RECIEVING  = require('../model/RecievingProcess')
const PREFIXID = require('../model/prefixid')
const router = Router();
var RecieveMode = new RECIEVING
var PrefixID = new PREFIXID
router.post('/recieving_getdata',async function(req,res) {
    const order = await PrefixID.getDocumentNumber(3)
    const reqFormApi = {
        orderId: req.body.orderId 
    };
    var dataForBuyying = await RecieveMode.getStockFromBuyying(reqFormApi.orderId) 
    console.log('reqFormApi',dataForBuyying);
    var productInRaw = await RecieveMode.getPriceDocumentRaw(dataForBuyying[0].id)
    const addressApi = {
        address: dataForBuyying[0].address,
        tel: dataForBuyying[0].tel,
        fax: dataForBuyying[0].fax,
        orner: dataForBuyying[0].orner
    }
    const recievingStockModel = {
        recieveBranch: 1, //สาขาที่รับสินค้า
        recieveId: order, //เลขที่ใบรับ
        customerId: dataForBuyying[0].creditor, //รหัสลูกค้า
        recieveDate: new Date(), //วันที่รับสินค้า
        sentDate: dataForBuyying[0].create_date, // วันที่ใบส่งของ
        sentId: req.body.orderId, //เลขที่ใบส่งของ
        invoiceDate: dataForBuyying[0].create_date, //วันที่ใบกำกับ
        invoiceId: req.body.orderId, //เลขที่ใบกำกับ
        taxType: dataForBuyying[0].taxtype, //คำนวณภาษีแบบ
        taxPercent: null, //อัตรภาษี
        credit: null, //เครดิต(วัน)
        recieveEmp: null, //พนักงานรับ
        dueDate: dataForBuyying[0].duedate, //dueDate
        paymentId: dataForBuyying[0].saletype, //รหัสค่าใช้จ่าย
        creditor: dataForBuyying[0].creditor, //เจ้าหนี้
        address: addressApi, //ที่อยู่
        priceBeforeDiscount: null, //ยอดรวมก่อนลด
        totalDiscount: null, //ส่วนลดรวม
        total: null, //ยอดคงเหลือ
        specialDiscount: null, //ส่วนลดพิเศษ
        productPrice: null, //มูลค่าสินค้า
        tax: dataForBuyying[0].taxtype, //ภาษี
        paidType: null, //ปรเภทการชำระ
        priceWithTax: null, //ยอดรวมภาษี
        productList: productInRaw
    }
    // console.log('is Order',x);
    res.send(recievingStockModel)
   }),
router.post('/recieving_savedata',async function(req,res) {
    const findRefNum = await PrefixID.findRefNum('public.head_recieving','create_date')
    const insertHead = await RecieveMode.InsertHeadrecievingStock(req.body,findRefNum)
    for (var item of req.body.productList) {
        await RecieveMode.InsertRawrecievingStock(item,findRefNum)
    }
    const result = await PrefixID.getRealDocumentnumber('public.head_recieving',findRefNum.maxPlusId,true,true,'')
    res.status(200).send({
        result: result[0]
        
    })

})

router.post('/get_report', async function (req,res) {
    var model = {
        creditor:req.body.customerId ? req.body.creditor : '',
        fromDate:req.body.fromDate ? req.body.fromDate : '',
        toDate:req.body.toDate ? req.body.toDate : '',
    }
    const getReport = await RecieveMode.getRecievingReport(model)

    res.status(200).send({
        result: getReport
    })
}) 
module.exports = router;