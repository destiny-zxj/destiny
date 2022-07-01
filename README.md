```json
"build": {
  "appId": "ycst.destiny",
  "protocols": {
    "name": "Destiny",
    "schemes": [
      "destiny"
    ]
  },
  "mac": {
    "category": "public.app-category.Reference"
  },
  "win": {}
}
```

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLName</key>
    <string>DestinyURLHandler</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>destiny</string>
    </array>
  </dict>
</array>
```

* test
destinytest://cmd=downie4.download&url=https://v10.ripic.xyz/6134cf29366aee8aa6e191c2/video.m3u8&title=Swagger