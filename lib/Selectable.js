class Selectable {

    constructor() {
        let selectFields = document.getElementsByClassName('selectable');
        for (const selectField of selectFields) {
            let selectId = Math.random();
            let height = selectField.clientHeight;
            let width = selectField.clientWidth;
            selectField.style.display = 'none';

            let wrapperDiv = this._createWrapper(selectField, height, width);
            this._appendChevron(wrapperDiv, height, selectId);
            this._appendTitle(wrapperDiv, selectField, height);
            selectField.parentNode.insertBefore(wrapperDiv, selectField);
            this._addOptionsHolder(wrapperDiv, selectField, selectId);
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
            let id = this.getAttribute('data-id')
            document.querySelector('div[data-id="' + id + '"]').style.display = 'block';
        });
        wrapperDiv.appendChild(chevron);
    }

    /**
     * @param {HTMLSelectElement} selectField
     * @param {int} selectHeight
     * @param {int} selectWidth
     * @returns {HTMLDivElement}
     * @private
     */
    _createWrapper(selectField, selectHeight, selectWidth) {
        let wrapperDiv = document.createElement('div');
        wrapperDiv.classList.add('selectable-wrapper')
        wrapperDiv.style.height = selectHeight + 'px';
        wrapperDiv.style.width = selectWidth + 'px';
        wrapperDiv.style.padding = '0';
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
            option.classList.add('selectable-option');
            optionsHolder.appendChild(option);
        });
        optionsHolder.style.display = 'none';
        optionsHolder.setAttribute('data-id', selectId);
        wrapperDiv.parentNode.appendChild(optionsHolder);
        wrapperDiv.after(optionsHolder)
    }
}

new Selectable();