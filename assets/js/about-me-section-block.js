(function (blocks, blockEditor, components, element, i18n) {
  var registerBlockType = blocks.registerBlockType;
  var RichText = blockEditor.RichText;
  var InspectorControls = blockEditor.InspectorControls;
  var useBlockProps = blockEditor.useBlockProps;
  var PanelBody = components.PanelBody;
  var TextControl = components.TextControl;
  var SelectControl = components.SelectControl;
  var RangeControl = components.RangeControl;
  var BaseControl = components.BaseControl;
  var createElement = element.createElement;
  var __ = i18n.__;

  registerBlockType('yec/about-me-section', {
    title: __('YEC Poznaj mnie bliżej', 'yourenglishcoachtheme'),
    description: __('Sekcja 50/50: lewa kolumna (eyebrow + tytul), prawa kolumna (tekst + CTA).', 'yourenglishcoachtheme'),
    icon: 'id',
    category: 'design',
    supports: {
      html: false,
    },
    attributes: {
      eyebrow: {
        type: 'string',
        default: 'Poznaj mnie bliżej',
      },
      title: {
        type: 'string',
        default: 'Pomagam mówić po angielsku pewnie i naturalnie',
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
        default: 'Tworzę lekcje dopasowane do Twoich celów, tempa i stylu pracy. Skupiamy się na praktyce, swobodzie mówienia i realnych efektach.',
      },
      ctaText: {
        type: 'string',
        default: 'Umów konsultację',
      },
      ctaUrl: {
        type: 'string',
        default: '/kontakt',
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
        className: 'yec-about-me-section yec-about-me-section--title-' + titleSize,
        style: Object.keys(sectionSpacingStyle).length ? sectionSpacingStyle : undefined,
      });

      return createElement(
        'section',
        blockProps,
        createElement(
          InspectorControls,
          null,
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
          { className: 'yec-about-me-section__left' },
          createElement(RichText, {
            tagName: 'p',
            className: 'yec-about-me-section__eyebrow',
            value: attributes.eyebrow,
            placeholder: __('Poznaj mnie bliżej', 'yourenglishcoachtheme'),
            onChange: function (value) {
              setAttributes({ eyebrow: value });
            },
          }),
          createElement(RichText, {
            tagName: 'h2',
            className: 'yec-about-me-section__title',
            value: attributes.title,
            placeholder: __('Wpisz tytuł sekcji', 'yourenglishcoachtheme'),
            onChange: function (value) {
              setAttributes({ title: value });
            },
          })
        ),
        createElement(
          'div',
          { className: 'yec-about-me-section__right' },
          createElement(RichText, {
            tagName: 'p',
            className: 'yec-about-me-section__text',
            value: attributes.contentText,
            placeholder: __('Wpisz treść sekcji', 'yourenglishcoachtheme'),
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
              attributes.ctaText || __('Umów konsultację', 'yourenglishcoachtheme')
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