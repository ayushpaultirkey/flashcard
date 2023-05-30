import H12 from "./../../library/h12.js";

@Component
class Footer extends H12.Component {

    constructor() {
        super();
    }
    init() {

    }
    render() {
        return <>
            <div class="w-full p-4 rounded-md bg-gray-50 border-gray-200 border-2 border-solid shadow-lg">
                <label class="text-xs">flashcard.v1</label>
            </div>
        </>;
    }

}

export default Footer;