const MySQL = require("../../../config/mysql");

async function Login(request, response) {
    
    const _response = { message: "", success: false, data: [] };
    
    try {

        const _username = request.query.username;
        const _password = request.query.password;

        if(typeof(_username) == "undefined" || typeof(_password) == "undefined" || _username.length < 2 || _password.length < 2) {
            throw "Please enter username and password";
        };

        const _connection = new MySQL.Connection();

        await _connection.Connect();

        const _result = await _connection.Query("SELECT `ID` as user_id FROM `User` WHERE `Username` = ? AND `Password` = ?;", [ _username, _password ]);

        if(_result.length > 0) {
            
            _response.data = _result;
            _response.success = true;

            request.session["flashcard.user"] = _result[0].user_id;
            response.cookie("flashcard.user", _result[0].user_id, { maxAge: 900000, httpOnly: true, signed: true });

        }
        else {
            _response.message = "Wrong username or password";
        };

        _connection.Close();


    }
    catch(ex) {
        _response.message = ex;
    };

    response.send(_response);

}



/*
function Login(request, response) {

    const _response = { message: "", success: false };

    if(typeof request.cookies.flashcard !== "undefined") {

        response.json({ ... _response, message: "User already logined, logout first" });

    }
    else {

        const _user_username = request.query.username;
        const _user_password = request.query.password;

        if(Validate.IsValid([_user_username, _user_password], 2)) {

            const _connection = mysql.createConnection({ host: MySQL.Host, user: MySQL.Username, password: MySQL.Password, database: MySQL.Database });
        
            _connection.connect(function(error) {
    
                if(error) {
                    response.json({ ... _response, message: "Unable to login, internal server error" });
                }
                else {

                    const _query = "SELECT ID FROM `User` WHERE Username = ? AND Password = ?;";
                    const _parameter = [_user_username, _user_password];

                    _connection.query(_query, _parameter, function(error, result) {
                        
                        if(error) {
                            response.json({ ... _response, message: "Unable to login" });
                        }
                        else {
                            
                        };

                    });

                };
            
            });
    
        };

    };

};
*/


module.exports = Login;