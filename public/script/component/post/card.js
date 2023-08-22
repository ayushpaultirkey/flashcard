import Component from "../../../library/h12.js";
import Dispatcher from "../../dispatcher.js"

@Component
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
        return <>
            <div class="bg-gray-100 p-3 mt-3 sm:space-y-4 space-y-2 rounded-lg shadow-md border-2 {c-border-color} border-opacity-50 transition-colors">
                <div class="text-sm flex flex-col">
                    <label class="font-semibold" onclick="{user.redirect}">@{t-author}</label>
                    <label class="text-xs font-semibold">at {t-time}</label>
                </div>
                <div>
                    <label class="text-sm">{t-content}</label>
                </div>
                <div class="space-x-2 flex items-center relative">
                    <button onclick="{e-like}" class="fa fa-heart {c-like}"></button>
                    <label class="text-sm">{t-like}</label>
                    <button class="{c-delete} fa fa-trash absolute right-0 text-sm" onclick="{e-delete}"></button>
                </div>
            </div>
        </>;
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

export default Card;