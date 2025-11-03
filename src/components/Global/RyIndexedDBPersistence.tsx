import { useEffect } from 'react';
import { useStore } from '../../lib/store';

export const useIndexedDB = () => {
  const store = useStore();

  useEffect(() => {
    if (!('indexedDB' in window)) {
      console.log('IndexedDB not supported');
      return;
    }

    const dbName = 'ryze-cache';
    const storeName = 'state';
    const request = indexedDB.open(dbName, 1);

    request.onerror = () => console.log('IndexedDB error');
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const objectStore = transaction.objectStore(storeName);

      const stateToCache = {
        portfolio: store.portfolio,
        markets: store.markets,
        perps: store.perps,
        timestamp: Date.now()
      };

      objectStore.put(stateToCache, 'ryze-state');
    };

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName);
      }
    };
  }, [store.portfolio, store.markets, store.perps]);

  // Load from IndexedDB on init
  useEffect(() => {
    const dbName = 'ryze-cache';
    const storeName = 'state';
    const request = indexedDB.open(dbName, 1);

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readonly');
      const objectStore = transaction.objectStore(storeName);
      const getRequest = objectStore.get('ryze-state');

      getRequest.onsuccess = () => {
        const cached = getRequest.result;
        if (cached && Date.now() - cached.timestamp < 3600000) {
          // Cache valid for 1 hour
          useStore.setState({
            portfolio: cached.portfolio || store.portfolio,
            markets: cached.markets || store.markets,
            perps: cached.perps || store.perps
          });
        }
      };
    };
  }, []);
};

export default useIndexedDB;
