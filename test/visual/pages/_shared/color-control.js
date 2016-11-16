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

  $('.section .aui-table').toggleClass('is-inverted', invert);
  $('.section .aui-table').toggleClass('aui-table--silver', val === 'silver');
  $('.section .aui-table').toggleClass('aui-table--warmsilver', val === 'warmsilver');

  $('.section .aui-spinner').toggleClass('is-inverted', invert);
  $('.section .aui-progress').toggleClass('is-inverted', invert);

  var component;
  var componentsWithTheme = [
    'breadcrumb',
    'slider',
    'dropdown',
    'nav',
  ];
  for (var i = 0; i < componentsWithTheme.length; i++) {
    component = componentsWithTheme[i];
    $('.section .aui-' + component).toggleClass('aui-theme-black', val === 'black');
    $('.section .aui-' + component).toggleClass('aui-theme-silver', val === 'silver');
    $('.section .aui-' + component).toggleClass('aui-theme-warmsilver', val === 'warmsilver');
    $('.section .aui-' + component).toggleClass('aui-theme-red', val === 'red');
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
  ];
  for (var i = 0; i < componentsTextWithTheme.length; i++) {
    component = componentsTextWithTheme[i];
    $('.section .aui-' + component).each(function(element, index){
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
