module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.ts',
      builderOptions: {
        publish: ['github'],
        appId: "com.ycst.destiny",
        protocols: {
          name: "Destiny",
          schemes: [
            "destiny"
          ]
        },
        mac: {
          // category: "public.app-category.Reference",
          icon: 'src/assets/logo.png',
          extraResources: [
            {
              from: 'src/assets/',
              to: 'static'
            }
          ]
        },
        win: {}
      }
    }
  }
}