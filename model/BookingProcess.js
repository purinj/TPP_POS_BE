const database = require("./DatabaseConnect")
class BookingProcess {
    // Select
    getAllRawData() {
        return database.connectAndQuery(`SELECT product_id, product_name, left_amount, branch_name, barcode, price, last_update, cost, status
            FROM public.product_stock inner join public.branch on public.branch.branch_id = "branch"`)
    }

    customerData(customer){
        return database.connectAndQuery(`select * from public.customer
        where customer.id = ${customer}`)
    }


    async getPriceDocumentHead(id_sucess,headId) {
        const docHead = await database.connectAndQuery(`select * from head_bookingorder where ref_num = '${id_sucess}' and id = ${headId}`)
        console.log('docHead',docHead);
        return  docHead
    }
    async getPriceDocumentRaw(id) {
        const docBody = await database.connectAndQuery(`select * FROM public.rawbooking where head_ref = ${id}`)
        console.log('docBody',docBody);
        return docBody
    }

    // Insert
    InsertHead(ref_num,prefix,customer,isfromcustomertable,customername,address,sentdate,duesentdate,standingpriceday,employee,ordernumber) {
        return database.connectAndQuery(`INSERT INTO public.head_bookingorder(
             ref_num, prefix, customer, isfromcustomertable, customername, address, sentdate, duesentdate, standingpriceday, employee, create_date, modify_date,ordernumber) values(
            ${ref_num},${prefix},${customer},${isfromcustomertable},'${customername}','${address}','${sentdate}','${duesentdate}','${standingpriceday}',${employee},now(),now(),'${ordernumber}')`)
    }
    InsertRaw(header_ref, product_id, product_name, amount, price) {
        return database.connectAndQuery(`INSERT INTO public.rawbooking(
            head_ref, product_id, product_name, amount, price)
            VALUES (
            ${header_ref},${product_id},'${product_name}',${amount},${price})`)
    }



}

module.exports = BookingProcess