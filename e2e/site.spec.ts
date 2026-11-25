import { test, expect, type Page } from '@playwright/test';

const ROUTES = [
  '/',
  '/menu',
  '/experience',
  '/about',
  '/gallery',
  '/booking',
  '/contact',
  '/privacy',
  '/terms',
  '/definitely-not-a-page',
];

/** Collects console errors and page exceptions for the life of the page. */
function watchForErrors(page: Page) {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
  });
  page.on('pageerror', (err) => {
    errors.push(`pageerror: ${err.message}`);
  });

  return errors;
}

/** Scrolls in steps so IntersectionObservers and ScrollTriggers fire. */
async function scrollThrough(page: Page, steps = 14) {
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(160);
  }
  await page.waitForTimeout(500);
}

/**
 * Waits for the preloader to finish and unlock the page. It intentionally
 * blocks pointer events, so any test that clicks must wait it out first.
 */
async function waitForIntro(page: Page) {
  await expect(page.locator('body.is-loading')).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator('.preloader')).toHaveCount(0, { timeout: 15_000 });
}

/**
 * Waits until Lenis has stopped moving the page. Playwright's actionability
 * checks measure element position, so clicking mid-flight means clicking a
 * stale coordinate.
 */
async function waitForScrollIdle(page: Page, timeout = 6000) {
  const start = Date.now();
  let last = -1;
  let stableFor = 0;

  while (Date.now() - start < timeout) {
    const y = await page.evaluate(() => window.scrollY);
    if (y === last) {
      stableFor += 150;
      if (stableFor >= 450) return;
    } else {
      stableFor = 0;
      last = y;
    }
    await page.waitForTimeout(150);
  }
}

test.describe('Routes render without runtime errors', () => {
  for (const route of ROUTES) {
    test(`renders ${route}`, async ({ page }) => {
      const errors = watchForErrors(page);
      const response = await page.goto(route, { waitUntil: 'networkidle' });

      expect(response?.status()).toBeLessThan(400);
      await expect(page.locator('main')).toBeVisible();

      const text = (await page.locator('main').innerText()).trim();
      expect(text.length).toBeGreaterThan(120);

      await expect(page.locator('footer')).toBeAttached();

      expect(errors, `errors on ${route}: ${errors.join(' | ')}`).toHaveLength(0);
    });
  }
});

test.describe('Per-route metadata', () => {
  test('each route sets a distinct document title', async ({ page }) => {
    const seen = new Set<string>();

    for (const route of ['/', '/menu', '/about', '/gallery', '/booking', '/contact']) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
      seen.add(title);
    }

    expect(seen.size).toBe(6);
  });

  test('description meta is populated on inner pages', async ({ page }) => {
    await page.goto('/booking', { waitUntil: 'domcontentloaded' });
    const desc = await page.locator('head meta[name="description"]').getAttribute('content');
    expect(desc).toBeTruthy();
    expect(desc!.length).toBeGreaterThan(40);
  });
});

test.describe('Scroll-driven sections', () => {
  test('preloader clears and the hero becomes visible', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('.hero__title')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('body.is-loading')).toHaveCount(0);
  });

  test('page unlocks even if the preloader timeline never completes', async ({ page }) => {
    // Simulate a stalled animation to prove the failsafe releases the page
    await page.addInitScript(() => {
      (window as unknown as { __gsapPaused?: boolean }).__gsapPaused = true;
    });

    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Regardless of how long the intro takes, the lock must clear
    await expect(page.locator('body.is-loading')).toHaveCount(0, { timeout: 20_000 });

    const overflow = await page.evaluate(
      () => getComputedStyle(document.body).overflow,
    );
    expect(overflow).not.toBe('hidden');

    // And the page must be genuinely interactive
    await expect(page.locator('.hero__title')).toBeVisible();
  });

  test('the page actually scrolls', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);

    const before = await page.evaluate(() => window.scrollY);
    await scrollThrough(page);
    const after = await page.evaluate(() => window.scrollY);

    expect(after).toBeGreaterThan(before);
  });

  test('signature dishes pins and swaps the active course', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const section = page.locator('.sig');
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);

    const firstActive = await page.locator('.sig__panel.is-active h3').innerText();

    // Scrub into the pinned range so a later course becomes active
    await page.evaluate(() => {
      const el = document.querySelector('.sig');
      const top = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + 2400 });
    });
    await page.waitForTimeout(1400);

    const laterActive = await page.locator('.sig__panel.is-active h3').innerText();
    expect(laterActive).not.toBe(firstActive);
    await expect(page.locator('.sig__stage')).toBeInViewport();
  });

  test('gallery rail translates horizontally on scroll', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const track = page.locator('.gr__track').first();
    await track.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);

    const before = await track.evaluate((el) => el.getBoundingClientRect().left);
    await page.evaluate(() => window.scrollBy(0, 2200));
    await page.waitForTimeout(1300);
    const after = await track.evaluate((el) => el.getBoundingClientRect().left);

    expect(after).toBeLessThan(before);
  });

  test('the philosophy statement is coloured in by scroll', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);

    const words = page.locator('.philo__word');
    await expect(words.first()).toBeAttached();

    const initial = await words.first().evaluate((el) => getComputedStyle(el).color);
    await page.evaluate(() => {
      const el = document.querySelector('.philo');
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + 420 });
    });
    await page.waitForTimeout(1600);
    const later = await words.first().evaluate((el) => getComputedStyle(el).color);

    expect(later).not.toBe(initial);
  });
});

