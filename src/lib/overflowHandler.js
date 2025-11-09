export function initOverflowHandlers() {
  function updateOverflowClasses() {
    const widthOverflowClass = "width-overflow";
    const heightOverflowClass = "height-overflow";

    const selectors = ["body", "pre", "table"];

    document.querySelectorAll(selectors).forEach(function (el) {
      const contentWidth = el.scrollWidth;
      let contentHeight = el.scrollHeight;

      let containerWidth, containerHeight;

      if (el.tagName.toLowerCase() === "body") {
        containerWidth = window.innerWidth;
        containerHeight = window.innerHeight;
        contentHeight = Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
        );
      } else {
        const parent = el.parentElement;
        containerWidth = parent ? parent.clientWidth : window.innerWidth;
        containerHeight = parent ? parent.clientHeight : window.innerHeight;
      }

      if (contentHeight === 0 || contentWidth === 0) {
        return;
      }

      if (contentWidth > containerWidth) {
        el.classList.add(widthOverflowClass);
      } else {
        el.classList.remove(widthOverflowClass);
      }
      if (contentHeight > containerHeight) {
        el.classList.add(heightOverflowClass);
      } else {
        el.classList.remove(heightOverflowClass);
      }
    });
  }

  window.addEventListener("DOMContentLoaded", updateOverflowClasses);
  window.addEventListener("resize", updateOverflowClasses);
}
