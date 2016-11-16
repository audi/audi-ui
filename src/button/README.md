## Introduction

The Audi UI (AUI) **button** component is an enhanced version of the standard HTML `<button>` element. A button consists of text and/or an icon that clearly communicates what action will occur when the user clicks or touches it. The AUI button component provides various types of buttons, and allows you to add both display and click effects.

The available button display types are *flat* (default), *primary*, *secondary*, *text*, and *icon*; any of these types may be initially or programmatically *disabled*. The *primary* and *secondary* button types may have an icon, either on the left or right side. The *icon* button types must not use text.

### To include an AUI **button** component:

&nbsp;1. Code a `<button>` element. Include any desired attributes and values, such as an id or event handler, and add a text caption or icon as appropriate.
```html
<button type="button">Save</button>
```
&nbsp;2. Add one or more AUI classes, separated by spaces, to the button using the `class` attribute.
```html
<button class="aui-button aui-button--primary" type="button">Save</button>
```

&nbsp;3. All buttons must have the *Audi Response Effect*. Add Response class to button.
```html
<button class="aui-js-response aui-button aui-button--primary" type="button">Save</button>
```

The button component is ready for use.

#### Examples

A flat button with padding on the sides.
```html
<button class="aui-js-response aui-button aui-button--padded">Save</button>
```

A primary button.
```html
<button class="aui-js-response aui-button aui-button--primary">Save</button>
```

A secondary button.
```html
<button class="aui-js-response aui-button aui-button--secondary">Save</button>
```

A text button.
```html
<button class="aui-js-response aui-button aui-button--text">Save</button>
```

An icon button with the system icon *download*.
```html
<button class="aui-js-response aui-button aui-button--icon">
  <svg class="audiicon" aria-hidden="true">
    <use xlink:href="#audiicon-system-download-small"></use>
  </svg>
</button>
```

An icon button with a large system icon.
```html
<button class="aui-js-response aui-button aui-button--icon aui-button--icon-large">
  <svg class="audiicon audiicon--large" aria-hidden="true">
    <use xlink:href="#audiicon-system-download-large"></use>
  </svg>
</button>
```


## Configuration options

The AUI CSS classes apply various predefined visual and behavioral enhancements to the button. The table below lists the available classes and their effects.

| AUI class | Effect | Remarks |
|-----------|--------|---------|
| `aui-button` | Defines button as an AUI button component | Required |
| (none) | Applies *flat* display effect to button | Default |
| `aui-button--primary` | Applies *primary* (fill) display effect |  |
| `aui-button--secondary` | Applies *secondary* (outline) display effect |  |
| `aui-button--text` | Applies *text* (arrow) display effect |  |
| `aui-button--icon` | Applies *icon* (outlined system icon) display effect | Only use system icons; no text |
| `aui-button--icon-large` | Use together with large system icons | Mutually exclusive with *icon* |
| `aui-button--padded` | Applies left and right padding | Mutually exclusive with *flat* and *text* |
| `aui-js-response` | Applies *Response* click effect | Required; May be used in combination with any other classes |

>**Note:** Disabled versions of all the available button types are provided, and are invoked with the standard HTML boolean attribute `disabled`. `<button class="aui-js-response aui-button aui-button--primary" disabled>Primary Disabled</button>`. Alternatively, the `aui-button--disabled` class can be used to achieve the same result.
>This attribute may be added or removed programmatically via scripting.
