const mysql = require('mysql2/promise');
var fs = require('fs');

async function getConexion() {
    return await mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'guatemala',
        database : 'magis'
    })
}

const oracleDbRelease = function(conn) {
    
    /*
    conn.release(function (err) {
      if (err)
        console.log(err.message);
    });
    */
  };
  
  
  function queryArray(sql, bindParams, options) {
      options.isAutoCommit = false; // we only do SELECTs
   
      return new Promise(function(resolve, reject) {
        
        getConexion().then(function(connection){
              //console.log("sql log: " + sql + " params " + bindParams);
              connection.config.namedPlaceholders = true;
              connection.execute(sql, bindParams, options)
              .then(function([results,definicion]) {

                    //var hola = {results: results};
                    //var hola = {results.j};
                    //console.log("s",hola);
                    /*
                    var normalObj = Object.assign({}, results[0]);

                    console.log(normalObj);
                        
                    var normalResults = results.map((mysqlObj, index) => {
                        return Object.assign({}, mysqlObj);
                    });
                    console.log(normalResults);
                    */
                  //console.log("s1"+JSON.stringify(results));
                    /*
                    if(results.ResultSetHeader){
                        console.log("fue update");
                    }
                     */   
                  resolve(results);
                  
                  process.nextTick(function() {
                      oracleDbRelease(connection);
                  });
                  
              })
              
              .catch(function(err) {
                //console.log(err);
                  reject(err);
                   /*
                  process.nextTick(function() {
                      oracleDbRelease(connection);
                          });

                            */

                      });
                      
                    /*
                connection.query({sql: sql, options:options}, (err,results) => {
                    if(err) throw err;
                  
                    //console.log('Data received from Db:');
                    //console.log(rows);
                    var normalObj = Object.assign({}, results[0]);
                    var normalResults = results.map((mysqlObj, index) => {
                        return Object.assign({}, mysqlObj);
                    });
                    console.log(normalResults);
                    
                  });
                  */
              })
              .catch(function(err) {
                  reject(err);
              });
      });
  }
  
  function readCommand(ruta){
    return new Promise((resolve, reject) => {
        fs.readFile(ruta, (error, data) => {
            if(data){
                resolve(data.toString());
            }
            else if(error) {
                reject(error);
            }
            //console.log(data,error);
            
        });
    })
};

async function queryObject(ruta/*sql*/, bindParams, options) {
      options['outFormat'] = mysql.OBJECT; // default is oracledb.ARRAY
        var sql = await readCommand(ruta);
        
      return queryArray(sql, bindParams, options);
  }
  
 // module.exports = queryArray; 


  module.exports = {
    queryArray,
    getConexion
    
}

  module.exports.queryArray = queryArray; 
  module.exports.queryObject = queryObject;