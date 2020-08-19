/**
 * This is a plugin to Selectable.js
 * If you are using this you should include Selectable.js first, although this will not work
 * @author Therion86
 */
class SelectableExternalOptions {

    /**
     * @param {string} url
     * @param {function} callback
     * @param {HTMLSelectElement} selectField
     */
    constructor(url, callback, selectField) {
        this._url = url;
        this._callback = callback;
        this._selectField = selectField;
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
        let selectableExternalOptions = new this(selectField.getAttribute('data-url'), this.fillOptions, selectField);
        return selectableExternalOptions.fetchData();
    }

    /**
     * @public
     */
    fetchData() {
        let that = this;
        return new Promise(function(resolve) {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.responseType = "json";
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                    resolve(that._callback(xmlHttp.response, that._selectField));
                }
            }
            xmlHttp.open("GET", that._url, true);
            xmlHttp.send(null);
        });
    }

    /**
     * @param {Object[]} response
     * @param {HTMLSelectElement} selectField
     * @private
     */
    static fillOptions(response, selectField) {
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