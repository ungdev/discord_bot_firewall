/* eslint no-param-reassign: ["error", { "props": false }] */

const utils = require("../../utils");

module.exports = async function voiceStateUpdate(
  /** module:"discord.js".VoiceState */ oldState,
  /** module:"discord.js".VoiceState */ newState,
  tableauChannelTexteAChannelVocal,
  tableauChannelsVocauxEnCours
) {
  if (
    oldState.channelID &&
    oldState.channelID !== newState.channelID &&
    oldState.channelID !== process.env.CHANNEL_CREATION_AMPHI &&
    oldState.member.id in tableauChannelsVocauxEnCours &&
    tableauChannelsVocauxEnCours[oldState.member.id].includes(
      oldState.channelID
    )
  ) {
    if (oldState.channel.members.keyArray().length > 0) {
      if (
        !(oldState.channel.members.first().id in tableauChannelsVocauxEnCours)
      )
        tableauChannelsVocauxEnCours[oldState.channel.members.first().id] = [];
      tableauChannelsVocauxEnCours[
        oldState.channel.members.first().id
      ] = tableauChannelsVocauxEnCours[oldState.member.id].slice();
      delete tableauChannelsVocauxEnCours[oldState.member.id];
    } else {
      tableauChannelsVocauxEnCours[oldState.member.id].forEach(async (id) => {
        (await oldState.guild.channels.resolve(id))
          .delete()
          .then(() => {
            delete tableauChannelsVocauxEnCours[oldState.member.id];
          })
          .catch(console.error);
      });
      if (
        utils.getKeyByValue(
          tableauChannelTexteAChannelVocal,
          oldState.channelID
        )
      ) {
        delete tableauChannelTexteAChannelVocal[
          utils.getKeyByValue(
            tableauChannelTexteAChannelVocal,
            oldState.channelID
          )
        ];
      }
    }
  }
};
