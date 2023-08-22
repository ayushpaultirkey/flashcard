const mysql = require("mysql");

const MySQL = {
    
    Host: "localhost",
    Username: "root",
    Password: "",
    Database: "flashcard",

    Connection: class {
        constructor(property = {}) {

            this.host = MySQL.Host;
            this.user = MySQL.Username;
            this.password = MySQL.Password;
            this.database = MySQL.Database;
    
            Object.assign(this, property);
    
            this.connection = mysql.createConnection({ host: this.host, user: this.user, password: this.password, database: this.database });
            this.Observe = { Enabled: false, Index: 1 };
            
        }
        Connect() {
    
            return new Promise((resolve, reject) => {
    
                this.connection.connect((error) => {
            
                    if(error) {
                        reject(`Unable to connect to database${(this.Observe.Enabled) ? `\nError at step: ${this.Observe.Index}\n` : ""}`);
                        return false;
                    };
                    resolve(true);
                    this.Observe.Index++;
            
                });
        
            });
    
        }
        Query(query = "", parameter = []) {
            
            return new Promise((resolve, reject) => {
    
                const _query = this.connection.format(query, parameter);

                this.connection.query(_query, (error, result) => {
            
                    if(error) {
                        reject(`Unable to perform query${(this.Observe.Enabled) ? `\nError at step: ${this.Observe.Index}` : ""}`);
                        return false;
                    };
                    resolve(result);
                    this.Observe.Index++;
            
                });
        
            });

        }
        Close() {
            this.connection.end();
        }
    }

};

module.exports = MySQL;