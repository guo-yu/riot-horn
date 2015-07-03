;(function(w) {
  if (!w.riot)
    return

  w.riotHorn = new Horn

  class Horn() {
    constructor() {
      this.root = 'body'
      this.ns = 'components' // Namespace under `window`
    }

    root(el) {
      this.root = el
    }

    mountOne(tagName, locals) {
      return riot.mount(
        this.root,
        tagName, // Component' Name
        locals
      )[0]
    }

    mount(tagName) {
      if (!window[this.ns])
        window[this.ns] = {}

      // Mount a tag
      window[this.ns][tagName] = this.mountOne.apply(this, arguments)

      // Listen for all events
      // todo: find a way to listen all riot events
      riot.on('all', (eventName, opts) => {
        const names = splitNames(eventName)

        if (!names || !window[this.ns][names.component])
          return

        window[this.ns][names.component][names.fn](opts)

        return window[this.ns]
      })
    }
  }

  // Split names like `lightbox.open`
  function splitNames(str) {
    const names = str.split('.')

    if (names.length === 1)
      return null

    return {
      component: names[0],
      fn: names[1],
    }
  }
})(this)
