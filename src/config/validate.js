const Validate = {
    IsValid: function(parameter = null, length = 2) {

        let _success = true;

        if(parameter instanceof Array) {

            for(var i = 0, ilen = parameter.length; i < ilen; i++) {
                if(typeof(parameter[i]) == "undefined" || parameter[i] == null || parameter[i].length < length) {
                    _success = false;
                    break;
                };
            };

        }
        else {

            if(typeof(parameter) == "undefined" || parameter == null || parameter.length < length) {
                _success = false;
            };

        };

        return _success;

    }
}

module.exports = Validate;