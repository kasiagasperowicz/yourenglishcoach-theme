(function (blocks, blockEditor, components, element, i18n) {
  var registerBlockType = blocks.registerBlockType;
  var RichText = blockEditor.RichText;
  var InspectorControls = blockEditor.InspectorControls;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var useBlockProps = blockEditor.useBlockProps;
  var PanelBody = components.PanelBody;
  var Button = components.Button;
  var ToggleControl = components.ToggleControl;
  var RangeControl = components.RangeControl;
  var ColorPalette = components.ColorPalette;
  var SelectControl = components.SelectControl;
  var BaseControl = components.BaseControl;
  var TextControl = components.TextControl;
  var createElement = element.createElement;
  var __ = i18n.__;

  registerBlockType('yec/benefits-section', {
    title: __('YEC Co zyskujesz', 'yourenglishcoachtheme'),
    description: __('Sekcja z eyebrow, tytulem, podtytulem i 4 kafelkami z ikonkami.', 'yourenglishcoachtheme'),
    icon: 'grid-view',
    category: 'design',
    supports: {
      html: false,
    },
    attributes: {
      eyebrow: { type: 'string', default: 'Co zyskujesz' },
      title: { type: 'string', default: 'Dlaczego warto uczyć się ze mną' },
      titleSize: { type: 'string', default: 'medium' },
      sectionSpaceTop: { type: 'number' },
      sectionSpaceBottom: { type: 'number' },
      subtitle: { type: 'string', default: 'Skupiamy się na praktycznych efektach, które wykorzystasz od razu.' },
      hasBackground: { type: 'boolean', default: false },
      backgroundColor: { type: 'string', default: '#F7EEF2' },
      item1Icon: { type: 'string', default: '🎯' },
      item1IconImageId: { type: 'number' },
      item1IconImageUrl: { type: 'string', default: '' },
      item1IconImageAlt: { type: 'string', default: '' },
      item1Title: { type: 'string', default: 'Plan nauki dopasowany do Ciebie' },
      item2Icon: { type: 'string', default: '🗣️' },
      item2IconImageId: { type: 'number' },
      item2IconImageUrl: { type: 'string', default: '' },
      item2IconImageAlt: { type: 'string', default: '' },
      item2Title: { type: 'string', default: 'Większa swoboda w mówieniu' },
      item3Icon: { type: 'string', default: '📈' },
      item3IconImageId: { type: 'number' },
      item3IconImageUrl: { type: 'string', default: '' },
      item3IconImageAlt: { type: 'string', default: '' },
      item3Title: { type: 'string', default: 'Widoczne postępy tydzień po tygodniu' },
      item4Icon: { type: 'string', default: '💼' },
      item4IconImageId: { type: 'number' },
      item4IconImageUrl: { type: 'string', default: '' },
      item4IconImageAlt: { type: 'string', default: '' },
      item4Title: { type: 'string', default: 'Przygotowanie do pracy i egzaminów' },
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
      var blockClassName = 'yec-benefits-section yec-benefits-section--title-' + titleSize + (attributes.hasBackground ? ' yec-benefits-section--with-bg' : '');
      var sectionStyle = {};
      if (attributes.hasBackground && attributes.backgroundColor) {
        sectionStyle['--yec-benefits-bg'] = attributes.backgroundColor;
      }
      if (Number.isFinite(attributes.sectionSpaceTop)) {
        sectionStyle.marginTop = sectionSpaceTop + 'px';
      }
      if (Number.isFinite(attributes.sectionSpaceBottom)) {
        sectionStyle.marginBottom = sectionSpaceBottom + 'px';
      }
      var blockProps = useBlockProps({
        className: blockClassName,
        style: Object.keys(sectionStyle).length ? sectionStyle : undefined,
      });

      var cards = [
        { iconKey: 'item1Icon', titleKey: 'item1Title', imageIdKey: 'item1IconImageId', imageUrlKey: 'item1IconImageUrl', imageAltKey: 'item1IconImageAlt' },
        { iconKey: 'item2Icon', titleKey: 'item2Title', imageIdKey: 'item2IconImageId', imageUrlKey: 'item2IconImageUrl', imageAltKey: 'item2IconImageAlt' },
        { iconKey: 'item3Icon', titleKey: 'item3Title', imageIdKey: 'item3IconImageId', imageUrlKey: 'item3IconImageUrl', imageAltKey: 'item3IconImageAlt' },
        { iconKey: 'item4Icon', titleKey: 'item4Title', imageIdKey: 'item4IconImageId', imageUrlKey: 'item4IconImageUrl', imageAltKey: 'item4IconImageAlt' },
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
              title: __('Tło sekcji', 'yourenglishcoachtheme'),
              initialOpen: true,
            },
            createElement(ToggleControl, {
              label: __('Włącz tło na całą szerokość', 'yourenglishcoachtheme'),
              checked: !!attributes.hasBackground,
              onChange: function (value) {
                setAttributes({ hasBackground: value });
              },
            }),
            attributes.hasBackground
              ? createElement(
                  BaseControl,
                  { label: __('Kolor tła', 'yourenglishcoachtheme') },
                  createElement(ColorPalette, {
                    value: attributes.backgroundColor || '#F7EEF2',
                    onChange: function (value) {
                      setAttributes({ backgroundColor: value || '#F7EEF2' });
                    },
                  })
                )
              : null
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
                title: __('Ikona kafelka ', 'yourenglishcoachtheme') + (index + 1),
                initialOpen: false,
                key: 'panel-' + index,
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
                    }, attributes[card.imageUrlKey] ? __('Zmień ikonę (SVG/obraz)', 'yourenglishcoachtheme') : __('Wybierz ikonę (SVG/obraz)', 'yourenglishcoachtheme'));
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
                  }, __('Usuń ikonę obrazkową', 'yourenglishcoachtheme'))
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
        createElement(
          'div',
          { className: 'yec-benefits-section__header' },
          createElement(RichText, {
            tagName: 'p',
            className: 'yec-benefits-section__eyebrow',
            value: attributes.eyebrow,
            placeholder: __('Co zyskujesz', 'yourenglishcoachtheme'),
            onChange: function (value) { setAttributes({ eyebrow: value }); },
          }),
          createElement(RichText, {
            tagName: 'h2',
            className: 'yec-benefits-section__title',
            value: attributes.title,
            placeholder: __('Dlaczego warto uczyć się ze mną', 'yourenglishcoachtheme'),
            onChange: function (value) { setAttributes({ title: value }); },
          }),
          createElement(RichText, {
            tagName: 'p',
            className: 'yec-benefits-section__subtitle',
            value: attributes.subtitle,
            placeholder: __('Krótkie wprowadzenie do korzyści.', 'yourenglishcoachtheme'),
            onChange: function (value) { setAttributes({ subtitle: value }); },
          })
        ),
        createElement(
          'div',
          { className: 'yec-benefits-section__grid' },
          cards.map(function (card, index) {
            return createElement(
              'article',
              { className: 'yec-benefits-section__card', key: index },
              attributes[card.imageUrlKey]
                ? createElement(
                    'span',
                    { className: 'yec-benefits-section__icon' },
                    createElement('img', {
                      className: 'yec-benefits-section__icon-image',
                      src: attributes[card.imageUrlKey],
                      alt: attributes[card.imageAltKey] || '',
                    })
                  )
                : createElement(RichText, {
                    tagName: 'span',
                    className: 'yec-benefits-section__icon',
                    value: attributes[card.iconKey],
                    placeholder: __('⭐', 'yourenglishcoachtheme'),
                    allowedFormats: [],
                    onChange: function (value) {
                      var update = {};
                      update[card.iconKey] = value;
                      setAttributes(update);
                    },
                  }),
              createElement(RichText, {
                tagName: 'h3',
                className: 'yec-benefits-section__card-title',
                value: attributes[card.titleKey],
                placeholder: __('Wpisz korzysc', 'yourenglishcoachtheme'),
                onChange: function (value) {
                  var update = {};
                  update[card.titleKey] = value;
                  setAttributes(update);
                },
              })
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
