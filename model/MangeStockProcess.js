const database = require("./DatabaseConnect")
class MannageStockProcess {
    // Select
    getAllRawData() {
        database.connectAndQuery("select * from public.branch")
    }

    // Insert
    InsertPro(product_id, product_name, left_amount, branch, barcode, price_lv1, price_lv2, price_lv3, price_lv4, product_group, brand, unit, product_cost, supplier) {
        return database.connectAndQuery(`INSERT INTO public.product_stock(
            product_id, product_name, left_amount, branch, barcode, price_lv1, last_update, price_lv2, price_lv3, price_lv4, product_group, brand, unit, product_cost, supplier)
            VALUES (${product_id}, '${product_name}', ${left_amount}, ${branch}, ${barcode}, ${price_lv1}, now(), ${price_lv2}, ${price_lv3}, ${price_lv4}, '${product_group}', '${brand}', '${unit}', ${product_cost}, '${supplier}');`)
    }
    // Delete
    DeleteById(ID) {
        database.connectAndQuery(`delete from public.branch where branch_id = ${ID} `)
    }
}

module.exports = MannageStockProcess