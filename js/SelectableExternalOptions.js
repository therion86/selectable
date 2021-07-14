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
        const affectedFields = selectField.dataset.affectedSearchParams.split(',');
        affectedFields.forEach((elementId) => {
            const element = document.getElementById(elementId);
            if (typeof element === 'undefined') {
                return true;
            }
            element.addEventListener('change', () => {
                selectField.innerHTML = '';
            });
        });
    }

    /**
     * @param {HTMLSelectElement} selectField
     * @param {string|null} searchValue
     * @param {HTMLOptionElement|null} options
     * @param {number} searchTimer
     * @returns {Promise}
     * @public
     * @static
     */
    static loadOptions(selectField, searchValue, options, searchTimer) {
        if (! selectField.classList.contains('external')) {
            return true;
        }
        if (! selectField.hasAttribute('data-url')) {
            throw "No data-url was set!";
        }
       
        let selectableExternalOptions = new this(selectField.getAttribute('data-url'), this.fillOptions, selectField);
        let promise = selectableExternalOptions.fetchData(searchValue, selectField);
		const optionsHolder = document.querySelector('.selectable-options-holder[data-id="' + selectField.dataset.selectableFieldId + '"]')
		Array.from(selectField.options).forEach(element => {
			if (! element.selected) {
				element.remove();
				const visibleOption = document.querySelector('.selectable-option[data-value="' + element.value + '"]');
				if (visibleOption) {
					visibleOption.remove();
				}
			}
		});

        promise.then(function(response) {
			SelectableExternalOptions.fillOptions(response, selectField);
			Selectable.addOptions(selectField, optionsHolder)
			if (searchTimer)
			clearTimeout(searchTimer);
		});
    }

    /**
     * @param {string|null} searchValue
     * @param {HTMLSelectElement} selectField
     * @returns {Promise}
     * @public
     */
    fetchData(searchValue, selectField) {
        let that = this;
        let search = '';
		let fields = [];
        if (null !== searchValue) {
            fields.push('searchText=' + encodeURIComponent(searchValue));
        }
        if (selectField.dataset.affectedSearchParams) {
        	
        	const affectedFields = selectField.dataset.affectedSearchParams.split(',');
        	affectedFields.forEach((elementId) => {
        		const element = document.getElementById(elementId);
        		if (typeof element === 'undefined') {
        			return true;
				}
        		const elementName = element.getAttribute('name');
				const elementValue = element.value;
				if (elementValue.length === 0) {
				    return true;
                }
				fields.push(elementName+'='+elementValue);
			});
		}
		search += fields.join('&');
        if (search.length !== 0) {
        	search = '?' + search;
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
                        resolve(xhr.response);
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
     */
    static fillOptions(response, selectField) {
        selectField.innerHTML = '';
        let result = response.results;
        for (let key in result) {
            if (! result.hasOwnProperty(key)) {
                continue;
            }
            let element = result[key];
            if (! element.hasOwnProperty('value') || ! element.hasOwnProperty('text')) {
            	continue;
                //throw 'Element has no "value" or "label"!';
            }
            let option = document.createElement('option');
            option.value = element.value;
            option.text = element.text;
            selectField.add(option);
        }
    }

}
