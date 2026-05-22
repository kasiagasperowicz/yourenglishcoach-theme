(function (blocks, blockEditor, components, element, i18n) {
  var registerBlockType = blocks.registerBlockType;
  var RichText = blockEditor.RichText;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var Button = components.Button;
  var RangeControl = components.RangeControl;
  var TextControl = components.TextControl;
  var SelectControl = components.SelectControl;
  var ToggleControl = components.ToggleControl;
  var ColorPalette = components.ColorPalette;
  var createElement = element.createElement;
  var __ = i18n.__;

  function ensureCardShape(card) {
    return {
      photoId: card && card.photoId ? card.photoId : undefined,
      photoUrl: card && card.photoUrl ? card.photoUrl : '',
      photoAlt: card && card.photoAlt ? card.photoAlt : '',
      stars: card && card.stars ? card.stars : 5,
      text: card && card.text ? card.text : '',
      author: card && card.author ? card.author : '',
      reviewUrl: card && card.reviewUrl ? card.reviewUrl : '',
    };
  }

  registerBlockType('yec/google-reviews', {
    title: __('YEC Opinie Google', 'yourenglishcoachtheme'),
    description: __('Karuzela opinii Google z edytowalnymi kafelkami.', 'yourenglishcoachtheme'),
    icon: 'star-filled',
    category: 'design',
    supports: {
      html: false,
    },
    attributes: {
      sectionTitle: {
        type: 'string',
        default: '',
      },
      titleSize: {
        type: 'string',
        default: 'medium',
      },
      hasBackground: {
        type: 'boolean',
        default: false,
      },
      backgroundColor: {
        type: 'string',
        default: '#F7EEF2',
      },
      backgroundImageId: {
        type: 'number',
      },
      backgroundImageUrl: {
        type: 'string',
        default: '',
      },
      cards: {
        type: 'array',
        default: [
          { photoUrl: '', photoAlt: '', stars: 5, text: 'Swietna atmosfera i bardzo praktyczne lekcje.', author: 'Anna', reviewUrl: '' },
          { photoUrl: '', photoAlt: '', stars: 5, text: 'Widze postepy po kazdym tygodniu nauki.', author: 'Kasia', reviewUrl: '' },
          { photoUrl: '', photoAlt: '', stars: 5, text: 'Duza pewnosc siebie w mowieniu po zajeciach.', author: 'Michal', reviewUrl: '' },
          { photoUrl: '', photoAlt: '', stars: 5, text: 'Profesjonalnie, konkretnie i z sercem.', author: 'Ewa', reviewUrl: '' },
        ],
      },
    },
    edit: function (props) {
      var attributes = props.attributes;
      var setAttributes = props.setAttributes;
      var cards = Array.isArray(attributes.cards) ? attributes.cards.map(ensureCardShape) : [];
      var sectionTitle = attributes.sectionTitle || '';
      var titleSize = attributes.titleSize || 'medium';
      var hasBackground = !!attributes.hasBackground;
      var backgroundColor = attributes.backgroundColor || '#F7EEF2';
      var backgroundImageId = attributes.backgroundImageId;
      var backgroundImageUrl = attributes.backgroundImageUrl || '';
      var blockProps = useBlockProps({
        className: 'yec-google-reviews yec-google-reviews--title-' + titleSize + (hasBackground ? ' yec-google-reviews--with-bg' : ''),
        style: hasBackground
          ? {
              '--yec-google-reviews-bg-color': backgroundColor,
              '--yec-google-reviews-bg-image': backgroundImageUrl ? 'url(' + backgroundImageUrl + ')' : 'none',
            }
          : undefined,
      });

      function updateCard(index, patch) {
        var updated = cards.slice();
        updated[index] = Object.assign({}, updated[index], patch);
        setAttributes({ cards: updated });
      }

      function removeCard(index) {
        var updated = cards.slice();
        updated.splice(index, 1);
        setAttributes({ cards: updated });
      }

      function addCard() {
        var updated = cards.slice();
        updated.push({ photoUrl: '', photoAlt: '', stars: 5, text: '', author: '', reviewUrl: '' });
        setAttributes({ cards: updated });
      }

      return createElement(
        'section',
        blockProps,
        createElement(
          InspectorControls,
          null,
          createElement(
            PanelBody,
            {
              title: __('Tlo sekcji', 'yourenglishcoachtheme'),
              initialOpen: true,
            },
            createElement(TextControl, {
              label: __('Tytul sekcji (opcjonalnie)', 'yourenglishcoachtheme'),
              value: sectionTitle,
              onChange: function (value) {
                setAttributes({ sectionTitle: value });
              },
            }),
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
            }),
            createElement(ToggleControl, {
              label: __('Wlacz tlo sekcji', 'yourenglishcoachtheme'),
              checked: hasBackground,
              onChange: function (value) {
                setAttributes({ hasBackground: !!value });
              },
            }),
            hasBackground
              ? createElement(
                  'div',
                  { style: { marginBottom: '16px' } },
                  createElement('p', { style: { marginBottom: '8px' } }, __('Kolor tla', 'yourenglishcoachtheme')),
                  createElement(ColorPalette, {
                    value: backgroundColor,
                    onChange: function (value) {
                      setAttributes({ backgroundColor: value || '#F7EEF2' });
                    },
                  })
                )
              : null,
            hasBackground
              ? createElement(MediaUploadCheck, {},
                  createElement(MediaUpload, {
                    onSelect: function (media) {
                      setAttributes({
                        backgroundImageId: media && media.id ? media.id : undefined,
                        backgroundImageUrl: media && media.url ? media.url : '',
                      });
                    },
                    allowedTypes: ['image'],
                    value: backgroundImageId,
                    render: function (renderProps) {
                      return createElement(Button, {
                        variant: 'secondary',
                        onClick: renderProps.open,
                      }, backgroundImageUrl ? __('Zmien obraz tla', 'yourenglishcoachtheme') : __('Wybierz obraz tla (opcjonalnie)', 'yourenglishcoachtheme'));
                    },
                  })
                )
              : null,
            hasBackground && backgroundImageUrl
              ? createElement(Button, {
                  variant: 'link',
                  isDestructive: true,
                  onClick: function () {
                    setAttributes({ backgroundImageId: undefined, backgroundImageUrl: '' });
                  },
                }, __('Usun obraz tla', 'yourenglishcoachtheme'))
              : null
          ),
          createElement(
            PanelBody,
            {
              title: __('Kafelki opinii', 'yourenglishcoachtheme'),
              initialOpen: false,
            },
            cards.map(function (card, index) {
              return createElement(
                'div',
                {
                  key: 'review-' + index,
                  style: { borderBottom: '1px solid #eee', paddingBottom: '14px', marginBottom: '14px' },
                },
                createElement('p', { style: { margin: '0 0 8px', fontWeight: 600 } }, __('Kafelek ', 'yourenglishcoachtheme') + (index + 1)),
                createElement(MediaUploadCheck, {},
                  createElement(MediaUpload, {
                    onSelect: function (media) {
                      updateCard(index, {
                        photoId: media && media.id ? media.id : undefined,
                        photoUrl: media && media.url ? media.url : '',
                        photoAlt: media && media.alt ? media.alt : '',
                      });
                    },
                    allowedTypes: ['image'],
                    value: card.photoId,
                    render: function (renderProps) {
                      return createElement(Button, {
                        variant: 'secondary',
                        onClick: renderProps.open,
                      }, card.photoUrl ? __('Zmien zdjecie', 'yourenglishcoachtheme') : __('Wybierz zdjecie', 'yourenglishcoachtheme'));
                    },
                  })
                ),
                card.photoUrl
                  ? createElement(Button, {
                      variant: 'link',
                      isDestructive: true,
                      onClick: function () {
                        updateCard(index, { photoId: undefined, photoUrl: '', photoAlt: '' });
                      },
                    }, __('Usun zdjecie', 'yourenglishcoachtheme'))
                  : null,
                createElement(RangeControl, {
                  label: __('Liczba gwiazdek', 'yourenglishcoachtheme'),
                  min: 1,
                  max: 5,
                  value: card.stars || 5,
                  onChange: function (value) {
                    updateCard(index, { stars: value || 5 });
                  },
                }),
                createElement(TextControl, {
                  label: __('Imie autora', 'yourenglishcoachtheme'),
                  value: card.author || '',
                  onChange: function (value) {
                    updateCard(index, { author: value });
                  },
                }),
                createElement(TextControl, {
                  label: __('Link do opinii (URL)', 'yourenglishcoachtheme'),
                  value: card.reviewUrl || '',
                  onChange: function (value) {
                    updateCard(index, { reviewUrl: value });
                  },
                }),
                createElement(Button, {
                  variant: 'secondary',
                  isDestructive: true,
                  onClick: function () {
                    removeCard(index);
                  },
                }, __('Usun kafelek', 'yourenglishcoachtheme'))
              );
            }),
            createElement(Button, {
              variant: 'primary',
              onClick: addCard,
            }, __('Dodaj kafelek opinii', 'yourenglishcoachtheme'))
          )
        ),
        sectionTitle
          ? createElement('h2', { className: 'yec-google-reviews__section-title' }, sectionTitle)
          : null,
        createElement(
          'div',
          { className: 'yec-google-reviews__viewport' },
          createElement(
            'div',
            { className: 'yec-google-reviews__track' },
            cards.map(function (card, index) {
              return createElement(
                'article',
                { className: 'yec-google-reviews__card', key: 'preview-' + index },
                createElement(
                  'div',
                  { className: 'yec-google-reviews__meta' },
                  createElement(
                    'span',
                    { className: 'yec-google-reviews__avatar' },
                    card.photoUrl
                      ? createElement('img', {
                          src: card.photoUrl,
                          alt: card.photoAlt || '',
                        })
                      : null
                  ),
                  createElement(
                    'span',
                    { className: 'yec-google-reviews__stars' },
                    [1, 2, 3, 4, 5].map(function (star) {
                      return createElement(
                        'span',
                        { key: 'star-' + index + '-' + star, className: 'yec-google-reviews__star' + (star <= (card.stars || 5) ? ' is-filled' : '') },
                        '★'
                      );
                    })
                  )
                ),
                createElement(RichText, {
                  tagName: 'p',
                  className: 'yec-google-reviews__text',
                  value: card.text,
                  placeholder: __('Wpisz tresc opinii...', 'yourenglishcoachtheme'),
                  onChange: function (value) {
                    updateCard(index, { text: value });
                  },
                }),
                createElement(RichText, {
                  tagName: 'p',
                  className: 'yec-google-reviews__author',
                  value: card.author || '',
                  placeholder: __('Imie autora', 'yourenglishcoachtheme'),
                  onChange: function (value) {
                    updateCard(index, { author: value });
                  },
                })
              );
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
