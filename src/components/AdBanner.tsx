import { useEffect, CSSProperties, useState, useRef } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  style?: CSSProperties;
}

/**
 * Reusable Google AdSense component
 * IMPORTANT: Set VITE_ADSENSE_CLIENT_ID in your environment variables.
 */
export default function AdBanner({ slot, format = 'auto', style }: AdBannerProps) {
  const [adError, setAdError] = useState(false);
  const adRef = useRef<HTMLModElement>(null);
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;

  useEffect(() => {
    // Check if script is loaded and client ID exists
    if (!clientId) return;

    const timeoutId = setTimeout(() => {
      try {
        // Only push if the element exists and is visible
        if (adRef.current && adRef.current.offsetWidth > 0) {
          // @ts-ignore
          const adsbygoogle = window.adsbygoogle || [];
          adsbygoogle.push({});
        }
      } catch (e) {
        // Avoid noisy errors in dev or if push fails due to timing
        if (process.env.NODE_ENV !== 'production') {
          console.warn('AdSense notice:', e);
        } else {
          console.error('AdSense injection error:', e);
          setAdError(true);
        }
      }
    }, 750); // Slightly longer delay to ensure DOM and animations are settled

    return () => clearTimeout(timeoutId);
  }, [slot, clientId]);

  // Don't render anything if no client ID is provided
  if (!clientId) {
    return (
      <div className="my-8 p-8 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl bg-slate-50 dark:bg-black/20 text-center">
        <p className="text-sm font-medium text-slate-400">Advertisement Placeholder</p>
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Configure VITE_ADSENSE_CLIENT_ID to enable</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center my-8 overflow-hidden min-h-[100px]">
      {!adError ? (
        <ins
          ref={adRef}
          key={slot}
          className="adsbygoogle"
          style={style || { display: 'block' }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <div className="w-full text-center text-xs text-slate-400 italic">
          Ad failed to load
        </div>
      )}
    </div>
  );
}
