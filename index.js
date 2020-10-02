const Discord = require("discord.js");
const config = require("./config.json");
const bot = require("./bot.js");

// my id
const MY_ID = 692140126498848780;

// create client
const client = new Discord.Client();

// handle startup
client.on("ready", () => {
  client.user.setPresence({
    status: "online",
    activity: {
      name: `"${bot.PREFIX} help"`,
      type: "WATCHING",
      url: "https://www.google.com"
    }
  });
});

// handle messages
client.on("message", msg=>{
  // don't pay atention to bots
  if (msg.author.bot) return;

  // don't pay attention if the prefix is wrong
  if (!msg.content.startsWith(bot.PREFIX)){
    if (msg.mentions.has(client.user)){
      bot.sendMeanPhrase(msg);
    }
    return;
  };

  // DELETE LATER
  if (msg.author.id != MY_ID){
    bot.sendMeanPhrase(msg);
    return;
  };
  // END DELETE LATER



  // parse command and arguments
  var cmdBody = msg.content.slice(bot.PREFIX.length).trim();
  var args = cmdBody.split(/ +/);
  var cmd = args.shift();

  // handle command
  if (bot.CMD_LIST.indexOf(cmd) != -1){
    // use command handler if it's a real command
    bot.handlers[cmd](args, msg, client);
  } else {
    // handle an unknown command if it's not a real command
    bot.handleUnknownCommand(cmd, args, msg, client);
  }
});

client.login(config.TOKEN);
