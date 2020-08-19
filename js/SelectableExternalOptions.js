/**
 * This is a plugin to Selectable.js
 * If you are using this you should include Selectable.js first, although this will not work
 * @author Therion86
 */
class SelectableExternalOptions {

    constructor() {
    }

    /**
     * @param {HTMLSelectElement} selectField
     * @public
     * @static
     */
    static loadOptions(selectField) {
        if (! selectField.classList.contains('external')) {
            return true;
        }
        if (! selectField.hasAttribute('data-url')) {
            throw "No data-url was set!";
        }
        let selectableExternalOptions = new this();
        return selectableExternalOptions.fetchData(selectField.getAttribute('data-url'), this._fillOptions, selectField);

    }

    /**
     * @param {string} url
     * @param {function} callback
     * @param {HTMLSelectElement} selectField
     * @public
     */
    fetchData(url, callback, selectField) {
        return new Promise(function(resolve, reject) {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.responseType = "json";
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                    resolve(callback(xmlHttp.response, selectField));
                }
            }
            xmlHttp.open("GET", url, true);
            xmlHttp.send(null);
        });
    }

    /**
     * @param {Object[]} response
     * @param {HTMLSelectElement} selectField
     * @private
     */
    _fillOptions(response, selectField) {
        selectField.innerHTML = '';
        for (let key in response) {
            if (! response.hasOwnProperty(key)) {
                continue;
            }
            let element = response[key];
            if (! element.hasOwnProperty('value') || ! element.hasOwnProperty('label')) {
                throw 'Element has no "value" or "label"!';
            }
            let option = document.createElement('option');
            option.value = element.value;
            option.text = element.label;
            selectField.add(option);
        }
    }

}