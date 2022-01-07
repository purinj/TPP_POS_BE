const database = require("./DatabaseConnect")
class Employee {
    // Select
    async getAllRawData() {
        var data = await database.connectAndQuery("select * from public.employee")
        return data
    }
    async searchEmployeedata (checkText) {
        const sqlCode = `SELECT * from public.employee
        where employee_id = '${checkText}'`
        return database.connectAndQuery(sqlCode)
    }

    // Insert
    Insert(firstname,lastname,department,position) {
        database.connectAndQuery(`insert into public.employee(firstname,lastname,department,position) values("${firstname}","${lastname}",${department},${position})`)
    }
    // Delete
    DeleteById(ID) {
        database.connectAndQuery(`delete from public.employee where employee_id = ${ID} `)
    }

    searchEmployee (checkText) {
        const sqlCode = `SELECT * from public.employee
        where concat(employee_id,firstname,lastname) ~ '${checkText}'`
        return database.connectAndQuery(sqlCode)
    }


    async AuthenUser(username,password) {
        var data = await database.connectAndQuery(`select * from public.employee where "user_name" = '${username}' and "password" = '${password}'`)
        delete data[0].password
        delete data[0].user_name
        
        return data[0]
    }
   async selectById(ID) {
        var data = await database.connectAndQuery(`select * from public.employee where employee_id = ${ID} `)
        delete data[0].password
        delete data[0].user_name
        return  data[0]
    }
}


module.exports = Employee
