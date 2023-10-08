# Telegram to Discord Forwarding Bot

## Description

This is a Node.js bot script designed to forward messages and media from a Telegram channel to a Discord webhook. It utilizes the Telegram and Axios libraries to connect to Telegram, retrieve messages, and forward them to Discord. You can configure this bot by providing your Telegram API credentials (app_hash, app_id, and session), the Telegram channel to monitor, and the Discord webhook URL.

## Prerequisites

Before using this bot, make sure you have the following prerequisites:

1. Node.js installed on your system.

## Setup

1. Clone this repository to your local machine:

   ```
   git clone https://github.com/KMKINGMAN/Telegram2Discord
   ```

2. Install the required npm packages by running the following command:

   ```
   npm install
   ```

3. Configure the bot by providing the following information in the code:

   - `app_hash`: Your Telegram API app hash.
   - `app_id`: Your Telegram API app ID.
   - `session`: Your Telegram session string.
   - `Channel`: The Telegram channel you want to monitor.
   - `hook`: The Discord webhook URL where messages will be forwarded.

## Usage

To run the bot, use the following command:

```
npm start
```


## Features

- Connects to Telegram and retrieves messages from a specified channel.
- Filters and processes Telegram messages.
- Forwards messages and media (photos, videos, audio, and GIFs) to a Discord webhook.
- Handles rate-limiting and retries when encountering Discord API rate limits.

## Credits

- [Telegram API](https://core.telegram.org/api)
- [Discord Webhooks](https://discord.com/developers/docs/resources/webhook)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Muhammad Rafat Kurkar +962792914245 [KINGMAN](https://github.com/KMKINGMAN)

## Acknowledgments

Special thanks to the developers of the Telegram and Axios libraries for providing the tools necessary to build this bot.