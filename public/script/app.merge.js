window.$fx = {};


class Component {
    constructor() {
        this.id = crypto.randomUUID();
        this.binding = {};
        this.root = null;
        this.parent = null;
        this.child = {};
        this.element = {};
        this.args = {};
    }
    async render() {
        return this.node("div");
    }
    async pre(element = null, args = {}) {

        this.root = await this.render();
        await this.init(args);
        
        if(element == null) {
            return this.root;
        };

        document.querySelector(element).append(this.root);

    }
    async init(args = {}) {

    }
    /**
        * `bind()` or `fx()`: Used to bind dynamic event to the element before rendering
        * @param event
        * @returns `string`
    */
    bind(event = null) {

        let _id = crypto.randomUUID();
        $fx[_id] = event.bind(this);
        return `$fx['${_id}']();`;

    }
    /**
        * `component()` or `cx()`: Used to render component inside another component
        * @param node `H12.Component`
        * @param args `any`
        * @returns `Element`
    */
    async component(node = null, args = {}) {

        if(node instanceof Object) {

            const _component = new node();
            _component.parent = this;
            _component.args = args;

            this.child[_component.id] = _component;

            return await _component.pre(null, args);

        }

    }
    /**
        * node() or nx(): Used to create element for the component
        * @param {*} type
        * @param {*} child
        * @param {*} attribute
        * @returns 
    */
    node(type = "", child = [], attribute = {}) {

        let _id = "x" + Math.random().toString(36).slice(6);
        let _element = document.createElement(type);
        let _set = [];
        let _bind = false;

        for(var i = 0, ilen = child.length; i < ilen; i++) {

            if(typeof(child[i]) === "string") {

                let _match = child[i].match(/{.*?}/g);

                if(_match !== null) {
                    if(typeof(this.binding[_match[0]]) === "undefined") {
                        this.binding[_match[0]] = { element: [], data: _match[0] };
                    };
                    //type = 0 then innerhtml
                    this.binding[_match[0]].element.push({ id: _id, type: 0, map: child[i] });
                    _bind = true;
                };

            };

            _element.append(child[i]);

        };

        for(const key in attribute) {
            let _value = attribute[key];

            if(typeof(_value) === "function") {
                _value = this.bind(_value);
            }
            else if(typeof(_value) === "object") {

                for(const skey in _value) {
                    
                    let _attribute = ((_element.hasAttribute(skey)) ? _element.getAttribute(skey) : "") + _value[skey].toString();

                    if(_attribute.indexOf("{") !== -1) {
                        _set.push(skey);
                        _bind = true;
                    };

                    _element.setAttribute(skey, _attribute);

                };

                continue;

            }
            else if(typeof(_value) === "string") {

                if(_value.indexOf("{") !== -1) {
                    _set.push(key);
                    _bind = true;
                };

            };

            _element.setAttribute(key, _value);
        };

        let _unique = [...new Set(_set)];

        for(var i = 0, ilen = _unique.length; i < ilen; i++) {

            let _value = _element.getAttribute(_unique[i]);
            let _match = _value.match(/{.*?}/g);

            if(_match !== null) {
                for(var j = 0, jlen = _match.length; j < jlen; j++) {

                    if(typeof(this.binding[_match[j]]) === "undefined") {
                        this.binding[_match[j]] = { element: [], data: _match[i] };
                    };
                    this.binding[_match[j]].element.push({ id: _id, type: _unique[i], map: _value + ((_unique[i] === "class") ? ` ${_id}` : "") });

                };
            };

        };

        if(_bind) {
            _element.classList.add(_id);
        };

        return _element;

    }
    Set(key = "", value = "") {

        let _index = key.indexOf("++");
        key = key.replace("++", "");

        let _bind = this.binding[key];
        if(typeof(_bind) === "undefined") {
            return null;
        };

        if(typeof(value) === "function") {
            value = this.bind(value);
        };

        let _element = _bind.element;
        for(var i = 0, ilen = _element.length; i < ilen; i++) {

            let _map = _element[i].map;
            let _node = (this.root.classList.contains(_element[i].id)) ? this.root : this.root.querySelector(`.${_element[i].id}`);

            //if type == 0 then innerhtml
            //else attribute
            if(_element[i].type == 0) {

                let _position = (_index == 0) ? "afterbegin" : "beforeend";

                if(value instanceof Element) {

                    if(_index !== -1) {
                        _node.insertAdjacentElement(_position, value);
                    }
                    else {
                        _node.childNodes.forEach(x => x.remove());
                        _node.appendChild(value);
                    };

                    value = value.outerHTML;

                }
                else {
                    
                    if(_index !== -1) {
                        _node.insertAdjacentHTML(_position, value);
                    }
                    else {
                        _node.innerHTML = value;
                    };

                };

            }
            else {

                let _match = _map.match(/{.*?}/g);
                if(_match !== null) {
                    for(var j = 0, jlen = _match.length; j < jlen; j++) {

                        if(_match[j] === key) {
                            _map = _map.replace(_match[j], value);
                            continue;
                        };

                        let _sub_bind = this.binding[_match[j]];
                        
                        if(typeof(_sub_bind) === "undefined") {
                            continue;
                        };

                        _map = _map.replace(_match[j], _sub_bind.data);

                    };
                };

                _node.setAttribute(_element[i].type, _map);

            };

        };

        _bind.data = value;

    }
    Get(key = "") {
        return typeof(this.binding[key]) === "undefined" ? null : this.binding[key].data;
    }
    Unique(_unique = "id", _object = this.element) {

        let _element = this.root.querySelectorAll(`[${_unique}]`);
        _element.forEach(x => {
            let _id = "x" + Math.random().toString(36).slice(6);
            _object[x.getAttribute(_unique)] = x;
            x.setAttribute(_unique, _id);
        });

    }
};


