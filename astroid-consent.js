(function () {

  const cfg = window.AstroidConsentConfig || {};
  const cookieName = cfg.consentCookie || "ac_consent";
  const days = cfg.consentLifetimeDays || 30;

  /* Read a cookie */
  function getCookie(name) {
    return document.cookie
      .split("; ")
      .find(row => row.startsWith(name + "="))
      ?.split("=")[1] || null;
  }

  /* Write a cookie */
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 86400000));
    document.cookie = `${name}=${value}; expires=${d.toUTCString()}; path=/`;
  }

  /* Optional: load GA4 only after consent */
  function loadGA4() {
    if (!cfg.ga4 || document.getElementById("ac-ga4")) return;

    const s = document.createElement("script");
    s.id = "ac-ga4";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${cfg.ga4}`;
    document.head.appendChild(s);

    s.onload = () => {
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      window.gtag = gtag;

      gtag("js", new Date());
      gtag("config", cfg.ga4);
    };
  }

  /* Expose public API */
  window.AstroidConsent = {
    allowAll() {
      setCookie(cookieName, "all", days);
      loadGA4();
    },

    necessaryOnly() {
      setCookie(cookieName, "necessary", days);
    },

    getStatus() {
      return getCookie(cookieName);
    }
  };

})();
