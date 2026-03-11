async function handleWaitlist(btn) {
    const input = document.getElementById('waitlist-input');
    const countryCode = document.getElementById('country-code').value;
    const errorEl = document.getElementById('waitlist-error');
    const raw = input.value.trim();

    // Clear previous error
    errorEl.textContent = '';
    input.style.borderColor = '';

    // Strip spaces, dashes, parentheses
    const cleaned = raw.replace(/[\s\-().]/g, '');

    // Must not be empty
    if (!cleaned) {
      errorEl.textContent = 'Please enter your phone number.';
      input.style.borderColor = 'rgba(200,75,49,0.6)';
      return;
    }

    // Must only contain digits (and optionally a leading 0)
    if (!/^[0-9]+$/.test(cleaned)) {
      errorEl.textContent = 'Phone number should contain digits only — no letters or symbols.';
      input.style.borderColor = 'rgba(200,75,49,0.6)';
      return;
    }

    // Strip leading 0 if present (e.g. 0821234567 → 821234567)
    const stripped = cleaned.startsWith('0') ? cleaned.slice(1) : cleaned;

    // Digit length rules per country code
    const lengthRules = {
      '+27':  9,   // SA: 9 digits after country code
      '+1':   10,  // US/CA
      '+44':  10,  // UK
      '+61':  9,   // AU
      '+64':  9,   // NZ
      '+91':  10,  // IN
      '+234': 10,  // NG
      '+254': 9,   // KE
      '+263': 9,   // ZW
      '+267': 8,   // BW
      '+260': 9,   // ZM
      '+258': 9,   // MZ
      '+249': 9,   // SD
      '+20':  10,  // EG
      '+212': 9,   // MA
      '+33':  9,   // FR
      '+49':  10,  // DE
      '+31':  9,   // NL
      '+55':  11,  // BR
      '+86':  11,  // CN
    };

    const expectedLength = lengthRules[countryCode];
    if (expectedLength && stripped.length !== expectedLength) {
      errorEl.textContent = `A ${countryCode} number should have ${expectedLength} digits after the country code. You entered ${stripped.length}.`;
      input.style.borderColor = 'rgba(200,75,49,0.6)';
      return;
    }

    // Build full international number
    const fullNumber = `${countryCode}${stripped}`;

    // Submit
    btn.textContent = 'Submitting...';
    btn.disabled = true;

    try {
      const response = await fetch('https://formspree.io/f/xqeypgna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ phone: fullNumber })
      });

      if (response.ok) {
        btn.textContent = "✓ You're on the list!";
        btn.style.background = '#2a6e4a';
        btn.style.color = '#fff';
        input.value = '';
        input.placeholder = 'Thank you 💛';
        input.disabled = true;
        document.getElementById('country-code').disabled = true;
        errorEl.style.color = '#2a6e4a';
        errorEl.textContent = `We'll be in touch on ${fullNumber}`;
      } else {
        btn.textContent = 'Try again';
        btn.disabled = false;
        errorEl.textContent = 'Something went wrong — please try again.';
      }
    } catch (err) {
      btn.textContent = 'Try again';
      btn.disabled = false;
      errorEl.textContent = 'Connection error — please check your internet and try again.';
    }
  }

  // Scroll reveal
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.step, .feat, .use-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    observer.observe(el);
  });