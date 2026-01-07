import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Debounced değer hook'u
 * Değer değiştiğinde belirtilen süre bekler, sonra günceller
 * 
 * @param value - Debounce edilecek değer
 * @param delay - Bekleme süresi (ms)
 * @returns Debounced değer
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Debounced callback hook'u
 * Fonksiyonu debounce eder
 * 
 * @param callback - Debounce edilecek fonksiyon
 * @param delay - Bekleme süresi (ms)
 * @returns Debounced fonksiyon
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
    callback: T,
    delay: number
): (...args: Parameters<T>) => void {
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const callbackRef = useRef(callback);

    // Callback'i güncel tut
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return useCallback((...args: Parameters<T>) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            callbackRef.current(...args);
        }, delay);
    }, [delay]);
}

/**
 * Throttled callback hook'u
 * Fonksiyonu throttle eder (belirli aralıklarla çalıştırır)
 * 
 * @param callback - Throttle edilecek fonksiyon
 * @param delay - Minimum aralık (ms)
 * @returns Throttled fonksiyon
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
    callback: T,
    delay: number
): (...args: Parameters<T>) => void {
    const lastRunRef = useRef<number>(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return useCallback((...args: Parameters<T>) => {
        const now = Date.now();
        const timeSinceLastRun = now - lastRunRef.current;

        if (timeSinceLastRun >= delay) {
            lastRunRef.current = now;
            callbackRef.current(...args);
        } else {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                lastRunRef.current = Date.now();
                callbackRef.current(...args);
            }, delay - timeSinceLastRun);
        }
    }, [delay]);
}

