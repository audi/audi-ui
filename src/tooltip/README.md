## Introduction

The Audi UI (AUI) **tooltip** component is an enhanced version of the standard HTML tooltip as produced by the `title` attribute. A tooltip consists of text and/or an image that clearly communicates additional information about an element when the user hovers over or, in a touch-based UI, touches the element. The AUI tooltip component is pre-styled to provide a vivid, attractive visual element that displays related but typically non-essential content, e.g., a definition, clarification, or brief instruction.

Tooltips are a ubiquitous feature of most user interfaces, regardless of a site's content or function. Their design and use is an important factor in the overall user experience. See the tooltip component's [Audi UI specifications page](http://www.audi.com/) for details.

### To include an AUI **tooltip** component:

&nbsp;1. Code an element, such as a `<div>`, `<p>`, or `<span>`, and style it as desired; this will be the tooltip's target. Include an `id` attribute and unique value to link the container to its tooltip.
```html
<p id="tooltip-1">HTML</p>
```
&nbsp;2. Following the target element, code a second element, such as a `<div>`, `<p>`, or `<span>`; this will be the tooltip itself. Include a `for` attribute whose value matches that of the target's `id`.
```html
<p id="tooltip-1">HTML</p>
<span for="tooltip-1">HyperText Markup Language</span>
```
&nbsp;3. Add one or more AUI classes, separated by spaces, to the tooltip element using the `class` attribute.
```html
<p id="tooltip-1">HTML</p>
<span for="tooltip-1" class="aui-tooltip aui-js-tooltip">HyperText Markup Language</span>
```

The tooltip component is ready for use.

#### Examples

A target with a simple text tooltip.
```html
<p>A <span id="sample-tooltip-1">tooltip</span> consists of text and/or an image.</p>
<span class="aui-tooltip aui-js-tooltip" for="sample-tooltip-1">
  <span class="aui-tooltip__text">Tooltips are a ubiquitous feature of most user interfaces.</span>
</span>
```

## Configuration options

The AUI CSS classes apply various predefined visual enhancements to the tooltip. The table below lists the available classes and their effects.

| AUI class | Effect | Remarks |
|-----------|--------|---------|
| `aui-tooltip` | Defines a container as an AUI tooltip | Required on tooltip container element |
| `aui-js-tooltip` | Assigns basic AUI behavior to tooltip element | Required |
| `aui-tooltip__text` | Defines element as text | Optional |
| `aui-tooltip__media` | Defines element as media such as an image | Optional |
| `aui-tooltip--dark` | Use dark theme | Optional |
