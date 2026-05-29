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
      sectionSpaceTop: {
        type: 'number',
      },
      sectionSpaceBottom: {
        type: 'number',
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
      mobileBackgroundImageId: {
        type: 'number',
      },
      mobileBackgroundImageUrl: {
        type: 'string',
        default: '',
      },
      cards: {
        type: 'array',
        default: [
          { photoUrl: '', photoAlt: '', stars: 5, text: 'Świetna atmosfera i bardzo praktyczne lekcje.', author: 'Anna', reviewUrl: '' },
          { photoUrl: '', photoAlt: '', stars: 5, text: 'Widzę postępy po każdym tygodniu nauki.', author: 'Kasia', reviewUrl: '' },
          { photoUrl: '', photoAlt: '', stars: 5, text: 'Duża pewność siebie w mówieniu po zajęciach.', author: 'Michał', reviewUrl: '' },
          { photoUrl: '', photoAlt: '', stars: 5, text: 'Profesjonalnie, konkretnie i z sercem.', author: 'Ewa', reviewUrl: '' },
        ],
      },
      anchorId: {
        type: 'string',
        default: '',
      },
    },
    edit: function (props) {
      var attributes = props.attributes;
      var setAttributes = props.setAttributes;
      var cards = Array.isArray(attributes.cards) ? attributes.cards.map(ensureCardShape) : [];
      var sectionTitle = attributes.sectionTitle || '';
      var titleSize = attributes.titleSize || 'medium';
      var sectionSpaceTop = Number.isFinite(attributes.sectionSpaceTop) ? attributes.sectionSpaceTop : 0;
      var sectionSpaceBottom = Number.isFinite(attributes.sectionSpaceBottom) ? attributes.sectionSpaceBottom : 0;
      var hasBackground = !!attributes.hasBackground;
      var backgroundColor = attributes.backgroundColor || '#F7EEF2';
      var backgroundImageId = attributes.backgroundImageId;
      var backgroundImageUrl = attributes.backgroundImageUrl || '';
      var mobileBackgroundImageId = attributes.mobileBackgroundImageId;
      var mobileBackgroundImageUrl = attributes.mobileBackgroundImageUrl || '';
      var sectionStyle = {};
      if (hasBackground) {
        sectionStyle['--yec-google-reviews-bg-color'] = backgroundColor;
        sectionStyle['--yec-google-reviews-bg-image'] = backgroundImageUrl ? 'url(' + backgroundImageUrl + ')' : 'none';
      }
      if (Number.isFinite(attributes.sectionSpaceTop)) {
        sectionStyle.marginTop = sectionSpaceTop + 'px';
      }
      if (Number.isFinite(attributes.sectionSpaceBottom)) {
        sectionStyle.marginBottom = sectionSpaceBottom + 'px';
      }
      var blockProps = useBlockProps({
        className: 'yec-google-reviews yec-google-reviews--title-' + titleSize + (hasBackground ? ' yec-google-reviews--with-bg' : ''),
        style: Object.keys(sectionStyle).length ? sectionStyle : undefined,
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
              title: __('Tło sekcji', 'yourenglishcoachtheme'),
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
            }),
            createElement(ToggleControl, {
              label: __('Włącz tło sekcji', 'yourenglishcoachtheme'),
              checked: hasBackground,
              onChange: function (value) {
                setAttributes({ hasBackground: !!value });
              },
            }),
            hasBackground
              ? createElement(
                  'div',
                  { style: { marginBottom: '16px' } },
                  createElement('p', { style: { marginBottom: '8px' } }, __('Kolor tła', 'yourenglishcoachtheme')),
                  createElement(ColorPalette, {
                    value: backgroundColor,
                    onChange: function (value) {
                      setAttributes({ backgroundColor: value || '#F7EEF2' });
                    },
                  })
                )
              : null,
            hasBackground
              ? createElement(
                  'div',
                  null,
                  createElement('p', { style: { marginBottom: '6px', fontWeight: 600, fontSize: '12px' } }, __('Obraz tła — desktop', 'yourenglishcoachtheme')),
                  createElement(MediaUploadCheck, {},
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
                        }, backgroundImageUrl ? __('Zmień obraz tła', 'yourenglishcoachtheme') : __('Wybierz obraz tła (opcjonalnie)', 'yourenglishcoachtheme'));
                      },
                    })
                  ),
                  backgroundImageUrl
                    ? createElement(Button, {
                        variant: 'link',
                        isDestructive: true,
                        onClick: function () {
                          setAttributes({ backgroundImageId: undefined, backgroundImageUrl: '' });
                        },
                      }, __('Usuń obraz tła', 'yourenglishcoachtheme'))
                    : null,
                  createElement('p', { style: { margin: '12px 0 6px', fontWeight: 600, fontSize: '12px' } }, __('Obraz tła — mobile (opcjonalnie)', 'yourenglishcoachtheme')),
                  createElement('p', { style: { marginBottom: '8px', fontSize: '12px', color: '#757575' } }, __('Jeśli puste, używany jest obraz desktop.', 'yourenglishcoachtheme')),
                  createElement(MediaUploadCheck, {},
                    createElement(MediaUpload, {
                      onSelect: function (media) {
                        setAttributes({
                          mobileBackgroundImageId: media && media.id ? media.id : undefined,
                          mobileBackgroundImageUrl: media && media.url ? media.url : '',
                        });
                      },
                      allowedTypes: ['image'],
                      value: mobileBackgroundImageId,
                      render: function (renderProps) {
                        return createElement(Button, {
                          variant: 'secondary',
                          onClick: renderProps.open,
                        }, mobileBackgroundImageUrl ? __('Zmień obraz tła mobile', 'yourenglishcoachtheme') : __('Wybierz obraz tła mobile', 'yourenglishcoachtheme'));
                      },
                    })
                  ),
                  mobileBackgroundImageUrl
                    ? createElement(Button, {
                        variant: 'link',
                        isDestructive: true,
                        onClick: function () {
                          setAttributes({ mobileBackgroundImageId: undefined, mobileBackgroundImageUrl: '' });
                        },
                      }, __('Usuń obraz tła mobile', 'yourenglishcoachtheme'))
                    : null
                )
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
                      }, card.photoUrl ? __('Zmień zdjęcie', 'yourenglishcoachtheme') : __('Wybierz zdjęcie', 'yourenglishcoachtheme'));
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
                    }, __('Usuń zdjęcie', 'yourenglishcoachtheme'))
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
