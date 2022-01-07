const {
    Router,
    request
} = require('express');
const CUSTOMER = require('../model/Customer')
const PAYMENTTYPE = require('../model/PaymentType')
const SALEBORROWPROCESS = require('../model/SaleBorrowProcess')
const StockMode = require('../model/ProductStock')
const PrefixID = require('../model/prefixid')
const Employee = require('../model/Employee')
var stockMode = new StockMode
const BARNCH = require('../model/Branch')
const router = Router();
var branchMode = new BARNCH
var saleMode = new SALEBORROWPROCESS
var customerMode = new CUSTOMER
var paymenTypeMode = new PAYMENTTYPE
var PrifixMode = new PrefixID
var EmployeeMode = new Employee



router.post('/rawbooking', async function (req, res) {
    var data = {
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }
    var x = await customerMode.SelectTable(data)
    console.log('is Order', x);
    res.send(x)
})


router.post('/test_post', async (req, res) => {
    // console.log('yo',req.body);
    res.status(200).send('ok')
})

router.get('/getbranch', async (req, res) => {
    const barnch = await branchMode.getAllRawData()
    // console.log('yo',barnch);
    res.status(200).send(barnch)
})

router.get('/getpayment', async (req, res) => {
    const payment = await paymenTypeMode.getAllRawData()
    console.log('yo', payment);
    res.status(200).send(payment)
})

router.get('/getcustomer', async (req, res) => {
    const customer = await customerMode.customerSelect()
    var customerModel = []
    let index = 0
    for (item of customer) {
        let name = customer[index].firstname + ' ' + customer[index].lastname
        customerModel.push({
            customer_id: customer[index].customer_id,
            name: name,
        })
        index++
    }
    // console.log('yo',customerModel);
    res.status(200).send(customerModel)
})

router.post('/reporteachprod', async (req, res) => {
    var model = {
        from_branch: req.body.from_branch, //สาขาที่รับสินค้า
        customer_id: req.body.customer_id, //เลขที่ใบรับ
        fromProdId: req.body.fromProdId, //รหัสลูกค้า
        toProd: req.body.toProd, //วันที่รับสินค้า
        saleType: req.body.saleType, // วันที่ใบส่งของ
        toDate: req.body.toDate, //เลขที่ใบส่งของ
        fromDate: req.body.fromDate, //วันที่ใบกำกับ
    }
    console.log(model);
    getreport()

    const recievingStockModel = {
        branch: this.branch, //สาขา
        customerId: this.customerId, //รหัสลูกค้า
        fromDate: this.fromDate, //จากวันที่
        toDate: this.toDate, // ถึงวันที่
        fromProdId: this.fromProdId, //จากรหัสสินค้า
        toProdId: this.toProdId, //ถึงนหัสสินค้า
        prodGroup: this.prodGroup, //กลุ่มสินค้า
        saleType: this.saleType, //ประเภทการขาย
        supplier: this.supplier, //supplier
        shelf: this.shelf //ชั้นเก็บ
    };
    console.log('yo', req.body);
    res.status(200).send(recievingStockModel)
})

router.get('/getsalehead', async (req, res) => {
    // const saleHead = await saleMode.getAllRawData()
    const headtable = await PrifixMode.getRealDocumentnumber('public.head_saleorder', null, true, true, '')
    console.log('99',headtable);
    var ressale = []
    for (let i = 0; headtable.length > i; i++) {
        let employeeData = await EmployeeMode.searchEmployeedata(headtable[i].sellEmployee)
        if (employeeData && employeeData.length > 0) {
            let decareSale = {
                id: headtable[i].head_id, //สาขา
                saledate: headtable[i].create_date, //รหัสลูกค้า
                name: headtable[i].customername, //จากวันที่
                lastname: '', // ถึงวันที่
                add: '',
                documentID : headtable[i].doccumentid,
                address: headtable[i].address,
                employee: employeeData[0].firstname ? employeeData[0].firstname : 'ขายสด'
            };
            ressale.push(decareSale)
        }
    }
    console.log(headtable);
    console.log('yo', ressale);
    res.status(200).send(ressale)
})

router.post('/getrawsale', async (req, res) => {
    var model = {
        saleHeader: req.body.saleHeader //สาขาที่รับสินค้า
    }
    const productList = await saleMode.getSaleDataProductFromHead(model.saleHeader)
    var productRes = []
    for (let i = 0; productList.length > i; i++) {
        let cost_product = await stockMode.getProductList(productList[i].product_id)
        let total_cost = productList[i].amount * cost_product[0].product_cost
        let decareSale = {
            id: productList[i].product_id, //สาขา
            item_name: productList[i].product_name, //รหัสลูกค้า
            amount: productList[i].amount, //จากวันที่
            price: productList[i].price, // ถึงวันที่
            price_total:productList[i].price * productList[i].amount,
            cost_product: cost_product[0].product_cost,
            cost_total: total_cost,
            header_ref: productList[i].header_ref
        };
        productRes.push(decareSale)
    }
    console.log('yo', productRes);
    // console.log('yo',barnch);
    res.status(200).send(productRes)
})



module.exports = router;