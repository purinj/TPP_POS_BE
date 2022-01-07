const {
    Router
} = require('express');
const RETURENTOSELLER = require('../model/ReturnToSellerProcess')
const PREFIXID = require('../model/prefixid')
const router = Router();
var ReturnToSellerMode = new RETURENTOSELLER
var PrefixID = new PREFIXID
router.post('/returntoseller_getdata', async function (req, res) {
        const order = await PrefixID.getDocumentNumber(4)
        const reqFormApi = {
            orderId: req.body.orderId
            // sentDate: req.body.sentDate,
            // taxPercent: req.body.taxPercent,
            // credit:req.body.credit,
            // recieveEmp: req.body.recieveEmp,
            // durDate: req.body.durDate,
            // paidType: req.body.paidType
        };
        var dataForSaleReturn = await ReturnToSellerMode.getStockFromSaleReturn(reqFormApi.orderId)
        console.log('reqFormApi', dataForSaleReturn);
        var productInRaw = await ReturnToSellerMode.getDocumentRaw(dataForSaleReturn[0].ref_num)
        const addressApi = {
            address: dataForSaleReturn[0].address,
            tel: dataForSaleReturn[0].tel,
            fax: dataForSaleReturn[0].fax,
            orner: dataForSaleReturn[0].orner
        }
        var productListApi = []
        for (item of productInRaw) {
            // var sertBarCode = ProductStockMode.sertBarCodeIsStock()
            productListApi.push({
                barcode: item.product_id,
                productName: item.product_name,
                productPrice: item.amount_reviece,
                productAmount: item.cost_price
            })


        }
        console.log('productListApi', productListApi);
        const ReturnToSellerModel = {
            documentId: order, // เลขที่ใบลดหนี้ซื้อ or เลขที่ใบส่งคืนผู้จำหน่าย
            generatedDocumentDate: null, // วันที่ใบส่งคืน
            seller: addressApi, // ข้อมูลคนขาย(เจ้าหนี้)
            deliveredDocumentDocumentId: dataForSaleReturn[0].order_taget, // อ้างเลขที่ใบรับ or เลขที่ใบกำกับ
            deliveredDocumentDate: dataForSaleReturn[0].date_taget, //วันที่ใบกำกับ
            productList: productListApi, // ข้อมูลสินค้าพร้อมราคา (บาร์โตด ชื่อ จำนวน)
            // ไม่เกี่ยวกับ API
            employeeName: null, // ชื่อพนักงาน
            because: null
        }
        // console.log('is Order',x);
        res.send(ReturnToSellerModel)
    }),
    router.post('/returntoseller_savedata', async function (req, res) {
        const ReturnToSellerModel = {
            documentId: req.body.documentId, // เลขที่ใบลดหนี้ซื้อ or เลขที่ใบส่งคืนผู้จำหน่าย
            generatedDocumentDate: req.body.generatedDocumentDate, // วันที่ใบส่งคืน
            seller: req.body.seller, // ข้อมูลคนขาย(เจ้าหนี้)
            deliveredDocumentDocumentId: req.body.deliveredDocumentDocumentId, // อ้างเลขที่ใบรับ or เลขที่ใบกำกับ
            deliveredDocumentDate: req.body.deliveredDocumentDate, //วันที่ใบกำกับ
            productList: req.body.productList, // ข้อมูลสินค้าพร้อมราคา (บาร์โตด ชื่อ จำนวน)
            // ไม่เกี่ยวกับ API
            employeeName: req.body.employeeName, // ชื่อพนักงาน
            because: req.body.because
        }
        console.log(ReturnToSellerModel);
        await ReturnToSellerMode.InsertHeadStock(ReturnToSellerModel)
        for (item of ReturnToSellerModel.productList) {
            console.log('recievingStockForSaveModel.productList', JSON.stringify(ReturnToSellerModel.productList));
            await ReturnToSellerMode.InsertRawStock(ReturnToSellerModel.documentId.id, ReturnToSellerModel.productList)
        }
        res.status(200).send('secess')
    })

module.exports = router;