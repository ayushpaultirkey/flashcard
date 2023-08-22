const MySQL = require("../../../config/mysql");
const date = require("date-and-time");

async function Like(request, response) {
    
    const _response = { message: "", success: false, data: { liked: false }, redirect: "" };
    
    try {
        
        const _userid = (typeof(request.session["flashcard.user"]) !== "undefined") ? request.session["flashcard.user"] : null;
        if(typeof(_userid) == "undefined" || _userid == null) {
            _response.redirect = "#login";
            throw "No user found";
        };

        const _likedate = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
        const _postid = request.query.postid;
        if(typeof(_postid) == "undefined" || _postid == null) {
            throw "Post ID not defined";
        };

        const _connection = new MySQL.Connection();
        await _connection.Connect();

        const _result = await _connection.Query("SELECT `ID` FROM `Post` WHERE `ID` = ?;", [ _postid ]);
        //const _result = await _connection.Query("INSERT INTO `Like` (UserID, PostID, Date) SELECT * FROM (SELECT ? AS t_userid, ? AS t_postid, ? AS t_likedate) AS tmp WHERE NOT EXISTS ( SELECT UserID, PostID FROM `Like` WHERE UserID = ? AND PostID = ? ) LIMIT 1;", [ _userid, _postid, _likedate, _userid, _postid ]);
        
        if(_result.length == 0) {
            throw "No post found";
        };

        const _querylike = await _connection.Query("INSERT INTO `Like` (UserID, PostID, Date) SELECT * FROM (SELECT ? AS t_userid, ? AS t_postid, ? AS t_likedate) AS tmp WHERE NOT EXISTS ( SELECT UserID, PostID FROM `Like` WHERE UserID = ? AND PostID = ? ) LIMIT 1;", [ _userid, _postid, _likedate, _userid, _postid ]);
        
        if(_querylike.insertId == 0) {
            
            const _querydelete = await _connection.Query("DELETE FROM `Like` WHERE `UserID` = ? AND `PostID` = ?;", [ _userid, _postid ]);
            
            if(_querydelete.affectedRows == 0) {
                throw "Unable to like post";
            };

            _response.data.liked = false;

        }
        else {
            _response.data.liked = true;
        };

        _response.success = true;

        _connection.Close();


    }
    catch(ex) {
        _response.message = ex;
    };

    response.send(_response);

}


module.exports = Like;