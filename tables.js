const  sqlite3  =  require('sqlite3').verbose();
const database = new sqlite3.Database("./my.db");
var self = module.exports= {

  createUsersTable  : () => {
    const  sqlQuery  =  `
        CREATE TABLE IF NOT EXISTS users (
        id integer PRIMARY KEY,
        nome text,
        sobrenome text,
        cpf text,
        email text UNIQUE,
        celular text,
        logradouro text,
        complemento text,
        bairro text,
        cidade text,
        estado text,
        cep text,
        dataNascimento text,
        estadoCivil text,
        qtddFilho text,
        tipoParticipacao text,
        qtddMoradores text,
        responsavelFinanceiro text,
        password text,
		status text)`;

    return  database.run(sqlQuery);
},
createVeiculo  : () => {
    const  sqlQuery  =  `
        CREATE TABLE IF NOT EXISTS veiculo (
		id integer PRIMARY KEY,
		marca text, 
		modelo text,
		anoFabricacao text,
		placa text,
		bagageiroLts text,
		propriedade text)`;

    return  database.run(sqlQuery);
},
 createProdutos  : () => {
    const  sqlQuery  =  `
	CREATE TABLE IF NOT EXISTS produtos (
		id integer PRIMARY KEY, 
		nome text, 
		codigoDeBarras text,
		site text
		)`;
	return  database.run(sqlQuery);
},
/*
,
		marca integer,
		tipoEmbalagem text,
		unidadeComercial text,
		materialEmbalagem text,
		codigoEmbalagem text
		
*/
createMarca  : () => {
    const  sqlQuery  =  `
	CREATE TABLE IF NOT EXISTS marcas (
		id integer PRIMARY KEY, 
		nome text, 
		site text,
		logomarca text,
		fabricante integer)`;
	return  database.run(sqlQuery);
},
createFabricante  : () => {
    const  sqlQuery  =  `
	CREATE TABLE IF NOT EXISTS fabricantes (
		id integer PRIMARY KEY, 
		nome text, 
		cnpj text,
		site text,
		email text,
		facebook text,
		instagram text,
		telefone text)`;
	return  database.run(sqlQuery);
},
createEcoBag  : () => {
    const  sqlQuery  =  `
	CREATE TABLE IF NOT EXISTS ecobags (
		id integer PRIMARY KEY, 
		idUser integer, 
		idColetor integer,
		footprint text,
		status text
		)`;
	return  database.run(sqlQuery);
},
createEcoBagProdutos  : () => {
    const  sqlQuery  =  `
	CREATE TABLE IF NOT EXISTS ecobagProduto (
		idEcobag integer, 
		idProduto integer,
		qtddProduto integer
		)`;
	return  database.run(sqlQuery);
},

createEcoBagCliente  : () => {
    const  sqlQuery  =  `
	CREATE TABLE IF NOT EXISTS ecobagCliente (
		idEcobag integer, 
		idCliente integer,
		valor integer,
		status text
		)`;
	return  database.run(sqlQuery);
},

createEcoBagColetor  : () => {
    const  sqlQuery  =  `
	CREATE TABLE IF NOT EXISTS ecobagColetor (
		idEcobag integer, 
		idColetor integer,
		valor integer,
		status text
		)`;
	return  database.run(sqlQuery);
},
createTokens : ()=>{
    const  sqlQuery  =  `
	CREATE TABLE IF NOT EXISTS tokens (
		id integer PRIMARY KEY, 
        token text,
        dateExpires integer
		)`;
	return  database.run(sqlQuery);
},
createAll: () =>{
    self.createUsersTable();
    self.createVeiculo();
    self.createMarca();
    self.createProdutos();
    self.createEcoBag();
    self.createEcoBagCliente();
    self.createEcoBagColetor();
    self.createEcoBagProdutos();
    self.createFabricante();
    console.log(self.createTokens());
    
}

};