// Add DOM4 support, https://github.com/WebReflection/dom4
import 'dom4';

// Add Babel polyfill for ES2015, https://babeljs.io/docs/usage/polyfill/
import 'babel-polyfill';

//
import FontFaceObserver from 'fontfaceobserver';

// Import all components from Audi UI library
import {
  Alert,
  Breadcrumb,
  Checkbox,
  Dropdown,
  Flyout,
  Header,
  Modal,
  Nav,
  Notification,
  Pagination,
  Player,
  Popover,
  Progress,
  Radio,
  Response,
  Select,
  Slider,
  Slidernav,
  Spinner,
  Textfield,
  Tooltip
} from '../../../src/index';

// Upgrade all Audi UI components
let alertComponents = Alert.upgradeElements();
let breadcrumbComponents = Breadcrumb.upgradeElements();
Checkbox.upgradeElements();
Dropdown.upgradeElements();
Flyout.upgradeElements();
Header.upgradeElements();
Modal.upgradeElements();
let navComponents = Nav.upgradeElements();
Notification.upgradeElements();
let paginationComponents = Pagination.upgradeElements();
Player.upgradeElements();
Popover.upgradeElements();
let progressComponents = Progress.upgradeElements();
Radio.upgradeElements();
Response.upgradeElements();
Select.upgradeElements();
Slider.upgradeElements();
Slidernav.upgradeElements();
let spinnerComponents = Spinner.upgradeElements();
Textfield.upgradeElements();
Tooltip.upgradeElements();

// Import test stuff:
import URI from 'urijs';




// ----------------------------------------------------------------------------
// Load SVG sprite with Audi Icons
// ----------------------------------------------------------------------------
Array.from(document.querySelectorAll('[data-svg-sprite]')).forEach(element => {
  const src = element.getAttribute('data-svg-sprite');
  if (typeof src === 'string' && src.length > 0) {
    let ajax = new XMLHttpRequest();
    ajax.open('GET', src, true);
    ajax.responseType = 'document';
    ajax.onload = function(event) {
      element.removeAttribute('data-src');
      try {
        element.appendChild(ajax.responseXML.documentElement);
      } catch (e) {
        console.log(e);
      }
    };
    ajax.send();
  }
});




// ----------------------------------------------------------------------------
// Demo Spinner and Progress components:
// ----------------------------------------------------------------------------
let progress = 0;

function demoLoaderProgress() {
  progress += 0.01;
  for (var i = 0; i < spinnerComponents.length; i++) {
    spinnerComponents[i].progress(progress);
  }
  for (var i = 0; i < progressComponents.length; i++) {
    progressComponents[i].progress(progress);
  }
  if (progress < 1) {
    window.requestAnimationFrame(() => demoLoaderProgress());
  } else {
    progress = 0;
    setTimeout(() => demoLoaderProgress(), 4000);
  }
}
setTimeout(() => {
  for (var i = 0; i < spinnerComponents.length; i++) {
    spinnerComponents[i].loop();
  }
}, 2000);
setTimeout(() => demoLoaderProgress(), 2000);




// ----------------------------------------------------------------------------
// Demo Spinner and Progress components:
// ----------------------------------------------------------------------------
Array.from(document.querySelectorAll('[data-toggle="modal"]')).forEach(element => {
  element.addEventListener('click', (event) => {
    let modal = Modal.getModalById(element.getAttribute('data-target'));
    if (modal) {
      modal.open(event.currentTarget);
    }
  });
});

Array.from(document.querySelectorAll('[data-dismiss="modal"]')).forEach(element => {
  element.addEventListener('click', (event) => {
    Modal.closeCurrentModal();
  });
});



// ----------------------------------------------------------------------------
// Update components after font 'Audi Type' was loaded:
// ----------------------------------------------------------------------------
let fontFaceObserverScreen = new FontFaceObserver('AudiTypeScreen');
fontFaceObserverScreen.load().then(function() {
  paginationComponents.forEach(component => {
    component.update();
  });
  breadcrumbComponents.forEach(component => {
    component.update();
  });
  alertComponents.forEach(component => {
    component.update();
  });
}, function() {
  // Error handling: Font is not available or timeout.
  console.warn('Warning: AudiTypeScreen not available.');
});

let fontFaceObserverExtended = new FontFaceObserver('AudiTypeExtended');
fontFaceObserverExtended.load().then(function() {
  navComponents.forEach(component => {
    component.update();
  });
}, function() {
  // Error handling: Font is not available or timeout.
  console.warn('Warning: AudiTypeExtended not available.');
});



// ----------------------------------------------------------------------------
// Color switch:
// ----------------------------------------------------------------------------
if (document.getElementById('change-color')) {
  var textColors = {
    'white': 'dark',
    'black': 'light',
    'silver': 'light',
    'warmsilver': 'light',
    'red': 'light',
    'image': 'dark',
    'imagedark': 'light',
  };

  function colorChange(val) {
    var invert = (textColors[val] !== 'dark');

    $('body')
    .removeClass(function(index, css) {
      return (css.match(/\baui-color-\S+/g) || []).join(' ');
    })
    .addClass('aui-color-' + val)
    .removeClass(function(index, css) {
      return (css.match(/\baui-color-text-\S+/g) || []).join(' ');
    })
    .addClass('aui-color-text-' + textColors[val]);

    $('.test-section .aui-spinner').toggleClass('is-inverted', invert);
    $('.test-section .aui-progress').toggleClass('is-inverted', invert);

    var component;
    var componentsWithTheme = [
      'breadcrumb',
      'slider',
      'dropdown',
      'nav',
    ];
    for (var i = 0; i < componentsWithTheme.length; i++) {
      component = componentsWithTheme[i];
      $('.test-section .aui-' + component).toggleClass('aui-theme-black', val === 'black');
      $('.test-section .aui-' + component).toggleClass('aui-theme-silver', val === 'silver');
      $('.test-section .aui-' + component).toggleClass('aui-theme-warmsilver', val === 'warmsilver');
      $('.test-section .aui-' + component).toggleClass('aui-theme-red', val === 'red');
    }

    var componentsTextWithTheme = [
      'button',
      'draggable-list',
      'dropzone',
      'pager',
      'pagination',
      'slidernav',
      'textfield',
      'flyout',
      'spinner',
      'progress',
      'switch',
      'radio',
      'checkbox',
      'fieldset',
      'select',
      'table',
    ];
    for (var i = 0; i < componentsTextWithTheme.length; i++) {
      component = componentsTextWithTheme[i];
      $('.test-section .aui-' + component).each(function(element, index){
        if (!$(this).hasClass('aui-theme-image')) {
          $(this).toggleClass('aui-theme-light', invert);
        }
      });
    }
  }

  $('#change-color').on('change', function(event) {
    colorChange($(this).val());
  });

  var uri = URI(window.location.href);
  var color = uri.query(true).color;
  if (color !== undefined) {
    if (['black', 'silver', 'warmsilver', 'red'].indexOf(color) >= 0) {
      $('#change-color').val(color);
    }
  }
  colorChange($('#change-color').val());
}
