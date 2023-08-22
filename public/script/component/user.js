import Component from "../../library/h12.js";
import Card from "./post/card.js";
import Header from "./template/header.js";
import Profile from "./user/profile.js";
import PCard from "./user/pcard.js";

@Component
class User extends Component {

    constructor() {
        super();
        this.userid = "";
    }
    async init() {

        const _url = window.location.hash;
        const _matchurl = _url.match(/\?id=[0-9]*/g);
        if(_matchurl !== null) {
            this.userid = _matchurl[0].split("=")[1];
        };

        this.PostLoad();

    }
    async render() {
        return <>
            <div class="space-y-5">

                <Header args />
                <Profile args />

                {content.list}

            </div>
        </>;
    }

    async PostLoad() {

        const _response = await fetch(`/api/post/list${ (this.userid.length == 0) ? "?self" : `?userid=${this.userid}` }`);
        const _data = await _response.json();

        if(_data.redirect.length > 0) {
            window.location.hash = _data.redirect;
        };

        this.Set("{content.list}", "");

        const _post = _data.data;
        for(var i = 0, ilen = _post.length; i < ilen; i++) {

            let _date = _post[i].post_date.split("T");
            this.Set("{content.list}++", <Card args={{ id: _post[i].post_id, userid: _post[i].user_id, name: _post[i].user_name, time: `${_date[0]} ${_date[1].split(".")[0]}`, like: _post[i].post_like, content: _post[i].post_content, delete: _post[i].post_delete, liked: _post[i].post_liked }} />);

        };

    }

    async FollowLoad(follow = "follower") {

        const _response = await fetch(`/api/user/${follow}/list${ (this.userid.length == 0) ? "" : `?userid=${this.userid}` }`);
        const _data = await _response.json();

        if(_data.redirect.length > 0) {
            window.location.hash = _data.redirect;
        };

        this.Set("{content.list}", "");

        const _user = _data.data;
        for(var i = 0, ilen = _user.length; i < ilen; i++) {

            this.Set("{content.list}++", <PCard args={{ id: _user[i].user_id, name: _user[i].user_name, following: _user[i].user_following, follow: _user[i].user_follow }} />)
            
        };

    }

}

export default User;