# ✍ Guides

### Setting up Dashboard

- In the config.js, make sure you set dashboard enabled to **true**
- Add your baseURL, `http://localhost:8080/api/callback` in your application OAuth2 redirects page in the [discord developer portal](https://discord.com/developers/applications)

```
  DASHBOARD: {
    enabled: true, // enable or disable dashboard
    baseURL: "http://localhost:8080", // base url
    failureURL: "http://localhost:8080", // failure redirect url
    port: "8080", // port to run the bot on
  },
```

