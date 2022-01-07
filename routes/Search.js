const {
    Router
  } = require('express');
  const router = Router();
  const PREFIXID = require('../model/prefixid')
  const CUSTOMER = require('../model/Customer')
  const Employee = require('../model/Employee')
  var PrefixID = new PREFIXID
  var customerQuery = new CUSTOMER
  const EmployeeQuery = new Employee
  router.get('/buydocument/:searchParameter', async function (req, res) {
    const searchingString = req.params.searchParameter
    const searchList = await PrefixID.getRealDocumentnumber(
        'public.head_buyingorder',
        null,
        false,
        true,
        searchingString
    )
    res.status(200).send({
      results: searchList
    })
  })
  router.get('/saleorder/all', async function (req, res) {
    const searchList = await PrefixID.getRealDocumentnumber(
        'public.head_saleorder',
        null,
        true,
        true,
        ''
    )
    
    res.status(200).send({
      results: searchList
    })
  })
  
  router.get('/customer/:searchParameter',async function (req,res) {
    const searchingString = req.params.searchParameter
    const searchList = await customerQuery.checkingCustomer(searchingString)
    res.status(200).send({
      results: searchList
    })
  })
  
  router.get('/employee/:searchParameter',async function (req,res) {
    const searchingString = req.params.searchParameter
    const searchList = await EmployeeQuery.searchEmployee(searchingString)
    res.status(200).send({
      results: searchList
    })
  })
  
  module.exports = router;