## Introduction

The Audi UI (AUI) **Popover** component is … (text follows)

### To include an AUI **Popover** component:

```html
```

## Configuration options

The AUI CSS classes and attributes apply various predefined visual and behavioral enhancements to the popover. The tables below lists the available classes/attributes and their effects.

| AUI class | Effect | Remarks |
|-----------|--------|---------|
| `aui-popover` | Defines button as an AUI button component | Required |
| `aui-js-popover` | Assigns basic AUI behavior to popover | Required |

| AUI attribute | Type | Default | Description |
|---------------|------|---------|-------------|
| `for` | String | null | ID of element which toggles popover. |
| `data-placement` | String | 'top' | How to position the popover: top, right, bottom, left. |
| `data-arrow-color` | String | null | A valid value used for fill attribute of arrow shape. See https://www.w3.org/TR/SVG/painting.html#SpecifyingPaint; As default the background-color of the `aui-popover__content` element is used as fill.  |
