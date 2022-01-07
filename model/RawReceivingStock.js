const database = require("./DatabaseConnect")
class RawReceivingStock {
    // Select
    getAllRawData() {
        database.connectAndQuery("select * from public.rawreceivingstock")
    }

    // Insert
    Insert(name) {
        database.connectAndQuery(`insert into public.rawreceivingstock(name) values("${name}")`)
    }
    // Delete
    DeleteById(ID) {
        database.connectAndQuery(`delete from public.rawreceivingstock where sellingtype_id = ${ID} `)
    }
}