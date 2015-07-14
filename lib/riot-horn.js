;(riot => {
  if (!riot || !riot.mixin)
    return

  riot.mixin('horn', {
    horn: () => {
      let inited = null
      let argvs = arguments

      walk(this, true)

      function walk(tag, pid) {
        if (tag.parent && pid)
          walk(tag.parent, tag._id)

        if (tag.tags) {
          const children = Object.keys(tag.tags)

          (() => {
            if (children.length === 0)
              return

            children.forEach(child => {
              const invalidTag = !tag.tags[child]
              const mutipleTag = !tag.tags[child]._id && tag.tags[child].length > 0

              if (invalidTag)
                return
              
              if (mutipleTag)
                tag.tags[child].forEach(t => walkOnce(t, pid))

              // For single tag
              walkOnce(tag.tags[child], pid)
            })
          })    
        }

        if (!inited)
          return init()

        // In case of same children
        const tags = tag._id ? [tag] : tag

        tags.forEach(t => 
          t.trigger.apply(t, argvs))
      }

      function walkOnce(tag, pid) {
        if (tag._id === pid)
          return

        walk(tag)
      }

      function init() {
        inited = true
        return
      }
    }
  })
})(this.riot);
