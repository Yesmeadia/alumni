export function useNonce() {
  const nonceElement = document.querySelector('meta[property="csp-nonce"]');
  return nonceElement?.getAttribute("content") || "";
}