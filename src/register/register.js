const  sqlite3  =  require('sqlite3').verbose();
const database = new sqlite3.Database("./my.db");
var self = module.exports={
    register : (data, callback)=>{
    const  nome  	  =  data.nome;
    const  sobrenome  =  data.sobrenome;
    const  cpf  	  =  data.cpf;
    const  email  	  =  data.email;
    const  celular    =  data.celular;
    const  logradouro  =  data.logradouro;
    const  complemento  =  data.complemento;
    const  bairro  =  data.bairro;
    const  cidade  =  data.cidade;
    const  estado  =  data.estado;
    const  cep  =  data.cep;
    const  dataNascimento  =  data.dataNascimento;
    const  estadoCivil  =  data.estadoCivil;
    const  qtddFilho  =  data.qtddFilho;
    const  tipoParticipacao  =  data.tipoParticipacao;
    const  qtddMoradores  =  data.qtddMoradores;
    const  responsavelFinanceiro  =  data.responsavelFinanceiro;

    console.log(data);
    const  password  =  bcrypt.hashSync(data.password);

    createUser([nome,sobrenome,cpf,email,celular,logradouro,complemento,bairro,cidade,estado,cep,dataNascimento,estadoCivil,qtddFilho,tipoParticipacao,qtddMoradores,responsavelFinanceiro,password], (err)=>{
        if(err) callback(err);
        findUserByEmail(email, (err, user)=>{
            if (err) callback(err);  
            const  expiresIn  =  1000  *  60  *  60 + Date.now();
            const  accessToken  =  jwt.sign({ id:  user.id }, SECRET_KEY, {
                expiresIn:  expiresIn
            });
            callback({ "user":  user, "access_token":  accessToken, "expires_in":  expiresIn          
            });
        });
    });
    },
    createUser:(user, cb) => {
        return  database.run('INSERT INTO users (nome,sobrenome,cpf,email,celular,logradouro,complemento,bairro,cidade,estado,cep,dataNascimento,estadoCivil,qtddFilho,tipoParticipacao,qtddMoradores,responsavelFinanceiro,password) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',user, (err) => {
            cb(err)
        });
    },
    findUserByEmail:(email, cb) => {
        return  database.get(`SELECT * FROM users WHERE email = ?`,[email], (err, row) => {
                cb(err, row)
        });
    }
}