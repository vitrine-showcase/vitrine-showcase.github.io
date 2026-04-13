/* eslint-disable import/prefer-default-export */

export function jump(h: string): void {
  window.location.href = `#${h}`; // Go to the target element.
}
