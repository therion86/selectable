/**
 * @author Therion86
 */
class Selectable {

    /**
     * @public
     */
    constructor() {
        let that = this;
        let selectFields = document.getElementsByClassName('selectable');
        for (const selectField of selectFields) {
            // Plugin SelectableExternalOptions needed
            if (typeof SelectableExternalOptions !== "undefined") {
				let selectId = that.initFields(selectField);
				SelectableSearch.liveSearch(selectId);
                SelectableExternalOptions.loadOptions(selectField, null, null, null)
            } else {
				if (typeof SelectableSearch !== "undefined") {
					SelectableSearch.liveSearch(that.initFields(selectField));
				} else {
					that.initFields(selectField)
				}
            
            }
        }
    }

    /**
     * @param {HTMLSelectElement} selectField
     * @public
     */
    initFields(selectField) {
        let selectId = this._getRandomInt(50);
        let height = selectField.clientHeight;
        let width = selectField.clientWidth;
        selectField.style.display = 'none';
        selectField.setAttribute('data-selectable-field-id', selectId.toString());
        let wrapperDiv = this._createWrapper(selectField, height, width, selectId);
        this._appendChevron(wrapperDiv, height, selectId);
        this._appendTitle(wrapperDiv, selectField, height);
        selectField.parentNode.insertBefore(wrapperDiv, selectField);
        this._addOptionsHolder(wrapperDiv, selectField, selectId);
        return selectId;
    }

    /**
     * @param {HTMLDivElement} wrapperDiv
     * @param {HTMLSelectElement} selectField
     * @param {int} selectHeight
     * @private
     */
    _appendTitle(wrapperDiv, selectField, selectHeight) {
        let titleField = document.createElement('span');
        titleField.innerHTML = selectField.getAttribute('title');
        titleField.classList.add('selectable-title');
        titleField.style.marginBottom = (selectHeight - 20) / 2 + 'px'
        titleField.style.marginTop = (selectHeight - 20) / 2 + 'px'
        wrapperDiv.appendChild(titleField);
    }

    /**
     * @param {HTMLDivElement} wrapperDiv
     * @param {int} selectHeight
     * @param {number} selectId
     * @private
     */
    _appendChevron(wrapperDiv, selectHeight, selectId) {
        let chevron = document.createElement('span');
        chevron.classList.add('fas', 'fa-caret-down', 'selectable-dropdown-chevron');
        chevron.style.paddingBottom = (selectHeight / 2 - 8) + 'px';
        chevron.style.paddingTop = (selectHeight / 2 - 8) + 'px';
        chevron.setAttribute('data-id', selectId.toString());
        wrapperDiv.appendChild(chevron);
		window.addEventListener('click', function(e) {
			const select = document.querySelector('.selectable-options-wrapper[data-id="' + selectId + '"]');
			if (!wrapperDiv.contains(e.target) && !select.contains(e.target)) {
				select.classList.remove('select-options-shown');
				select.style.display = 'none';
			}
		});
        wrapperDiv.addEventListener('click', function (event) {
            let targetElement = event.target;
			targetElement.classList.add('select-options-shown');
            if (targetElement.classList.contains('.selectable-dropdown-chevron')) {
                targetElement = this;
            } else if (targetElement.parentNode.querySelector('.selectable-dropdown-chevron')) {
                targetElement = targetElement.parentNode.querySelector('.selectable-dropdown-chevron');
            } else if (targetElement.querySelector('.selectable-dropdown-chevron')) {
                targetElement = targetElement.querySelector('.selectable-dropdown-chevron');
            } else {
                return true;
            }
            let id = targetElement.getAttribute('data-id');
            let selection = document.querySelector('div[data-id="' + id + '"]');
            if (selection.classList.contains('select-options-shown')) {
                selection.style.display = 'none';
                selection.classList.remove('select-options-shown');
            } else {
                selection.style.display = 'block';
                selection.classList.add('select-options-shown');
            }
            
            let autoloadSelect = document.querySelector('select.selectable[data-selectable-field-id="' + selectId + '"]');
            if (autoloadSelect.classList.contains('autoload')) {
            	const selectedOptions = autoloadSelect.querySelectorAll('option[selected]');
            	autoloadSelect.innerHTML = '';
                SelectableExternalOptions.loadOptions(autoloadSelect, null, null, null)
            }
        });
    }

    /**
     * @param {HTMLSelectElement} selectField
     * @param {int} selectHeight
     * @param {int} selectWidth
     * @param {int} selectId
     * @returns {HTMLDivElement}
     * @private
     */
    _createWrapper(selectField, selectHeight, selectWidth, selectId) {
        let wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('selectable-wrapper')
        wrapperDiv.style.height = selectHeight + 'px';
        wrapperDiv.style.width = selectWidth + 'px';
        wrapperDiv.style.padding = '0';
        if (!selectField.style.border) {
            wrapperDiv.style.border = selectField.style.border;
        }
        wrapperDiv.setAttribute('data-select-id', selectId.toString())
        let selectClass = Array.from(selectField.classList);
        selectClass.forEach(function (element) {
            if (element === 'selectable') {
                return;
            }
            wrapperDiv.classList.add(element);
        });
        return wrapperDiv;
    }

