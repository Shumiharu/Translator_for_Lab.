import mysql from 'mysql'

const db_config = {
  host: 'localhost',
    user: 'root',
    password: 'dzzv8280',
    database: 'okamotolab'
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