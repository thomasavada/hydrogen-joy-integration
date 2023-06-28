/**
 *
 * @param id
 * @param url
 */
export default function loadScript({id = null, url = null}) {
  const hasScript = document.querySelector(`#${id}`);
  if (!hasScript) {
    const script = document.createElement('script');
    script.id = id;
    script.setAttribute('src', url);
    script.async = true;
    document.body.appendChild(script);
  }
}
