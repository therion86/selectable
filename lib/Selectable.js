/**
 *
 */
class Selectable {

    /**
     * @public
     */
    constructor() {
        let selectFields = document.getElementsByClassName('selectable');
        for (const selectField of selectFields) {
            let selectId = this._getRandomInt(50);
            let height = selectField.clientHeight;
            let width = selectField.clientWidth;
            selectField.style.display = 'none';
            selectField.setAttribute('data-selectable-field-id', selectId);
            let wrapperDiv = this._createWrapper(selectField, height, width, selectId);
            this._appendChevron(wrapperDiv, height, selectId);
            this._appendTitle(wrapperDiv, selectField, height);
            selectField.parentNode.insertBefore(wrapperDiv, selectField);
            this._addOptionsHolder(wrapperDiv, selectField, selectId);
            this._addOptionsSelector();
        }


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
        chevron.classList.add('fas','fa-chevron-down', 'selectable-dropdown-chevron');
        chevron.style.paddingBottom = (selectHeight / 2 - 8) + 'px';
        chevron.style.paddingTop = (selectHeight / 2 - 8) + 'px';
        chevron.setAttribute('data-id', selectId);
        chevron.addEventListener('click', function() {
            let id = this.getAttribute('data-id');
            let selection = document.querySelector('div[data-id="' + id + '"]');
            if (selection.classList.contains('select-options-shown')) {
                selection.style.display = 'none';
                selection.classList.remove('select-options-shown');
            } else {
                selection.style.display = 'block';
                selection.classList.add('select-options-shown');
            }

        });
        wrapperDiv.appendChild(chevron);
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
        wrapperDiv.setAttribute('data-select-id', selectId)
        let selectClass = Array.from(selectField.classList);
        selectClass.forEach(function(element) {
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
        Array.from(selectField.options).forEach(function(element) {
            let label = element.innerHTML;
            let option = document.createElement('div');
            option.innerHTML = label;
            option.setAttribute('data-value', element.value)
            option.setAttribute('data-label', label)
            option.classList.add('selectable-option');
            optionsHolder.appendChild(option);
        });
        optionsHolder.style.display = 'none';
        optionsHolder.setAttribute('data-id', selectId);
        wrapperDiv.parentNode.appendChild(optionsHolder);
        wrapperDiv.after(optionsHolder)
    }

    /**
     * @private
     */
    _addOptionsSelector() {
        document.querySelectorAll('.selectable-option').forEach(function(element) {
            element.addEventListener('click', function() {
                let value = this.getAttribute('data-value');
                let selectId = this.parentNode.getAttribute('data-id');
                let selectField = document.querySelector('select[data-selectable-field-id="' + selectId + '"]');


                let optionWithValue = selectField.querySelector('option[value="' + value + '"]');
                let selectedOption = selectField.querySelector('option[value="' + value + '"][selected="selected"]');
                if (! selectField.hasAttribute('multiple')) {
                    Array.from(selectField.options).forEach(function(option) {
                        option.selected = false;
                        option.removeAttribute('selected');
                    });
                    this.parentNode.querySelectorAll('.selectable-option').forEach(function(element) {
                        element.classList.remove('selectable-option-selected');s
                    });
                }

                if (selectedOption) {
                    selectedOption.removeAttribute('selected');
                    this.classList.remove('selectable-option-selected');
                    return true;
                }
                if (! optionWithValue) {
                    let newOption = document.createElement('option');
                    newOption.value = value;
                    newOption.text = label;
                    newOption.selected = true;
                    selectField.add(newOption);
                } else {
                    optionWithValue.setAttribute('selected', 'selected');
                }
                this.classList.add('selectable-option-selected');
            });
        });
    }

    /**
     * @param {int} max
     * @returns {int}
     * @private
     */
    _getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
}

new Selectable();