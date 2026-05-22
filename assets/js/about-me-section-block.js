(function (blocks, blockEditor, components, element, i18n) {
  var registerBlockType = blocks.registerBlockType;
  var RichText = blockEditor.RichText;
  var InspectorControls = blockEditor.InspectorControls;
  var useBlockProps = blockEditor.useBlockProps;
  var PanelBody = components.PanelBody;
  var TextControl = components.TextControl;
  var SelectControl = components.SelectControl;
  var BaseControl = components.BaseControl;
  var createElement = element.createElement;
  var __ = i18n.__;

  registerBlockType('yec/about-me-section', {
    title: __('YEC Poznaj mnie blizej', 'yourenglishcoachtheme'),
    description: __('Sekcja 50/50: lewa kolumna (eyebrow + tytul), prawa kolumna (tekst + CTA).', 'yourenglishcoachtheme'),
    icon: 'id',
    category: 'design',
    supports: {
      html: false,
    },
    attributes: {
      eyebrow: {
        type: 'string',
        default: 'Poznaj mnie blizej',
      },
      title: {
        type: 'string',
        default: 'Pomagam mowic po angielsku pewnie i naturalnie',
      },
      titleSize: {
        type: 'string',
        default: 'medium',
      },
      contentText: {
        type: 'string',
        default: 'Tworze lekcje dopasowane do Twoich celow, tempa i stylu pracy. Skupiamy sie na praktyce, swobodzie mowienia i realnych efektach.',
      },
      ctaText: {
        type: 'string',
        default: 'Umow konsultacje',
      },
      ctaUrl: {
        type: 'string',
        default: '/kontakt',
      },
    },
    edit: function (props) {
      var attributes = props.attributes;
      var setAttributes = props.setAttributes;
      var titleSize = attributes.titleSize || 'medium';
      var blockProps = useBlockProps({
        className: 'yec-about-me-section yec-about-me-section--title-' + titleSize,
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
          )
        ),
        createElement(
          'div',
          { className: 'yec-about-me-section__left' },
          createElement(RichText, {
            tagName: 'p',
            className: 'yec-about-me-section__eyebrow',
            value: attributes.eyebrow,
            placeholder: __('Poznaj mnie blizej', 'yourenglishcoachtheme'),
            onChange: function (value) {
              setAttributes({ eyebrow: value });
            },
          }),
          createElement(RichText, {
            tagName: 'h2',
            className: 'yec-about-me-section__title',
            value: attributes.title,
            placeholder: __('Wpisz tytul sekcji', 'yourenglishcoachtheme'),
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
            placeholder: __('Wpisz tekst sekcji', 'yourenglishcoachtheme'),
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
              attributes.ctaText || __('Umow konsultacje', 'yourenglishcoachtheme')
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