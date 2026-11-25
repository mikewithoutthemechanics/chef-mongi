import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, within, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Menu from '../pages/Menu';
import Experience from '../pages/Experience';
import About from '../pages/About';
import Gallery from '../pages/Gallery';
import Booking from '../pages/Booking';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';

function renderAt(ui: React.ReactElement, path = '/') {
  return render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>);
}

/** jsdom has no layout engine, so drive controlled inputs by hand. */
function setInput(el: HTMLInputElement | HTMLTextAreaElement, value: string) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement : HTMLInputElement;
  const setter = Object.getOwnPropertyDescriptor(proto.prototype, 'value')?.set;
  setter?.call(el, value);
  fireEvent.change(el, { target: { value } });
}

function futureDate(daysAhead: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().slice(0, 10);
}

function click(name: RegExp | string) {
  fireEvent.click(screen.getByRole('button', { name }));
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('Home page', () => {
  it('renders the hero headline and primary calls to action', () => {
    renderAt(<Home />);
    expect(screen.getByRole('heading', { level: 1 })).toBeDefined();
    expect(screen.getAllByRole('link', { name: /reserve a date/i }).length).toBeGreaterThan(0);
  });

  it('renders the philosophy statement', () => {
    const { container } = renderAt(<Home />);
    // SplitText wraps the paragraph in per-word spans, so match against
    // the section's combined text rather than a single node.
    const text = container.querySelector('.philo__text')?.textContent ?? '';
    expect(text).toMatch(/I was not taught to cook European food/i);
  });

  it('renders the signature dish panels', () => {
    renderAt(<Home />);
    expect(screen.getByText('Smoked Jollof Risotto')).toBeDefined();
    expect(screen.getByText('Suya Beef Tataki')).toBeDefined();
  });

  it('renders the four service cards', () => {
    renderAt(<Home />);
    expect(screen.getByText('Private Dining')).toBeDefined();
    expect(screen.getByText('Events & Celebrations')).toBeDefined();
    expect(screen.getByText('Destination Experiences')).toBeDefined();
    expect(screen.getByText('Culinary Consulting')).toBeDefined();
  });

  it('renders stats, process steps and FAQs', () => {
    renderAt(<Home />);
    expect(screen.getByText('Behind the pass')).toBeDefined();
    expect(screen.getByText('The conversation')).toBeDefined();
    expect(screen.getByText(/What is the minimum booking/i)).toBeDefined();
  });
});

describe('Menu page', () => {
  it('lists every dish and all tasting menus', () => {
    renderAt(<Menu />, '/menu');
    expect(screen.getByText('Jollof Souffl\u00e9')).toBeDefined();
    expect(screen.getByText('Kunu Chocolate Delice')).toBeDefined();
    expect(screen.getByText('The Signature Tasting')).toBeDefined();
    expect(screen.getByText('The Afro-Global Odyssey')).toBeDefined();
  });

  it('filters the dish list by course', () => {
    const { container } = renderAt(<Menu />, '/menu');

    fireEvent.click(screen.getAllByRole('button', { name: 'Main' })[0]);

    const names = [...container.querySelectorAll('.dish-card__name')].map(
      (el) => el.textContent,
    );
    expect(names).toContain('Okra & Aged Tenderloin');
    expect(names).not.toContain('Kunu Chocolate Delice');
  });
});

describe('Inner pages', () => {
  it('renders the experience page journey', () => {
    renderAt(<Experience />, '/experience');
    expect(screen.getByText('Born in Tamale')).toBeDefined();
    expect(screen.getByText('A star in the window')).toBeDefined();
  });

  it('renders the about page biography and credentials', () => {
    renderAt(<About />, '/about');
    expect(screen.getByText(/I cook the food I grew up eating/i)).toBeDefined();
    expect(screen.getByText('Founded Mongi Fana Private Dining')).toBeDefined();
  });

  it('renders the gallery grid with captions', () => {
    renderAt(<Gallery />, '/gallery');
    expect(screen.getByText('Jollof risotto, smoked tomato broth')).toBeDefined();
  });

  it('renders the contact channels and areas', () => {
    renderAt(<Contact />, '/contact');
    expect(screen.getByText('book@mongifana.com')).toBeDefined();
    expect(screen.getByText('Amalfi Coast')).toBeDefined();
  });
});

describe('Not found', () => {
  it('renders the 404 message and recovery links', () => {
    renderAt(<NotFound />, '/does-not-exist');
    expect(screen.getByText(/not on the menu/i)).toBeDefined();
    expect(screen.getByRole('link', { name: /back to the kitchen/i })).toBeDefined();
  });
});

describe('Booking flow', () => {
  it('blocks progression until an occasion is chosen', () => {
    renderAt(<Booking />, '/booking');

    expect(screen.getByText('What are we celebrating?')).toBeDefined();

    click(/continue/i);

    // Still on step 1 because no occasion has been selected
    expect(screen.getByText('What are we celebrating?')).toBeDefined();
    expect(screen.getByText(/Tell me what we are celebrating/i)).toBeDefined();
  });

  it('rejects an invalid email on the final step', () => {
    renderAt(<Booking />, '/booking');

    click('Anniversary');
    click(/continue/i);
    click(/continue/i);

    setInput(screen.getByLabelText(/preferred date/i) as HTMLInputElement, futureDate(30));
    setInput(
      screen.getByLabelText(/where should i cook/i) as HTMLInputElement,
      '12 Clifton Road, London E8',
    );
    click(/continue/i);

    expect(screen.getByText('And who am I cooking for?')).toBeDefined();

    setInput(screen.getByLabelText(/full name/i) as HTMLInputElement, 'Amara Osei');
    setInput(screen.getByLabelText(/^email$/i) as HTMLInputElement, 'not-an-email');
    click(/send request/i);

    expect(screen.getByText('And who am I cooking for?')).toBeDefined();
    expect(screen.getByText(/does not look right/i)).toBeDefined();
  });

  it('completes the flow and shows a confirmation summary', () => {
    const { container } = renderAt(<Booking />, '/booking');

    click('Birthday');
    click(/continue/i);
    click(/continue/i);

    setInput(screen.getByLabelText(/preferred date/i) as HTMLInputElement, futureDate(45));
    setInput(
      screen.getByLabelText(/where should i cook/i) as HTMLInputElement,
      '5 Vine Yard, London E2',
    );
    click(/continue/i);

    setInput(screen.getByLabelText(/full name/i) as HTMLInputElement, 'Amara Osei');
    setInput(screen.getByLabelText(/^email$/i) as HTMLInputElement, 'amara@example.com');
    click(/send request/i);

    expect(screen.getByText(/your date is/i)).toBeDefined();
    // The confirmation echoes the enquiry details back to the guest
    expect(within(container).getByText('Birthday')).toBeDefined();
    expect(within(container).getByText('amara@example.com')).toBeDefined();
    expect(within(container).getByText('5 Vine Yard, London E2')).toBeDefined();
  });

  it('estimates the total from the selected menu and guest count', () => {
    const { container } = renderAt(<Booking />, '/booking');

    // Signature tasting at GBP 185 pp with the default 4 guests
    const total = container.querySelector('.booking-summary__total strong');
    expect(total?.textContent).toBe('\u00a3740');
  });
});

