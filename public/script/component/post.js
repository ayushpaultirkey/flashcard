import Button from "../property/button.js";
import H12 from "./../../library/h12.js";

@Component
class Post extends H12.Component {

    constructor() {
        super();
        this.LikeCount = 0;
        this.Liked = false;
    }
    init() {

        this.Set("{p-like-shadow}", "");
        this.Set("{p-like-border}", "border-gray-200");
        this.Set("{p-like-text}", "text-black");
        this.Set("{p-like}", this.Like);
        this.Set("{p-like-count}", this.LikeCount);

    }
    render() {
        return <>
            <div class="flex flex-col space-y-1 w-full p-4 rounded-md bg-gray-50 {p-like-border} border-2 border-solid shadow-lg {p-like-shadow}">
                <a class="text-xs font-bold" href="#link">@author</a>
                <label class="text-xs">at <b>30-Dec-2023</b></label>
                <div class="w-full flex py-2">
                    <label>Content</label>
                </div>
                <div>
                    <button props={ ... Button.Alternative } onclick="{p-like}">Like - <label class="{p-like-text} font-bold">{p-like-count}</label></button>
                </div>
            </div>
        </>;
    }

    Like() {
        if(this.Liked) {
            this.Set("{p-like-border}", "border-gray-200");
            this.Set("{p-like-text}", "text-black");
            this.Set("{p-like-shadow}", "");
            this.Liked = false;
            this.LikeCount--;
        }
        else {
            this.Set("{p-like-border}", "border-blue-300");
            this.Set("{p-like-text}", "text-blue-500");
            this.Set("{p-like-shadow}", "shadow-blue-100");
            this.Liked = true;
            this.LikeCount++;
        };
        if(this.LikeCount < 0) {
            this.LikeCount = 0;
        };
        this.Set("{p-like-count}", this.LikeCount);
    }

}

export default Post;