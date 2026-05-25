(function (blocks, blockEditor, components, element, i18n) {
  var registerBlockType = blocks.registerBlockType;
  var RichText = blockEditor.RichText;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var TextControl = components.TextControl;
  var SelectControl = components.SelectControl;
  var RangeControl = components.RangeControl;
  var createElement = element.createElement;
  var __ = i18n.__;

  registerBlockType('yec/google-map-section', {
    title: __('YEC Mapa Google', 'yourenglishcoachtheme'),
    description: __('Sekcja z osadzona mapa Google i pinezka.', 'yourenglishcoachtheme'),
    icon: 'location-alt',
    category: 'design',
    supports: {
      html: false,
    },
    attributes: {
      sectionTitle: { type: 'string', default: 'Gdzie mnie znajdziesz' },
      titleSize: { type: 'string', default: 'medium' },
      address: { type: 'string', default: 'sw. Leonarda 6, 60-654 Poznan' },
      mapHeight: { type: 'number', default: 420 },
      sectionSpaceTop: { type: 'number' },
      sectionSpaceBottom: { type: 'number' },
    },
    edit: function (props) {
      var attributes = props.attributes;
      var setAttributes = props.setAttributes;
      var sectionSpaceTop = Number.isFinite(attributes.sectionSpaceTop) ? attributes.sectionSpaceTop : 0;
      var sectionSpaceBottom = Number.isFinite(attributes.sectionSpaceBottom) ? attributes.sectionSpaceBottom : 0;
      var mapHeight = Number.isFinite(attributes.mapHeight) ? attributes.mapHeight : 420;
      var sectionSpacingStyle = {};

      if (Number.isFinite(attributes.sectionSpaceTop)) {
        sectionSpacingStyle.marginTop = sectionSpaceTop + 'px';
      }

      if (Number.isFinite(attributes.sectionSpaceBottom)) {
        sectionSpacingStyle.marginBottom = sectionSpaceBottom + 'px';
      }

      var mapUrl = 'https://www.google.com/maps?q=' + encodeURIComponent(attributes.address || '') + '&z=16&output=embed';

      var blockProps = useBlockProps({
        className: 'yec-google-map yec-google-map--title-' + (attributes.titleSize || 'medium'),
        style: Object.keys(sectionSpacingStyle).length ? sectionSpacingStyle : undefined,
      });

      return createElement(
        'section',
        blockProps,
        createElement(
          InspectorControls,
          null,
          createElement(
            PanelBody,
            {
              title: __('Ustawienia sekcji', 'yourenglishcoachtheme'),
              initialOpen: true,
            },
            createElement(SelectControl, {
              label: __('Rozmiar tytulu', 'yourenglishcoachtheme'),
              value: attributes.titleSize || 'medium',
              options: [
                { label: __('Duzy', 'yourenglishcoachtheme'), value: 'large' },
                { label: __('Sredni', 'yourenglishcoachtheme'), value: 'medium' },
                { label: __('Maly', 'yourenglishcoachtheme'), value: 'small' },
              ],
              onChange: function (value) {
                setAttributes({ titleSize: value || 'medium' });
              },
            }),
            createElement(RangeControl, {
              label: __('Wysokosc mapy (px)', 'yourenglishcoachtheme'),
              min: 240,
              max: 720,
              value: mapHeight,
              onChange: function (value) {
                setAttributes({ mapHeight: value || 420 });
              },
            }),
            createElement(RangeControl, {
              label: __('Przestrzen nad sekcja (px)', 'yourenglishcoachtheme'),
              min: 0,
              max: 240,
              value: sectionSpaceTop,
              onChange: function (value) {
                setAttributes({ sectionSpaceTop: value || 0 });
              },
            }),
            createElement(RangeControl, {
              label: __('Przestrzen pod sekcja (px)', 'yourenglishcoachtheme'),
              min: 0,
              max: 240,
              value: sectionSpaceBottom,
              onChange: function (value) {
                setAttributes({ sectionSpaceBottom: value || 0 });
              },
            })
          ),
          createElement(
            PanelBody,
            {
              title: __('Lokalizacja', 'yourenglishcoachtheme'),
              initialOpen: true,
            },
            createElement(TextControl, {
              label: __('Adres', 'yourenglishcoachtheme'),
              value: attributes.address || '',
              onChange: function (value) {
                setAttributes({ address: value });
              },
            })
          )
        ),
        createElement(RichText, {
          tagName: 'h2',
          className: 'yec-google-map__title',
          value: attributes.sectionTitle,
          placeholder: __('Tytul sekcji', 'yourenglishcoachtheme'),
          onChange: function (value) {
            setAttributes({ sectionTitle: value });
          },
        }),
        createElement(
          'div',
          {
            className: 'yec-google-map__frame-wrap',
            style: { '--yec-google-map-height': mapHeight + 'px' },
          },
          createElement('iframe', {
            className: 'yec-google-map__iframe',
            title: attributes.address || __('Mapa Google', 'yourenglishcoachtheme'),
            src: mapUrl,
            loading: 'lazy',
            referrerPolicy: 'no-referrer-when-downgrade',
            allowFullScreen: true,
          })
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
