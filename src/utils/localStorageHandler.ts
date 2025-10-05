// utils/localStorageService.js

const isBrowser = () => typeof window !== "undefined";

const localStorageServiceSelectedOptions = {
  setItem: (value:any) => {
    if (!isBrowser()) return;
    try {
      const serializedValue = JSON.stringify(value);
      window.localStorage.setItem("arp_property", serializedValue);
    } catch (error) {
      console.error("Error setting localStorage item", error);
    }
  },

  getItem: () => {
    if (!isBrowser()) return null;
    try {
      const value = window.localStorage.getItem("arp_property");
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Error getting localStorage item", error);
      return null;
    }
  },

  removeItem: () => {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem("arp_property");
    } catch (error) {
      console.error("Error removing localStorage item", error);
    }
  },

  clear: () => {
    if (!isBrowser()) return;
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage", error);
    }
  },
};

export default localStorageServiceSelectedOptions;