Component.Render = async function(component = null, args = null, element = {}) {
    const _component = new component();
    await _component.pre(element, args);
};

const Dispatcher = {};

Dispatcher.Target = new EventTarget();
Dispatcher.On = function(name = "", callback = null) {

    if(name.length > 0 && callback !== null) {

        Dispatcher.Target.addEventListener(name, (event) => { callback(event, event.detail) }, true);

    };

};
Dispatcher.Call = function(name = "", argument = null) {
    
    if(name.length > 0) {

        Dispatcher.Target.dispatchEvent(new CustomEvent(name, { detail: argument }));

    };

};


class E404 extends Component {

    constructor() {
        super();
    }
    async init() {

    }
    async render() {
        return this.node("div",[this.node("label",[`404`],{"class":"text-4xl"}),this.node("label",[this.node("span",[`Page not found`])])],{"class":"flex flex-col"});
    }

}


class Login extends Component {

    constructor() {
        super();
    }
    async init() {

        const _response = await fetch("/api/user/get");
        const _data = await _response.json();

        if(_data.success) {
            window.location.hash = "#home";
        };

        this.Unique();
        this.Set("{e.login}", this.Login);

        this.Set("{error.visible}", "hidden");
        this.Set("{error.message}", "");

    }
    render() {
        return this.node("div",[this.node("div",[this.node("label",[this.node("span",[`flashcard.`]),this.node("label",[this.node("span",[`v0.1`])],{"class":"text-xs"})],{"class":"text-lg font-bold text-gray-700"}),this.node("label",[`Login`],{"class":"text-sm font-bold text-gray-700"}),this.node("label",[this.node("span",[`{error.message}`])],{"class":"text-xs font-bold text-red-500 {error.visible}"}),this.node("input",[],{"id":"username","class":"bg-gray-200 px-3 py-2 text-xs rounded-lg outline-0 transition-shadow hover:shadow-md","type":"text","placeholder":"Username"}),this.node("input",[],{"id":"password","class":"bg-gray-200 px-3 py-2 text-xs rounded-lg outline-0 transition-shadow hover:shadow-md","type":"password","placeholder":"Password"}),this.node("div",[this.node("button",[`Login`],{"onclick":"{e.login}","class":"bg-blue-400 text-xs px-6 py-2 w-24 rounded-lg transition-shadow hover:shadow-md hover:shadow-blue-200"})]),this.node("label",[this.node("span",[`Don't have an account`]),this.node("br",[]),this.node("span",[`Signup`])],{"class":"text-sm"}),this.node("div",[this.node("button",[`Signup`],{"onclick":"window.location.hash = '#signup';","class":"bg-gray-200 text-xs px-6 py-2 w-24 rounded-lg transition-shadow hover:shadow-md"})])],{"class":"w-full flex flex-col space-y-3"})],{"class":"h-full flex items-center"});
    }
    async Login() {
        
        this.Set("{error.visible}", "hidden");
        this.Set("{error.message}", "");

        const _username = this.element.username;
        const _password = this.element.password;

        try {

            if(_username.value.length < 2 || _password.value.length < 2) {
                throw "Enter username and password";
            };

            const _response = await fetch(`/api/login?username=${_username.value}&password=${_password.value}`);
            const _data = await _response.json();

            if(!_data.success) {
                throw _data.message;
            };
            
            window.location.hash = '#home';

        }
        catch(ex) {
            this.Set("{error.visible}", "visible");
            this.Set("{error.message}", ex);
        };

    }
}
class Signup extends Component {

