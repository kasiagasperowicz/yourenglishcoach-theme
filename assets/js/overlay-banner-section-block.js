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
      mobileImageId: { type: 'number' },
      mobileImageUrl: { type: 'string', default: '' },
      mobileImageAlt: { type: 'string', default: '' },
      overlayColor: { type: 'string', default: '#000000' },
      overlayOpacity: { type: 'number', default: 35 },
      parallaxEnabled: { type: 'boolean', default: true },
      parallaxStrength: { type: 'number', default: 48 },
      titlePrimary: { type: 'string', default: 'Ucz się wygodnie online' },
      titlePrimarySize: { type: 'string', default: 'large' },
      titleSecondary: { type: 'string', default: 'Elastyczny plan dopasowany do Ciebie' },
      titleSecondarySize: { type: 'string', default: 'small' },
      ctaText: { type: 'string', default: 'Umów konsultację' },
      ctaUrl: { type: 'string', default: '/kontakt' },
      anchorId: { type: 'string', default: '' },
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

      var onSelectMobileImage = function (media) {
        setAttributes({
          mobileImageId: media && media.id ? media.id : undefined,
          mobileImageUrl: media && media.url ? media.url : '',
          mobileImageAlt: media && media.alt ? media.alt : '',
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
              title: __('Obraz — desktop', 'yourenglishcoachtheme'),
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
                  }, attributes.imageUrl ? __('Zmień obraz', 'yourenglishcoachtheme') : __('Wybierz obraz', 'yourenglishcoachtheme'));
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
                }, __('Usuń obraz', 'yourenglishcoachtheme'))
              : null
          ),
          createElement(
            PanelBody,
            {
              title: __('Obraz — mobile (opcjonalnie)', 'yourenglishcoachtheme'),
              initialOpen: false,
            },
            createElement('p', { style: { marginBottom: '8px', fontSize: '12px', color: '#757575' } }, __('Jeśli puste, używany jest obraz desktop.', 'yourenglishcoachtheme')),
            createElement(MediaUploadCheck, {},
              createElement(MediaUpload, {
                onSelect: onSelectMobileImage,
                allowedTypes: ['image'],
                value: attributes.mobileImageId,
                render: function (renderProps) {
                  return createElement(Button, {
                    variant: 'secondary',
                    onClick: renderProps.open,
                  }, attributes.mobileImageUrl ? __('Zmień obraz mobile', 'yourenglishcoachtheme') : __('Wybierz obraz mobile', 'yourenglishcoachtheme'));
                },
              })
            ),
            attributes.mobileImageUrl
              ? createElement(Button, {
                  variant: 'link',
                  isDestructive: true,
                  onClick: function () {
                    setAttributes({ mobileImageId: undefined, mobileImageUrl: '', mobileImageAlt: '' });
                  },
                }, __('Usuń obraz mobile', 'yourenglishcoachtheme'))
              : null
          ),
          createElement(
            PanelBody,
            {
              title: __('Ustawienia nakładki', 'yourenglishcoachtheme'),
              initialOpen: true,
            },
            createElement('p', { style: { marginBottom: '8px' } }, __('Kolor nakładki', 'yourenglishcoachtheme')),
            createElement(ColorPalette, {
              value: attributes.overlayColor || '#000000',
              onChange: function (value) {
                setAttributes({ overlayColor: value || '#000000' });
              },
            }),
            createElement(RangeControl, {
              label: __('Krycie nakładki (%)', 'yourenglishcoachtheme'),
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
              label: __('Włącz efekt parallax', 'yourenglishcoachtheme'),
              checked: parallaxEnabled,
              onChange: function (value) {
                setAttributes({ parallaxEnabled: !!value });
              },
            }),
            createElement(RangeControl, {
              label: __('Siła efektu', 'yourenglishcoachtheme'),
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
              title: __('Rozmiary tytułów', 'yourenglishcoachtheme'),
              initialOpen: true,
            },
            createElement(SelectControl, {
              label: __('Rozmiar pierwszego tytułu', 'yourenglishcoachtheme'),
              value: attributes.titlePrimarySize || 'large',
              options: [
                { label: __('Duży', 'yourenglishcoachtheme'), value: 'large' },
                { label: __('Średni', 'yourenglishcoachtheme'), value: 'medium' },
                { label: __('Mały', 'yourenglishcoachtheme'), value: 'small' },
              ],
              onChange: function (value) {
                setAttributes({ titlePrimarySize: value || 'large' });
              },
            }),
            createElement(SelectControl, {
              label: __('Rozmiar drugiego tytułu', 'yourenglishcoachtheme'),
              value: attributes.titleSecondarySize || 'small',
              options: [
                { label: __('Duży', 'yourenglishcoachtheme'), value: 'large' },
                { label: __('Średni', 'yourenglishcoachtheme'), value: 'medium' },
                { label: __('Mały', 'yourenglishcoachtheme'), value: 'small' },
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
              title: __('Odstępy sekcji', 'yourenglishcoachtheme'),
              initialOpen: false,
            },
            createElement(RangeControl, {
              label: __('Przestrzeń nad sekcją (px)', 'yourenglishcoachtheme'),
              min: 0,
              max: 240,
              value: sectionSpaceTop,
              onChange: function (value) {
                setAttributes({ sectionSpaceTop: value || 0 });
              },
            }),
            createElement(RangeControl, {
              label: __('Przestrzeń pod sekcją (px)', 'yourenglishcoachtheme'),
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
              title: __('Anchor / ID sekcji', 'yourenglishcoachtheme'),
              initialOpen: false,
            },
            createElement(TextControl, {
              label: __('ID sekcji (anchor)', 'yourenglishcoachtheme'),
              help: __('Np. opinie-google — wpisz #id-sekcji w URL przycisku CTA innej sekcji.', 'yourenglishcoachtheme'),
              value: attributes.anchorId || '',
              onChange: function (value) {
                setAttributes({ anchorId: value });
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
              placeholder: __('Pierwszy tytuł', 'yourenglishcoachtheme'),
              onChange: function (value) {
                setAttributes({ titlePrimary: value });
              },
            }),
            createElement(RichText, {
              tagName: 'p',
              className: 'yec-overlay-banner__title-secondary',
              value: attributes.titleSecondary,
              placeholder: __('Drugi tytuł', 'yourenglishcoachtheme'),
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
              attributes.ctaText || __('Umów konsultację', 'yourenglishcoachtheme')
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