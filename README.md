# selectable
A JS selector.
The selector appends the styling of the select-field. If you are using for e.g. bootstrap, the wrapper for the select-field looks like a form-control

## Requirements
```
Fontawesome 5
```

## Usage
### Include the source
```
<script src="selectable/js/Selectable.js"></script>
<link rel="stylesheet" href="selectable/css/main.css" />
```
### Add class to select field
```
 <select class="selectable">
```

### Further options
Select Attribute | Description
---------------- | -----------
title | Sets the placeholder text.
data-multiple-options-count | Sets the counting value for select "multiple"

## Plugins
### Selectable external Option Loading
#### Include Source before Selectable.js
```
<script src="selectable/js/SelectableExternalOptions.js"></script>
```
#### Add class and url to select field
```
 <select class="selectable external" data-url="url-to-json">
```

#### Response of Url
The Response fo the requested Url must a JSON-Array with objects having a "value" and "label" attribute. They will be matched to the options
