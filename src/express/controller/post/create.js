const MySQL = require("../../../config/mysql");
const date = require("date-and-time");

async function Create(request, response) {
    
    const _response = { message: "", success: false, redirect: "" };
    
    try {

        const _userid = (typeof(request.session["flashcard.user"]) !== "undefined") ? request.session["flashcard.user"] : null;

        if(typeof(_userid) == "undefined" || _userid == null) {
            _response.redirect = "#login";
            throw "No user found";
        };

        const _postdate = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
        const _postcontent = request.query.content;
        
        if(typeof(_postcontent) == "undefined" || _postcontent.length < 2) {
            throw "Please post content";
        };

        const _connection = new MySQL.Connection();
        await _connection.Connect();

        await _connection.Query("INSERT INTO `Post` (`UserID`,`Content`,`Date`)VALUES(?,?,?);", [ _userid, _postcontent, _postdate ]);

        _response.success = true;

        _connection.Close();


    }
    catch(ex) {
        _response.message = ex;
    };

    response.send(_response);

}


module.exports = Create;