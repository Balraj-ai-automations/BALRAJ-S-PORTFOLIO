/* ════════════════════════════════════════════
   CONTACT — configuration placeholders

   Fill a value in when the real destination
   exists. While a value stays empty, the matching
   card stays visibly disabled and never navigates
   anywhere.
════════════════════════════════════════════ */
var LINKEDIN_URL = '';
var GITHUB_URL = '';
var RESUME_URL = '';

(function () {
  'use strict';

  /* ── Contact cards ── */
  var CONTACTS = {
    linkedin: LINKEDIN_URL,
    github: GITHUB_URL,
    resume: RESUME_URL
  };

  Object.keys(CONTACTS).forEach(function (key) {
    var url = CONTACTS[key];
    var card = document.querySelector('[data-contact="' + key + '"]');
    if (!card || !url) return;

    var state = card.querySelector('.card-state');
    var open = function () { window.open(url, '_blank', 'noopener'); };

    card.classList.remove('is-disabled');
    card.removeAttribute('aria-disabled');
    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', open);
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open();
      }
    });

    if (state) {
      state.textContent = key === 'resume' ? 'Download resume' : 'Open profile';
    }
  });

  /* ── Contact form: validation + mailto fallback ── */
  var form = document.getElementById('contact-form');
  if (!form) return;

  var status = document.getElementById('cf-status');
  var RECIPIENT = 'balarajsrinivas03@gmail.com';
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var rules = {
    name: function (v) { return v.trim() ? '' : 'Please enter your name.'; },
    email: function (v) {
      if (!v.trim()) return 'Please enter your email address.';
      return EMAIL_RE.test(v.trim()) ? '' : 'Please enter a valid email address.';
    },
    subject: function (v) { return v.trim() ? '' : 'Please add a subject.'; },
    message: function (v) { return v.trim() ? '' : 'Please write a message.'; }
  };

  function field(name) { return form.elements[name]; }
  function errorEl(name) { return form.querySelector('[data-error-for="' + name + '"]'); }

  function showError(name, message) {
    var input = field(name);
    var wrapper = input.closest('.field');
    var el = errorEl(name);
    if (message) {
      wrapper.classList.add('has-error');
      el.textContent = message;
      el.hidden = false;
      input.setAttribute('aria-invalid', 'true');
    } else {
      wrapper.classList.remove('has-error');
      el.textContent = '';
      el.hidden = true;
      input.removeAttribute('aria-invalid');
    }
  }

  function validate() {
    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      var message = rules[name](field(name).value);
      showError(name, message);
      if (message && !firstInvalid) firstInvalid = field(name);
    });
    return firstInvalid;
  }

  /* Clear a field's error as soon as it becomes valid */
  Object.keys(rules).forEach(function (name) {
    field(name).addEventListener('input', function () {
      if (rules[name](field(name).value) === '') showError(name, '');
    });
  });

  function setStatus(message, isError) {
    status.textContent = message;
    status.hidden = false;
    status.classList.toggle('is-error', !!isError);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var firstInvalid = validate();
    if (firstInvalid) {
      setStatus('Please fix the highlighted fields and try again.', true);
      firstInvalid.focus();
      return;
    }

    var body = 'Name: ' + field('name').value.trim() +
      '\nEmail: ' + field('email').value.trim() +
      '\n\n' + field('message').value.trim();

    var mailto = 'mailto:' + RECIPIENT +
      '?subject=' + encodeURIComponent(field('subject').value.trim()) +
      '&body=' + encodeURIComponent(body);

    /* No email service is configured, so hand off to the visitor's mail app.
       Nothing is sent by this page — the status message says so. */
    window.location.href = mailto;
    setStatus('Your email app should now be open with the message ready to send. If nothing opened, email ' + RECIPIENT + ' directly.', false);
  });
})();
