export const cacheData = {
  set: (key: string, data: any, ttl: number) => {
    const now = new Date().getTime();
    const item = {
      data,
      expiry: now + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  },

  get: (key: string) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date().getTime();

    if (now > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.data;
  },

  remove: (key: string) => {
    localStorage.removeItem(key);
  },

  clear: () => {
    localStorage.clear();
  },
};
