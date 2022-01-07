const database = require("./DatabaseConnect")
class PrefixID {
    // Select
    
    getPrefix(num) {
        return database.connectAndQuery(`select * from public.prefix_id where id = '${num}'`)
    }
    getRef(num) {
        let table = ''
        switch (num) {
            case 1:
                table = 'public.head_picepresentorder'
                break;
            case 2:
                table = 'public.head_bookingorder'
                break;
            case 3:
                table = 'public.head_buyingorder'
                break;
            case 3:
                table = 'public.head_receivngstock'
                break;
            case 4:
                table = 'public.head_salereturnorder'
                break;
            case 5:
                table = 'public.head_saleorder'
                break;
            default:
                break;
        }
        return database.connectAndQuery(`select max(id::int) from ${table} where prefix = '${num}'`)
    }

    inSertData(type_num,type_name,description) {
    // Insert
    let sql = `INSERT INTO public.prefix_id(type_num, type_name, description) VALUES ('${type_num}', '${type_name}', '${description}')`;
    console.log(sql);
    database.connectAndQuery(sql);
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
    InsertID(ref,prefix) {
        database.connectAndQuery(`insert into public.createordernunber(ref_num, prefix, create_date, modify_date) values("${ref}","${prefix}",now(),now())`)
    }
    async getDocumentNumber(num) {
        var id = await this.getRef(num)
       var prefix = await this.getPrefix(num)
       if (id.max = null) {
         id.max = 0
       }
       var id_sucess = id[0].max + 1;
       let prefixid = prefix[0].id
    //    var sqlInsert = await this.InsertID(id_sucess,prefix) 
       console.log('order',prefixid + id_sucess);
       const order = prefixid.toString() + id_sucess.toString()
       return {order:order, 
        prefixid:prefixid,
        id:id_sucess,
        name:prefix[0].type_name}
       
    }

    async findRefNum (tableName,focusColumn) {
        const findNumber = await database.connectAndQuery(`SELECT ref_num,id
        FROM ${tableName} where 
        EXTRACT(year from "${focusColumn}") = EXTRACT(year from now()) AND
        EXTRACT(month from "${focusColumn}") = EXTRACT(month from now())
        ORDER BY id DESC LIMIT 1;`)

        var refNum = 0
        var maxPlusId
        if (findNumber.length < 1|| findNumber[0].ref_num == null || findNumber[0].ref_num == 'null' || findNumber[0].ref_num == 'undefined') {
            refNum = 1
            maxPlusId = 1
        } else {
            refNum = parseInt(findNumber[0].ref_num) + 1
            maxPlusId = parseInt(findNumber[0].id) + 1
        }
        return {
            refPlusNumber: refNum,
            maxPlusId : maxPlusId
        }
    }
    getRealDocumentnumber(targetTable,targetTableId = null,isShowHeadData = false,isSearching= false, searchString = '') {
        var sqlCode = `SELECT `
        if (isShowHeadData) {
            sqlCode +=  `${targetTable}.*,`
        }
        sqlCode += `text(1) as branch_code,
        prefix_id.type_name,
        right(EXTRACT(YEAR FROM ${targetTable}.create_date)::text ,2) as create_year,
        LPAD(EXTRACT(MONTH FROM ${targetTable}.create_date)::text, 2, '0') as create_month,
        LPAD(${targetTable}.ref_num::text, 4, '0') as ref_number,
        ${targetTable}."id" as head_id
        FROM ${targetTable} inner join public.prefix_id on ${targetTable}.prefix = public.prefix_id.id`

        if (targetTableId != null) {
            sqlCode += ` where ${targetTable}."id" = ${targetTableId}`
        }
        if (isSearching) {
            sqlCode = `select concat(branch_code,type_name,'-',create_year,create_month,ref_number) as doccumentId ,ref_table.*
            from(${sqlCode}) as "ref_table" where concat(branch_code,type_name,create_year,create_month,ref_number) ~ '${searchString}'
            `
        }
        sqlCode += ';'
        return  database.connectAndQuery(sqlCode)
    }
    


}



module.exports = PrefixID
