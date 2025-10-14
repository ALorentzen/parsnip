export function wpReady(cb: (wp: any) => void, tries = 0): void {
  const w: any = (window as any).wp;
  if (w?.blocks && w?.blockEditor && w?.element && w?.i18n) return cb(w);
  if (tries > 300) return; // ~9s safety stop
  setTimeout(() => wpReady(cb, tries + 1), 30);
}
