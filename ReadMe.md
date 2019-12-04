#####ReadMe document for the bot 'heydummy' ######

This repository contains the code which implements the full functionality of the Discord bot assignment given in the BlueStack developer challenge.
The bot was initially hosted on heroku hence the Procfile in the root directory. Currently it is hosted on AWS.

The bot says **hi** to your **hey**.
It shows top 5 results of the google searches when you type !google <your_search_item>.

It shows the most recent searches by scanning through your search history matching a certain substring provided by you in !recent <substring>


I have used node version 8 and mysql version 5.7.
I have used mysql by installing it on the same server for data (search history persistence).
**Possible improvements
1. Can be done better by using a NoSQL database and a cache like redis.
**2. Can include logic so that the bot becomes free of case sensitivity. As of now hey != Hey.
3. Code can be modularized separating the database connection and queries from the bot logic.

As far as my understanding of the assignment is concerned the app works and implements the full functionality.

Please feel free to suggest improvements as per your understanding. You are most welcome for the suggestions. :)
