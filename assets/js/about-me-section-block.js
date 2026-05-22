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
      sectionSpaceTop: {
        type: 'number',
      },
      sectionSpaceBottom: {
        type: 'number',
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