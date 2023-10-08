import { KINGMAN_TELEGRAM as Tele } from "./lib/kingman";
import FormData from 'form-data';
import { Api, TelegramClient, utils } from "telegram";
import { StringSession } from "telegram/sessions";
import fs from "fs"
import axios, { AxiosError, AxiosResponse } from "axios";
const tele = new Tele({
    app_hash: "",
    app_id: 0,
    session: ""
});
const Channel = "";


function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
tele.client
    .connect()
    .then(() => {
        console.log("Client Connected and Getting Messages from the Channel")
        return tele.client.getMessages(Channel);
    })
    .then(async (messages) => {
        console.log("Message is Created")
        const filteredMessages = messages.filter((message) => {
            return (
                message.message &&
                message.message !== "" &&
                message.buttonCount == 0 &&
                !message.entities
            );
        });
        console.log(filteredMessages.length)
        console.log("Message is Filtered")
        for (const message of filteredMessages) {
            console.log("Message Proccressing")
            await delay(1100);
            await forwardToDiscord(message, tele.client);
            console.log("Done")
            await delay(1100);
        }
    })
    .catch((e) => {
        console.log(e);
    });

async function forwardToDiscord(message: Api.Message, client: TelegramClient) {

  return new Promise(async (resolve, reject) => {
    //Get The Message Again 
    const [retrievedMessage] = await client.getMessages(Channel, {
        ids: message.id
    });
    let index = 1;
    const content = retrievedMessage.message;
    const media = retrievedMessage.media;
    try {
      if (content && !media) {
        const formData = new FormData();
        formData.append(
          "content",
          content.startsWith("-") ? content.replace("-", "- ") : content
        );
        let data = await sendToDiscordWebhook(formData);
        return resolve(data);
      }
      if (media) {
        
        const formData = new FormData();
        console.log("Processing media");
        const filePromises: Promise<void>[] = [];
        if ("photo" in media && media.photo) {
          console.log(`there is a [Photo]`);

          let file = await client.downloadMedia(
            media.photo as unknown as Api.TypeMessageMedia
          );
          if (file) {
            formData.append("file" + String(index), file, { filename: `media-${Date.now()}.png` });
            index = index  + 1;
          }
        }
        if ("video" in media && media.video) {
          console.log(`there is a [Video]`);
          let file = await client.downloadMedia(
            media.video as unknown as Api.TypeMessageMedia
          );
          if (file) {
            formData.append("file" + String(index), file, { filename: `media-${Date.now()}.mp4` });
            index = index  + 1;
          }
        }
        if ("document" in media && media.document) {
            if (media instanceof Api.MessageMediaDocument) {
                if (media.document instanceof Api.Document) {
                  const document = media.document as Api.Document;
                  for (const attribute of document.attributes) {
                    if (attribute instanceof Api.DocumentAttributeAudio) {
                        console.log("There is a Audio");
                        let file = await client.downloadMedia(
                            media.document as unknown as Api.TypeMessageMedia
                        );
                        if (file) {
                            formData.append("file" + String(index), file, { filename: `media-${Date.now()}.mp3` });
                            index = index + 1;
                        }
                        
                    }
                    else if (attribute instanceof Api.DocumentAttributeVideo) {
                        console.log("There is a Video");
                        let file = await client.downloadMedia(
                            media.document as unknown as Api.TypeMessageMedia
                        );
                        if (file) {
                            formData.append("file" + String(index), file, { filename: `media-${Date.now()}.mp4` });
                            index = index + 1;
                        }
                    }
                    else if (attribute instanceof Api.DocumentAttributeAnimated) {
                      console.log("There is a GIF");
                        let file = await client.downloadMedia(
                           media.document as unknown as Api.TypeMessageMedia
                        );
                        if (file) {
                         formData.append("file" + String(index), file, { filename: `media-${Date.now()}.gif` });
                         index = index + 1;
                     }
                    }
                  }
                }
              }
        }
        if (content && content !== "") {
          formData.append(
            "content",
            content.startsWith("-") ? content.replace("-", "- ") : content
          );
        }
        let send = await sendToDiscordWebhook(formData);
        await delay(1000);
        return resolve(send);
      }
    } catch (error) {
      console.error("Failed to forward message to Discord:", error);
      return resolve(error);
    }
  });
}



async function sendToDiscordWebhook(data: any) {
    return new Promise(async (resolve, reject) => {
      const hook = "";
      try {
        const response = await axios.post(hook, data, { headers: { ...data.getHeaders(),  }, timeout: 10000  });
        return resolve("Hello Word");
      } catch (error: any) {
        if (error.response) {
          if (error.response.data) {
            console.error("Failed to send message to Discord:", error.response.data);
            console.log("We Will Wait");
            if (error.response.data.retry_after) {
              console.log("retry_after");
              console.log(error.response.data.retry_after);
              const retryAfter = parseFloat(error.response.data.retry_after);
              delay((retryAfter + 1) * 1000).then(async(c)=> {
                try {
                    const newReq = await axios.post(hook, data, { headers: { ...data.getHeaders() }, timeout: 10000 });
                    console.log(newReq);
                    console.log("Done Fix Rate Limit Problem");
                    return resolve("Hello Word");
                  } catch (error: any) {
                    console.error("Failed to send message to Discord on retry:", error);
                  }
              })
            }
          }
        }
        reject(error);
      }
    });
  }
  