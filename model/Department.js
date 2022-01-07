const database = require("./DatabaseConnect")
class Department {
    // Select
    getAllRawData() {
        database.connectAndQuery("select * from public.department")
    }

    // Insert
    Insert(name) {
        database.connectAndQuery(`insert into public.department(department_name) values("${name}")`)
    }
    // Delete
    DeleteById(ID) {
        database.connectAndQuery(`delete from public.department where department_id = ${ID} `)
    }
}



module.exports = Department
