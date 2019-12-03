/***
 * Author: Rohit Kumar(DevOps Engineer)
 * 
 */




var Discord = require('discord.js');
var bot = new Discord.Client();
var mysql = require('mysql');
var config = require('./config');
require('dotenv').config();

var con = mysql.createConnection({
  host: config.DB_HOST,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME
});

'use strict';

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
itemscount = 0;
linkscount = 0;

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
            
            con.query("select count(*) as rows from searcharray", function(err,result){
                if (err) throw err;
                itemscount = result[0].rows;
                con.query("insert into searcharray(keynumber,keywords) values(?,?)",[itemscount+1,query],function(err,data){
                    if(err) throw err;
                    console.log("inserted one row in searcharray table!");
                });
            });
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

        con.query("select count(*) as rows from linksarray", function(err,result){
            if (err) throw err;
            linkscount = result[0].rows;
        
        counter = 0;
        for(var i=0; i<l; i++){
            //console.log(resp.data.items[i]);
            counter = counter + 1 ;
            con.query("insert into linksarray(linkno,link) values(?,?)",[linkscount+counter,resp.data.items[i].link],function(err,data){
                if(err) throw err;
                console.log("inserted one row in linksarray table!");
            })
            linksarray.push(resp.data.items[i].link);
            console.log('Result Number ' + (i+1) + ': ', linksarray[i]);
            if (i < 5){
                message.reply(linksarray[i]);
            }

        }
    });
                }
            });
            
        }

        //logic for !recent game

        if (args[0] === 'recent'){
            kword = args.join(' ');
            kword = kword.replace("recent","");
            console.log(kword);
            resultcount = 0;
            var sql1 = "select count(*) as rows from searcharray where keywords like concat('%',?,'%')";
            con.query(sql1,kword, function (err, result) {
                if (err) throw err;
                resultcount = result[0].rows;
            });
            var sql2 = "select * from searcharray where keywords like concat('%',?,'%')";
            con.query(sql2,kword, function (err, result) {
                if (err) throw err;
            for (var i = resultcount-1; i >=0 ; i--){
                    message.reply(result[i].keywords);
            }
        });
        }
         })

bot.login(config.discordToken);
