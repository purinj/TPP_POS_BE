const database = require("./DatabaseConnect")
class Branch {
    // Select
    getAllRawData() {
        return database.connectAndQuery("select * from public.branch")
    }

    // Insert
    Insert(name) {
        database.connectAndQuery(`insert into public.branch(branch_name) values("${name}")`)
    }
    // Delete
    DeleteById(ID) {
        database.connectAndQuery(`delete from public.branch where branch_id = ${ID} `)
    }

    async saveMoveBrachHeadDocument(data,refNum) {
        console.log(data.employee);
        const queryCode = `INSERT INTO public.head_tranferorder(
            ref_num, prefix, branchfrom, branchto, employee, employeename, isfromemployeetable, date_tranferorder, create_date, modify_date)
            VALUES ('${refNum}', 7, '${data.fromBrach}', '${data.toBranch}', '${data.employee.employee_id}', '${data.employee.firstname}', false, '${data.movaBrachDate}', now(), now());`
        await database.connectAndQuery(queryCode)
    }
    async findHeadMoveBranch(findingData) {
        const queryCode = `select * from public.head_tranferorder
         where
         branchfrom = '${findingData.fromBrach}' AND 
         branchto = '${findingData.toBranch}' AND 
         employee = '${findingData.employee.employee_id}' AND 
         employeename = '${findingData.employee.firstname}' AND 
         date_tranferorder = '${findingData.movaBrachDate}'`
        const res = await database.connectAndQuery(queryCode)
        return res
    }
    async saveMoveBrachRowsDocument(headerRefer,productData) {
        const queryCode = `INSERT INTO public.rawtranferorder(
            order_id, product_id, barcode, product_name, amount , cost_price, price, total, vat)
           VALUES ('${headerRefer}', '${productData.product_id}', '${productData.barcode}', '${productData.product_name}', '${productData.tranferNumber}', '${productData.product_cost}', '${productData.price_lv1}', null,null);`
        await database.connectAndQuery(queryCode)
    }

    selectRawTranferMovementWithDocID(filterProductId,filterSupplier) {
       let code =  `select joining_data.*,
       public.branch.branch_name as to_branch_name,
        concat('1',
            public.prefix_id.type_name,
            '-',
            right(EXTRACT(YEAR FROM joining_data.create_date)::text ,2),
            LPAD(EXTRACT(MONTH FROM joining_data.create_date)::text, 2, '0'),
            LPAD(joining_data.ref_num::text, 4, '0')) as document_id
        from 
        (SELECT rawtranferorder.*,
        public.product_stock.product_name as stock_pd_name,
        public.product_stock.supplier,
        head_tranferorder.branchto,
        head_tranferorder.prefix ,
        head_tranferorder.ref_num,
        head_tranferorder.create_date
        FROM public.rawtranferorder inner join public.head_tranferorder 
        on public.rawtranferorder.order_id = public.head_tranferorder.id
        inner join public.product_stock on 
        public.rawtranferorder.product_id::bigint = public.product_stock.product_id) as joining_data
        inner join public.prefix_id on "prefix" = prefix_id.id
        inner join public.branch on "branchto" = public.branch.branch_id`
    
        if (filterProductId !== '') {
            code += ` where joining_data.product_id::bigint = ${filterProductId}`
        } 
        if (filterSupplier !== '') {
            if (code.includes('where')) {
                code += ` AND joining_data.supplier ${filterSupplier}`
            } else{
                code += ` where joining_data.supplier ${filterSupplier}`
            }
           
        }
      

        return database.connectAndQuery(code)
    }



}



module.exports = Branch