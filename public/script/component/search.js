import Component from "../../library/h12.js";
import Header from "./template/header.js";
import PCard from "./user/pcard.js";

@Component
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
        return <>
            <div class="space-y-5">

                <Header args />

                <div class="flex">
                    <input id="search" class="bg-gray-200 px-3 py-2 w-full text-xs rounded-lg rounded-r-none outline-0 transition-shadow hover:shadow-md" type="text" placeholder="Search People" />
                    <button onclick="{user.search}" class="bg-blue-400 text-xs px-6 py-2 rounded-lg rounded-l-none transition-shadow hover:shadow-md hover:shadow-blue-200"><i class="fa fa-search"></i></button>
                </div>

                {search.list}

            </div>
        </>;
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

            this.Set("{search.list}++", <PCard args={{ id: _user[i].user_id, name: _user[i].user_name, following: _user[i].user_following, follow: _user[i].user_follow }} />)
            
        };

    }
}

export default Search;