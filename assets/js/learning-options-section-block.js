(function (blocks, blockEditor, components, element, i18n) {
  var registerBlockType = blocks.registerBlockType;
  var RichText = blockEditor.RichText;
  var InspectorControls = blockEditor.InspectorControls;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var useBlockProps = blockEditor.useBlockProps;
  var PanelBody = components.PanelBody;
  var SelectControl = components.SelectControl;
  var RangeControl = components.RangeControl;
  var Button = components.Button;
  var TextControl = components.TextControl;
  var createElement = element.createElement;
  var __ = i18n.__;

  registerBlockType('yec/learning-options-section', {
    title: __('YEC Jak możesz uczyć się ze mną', 'yourenglishcoachtheme'),
    description: __('Sekcja z tytulem i trzema kafelkami: tytul, tresc i zdjecie.', 'yourenglishcoachtheme'),
    icon: 'welcome-learn-more',
    category: 'design',
    supports: {
      html: false,
    },
    attributes: {
      sectionTitle: { type: 'string', default: 'Jak możesz uczyć się ze mną' },
      titleSize: { type: 'string', default: 'medium' },
      sectionSpaceTop: { type: 'number' },
      sectionSpaceBottom: { type: 'number' },
      card1Title: { type: 'string', default: 'Lekcje indywidualne' },
      card1Text: { type: 'string', default: 'Spotkania 1:1 dopasowane do Twoich celów i tempa pracy.' },
      card1ImageId: { type: 'number' },
      card1ImageUrl: { type: 'string', default: '' },
      card1ImageAlt: { type: 'string', default: '' },
      card1MobileImageId: { type: 'number' },
      card1MobileImageUrl: { type: 'string', default: '' },
      card1MobileImageAlt: { type: 'string', default: '' },
      card2Title: { type: 'string', default: 'Konwersacje tematyczne' },
      card2Text: { type: 'string', default: 'Praktyczne rozmowy, które pomagają swobodnie mówić po angielsku.' },
      card2ImageId: { type: 'number' },
      card2ImageUrl: { type: 'string', default: '' },
      card2ImageAlt: { type: 'string', default: '' },
      card2MobileImageId: { type: 'number' },
      card2MobileImageUrl: { type: 'string', default: '' },
      card2MobileImageAlt: { type: 'string', default: '' },
      card3Title: { type: 'string', default: 'Wsparcie do egzaminów' },
      card3Text: { type: 'string', default: 'Materiały i plan nauki skoncentrowane na Twoim wyniku.' },
      card3ImageId: { type: 'number' },
      card3ImageUrl: { type: 'string', default: '' },
      card3ImageAlt: { type: 'string', default: '' },
      card3MobileImageId: { type: 'number' },
      card3MobileImageUrl: { type: 'string', default: '' },
      card3MobileImageAlt: { type: 'string', default: '' },
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
        className: 'yec-learning-section yec-learning-section--title-' + titleSize,
        style: Object.keys(sectionSpacingStyle).length ? sectionSpacingStyle : undefined,
      });

      var cards = [
        { titleKey: 'card1Title', textKey: 'card1Text', imageIdKey: 'card1ImageId', imageUrlKey: 'card1ImageUrl', imageAltKey: 'card1ImageAlt', mobileImageIdKey: 'card1MobileImageId', mobileImageUrlKey: 'card1MobileImageUrl', mobileImageAltKey: 'card1MobileImageAlt' },
        { titleKey: 'card2Title', textKey: 'card2Text', imageIdKey: 'card2ImageId', imageUrlKey: 'card2ImageUrl', imageAltKey: 'card2ImageAlt', mobileImageIdKey: 'card2MobileImageId', mobileImageUrlKey: 'card2MobileImageUrl', mobileImageAltKey: 'card2MobileImageAlt' },
        { titleKey: 'card3Title', textKey: 'card3Text', imageIdKey: 'card3ImageId', imageUrlKey: 'card3ImageUrl', imageAltKey: 'card3ImageAlt', mobileImageIdKey: 'card3MobileImageId', mobileImageUrlKey: 'card3MobileImageUrl', mobileImageAltKey: 'card3MobileImageAlt' },
      ];

      return createElement(
        'section',
        blockProps,
        createElement(
          InspectorControls,
          null,
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
          cards.map(function (card, index) {
            return createElement(
              PanelBody,
              {
                title: __('Zdjęcie kafelka ', 'yourenglishcoachtheme') + (index + 1),
                initialOpen: false,
                key: 'learning-image-panel-' + index,
              },
              createElement('p', { style: { margin: '0 0 6px', fontWeight: 600, fontSize: '12px' } }, __('Zdjęcie desktop', 'yourenglishcoachtheme')),
              createElement(MediaUploadCheck, {},
                createElement(MediaUpload, {
                  onSelect: function (media) {
                    var update = {};
                    update[card.imageIdKey] = media && media.id ? media.id : undefined;
                    update[card.imageUrlKey] = media && media.url ? media.url : '';
                    update[card.imageAltKey] = media && media.alt ? media.alt : '';
                    setAttributes(update);
                  },
                  allowedTypes: ['image'],
                  value: attributes[card.imageIdKey],
                  render: function (renderProps) {
                    return createElement(Button, {
                      variant: 'secondary',
                      onClick: renderProps.open,
                    }, attributes[card.imageUrlKey] ? __('Zmień zdjęcie', 'yourenglishcoachtheme') : __('Wybierz zdjęcie', 'yourenglishcoachtheme'));
                  },
                })
              ),
              attributes[card.imageUrlKey]
                ? createElement(Button, {
                    variant: 'link',
                    isDestructive: true,
                    onClick: function () {
                      var update = {};
                      update[card.imageIdKey] = undefined;
                      update[card.imageUrlKey] = '';
                      update[card.imageAltKey] = '';
                      setAttributes(update);
                    },
                  }, __('Usuń zdjęcie', 'yourenglishcoachtheme'))
                : null,
              createElement('p', { style: { margin: '12px 0 4px', fontSize: '12px', color: '#757575' } }, __('Zdjęcie mobile (opcjonalnie — fallback: desktop)', 'yourenglishcoachtheme')),
              createElement(MediaUploadCheck, {},
                createElement(MediaUpload, {
                  onSelect: function (media) {
                    var update = {};
                    update[card.mobileImageIdKey] = media && media.id ? media.id : undefined;
                    update[card.mobileImageUrlKey] = media && media.url ? media.url : '';
                    update[card.mobileImageAltKey] = media && media.alt ? media.alt : '';
                    setAttributes(update);
                  },
                  allowedTypes: ['image'],
                  value: attributes[card.mobileImageIdKey],
                  render: function (renderProps) {
                    return createElement(Button, {
                      variant: 'secondary',
                      onClick: renderProps.open,
                    }, attributes[card.mobileImageUrlKey] ? __('Zmień zdjęcie mobile', 'yourenglishcoachtheme') : __('Wybierz zdjęcie mobile', 'yourenglishcoachtheme'));
                  },
                })
              ),
              attributes[card.mobileImageUrlKey]
                ? createElement(Button, {
                    variant: 'link',
                    isDestructive: true,
                    onClick: function () {
                      var update = {};
                      update[card.mobileImageIdKey] = undefined;
                      update[card.mobileImageUrlKey] = '';
                      update[card.mobileImageAltKey] = '';
                      setAttributes(update);
                    },
                  }, __('Usuń zdjęcie mobile', 'yourenglishcoachtheme'))
                : null
            );
          }),
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
        createElement(RichText, {
          tagName: 'h2',
          className: 'yec-learning-section__title',
          value: attributes.sectionTitle,
          placeholder: __('Jak możesz uczyć się ze mną', 'yourenglishcoachtheme'),
          onChange: function (value) {
            setAttributes({ sectionTitle: value });
          },
        }),
        createElement(
          'div',
          { className: 'yec-learning-section__grid' },
          cards.map(function (card, index) {
            return createElement(
              'article',
              { className: 'yec-learning-section__card', key: 'learning-card-' + index },
              createElement(RichText, {
                tagName: 'h3',
                className: 'yec-learning-section__card-title',
                value: attributes[card.titleKey],
                placeholder: __('Tytuł kafelka', 'yourenglishcoachtheme'),
                onChange: function (value) {
                  var update = {};
                  update[card.titleKey] = value;
                  setAttributes(update);
                },
              }),
              createElement(RichText, {
                tagName: 'p',
                className: 'yec-learning-section__card-text',
                value: attributes[card.textKey],
                placeholder: __('Treść kafelka', 'yourenglishcoachtheme'),
                onChange: function (value) {
                  var update = {};
                  update[card.textKey] = value;
                  setAttributes(update);
                },
              }),
              attributes[card.imageUrlKey]
                ? createElement(
                    'div',
                    { className: 'yec-learning-section__media' },
                    createElement('img', {
                      className: 'yec-learning-section__image',
                      src: attributes[card.imageUrlKey],
                      alt: attributes[card.imageAltKey] || '',
                    })
                  )
                : createElement(
                    'div',
                    { className: 'yec-learning-section__placeholder' },
                    __('Dodaj zdjecie w ustawieniach bloku.', 'yourenglishcoachtheme')
                  )
            );
          })
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);