export function initMediaSizingHandlers() {
  function resizeMedia() {
    document.querySelectorAll(".responsive").forEach(function (el) {
      let naturalWidth, naturalHeight;

      if (el.tagName.toLowerCase() === "img") {
        naturalWidth =
          el.naturalWidth || parseInt(el.getAttribute("width")) || 0;
        naturalHeight =
          el.naturalHeight || parseInt(el.getAttribute("height")) || 0;
      } else if (el.tagName.toLowerCase() === "video") {
        naturalWidth = el.videoWidth || parseInt(el.getAttribute("width")) || 0;
        naturalHeight =
          el.videoHeight || parseInt(el.getAttribute("height")) || 0;
      } else {
        naturalWidth = parseInt(el.getAttribute("width")) || 800;
        naturalHeight = parseInt(el.getAttribute("height")) || 600;
      }

      if (naturalWidth === 0 || naturalHeight === 0) return;

      const computedStyle = getComputedStyle(el);
      const maxWidthValue = computedStyle.getPropertyValue("max-width");
      const maxHeightValue = computedStyle.getPropertyValue("max-height");

      if (maxWidthValue === "100%") return;

      const tempDiv = document.createElement("div");
      tempDiv.style.width = maxWidthValue;
      tempDiv.style.height = maxHeightValue;
      tempDiv.style.position = "absolute";
      tempDiv.style.visibility = "hidden";
      document.body.appendChild(tempDiv);
      const maxWidth = tempDiv.offsetWidth;
      const maxHeight = tempDiv.offsetHeight;
      document.body.removeChild(tempDiv);

      const aspectRatio = naturalWidth / naturalHeight;

      let targetWidth = maxWidth;
      let targetHeight = targetWidth / aspectRatio;

      if (targetHeight > maxHeight) {
        targetHeight = maxHeight;
        targetWidth = targetHeight * aspectRatio;
      }

      el.style.width = Math.round(targetWidth) + "px";
      el.style.height = Math.round(targetHeight) + "px";
    });
  }

  function handleMediaLoad() {
    setTimeout(resizeMedia, 10);
  }

  window.addEventListener("DOMContentLoaded", resizeMedia);
  window.addEventListener("load", resizeMedia);
  window.addEventListener("resize", resizeMedia);
  document.addEventListener(
    "load",
    function (e) {
      if (
        e.target.tagName &&
        ["IMG", "VIDEO", "IFRAME"].includes(e.target.tagName.toUpperCase())
      ) {
        handleMediaLoad();
      }
    },
    true,
  );
}
