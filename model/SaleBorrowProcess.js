const database = require("./DatabaseConnect")
class SaleBorrowProcess {
    // Select
    getAllRawData() {
        return database.connectAndQuery(`SELECT * FROM public.head_saleorder `)
    }
    getSaleDataProduct() {
        return database.connectAndQuery(`SELECT * FROM public.rawsaleorder `)
    }
    getSaleDataProductFromHead(headId) {
        return database.connectAndQuery(`SELECT * FROM public.rawsaleorder where header_ref = '${headId}'`)
    }
    

    customerData(customer) {
        return database.connectAndQuery(`select * from public.customer
        where customer.id = ${customer}`)
    }


    async getDocumentHead(id) {
        const docHead = await database.connectAndQuery(`select * from head_saleorder where ref_num = '${id}'`)
        console.log('docHead', docHead);
        return docHead
    }

    async getreport(body) {
        const docSrceah = await database.connectAndQuery(`select customername,savedplace,ordernumber,ra.product_id ,ra.product_name,ra.amount,ra.total_price
        from head_saleorder sa
        inner join rawsaleorder ra
        on ra.header_ref = sa.ref_num
        where sa.saledate  >= '${body.fromDate}' and sa.saledate <  '${body.toDate}'`)
        console.log('docHead', docHead);
        return docHead
    }
    async getRawSale(id) {
        const docBody = await database.connectAndQuery(`select id,amount,price,onsale,total_price,modify_date,create_date,product_stock.* FROM public.rawsaleorder inner join public.product_stock on 
        public.rawsaleorder.product_id::bigint = public.product_stock.product_id  where header_ref = '${id}'`)
        return docBody
    }

    // Insert
    InsertHead(api, order, customer) {
        return database.connectAndQuery(`INSERT INTO public.head_saleorder(
            ref_num, prefix, customer, isfromcustomertable, customername, address, taxcaltype, saledate, "sellEmployee", create_date, modify_date, savedplace, "sellingType", cheeremployee, payduedate, sellpricelevel, ordernumber) values(
            ${order.refPlusNumber},'5',${customer.id[0].customer_id},${customer.status},'${customer.status = true ? customer.id[0].fristname + customer.id[0].lastname: api.customer}',${api.savedPlace},
            '${api.taxCalType}','${api.date}','${api.sellEmployee}',now(),now(),'${api.savedPlace}','${api.sellingType}','${api.cheerEmployee}','${api.payDueDate}','${api.sellPriceLevel}',null)`)
    }
    InsertRaw(data, order) {
        return database.connectAndQuery(`INSERT INTO public.rawsaleorder(
            product_id, product_name, amount, unit, price, onsale, total_price, modify_date, create_date, header_ref)
            VALUES (
            ${data.product_id},'${data.product_name}',${data.amount},'${data.unit}',${data.price_lv1},null,null,now(),now(),${order})`) // เปลี่ยน
    }

    selectReportHeadSaleOrderData(filterData) {
        const dataModel = {
            customerId: filterData.customerId,
            productGroup: filterData.productGroup,
            fromDate: filterData.fromDate,
            toDate: filterData.toDate,
            fromProductId: filterData.fromProductId,
            toProductId: filterData.toProductId,
            supplier: filterData.supplier
        }
        let sqlCode = `select joining_data.*,
		public.customer.*,
		public.product_group.group_name as pdgroup_name,
        concat('1',
            public.prefix_id.type_name,
            '-',
            right(EXTRACT(YEAR FROM joining_data.head_create_date)::text ,2),
            LPAD(EXTRACT(MONTH FROM joining_data.head_create_date)::text, 2, '0'),
            LPAD(joining_data.ref_num::text, 4, '0')) as document_id
        from 
        (SELECT rawsaleorder.*,
        public.product_stock.product_name as stock_pd_name,
        public.product_stock.supplier,
		public.product_stock.product_group as pdgroup,
        head_saleorder.prefix,
		head_saleorder.customer as head_customer, 
		head_saleorder.isfromcustomertable as head_iscustomer, 
		head_saleorder.customername as head_customername, 
		head_saleorder.address as head_address, 
        head_saleorder.ref_num,
        head_saleorder.create_date::date as head_create_date
        FROM public.rawsaleorder inner join public.head_saleorder
        on public.rawsaleorder.header_ref::bigint = public.head_saleorder.id
        inner join public.product_stock on 
        public.rawsaleorder.product_id::bigint = public.product_stock.product_id) as joining_data
        inner join public.prefix_id on "prefix" = prefix_id.id
		inner join public.product_group on "pdgroup" = product_group.id
		left join  public.customer on "head_customer"::bigint = customer.customer_id
		`
        let extendClause = ' '
        if (dataModel.customerId != '') {
            if (extendClause.includes('where')) {
                extendClause += ` and head_customer = ${dataModel.customerId}`
            } else {
                extendClause += ` where head_customer = ${dataModel.customerId}`
            }
        }
        if (dataModel.productGroup != '') {
            if (extendClause.includes('where')) {
                extendClause += ` and pdgroup = ${dataModel.productGroup}`
            } else {
                extendClause += ` where pdgroup = ${dataModel.productGroup}`
            }
        }
        if (dataModel.fromDate != '') {
            if (extendClause.includes('where')) {
                extendClause += ` and head_create_date > '${dataModel.fromDate}'`
            } else {
                extendClause += ` where head_create_date > '${dataModel.fromDate}'`
            }
        }
        if (dataModel.toDate != '') {
            if (extendClause.includes('where')) {
                extendClause += ` and head_create_date < '${dataModel.toDate}'`
            } else {
                extendClause += `where head_create_date < '${dataModel.toDate}'`
            }
        }
        if (dataModel.fromProductId != '') {
            if (extendClause.includes('where')) {
                extendClause += ` and product_id > ${dataModel.fromProductId}`
            } else {
                extendClause += `where product_id > ${dataModel.fromProductId}`
            }

        }
        if (dataModel.toProductId != '') {
            if (extendClause.includes('where')) {
                extendClause += ` and product_id < ${dataModel.toProductId}`
            } else {
                extendClause += `where product_id < ${dataModel.toProductId}`
            }

        }
        if (dataModel.supplier != '') {
            if (extendClause.includes('where')) {
                extendClause += ` and supplier = '${dataModel.supplier}'`
            } else {
                extendClause += `where supplier = '${dataModel.supplier}'`
            }

        }
        return database.connectAndQuery(sqlCode)

    }



}

module.exports = SaleBorrowProcess