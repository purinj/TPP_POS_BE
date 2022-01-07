const { Router } = require('express');
const MANNAGESTOCKPROCESS  = require('../model/MangeStockProcess')
const router = Router();
var MannageStockProcessMode = new MANNAGESTOCKPROCESS
router.post('/StockAdding',async function(req,res) {
    var recievingStockModel = {
        recieveBranch: req.body.recieveBranch, //สาขาที่รับสินค้า
        recieveId: req.body.recieveId, //เลขที่ใบรับ
        customerId: req.body.customerId, //รหัสลูกค้า
        recieveDate: req.body.recieveDate, //วันที่รับสินค้า
        sentDate: req.body.sentDate, // วันที่ใบส่งของ
        sentId: req.body.sentId, //เลขที่ใบส่งของ
        invoiceDate: req.body.invoiceDate, //วันที่ใบกำกับ
        invoiceId: req.body.invoiceId, //เลขที่ใบกำกับ
        taxType: req.body.taxType, //คำนวณภาษีแบบ
        taxPercent: req.body.taxPercent, //อัตรภาษี
        credit: req.body.credit, //เครดิต(วัน)
        recieveEmp: req.body.recieveEmp, //พนักงานรับ
        dueDate: req.body.durDate, //dueDate
        paymentId: req.body.paymentId, //รหัสค่าใช้จ่าย
        creditor: req.body.creditor, //เจ้าหนี้
        address: req.body.address, //ที่อยู่
        priceBeforeDiscount: req.body.priceBeforeDiscount, //ยอดรวมก่อนลด
        totalDiscount: req.body.totalDiscount, //ส่วนลดรวม
        total: req.body.total, //ยอดคงเหลือ
        specialDiscount: req.body.specialDiscount, //ส่วนลดพิเศษ
        productPrice: req.body.productPrice, //มูลค่าสินค้า
        tax: req.body.tax, //ภาษี
        paidType: req.body.paidType, //ปรเภทการชำระ
        priceWithTax: req.body.priceWithTax, //ยอดรวมภาษี
        productList: req.body.productList
      };
    var product = await MannageStockProcessMode.InsertPro(data.product_id, data.product_name, data.left_amount, data.branch, data.barcode, data.price_lv1, data.price_lv2, data.price_lv3, data.price_lv4, data.product_group, data.brand, data.unit, data.product_cost, data.supplier)
    // console.log('is Order',x);
    res.send(product)
   }
   )

module.exports = router;