    constructor() {
        super();
    }
    async init() {

        this.Unique();
        this.Set("{button.signup}", this.Signup);

        this.Set("{error.visible}", "hidden");
        this.Set("{error.message}", "");

    }
    render() {
        return this.node("div",[this.node("div",[this.node("label",[this.node("span",[`flashcard.`]),this.node("label",[this.node("span",[`v0.1`])],{"class":"text-xs"})],{"class":"text-lg font-bold text-gray-700"}),this.node("label",[`Signup`],{"class":"text-sm font-bold text-gray-700"}),this.node("label",[this.node("span",[`{error.message}`])],{"class":"text-xs font-bold text-red-500 {error.visible}"}),this.node("input",[],{"id":"name","class":"bg-gray-200 px-3 py-2 text-xs rounded-lg outline-0 transition-shadow hover:shadow-md","type":"text","placeholder":"Name"}),this.node("input",[],{"id":"username","class":"bg-gray-200 px-3 py-2 text-xs rounded-lg outline-0 transition-shadow hover:shadow-md","type":"text","placeholder":"Username"}),this.node("input",[],{"id":"password","class":"bg-gray-200 px-3 py-2 text-xs rounded-lg outline-0 transition-shadow hover:shadow-md","type":"password","placeholder":"Password"}),this.node("div",[this.node("button",[`Signup`],{"onclick":"{button.signup}","class":"bg-blue-400 text-xs px-6 py-2 w-24 rounded-lg transition-shadow hover:shadow-md hover:shadow-blue-200"})]),this.node("label",[this.node("span",[`Already have an account`]),this.node("br",[]),this.node("span",[`Login`])],{"class":"text-sm"}),this.node("div",[this.node("button",[`Login`],{"onclick":"window.location.hash = '#login';","class":"bg-gray-200 text-xs px-6 py-2 w-24 rounded-lg transition-shadow hover:shadow-md"})])],{"class":"w-full flex flex-col space-y-3"})],{"class":"h-full flex items-center"});
    }
    async Signup() {
        
        this.Set("{error.visible}", "hidden");
        this.Set("{error.message}", "");

        const _name = this.element.name;
        const _username = this.element.username;
        const _password = this.element.password;

        try {

            if(_name.value.length < 2 || _username.value.length < 2 || _password.value.length < 2) {
                throw "Enter name, username and password";
            };

            const _response = await fetch(`/api/signup?name=${_name.value}&username=${_username.value}&password=${_password.value}`);
            const _data = await _response.json();

            if(!_data.success) {
                throw _data.message;
            };

            window.location.hash = '#home';

        }
        catch(ex) {
            this.Set("{error.visible}", "visible");
            this.Set("{error.message}", ex);
        };

    }
}


class Header extends Component {

