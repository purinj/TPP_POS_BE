const database = require("./DatabaseConnect")
class Rawsell {
    // Select
    getAllRawData() {
        database.connectAndQuery("select * from public.rawsell")
    }

    // Insert
    Insert(name) {
        database.connectAndQuery(`insert into public.selling_type(name) values("${name}")`)
    }
    // Delete
    DeleteById(ID) {
        database.connectAndQuery(`delete from public.selling_type where sellingtype_id = ${ID} `)
    }
}
