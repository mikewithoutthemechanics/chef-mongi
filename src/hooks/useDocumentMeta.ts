import { useEffect } from 'react';

type Meta = {
  title: string;
  description: string;
  /** Optional path-only override for og:url, e.g. "/menu". */
  path?: string;
};

const BASE_TITLE = 'Mongi Fana';
const DEFAULT_DESCRIPTION =
  'Mongi Fana is a private chef weaving West African soul into global fine dining. Intimate tasting menus, private events and destination experiences.';

function upsertMeta(selector: string, attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

/**
 * Keeps the document title, meta description and social tags in sync with
 * the active route. Without this every page shares the static index.html
 * title, which is poor for search and for link previews.
 */
export function useDocumentMeta({ title, description, path }: Meta) {
  useEffect(() => {
    const fullTitle = title === BASE_TITLE ? title : `${title} · ${BASE_TITLE}`;

    document.title = fullTitle;

    upsertMeta('meta[name="description"]', 'name', 'description', description || DEFAULT_DESCRIPTION);
    upsertMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    upsertMeta('meta[property="og:description"]', 'property', 'og:description', description || DEFAULT_DESCRIPTION);
    upsertMeta('meta[property="og:type"]', 'property', 'og:type', 'website');

    if (path) {
      upsertMeta('meta[property="og:url"]', 'property', 'og:url', window.location.origin + path);
    }
  }, [title, description, path]);
}
