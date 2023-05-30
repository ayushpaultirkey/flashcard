import Button from "../../property/button.js";
import Input from "../../property/input.js";
import H12 from "./../../../library/h12.js";

@Component
class Create extends H12.Component {

    constructor() {
        super();
    }
    init() {

        

    }
    render() {
        return <>
            <div class="w-full flex flex-col space-y-1 p-4 border-2 border-solid border-gray-200 bg-gray-50 rounded-md shadow-lg">
                <label class="text-sm">Create Post</label>
                <textarea props={ ...Input.Class } class=" resize-none" rows="5"></textarea>
                <button props={ ... Button.Class }>Create</button>
            </div>
        </>;
    }

}

export default Create;