window.$fx = {};

class Component {
    constructor() {
        this.id = crypto.randomUUID();
        this.binding = {};
        this.root = null;
        this.parent = null;
        this.child = {};
        this.element = {};
        this.args = {};
    }
    async render() {
        return this.node("div");
    }
    async pre(element = null, args = {}) {

        this.root = await this.render();
        await this.init(args);
        
        if(element == null) {
            return this.root;
        };

        document.querySelector(element).append(this.root);

    }
    async init(args = {}) {

    }
    /**
        * `bind()` or `fx()`: Used to bind dynamic event to the element before rendering
        * @param event
        * @returns `string`
    */
    bind(event = null) {

        let _id = crypto.randomUUID();
        $fx[_id] = event.bind(this);
        return `$fx['${_id}']();`;

    }
    /**
        * `component()` or `cx()`: Used to render component inside another component
        * @param node `H12.Component`
        * @param args `any`
        * @returns `Element`
    */
    async component(node = null, args = {}) {

        if(node instanceof Object) {

            const _component = new node();
            _component.parent = this;
            _component.args = args;

            this.child[_component.id] = _component;

            return await _component.pre(null, args);

        }

    }
    /**
        * node() or nx(): Used to create element for the component
        * @param {*} type
        * @param {*} child
        * @param {*} attribute
        * @returns 
    */
    node(type = "", child = [], attribute = {}) {

        let _id = "x" + Math.random().toString(36).slice(6);
        let _element = document.createElement(type);
        let _set = [];
        let _bind = false;

        for(var i = 0, ilen = child.length; i < ilen; i++) {

            if(typeof(child[i]) === "string") {

                let _match = child[i].match(/{.*?}/g);

                if(_match !== null) {
                    if(typeof(this.binding[_match[0]]) === "undefined") {
                        this.binding[_match[0]] = { element: [], data: _match[0] };
                    };
                    //type = 0 then innerhtml
                    this.binding[_match[0]].element.push({ id: _id, type: 0, map: child[i] });
                    _bind = true;
                };

            };

            _element.append(child[i]);

        };

        for(const key in attribute) {
            let _value = attribute[key];

            if(typeof(_value) === "function") {
                _value = this.bind(_value);
            }
            else if(typeof(_value) === "object") {

                for(const skey in _value) {
                    
                    let _attribute = ((_element.hasAttribute(skey)) ? _element.getAttribute(skey) : "") + _value[skey].toString();

                    if(_attribute.indexOf("{") !== -1) {
                        _set.push(skey);
                        _bind = true;
                    };

                    _element.setAttribute(skey, _attribute);

                };

                continue;

            }
            else if(typeof(_value) === "string") {

                if(_value.indexOf("{") !== -1) {
                    _set.push(key);
                    _bind = true;
                };

            };

            _element.setAttribute(key, _value);
        };

        let _unique = [...new Set(_set)];

        for(var i = 0, ilen = _unique.length; i < ilen; i++) {

            let _value = _element.getAttribute(_unique[i]);
            let _match = _value.match(/{.*?}/g);

            if(_match !== null) {
                for(var j = 0, jlen = _match.length; j < jlen; j++) {

                    if(typeof(this.binding[_match[j]]) === "undefined") {
                        this.binding[_match[j]] = { element: [], data: _match[i] };
                    };
                    this.binding[_match[j]].element.push({ id: _id, type: _unique[i], map: _value + ((_unique[i] === "class") ? ` ${_id}` : "") });

                };
            };

        };

        if(_bind) {
            _element.classList.add(_id);
        };

        return _element;

    }
    Set(key = "", value = "") {

        let _index = key.indexOf("++");
        key = key.replace("++", "");

        let _bind = this.binding[key];
        if(typeof(_bind) === "undefined") {
            return null;
        };

        if(typeof(value) === "function") {
            value = this.bind(value);
        };

        let _element = _bind.element;
        for(var i = 0, ilen = _element.length; i < ilen; i++) {

            let _map = _element[i].map;
            let _node = (this.root.classList.contains(_element[i].id)) ? this.root : this.root.querySelector(`.${_element[i].id}`);

            //if type == 0 then innerhtml
            //else attribute
            if(_element[i].type == 0) {

                let _position = (_index == 0) ? "afterbegin" : "beforeend";

                if(value instanceof Element) {

                    if(_index !== -1) {
                        _node.insertAdjacentElement(_position, value);
                    }
                    else {
                        _node.childNodes.forEach(x => x.remove());
                        _node.appendChild(value);
                    };

                    value = value.outerHTML;

                }
                else {
                    
                    if(_index !== -1) {
                        _node.insertAdjacentHTML(_position, value);
                    }
                    else {
                        _node.innerHTML = value;
                    };

                };

            }
            else {

                let _match = _map.match(/{.*?}/g);
                if(_match !== null) {
                    for(var j = 0, jlen = _match.length; j < jlen; j++) {

                        if(_match[j] === key) {
                            _map = _map.replace(_match[j], value);
                            continue;
                        };

                        let _sub_bind = this.binding[_match[j]];
                        
                        if(typeof(_sub_bind) === "undefined") {
                            continue;
                        };

                        _map = _map.replace(_match[j], _sub_bind.data);

                    };
                };

                _node.setAttribute(_element[i].type, _map);

            };

        };

        _bind.data = value;

    }
    Get(key = "") {
        return typeof(this.binding[key]) === "undefined" ? null : this.binding[key].data;
    }
    Unique(_unique = "id", _object = this.element) {

        let _element = this.root.querySelectorAll(`[${_unique}]`);
        _element.forEach(x => {
            let _id = "x" + Math.random().toString(36).slice(6);
            _object[x.getAttribute(_unique)] = x;
            x.setAttribute(_unique, _id);
        });

    }
};

Component.Render = async function(component = null, args = null, element = {}) {
    const _component = new component();
    await _component.pre(element, args);
};

export default Component;