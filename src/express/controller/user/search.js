const MySQL = require("../../../config/mysql");

async function Search(request, response) {
    
    const _response = { message: "", success: false, data: [], redirect: "" };
    
    try {

        const _userid = (typeof(request.session["flashcard.user"]) !== "undefined") ? request.session["flashcard.user"] : null;
        if(typeof(_userid) == "undefined" || _userid == null) {
            _response.redirect = "#login";
            throw "No user found";
        };

        const _name = request.query.name;
        if(typeof(_name) == "undefined" || _name == null) {
            throw "No user is defined";
        };
        
        const _connection = new MySQL.Connection();
        await _connection.Connect();

        const _result = await _connection.Query(
            "SELECT "+
            "`ID` AS user_id, " +
            "`Name` as `user_name`, " +
            "(SELECT COUNT(*) FROM `Post` WHERE `Post`.`UserID` = `User`.`ID`) as post_count, " +
            "(SELECT COUNT(*) FROM `Follow` WHERE `Follow`.`UserID` = `User`.`ID`) as following_count, " +
            "(SELECT COUNT(*) FROM `Follow` WHERE `Follow`.`FollowingID` = `User`.`ID`) as follower_count, " +
            "(SELECT COUNT(*) FROM `Follow` WHERE `Follow`.`FollowingID` = `User`.`ID` AND `Follow`.`UserID` = ?) as user_following " +
            "FROM `User` WHERE `Name` LIKE ?;"
        , [ _userid, `%${_name}%` ]);

        _result.forEach(x => {
            x["user_following"] = !(x["user_following"] == 0);
            x["user_follow"] = !(x["user_id"] == _userid);
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


module.exports = Search;