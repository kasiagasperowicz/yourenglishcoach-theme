(function (blocks, blockEditor, components, element, i18n) {
  var registerBlockType = blocks.registerBlockType;
  var RichText = blockEditor.RichText;
  var InspectorControls = blockEditor.InspectorControls;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var useBlockProps = blockEditor.useBlockProps;
  var PanelBody = components.PanelBody;
  var TextControl = components.TextControl;
  var SelectControl = components.SelectControl;
  var BaseControl = components.BaseControl;
  var Button = components.Button;
  var createElement = element.createElement;
  var __ = i18n.__;

  registerBlockType('yec/image-text-section', {
    title: __('YEC Image + Text', 'yourenglishcoachtheme'),
    description: __('Sekcja 50/50 z obrazem 1:1 i trescia.', 'yourenglishcoachtheme'),
    icon: 'align-pull-left',
    category: 'design',
    supports: {
      html: false,
    },
    attributes: {
      eyebrow: {
        type: 'string',
        default: 'Poznajmy sie',
      },
      title: {
        type: 'string',
        default: 'Angielski dopasowany do Twoich celow',
      },
      contentText: {
        type: 'string',
        default: 'Pomagam doroslym i mlodziezy rozwijac swobode mowienia, slownictwo i pewnosc siebie.',
      },
      ctaText: {
        type: 'string',
        default: 'Sprawdz oferte',
      },
      ctaUrl: {
        type: 'string',
        default: '/oferta',
      },
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
      layout: {
        type: 'string',
        default: 'image-left',
      },
    },
    edit: function (props) {
      var attributes = props.attributes;
      var setAttributes = props.setAttributes;
      var blockProps = useBlockProps({
        className: 'yec-image-text-section yec-image-text-section--' + (attributes.layout || 'image-left'),
      });

      var onSelectImage = function (media) {
        setAttributes({
          imageId: media && media.id ? media.id : undefined,
          imageUrl: media && media.url ? media.url : '',
          imageAlt: media && media.alt ? media.alt : '',
        });
      };

      var onRemoveImage = function () {
        setAttributes({
          imageId: undefined,
          imageUrl: '',
          imageAlt: '',
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
              title: __('Uklad sekcji', 'yourenglishcoachtheme'),
              initialOpen: true,
            },
            createElement(SelectControl, {
              label: __('Kolejnosc kolumn', 'yourenglishcoachtheme'),
              value: attributes.layout || 'image-left',
              options: [
                { label: __('Obrazek + tekst', 'yourenglishcoachtheme'), value: 'image-left' },
                { label: __('Tekst + obrazek', 'yourenglishcoachtheme'), value: 'image-right' },
              ],
              onChange: function (value) {
                setAttributes({ layout: value });
              },
            })
          ),
          createElement(
            PanelBody,
            {
              title: __('Ustawienia CTA', 'yourenglishcoachtheme'),
              initialOpen: true,
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
            attributes.imageUrl ? createElement(Button, {
              variant: 'link',
              isDestructive: true,
              onClick: onRemoveImage,
            }, __('Usun obraz', 'yourenglishcoachtheme')) : null
          )
        ),
        attributes.imageUrl
          ? createElement(
              'div',
              { className: 'yec-image-text-section__media', 'aria-hidden': 'true' },
              createElement('img', {
                className: 'yec-image-text-section__image',
                src: attributes.imageUrl,
                alt: attributes.imageAlt || '',
              })
            )
          : null,
        createElement(
          'div',
          { className: 'yec-image-text-section__content' },
          createElement(RichText, {
            tagName: 'p',
            className: 'yec-image-text-section__eyebrow',
            value: attributes.eyebrow,
            placeholder: __('Poznajmy sie', 'yourenglishcoachtheme'),
            onChange: function (value) {
              setAttributes({ eyebrow: value });
            },
          }),
          createElement(RichText, {
            tagName: 'h2',
            className: 'yec-image-text-section__title',
            value: attributes.title,
            placeholder: __('Angielski dopasowany do Twoich celow', 'yourenglishcoachtheme'),
            onChange: function (value) {
              setAttributes({ title: value });
            },
          }),
          createElement(RichText, {
            tagName: 'p',
            className: 'yec-image-text-section__text',
            value: attributes.contentText,
            placeholder: __('Opisz jak wyglada wspolpraca i dla kogo sa lekcje.', 'yourenglishcoachtheme'),
            onChange: function (value) {
              setAttributes({ contentText: value });
            },
          }),
          createElement(
            BaseControl,
            {
              label: __('Przycisk CTA', 'yourenglishcoachtheme'),
              help: __('Tekst i link edytujesz w prawym panelu.', 'yourenglishcoachtheme'),
            },
            createElement(
              'a',
              {
                className: 'yec-cta__button',
                href: attributes.ctaUrl || '#',
                onClick: function (event) {
                  event.preventDefault();
                },
              },
              attributes.ctaText || __('Sprawdz oferte', 'yourenglishcoachtheme')
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