    constructor() {
        super();
    }
    async init(args = {}) {
        
        this.Set("{c-hidden}", "hidden");
        this.Set("{e-hidden}", this.Menu);
        this.Set("{user.logout}", this.Logout);

    }
    render() {
        return this.node("div",[this.node("div",[this.node("a",[`flashcard`],{"class":"sm:text-xl","href":"#home"}),this.node("span",[],{"class":"w-full"}),this.node("button",[],{"onclick":"{e-hidden}","class":"fa fa-bars text-xl transition-colors hover:text-blue-500"})],{"class":"flex items-center"}),this.node("div",[this.node("a",[`Home`],{"href":"#home"}),this.node("a",[`Search`],{"href":"#search"}),this.node("a",[`Profile`],{"href":"#user"}),this.node("label",[`Logout`],{"onclick":"{user.logout}"})],{"class":"flex flex-col text-sm space-y-2 my-3 font-semibold underline {c-hidden}"})]);
    }
    Menu() {

        this.Set("{c-hidden}", (this.Get("{c-hidden}") == "hidden") ? "visible" : "hidden");

    }
    async Logout() {

        const _response = await fetch("/api/logout");
        const _data = await _response.json();

        if(_data.redirect.length > 0) {
            window.location.hash = _data.redirect;
        };

    }
}


class Create extends Component {

    constructor() {
        super();
    }
    init() {

        this.Unique();
        this.Set("{post.create}", this.Create);

    }
    render() {
        return this.node("div",[this.node("textarea",[],{"id":"postbox","class":"bg-transparent w-full h-20 resize-none text-sm outline-none","placeholder":"Write Something"}),this.node("button",[`Create`],{"onclick":"{post.create}","class":"bg-blue-400 text-xs px-6 py-2 rounded-lg transition-shadow hover:shadow-md hover:shadow-blue-200"})],{"class":"bg-gray-100 p-3 rounded-lg shadow-md border-2 border-gray-200 border-opacity-50"});
    }
    async Create() {

        const _postbox = this.element.postbox;
        if(_postbox !== null || _postbox.value.length > 0) {
            const _response = await fetch(`/api/post/create?content=${_postbox.value}`);
            const _data = await _response.json();

            if(_data.success) {
                this.parent.PostLoad();
            }
            else {
                alert("Unable to post");
            }

        }
        
    }
}
class Card extends Component {

    constructor() {
        super();
        this.Liked = false;
    }
    async init(args = {}) {

        this.Liked = args.liked;

        this.Set("{t-content}", args.content);
        this.Set("{t-author}", args.name);
        this.Set("{t-time}", args.time);
        this.Set("{t-like}", args.like);
        
        this.Set("{e-like}", this.Like);
        this.Set("{e-delete}", this.Delete);
        this.Set("{user.redirect}", this.Redirect);

        this.Set("{c-like}", (this.Liked) ? "text-blue-400" : "text-black");
        this.Set("{c-border-color}", (this.Liked) ? "border-blue-400" : "border-gray-200");
        this.Set("{c-delete}", (args.delete) ? "visible" : "invisible");

    }
    render() {
        return this.node("div",[this.node("div",[this.node("label",[this.node("span",[`@`]),this.node("span",[`{t-author}`])],{"class":"font-semibold","onclick":"{user.redirect}"}),this.node("label",[this.node("span",[`at `]),this.node("span",[`{t-time}`])],{"class":"text-xs font-semibold"})],{"class":"text-sm flex flex-col"}),this.node("div",[this.node("label",[this.node("span",[`{t-content}`])],{"class":"text-sm"})]),this.node("div",[this.node("button",[],{"onclick":"{e-like}","class":"fa fa-heart {c-like}"}),this.node("label",[this.node("span",[`{t-like}`])],{"class":"text-sm"}),this.node("button",[],{"class":"{c-delete} fa fa-trash absolute right-0 text-sm","onclick":"{e-delete}"})],{"class":"space-x-2 flex items-center relative"})],{"class":"bg-gray-100 p-3 mt-3 sm:space-y-4 space-y-2 rounded-lg shadow-md border-2 {c-border-color} border-opacity-50 transition-colors"});
    }
    
    Redirect() {
        window.location.hash = `#user?id=${this.args.userid}`;
    }

