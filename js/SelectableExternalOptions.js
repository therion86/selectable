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
     * @param {string|null} searchValue
     * @returns {Promise}
     * @public
     * @static
     */
    static loadOptions(selectField, searchValue) {
        if (! selectField.classList.contains('external')) {
            return true;
        }
        if (! selectField.hasAttribute('data-url')) {
            throw "No data-url was set!";
        }
        let selectableExternalOptions = new this(selectField.getAttribute('data-url'), this.fillOptions, selectField);
        return selectableExternalOptions.fetchData(searchValue);
    }

    /**
     * @param {string|null} searchValue
     * @returns {Promise}
     * @public
     */
    fetchData(searchValue) {
        let that = this;
        let search = '';
        if (null !== searchValue) {
            search = '?q=' + encodeURIComponent(searchValue);
        }
        let request = obj => {
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.responseType = "json";
                xhr.open(obj.method || "GET", obj.url);
                if (obj.headers) {
                    Object.keys(obj.headers).forEach(key => {
                        xhr.setRequestHeader(key, obj.headers[key]);
                    });
                }
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve(that._callback(xhr.response, that._selectField));
                    } else {
                        reject(xhr.statusText);
                    }
                };
                xhr.onerror = () => reject(xhr.statusText);
                xhr.send(obj.body);
            });
        };
        return request({url: that._url + search})
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