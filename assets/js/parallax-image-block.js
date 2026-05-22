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
    },
    edit: function (props) {
      var attributes = props.attributes;
      var setAttributes = props.setAttributes;
      var imageId = attributes.imageId;
      var imageUrl = attributes.imageUrl || '';
      var imageAlt = attributes.imageAlt || '';
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
            imageUrl
              ? createElement('img', {
                  className: 'yec-parallax-image__img',
                  src: imageUrl,
                  alt: imageAlt,
                })
              : createElement(
                  'div',
                  { className: 'yec-parallax-image__placeholder' },
                  __('Wybierz obraz, aby aktywowac sekcje parallax.', 'yourenglishcoachtheme')
                )
          ),
          createElement(MediaUploadCheck, {},
            createElement(MediaUpload, {
              onSelect: function (media) {
                setAttributes({
                  imageId: media && media.id ? media.id : undefined,
                  imageUrl: media && media.url ? media.url : '',
                  imageAlt: media && media.alt ? media.alt : '',
                });
              },
              allowedTypes: ['image'],
              value: imageId,
              render: function (renderProps) {
                return createElement(Button, {
                  variant: 'secondary',
                  onClick: renderProps.open,
                  style: { marginTop: '12px' },
                }, imageUrl ? __('Zmien obraz', 'yourenglishcoachtheme') : __('Wybierz obraz', 'yourenglishcoachtheme'));
              },
            })
          ),
          imageUrl
            ? createElement(Button, {
                variant: 'link',
                isDestructive: true,
                onClick: function () {
                  setAttributes({ imageId: undefined, imageUrl: '', imageAlt: '' });
                },
              }, __('Usun obraz', 'yourenglishcoachtheme'))
            : null
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);