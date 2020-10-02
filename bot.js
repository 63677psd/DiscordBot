const Discord = require("discord.js");
const cmdData = require("./commandData.json");
const phrases = require("./meanPhrases.json");

// prefix
exports.PREFIX = "b!";

// send don't care phrase if I don't personally give it a command
exports.sendMeanPhrase = function (msg){
  var index = Math.floor(Math.random()*phrases.length);
  msg.reply(phrases[index]);
};

// use in handlers when command is used incorrectly
function incorrectUsageEmbed(cmd){
  return new Discord.MessageEmbed()
        .setColor("#0055aa")
        .setTitle(`Incorrect Usage of Command: "${cmd}"`)
        .addFields(
          { name: "Correct Usage:", value: `${exports.PREFIX} ${cmdData[cmd]["usage"]}` },
          { name: "For More Info:", value: `${exports.PREFIX} help ${cmd}`}
        );
}

exports.handlers = {
  "help": function (args, msg, client){
    // give help

    var embed;

    if (args.length > 0){
      var cmd = args[0];
      if (exports.CMD_LIST.indexOf(cmd) != -1){
        // get specific information

        // create embed
        embed = new Discord.MessageEmbed()
              .setColor("#0055aa")
              .setTitle(`Help: "${cmd}"`)
              .addFields(
                { name: "Usage:", value: `${exports.PREFIX} ${cmdData[cmd]["usage"]}` },
                { name: "Description:", value: cmdData[cmd]["longDescription"] }
              );
      } else {
        // command doesn't exist

        // create embed
        embed = new Discord.MessageEmbed()
              .setColor("#0055aa")
              .setTitle(`Help: "${cmd}"`)
              .addFields(
                { name: "\u274CCOMMAND NOT FOUND\u274C", value: `Type "${exports.PREFIX} help" for a list of commands.` }
              );
      }
    } else {
      // give general help

      // build command list
      var commandListText = "";
      for (var i=0; i<exports.CMD_LIST.length; i++){
        if (i != 0) commandListText += "\n";
        commandListText += `\u2022  ${exports.CMD_LIST[i]} - ${cmdData[exports.CMD_LIST[i]]["briefDescription"]}`;
      }

      // create embed
      embed = new Discord.MessageEmbed()
            .setColor("#0055aa")
            .setTitle("Command List")
            .setDescription(`General help for Brady Bot\nPrefix - "${exports.PREFIX}"`)
            .addFields(
              { name: "Commands:", value: commandListText }
            );

    }

    msg.channel.send(embed);

  },
  "delete": function (args, msg, client){
    // delete messages

    if (args.length > 0){
      var n = parseInt(args[0]);
      if (!isNaN(n)){
        if (n > 0 && n <= 20){
          msg.channel.messages.fetch().then(messages => {
            messages.first(n).forEach(m => {
              m.delete();
            });
          }).then(() => {
            msg.channel.send(`${n} messages deleting.`);
          });
          return;
        }
      }
    }

    // not used correctly
    msg.channel.send(incorrectUsageEmbed("delete"));
  },
  "talkFor": function (args, msg, client){
    // say message and delete original

    if (args.length > 0){
      var message = "";
      for (var i=0; i<args.length; i++){
        message += args[i];
        message += " ";
      }
      msg.channel.send(message);
      msg.delete();
      return;
    }

    // not used correctly
    msg.channel.send(incorrectUsageEmbed("talkFor"));
  },
  "meanPhrase": function (args, msg, client){
    exports.sendMeanPhrase(msg);
  }
};

exports.handleUnknownCommand = function (cmd, args, msg, client){
  msg.channel.send(
    new Discord.MessageEmbed()
      .setColor("#0055aa")
      .setTitle(`\u274CUnknown Command: "${cmd}"\u274C`)
      .setDescription(`Type "${exports.PREFIX} help" for a list of commands.`)
  );
};

exports.CMD_LIST = Object.keys(exports.handlers);
