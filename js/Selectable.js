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
                SelectableExternalOptions.loadOptions(selectField, null)
                    .then(function () {
                        return that.initFields(selectField);
                    }).then(function (selectId) {
                    SelectableSearch.liveSearch(selectId);
                });
            } else {
                that.initFields(selectField);
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
        this._addOptionsSelector(wrapperDiv);
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
        chevron.classList.add('fas', 'fa-chevron-down', 'selectable-dropdown-chevron');
        chevron.style.paddingBottom = (selectHeight / 2 - 8) + 'px';
        chevron.style.paddingTop = (selectHeight / 2 - 8) + 'px';
        chevron.setAttribute('data-id', selectId.toString());
        wrapperDiv.appendChild(chevron);
        wrapperDiv.addEventListener('click', function (event) {
            let targetElement = event.target;
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
            wrapperDiv.style.border = '1px solid #ccc';
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
        optionsHolder.classList.add('selectable-options-holder')
        optionsHolder.style.width = wrapperDiv.style.width;
        Selectable.addOptions(selectField, optionsHolder);
        optionsHolder.style.display = 'none';
        optionsHolder.setAttribute('data-id', selectId.toString());
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
            optionsHolder.appendChild(option);
        });
    }

    /**
     * @param {HTMLDivElement} wrapperDiv
     * @private
     */
    _addOptionsSelector(wrapperDiv) {
        let that = this;
        document.querySelectorAll('.selectable-option').forEach(function (element) {
            element.addEventListener('click', function () {
                let value = this.getAttribute('data-value');
                let label = this.getAttribute('data-label');
                let selectId = this.parentNode.getAttribute('data-id');
                let selectField = document.querySelector('select[data-selectable-field-id="' + selectId + '"]');

                let optionWithValue = selectField.querySelector('option[value="' + value + '"]');
                let selectedOption = selectField.querySelector('option[value="' + value + '"][selected="selected"]');
                if (!selectField.hasAttribute('multiple')) {
                    Array.from(selectField.options).forEach(function (option) {
                        option.selected = false;
                        option.removeAttribute('selected');
                    });
                    this.parentNode.querySelectorAll('.selectable-option').forEach(function (element) {
                        if (element.querySelector('.fas')) {
                            element.removeChild(element.querySelector('.fas'));
                        }
                        element.classList.remove('selectable-option-selected');
                    });
                }

                if (selectedOption) {
                    if (element.querySelector('.fas')) {
                        this.removeChild(element.querySelector('.fas'));
                    }
                    selectedOption.removeAttribute('selected');
                    this.classList.remove('selectable-option-selected');
                    that._selectOptionCountLabel(selectField, wrapperDiv, label);
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
                that._selectOptionCountLabel(selectField, wrapperDiv, label);

            });
        });
    }

    /**
     * @param {Element} selectField
     * @param {HTMLDivElement} wrapperDiv
     * @param {string} label
     * @private
     */
    _selectOptionCountLabel(selectField, wrapperDiv, label) {
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