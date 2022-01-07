const database = require("./DatabaseConnect")
class ProductStock {
    // Select
    getAllRawData() {
        return database.connectAndQuery(`SELECT *
            FROM public.product_stock inner join public.branch on public.branch.branch_id = "branch"`)
    }

    getProductList(id) {
        return database.connectAndQuery(`SELECT product_cost
        FROM public.product_stock where product_id = ${id}`)
    }
    insertStock(data){
        const sql = `INSERT INTO public.product_stock(
            product_name, 
            left_amount,
            barcode, 
            price_lv1, 
            last_update, 
            price_lv2, 
            price_lv3, 
            price_lv4, 
            product_group, 
            brand, 
            unit, 
            product_cost, 
            supplier)
            VALUES (
                '${data.product_name}', 
                '${data.left_amount}', 
                '${data.barcode}',
                '${data.price_lv1}',
                 now(), 
                 '${data.price_lv2}', 
                 '${data.price_lv3}', 
                 '${data.price_lv4}', 
                 '${data.product_group}', 
                 '${data.brand}', 
                 '${data.unit}', 
                 '${data.product_cost}', 
                 '${data.supplier}');
        `
        return database.connectAndQuery(sql)
    }
    
    
    updateByID(data){
        const sql = `UPDATE public.product_stock
        SET 
        product_name='${data.product_name}', 
        left_amount='${data.left_amount}', 
        barcode='${data.barcode}',
        price_lv1='${data.price_lv1}', 
        last_update= now(), 
        price_lv2='${data.price_lv2}', 
        price_lv3='${data.price_lv3}', 
        price_lv4='${data.price_lv4}', 
        product_group= '${data.product_group}', 
        brand='${data.brand}', 
        unit= '${data.unit}', 
        product_cost=${data.product_cost}, 
        supplier='${data.supplier}'
        WHERE product_id = ${data.product_id};`
        return database.connectAndQuery(sql)
    }

    customerData(customer){
        return database.connectAndQuery(`select * from public.customer
        where customer.id = ${customer}`)
    }

    getAllGroup () {
        return database.connectAndQuery(`SELECT *
        FROM public.product_group`)
    }

    async getPriceDocumentHead(id_sucess,headId) {
        const docHead = await database.connectAndQuery(`select * from head_picepresentorder where ref_num = '${id_sucess}' and id = ${headId}`)
        console.log('docHead',docHead);
        return  docHead
    }
    async getPriceDocumentRaw(id) {
        const docBody = await database.connectAndQuery(`select * FROM public.rawpricingorder where header_ref = '${id}'`)
        console.log('docBody',docBody);
        return docBody
    }

    // Insert
    InsertHead(ref_num,prefix,customer,isfromcustomertable,customername,address,sentdate,duesentdate,standingpriceday,ordernumber) {
        return database.connectAndQuery(`INSERT INTO public.head_picepresentorder(
             ref_num, prefix, customer, isfromcustomertable, customername, address, sentdate, duesentdate, standingpriceday, create_date, modify_date,ordernumber) values(
            ${ref_num},${prefix},${customer},${isfromcustomertable},'${customername}','${address}','${sentdate}','${duesentdate}','${standingpriceday}',now(),now(),'${ordernumber}')`)
    }
    InsertRaw(header_ref, product_id, product_name, amount, price) {
        return database.connectAndQuery(`INSERT INTO public.rawpricingorder(
            header_ref, product_id, product_name, amount, price)
            VALUES (
            ${header_ref},${product_id},'${product_name}',${amount},${price})`)
    }

    getDeadStock (data) {
        const model = {
            age: data.age,
            group: data.group,
            sortType: data.sortType,
            fromProductId: data.fromProductId,
            toProductId: data.toProductId,
            balanced: data.balanced

        }
        let sqlCode = `SELECT *
        FROM public.product_stock 
        where 
        extract(month from age(last_update)) > ${model.age}`

        if (model.group != '') {
            sqlCode += ` and product_group = ${model.group}`
        }
        if (model.fromProductId != '') {
            sqlCode += ` and product_id > ${model.fromProductId}`
        }
        if (model.toProductId != '') {
            sqlCode += ` and product_id < ${model.toProductId}`
        }
        if (model.balanced != '' || model.balanced !='ทั้งหมด') {
            sqlCode += ` and left_amount ${model.balanced}`
        }

        switch (model.sortType) {
            case 'ชื่อสินค้า':
                sqlCode += ` ORDER by product_name`
                break
            case 'ตามรหัสสินค้า':
                sqlCode += ` ORDER by product_id`
                break
            case 'วันที่ล่าสุด':
                sqlCode += ` ORDER by last_update`
                break    

        }

        return database.connectAndQuery(sqlCode)
    }


    // Delete
    DeleteById(ID) {
        return database.connectAndQuery(`delete from public.product_stock where product_id = ${ID} `)
    }

    UpdateLeftAmount(operator,quantity,prodId) {
        return database.connectAndQuery(`UPDATE public.product_stock
        SET left_amount = left_amount ${operator} ${quantity},last_update = now() where "product_id" = ${prodId};`)
    }

    UpdateBranch(brachId,productID) {
        return  database.connectAndQuery(`UPDATE public.product_stock
    UpdateBranch(brachId,productID) {
        SET branch=${brachId} WHERE product_id='${productID}';`)

    }



}



module.exports = ProductStock
