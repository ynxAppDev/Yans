module.exports.config = {
  name: "system",
  version: "1.0.0",
  hasPermission: 2,
  credits: "Liane Cagara",
  description: "Manage system files and modules",
  usePrefix: true,
  commandCategory: "Admin",
  cooldowns: 1,
};
const fs = require("fs");

module.exports.run = async function ({ api, event, box }) {
  const { loadCommand, loadEvent } = global.client;
  const system = `⚙️ 𝗦𝗬𝗦𝗧𝗘𝗠
━━━━━━━━━━━━━━━`;
  if (!box) {
    return api.sendMessage(
      `❌ Box is not supported, please update your Botpack by pulling the lastest changes.`,
      event.threadID,
      event.messageID,
    );
  }
  if (!loadCommand || !loadEvent) {
    return box.reply(`❌ loadCommand() and loadEvent() is only available in main-rework.js
To continue, change your start command to:
"node main-rework.js"`);
  }
  if (args[0] === "reload") {
    const i = await box.reply(`${system}
⚙️ | Getting started...`);
    const errors = {};
    const files = fs
      .readDirSync("modules/commands")
      .filter((file) => file.endsWith(".js"));
    const events = fs
      .readDirSync("modules/events")
      .filter((file) => file.endsWith(".js"));
    await new Promise((r) => setTimeout(r, 1000));
    await box.edit(
      `${system}
🔃 | Reloading all commands...`,
      i.messageID,
    );
    for (const file of files) {
      try {
        await loadCommand(file, true);
      } catch (error) {
        errors["modules/commands/" + file] = error;
        continue;
      }
    }
    await new Promise((r) => setTimeout(r, 1000));
    await box.edit(
      `${system}
🔃 | Reloading all events...`,
      i.messageID,
    );
    for (const ev of events) {
      try {
        await loadEvent(ev, true);
      } catch (error) {
        errors["modules/events" + ev] = error;
        continue;
      }
    }
    if (Object.keys(errors).length > 0) {
      let num = 1;
      return box.edit(
        `❌ Failed to reload ${Object.keys(errors).length} modules or events.

${Object.keys(errors)
  .map(
    (error) => `${num++}. ${error}
--> ${errors[error]}
STACK: ${errors[error].stack}`,
  )
  .join("\n\n")}`,
        i.messageID,
      );
    }
    await new Promise((r) => setTimeout(r, 1000));
    await box.edit(
      `${system}
📥 | Saving changes...`,
      i.messageID,
    );
    const { commands: clientCommands, events: clientEvents } = global.client;
    const commandsLength = [...new Set(clientCommands.keys())].length;
    const eventsLength = [...new Set(clientEvents.keys())].length;
    await new Promise((r) => setTimeout(r, 1000));
    await box.edit(
      `${system}
🟢 | Loaded All ${commandsLength} commands and ${eventsLength} events!`,
      i.messageID,
    );
    return;
  } else if (args[0] === "send") {
    const filepath = __dirname + "/" + args[1];
    if (!args[1]) {
      return box.reply(
        `❌ Please enter the file name to send; it should end with .js`,
      );
    }
    if (!fs.existsSync(filepath)) {
      return box.reply(`❌ File not found:
${filepath}`);
    }
    const file = fs.readFileSync(filepath, "utf-8");
    return box.reply(`// ${args[1]}

${file}`);
  } else if (args[0] === "delete") {
    const filepath = __dirname + "/" + args[1];
    if (!args[1]) {
      return box.reply(
        `❌ Please enter the file name to delete; it should end with .js`,
      );
    }
    if (!fs.existsSync(filepath)) {
      return box.reply(`❌ File not found:
${filepath}`);
    }
    const file = fs.readFileSync(filepath, "utf-8");
    fs.unlinkSync(filepath);
    return box.reply(`// Successfully deleted ${args[1]}!

${file}`);
  } else if (args[0] === "list") {
    return box.reply(`${system}
✅ All commands:

${fs.readDirSync("modules/commands").join("\n")}

✅ All events:

${fs.readDirSync("modules/events").join("\n")}`);
  }
};
