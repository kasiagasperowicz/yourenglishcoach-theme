(function (blocks, blockEditor, components, element, i18n) {
  var registerBlockType = blocks.registerBlockType;
  var RichText = blockEditor.RichText;
  var InspectorControls = blockEditor.InspectorControls;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var useBlockProps = blockEditor.useBlockProps;
  var PanelBody = components.PanelBody;
  var TextControl = components.TextControl;
  var Button = components.Button;
  var BaseControl = components.BaseControl;
  var createElement = element.createElement;
  var __ = i18n.__;

  registerBlockType('yec/hero-section', {
    title: __('YEC Hero Section', 'yourenglishcoachtheme'),
    description: __('Sekcja z eyebrow, title, subtitle, CTA i szarym tlem.', 'yourenglishcoachtheme'),
    icon: 'cover-image',
    category: 'design',
    supports: {
      html: false,
    },
    attributes: {
      eyebrow: {
        type: 'string',
        default: 'Eyebrow',
      },
      title: {
        type: 'string',
        default: 'Tytul sekcji',
      },
      subtitle: {
        type: 'string',
        default: 'Krotki opis sekcji.',
      },
      ctaText: {
        type: 'string',
        default: 'Skontaktuj sie',
      },
      ctaUrl: {
        type: 'string',
        default: '/kontakt',
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
    },
    edit: function (props) {
      var attributes = props.attributes;
      var setAttributes = props.setAttributes;
      var blockProps = useBlockProps({ className: 'yec-editable-section' });

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
              title: __('Ustawienia CTA', 'yourenglishcoachtheme'),
              initialOpen: true,
            },
            createElement(TextControl, {
              label: __('Tekst przycisku', 'yourenglishcoachtheme'),
              help: __('To jest tekst widoczny na przycisku CTA.', 'yourenglishcoachtheme'),
              value: attributes.ctaText,
              onChange: function (value) {
                setAttributes({ ctaText: value });
              },
            }),
            createElement(TextControl, {
              label: __('Link przycisku (URL)', 'yourenglishcoachtheme'),
              help: __('Wpisz pelny adres lub sciezke, np. /kontakt.', 'yourenglishcoachtheme'),
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
        createElement(
          'div',
          { className: 'yec-editable-section__content' },
          createElement(RichText, {
            tagName: 'p',
            className: 'yec-editable-section__eyebrow',
            value: attributes.eyebrow,
            placeholder: __('Eyebrow', 'yourenglishcoachtheme'),
            onChange: function (value) {
              setAttributes({ eyebrow: value });
            },
          }),
          createElement(RichText, {
            tagName: 'h1',
            className: 'yec-editable-section__title',
            value: attributes.title,
            placeholder: __('Tytul sekcji', 'yourenglishcoachtheme'),
            onChange: function (value) {
              setAttributes({ title: value });
            },
          }),
          createElement(RichText, {
            tagName: 'p',
            className: 'yec-editable-section__subtitle',
            value: attributes.subtitle,
            placeholder: __('Krotki opis sekcji.', 'yourenglishcoachtheme'),
            onChange: function (value) {
              setAttributes({ subtitle: value });
            },
          }),
          createElement(
            BaseControl,
            {
              label: __('Przycisk CTA', 'yourenglishcoachtheme'),
              help: __('Tekst i link edytujesz w prawym panelu w sekcji Ustawienia CTA.', 'yourenglishcoachtheme'),
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
              attributes.ctaText || __('Skontaktuj sie', 'yourenglishcoachtheme')
            )
          )
        ),
        createElement(
          'div',
          { className: 'yec-editable-section__media', 'aria-hidden': 'true' },
          attributes.imageUrl
            ? createElement('img', {
                className: 'yec-editable-section__image',
                src: attributes.imageUrl,
                alt: attributes.imageAlt || '',
              })
            : createElement(
                'div',
                { style: { padding: '36px 20px', textAlign: 'center', color: '#666' } },
                __('Brak obrazu: kliknij "Wybierz obraz".', 'yourenglishcoachtheme')
              ),
          createElement(MediaUploadCheck, {},
            createElement(MediaUpload, {
              onSelect: onSelectImage,
              allowedTypes: ['image'],
              value: attributes.imageId,
              render: function (renderProps) {
                return createElement(Button, {
                  variant: 'secondary',
                  onClick: renderProps.open,
                  style: { margin: '12px 0 0' },
                }, attributes.imageUrl ? __('Zmien obraz', 'yourenglishcoachtheme') : __('Dodaj obraz', 'yourenglishcoachtheme'));
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