    async Like() {

        const _response = await fetch(`/api/post/like?postid=${this.args.id}`);
        const _data = await _response.json();

        let _like = parseInt(this.Get("{t-like}"));

        if(!_data.data.liked) {
            this.Set("{t-like}", ((_like - 1) < 0) ? 0 : _like - 1);
        }
        else {
            this.Set("{t-like}", _like + 1);
        };

        this.Set("{c-like}", (_data.data.liked) ? "text-blue-400" : "text-black");
        this.Set("{c-border-color}", (_data.data.liked) ? "border-blue-400" : "border-gray-200");

    }

    async Delete() {

        const _response = await fetch(`/api/post/delete?postid=${this.args.id}`);
        const _data = await _response.json();

        if(_data.success) {
            this.parent.PostLoad();
        }
        else {
            alert(_data.message);
        };

        Dispatcher.Call("OnPostChange");

    }

}


class PCard extends Component {

    constructor() {
        super();
    }
    async init(args = {}) {

        this.Set("{user.name}", args.name);
        this.Set("{user.following}", (args.following) ? "Following" : "Follow");
        this.Set("{follow.visible}", (args.follow) ? "visible" : "invisible");

        this.Set("{user.follow}", this.Follow);
        this.Set("{user.redirect}", this.Redirect);

    }
    async render() {
        return this.node("div",[this.node("div",[this.node("label",[this.node("span",[`@`]),this.node("span",[`{user.name}`])],{"class":"w-full font-semibold","onclick":"{user.redirect}"}),this.node("button",[this.node("span",[`{user.following}`])],{"onclick":"{user.follow}","class":"bg-blue-400 text-xs px-6 py-2 rounded-lg transition-shadow hover:shadow-md hover:shadow-blue-400 {follow.visible}"})],{"class":"flex items-center"})],{"class":"space-y-3 p-3 mt-3 bg-gray-100 shadow-md rounded-lg border-2 border-gray-200 border-opacity-50"});
    }
    async Follow() {

        const _response = await fetch(`/api/user/follow?userid=${this.args.id}`);
        const _data = await _response.json();

        this.Set("{user.following}", (_data.data.following) ? "Following" : "Follow");
        Dispatcher.Call("OnFollowChange");

    }
    Redirect() {
        window.location.hash = `#user?id=${this.args.id}`;
    }
}
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
        return this.node("div",[this.node("div",[this.node("label",[this.node("span",[`@`]),this.node("span",[`{user.name}`])],{"class":"w-full font-semibold"}),this.node("button",[this.node("span",[`{user.following}`])],{"onclick":"{user.follow}","class":"bg-blue-400 text-xs px-6 py-2 rounded-lg transition-shadow hover:shadow-md hover:shadow-blue-400 {follow.visible}"})],{"class":"flex items-center"}),this.node("div",[this.node("button",[this.node("span",[`Post`]),this.node("br",[]),this.node("span",[`{post.count}`])],{"onclick":"{tab.post}","class":"{post.active}"}),this.node("button",[this.node("span",[`Follower`]),this.node("br",[]),this.node("span",[`{follower.count}`])],{"onclick":"{tab.follower}","class":"{follower.active}"}),this.node("button",[this.node("span",[`Following`]),this.node("br",[]),this.node("span",[`{following.count}`])],{"onclick":"{tab.following}","class":"{following.active}"})],{"class":"space-x-3 text-sm"})],{"class":"space-y-3 p-3 bg-gray-100 shadow-md rounded-lg border-2 border-gray-200 border-opacity-50"});
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




class Home extends Component {

    constructor() {
        super();
    }
    async init() {

        this.PostLoad();

    }
    async render() {
        return this.node("div",[await this.component(Header,{}),this.node("div",[await this.component(Create,{}),this.node("span",[`{post.list}`])],{"class":"space-y-3"})],{"class":"space-y-5"});
    }

