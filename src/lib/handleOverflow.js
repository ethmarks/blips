// Only run if we're in the browser (not during SSR)
if (typeof window !== 'undefined') {
  function updateOverflowClasses() {
      const widthOverflowClass = "width-overflow";
      const heightOverflowClass = "height-overflow";

      const body = document.body;

      const contentWidth = body.scrollWidth;
      const contentHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );

      const containerWidth = window.innerWidth;
      const containerHeight = window.innerHeight;

      if (contentHeight === 0 || contentWidth === 0) {
        return;
      }

      if (contentWidth > containerWidth) {
        body.classList.add(widthOverflowClass);
      } else {
        body.classList.remove(widthOverflowClass);
      }

      if (contentHeight > containerHeight) {
        body.classList.add(heightOverflowClass);
      } else {
        body.classList.remove(heightOverflowClass);
      }
    }

  window.updateOverflowClasses = updateOverflowClasses;

  window.addEventListener("DOMContentLoaded", updateOverflowClasses);
  window.addEventListener("resize", updateOverflowClasses);

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', updateOverflowClasses);
  } else {
    updateOverflowClasses();
  }
}
