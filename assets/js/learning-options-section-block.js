(function (blocks, blockEditor, components, element, i18n) {
  var registerBlockType = blocks.registerBlockType;
  var RichText = blockEditor.RichText;
  var InspectorControls = blockEditor.InspectorControls;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var useBlockProps = blockEditor.useBlockProps;
  var PanelBody = components.PanelBody;
  var SelectControl = components.SelectControl;
  var Button = components.Button;
  var createElement = element.createElement;
  var __ = i18n.__;

  registerBlockType('yec/learning-options-section', {
    title: __('YEC Jak mozesz uczyc sie ze mna', 'yourenglishcoachtheme'),
    description: __('Sekcja z tytulem i trzema kafelkami: tytul, tresc i zdjecie.', 'yourenglishcoachtheme'),
    icon: 'welcome-learn-more',
    category: 'design',
    supports: {
      html: false,
    },
    attributes: {
      sectionTitle: { type: 'string', default: 'Jak mozesz uczyc sie ze mna' },
      titleSize: { type: 'string', default: 'medium' },
      card1Title: { type: 'string', default: 'Lekcje indywidualne' },
      card1Text: { type: 'string', default: 'Spotkania 1:1 dopasowane do Twoich celow i tempa pracy.' },
      card1ImageId: { type: 'number' },
      card1ImageUrl: { type: 'string', default: '' },
      card1ImageAlt: { type: 'string', default: '' },
      card2Title: { type: 'string', default: 'Konwersacje tematyczne' },
      card2Text: { type: 'string', default: 'Praktyczne rozmowy, ktore pomagaja swobodnie mowic po angielsku.' },
      card2ImageId: { type: 'number' },
      card2ImageUrl: { type: 'string', default: '' },
      card2ImageAlt: { type: 'string', default: '' },
      card3Title: { type: 'string', default: 'Wsparcie do egzaminow' },
      card3Text: { type: 'string', default: 'Materialy i plan nauki skoncentrowane na Twoim wyniku.' },
      card3ImageId: { type: 'number' },
      card3ImageUrl: { type: 'string', default: '' },
      card3ImageAlt: { type: 'string', default: '' },
    },
    edit: function (props) {
      var attributes = props.attributes;
      var setAttributes = props.setAttributes;
      var titleSize = attributes.titleSize || 'medium';
      var blockProps = useBlockProps({
        className: 'yec-learning-section yec-learning-section--title-' + titleSize,
      });

      var cards = [
        { titleKey: 'card1Title', textKey: 'card1Text', imageIdKey: 'card1ImageId', imageUrlKey: 'card1ImageUrl', imageAltKey: 'card1ImageAlt' },
        { titleKey: 'card2Title', textKey: 'card2Text', imageIdKey: 'card2ImageId', imageUrlKey: 'card2ImageUrl', imageAltKey: 'card2ImageAlt' },
        { titleKey: 'card3Title', textKey: 'card3Text', imageIdKey: 'card3ImageId', imageUrlKey: 'card3ImageUrl', imageAltKey: 'card3ImageAlt' },
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
          cards.map(function (card, index) {
            return createElement(
              PanelBody,
              {
                title: __('Zdjecie kafelka ', 'yourenglishcoachtheme') + (index + 1),
                initialOpen: false,
                key: 'learning-image-panel-' + index,
              },
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
                    }, attributes[card.imageUrlKey] ? __('Zmien zdjecie', 'yourenglishcoachtheme') : __('Wybierz zdjecie', 'yourenglishcoachtheme'));
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
                  }, __('Usun zdjecie', 'yourenglishcoachtheme'))
                : null
            );
          })
        ),
        createElement(RichText, {
          tagName: 'h2',
          className: 'yec-learning-section__title',
          value: attributes.sectionTitle,
          placeholder: __('Jak mozesz uczyc sie ze mna', 'yourenglishcoachtheme'),
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
                placeholder: __('Tytul kafelka', 'yourenglishcoachtheme'),
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
                placeholder: __('Tresc kafelka', 'yourenglishcoachtheme'),
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