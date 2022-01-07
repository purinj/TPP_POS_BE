const database = require("./DatabaseConnect")
class SellingType {
    // Select
    getAllRawData() {
        database.connectAndQuery("select * from public.selling_type")
    }

    // Insert
    Insert(name) {
        database.connectAndQuery(`INSERT INTO public.rawbooking(order_id, product_name, amount, price, customer_name, adress, date_send, date_res, num_date)VALUES 
        (${order_id}, ${product_name}, ${amount}, ${price}, ${customer_name}, ${adress}, ${date_send}, ${date_res},${num_date});")`)
    }
    // Delete
    DeleteById(ID) {
        database.connectAndQuery(`delete from public.selling_type where sellingtype_id = ${ID} `)
    }
}



module.exports = SellingType