    async PostLoad() {

        const _response = await fetch("/api/post/list");
        const _data = await _response.json();

        if(_data.redirect.length > 0) {
            window.location.hash = _data.redirect;
        };

        this.Set("{post.list}", "");

        const _post = _data.data;
        for(var i = 0, ilen = _post.length; i < ilen; i++) {

            let _date = _post[i].post_date.split("T");
            this.Set("{post.list}++", await this.component(Card,{ id: _post[i].post_id, userid: _post[i].user_id, name: _post[i].user_name, time: `${_date[0]} ${_date[1].split('.')[0]}`, like: _post[i].post_like, content: _post[i].post_content, delete: _post[i].post_delete, liked: _post[i].post_liked }));

        };

    }

}
class Search extends Component {

    constructor() {
        super();
    }
    async init() {

        this.Unique();
        this.Load();

        this.Set("{user.search}", this.Load);

    }
    async render() {
        return this.node("div",[await this.component(Header,{}),this.node("div",[this.node("input",[],{"id":"search","class":"bg-gray-200 px-3 py-2 w-full text-xs rounded-lg rounded-r-none outline-0 transition-shadow hover:shadow-md","type":"text","placeholder":"Search People"}),this.node("button",[this.node("i",[],{"class":"fa fa-search"})],{"onclick":"{user.search}","class":"bg-blue-400 text-xs px-6 py-2 rounded-lg rounded-l-none transition-shadow hover:shadow-md hover:shadow-blue-200"})],{"class":"flex"}),this.node("span",[`{search.list}`])],{"class":"space-y-5"});
    }
    async Load() {
        
        const _response = await fetch(`/api/user/search?name=${this.element.search.value}`);
        const _data = await _response.json();

        if(_data.redirect.length > 0) {
            window.location.hash = _data.redirect;
        };

        this.Set("{search.list}", "");

        const _user = _data.data;
        for(var i = 0, ilen = _user.length; i < ilen; i++) {

            this.Set("{search.list}++", await this.component(PCard,{ id: _user[i].user_id, name: _user[i].user_name, following: _user[i].user_following, follow: _user[i].user_follow }))
            
        };

    }
}
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
        return this.node("div",[await this.component(Header,{}),await this.component(Profile,{}),this.node("span",[`{content.list}`])],{"class":"space-y-5"});
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
            this.Set("{content.list}++", await this.component(Card,{ id: _post[i].post_id, userid: _post[i].user_id, name: _post[i].user_name, time: `${_date[0]} ${_date[1].split('.')[0]}`, like: _post[i].post_like, content: _post[i].post_content, delete: _post[i].post_delete, liked: _post[i].post_liked }));

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

            this.Set("{content.list}++", await this.component(PCard,{ id: _user[i].user_id, name: _user[i].user_name, following: _user[i].user_following, follow: _user[i].user_follow }))
            
        };

    }

}

class Router {
    constructor(property = {}) {
        this.route = {};
        this.component = null;
        this.key = "";
        this.default = "";
        Object.assign(this, property);
    }
    Add(url = "", component = null) {
        this.list[url] = component;
    }
    Find(hash = "") {

        const _route = this.route[hash.toLowerCase()];

        return (typeof(_route) !== "undefined") ? _route : E404;

    }
    async Set() {
        
        const _url = window.location.hash;
        const _matchurl = _url.match(/\#\w+/g);

        if(_url.length == 0) {
            window.location.hash = this.default;
        }

        if(_matchurl !== null) {

            const _route = this.Find(_matchurl[0]);
            const _component = new _route();
    
            //triggerAnime(".map");
    
            this.component.Set(this.key, await _component.pre());

        };
        
        
    }
    Observe() {

        window.onhashchange = () => {
            this.Set();
        };

    }
}
Router.Hash = function(hash = "") {
    window.location.hash = hash;
}
class App extends Component {

    constructor() {
        super();
    }
    async init() {
        
        const router = new Router({
            component: this,
            key: "{app}",
            route: {
                "#login": Login,
                "#signup": Signup,
                "#home": Home,
                "#user": User,
                "#search": Search
            },
            default: "#login"
        });
        router.Set();
        router.Observe();

    }
    async render() {
        return this.node("div",[`{app}`],{"class":"w-full h-full overflow-auto p-6 scroll"});
    }

}

Component.Render(App, {}, ".app");