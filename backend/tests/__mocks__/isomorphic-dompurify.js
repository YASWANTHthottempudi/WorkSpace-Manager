/**
 * Mock for isomorphic-dompurify
 * Used in Jest tests to avoid jsdom dependency issues
 */

export default function createDOMPurify(window) {
  return {
    sanitize: (dirty, config) => {
      // Simple mock - just return the input string
      return dirty;
    },
  };
}

