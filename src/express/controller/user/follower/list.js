const MySQL = require("../../../../config/mysql");

async function List(request, response) {
    
    const _response = { message: "", success: false, data: [], redirect: "" };
    
    try {

        const _userid = (typeof(request.query.userid) !== "undefined") ? request.query.userid : ((typeof(request.session["flashcard.user"]) !== "undefined") ? request.session["flashcard.user"] : null);
        if(typeof(_userid) == "undefined" || _userid == null) {
            _response.redirect = "#login";
            throw "No user found";
        };

        const _connection = new MySQL.Connection();
        await _connection.Connect();

        const _result = await _connection.Query(
            "SELECT " +
                "(SELECT `User`.`Name` FROM `User` WHERE `User`.`ID` = `Follow`.`UserID`) as user_name, " +
                "(SELECT `User`.`ID` FROM `User` WHERE `User`.`ID` = `Follow`.`UserID`) as user_id, " +
                "(SELECT COUNT(*) FROM `Follow` WHERE `FollowingID` = user_id AND `UserID` = ?) as user_following " +
            "FROM `Follow` WHERE `FollowingID` = ?;"
        , [ _userid, _userid ]);

        _result.forEach(x => {
            x["user_following"] = !(x["user_following"] == 0);
            x["user_follow"] = !(x["user_id"] == request.session["flashcard.user"]);
        });

        _response.data = _result;
        _response.success = true;

        _connection.Close();


    }
    catch(ex) {
        _response.message = ex;
    };

    response.send(_response);

}


module.exports = List;