    /**
     *
     * @param {HTMLDivElement} wrapperDiv
     * @param {HTMLSelectElement} selectField
     * @param {number} selectId
     * @private
     */
    _addOptionsHolder(wrapperDiv, selectField, selectId) {
        let optionsHolder = document.createElement('div');
        optionsHolder.classList.add('selectable-options-wrapper')
        //optionsHolder.style.width = wrapperDiv.style.width;
        optionsHolder.setAttribute('data-id', selectId.toString());
        
        let options = document.createElement('div');
        options.classList.add('selectable-options-holder');
		options.setAttribute('data-id', selectId.toString());
        Selectable.addOptions(selectField, options);
		optionsHolder.appendChild(options);
        if (typeof SelectableSearch !== 'undefined') {
            SelectableSearch.addSearchField(wrapperDiv, optionsHolder);
        }
        wrapperDiv.parentNode.appendChild(optionsHolder);
        wrapperDiv.after(optionsHolder)
    }

    /**
     * @param selectField
     * @param optionsHolder
     * @public
     * @static
     */
    static addOptions(selectField, optionsHolder) {
        Array.from(selectField.options).forEach(function (element) {
            let label = element.innerHTML;
            let option = document.createElement('div');
            option.innerHTML = label;
            option.setAttribute('data-value', element.value)
            option.setAttribute('data-label', label)
            option.classList.add('selectable-option');
            if (element.getAttribute('selected')) {
				option.classList.add('selectable-option-selected');
				let icon = document.createElement('i');
				icon.classList.add('fas', 'fa-check', 'selected-check-right');
				option.appendChild(icon);
			}
            optionsHolder.appendChild(option);
        });
        Selectable.addOptionsSelector(optionsHolder, document.querySelector('.selectable-wrapper[data-select-id="' + selectField.dataset.selectableFieldId + '"]'));
    }

    /**
     * @param {HTMLDivElement} wrapperDiv
     * @param {HTMLDivElement} optionsHolder
     * @private
     */
    static addOptionsSelector(optionsHolder, wrapperDiv) {
		optionsHolder.querySelectorAll('.selectable-option').forEach(function (element) {
			
			elementsWithHandler.forEach(elementWithHandler => {
				if (elementWithHandler.dataset.value === element.dataset.value) {
					elementWithHandler.removeEventListener('click');
				}
			});
        
        	element.addEventListener('click', check);
			elementsWithHandler.push(element)
			
			function check(event) {
				let element = event.target;
				let value = event.target.getAttribute('data-value');
				let label = event.target.getAttribute('data-label');
				let selectId = this.parentNode.getAttribute('data-id');
				let selectField = document.querySelector('select[data-selectable-field-id="' + selectId + '"]');
		
				let optionWithValue = selectField.querySelector('option[value="' + value + '"]');
				let selectedOption = selectField.querySelector('option[value="' + value + '"][selected="selected"]');
				if (!selectField.hasAttribute('multiple')) {
					Array.from(selectField.options).forEach(option => {
						option.selected = false;
						option.removeAttribute('selected');
					});
					this.parentNode.querySelectorAll('.selectable-option').forEach(function (selectableOption) {
						if (selectableOption.querySelector('.fas')) {
							selectableOption.removeChild(selectableOption.querySelector('.fas'));
						}
						selectableOption.classList.remove('selectable-option-selected');
					});
				}
		
				if (selectedOption) {
					if (element.querySelector('.fas')) {
						this.removeChild(element.querySelector('.fas'));
					}
					selectedOption.removeAttribute('selected');
					this.classList.remove('selectable-option-selected');
					Selectable._selectOptionCountLabel(selectField, wrapperDiv, label);
					return true;
				}
				if (!optionWithValue) {
					let newOption = document.createElement('option');
					newOption.value = value;
					newOption.text = label;
					newOption.selected = true;
					selectField.add(newOption);
				} else {
					optionWithValue.setAttribute('selected', 'selected');
				}
				let icon = document.createElement('i');
				icon.classList.add('fas', 'fa-check', 'selected-check-right');
				this.appendChild(icon);
		
				this.classList.add('selectable-option-selected');
				Selectable._selectOptionCountLabel(selectField, wrapperDiv, label);
		
			}
        });
    }

    /**
     * @param {Element} selectField
     * @param {HTMLDivElement} wrapperDiv
     * @param {string} label
     * @private
     */
    static _selectOptionCountLabel(selectField, wrapperDiv, label) {
        let selectedOptions = selectField.querySelectorAll('option[selected="selected"]');
        let selectedOptionsLength = selectedOptions.length;
        let optionsLabel = selectedOptionsLength + ' Element(s) selected';
        if (selectField.getAttribute('data-multiple-options-count')) {
            optionsLabel = selectedOptions.length + ' ' + selectField.getAttribute('data-multiple-options-count');
        }
        if (!selectField.hasAttribute('multiple')) {
            optionsLabel = label;
        }
        let selectableTitle = wrapperDiv.querySelector('.selectable-title');
        if (selectedOptionsLength > 0) {
            selectableTitle.innerHTML = optionsLabel;
            let selectableTitleWidth = wrapperDiv.clientWidth - 21 - 5;
            selectableTitle.style.width = selectableTitleWidth + 'px';
        } else {
            selectableTitle.innerHTML = selectField.getAttribute('title');
        }
    }

    /**
     * @param {int} max
     * @returns {int}
     * @private
     * @static
     */
    _getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}

new Selectable();

let elementsWithHandler = [];
