const database = require("./DatabaseConnect")
class RawPricing {
    // Select
    getAllRawData() {
        database.connectAndQuery("select * from public.rawpricing")
    }

    // Insert
    Insert(name) {
        database.connectAndQuery(`insert into public.rawpricing(name) values("${name}")`)
    }
    // Delete
    DeleteById(ID) {
        database.connectAndQuery(`delete from public.rawpricing where sellingtype_id = ${ID} `)
    }
}
