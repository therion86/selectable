/**
 * This is a plugin to Selectable.js
 * If you are using this you should include Selectable.js first, although this will not work
 * @author Therion86
 */
class SelectableSearch {
    constructor() {
    }


    /**
     * @param {HTMLDivElement} optionsHolder
     * @public
     * @static
     */
    static addSearchField(optionsHolder) {
        let selectableSearch = new this();
        selectableSearch.addSearchBar(optionsHolder)
    }

    /**
     * @param {HTMLDivElement} optionsHolder
     * @public
     */
    addSearchBar(optionsHolder) {
        let searchBar = document.createElement('input');
        searchBar.id = 'selectable-search-bar';

    }

}