import makeWASocket, { useMultiFileAuthState } from "@whiskeysockets/baileys";

export default async function handler(req, res) {
  try {
    const { state, saveCreds } = await useMultiFileAuthState("/tmp/session");

    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false
    });

    if (!req.query.number) {
      return res.json({ error: "Number required ?number=91xxxxxxxxxx" });
    }

    const code = await sock.requestPairingCode(req.query.number);

    sock.ev.on("creds.update", saveCreds);

    return res.json({
      status: "success",
      number: req.query.number,
      code: code
    });

  } catch (e) {
    return res.json({ error: e.message });
  }
}
