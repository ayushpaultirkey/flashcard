import Component from "../../library/h12.js";
import Header from "./template/header.js";
import Create from "./post/create.js";
import Card from "./post/card.js";

@Component
class Home extends Component {

    constructor() {
        super();
    }
    async init() {

        this.PostLoad();

    }
    async render() {
        return <>
            <div class="space-y-5">

                <Header args />

                <div class="space-y-3">

                    <Create args />

                    {post.list}

                </div>

            </div>
        </>;
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
            this.Set("{post.list}++", <Card args={{ id: _post[i].post_id, userid: _post[i].user_id, name: _post[i].user_name, time: `${_date[0]} ${_date[1].split(".")[0]}`, like: _post[i].post_like, content: _post[i].post_content, delete: _post[i].post_delete, liked: _post[i].post_liked }} />);

        };

    }

}

export default Home;