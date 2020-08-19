/**
 * This is a plugin to Selectable.js
 * If you are using this you should include Selectable.js first, although this will not work
 * @author Therion86
 */
class SelectableSearch {

    /**
     * @param {HTMLDivElement} optionsHolder
     * @param {HTMLDivElement} wrapperDiv
     */
    constructor(wrapperDiv, optionsHolder) {
        this._wrapperDiv = wrapperDiv;
        this._optionsHolder = optionsHolder;
    }


    /**
     * @param {HTMLDivElement} optionsHolder
     * @param {HTMLDivElement} wrapperDiv
     * @public
     * @static
     */
    static addSearchField(wrapperDiv, optionsHolder) {
        let selectableSearch = new this(wrapperDiv, optionsHolder);
        selectableSearch.addSearchBar()
    }

    /**
     * @public
     */
    addSearchBar() {
        let searchBar = document.createElement('input');
        searchBar.classList.add('selectable-search-bar');
        let wrapperClasses = Array.from(this._wrapperDiv.classList);
        wrapperClasses.forEach(function(element) {
            searchBar.classList.add(element);
        });
        let that = this;
        searchBar.addEventListener('keyup', function() {
            if (this.value === '') {
                that._optionsHolder.querySelectorAll('.selectable-option').forEach(function(element) {
                   element.style.display = 'block';
                });
                return true;
            }
            let result = that._optionsHolder.querySelectorAll('.selectable-option[data-label*="' + this.value + '"]');
            if (null !== result) {
                result.forEach(function(element) {
                    element.style.display = 'block';
                })
            }
            let hide = that._optionsHolder.querySelectorAll('.selectable-option:not([data-label*="' + this.value + '"])');
            if (null !== hide) {
                hide.forEach(function(element) {
                    element.style.display = 'none';
                })
            }
        });
        this._optionsHolder.prepend(searchBar);
    }

}