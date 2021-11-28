import Ably from "ably/promises";

export default async function handler(req, res) {
  // Unpack the SMS details from the request query string
  const params = req.query;

  // If the request was invalid, return status 400.

  // Create an Ably client, get your `sms-notifications` channel
  const client = new Ably.Realtime(process.env.ABLY_API_KEY);
  const channel = client.channels.get("votes");

  // Publish your SMS contents as an Ably message for the browser
  await channel.publish({ name: "test", data: "works" });

  // Return the received data as a 200 OK for debugging.
  res.send("worked");
  res.status(200).end();
}
