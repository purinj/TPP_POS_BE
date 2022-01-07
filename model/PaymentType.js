const database = require("./DatabaseConnect")
class PaymentType {
    // Select
    getAllRawData() {
        return database.connectAndQuery("select * from public.payment_type")
    }

    // Insert
    Insert(name) {
        database.connectAndQuery(`insert into public.payment_type(paymenttype_name) values("${name}")`)
    }
    // Delete
    DeleteById(ID) {
        database.connectAndQuery(`delete from public.payment_type where paymenttype_id = ${ID} `)
    }
}



module.exports = PaymentType
