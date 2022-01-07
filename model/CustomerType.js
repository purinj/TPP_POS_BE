const database = require("./DatabaseConnect")
class CustomerType {
    getAllRawData() {
        database.connectAndQuery("select * from public.customer_type")
    }

    // Insert
    Insert(name) {
        database.connectAndQuery(`insert into public.customer_type(customertype_name) values("${name}")`)
    }
    // Delete
    DeleteCustomer(ID) {
        database.connectAndQuery(`delete from public.customer_type where customertype_id = ${ID} `)
    }
}

module.exports = CustomerType