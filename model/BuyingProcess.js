const database = require("./DatabaseConnect")
class BuyingProcess {
    // Select
    getAllRawData() {
        return database.connectAndQuery(`SELECT product_id, product_name, left_amount, branch_name, barcode, price, last_update, cost, status
            FROM public.product_stock inner join public.branch on public.branch.branch_id = "branch"`)
    }

    customerData(customer){
        return database.connectAndQuery(`select * from public.customer
        where customer.id = ${customer}`)
    }


    async getPriceDocumentHead(id_sucess,prefix) {
        const docHead = await database.connectAndQuery(`select * from head_buyingorder where ref_num = '${id_sucess}' and prefix = ${prefix}`)
        console.log('docHead',docHead);
        return  docHead
    }
    async getPriceDocumentRaw(id) {
        const docBody = await database.connectAndQuery(`select * FROM public.rawdatabuyingorder where header_ref = '${id}'`)
        console.log('docBody',docBody);
        return docBody
    }

    // Insert
    InsertHead(data) {
        return database.connectAndQuery(`INSERT INTO public.head_buyingorder(
            ref_num, 
            prefix, 
            creditor, 
            orner, 
            address, 
            tel, 
            fax, 
            saletype, 
            employee, 
            placcode, 
            saledate, 
            duesentdate, 
            duepaydate, 
            duedate, 
            taxtype, 
            create_date, 
            modify_date, 
            ordernumber)
            VALUES (
            '${data.ref_num}',
            '${data.prefix}',
            '${data.creditor}',
            '${data.orner}',
            '${data.address}',
            '${data.tel}',
            '${data.fax}',
            '${data.saletype}',
            '${data.employee}',
            '${data.placcode}',
            now(),
            '${data.duesentdate}',
            '${data.duepaydate}',
            '${data.duedate}',
           '${data.taxtype}',
            now(),
            now(),
            '${data.ordernumber}')`)
    }
    InsertRaw(header_ref, product_id, product_name, amount, price) {
        return database.connectAndQuery(`INSERT INTO public.rawdatabuyingorder(
            header_ref, product_id, product_name, amount, price)
            VALUES (
            ${header_ref},${product_id},'${product_name}',${amount},${price})`)
    }


}
module.exports = BuyingProcess