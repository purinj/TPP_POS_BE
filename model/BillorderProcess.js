const database = require("./DatabaseConnect")

class BillorderProcess {
    InsertHead(api, order, customer) {
        return database.connectAndQuery(`INSERT INTO public.head_billorder(
            ref_num, prefix, customer, isfromcustomertable, customername ,create_date, modify_date) values(
            ${order.refPlusNumber},'6',${customer.id[0].customer_id},${customer.status},'${customer.status = true ? customer.id[0].fristname + customer.id[0].lastname: api.customer}',now(),now())`)
    }
    async getDocumentHead(id) {
        const docHead = await database.connectAndQuery(`select * from head_billorder where ref_num = '${id}'`)
        console.log('docHead', docHead);
        return docHead
    }

    InsertRaw(data, order) {
        return database.connectAndQuery(`INSERT INTO public.rawbillorder(
            product_id, product_name, amount, price, unit, onsale, total, header_ref)
            VALUES ('${data.product_id}', '${data.product_name}', '${data.amount}','${data.price_lv1}' , '${data.unit}', null, null, ${order});`) // เปลี่ยน
    }
    async getRawSale(id) {
        const docBody = await database.connectAndQuery(`select id,amount,price,onsale,product_stock.* FROM public.rawbillorder inner join public.product_stock on 
        public.rawbillorder.product_id::bigint = public.product_stock.product_id  where header_ref = '${id}'`)
        return docBody
    }

}
module.exports = BillorderProcess
