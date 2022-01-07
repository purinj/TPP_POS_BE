const database = require("./DatabaseConnect")
class ReturnToSellerProcess {
    // Select
    async getStockFromSaleReturn(ordernumber) {
        return database.connectAndQuery(`SELECT id, ref_num, prefix, branch, branch_customer, order_po, credit, credit_day, tel, order_taget, date_taget, order_sent, date_sent, payment_type, date_recieve, create_date, modify_date, ordernumber, due_date from head_receivngstock where ordernumber = '${ordernumber}'`)
    }
    async getDocumentRaw(id) {
        const docBody = await database.connectAndQuery(`select * FROM public.rawreceivingstock where header_ref = '${id}'`)
        console.log('docBody',docBody);
        return docBody
    }
    customerData(customer){
        return database.connectAndQuery(`select * from public.customer
        where customer.id = ${customer}`)
    }


    async getPriceDocumentHead(id_sucess,prefix) {
        const docHead = await database.connectAndQuery(`select * from head_picepresentorder where ref_num = '${id_sucess}' and prefix = ${prefix}`)
        console.log('docHead',docHead);
        return  docHead
    }

    // Insert
    InsertHeadStock(data) {
        return database.connectAndQuery(`INSERT INTO public.head_salereturnorder(
            ref_num, prefix, adress, order_recieving, tel, orser_due, due_date, date_onsale, date_return, sentdate, duesentdate, employee, create_date, modify_date,ordernumber) values(
            '${data.documentId.id}',
            ${data.documentId.prefixid},
            ${data.seller.address ? data.address.address:null},
            ${data.deliveredDocumentDocumentId},
            '${data.seller.tel}',
            null,
            null,
            null,
            ${data.generatedDocumentDate},
            now(),
            now(),
            ${data.employeeName},
            now(),
            now(),
            '${data.documentId.name + data.documentId.id}')`)
    }
    InsertRawStock(id,data) {
        return database.connectAndQuery(`INSERT INTO public.rawsalereturnorder(
            header_ref, product_id, product_name, amount, price)
            VALUES (
            '${id}',${data[0].barcode},'${data[0].productName}',${data[0].productAmount},${data[0].productPrice})`)
    }


    // Delete
    DeleteById(ID) {
        return database.connectAndQuery(`delete from public.product_stock where product_id = ${ID} `)
    }
}



module.exports = ReturnToSellerProcess