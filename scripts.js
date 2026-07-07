function injectConfig() {
    document.querySelectorAll('.js-community-name').forEach(el => {
        el.textContent = SITE_CONFIG.communityName;
    });
    document.querySelectorAll('.js-contact-email').forEach(el => {
        el.textContent = SITE_CONFIG.contactEmail;
    });
    document.querySelectorAll('.js-contact-link').forEach(el => {
        el.href = `mailto:${SITE_CONFIG.contactEmail}`;
    });
    document.querySelectorAll('.js-city').forEach(el => {
        el.textContent = SITE_CONFIG.city;
    });
    document.querySelectorAll('.js-copyright-name').forEach(el => {
        el.textContent = SITE_CONFIG.copyrightName;
    });
}

// Run as soon as the DOM is ready
document.addEventListener('DOMContentLoaded', injectConfig);
