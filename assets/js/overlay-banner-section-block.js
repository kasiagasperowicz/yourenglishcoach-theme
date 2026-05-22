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
  var ToggleControl = components.ToggleControl;
  var ColorPalette = components.ColorPalette;
  var createElement = element.createElement;
  var __ = i18n.__;

  registerBlockType('yec/overlay-banner-section', {
    title: __('YEC Overlay Banner', 'yourenglishcoachtheme'),
    description: __('Sekcja z obrazem, overlayem, dwoma tytulami i CTA na srodku.', 'yourenglishcoachtheme'),
    icon: 'cover-image',
    category: 'design',
    supports: {
      html: false,
    },
    attributes: {
      imageId: { type: 'number' },
      imageUrl: { type: 'string', default: '' },
      imageAlt: { type: 'string', default: '' },
      overlayColor: { type: 'string', default: '#000000' },
      overlayOpacity: { type: 'number', default: 35 },
      parallaxEnabled: { type: 'boolean', default: true },
      parallaxStrength: { type: 'number', default: 48 },
      titlePrimary: { type: 'string', default: 'Ucz sie wygodnie online' },
      titlePrimarySize: { type: 'string', default: 'large' },
      titleSecondary: { type: 'string', default: 'Elastyczny plan dopasowany do Ciebie' },
      titleSecondarySize: { type: 'string', default: 'small' },
      ctaText: { type: 'string', default: 'Umow konsultacje' },
      ctaUrl: { type: 'string', default: '/kontakt' },
      sectionSpaceTop: { type: 'number' },
      sectionSpaceBottom: { type: 'number' },
    },
    edit: function (props) {
      var attributes = props.attributes;
      var setAttributes = props.setAttributes;
      var overlayOpacity = Number.isFinite(attributes.overlayOpacity) ? attributes.overlayOpacity : 35;
      var parallaxEnabled = attributes.parallaxEnabled !== false;
      var parallaxStrength = Number.isFinite(attributes.parallaxStrength) ? attributes.parallaxStrength : 48;
      var sectionSpaceTop = Number.isFinite(attributes.sectionSpaceTop) ? attributes.sectionSpaceTop : 0;
      var sectionSpaceBottom = Number.isFinite(attributes.sectionSpaceBottom) ? attributes.sectionSpaceBottom : 0;
      var sectionSpacingStyle = {};

      if (Number.isFinite(attributes.sectionSpaceTop)) {
        sectionSpacingStyle.marginTop = sectionSpaceTop + 'px';
      }

      if (Number.isFinite(attributes.sectionSpaceBottom)) {
        sectionSpacingStyle.marginBottom = sectionSpaceBottom + 'px';
      }

      var blockProps = useBlockProps({
        className: 'yec-overlay-banner' + (parallaxEnabled ? ' is-parallax-enabled' : '') + ' yec-overlay-banner--primary-' + (attributes.titlePrimarySize || 'large') + ' yec-overlay-banner--secondary-' + (attributes.titleSecondarySize || 'small'),
        style: Object.keys(sectionSpacingStyle).length ? sectionSpacingStyle : undefined,
        'data-parallax-enabled': parallaxEnabled ? '1' : '0',
        'data-parallax-strength': String(Math.max(0, Math.min(120, parallaxStrength))),
      });

      var onSelectImage = function (media) {
        setAttributes({
          imageId: media && media.id ? media.id : undefined,
          imageUrl: media && media.url ? media.url : '',
          imageAlt: media && media.alt ? media.alt : '',
        });
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
              title: __('Ustawienia obrazu', 'yourenglishcoachtheme'),
              initialOpen: true,
            },
            createElement(MediaUploadCheck, {},
              createElement(MediaUpload, {
                onSelect: onSelectImage,
                allowedTypes: ['image'],
                value: attributes.imageId,
                render: function (renderProps) {
                  return createElement(Button, {
                    variant: 'secondary',
                    onClick: renderProps.open,
                  }, attributes.imageUrl ? __('Zmien obraz', 'yourenglishcoachtheme') : __('Wybierz obraz', 'yourenglishcoachtheme'));
                },
              })
            ),
            attributes.imageUrl
              ? createElement(Button, {
                  variant: 'link',
                  isDestructive: true,
                  onClick: function () {
                    setAttributes({ imageId: undefined, imageUrl: '', imageAlt: '' });
                  },
                }, __('Usun obraz', 'yourenglishcoachtheme'))
              : null
          ),
          createElement(
            PanelBody,
            {
              title: __('Ustawienia overlay', 'yourenglishcoachtheme'),
              initialOpen: true,
            },
            createElement('p', { style: { marginBottom: '8px' } }, __('Kolor overlay', 'yourenglishcoachtheme')),
            createElement(ColorPalette, {
              value: attributes.overlayColor || '#000000',
              onChange: function (value) {
                setAttributes({ overlayColor: value || '#000000' });
              },
            }),
            createElement(RangeControl, {
              label: __('Krycie overlay (%)', 'yourenglishcoachtheme'),
              min: 0,
              max: 100,
              value: overlayOpacity,
              onChange: function (value) {
                setAttributes({ overlayOpacity: value || 0 });
              },
            })
          ),
          createElement(
            PanelBody,
            {
              title: __('Ustawienia parallax', 'yourenglishcoachtheme'),
              initialOpen: true,
            },
            createElement(ToggleControl, {
              label: __('Wlacz efekt parallax', 'yourenglishcoachtheme'),
              checked: parallaxEnabled,
              onChange: function (value) {
                setAttributes({ parallaxEnabled: !!value });
              },
            }),
            createElement(RangeControl, {
              label: __('Sila efektu', 'yourenglishcoachtheme'),
              min: 0,
              max: 120,
              value: parallaxStrength,
              disabled: !parallaxEnabled,
              onChange: function (value) {
                setAttributes({ parallaxStrength: value || 0 });
              },
            })
          ),
          createElement(
            PanelBody,
            {
              title: __('Rozmiary tytulow', 'yourenglishcoachtheme'),
              initialOpen: true,
            },
            createElement(SelectControl, {
              label: __('Rozmiar pierwszego tytulu', 'yourenglishcoachtheme'),
              value: attributes.titlePrimarySize || 'large',
              options: [
                { label: __('Duzy', 'yourenglishcoachtheme'), value: 'large' },
                { label: __('Sredni', 'yourenglishcoachtheme'), value: 'medium' },
                { label: __('Maly', 'yourenglishcoachtheme'), value: 'small' },
              ],
              onChange: function (value) {
                setAttributes({ titlePrimarySize: value || 'large' });
              },
            }),
            createElement(SelectControl, {
              label: __('Rozmiar drugiego tytulu', 'yourenglishcoachtheme'),
              value: attributes.titleSecondarySize || 'small',
              options: [
                { label: __('Duzy', 'yourenglishcoachtheme'), value: 'large' },
                { label: __('Sredni', 'yourenglishcoachtheme'), value: 'medium' },
                { label: __('Maly', 'yourenglishcoachtheme'), value: 'small' },
              ],
              onChange: function (value) {
                setAttributes({ titleSecondarySize: value || 'small' });
              },
            })
          ),
          createElement(
            PanelBody,
            {
              title: __('Ustawienia CTA', 'yourenglishcoachtheme'),
              initialOpen: false,
            },
            createElement(TextControl, {
              label: __('Tekst przycisku', 'yourenglishcoachtheme'),
              value: attributes.ctaText,
              onChange: function (value) {
                setAttributes({ ctaText: value });
              },
            }),
            createElement(TextControl, {
              label: __('Link przycisku (URL)', 'yourenglishcoachtheme'),
              value: attributes.ctaUrl,
              onChange: function (value) {
                setAttributes({ ctaUrl: value });
              },
            })
          ),
          createElement(
            PanelBody,
            {
              title: __('Odstepy sekcji', 'yourenglishcoachtheme'),
              initialOpen: false,
            },
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
          )
        ),
        createElement(
          'div',
          { className: 'yec-overlay-banner__media' },
          attributes.imageUrl
            ? createElement('img', {
                className: 'yec-overlay-banner__image',
                src: attributes.imageUrl,
                alt: attributes.imageAlt || '',
              })
            : createElement('div', { className: 'yec-overlay-banner__placeholder' }, __('Wybierz obraz sekcji', 'yourenglishcoachtheme')),
          createElement('div', {
            className: 'yec-overlay-banner__overlay',
            style: {
              backgroundColor: attributes.overlayColor || '#000000',
              opacity: Math.max(0, Math.min(100, overlayOpacity)) / 100,
            },
          }),
          createElement(
            'div',
            { className: 'yec-overlay-banner__content' },
            createElement(RichText, {
              tagName: 'h2',
              className: 'yec-overlay-banner__title-primary',
              value: attributes.titlePrimary,
              placeholder: __('Pierwszy tytul', 'yourenglishcoachtheme'),
              onChange: function (value) {
                setAttributes({ titlePrimary: value });
              },
            }),
            createElement(RichText, {
              tagName: 'p',
              className: 'yec-overlay-banner__title-secondary',
              value: attributes.titleSecondary,
              placeholder: __('Drugi tytul', 'yourenglishcoachtheme'),
              onChange: function (value) {
                setAttributes({ titleSecondary: value });
              },
            }),
            createElement(
              'a',
              {
                className: 'yec-cta__button',
                href: attributes.ctaUrl || '#',
                onClick: function (event) {
                  event.preventDefault();
                },
              },
              attributes.ctaText || __('Umow konsultacje', 'yourenglishcoachtheme')
            )
          )
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);