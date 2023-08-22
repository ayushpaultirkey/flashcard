const MySQL = require("../../../config/mysql");

async function Signup(request, response) {
    
    const _response = { message: "", success: false, data: [] };
    
    try {

        const _name = request.query.name;
        const _username = request.query.username;
        const _password = request.query.password;

        if(typeof(_name) == "undefined" || typeof(_username) == "undefined" || typeof(_password) == "undefined" || _name.length < 2 || _username.length < 2 || _password.length < 2) {
            throw "Please enter name, username and password";
        };

        const _connection = new MySQL.Connection();

        await _connection.Connect();

        const _result = await _connection.Query("INSERT INTO `User` (Name, Username, Password) SELECT * FROM (SELECT ? AS t_name, ? AS t_username, ? AS t_password) AS tmp WHERE NOT EXISTS ( SELECT Username FROM `User` WHERE Username = ? ) LIMIT 1;", [ _name, _username, _password, _username ]);

        if(_result.insertId == 0) {
        
            _response.message = "Username already exists";

        }
        else {

            _response.data = { user_id: _result.insertId };
            _response.success = true;

            request.session["flashcard.user"] = _result.insertId;
            response.cookie("flashcard.user", _result.insertId, { maxAge: 900000, httpOnly: true, signed: true });
            
        };

        _connection.Close();


    }
    catch(ex) {
        _response.message = ex;
    };

    response.send(_response);

};

module.exports = Signup;