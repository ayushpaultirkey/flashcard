const MySQL = require("../../../config/mysql");

async function Delete(request, response) {
    
    const _response = { message: "", success: false, redirect: "" };
    
    try {
        
        const _userid = (typeof(request.session["flashcard.user"]) !== "undefined") ? request.session["flashcard.user"] : null;
        if(typeof(_userid) == "undefined" || _userid == null) {
            _response.redirect = "#login";
            throw "No user found";
        };

        const _postid = request.query.postid;
        if(typeof(_postid) == "undefined") {
            throw "Post ID not defined";
        };

        const _connection = new MySQL.Connection();
        await _connection.Connect();

        const _deletepost = await _connection.Query("DELETE FROM `Post` WHERE `ID` = ? AND `UserID` = ?;", [ _postid, _userid ]);
        
        if(_deletepost.affectedRows == 0) {
            throw "Unable to delete post";
        };

        await _connection.Query("DELETE FROM `Like` WHERE `PostID` = ?;", [ _postid ]);

        _response.success = true;

        _connection.Close();


    }
    catch(ex) {
        _response.message = ex;
    };

    response.send(_response);

}


module.exports = Delete;