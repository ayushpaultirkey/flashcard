import Component from "../../../library/h12.js";
import Dispatcher from "../../dispatcher.js"

@Component
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
        return <>
            <div class="space-y-3 p-3 mt-3 bg-gray-100 shadow-md rounded-lg border-2 border-gray-200 border-opacity-50">
                <div class="flex items-center">
                    <label class="w-full font-semibold" onclick="{user.redirect}">@{user.name}</label>
                    <button onclick="{user.follow}" class="bg-blue-400 text-xs px-6 py-2 rounded-lg transition-shadow hover:shadow-md hover:shadow-blue-400 {follow.visible}">{user.following}</button>
                </div>
            </div>
        </>;
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

export default PCard;