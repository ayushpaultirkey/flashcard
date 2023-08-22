const MySQL = require("../../../config/mysql");

async function Follow(request, response) {
    
    const _response = { message: "", success: false, data: { following: false }, redirect: "" };
    
    try {

        const _userid = (typeof(request.session["flashcard.user"]) !== "undefined") ? request.session["flashcard.user"] : null;
        if(typeof(_userid) == "undefined" || _userid == null) {
            _response.redirect = "#login";
            throw "No user found";
        };

        const _followid = request.query.userid;
        if(typeof(_followid) == "undefined" || _followid == null || _followid == _userid) {
            throw "No user id is defined";
        };
        
        const _connection = new MySQL.Connection();
        await _connection.Connect();

        const _resultuser = await _connection.Query("SELECT `ID` FROM `User` WHERE `ID` = ?;", [ _followid ]);
        if(_resultuser.length == 0) {
            throw "No user found";
        };

        const _resultfollow = await _connection.Query("INSERT INTO `Follow` (UserID, FollowingID) SELECT * FROM (SELECT ? AS t_userid, ? AS t_followingid) AS tmp WHERE NOT EXISTS ( SELECT UserID, FollowingID FROM `Follow` WHERE UserID = ? AND FollowingID = ? ) LIMIT 1;", [ _userid, _followid, _userid, _followid ]);
        if(_resultfollow.insertId == 0) {

            const _resultdelete = await _connection.Query("DELETE FROM `Follow` WHERE `UserID` = ? AND `FollowingID` = ?;", [ _userid, _followid ]);
            if(_resultdelete.affectedRows == 0) {
                throw "Unable to follow";
            };

            _response.data.following = false;

        }
        else {
            _response.data.following = true;
        };

        _response.success = true;

        _connection.Close();


    }
    catch(ex) {
        _response.message = ex;
    };

    response.send(_response);

}


module.exports = Follow;