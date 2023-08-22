const jsdom = require("jsdom");

const Transpiler = {};

Transpiler.JIT = function(_string = "") {

    //Check if @Component is present
    if(_string.indexOf("@Component") == -1) {
        return _string;
    };

    //Remove @Component from string
    _string = _string.replace("@Component", "");
    
    //Match all dynamic tags
    const _match_tag = _string.matchAll(/<(\w+)\s+args(?:=|)(?:{{(.*?)}}|).*?\/>/gm);
    for(const _key of _match_tag) {

        let _scope = "";
        let _match_scope = _key[0].matchAll(/scope(?:=|)(?:{(.*?)}|)/gm);
        for(const _skey of _match_scope) {
            if(typeof(_skey[1]) !== "undefined" && _skey[1].length > 0) {
                _scope = _skey[1].replace(/"/g, "'");
                break;
            };
        };

        _string = _string.replace(_key[0], `<hx-app name="${_key[1]}" scope="${_scope}" args="{${((typeof(_key[2]) !== "undefined")) ? _key[2].replace(/"/g, "'") : ""}}"></hx-app>`);
        
    };

    //Match all template
    const _match_bracket = _string.matchAll(/<>(.*?)<\/>/gs);
    for(const _key of _match_bracket) {
    
        //Match all property
        const _match_prop = _key[1].matchAll(/{.*?}/gm);
        for(const _pkey of _match_prop) {

            if(_pkey[0].indexOf("...") !== -1) {
                _key[1] = _key[1].replace(_pkey[0], `"${_pkey[0].replace("}", "o-o")}"`);
            };

        };
        _key[1] = _key[1].replace(/o\-o/g, "}");

        //
        let _dom = new jsdom.JSDOM(_key[1]);
        let _transpiled = this.DOMPhrase(_dom.window.document.body.children[0]);
        _string = _string.replace(_key[0], _transpiled);
    
    };

    //Match all dynamic tags
    const _match_dyn = _string.matchAll(/<hx\-app.*?args(?:=|)(?:.{(.*?)}.|)>.*?<\/hx\-app>/gm);
    for(const _key of _match_dyn) {
    
        //let _dom = new jsdom.JSDOM(_key[0]);
        //let _tr = this.DOMPhrase(_dom.window.document.body.children[0]);

        let _dom = new jsdom.JSDOM(_key[0]);
        _string = _string.replace(_key[0], this.DOMPhrase(_dom.window.document.body.children[0]));

        //_string = _string.replace(_key[0], _tr.replace(/await\s+this\.component\(/g, "").replace(")", ""));
        
    };

    //
    return _string;

};



Transpiler.DOMPhrase = function(_element = document.body) {

    const _attribute = _element.getAttributeNames();
    const _children = _element.children;
    const _child = _element.childNodes;

    if(_element.tagName.toLowerCase() === "hx-app") {

        const _name = _element.getAttribute("name");
        const _args = _element.getAttribute("args");
        const _scope = _element.getAttribute("scope").replace(/ /g, "");

        return `await ${_scope.length == 0 ? "this" : _scope}.component(${_name},${_args})`.replace(/,\]/g, "]");
    
    };

    //
    let _attribute_value = "{";

    _attribute.forEach(x => {

        let _value = _element.getAttribute(x);
        
        if(_value.indexOf("...") !== -1) {
            _attribute_value += `"${x}":${_value},`;
        }
        else {
            _attribute_value += `"${x}":"${_value}",`;
        };
        
    });

    _attribute_value += "}";
    _attribute_value = _attribute_value.replace(",}", "}");
    _attribute_value = ((_attribute_value == "{}") ? "" : "," + _attribute_value);

    //
    let _child_code = "";

    //Check all current element child node
    for(var i = 0, ilen = _child.length; i < ilen; i++) {

        //Check if current node is text node
        if(_child[i].nodeType == 3) {

            //Check if the text node is not empty
            let _match = _child[i].nodeValue.match(/\w+/g);
            if(_match !== null) {

                //Remove extra space from string
                let _value = _child[i].nodeValue.replace(/\n|\s\s/g, "");
                let _test = "";

                //If node value is not empty then check for any key and split them into individual nodes
                if(_match.length > 1 || _children.length > 0) {
                    if(_value.indexOf("{") !== -1) {

                        let _split = _value.split(/{.*?}/g);
                        let _key = _value.match(/{.*?}/g);

                        //Iterate for all key
                        for(var j = 0, jlen = _split.length; j < jlen; j++) {
    
                            if(_split[j] !== "" && _split[j] !== " ") {
                                _test += `this.node("span",[\`${_split[j]}\`]),`;
                            };
                            _test += ((typeof(_key[j]) !== "undefined") ? `this.node("span",[\`${_key[j]}\`]),` : "");
    
                        };

                    }
                    else {
                        _test += `this.node("span",[\`${_child[i].nodeValue}\`]),`;
                    };
                }
                else {
                    _test += `[\`${_value}\`]`;
                };

                _child_code += _test;

            };

        }
        else {
            _child_code += this.DOMPhrase(_child[i]) + ",";
        }

    };


    if(_child_code.indexOf(",") !== -1) {
        _child_code = `[${_child_code}]`;
    }
    else {
        if(_child_code == "") {
            _child_code = "[]";
        };
    };
    
    let _code = `this.node("${_element.tagName.toLowerCase()}",${_child_code}${_attribute_value})`;
    
    return _code.replace(/,\]/g, "]").replace(/,,/g, ",");

};

module.exports = Transpiler;