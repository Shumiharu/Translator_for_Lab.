import mysql from 'mysql'
import * as fs from 'fs' 

const database_txt = fs.readFileSync("/run/secrets/db_settings").toString();
const database = JSON.parse(database_txt);

const db_config = {
  host: database.host,
    user: database.user,
    password: database.password,
    database: database.name
};

export const handleDisconnect = () => {
  const connection = mysql.createConnection(db_config);

  connection.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    } 
  });
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { 
      handleDisconnect();
    } else {
      throw err;
    }
  });
}