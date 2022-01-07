const database = require("./DatabaseConnect")
class RecievingProcess {
    // Select
    async getStockFromBuyying(ordernumber) {
        return database.connectAndQuery(`select datawithdocid.* from
        (SELECT head_buyingorder.*,
                concat(text(1),
                prefix_id.type_name,
                '-',
                right(EXTRACT(YEAR FROM  public.head_buyingorder.create_date)::text ,2),
                LPAD(EXTRACT(MONTH FROM  public.head_buyingorder.create_date)::text, 2, '0'),
                LPAD(public.head_buyingorder.ref_num::text, 4, '0')) as document_id
                FROM  public.head_buyingorder inner join public.prefix_id on  public.head_buyingorder.prefix = public.prefix_id.id) as datawithdocid
                where document_id = '${ordernumber}'`)
    }
    async getPriceDocumentRaw(id) {
        const docBody = await database.connectAndQuery(`select * FROM public.rawdatabuyingorder where header_ref = '${id}'`)
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
    InsertHeadrecievingStock(data,refNumData) {
        return database.connectAndQuery(`INSERT INTO public.head_recieving(
          ref_num, prefix, creditor_id, buying_ref, recievied_place, credit_day, paid_type, recieve_date, buying_date, invoice_date, tax_type, due_date, note, recieve_employee, create_date, modify_date)
        VALUES ('${refNumData.refPlusNumber}', '${4}', '${data.creditor}','${parseInt(data.recieveId.id) -1}', '${data.recieveBranch}', '${data.credit}', '${data.paidType}', '${data.recieveDate}', '${data.invoiceDate}', '${data.invoiceDate}', '${data.taxType}', '${data.dueDate}', '${data.note}', ${data.recieveEmp.employee_id}, now(), now());`)
    }
    InsertRawrecievingStock(recieving,refNumData) {
        return database.connectAndQuery(`INSERT INTO public.rawrecieving(
            header_ref, amount_sent, amount_reviece, product_id_ref)
            VALUES ('${refNumData.maxPlusId}', '${recieving.amount_sent}', '${recieving.amount_reviece}', '${recieving.product_id}');`)
    }


    // Delete
    DeleteById(ID) {
        return database.connectAndQuery(`delete from public.product_stock where product_id = ${ID} `)
    }


    getRecievingReport (data) {
        const whereModel = {
            creditor: data.creditor,
            fromDate: data.fromDate,
            todate: data.todate
        }
        let sqlCode = `select joining_data.*,
		company,
        concat('1',
            public.prefix_id.type_name,
            '-',
            right(EXTRACT(YEAR FROM joining_data.create_date)::text ,2),
            LPAD(EXTRACT(MONTH FROM joining_data.create_date)::text, 2, '0'),
            LPAD(joining_data.ref_num::text, 4, '0')) as document_id
        from 
        (SELECT rawreceivingstock.*,
        public.product_stock.product_name as stock_pd_name,
        public.product_stock.supplier,
		head_receivngstock.orner as head_creditor,
        head_receivngstock.prefix ,
        head_receivngstock.ref_num,
        head_receivngstock.create_date
        FROM public.rawreceivingstock inner join public.head_receivngstock
        on public.rawreceivingstock.header_ref::bigint = public.head_receivngstock.id
        inner join public.product_stock on 
        public.rawreceivingstock.product_id::bigint = public.product_stock.product_id) as joining_data
        inner join public.prefix_id on "prefix" = prefix_id.id
		inner join public.creditor_set on "head_creditor" = creditor_set.id`
        let extendClause = ' '
        if (whereModel.creditor != '') {
            if (extendClause.includes('where')) {
                extendClause += ` and head_creditor = ${whereModel.creditor}`
            } else {
                extendClause +=  `where head_creditor = ${whereModel.creditor}`
            }
        }
        if (whereModel.fromDate != '') {
            if (extendClause.includes('where')) {
                extendClause += ` and create_date > '${whereModel.fromDate}'`
            } else {
                extendClause +=  `where create_date > '${whereModel.fromDate}'`
            }
        }
        if (whereModel.todate != '') {
            if (extendClause.includes('where')) {
                extendClause += ` and create_date < '${whereModel.todate}'`
            } else {
                extendClause +=  `where create_date < '${whereModel.todate}'`
            }
        }
        return database.connectAndQuery(sqlCode)
    }
    
}



module.exports = RecievingProcess
