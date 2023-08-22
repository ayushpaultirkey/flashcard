import Component from "../../../library/h12.js";
import Dispatcher from "../../dispatcher.js"

@Component
class Profile extends Component {

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

        this.Load(true);

        this.Set("{post.active}", "font-normal");
        this.Set("{follower.active}", "font-normal");
        this.Set("{following.active}", "font-normal");
        this.Set("{user.follow}", this.Follow);

        this.Set("{tab.post}", () => { this.Tab("post") });
        this.Set("{tab.follower}", () => { this.Tab("follower") });
        this.Set("{tab.following}", () => { this.Tab("following") });
        this.Tab("post");

        Dispatcher.On("OnFollowChange", this.Load.bind(this));
        Dispatcher.On("OnPostChange", this.Load.bind(this));

    }
    async render() {
        return <>
            <div class="space-y-3 p-3 bg-gray-100 shadow-md rounded-lg border-2 border-gray-200 border-opacity-50">
                <div class="flex items-center">
                    <label class="w-full font-semibold">@{user.name}</label>
                    <button onclick="{user.follow}" class="bg-blue-400 text-xs px-6 py-2 rounded-lg transition-shadow hover:shadow-md hover:shadow-blue-400 {follow.visible}">{user.following}</button>
                </div>
                <div class="space-x-3 text-sm">
                    <button onclick="{tab.post}" class="{post.active}">Post<br/>{post.count}</button>
                    <button onclick="{tab.follower}" class="{follower.active}">Follower<br/>{follower.count}</button>
                    <button onclick="{tab.following}" class="{following.active}">Following<br/>{following.count}</button>
                </div>
            </div>
        </>;
    }
    async Load(loadtab = false) {

        const _response = await fetch(`/api/user/get${ (this.userid.length == 0) ? "" : `?userid=${this.userid}` }`);
        const _data = await _response.json();

        if(_data.redirect.length > 0) {
            window.location.hash = _data.redirect;
        };

        this.Set("{user.name}", _data.data.user_name);
        this.Set("{post.count}", _data.data.post_count);
        this.Set("{follower.count}", _data.data.follower_count);
        this.Set("{following.count}", _data.data.following_count);
        this.Set("{follow.visible}", _data.data.can_follow ? "visible" : "invisible");
        this.Set("{user.following}", (_data.data.user_following) ? "Following" : "Follow");


    }
    Tab(tab = "post") {

        if(tab == "post") {
            this.Set("{post.active}", "font-bold");
            this.Set("{follower.active}", "font-normal");
            this.Set("{following.active}", "font-normal");
            this.parent.PostLoad();
        }
        else if(tab == "follower") {
            this.Set("{post.active}", "font-normal");
            this.Set("{follower.active}", "font-bold");
            this.Set("{following.active}", "font-normal");
            this.parent.FollowLoad("follower");
        }
        else {
            this.Set("{post.active}", "font-normal");
            this.Set("{follower.active}", "font-normal");
            this.Set("{following.active}", "font-bold");
            this.parent.FollowLoad("following");
        };

    }
    async Follow() {

        if(this.userid > 0) {
            const _response = await fetch(`/api/user/follow?userid=${this.userid}`);
            const _data = await _response.json();
    
            this.Set("{user.following}", (_data.data.following) ? "Following" : "Follow");
            Dispatcher.Call("OnFollowChange");
        };

    }
}

export default Profile;