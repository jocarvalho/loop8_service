"use strict";
//const tables = require('./tables');
const clientes = require('./src/cliente/cliente');
const produtos = require('./src/produto/produto');
const register = require('./src/register/register');
const ecobags = require('./src/ecobag/ecobag');

const  express  =  require('express');
const  bodyParser  =  require('body-parser');
const cors = require('cors')
//const  sqlite3  =  require('sqlite3').verbose();
const  jwt  =  require('jsonwebtoken');
const  bcrypt  =  require('bcryptjs');
const https = require('https');
const SECRET_KEY = "secretkey23456";

const  app  =  express();
const  router  =  express.Router();
app.use(cors())

router.use(bodyParser.urlencoded({ extended:  false }));
router.use(bodyParser.json());
router.use((req, res, next)=>{
    console.log(`requisicao Original: ${req.originalUrl}`);
    next();
   // getTokens((err,rows)=>{
   //     console.log(rows);
   // });
   /*
   if(req.originalUrl === '/register' || req.originalUrl === '/login'|| req.originalUrl === '/tokens'){

        console.log('URL q NÃO devera checar o token');
        next();
    }
    else{
        let token = req.headers.token;
        console.log(`token: ${token}`)
        getToken(token, (err, row)=>{
            if(err){
                console.log('erro');
                res.status(400).send('token invalido');
            }else if(row){
                console.log('achou o token');
                if(row.dateExpires)
                    next();
                else
                    return res.status(400).send({'erro':'token invalido'}); 
            }else{
                console.log('Não achou o token');
               return res.status(400).send({'erro':'token invalido'});
            }
        });
    }*/
});

//const database = new sqlite3.Database("./my.db");






//tables.createAll();

router.get('/', (req, res) => {
    res.status(200).send('This is an authentication server');
});

router.get('/ecobag/:id', (req, res) => {
    const id = req.params.id;
    ecobags.listarById(id,(err, ecobag)=>{
        res.status(200).send({ecobag:ecobag,id:id});
    });
});
router.get('/ecobag',(req, res)=>{
    console.log(`ecobags`)
    ecobags.listarAll((err, lista)=>{
        if(err)
            res.status(400).send({erro:err});
        res.status(200).send({ecobags:lista});
    });
});
router.post('/ecobag', (req, res) => {
    const insert = req.body;
    insert.data = Date.now();
    ecobags.adicionar(insert,(err, result)=>{
        if(err)
            res.status(400).send({resposta:err});
        res.status(200).send({resposta:result});
    })
});
router.post('/register', (req, res) => {
    register.register(req.body,(err,user)=>{
        if(err)
             res.status(400).send(err); 
         res.status(200).send(user);
    });
    /*
    const  nome  	  =  req.body.nome;
    const  sobrenome  =  req.body.sobrenome;
    const  cpf  	  =  req.body.cpf;
    const  email  	  =  req.body.email;
    const  celular    =  req.body.celular;
    const  logradouro  =  req.body.logradouro;
    const  complemento  =  req.body.complemento;
    const  bairro  =  req.body.bairro;
    const  cidade  =  req.body.cidade;
    const  estado  =  req.body.estado;
    const  cep  =  req.body.cep;
    const  dataNascimento  =  req.body.dataNascimento;
    const  estadoCivil  =  req.body.estadoCivil;
    const  qtddFilho  =  req.body.qtddFilho;
    const  tipoParticipacao  =  req.body.tipoParticipacao;
    const  qtddMoradores  =  req.body.qtddMoradores;
    const  responsavelFinanceiro  =  req.body.responsavelFinanceiro;

    console.log(req.body);
    const  password  =  bcrypt.hashSync(req.body.password);

    createUser([nome,sobrenome,cpf,email,celular,logradouro,complemento,bairro,cidade,estado,cep,dataNascimento,estadoCivil,qtddFilho,tipoParticipacao,qtddMoradores,responsavelFinanceiro,password], (err)=>{
        if(err) return  res.status(500).send("Server error!");
        findUserByEmail(email, (err, user)=>{
            if (err) return  res.status(500).send('Server error!');  
            const  expiresIn  =  1000  *  60  *  60 + Date.now();
            const  accessToken  =  jwt.sign({ id:  user.id }, SECRET_KEY, {
                expiresIn:  expiresIn
            });
            res.status(200).send({ "user":  user, "access_token":  accessToken, "expires_in":  expiresIn          
            });
        });
    });
    */
});


router.post('/login', (req, res) => {
    const  email  =  req.body.email;
    const  password  =  req.body.password;
    register.findUserByEmail(email, (err, user)=>{
        if (err) return  res.status(500).send('Server error!');
        if (!user) return  res.status(404).send('User not found!');
        const  result  =  bcrypt.compareSync(password, user.password);
        if(!result) return  res.status(401).send('Password not valid!');

        const  expiresIn  =  1000  *  60  *  60 + Date.now();
        const  accessToken  =  jwt.sign({ id:  user.id }, SECRET_KEY, {
            expiresIn:  expiresIn
        });
        createToken([accessToken, expiresIn]);

        res.status(200).send({ "user":  user, "access_token":  accessToken, "expires_in":  expiresIn});
    });
});

router.get('/usuarios', (rq,rs)=>{

    clientes.obterClientes("bullshit",(err, users)=>{
        if(err) return res.status(500).send('Server error!');
        rs.status(200).send({ "users":  users});
    })
});
const  createToken  = (token) => {
    database.run('INSERT INTO tokens (token, dateExpires) VALUES (?,?)', token, (err) => {
        if (err) {
            return console.log(err.message);
          }
          // get the last insert id
          console.log(`A row has been inserted with rowid ${this.lastID}`);
    });
}

const getToken = (token, cb) =>{
        return  database.get(`SELECT * FROM tokens where token = ?`, [token], (err, row) => {
            cb(err, row)
    })
}
const getTokens = (cb) =>{
    return  database.all(`SELECT * FROM tokens`, (err, row) => {
        cb(err, row)
})
}
router.get("/tokens",(rq,rs)=>{
    getTokens((err,row)=>{
        if(err) return res.status(500).send('Server error!');
        rs.status(200).send({ "tokens":  row});
    });
})

router.get("/produtos", (rq,rs)=>{
    produtos.obterProdutos((prods)=>{
        
        rs.status(200).send(prods);
    });
})

router.get("/produto/:barcode", (rq,rs)=>{
    let barcode = rq.params.barcode;
    produtos.obterProdutoPorCodigoDeBarras(barcode, (err, row)=>{
        if(err){
            rs.status(400).send(JSON.parse(err));
        }else{
            if(row){
                console.log(`Consulta local do produto:${JSON.stringify(row)}`);
                rs.status(200).send(row);
            }else{
                const options = {
                    hostname: 'api.cosmos.bluesoft.com.br',
                    path: `/gtins/${barcode}`,
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'X-Cosmos-Token' : 'Fyp-WY-oUnLXvsvoqcdPIw'
                    }
                  };
                  
                 console.log(`vai chamar a api!! param[${barcode}]`);
            
                https.get(options, (resp) => {
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    console.log(`final da consulta${data}`);

                    produtos.adicionarProduto(data,(err,produto)=>{
                        if(err)
                            console.log(err);
                        console.log(produto);
                    });
                    rs.status(200).send(JSON.parse(data));
                });
                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                    rs.status(400).send(JSON.parse(err));
                });
            }
        }
    });
});
app.use(router);
const  port  =  process.env.PORT  ||  3000;
const  server  =  app.listen(port, () => {
    console.log('Server listening at http://localhost:'  +  port);
}); 