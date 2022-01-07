const database = require("./DatabaseConnect")
class Ordersend {
    // Select
    getAllRawData() {
        return database.connectAndQuery("select * from public.order_sent")
    }

    

    // Insert
    Insert(referenceCode,product,customer,sellingType,paymentType,sellAmount,price,employee,timeStamp) {
        return database.connectAndQuery(`insert into public.product_selling(referance_code,product,
            customer,selling_type,payment_type,sell_amount,price,employee,price) values(
            ${referenceCode},${product},${customer},${sellingType},${paymentType},${sellAmount},${price},${employee},${timeStamp})`)
    }
    // Delete
    DeleteById(ID) {
        return database.connectAndQuery(`delete from public.product_selling where id = ${ID} `)
    }
    getOrder (payment_type,paymenttype_id,customer_id,customer,selling_type,sellingtype_id) {
        return database.connectAndQuery(`SELECT id, referance_code, firstname, lastname, 
        sellingtype_name, paymenttype_name, sell_amount, price,
        employee, time_stamp
	    FROM public.product_selling, 
	    public.payment_type,
	    public.customer,
	    public.selling_type
        where ${payment_type} = ${paymenttype_id} 
        and ${customer_id} = ${customer}
        and ${selling_type} = ${sellingtype_id} ;`)
    } 

}



module.exports = Ordersend
