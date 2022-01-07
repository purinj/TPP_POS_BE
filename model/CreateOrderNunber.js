const database = require("./DatabaseConnect")
class CreateOrderNunber {
    // Select
    getAllRawData() {
        return database.connectAndQuery("select type_name from public.createordernunber")
    }

    // Insert
    Insert(name) {
         database.connectAndQuery(`insert into public.createordernunber(name) values("${name}")`)
    }
    // Delete
    DeleteById(ID) {
        database.connectAndQuery(`delete from public.createordernunber where sellingtype_id = ${ID} `)
    }
    SelectTable(input) {
        input = {
            prefix : input.firstname
       }
       var condition = `where `;
       
       for (const key in input) {
           console.log(key);
           if (input[key] != null) {
               if (morethereone) {
                   condition +=  ` and "${key}" = '${input[key]}'`
               } else {
                   condition +=  `"${key}" = '${input[key]}'`
                   morethereone = true 
               }   
           }
       }
       // if (inputdata.firstname != null) {
       //     CheckColum('firstname',inputdata.firstname)
       // }

       // if (inputdata.lastname != null) {
       //     CheckColum('lastname',inputdata.lastname)
       // }

       if (condition == `where`) {
           condition = ''
       } else {
           condition = condition
       }

       var selectcode = `select * from public.employee ` + condition;
       console.log(selectcode);
       return database.connectAndQuery(selectcode)

   }
   CheckColum(column,jsonField) {
       if (morethereone) {
           condition +=  `and '${column}' = ${jsonField}`
       } else {
           condition +=  `${column} = ${jsonField}`
           morethereone = true 
       }   
   }
  
}
module.exports = CreateOrderNunber