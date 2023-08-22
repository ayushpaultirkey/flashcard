const MySQL = require("../../../config/mysql");

async function Get(request, response) {
    
    const _response = { message: "", success: false, data: [], redirect: "" };
    
    try {

        const _userid = (typeof(request.query.userid) !== "undefined") ? request.query.userid : ((typeof(request.signedCookies["flashcard.user"]) !== "undefined") ? request.signedCookies["flashcard.user"] : null);

        if(typeof(_userid) == "undefined" || _userid == null) {
            _response.redirect = "#login";
            throw "No user found";
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
            "FROM `User` WHERE `ID` = ?;"
        , [ request.signedCookies["flashcard.user"], _userid ]);

        if(_result.length > 0) {

            _response.data = _result[0];
            _response.data.user_following = !(_response.data["user_following"] == 0);
            _response.data.can_follow = typeof(request.query.userid) !== "undefined" && request.signedCookies["flashcard.user"] !== request.query.userid;

            _response.success = true;

            if(typeof(request.query.userid) === "undefined") {
                request.session["flashcard.user"] = _result[0].user_id;
            };

        }
        else {
            _response.redirect = "#login";
            _response.message = "No user found";
        };

        _connection.Close();


    }
    catch(ex) {
        _response.message = ex;
    };

    response.send(_response);

}


module.exports = Get;