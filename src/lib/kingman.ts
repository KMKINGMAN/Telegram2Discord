import { Api, TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import readline from "readline";
interface Configuration {
  app_id: number;
  app_hash: string;
  session: string;
}

export class KINGMAN_TELEGRAM {
  private config: Configuration;
  private rl: readline.Interface;
  public client!: TelegramClient;

  constructor(configuration: Configuration) {
    this.config = configuration;
    this.rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    this.initializeClient();
  }

  async initializeClient(): Promise<void> {
    this.client = new TelegramClient(
      new StringSession(this.config.session),
      this.config.app_id,
      this.config.app_hash,
      { connectionRetries: 5 }
    );
    await this.client.start({
      phoneNumber: async () => await this.ask_question("Please enter your password: "),
      password: async () => await this.ask_question("Please enter your password: "),
      phoneCode: async () => await this.ask_question("Please enter the code you received: "),
      onError: (err) => console.log(err),
    });

    console.log(this.client.session.save());
  }

  async ask_question(text: string): Promise<string> {
    return await new Promise<string>((resolve) => this.rl.question(text, resolve));
  }
}
