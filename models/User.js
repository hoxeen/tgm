const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'test',
    port: 5432,
});

const find = (wh, val, ...sel) => {
    return new Promise(function(resolve, reject) {
        console.log('SELECT '+sel.join()+' FROM user_data WHERE '+wh+'=\''+val+'\'')
        pool.query('SELECT '+sel.join()+' FROM user_data WHERE '+wh+'=\''+val+'\'', (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(results);
        })
    })
}

const create = (body) => {
    return new Promise(function(resolve, reject) {
        const keys=Object.keys(body);
        const value=Object.values(body);
        const valueStr = "'" + value.join("','") + "'";
        pool.query('INSERT INTO user_data ('+keys+') VALUES ('+valueStr+')', (error, results) => {
            if (error) {
                reject(error)
            }
            resolve(`A new merchant has been added added`)
        })
    })
}
// const deleteMerchant = () => {
//     return new Promise(function(resolve, reject) {
//         const id = parseInt(request.params.id)
//         pool.query('DELETE FROM merchants WHERE id = $1', [id], (error, results) => {
//             if (error) {
//                 reject(error)
//             }
//             resolve(`Merchant deleted with ID: ${id}`)
//         })
//     })
// }

module.exports = {
    create,
    find
}