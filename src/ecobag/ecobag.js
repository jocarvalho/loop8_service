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
  //db.collection(ECOBAG_COLLECTION).remove({});

});

const ECOBAG_COLLECTION = 'ecobags';

var self = module.exports={
    adicionar:(ecobag, callback)=>{
        db.collection(ECOBAG_COLLECTION).insertOne(ecobag, function (err, doc) {
            callback(err, doc.ops[0]);
          });
    },
    listarById:(id,callback)=>{
        db.collection(ECOBAG_COLLECTION).findOne({id:id}, function(err, result) {
            callback(err, result);
          });
    },
    listarAll:(callback)=>{
        db.collection(ECOBAG_COLLECTION).find({}).toArray(function(err, result) {
            console.log(`ListAll:${err},${JSON.stringify(result)}`)
            callback(err, result);
        })
    }
}