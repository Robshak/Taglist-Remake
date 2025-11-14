type StorageValue = string | null;

class ThrottledStorage {
  private pendingWrites = new Map<string, StorageValue>();
  private writeTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly delay: number;

  constructor(delay = 1000) {
    this.delay = delay;
  }

  getItem(name: string): string | null {
    if (this.pendingWrites.has(name)) {
      return this.pendingWrites.get(name) || null;
    }
    return localStorage.getItem(name);
  }

  setItem(name: string, value: string): void {
    this.pendingWrites.set(name, value);

    if (this.writeTimer) {
      clearTimeout(this.writeTimer);
    }

    this.writeTimer = setTimeout(() => {
      this.flush();
    }, this.delay);
  }

  removeItem(name: string): void {
    this.pendingWrites.set(name, null);

    if (this.writeTimer) {
      clearTimeout(this.writeTimer);
    }

    this.writeTimer = setTimeout(() => {
      this.flush();
    }, this.delay);
  }

  private flush(): void {
    this.pendingWrites.forEach((value, key) => {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    });

    this.pendingWrites.clear();
    this.writeTimer = null;
  }

  forceFlush(): void {
    if (this.writeTimer) {
      clearTimeout(this.writeTimer);
    }
    this.flush();
  }
}

export const throttledStorage = new ThrottledStorage(1000);

if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    throttledStorage.forceFlush();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      throttledStorage.forceFlush();
    }
  });
}

export const createThrottledStorage = (delay = 1000) => {
  const storage = new ThrottledStorage(delay);

  return {
    getItem: (name: string) => {
      const value = storage.getItem(name);
      return value ? JSON.parse(value) : null;
    },
    setItem: (name: string, value: unknown) => {
      storage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name: string) => {
      storage.removeItem(name);
    },
  };
};
