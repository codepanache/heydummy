var Discord = require('discord.js');
var bot = new Discord.Client();
var mongo = require('mongoose');

'use strict';

var config = require('./config');
require('dotenv').config();

bot.on('ready', () =>{
    console.log("the bot is online !");
        
});

//require official googleapi and call customsearch method for getting the search result
const {google} = require('googleapis');
const customsearch = google.customsearch('v1');

//store the search history
searcharray = [];
//store the resulting links
resultsarray =[];

bot.on('message',function(message){
    //reply hi to hey 
         if (message.content === 'hey'){
             message.reply('hi');
         }

         //separate prefix ! from the search string

         let prefix = ("!")
         let args = message.content.slice(prefix.length).trim().split(" ")
         //console.log(args);
         //logic for !google searchitem
         if (args[0] === 'google'){
            query = args.join(' ');
            query = query.replace("google","");
            //final query will contain the term we would like to search for
            searcharray.push(query);
            console.log(searcharray);
            //use google customsearch.cse.list function to list the search results after the query, uses google api key to authenticate and 
            // also the custom search engine id
            customsearch.cse.list({
                auth: config.ggApiKey,
                cx: config.ggCx,q: query
            },function (err,resp){
                if (err) {
                    console.log('An error occured', err);
                    return;
                }
                // Got the response from custom search
                if (resp.data.items && resp.data.items.length > 0){
                    var l = resp.data.items.length;
        console.log('Total number of results: ' + l); // this is always 10
        linksarray = [];
        for(var i=0; i<l; i++){
            //console.log(resp.data.items[i]);
            linksarray.push(resp.data.items[i].link);
            console.log('Result Number ' + (i+1) + ': ', linksarray[i]);

        }
        resultsarray.push(linksarray);
        console.log(resultsarray);
        for(var i=0; i<5; i++){
            message.reply(linksarray[i]);

        }
                }
            });
            
        }

        //logic for !recent game

        if (args[0] === 'recent'){
            result = args.join(' ');
            result = result.replace("recent","");
            console.log(result);
            for (var i = searcharray.length-1; i >= 0 ; i--){
                //console.log(searcharray[i]);
                if (searcharray[i].includes(result)){
                    //console.log(searcharray[i]);
                    message.reply(searcharray[i]);
                }
            }
        }
         })

bot.login(config.discordToken);
