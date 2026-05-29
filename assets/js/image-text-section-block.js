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
        default: 'Poznajmy się',
      },
      title: {
        type: 'string',
        default: 'Angielski dopasowany do Twoich celów',
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
      contentText: {
        type: 'string',
        default: 'Pomagam dorosłym i młodzieży rozwijać swobodę mówienia, słownictwo i pewność siebie.',
      },
      ctaText: {
        type: 'string',
        default: 'Sprawdź ofertę',
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
      layout: {
        type: 'string',
        default: 'image-left',
      },
      anchorId: {
        type: 'string',
        default: '',
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
        className: 'yec-image-text-section yec-image-text-section--' + (attributes.layout || 'image-left') + ' yec-image-text-section--title-' + titleSize,
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

      var onSelectMobileImage = function (media) {
        setAttributes({
          mobileImageId: media && media.id ? media.id : undefined,
          mobileImageUrl: media && media.url ? media.url : '',
          mobileImageAlt: media && media.alt ? media.alt : '',
        });
      };

      var onRemoveMobileImage = function () {
        setAttributes({
          mobileImageId: undefined,
          mobileImageUrl: '',
          mobileImageAlt: '',
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
              title: __('Układ sekcji', 'yourenglishcoachtheme'),
              initialOpen: true,
            },
            createElement(SelectControl, {
              label: __('Kolejność kolumn', 'yourenglishcoachtheme'),
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
              title: __('Ustawienia tytułu', 'yourenglishcoachtheme'),
              initialOpen: true,
            },
            createElement(SelectControl, {
              label: __('Rozmiar tytułu', 'yourenglishcoachtheme'),
              value: titleSize,
              options: [
                { label: __('Duży', 'yourenglishcoachtheme'), value: 'large' },
                { label: __('Średni', 'yourenglishcoachtheme'), value: 'medium' },
                { label: __('Mały', 'yourenglishcoachtheme'), value: 'small' },
              ],
              onChange: function (value) {
                setAttributes({ titleSize: value || 'medium' });
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
            attributes.imageUrl ? createElement(Button, {
              variant: 'link',
              isDestructive: true,
              onClick: onRemoveImage,
            }, __('Usuń obraz', 'yourenglishcoachtheme')) : null
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
            attributes.mobileImageUrl ? createElement(Button, {
              variant: 'link',
              isDestructive: true,
              onClick: onRemoveMobileImage,
            }, __('Usuń obraz mobile', 'yourenglishcoachtheme')) : null
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
            placeholder: __('Poznajmy się', 'yourenglishcoachtheme'),
            onChange: function (value) {
              setAttributes({ eyebrow: value });
            },
          }),
          createElement(RichText, {
            tagName: 'h2',
            className: 'yec-image-text-section__title',
            value: attributes.title,
            placeholder: __('Angielski dopasowany do Twoich celów', 'yourenglishcoachtheme'),
            onChange: function (value) {
              setAttributes({ title: value });
            },
          }),
          createElement(RichText, {
            tagName: 'p',
            className: 'yec-image-text-section__text',
            value: attributes.contentText,
            placeholder: __('Opisz jak wygląda współpraca i dla kogo są lekcje.', 'yourenglishcoachtheme'),
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
              attributes.ctaText || __('Sprawdź ofertę', 'yourenglishcoachtheme')
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
