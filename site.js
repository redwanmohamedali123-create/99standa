/* ================================================================
         SITE CONFIG — the only things you should ever need to edit
         ================================================================ */

      // Google reviews.
      //  • placeUrl / writeUrl  – where the Google buttons point.
      //  • apiKey + placeId     – OPTIONAL. Fill both in and the rating,
      //    review count and review cards refresh themselves live from
      //    Google every time the page loads. Leave blank and the site
      //    quietly uses the reviews listed below instead.
      const GOOGLE = {
        placeUrl: "https://www.google.com/maps/search/?api=1&query=99%27s%20Tailoring%20%26%20Alterations%2C%201582%20S%20Parker%20Rd%20Ste%20304%2C%20Denver%2C%20CO%2080231",
        // Left blank on purpose: with a placeId set, the site builds the real
        // "write a review" deep link itself. Otherwise it falls back to the
        // listing, where the review button lives.
        writeUrl: "",
        apiKey: "",
        placeId: "",
        // These two must match what your Google listing actually shows — the
        // button next to them takes visitors straight there to check.
        rating: 4.9,
        total: 300,
        totalIsMinimum: true,        // renders "300+" rather than an exact count
        reviews: [
          { author: "Larry M.",   rating: 5, text: "Amazing work! Turned a frumpy suit into a modern, stylish slim cut work of art. Highly recommended! Definitely a master of his craft." },
          { author: "Kenob83",    rating: 5, text: "Stop reading this review right now and go to 99's Tailoring. The workmanship is impeccable. The only thing that beats the quality of work is the customer service. Glad I found this place!" },
          { author: "Allyssa B.", rating: 5, text: "I've been to 4 other tailors in the greater Denver area and no one else had his level of knowledge, expertise, and care. I truly felt like he wanted me to look my best." }
          // Paste more reviews here, same shape, to fill the grid out to 5–10.
        ]
      };

      /* ================================================================
         Google reviews rendering
         ================================================================ */
      function starRow(rating, size) {
        const px = size || 16;
        let html = '';
        for (let i = 1; i <= 5; i++) {
          const filled = rating >= i - 0.5;   // half a star rounds up, as everywhere else
          html += '<svg aria-hidden="true" class="ic ic-star' + (filled ? ' ic-fill' : '') +
                  '" style="width:' + px + 'px;height:' + px + 'px' +
                  (filled ? '' : ';opacity:.35') + '"><use href="#i-star"></use></svg>';
        }
        return '<span role="img" aria-label="' + rating + ' out of 5 stars" class="flex gap-0.5">' + html + '</span>';
      }

      function renderReviews(data) {
        // No verified rating means no stars and no number — drawing five filled
        // stars under a Google logo asserts a score just as loudly as printing it.
        const hasRating = typeof data.rating === 'number';
        const starsEl = document.getElementById('g-stars');
        const ratingEl = document.getElementById('g-rating');
        starsEl.innerHTML = hasRating ? starRow(data.rating, 18) : '';
        ratingEl.textContent = hasRating ? data.rating.toFixed(1) : '';
        ratingEl.style.display = hasRating ? '' : 'none';

        document.getElementById('g-count').textContent =
          (typeof data.total === 'number' && data.total > 0)
            ? data.total + (data.totalIsMinimum ? '+' : '') +
              ' Google review' + (data.total === 1 && !data.totalIsMinimum ? '' : 's')
            : 'Based on local feedback';

        document.getElementById('g-link').href = GOOGLE.placeUrl;
        document.getElementById('g-write').href = GOOGLE.writeUrl ||
          (GOOGLE.placeId
            ? 'https://search.google.com/local/writereview?placeid=' + encodeURIComponent(GOOGLE.placeId)
            : GOOGLE.placeUrl);

        const grid = document.getElementById('review-grid');
        grid.innerHTML = (data.reviews || []).map(function (r) {
          const when = r.when ? '<span class="text-xs text-slate-500">' + escapeHtml(r.when) + '</span>' : '';
          return '' +
            '<div class="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between">' +
              '<div>' +
                '<div class="flex items-center justify-between mb-3">' +
                  starRow(r.rating || 5, 16) +
                  '<svg viewBox="0 0 48 48" class="flex-none" style="width:17px;height:17px" aria-hidden="true"><use href="#i-google"></use></svg>' +
                '</div>' +
                '<p class="text-sm text-slate-600 leading-relaxed mb-4">"' + escapeHtml(r.text) + '"</p>' +
              '</div>' +
              '<div class="flex items-center justify-between">' +
                '<span class="text-xs font-medium text-slate-400 uppercase tracking-wide">' + escapeHtml(r.author) + '</span>' + when +
              '</div>' +
            '</div>';
        }).join('');
      }

      function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
          return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
      }

      // Draw whatever we have immediately… (home page only)
      if (document.getElementById('review-grid')) renderReviews(GOOGLE);

      // …then upgrade to live Google data if an API key + Place ID are set.
      (function liveGoogleReviews() {
        if (!document.getElementById('review-grid')) return;
        if (!GOOGLE.apiKey || !GOOGLE.placeId) return;
        fetch('https://places.googleapis.com/v1/places/' + encodeURIComponent(GOOGLE.placeId) +
              '?fields=rating,userRatingCount,googleMapsUri,reviews&key=' + encodeURIComponent(GOOGLE.apiKey))
          .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
          .then(function (p) {
            const live = {
              rating: typeof p.rating === 'number' ? p.rating : GOOGLE.rating,
              total: typeof p.userRatingCount === 'number' ? p.userRatingCount : GOOGLE.total,
              totalIsMinimum: typeof p.userRatingCount === 'number' ? false : GOOGLE.totalIsMinimum,
              reviews: (p.reviews || []).map(function (r) {
                return {
                  author: (r.authorAttribution && r.authorAttribution.displayName) || 'Google user',
                  rating: r.rating || 5,
                  text: (r.originalText && r.originalText.text) || (r.text && r.text.text) || '',
                  when: r.relativePublishTimeDescription || ''
                };
              }).filter(function (r) { return r.text; })
            };
            if (p.googleMapsUri) { GOOGLE.placeUrl = p.googleMapsUri; }
            if (!live.reviews.length) { live.reviews = GOOGLE.reviews; }
            renderReviews(live);
          })
          .catch(function () { /* keep the built-in reviews on any failure */ });
      })();


      /* ================================================================
         Contact form
         ================================================================ */
      (function () {
        const form = document.getElementById('contact-form');
        if (!form) return;
        const btn = document.getElementById('submit-btn');
        const result = document.getElementById('form-result');
        form.addEventListener('submit', async function (e) {
          e.preventDefault();
          btn.textContent = 'Sending...';
          btn.disabled = true;
          try {
            const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(form) });
            const json = await res.json();
            result.classList.remove('hidden');
            if (json.success) {
              result.textContent = 'Message sent! We will get back to you soon.';
              result.style.color = '#5E4326';
              form.reset();
            } else {
              result.textContent = 'Something went wrong. Please call us directly at (720) 499-2341.';
              result.style.color = '#A3231B';
            }
          } catch (err) {
            result.classList.remove('hidden');
            result.textContent = 'Something went wrong. Please call us directly at (720) 499-2341.';
            result.style.color = '#A3231B';
          }
          btn.textContent = 'Send Message';
          btn.disabled = false;
        });
      })();

      /* ================================================================
         Calendly
         ================================================================ */
      function ensureCalendly(attempt) {
        const el = document.querySelector('.calendly-inline-widget');
        if (!el || el.querySelector('iframe')) return;
        if (window.Calendly && window.Calendly.initInlineWidget) {
          window.Calendly.initInlineWidget({ url: el.getAttribute('data-url'), parentElement: el });
        } else if ((attempt || 0) < 12) {
          setTimeout(function () { ensureCalendly((attempt || 0) + 1); }, 250);
        } else {
          const fb = document.getElementById('calendly-fallback');
          if (fb) { fb.classList.remove('hidden'); fb.classList.add('flex'); }
        }
      }


      /* ================================================================
         Mobile menu
         ================================================================ */
      (function () {
        const btn = document.getElementById('mobile-menu-btn');
        const menu = document.getElementById('mobile-menu');
        if (!btn || !menu) return;
        function setMenu(open) {
          menu.classList.toggle('hidden', !open);
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        }
        btn.addEventListener('click', function () { setMenu(menu.classList.contains('hidden')); });
        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape' && !menu.classList.contains('hidden')) { setMenu(false); btn.focus(); }
        });
        document.addEventListener('pointerdown', function (e) {
          if (menu.classList.contains('hidden')) return;
          if (!menu.contains(e.target) && !btn.contains(e.target)) setMenu(false);
        });
      })();

      if (document.querySelector('.calendly-inline-widget')) ensureCalendly();
