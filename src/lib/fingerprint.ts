import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fpPromise: Promise<any> | null = null;

declare global {
  interface Window {
    AndroidInterface?: {
      getDeviceId: () => string;
    };
    webkit?: {
      messageHandlers?: {
        getDeviceId?: any;
      };
    };
    NATIVE_DEVICE_ID?: string;
  }
}

/**
 * Gets a unique device identifier.
 * Checks native wrappers (Android/iOS) first, then falls back to FingerprintJS.
 */
export async function getDeviceId(): Promise<string> {
  if (typeof window === 'undefined') return 'SSR_ENV';
  
  // Check for Android Native Bridge
  if (window.AndroidInterface && typeof window.AndroidInterface.getDeviceId === 'function') {
    try {
      const id = window.AndroidInterface.getDeviceId();
      if (id) return id;
    } catch (e) {
      console.warn('Failed to get Android native device ID', e);
    }
  }

  // Check for injected Native ID (works for iOS and Android if injected at page load)
  if (window.NATIVE_DEVICE_ID) {
    return window.NATIVE_DEVICE_ID;
  }
  
  // Fallback to browser fingerprinting
  if (!fpPromise) {
    fpPromise = FingerprintJS.load();
  }
  
  try {
    const fp = await fpPromise;
    const result = await fp.get();
    return result.visitorId;
  } catch (error) {
    console.error('FingerprintJS error, falling back to random UUID', error);
    // Ultimate fallback if fingerprint script gets blocked
    let fallbackId = localStorage.getItem('BITA_FALLBACK_DEVICE_ID');
    if (!fallbackId) {
      fallbackId = 'uuid-' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('BITA_FALLBACK_DEVICE_ID', fallbackId);
    }
    return fallbackId;
  }
}

/**
 * Detects the current platform (Android, iOS, or Web).
 */
export function getDevicePlatform(): 'android' | 'ios' | 'web' {
  if (typeof window === 'undefined') return 'web';

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  if (/windows phone/i.test(userAgent)) {
    return 'web';
  }

  if (/android/i.test(userAgent)) {
    return 'android';
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return 'ios';
  }

  // Also check maxTouchPoints for newer iPads that claim to be Macs
  if (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform)) {
    return 'ios';
  }

  return 'web';
}