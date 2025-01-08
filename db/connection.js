const mysql = require('mysql2')

const con =  mysql.createConnection({
    host: 'localhost',
    user: "root",
    database: 'order_eat'
})

con.connect((err)=>{
    if (err){
        console.log("Error: " + err)
    }
    else{
        console.log('Connection success')
    }
})

module.exports=con;