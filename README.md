# Glow & Grace Beauty Studio: Demo Website

A premium, responsive beauty salon website built with plain HTML, CSS and JavaScript (no frameworks, no build tools). Designed as a demo you can customise and resell to real salons.

## 1. What each file does

| File | Purpose |
|------|---------|
| `index.html` | The page itself: all text and sections (navigation, hero, about, services, packages, gallery, testimonials, booking form, contact, footer). |
| `css/style.css` | All the design: colors, fonts, layout, animations and mobile rules. |
| `js/script.js` | The behavior: **settings block (`SITE_CONFIG`)**, mobile menu, scroll animations, gallery viewer, form validation and WhatsApp link. |
| `images/` | Local placeholder images (SVG). Replace them with real photos. |
| `README.md` | This guide. |

## 2. How to run it on your computer

**Easiest way:** double-click `index.html`. It opens in your browser.

**Better way (recommended, VS Code):**
1. Install [Visual Studio Code](https://code.visualstudio.com/).
2. Open the `beauty-parlour-website` folder in VS Code.
3. Install the extension **Live Server**.
4. Right-click `index.html` and choose **Open with Live Server**. The page reloads automatically when you save changes.

**Note:** the Google Fonts (Cormorant Garamond and Poppins) need internet. Without it, the site still works using fallback fonts.

### If the website looks like plain text (no design)
This always means the browser could not find `css/style.css`. The usual causes:
- You opened `index.html` **inside the ZIP** without extracting it. Right-click the ZIP and choose **Extract All**, then open the extracted folder.
- `index.html` was **moved or copied alone**. It must stay in the same folder as `css/`, `js/` and `images/`.

The site now shows a rose-coloured warning bar when this happens. For a copy that never breaks, use **`glow-and-grace-standalone.html`**: one file with the CSS, JavaScript and images built in. After editing any file, rebuild it with `python build-standalone.py` (or `python3` / `py`, depending on your computer).

## 3. How to customise it for a real client

### a) Salon name, WhatsApp number, phone, email, address, Instagram, map
Open `js/script.js`. At the top you will see:

```js
const SITE_CONFIG = {
  brandName: "Glow & Grace",
  whatsappNumber: "919999999999",
  displayPhone: "+91 99999 99999",
  email: "hello@glowandgrace.example",
  address: "123 Sample Street, Your City, State 000000",
  instagramUrl: "https://instagram.com/",
  mapEmbedUrl: ""
};
```

- **whatsappNumber:** country code + number, digits only, no `+` or spaces. Example: India `98765 43210` becomes `"919876543210"`.
- **mapEmbedUrl:** in Google Maps, search the salon, click **Share → Embed a map**, copy only the URL inside `src="..."`, and paste it between the quotes.

These values update the contact section, footer, all WhatsApp buttons and the booking form automatically.

### b) Salon name in other places (text and title)
In `index.html`, use Find & Replace (`Ctrl + H`) for `Glow & Grace` and `Glow &amp; Grace` (HTML writes `&` as `&amp;`). Also update the `<title>` and `<meta name="description">` near the top, which matter for Google search.

### c) Images
1. Put the client's photos in the `images/` folder.
2. Keep the same file names (for example `hero.svg` becomes `hero.jpg`), **or** change the file names in `index.html` (search for `images/`). The hero background is set in `css/style.css` (search for `hero.svg`).
3. For fast loading, use JPG or WebP photos, about 1600 px wide for the hero and 800 px for everything else, and compress them (for example with squoosh.app).
4. Remember to update the `alt="..."` text to describe each photo.

### d) Services and prices
In `index.html`, find the section `4. SERVICES`. Each service is one `<article class="card service-card">` block. Edit the name, description and the text like `From ₹500`. To add a service, copy a whole block and paste it below. Then add the same service name as an `<option>` in the booking form's service list, and use the same name in the button's `data-service="..."`.

To remove a service, delete its block and its `<option>`.

### e) Packages
Find `5. SPECIAL PACKAGES` in `index.html`. Edit the title, price, description and the bullet points.

### f) Colors and fonts
At the top of `css/style.css`, edit the values under `:root`, for example `--rose-gold: #b76e79;`. Changing these re-themes the whole website.

### g) Opening hours
In `index.html`, find `Opening Hours` in the contact section and edit the two lines.

### h) Testimonials
The testimonials are **samples**, clearly labelled. Replace them with real client reviews (with permission), then delete the `sample-tag` labels and the demo notes.

## 4. How the booking form works (important)

This website has no backend, so the form **cannot save or confirm bookings**. Instead it:
1. Checks every field (name, phone, email, service, date, time).
2. Opens WhatsApp with a ready-to-send enquiry message addressed to the salon's number.
3. Tells the customer that the appointment is confirmed only after the salon replies.

This is honest and works for most small salons. If a client later wants real online booking, you can connect the form to a service like Formspree, or a booking system.

## 5. Before showing or selling it

- [ ] Replace placeholder images with real photos.
- [ ] Replace demo phone, email, address and Instagram link.
- [ ] Remove the "demo prices", "sample testimonial" and demo footer notes when the real content is in.
- [ ] Test the WhatsApp button on your phone.
- [ ] Put it online (free options: Netlify, GitHub Pages, Cloudflare Pages).

## 6. Browser support
Works in current Chrome, Edge, Firefox, Safari and mobile browsers.
