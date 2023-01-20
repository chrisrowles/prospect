import type { TextChannel } from 'discord.js';
import { Message, MessageEmbed } from 'discord.js';
import { prefix, channels, client, settings } from './bootstrap';
import { getRaidTimes } from './lib/RaidTimer';
import { armorer } from './lib/AmmoDataAccess';
import { backpacker } from './lib/BackpackDataAccess';
import { mapper } from './lib/MapDataAccess';
import { tailor } from './lib/ArmorDataAccess';
import { provisioner } from './lib/ProvisionDataAccess';
import { medic } from './lib/MedicalDataAccess';
import { quest } from './lib/QuestDataAccess';

function getQueryParameter(message: Message, command: string) {
    return message.content.substring(
        message.content.indexOf(`${prefix}${command}`) + `${prefix}${command}`.length
    ).trim();
}
  
client.on('ready', () => {
    console.log('ready');
    
    // Tarkov raid time loop, posts to #raid-timer every 5 minutes
    setInterval(async () => {
        const channel = <TextChannel>await client.channels.fetch(channels.raidTimer);
      
        channel.send({ embeds: [getRaidTimes({
            embed: true
        })] });
    }, 300000);
});
  
client.on('messageCreate', async (message: Message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) {
        return;
    }

    if (process.env.IS_DEV) {
        // Iceman dev mode (!isdev)
        if (message.content === `${prefix}isdev up`) {
            message.channel.send('Fuck yeah dev is up');
        }
    }
    
    // Version (!version)
    if (message.content === `${prefix}iceman`) {
        const color = process.env.IS_DEV ? 0x9834DB : 0x3498DB;
        const data = new MessageEmbed()
            .setColor(color)
            .setTitle('Iceman')
            .setDescription('Tarkov Discord bot and API.')
            .addField('Version', settings.version, true);
      
        message.channel.send({ embeds: [data] });
    }
    
    // Tarkov raid time (!time)
    if (message.content === `${prefix}time`) {
        const data = <MessageEmbed>getRaidTimes({
            embed: true
        });
      
        message.channel.send({ embeds: [data] });
    }
    
    // Tarkov ammo info (!ammo [name])
    if (message.content.startsWith(`${prefix}ammo`)) {
        const query = getQueryParameter(message, 'ammo');
        const data = <MessageEmbed>await armorer.request('Name', query, {
            embed: true
        });
      
        message.channel.send({ embeds: [data] });
    }
    
    // Tarkov armor info (!armor [name])
    if (message.content.startsWith(`${prefix}armor`)) {
        const query = getQueryParameter(message, 'armor');
        const data = <MessageEmbed>await tailor.request('Name', query, {
            embed: true
        });
      
        message.channel.send({ embeds: [data] });
    }
    
    // Tarkov backpack info (!backpack [name])
    if (message.content.startsWith(`${prefix}backpack`)) {
        const query = getQueryParameter(message, 'backpack');
        const data = <MessageEmbed>await backpacker.request('Name', query, {
            embed: true
        });
      
        message.channel.send({ embeds: [data] });
    }

    // Tarkov consumable info (!consume [name])
    if (message.content.startsWith(`${prefix}consume`)) {
      const query = getQueryParameter(message, 'consume');
      const data = <MessageEmbed>await provisioner.request('Name', query, {
          embed: true
      });
    
      message.channel.send({ embeds: [data] });
    }

    // Tarkov map info (!mapper [name])
    if (message.content.startsWith(`${prefix}map`)) {
      const query = getQueryParameter(message, 'map');
      const data = <MessageEmbed>await mapper.request('Name', query, {
          embed: true
      });
    
      message.channel.send({ embeds: [data] });
    }
    
    // Tarkov medical info (!medic [name])
    if (message.content.startsWith(`${prefix}medic`)) {
        const query = getQueryParameter(message, 'medic');
        const data = <MessageEmbed>await medic.request('Name', query, {
            embed: true
        });
      
        message.channel.send({ embeds: [data] });
    }
    
    // Tarkov quest info (!quest [name])
    if (message.content.startsWith(`${prefix}quest`)) {
        const query = getQueryParameter(message, 'quest');
        const data = <MessageEmbed>await quest.request('Quest', query, {
            embed: true
        });
      
        message.channel.send({ embeds: [data] });
    }
});
  
client.login(<string>process.env.TOKEN);