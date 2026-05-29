(function (blocks, blockEditor, components, element, i18n) {
  var registerBlockType = blocks.registerBlockType;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var Button = components.Button;
  var ToggleControl = components.ToggleControl;
  var RangeControl = components.RangeControl;
  var TextControl = components.TextControl;
  var createElement = element.createElement;
  var Fragment = element.Fragment;
  var __ = i18n.__;

  registerBlockType('yec/parallax-image', {
    title: __('YEC Parallax Image', 'yourenglishcoachtheme'),
    description: __('Pelna szerokosc obrazu z regulowanym efektem parallax.', 'yourenglishcoachtheme'),
    icon: 'format-image',
    category: 'design',
    supports: {
      html: false,
    },
    attributes: {
      imageId: {
        type: 'number',
      },
      imageUrl: {
        type: 'string',
        default: '',
      },
      imageAlt: {
        type: 'string',
        default: '',
      },
      mobileImageId: {
        type: 'number',
      },
      mobileImageUrl: {
        type: 'string',
        default: '',
      },
      mobileImageAlt: {
        type: 'string',
        default: '',
      },
      parallaxEnabled: {
        type: 'boolean',
        default: true,
      },
      parallaxStrength: {
        type: 'number',
        default: 48,
      },
      sectionSpaceTop: {
        type: 'number',
      },
      sectionSpaceBottom: {
        type: 'number',
      },
      anchorId: {
        type: 'string',
        default: '',
      },
    },
    edit: function (props) {
      var attributes = props.attributes;
      var setAttributes = props.setAttributes;
      var imageId = attributes.imageId;
      var imageUrl = attributes.imageUrl || '';
      var imageAlt = attributes.imageAlt || '';
      var mobileImageId = attributes.mobileImageId;
      var mobileImageUrl = attributes.mobileImageUrl || '';
      var mobileImageAlt = attributes.mobileImageAlt || '';
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
        className: 'yec-parallax-image' + (parallaxEnabled ? ' is-parallax-enabled' : ''),
        style: Object.keys(sectionSpacingStyle).length ? sectionSpacingStyle : undefined,
      });

      var desktopPreviewUrl = imageUrl || mobileImageUrl;
      var desktopPreviewAlt = imageAlt || mobileImageAlt;
      var mobilePreviewUrl = mobileImageUrl || imageUrl;
      var mobilePreviewAlt = mobileImageAlt || imageAlt;

      var renderImageControl = function (label, currentImageUrl, currentImageAlt, currentImageId, onSelect, onClear) {
        return createElement(
          'div',
          { style: { marginBottom: '16px' } },
          createElement('p', { style: { margin: '0 0 8px', fontWeight: 600 } }, label),
          currentImageUrl
            ? createElement('img', {
                src: currentImageUrl,
                alt: currentImageAlt,
                style: {
                  display: 'block',
                  width: '100%',
                  maxWidth: '100%',
                  height: 'auto',
                  marginBottom: '8px',
                  borderRadius: '8px',
                },
              })
            : null,
          createElement(MediaUploadCheck, {},
            createElement(MediaUpload, {
              onSelect: onSelect,
              allowedTypes: ['image'],
              value: currentImageId,
              render: function (renderProps) {
                return createElement(Button, {
                  variant: 'secondary',
                  onClick: renderProps.open,
                }, currentImageUrl ? __('Zmień obraz', 'yourenglishcoachtheme') : __('Wybierz obraz', 'yourenglishcoachtheme'));
              },
            })
          ),
          currentImageUrl
            ? createElement(Button, {
                variant: 'link',
                isDestructive: true,
                onClick: onClear,
                style: { display: 'block', marginTop: '6px' },
              }, __('Usuń obraz', 'yourenglishcoachtheme'))
            : null
        );
      };

      return createElement(
        Fragment,
        null,
        createElement(
          InspectorControls,
          null,
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
            }),
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
              title: __('Obrazy responsywne', 'yourenglishcoachtheme'),
              initialOpen: false,
            },
            renderImageControl(
              __('Obraz — desktop', 'yourenglishcoachtheme'),
              imageUrl,
              imageAlt,
              imageId,
              function (media) {
                setAttributes({
                  imageId: media && media.id ? media.id : undefined,
                  imageUrl: media && media.url ? media.url : '',
                  imageAlt: media && media.alt ? media.alt : '',
                });
              },
              function () {
                setAttributes({ imageId: undefined, imageUrl: '', imageAlt: '' });
              }
            ),
            renderImageControl(
              __('Obraz — mobile (opcjonalnie)', 'yourenglishcoachtheme'),
              mobileImageUrl,
              mobileImageAlt,
              mobileImageId,
              function (media) {
                setAttributes({
                  mobileImageId: media && media.id ? media.id : undefined,
                  mobileImageUrl: media && media.url ? media.url : '',
                  mobileImageAlt: media && media.alt ? media.alt : '',
                });
              },
              function () {
                setAttributes({ mobileImageId: undefined, mobileImageUrl: '', mobileImageAlt: '' });
              }
            )
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
          'section',
          blockProps,
          createElement(
            'div',
            {
              className: 'yec-parallax-image__media',
              style: {
                '--yec-parallax-strength': String(parallaxStrength),
              },
            },
            desktopPreviewUrl
              ? createElement(
                  'picture',
                  null,
                  createElement('source', {
                    media: '(max-width: 860px)',
                    srcSet: mobilePreviewUrl,
                  }),
                  createElement('img', {
                    className: 'yec-parallax-image__img',
                    src: desktopPreviewUrl,
                    alt: desktopPreviewAlt,
                  })
                )
              : createElement(
                  'div',
                  { className: 'yec-parallax-image__placeholder' },
                  __('Wybierz obraz, aby aktywować sekcję parallax.', 'yourenglishcoachtheme')
                )
          ),
          null
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);