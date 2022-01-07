const {
    Router
  } = require('express');
  const router = Router();
  const productQuery = require('../model/ProductStock')
  const branchQuery = require('../model/Branch')
  const prefixQuery = require('../model/PrefixID')
  const PRODUCT_QUERY_CLASS = new productQuery
  const BRANCH_QUERY = new branchQuery
  const PREFIX_QUERY = new prefixQuery

  router.get('/brach_all',async function (req,res) {
    const branchData = await BRANCH_QUERY.getAllRawData()
    res.status(200).send(
      {
        branchList: branchData
      }
    )


  } ) 
router.post('/product_tranfer_movement',async function (req,res) {
  let productId
  let supplier
  if (req.body.filterProductId) {
     productId = req.body.filterProductId
  } else {
    productId = ''
  }

  if (req.body.filterSupplier) {
    supplier = req.body.filterSupplier
  } else {
    supplier = ''
  }
  const rawData = await BRANCH_QUERY.selectRawTranferMovementWithDocID(
    productId,
    supplier
  )
  res.status(200).send(
    {
      results: rawData
    }
  )
} ) 

  router.post('/save/move_branch_document', async function (req,res) {
      const requestModel = {
          branchId: req.body.branchId,
          fromBrach: req.body.fromBrach, // ย้ายจากสาขา
          toBranch:  req.body.toBranch, // ย้ายไปสาขา (ID)
          employee:  req.body.employee, // พนักงาน
          approver:  req.body.approver, // ผู้อนุมัตื
          movaBrachDate:  req.body.movaBrachDate, // วันที่โอนย้าย
          productList : req.body.productList // สินค้าที่โอนย้าย
      }
      const refNum = await PREFIX_QUERY.findRefNum('public.head_tranferorder','create_date')
      await BRANCH_QUERY.saveMoveBrachHeadDocument(requestModel,refNum.refPlusNumber)
     
    for (var item of requestModel.productList) {
      await PRODUCT_QUERY_CLASS.UpdateLeftAmount('-', item.tranferNumber,item.product_id)
      await BRANCH_QUERY.saveMoveBrachRowsDocument(refNum.maxPlusId,item)

    }
    const findDocumentID = await PREFIX_QUERY.getRealDocumentnumber('public.head_tranferorder',refNum.maxPlusId,false,true,'')

   const resModel =  {
        documetId: findDocumentID[0].doccumentid // เลขที่ใบโอน
    }
    res.status(200).send(resModel)
  })
  
  
  module.exports = router;