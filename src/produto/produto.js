var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var db;

var http = require('https');

mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://loop8user:loop8pass@ds211096.mlab.com:11096/heroku_d74wj3p0", function (err, client) {
  if (err) {
    console.log("Error on conection: " + err);
    process.exit(1);
  }
  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");
  db.collection(PRODUCTS_COLLECTION).remove({});

});
const PRODUCTS_COLLECTION = 'produtos';
var self = module.exports = {
  imageToBase6: (url, callback) => {
    http.get(url, (resp) => {
      resp.setEncoding('base64');
      body = "data:image/png;base64,";
      resp.on('data', (data) => { body += data });
      resp.on('end', () => {
        console.log(`OnEnd:${body.length}`)
        callback(null, body);
      });
    }).on('error', (e) => {
      console.log(`Got error: ${e.message}`);
    });
  },

  obterProdutos: (cb) => {
    db.collection(PRODUCTS_COLLECTION).find().toArray(function (err, doc) {
      if (err) {
        console.log("Falha ao listar produtos")
        cb(err);
      } else {
        cb(doc)
      }
    });
  },
  obterProdutoPorCodigoDeBarras: (id, cb) => {
    console.log(`id:${id}`)
    db.collection(PRODUCTS_COLLECTION)
      .findOne({ gtin: Number(id) },
        function (err, document) {
          cb(err, document);
        }
      );
  },
  adicionarProduto: (produto, callback) => {
    produto = JSON.parse(produto);
    http.get(produto.thumbnail, (resp) => {
      resp.setEncoding('base64');
      body = "data:image/png;base64,";
      resp.on('data', (data) => { body += data });
      resp.on('end', () => {
        console.log(`OnEnd:${body.length}`)
        produto.thumbnail = body;
        db.collection(PRODUCTS_COLLECTION).insertOne(produto, function (err, doc) {
          callback(err, doc.ops[0]);
        });
      });
    }).on('error', (e) => {
      callback(e,null);
    });
    
  },
  handleError: (res, reason, message, code) => {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({ "error": message });
  }

}