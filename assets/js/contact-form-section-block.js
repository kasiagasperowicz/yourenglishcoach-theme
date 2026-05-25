(function (blocks, blockEditor, components, element, i18n) {
  var registerBlockType = blocks.registerBlockType;
  var RichText = blockEditor.RichText;
  var MediaUpload = blockEditor.MediaUpload;
  var MediaUploadCheck = blockEditor.MediaUploadCheck;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var Button = components.Button;
  var TextControl = components.TextControl;
  var SelectControl = components.SelectControl;
  var RangeControl = components.RangeControl;
  var createElement = element.createElement;
  var __ = i18n.__;

  registerBlockType('yec/contact-form-section', {
    title: __('YEC Formularz kontaktowy', 'yourenglishcoachtheme'),
    description: __('Sekcja kontaktowa 50/50 z danymi i formularzem.', 'yourenglishcoachtheme'),
    icon: 'email-alt',
    category: 'design',
    supports: {
      html: false,
    },
    attributes: {
      sectionTitle: { type: 'string', default: 'Skontaktuj sie' },
      titleSize: { type: 'string', default: 'medium' },
      contentText: { type: 'string', default: 'Napisz lub zadzwon - odpowiem najszybciej, jak to mozliwe.' },
      phone: { type: 'string', default: '+48 000 000 000' },
      email: { type: 'string', default: 'kontakt@twojadomena.pl' },
      address: { type: 'string', default: 'Poznan, Polska' },
      facebookUrl: { type: 'string', default: '' },
      facebookIconId: { type: 'number' },
      facebookIconUrl: { type: 'string', default: '' },
      facebookIconAlt: { type: 'string', default: 'Facebook' },
      instagramUrl: { type: 'string', default: '' },
      instagramIconId: { type: 'number' },
      instagramIconUrl: { type: 'string', default: '' },
      instagramIconAlt: { type: 'string', default: 'Instagram' },
      formTitle: { type: 'string', default: 'Napisz wiadomosc' },
      ctaText: { type: 'string', default: 'Wyslij wiadomosc' },
      sectionSpaceTop: { type: 'number' },
      sectionSpaceBottom: { type: 'number' },
    },
    edit: function (props) {
      var attributes = props.attributes;
      var setAttributes = props.setAttributes;
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
        className: 'yec-contact-form yec-contact-form--title-' + (attributes.titleSize || 'medium'),
        style: Object.keys(sectionSpacingStyle).length ? sectionSpacingStyle : undefined,
      });
      var phoneHrefValue = (attributes.phone || '').replace(/[^0-9+]/g, '');
      var phoneHref = phoneHrefValue ? 'tel:' + phoneHrefValue : '#';
      var emailHref = attributes.email ? 'mailto:' + attributes.email : '#';
      var mapsHref = attributes.address
        ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(attributes.address)
        : '#';

      return createElement(
        'section',
        blockProps,
        createElement(
          InspectorControls,
          null,
          createElement(
            PanelBody,
            {
              title: __('Ustawienia sekcji', 'yourenglishcoachtheme'),
              initialOpen: true,
            },
            createElement(SelectControl, {
              label: __('Rozmiar tytulu', 'yourenglishcoachtheme'),
              value: attributes.titleSize || 'medium',
              options: [
                { label: __('Duzy', 'yourenglishcoachtheme'), value: 'large' },
                { label: __('Sredni', 'yourenglishcoachtheme'), value: 'medium' },
                { label: __('Maly', 'yourenglishcoachtheme'), value: 'small' },
              ],
              onChange: function (value) {
                setAttributes({ titleSize: value || 'medium' });
              },
            }),
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
              title: __('Dane kontaktowe', 'yourenglishcoachtheme'),
              initialOpen: true,
            },
            createElement(TextControl, {
              label: __('Telefon', 'yourenglishcoachtheme'),
              value: attributes.phone || '',
              onChange: function (value) {
                setAttributes({ phone: value });
              },
            }),
            createElement(TextControl, {
              label: __('Email', 'yourenglishcoachtheme'),
              value: attributes.email || '',
              onChange: function (value) {
                setAttributes({ email: value });
              },
            }),
            createElement(TextControl, {
              label: __('Adres', 'yourenglishcoachtheme'),
              value: attributes.address || '',
              onChange: function (value) {
                setAttributes({ address: value });
              },
            }),
            createElement(TextControl, {
              label: __('Tekst CTA formularza', 'yourenglishcoachtheme'),
              value: attributes.ctaText || '',
              onChange: function (value) {
                setAttributes({ ctaText: value });
              },
            })
          ),
          createElement(
            PanelBody,
            {
              title: __('Social media', 'yourenglishcoachtheme'),
              initialOpen: false,
            },
            createElement(TextControl, {
              label: __('Link Facebook', 'yourenglishcoachtheme'),
              value: attributes.facebookUrl || '',
              onChange: function (value) {
                setAttributes({ facebookUrl: value });
              },
            }),
            createElement(MediaUploadCheck, {},
              createElement(MediaUpload, {
                onSelect: function (media) {
                  setAttributes({
                    facebookIconId: media && media.id ? media.id : undefined,
                    facebookIconUrl: media && media.url ? media.url : '',
                    facebookIconAlt: media && media.alt ? media.alt : 'Facebook',
                  });
                },
                allowedTypes: ['image'],
                value: attributes.facebookIconId,
                render: function (renderProps) {
                  return createElement(Button, {
                    variant: 'secondary',
                    onClick: renderProps.open,
                  }, attributes.facebookIconUrl ? __('Zmien ikonke Facebook', 'yourenglishcoachtheme') : __('Wybierz ikonke Facebook', 'yourenglishcoachtheme'));
                },
              })
            ),
            createElement(TextControl, {
              label: __('Link Instagram', 'yourenglishcoachtheme'),
              value: attributes.instagramUrl || '',
              onChange: function (value) {
                setAttributes({ instagramUrl: value });
              },
            }),
            createElement(MediaUploadCheck, {},
              createElement(MediaUpload, {
                onSelect: function (media) {
                  setAttributes({
                    instagramIconId: media && media.id ? media.id : undefined,
                    instagramIconUrl: media && media.url ? media.url : '',
                    instagramIconAlt: media && media.alt ? media.alt : 'Instagram',
                  });
                },
                allowedTypes: ['image'],
                value: attributes.instagramIconId,
                render: function (renderProps) {
                  return createElement(Button, {
                    variant: 'secondary',
                    onClick: renderProps.open,
                  }, attributes.instagramIconUrl ? __('Zmien ikonke Instagram', 'yourenglishcoachtheme') : __('Wybierz ikonke Instagram', 'yourenglishcoachtheme'));
                },
              })
            )
          )
        ),
        createElement(
          'div',
          { className: 'yec-contact-form__layout' },
          createElement(
            'div',
            { className: 'yec-contact-form__left' },
            createElement(RichText, {
              tagName: 'h2',
              className: 'yec-contact-form__title',
              value: attributes.sectionTitle,
              placeholder: __('Tytul sekcji', 'yourenglishcoachtheme'),
              onChange: function (value) {
                setAttributes({ sectionTitle: value });
              },
            }),
            createElement(RichText, {
              tagName: 'p',
              className: 'yec-contact-form__text',
              value: attributes.contentText,
              placeholder: __('Tresc sekcji', 'yourenglishcoachtheme'),
              onChange: function (value) {
                setAttributes({ contentText: value });
              },
            }),
            createElement('a', { className: 'yec-contact-form__contact-line', href: phoneHref, onClick: function (event) { event.preventDefault(); } }, attributes.phone || __('Telefon', 'yourenglishcoachtheme')),
            createElement('a', { className: 'yec-contact-form__contact-line', href: emailHref, onClick: function (event) { event.preventDefault(); } }, attributes.email || __('Email', 'yourenglishcoachtheme')),
            createElement('a', {
              className: 'yec-contact-form__contact-line',
              href: mapsHref,
              target: '_blank',
              rel: 'noopener noreferrer',
              onClick: function (event) { event.preventDefault(); },
            }, attributes.address || __('Adres', 'yourenglishcoachtheme')),
            createElement(
              'div',
              { className: 'yec-contact-form__socials' },
              createElement(
                'a',
                { className: 'yec-contact-form__social', href: attributes.facebookUrl || '#', onClick: function (event) { event.preventDefault(); } },
                attributes.facebookIconUrl
                  ? createElement('img', { src: attributes.facebookIconUrl, alt: attributes.facebookIconAlt || 'Facebook' })
                  : 'FB'
              ),
              createElement(
                'a',
                { className: 'yec-contact-form__social', href: attributes.instagramUrl || '#', onClick: function (event) { event.preventDefault(); } },
                attributes.instagramIconUrl
                  ? createElement('img', { src: attributes.instagramIconUrl, alt: attributes.instagramIconAlt || 'Instagram' })
                  : 'IG'
              )
            )
          ),
          createElement(
            'div',
            { className: 'yec-contact-form__right' },
            createElement(RichText, {
              tagName: 'h3',
              className: 'yec-contact-form__form-title',
              value: attributes.formTitle,
              placeholder: __('Tytul formularza', 'yourenglishcoachtheme'),
              onChange: function (value) {
                setAttributes({ formTitle: value });
              },
            }),
            createElement('input', { className: 'yec-contact-form__input', type: 'text', placeholder: __('Imię', 'yourenglishcoachtheme'), disabled: true }),
            createElement('input', { className: 'yec-contact-form__input', type: 'email', placeholder: __('Email', 'yourenglishcoachtheme'), disabled: true }),
            createElement('textarea', { className: 'yec-contact-form__textarea', placeholder: __('Treść', 'yourenglishcoachtheme'), disabled: true }),
            createElement('button', { className: 'yec-cta__button yec-contact-form__submit', type: 'button' }, attributes.ctaText || __('Wyslij wiadomosc', 'yourenglishcoachtheme'))
          )
        )
      );
    },
    save: function () {
      return null;
    },
  });
})(window.wp.blocks, window.wp.blockEditor, window.wp.components, window.wp.element, window.wp.i18n);
