# AUI Alert

## Usage

##### ES2015

```javascript
import {Alert} from 'audi-ui';
```

##### CommonJS

```javascript
tbd.
```

##### AMD

```javascript
tbd.
```


##### Global

```javascript
tbd.
```

#### Automatic Instantiation

If you do not care about retaining the component instance for the alert, simply call `upgradeElements`.  

```javascript
import {Alert} from 'audi-ui';

Alert.upgradeElements();
```

#### Manual Instantiation

Alerts can easily be initialized using their default constructors as well, similar to `upgradeElements`.

```javascript
import {Alert} from 'audi-ui';

const alert = new Alert(document.querySelector('.aui-alert'));
```

## Classes

### Element

The block class is `aui-alert`. This defines the top-level alert element. Have a look into the `snippets` folder for examples.

### Modifier

The provided modifiers are:

| Class                 | Description                |
| --------------------- | ---------------------------|
| `aui-alert--sticky`   | Make the alert sticky.     |
| `is-open`             | State, if alert is open.   |
| `is-closed`           | State, if alert is closed. |
