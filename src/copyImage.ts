import { toBlob } from 'html-to-image';

export type CopyImageResult = 'copied' | 'downloaded';

interface CopyImageOptions {
  backgroundColor: string;
  fileName: string;
}

export async function copyPreviewImage(
  node: HTMLElement,
  { backgroundColor, fileName }: CopyImageOptions,
): Promise<CopyImageResult> {
  const blobPromise = renderBlob(node, backgroundColor);

  if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
    try {
      // Promise form first: it keeps Safari's user-gesture activation alive
      // across the async render.
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blobPromise })]);
      return 'copied';
    } catch {
      try {
        // Some browsers reject the promise form; retry with the resolved blob.
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': await blobPromise })]);
        return 'copied';
      } catch {
        // Clipboard image write is unsupported or blocked; fall back to a download.
      }
    }
  }

  downloadBlob(await blobPromise, fileName);
  return 'downloaded';
}

async function renderBlob(node: HTMLElement, backgroundColor: string): Promise<Blob> {
  await document.fonts.ready;
  const blob = await toBlob(node, {
    // Capture at natural size: strip the fit-to-viewport transform (applied to
    // the clone only) and render against the theme background at 2x for sharpness.
    width: node.offsetWidth,
    height: node.offsetHeight,
    pixelRatio: 2,
    backgroundColor,
    // transform:none renders the clone unscaled; margin:0 guards against auto
    // margins resolving to pixel offsets that would shift the capture.
    style: { transform: 'none', margin: '0' },
  });
  if (!blob) {
    throw new Error('Could not render the preview image');
  }
  return blob;
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
