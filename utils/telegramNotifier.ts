import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export async function sendTelegramNotification(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log("Telegram credentials missing");
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown"
    });

    console.log("Telegram notification sent");
  } catch (error) {
    console.log("Failed to send Telegram message");
  }
}


export async function sendTelegramPhoto(
  filePath: string,
  caption: string
) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.log("Telegram credentials missing");
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendPhoto`;

  const form = new FormData();
  form.append("chat_id", chatId);
  form.append("photo", fs.createReadStream(filePath));
  form.append("caption", caption);

  try {
    await axios.post(url, form, {
      headers: form.getHeaders(),
    });

    console.log("Screenshot sent to Telegram");
  } catch (error) {
    console.log("Failed to send Telegram screenshot");
  }
}