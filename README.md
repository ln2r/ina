# Blob
A simple boss notification Discord Bot

## How to Use
* [Get Discord app token](https://discordapp.com/developers/applications/) - [Guide how to get Discord App Token](https://anidiots.guide/getting-started/getting-started-long-version)
* [Get message channel id](https://www.reddit.com/r/discordapp/comments/50thqr/finding_channel_id/)
* Change the configuration
* Run the bot

## Configuration
### config.json File
Template for the `config.json` file.
```json
  {
    "bot":{
      "prefix": "!" // Default bot prefix (unused for now)
    },
    "channel":{
      "boss": "698182243897835610", // Message channel id for boss notification
    }
  }
```
### .env File
Template for the `.env` file.
```env
  BLOB_DISCORD_TOKEN = "DISCORD_APP_TOKEN_HERE"
```

## Acknowledgments & Credits
* **Rizky Sedyanto** - *Initial work* - [ln2r](https://ln2r.tumblr.com/); Discord: ln2r#1691
* **Built With**
  * [Visual Studio Code](https://code.visualstudio.com/) - Editor
  * [discord.js](https://discord.js.org/) - Discord API node.js module

## Support
* [ko-fi](https://ko-fi.com/ln2rworks)

## License
*Code of this project is licensed under MIT license*
