interface LoadScriptOptions {
  id?: string | null;
  url?: string | null;
}

/**
 *
 * @param id
 * @param url
 */
export default function loadScript({id = null, url = null}: LoadScriptOptions) {
  const hasScript = document.querySelector(`#${id}`);
  if (!hasScript) {
    const script = document.createElement('script');
    // @ts-ignore
    script.id = id;
    // @ts-ignore
    script.setAttribute('src', url);
    script.async = true;
    document.body.appendChild(script);
  }
}
