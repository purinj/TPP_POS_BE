const database = require("./DatabaseConnect")
class Customer {
    // Select
    async  getAllRawData(cusid) {
        var check = await database.connectAndQuery(`select * from public.customer where customer_id = ${cusid}`)
        if (check.length > 0) {
            return {id: check ,status: true}
        } else {
            return {id: null ,status: false}
        }
    }

    customerSelect(){
        return database.connectAndQuery ('select * from public.customer')
    }

    // Insert
    testInsert(firstname,lastname,customerType) {
        return `insert into public.customer(firstname,lastname,customer_type) values(
            "${firstname}","${lastname}",${customerType})`
    }
    Insert(firstname,lastname,customerType) {
        database.connectAndQuery(`insert into public.customer(firstname,lastname,customer_type) values(
            "${firstname}","${lastname}",${customerType})`)
    }
    // Delete
    DeleteCustomer(ID) {
        database.connectAndQuery(`delete from public.customer where customer_id = ${ID} `)
    }
    async checkCustomer(firstname,lastname) {
        var check = await database.connectAndQuery(`select * from public.customer where firstname = '${firstname}' and lastname = '${lastname}'`)
        console.log('check 00',check);
        if (check.length > 0) {
            return {id: check[0].customer_id ,status: true}
        } else {
            return {id: null ,status: false}
        }
    
    }

    checkingCustomer (checkText) {
        const sqlCode = `SELECT * FROM public.customer
        where concat(customer_id,firstname,lastname) ~ '${checkText}'`
        return database.connectAndQuery(sqlCode)
    }
}



module.exports = Customer
