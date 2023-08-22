import Component from "../../library/h12.js";

@Component
class E404 extends Component {

    constructor() {
        super();
    }
    async init() {

    }
    async render() {
        return <>
            <div class="flex flex-col">
                <label class="text-4xl">404</label>
                <label>Page not found</label>
            </div>
        </>;
    }

}

export default E404;