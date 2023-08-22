import Component from "../../../library/h12.js";

@Component
class Create extends Component {

    constructor() {
        super();
    }
    init() {

        this.Unique();
        this.Set("{post.create}", this.Create);

    }
    render() {
        return <>
            <div class="bg-gray-100 p-3 rounded-lg shadow-md border-2 border-gray-200 border-opacity-50">
                <textarea id="postbox" class="bg-transparent w-full h-20 resize-none text-sm outline-none" placeholder="Write Something"></textarea>
                <button onclick="{post.create}" class="bg-blue-400 text-xs px-6 py-2 rounded-lg transition-shadow hover:shadow-md hover:shadow-blue-200">Create</button>
            </div>
        </>;
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

export default Create;