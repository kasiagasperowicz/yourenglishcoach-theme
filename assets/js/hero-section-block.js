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
  var RangeControl = components.RangeControl;
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
        default: 'Angielski dla doroslych i mlodziezy',
      },
      title: {
        type: 'string',
        default: 'Mow po angielsku pewnie i swobodnie',
      },
      titleSize: {
        type: 'string',
        default: 'medium',
      },
      sectionSpaceTop: {
        type: 'number',
      },
      sectionSpaceBottom: {
        type: 'number',
      },
      subtitle: {
        type: 'string',
        default: 'Indywidualne lekcje online, ktore pomoga Ci w pracy, na egzaminie i w codziennej komunikacji.',
      },
      ctaText: {
        type: 'string',
        default: 'Umow konsultacje',
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
      layout: {
        type: 'string',
        default: 'text-first',
      },
    },
    edit: function (props) {
      var attributes = props.attributes;
      var setAttributes = props.setAttributes;
      var titleSize = attributes.titleSize || 'medium';
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
        className: 'yec-editable-section yec-editable-section--' + (attributes.layout || 'text-first') + ' yec-editable-section--title-' + titleSize,
        style: Object.keys(sectionSpacingStyle).length ? sectionSpacingStyle : undefined,
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
              label: __('Kolejnosc elementow', 'yourenglishcoachtheme'),
              value: attributes.layout || 'text-first',
              options: [
                { label: __('Tekst + obrazek', 'yourenglishcoachtheme'), value: 'text-first' },
                { label: __('Obrazek + tekst', 'yourenglishcoachtheme'), value: 'image-first' },
              ],
              onChange: function (value) {
                setAttributes({ layout: value });
              },
            })
          ),
          createElement(
            PanelBody,
            {
              title: __('Ustawienia tytulu', 'yourenglishcoachtheme'),
              initialOpen: true,
            },
            createElement(SelectControl, {
              label: __('Rozmiar tytulu', 'yourenglishcoachtheme'),
              value: titleSize,
              options: [
                { label: __('Duzy', 'yourenglishcoachtheme'), value: 'large' },
                { label: __('Sredni', 'yourenglishcoachtheme'), value: 'medium' },
                { label: __('Maly', 'yourenglishcoachtheme'), value: 'small' },
              ],
              onChange: function (value) {
                setAttributes({ titleSize: value || 'medium' });
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
          ),
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
            placeholder: __('Angielski dla doroslych i mlodziezy', 'yourenglishcoachtheme'),
            onChange: function (value) {
              setAttributes({ eyebrow: value });
            },
          }),
          createElement(RichText, {
            tagName: 'h1',
            className: 'yec-editable-section__title',
            value: attributes.title,
            placeholder: __('Mow po angielsku pewnie i swobodnie', 'yourenglishcoachtheme'),
            onChange: function (value) {
              setAttributes({ title: value });
            },
          }),
          createElement(RichText, {
            tagName: 'p',
            className: 'yec-editable-section__subtitle',
            value: attributes.subtitle,
            placeholder: __('Indywidualne lekcje online dopasowane do Twoich celow.', 'yourenglishcoachtheme'),
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
              attributes.ctaText || __('Umow konsultacje', 'yourenglishcoachtheme')
            )
          )
        ),
        attributes.imageUrl
          ? createElement(
              'div',
              { className: 'yec-editable-section__media', 'aria-hidden': 'true' },
              createElement('img', {
                className: 'yec-editable-section__image',
                src: attributes.imageUrl,
                alt: attributes.imageAlt || '',
              })
            )
          : null,
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
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
