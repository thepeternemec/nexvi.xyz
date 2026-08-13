# ApplyWise — GTM setup (Custom HTML tags + GA4)

Container: `GTM-5LC8WCN6`. The app pushes objects like
`dataLayer.push({ event: "generate_cv", tool: "cv", plan: "free", ... })`.

## 1. Data Layer Variables (create these first)

Variables → New → Data Layer Variable. Name = `DLV - <key>`, Data Layer Variable Name = `<key>`:

```
user_id, user_email, user_plan, user_status, language,
page_path, page_title,
tool, error,
prompt_id, prompt_slug, prompt_title, prompt_premium, prompt_category, method,
source, plan, trial, value, currency,
consent_essential, consent_functional, consent_analytics, consent_version,
search_term
```

## 2. Triggers

Triggers → New → Custom Event. Event name = the values below (one trigger each):

`page_view`, `user_identified`, `sign_up`, `login`, `logout`,
`generate_cv`, `generate_cover_letter`, `score_ats`, `humanize_text`,
`prompt_view`, `prompt_copy`, `prompt_share`, `prompt_save`, `prompt_unsave`,
`upgrade_prompt_shown`, `upgrade_cta_click`,
`checkout_initiated`, `checkout_completed`, `cookie_consent`, `search`, `select_content`

Tip: for the tool events you can use one trigger with **Event name matches RegEx**:
`^(generate_cv|generate_cover_letter|score_ats|humanize_text)$`.

## 3. Custom HTML tags

Each tag below assumes `gtag()` exists (GA4 Configuration tag fires first on Initialization).
Paste into Tags → New → Custom HTML, attach the matching trigger, and set
**Tag firing priority** lower than the GA4 config tag.

Replace `G-XXXXXXXXXX` with your GA4 Measurement ID.

### 3.0 GA4 base (trigger: Initialization – All Pages)

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', { send_page_view: false });
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

### 3.1 page_view (trigger: Custom Event `page_view`)

```html
<script>
  gtag('event', 'page_view', {
    page_path: {{DLV - page_path}},
    page_title: {{DLV - page_title}},
    language: {{DLV - language}}
  });
</script>
```

### 3.2 user_identified (trigger: Custom Event `user_identified`)

```html
<script>
  gtag('set', 'user_id', {{DLV - user_id}} || undefined);
  gtag('set', 'user_properties', {
    user_plan: {{DLV - user_plan}},
    user_status: {{DLV - user_status}},
    language: {{DLV - language}}
  });
</script>
```

### 3.3 Auth events (trigger: `sign_up`, `login`, `logout`)

```html
<script>
  gtag('event', {{Event}}, {
    method: {{DLV - method}} || 'email',
    user_plan: {{DLV - user_plan}},
    language: {{DLV - language}}
  });
</script>
```

### 3.4 Tool generations (trigger: RegEx trigger from step 2)

```html
<script>
  gtag('event', {{Event}}, {
    tool: {{DLV - tool}},
    user_plan: {{DLV - plan}},
    language: {{DLV - language}},
    error: {{DLV - error}} || undefined
  });
</script>
```

### 3.5 Prompt interactions (triggers: `prompt_view|copy|share|save|unsave`)

```html
<script>
  gtag('event', {{Event}}, {
    item_id: {{DLV - prompt_id}},
    item_name: {{DLV - prompt_title}},
    item_category: {{DLV - prompt_category}},
    prompt_slug: {{DLV - prompt_slug}},
    prompt_premium: {{DLV - prompt_premium}},
    share_method: {{DLV - method}} || undefined,
    user_plan: {{DLV - plan}},
    language: {{DLV - language}}
  });
</script>
```

### 3.6 Upsell (triggers: `upgrade_prompt_shown`, `upgrade_cta_click`)

```html
<script>
  gtag('event', {{Event}}, {
    source: {{DLV - source}},
    item_name: {{DLV - prompt_title}},
    prompt_slug: {{DLV - prompt_slug}},
    user_plan: {{DLV - plan}},
    language: {{DLV - language}}
  });
</script>
```

### 3.7 checkout_initiated → GA4 `begin_checkout`

```html
<script>
  gtag('event', 'begin_checkout', {
    currency: {{DLV - currency}} || 'EUR',
    value: {{DLV - value}} || 0,
    items: [{
      item_id: {{DLV - plan}},
      item_name: {{DLV - plan}},
      price: {{DLV - value}} || 0,
      quantity: 1
    }],
    trial: {{DLV - trial}},
    language: {{DLV - language}}
  });
</script>
```

### 3.8 checkout_completed → GA4 `purchase`

```html
<script>
  gtag('event', 'purchase', {
    transaction_id: 'aw-' + Date.now(),
    currency: {{DLV - currency}} || 'EUR',
    value: {{DLV - value}} || 0,
    items: [{
      item_id: {{DLV - plan}},
      item_name: {{DLV - plan}},
      price: {{DLV - value}} || 0,
      quantity: 1
    }],
    trial: {{DLV - trial}},
    language: {{DLV - language}}
  });
</script>
```

### 3.9 cookie_consent → Consent Mode update (trigger: `cookie_consent`)

Set this tag's firing priority **above** all other tags.

```html
<script>
  gtag('consent', 'update', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: {{DLV - consent_analytics}} ? 'granted' : 'denied',
    functionality_storage: {{DLV - consent_functional}} ? 'granted' : 'denied',
    personalization_storage: {{DLV - consent_functional}} ? 'granted' : 'denied',
    security_storage: 'granted'
  });
  gtag('event', 'cookie_consent', {
    consent_analytics: {{DLV - consent_analytics}},
    consent_functional: {{DLV - consent_functional}},
    consent_version: {{DLV - consent_version}}
  });
</script>
```

Consent defaults (Initialization – All Pages, priority 100):

```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', functionality_storage: 'denied',
    personalization_storage: 'denied', security_storage: 'granted',
    wait_for_update: 500
  });
</script>
```

### 3.10 search (trigger: `search`)

```html
<script>
  gtag('event', 'search', {
    search_term: {{DLV - search_term}},
    language: {{DLV - language}}
  });
</script>
```

### 3.11 select_content (trigger: `select_content`)

```html
<script>
  gtag('event', 'select_content', {
    content_type: {{DLV - tool}} || 'prompt',
    item_id: {{DLV - prompt_id}},
    item_name: {{DLV - prompt_title}},
    language: {{DLV - language}}
  });
</script>
```

## 4. Verify

1. GTM → Preview, open `https://applywise.eu`.
2. Confirm `page_view` and `cookie_consent` appear in the Data Layer tab.
3. GA4 → Admin → DebugView shows the mapped events.
