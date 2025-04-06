/**
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to wait before invoking the function
 * @return {Function} - A debounced version of the input function
 */
function debounce<T extends Function>(func: T, wait = 20) {
  let h = 0;
  const callable = (...args: any) => {
    clearTimeout(h);
    h = setTimeout(() => func(...args), wait);
  };
  return <T>(<any>callable);
}

export { debounce };
