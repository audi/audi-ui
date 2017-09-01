# Audi UI

> An implementation of Audi UI components in CSS, Vanilla JavaScript, and HTML.
> Complementary [typefaces](https://github.com/audi/audi-type) and [icons](http://github.com/audi/audi-icon) can be found in the corresponding repositories on the same organization account.

> Project status: **alpha**

## Want to contribute?

If you found a bug, have any questions or want to contribute feel free to file an issue on GitHub. For general information on the audi corporate design please follow the [official guidelines](https://www.audi.com/ci).

## Getting Started

### Build workflow

Our current build workflow requires [Gulp](http://gulpjs.com/) v4. Make sure you have the latest version installed.

You will need to remove your current gulp global package before installing v4 in order to do an upgrade.

```
npm rm -g gulp
npm install -g gulp-cli
```

This command removes your current global package and installs v4 from the gulp-cli 4.0 branch.

Make sure you don't get any errors from the first command before you type the second. Depending on your set-up, you may need to run them with `sudo`.

To verify what version you have installed globally, you can run the below command (and should see a similar output).

```
gulp -v
CLI version 1.2.2
```

### Setup the repo:

```
git clone https://github.com/audi/audi-ui.git && cd audi-ui
npm i
```

### Build library files:
```
gulp
```

### Build library an run the development server:
```
cd /path/to/audi-ui
gulp test:visual
```

## Use Audi UI for your project

#### 1. Install Audi UI via NPM
```
npm install @audi/audi-ui
```

#### 2. Link CSS directly OR import library SCSS in your styles
``` html
<link rel="stylesheet" href="/node_modules/@audi/audi-ui/lib/audiui.min.css">
```

``` CSS
@import "/node_modules/@audi/audi-ui/src/index";
```

#### 3. Initialize JS
``` JavaScript
// Add DOM4 support, https://github.com/WebReflection/dom4
import 'dom4';

// Add Babel polyfill for ES2015, https://babeljs.io/docs/usage/polyfill/
import 'babel-polyfill';

// Import all components from Audi UI library
import aui from 'audi-ui';

// Or only some
import {Modal, Nav, Spinner} from 'audi-ui';

// Initialize all Audi UI components
aui.upgradeAllElements();

// Or only some
Modal.upgradeElements();
Nav.upgradeElements();
Spinner.upgradeElements();
```

#### 4. Check if JavaScript is enabled

We use an approach like [Modernizr](https://modernizr.com/docs#no-js) to detect JS support, and change the styling accordingly.
Add the class `aui-no-js` to the `html` element.
``` html
<html class="aui-no-js">
```
Replace the name with `aui-js` if JS is supported.
``` html
<head>
  <script type="text/javascript">
    document.documentElement.className = document.documentElement.className.replace(new RegExp("(^|\\s)aui-no-js(\\s|$)"), "$1aui-js$2");
  </script>
</head>
```

## Browser Support

Supported evergreen browsers:

- Chrome
- Edge
- Firefox
- Opera

Supported versioned browsers:

- Internet Explorer 10
- Safari 8
- Mobile Safari 8
