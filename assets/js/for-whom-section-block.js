(function (blocks, blockEditor, components, element, i18n) {
  var registerBlockType = blocks.registerBlockType;
  var RichText = blockEditor.RichText;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var Button = components.Button;
  var TextControl = components.TextControl;
  var SelectControl = components.SelectControl;
  var RangeControl = components.RangeControl;
  var ColorPalette = components.ColorPalette;
  var createElement = element.createElement;
  var __ = i18n.__;

  registerBlockType('yec/for-whom-section', {
    title: __('YEC Dla kogo', 'yourenglishcoachtheme'),
    description: __('Sekcja Dla kogo z dwoma obrazami 50/50, overlayem i linkami.', 'yourenglishcoachtheme'),
    icon: 'screenoptions',
    category: 'design',
    supports: {
      html: false,
    },
    attributes: {
      sectionTitle: { type: 'string', default: 'Dla kogo' },
      titleSize: { type: 'string', default: 'medium' },
      sectionSpaceTop: { type: 'number' },
      sectionSpaceBottom: { type: 'number' },

      card1ImageId: { type: 'number' },
      card1ImageUrl: { type: 'string', default: '' },
      card1ImageAlt: { type: 'string', default: '' },
      card1Text: { type: 'string', default: 'Dla doroslych' },
      card1Url: { type: 'string', default: '/dla-doroslych' },
      card1OverlayColor: { type: 'string', default: '#000000' },
      card1OverlayOpacity: { type: 'number', default: 35 },

      card2ImageId: { type: 'number' },
      card2ImageUrl: { type: 'string', default: '' },
      card2ImageAlt: { type: 'string', default: '' },
      card2Text: { type: 'string', default: 'Dla mlodziezy' },
      card2Url: { type: 'string', default: '/dla-mlodziezy' },
      card2OverlayColor: { type: 'string', default: '#000000' },
      card2OverlayOpacity: { type: 'number', default: 35 },
    },
    edit: function (props) {
      var attributes = props.attributes;
      var setAttributes = props.setAttributes;
      var sectionSpaceTop = Number.isFinite(attributes.sectionSpaceTop) ? attributes.sectionSpaceTop : 0;
      var sectionSpaceBottom = Number.isFinite(attributes.sectionSpaceBottom) ? attributes.sectionSpaceBottom : 0;
      var sectionSpacingStyle = {};

      if (Number.isFinite(attributes.sectionSpaceTop)) {
        sectionSpacingStyle.marginTop = sectionSpaceTop + 'px';
      }

      if (Number.isFinite(attributes.sectionSpaceBottom)) {
        sectionSpacingStyle.marginBottom = sectionSpaceBottom + 'px';
      }

      var card1OverlayOpacity = Number.isFinite(attributes.card1OverlayOpacity) ? attributes.card1OverlayOpacity : 35;
      var card2OverlayOpacity = Number.isFinite(attributes.card2OverlayOpacity) ? attributes.card2OverlayOpacity : 35;

      var blockProps = useBlockProps({
        className: 'yec-for-whom yec-for-whom--title-' + (attributes.titleSize || 'medium'),
        style: Object.keys(sectionSpacingStyle).length ? sectionSpacingStyle : undefined,
      });

      var renderImageButton = function (label, imageId, onSelect) {
        return createElement(MediaUploadCheck, {},
          createElement(MediaUpload, {
            onSelect: onSelect,
            allowedTypes: ['image'],
            value: imageId,
            render: function (renderProps) {
              return createElement(Button, {
                variant: 'secondary',
                onClick: renderProps.open,
              }, label);
            },
          })
        );
      };

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
              label: __('Rozmiar tytulu i tekstow na obrazach', 'yourenglishcoachtheme'),
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
              title: __('Kafel 1', 'yourenglishcoachtheme'),
              initialOpen: true,
            },
            renderImageButton(
              attributes.card1ImageUrl ? __('Zmien obraz 1', 'yourenglishcoachtheme') : __('Wybierz obraz 1', 'yourenglishcoachtheme'),
              attributes.card1ImageId,
              function (media) {
                setAttributes({
                  card1ImageId: media && media.id ? media.id : undefined,
                  card1ImageUrl: media && media.url ? media.url : '',
                  card1ImageAlt: media && media.alt ? media.alt : '',
                });
              }
            ),
            createElement(TextControl, {
              label: __('Link kafla 1', 'yourenglishcoachtheme'),
              value: attributes.card1Url || '',
              onChange: function (value) {
                setAttributes({ card1Url: value });
              },
            }),
            createElement('p', { style: { marginBottom: '8px' } }, __('Kolor overlay kafla 1', 'yourenglishcoachtheme')),
            createElement(ColorPalette, {
              value: attributes.card1OverlayColor || '#000000',
              onChange: function (value) {
                setAttributes({ card1OverlayColor: value || '#000000' });
              },
            }),
            createElement(RangeControl, {
              label: __('Krycie overlay 1 (%)', 'yourenglishcoachtheme'),
              min: 0,
              max: 100,
              value: card1OverlayOpacity,
              onChange: function (value) {
                setAttributes({ card1OverlayOpacity: value || 0 });
              },
            })
          ),
          createElement(
            PanelBody,
            {
              title: __('Kafel 2', 'yourenglishcoachtheme'),
              initialOpen: false,
            },
            renderImageButton(
              attributes.card2ImageUrl ? __('Zmien obraz 2', 'yourenglishcoachtheme') : __('Wybierz obraz 2', 'yourenglishcoachtheme'),
              attributes.card2ImageId,
              function (media) {
                setAttributes({
                  card2ImageId: media && media.id ? media.id : undefined,
                  card2ImageUrl: media && media.url ? media.url : '',
                  card2ImageAlt: media && media.alt ? media.alt : '',
                });
              }
            ),
            createElement(TextControl, {
              label: __('Link kafla 2', 'yourenglishcoachtheme'),
              value: attributes.card2Url || '',
              onChange: function (value) {
                setAttributes({ card2Url: value });
              },
            }),
            createElement('p', { style: { marginBottom: '8px' } }, __('Kolor overlay kafla 2', 'yourenglishcoachtheme')),
            createElement(ColorPalette, {
              value: attributes.card2OverlayColor || '#000000',
              onChange: function (value) {
                setAttributes({ card2OverlayColor: value || '#000000' });
              },
            }),
            createElement(RangeControl, {
              label: __('Krycie overlay 2 (%)', 'yourenglishcoachtheme'),
              min: 0,
              max: 100,
              value: card2OverlayOpacity,
              onChange: function (value) {
                setAttributes({ card2OverlayOpacity: value || 0 });
              },
            })
          )
        ),
        createElement(RichText, {
          tagName: 'h2',
          className: 'yec-for-whom__title',
          value: attributes.sectionTitle,
          placeholder: __('Tytul sekcji', 'yourenglishcoachtheme'),
          onChange: function (value) {
            setAttributes({ sectionTitle: value });
          },
        }),
        createElement(
          'div',
          { className: 'yec-for-whom__grid' },
          createElement(
            'a',
            {
              className: 'yec-for-whom__item',
              href: attributes.card1Url || '#',
              onClick: function (event) {
                event.preventDefault();
              },
            },
            attributes.card1ImageUrl
              ? createElement('img', {
                  className: 'yec-for-whom__image',
                  src: attributes.card1ImageUrl,
                  alt: attributes.card1ImageAlt || '',
                })
              : createElement('div', { className: 'yec-for-whom__placeholder' }, __('Wybierz obraz 1', 'yourenglishcoachtheme')),
            createElement('div', {
              className: 'yec-for-whom__overlay',
              style: {
                backgroundColor: attributes.card1OverlayColor || '#000000',
                opacity: Math.max(0, Math.min(100, card1OverlayOpacity)) / 100,
              },
            }),
            createElement(RichText, {
              tagName: 'span',
              className: 'yec-for-whom__item-text',
              value: attributes.card1Text,
              placeholder: __('Tekst na obrazie 1', 'yourenglishcoachtheme'),
              onChange: function (value) {
                setAttributes({ card1Text: value });
              },
            })
          ),
          createElement(
            'a',
            {
              className: 'yec-for-whom__item',
              href: attributes.card2Url || '#',
              onClick: function (event) {
                event.preventDefault();
              },
            },
            attributes.card2ImageUrl
              ? createElement('img', {
                  className: 'yec-for-whom__image',
                  src: attributes.card2ImageUrl,
                  alt: attributes.card2ImageAlt || '',
                })
              : createElement('div', { className: 'yec-for-whom__placeholder' }, __('Wybierz obraz 2', 'yourenglishcoachtheme')),
            createElement('div', {
              className: 'yec-for-whom__overlay',
              style: {
                backgroundColor: attributes.card2OverlayColor || '#000000',
                opacity: Math.max(0, Math.min(100, card2OverlayOpacity)) / 100,
              },
            }),
            createElement(RichText, {
              tagName: 'span',
              className: 'yec-for-whom__item-text',
              value: attributes.card2Text,
              placeholder: __('Tekst na obrazie 2', 'yourenglishcoachtheme'),
              onChange: function (value) {
                setAttributes({ card2Text: value });
              },
            })
          )
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
