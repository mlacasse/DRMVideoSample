(function() {
  if (typeof globalThis === 'object') {
    return;
  }
  Object.defineProperty(Object.prototype, '__magic__', {
    get() {
      return this;
    },
    configurable: true,
  });
  __magic__.globalThis = __magic__;
  delete Object.prototype.__magic__;
})();

globalThis.Image = () => {};

Object.defineProperty(Image.prototype, 'src', {
  get() {
    return src;
  },
  set(url) {
    fetch(url)
      .then(response => {
        console.log('Image Polyfill Success!', url, response);
      })
      .catch(error => {
        console.log('Image Polyfill Failed!', url, error);
      });
    src = url;
  },
  configurable: true,
});