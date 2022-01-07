const database = require("./DatabaseConnect")
class EmployeePosition {
    // Select
    getAllRawData() {
        database.connectAndQuery("select * from public.employee_position")
    }

    // Insert
    Insert(name) {
        database.connectAndQuery(`insert into public.employee_position(position_name) values("${name}")`)
    }
    // Delete
    DeleteById(ID) {
        database.connectAndQuery(`delete from public.employee_position where position_id = ${ID} `)
    }
}



module.exports = EmployeePosition
