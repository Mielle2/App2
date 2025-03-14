if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register("js/sw.js")
      .then(() => console.log("Service Worker registered!"))
      .catch(err => console.log("Service Worker registration failed:", err));
  }