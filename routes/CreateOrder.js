const { Router } = require('express');
const CreateOrderNum  = require('../model/CreateOrderNunber')
const PrefixID = require('../model/PrefixID')
const router = Router();
var CreateOrderID = new CreateOrderNum
var Prefixnum = new PrefixID
// router.post('/createorderid',async function(req,res) {
//     var data = {
//         type_num : req.body.typenum,
//         type_name: req.body.typename,
//         description : req.body.description
//     }
//     var x = await PrefixIDMode.inSertData(data.type_num,data.type_name,data.description)
//     // console.log('is Order',x);
//     res.send(x)
//    }

   router.get('/createorderid',async function(req,res) {
       var id = await Prefixnum.getRef()
       var prefix = await Prefixnum.getPrefix()
       id = id[0].max + 1;
       let prefixid = prefix[0].type_name

       sqlInsert = await CreateOrderID.InsertID(id,prefix) 
       console.log(prefixid + id);

       res.send(prefixid + id)
   }
   )

module.exports = router;