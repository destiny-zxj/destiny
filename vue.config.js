module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.ts',
      builderOptions: {
        publish: ['github']
      }
    }
  }
}