test.describe('Interaction', () => {
  test('full-screen nav overlay opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await waitForIntro(page);

    const burger = page.locator('.nav__burger');
    await expect(burger).toBeVisible();
    await burger.click();
    await page.waitForTimeout(1000);

    await expect(page.locator('.nav-overlay').first()).toBeVisible();
    await expect(page.locator('.nav-overlay__item').first()).toBeVisible();

    await burger.click();
    await page.waitForTimeout(1000);
  });

  test('gallery lightbox opens and closes on Escape', async ({ page }) => {
    await page.goto('/gallery', { waitUntil: 'networkidle' });
    await waitForIntro(page);
    await page.waitForTimeout(400);

    await page.locator('.gal__item').first().click();
    await expect(page.locator('.lightbox')).toBeVisible();
    await expect(page.locator('.lightbox__frame')).toBeVisible();

    await page.keyboard.press('Escape');
    await page.waitForTimeout(700);
    await expect(page.locator('.lightbox')).toHaveCount(0);
  });

  test('booking flow validates and completes end to end', async ({ page }) => {
    await page.goto('/booking', { waitUntil: 'networkidle' });
    await waitForIntro(page);
    await page.waitForTimeout(300);

    // Cannot continue without an occasion
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page.getByText(/Tell me what we are celebrating/i)).toBeVisible();

    await page.getByRole('button', { name: 'Anniversary', exact: true }).click();
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page.getByText('Which menu speaks to you?')).toBeVisible();

    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page.getByText('When and where?')).toBeVisible();

    const d = new Date();
    d.setDate(d.getDate() + 30);
    await page.getByLabel(/preferred date/i).fill(d.toISOString().slice(0, 10));
    await page.getByLabel(/where should i cook/i).fill('12 Clifton Road, London E8');
    await page.getByRole('button', { name: /continue/i }).click();

    await page.getByLabel(/full name/i).fill('Amara Osei');
    await page.getByLabel('Email', { exact: true }).fill('amara@example.com');
    await page.getByRole('button', { name: /send request/i }).click();

    await expect(page.getByText(/your date is/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('amara@example.com')).toBeVisible();
  });

  test('each legal route renders its own document', async ({ page }) => {
    await page.goto('/privacy', { waitUntil: 'networkidle' });
    await waitForIntro(page);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Privacy');
    await expect(page.getByText('What I collect', { exact: true })).toBeAttached();

    await page.goto('/terms', { waitUntil: 'networkidle' });
    await waitForIntro(page);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Terms');
    // Terms-specific copy must be present, and privacy copy must not be
    await expect(page.getByText('Booking and deposit', { exact: true })).toBeAttached();
    await expect(page.getByText('What I collect', { exact: true })).toHaveCount(0);
  });

  test('the privacy and terms documents cross-link to each other', async ({ page }) => {
    await page.goto('/privacy', { waitUntil: 'networkidle' });
    await waitForIntro(page);

    await page.getByRole('link', { name: /read the terms/i }).click();
    await expect(page).toHaveURL(/\/terms$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Terms');

    await page.getByRole('link', { name: /read the privacy policy/i }).click();
    await expect(page).toHaveURL(/\/privacy$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Privacy');
  });

  test('decorative overlays never intercept clicks on footer links', async ({ page }) => {
    // Tall enough that the whole footer, including the base bar, is in view
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await waitForIntro(page);

    const footer = page.locator('footer');
    const result = await page.evaluate(() => {
      const names = ['Privacy', 'Terms', 'Back to top'];
      const out: Array<{ name: string; blocker: string }> = [];

      const link = (name) =>
        [...document.querySelectorAll('footer a, footer button')].find((l) =>
          (l.textContent || '').trim().toLowerCase().startsWith(name.toLowerCase()),
        );

      for (const name of names) {
        const el = link(name);
        if (!el) {
          out.push({ name, blocker: 'LINK NOT FOUND' });
          continue;
        }

        // Bring this specific control into view before hit-testing it
        el.scrollIntoView({ block: 'center', behavior: 'instant' as ScrollBehavior });
        const b = el.getBoundingClientRect();

        if (b.top < 0 || b.bottom > window.innerHeight) {
          out.push({ name, blocker: 'OUT OF VIEWPORT' });
          continue;
        }

        const hit = document.elementFromPoint(b.x + b.width / 2, b.y + b.height / 2);
        const isSelf = hit === el || el.contains(hit);
        out.push({
          name,
          blocker: isSelf ? 'ok' : (hit ? `${hit.tagName}.${hit.className}` : 'HIT TEST RETURNED NULL'),
        });
      }
      return out;
    });

    void footer;
    for (const { name, blocker } of result) {
      expect(blocker, `"${name}" is blocked by ${blocker}`).toBe('ok');
    }
  });

  test('footer legal links resolve to real pages', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await waitForIntro(page);

    const footer = page.locator('footer');
    const privacy = footer.getByRole('link', { name: 'Privacy' });
    const terms = footer.getByRole('link', { name: 'Terms' });

    // The links must actually point somewhere real
    await expect(privacy).toHaveAttribute('href', '/privacy');
    await expect(terms).toHaveAttribute('href', '/terms');

    await privacy.scrollIntoViewIfNeeded();
    await waitForScrollIdle(page);
    await privacy.click();
    await expect(page).toHaveURL(/\/privacy$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Privacy');

    await waitForIntro(page);
    const terms2 = page.locator('footer').getByRole('link', { name: 'Terms' });
    await terms2.scrollIntoViewIfNeeded();
    await waitForScrollIdle(page);
    await terms2.click();
    await expect(page).toHaveURL(/\/terms$/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Terms');
  });
});

test.describe('Responsive', () => {
  test('no horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1300);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    // Allow a couple of pixels of sub-pixel rounding
    expect(overflow).toBeLessThanOrEqual(2);
  });
});


