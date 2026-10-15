import { useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

export function useFitScale(
  naturalWidth: number,
  externalContentRef?: RefObject<HTMLDivElement | null>,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const internalContentRef = useRef<HTMLDivElement>(null);
  const contentRef = externalContentRef ?? internalContentRef;
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number>();

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) {
      return;
    }
    const update = () => {
      const nextScale = Math.min(1, container.clientWidth / naturalWidth);
      setScale(nextScale);
      setHeight(content.offsetHeight * nextScale);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    observer.observe(content);
    return () => observer.disconnect();
  }, [naturalWidth, contentRef]);

  return { containerRef, contentRef, scale, height };
}
