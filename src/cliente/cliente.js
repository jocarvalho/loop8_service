//const  sqlite3  =  require('sqlite3').verbose();
//const database = new sqlite3.Database("./my.db");
var self = module.exports= {

    obterClientes : (token, cb)=>{
        console.log("token"+token)
        //return  database.all(`SELECT * FROM users`, (err, row) => {
            cb(undefined, {row:""})
    //}
    //);
    },
    obterClientePorId : (token, id)=>{

    },
    adicionarCliente : (token, cliente)=>{

    }

}