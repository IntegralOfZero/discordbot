const Discord = require("discord.js");
const client = new Discord.Client();

const PixivApi = require('pixiv-api-client');
const pixiv = new PixivApi();

const request = require("request");

/*
const Danbooru = require('danbooru');
let danbooru = new Danbooru()
let safebooru = new Danbooru>Safebooru();
*/

client.login(process.env["appToken"]);

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  if (message.author.bot) {
    return;
  }

  if (message.content.startsWith("hashtag")) {
    message.reply("Your ID discriminator (hashtag) is: " + message.member.user.discriminator);

    message.channel.send({
      embed: {
        color: 3447003,
        author: {
          name: message.member.user.username,
          icon_url: message.member.user.avatarURL
        },
        title: "This is an embed",
        url: "http://google.com",
        description: "This is a test embed to showcase what they look like and what they can do.",
        fields: [{
            name: "Fields",
            value: "They can have different fields with small headlines."
          },
          {
            name: "Masked links",
            value: "You can put [masked links](http://google.com) inside of rich embeds."
          },
          {
            name: "Markdown",
            value: "You can put all the *usual* **__Markdown__** inside of them."
          }
        ],
        timestamp: new Date(),
        footer: {
          icon_url: client.user.avatarURL,
          text: "© Example"
        }
      } 
    });
  } else if (message.content.startsWith("roles")) {
    message.reply("Your roles are: " + message.member.roles.map((role) => {
      let name = role.name;
      if (name === "@everyone") {
        name = "everyone";
      }
      return name;
    }).join(", "));
  } else if (message.content.startsWith("UBW") && !message.author.bot) {
    message.channel.send("I am the bone of my sword \nSteel is my body, and fire is my blood");
    message.channel.send("I have created over a thousand blades \nUnknown to life, nor known to death");
    message.channel.send("Have withstood pain to create many weapons \nYet these hands will never hold anything");
    message.channel.send("So as I pray");
    message.channel.send("Unlimited Blade Works");
    message.channel.sendFile("http://orig04.deviantart.net/29e2/f/2016/163/9/8/unlimited_blade_works__re_sized__by_pramudyayusuf-da5z15g.png");
  } else if (message.content.startsWith("pixiv")) {
    console.log("Message: " + message.content)
    let args = message.content.split(/\s+/g).slice(1);
    console.log("Arguments: " + args)
    if (args.length === 0) {
      return;
    }
    console.log(args.join(" "))
    let illustrations = [];
    pixiv.login(process.env["pixivUser"], process.env["pixivPass"])
      .then(() => { 
        return pixiv.searchIllust(args.join(" "));
      }).then((result) => { 
        illustrations = illustrations.concat(result.illusts);
  
        console.log("Illustrations retrieved: " + illustrations.length);

        let nextUrl = result.next_url;
        if (!nextUrl) {
          return null;
        }
        return pixiv.requestUrl(result.next_url);
      })
      .then((result) => {
        if (result) {
          illustrations = illustrations.concat(result.illusts);
        }
        console.log("Illustrations thus far: " + illustrations.length);
        let selectedIllustration = illustrations[Math.floor(Math.random() * illustrations.length)];
        console.log(selectedIllustration);
        message.channel.send("https://www.pixiv.net/member_illust.php?mode=medium&illust_id=" + selectedIllustration.id);
      }).catch((err) => {
        console.log(err);
      });
  } else if (message.content.startsWith("2pixiv")) {
    console.log(message.content)
    let args = message.content.split(/\s+/g).slice(1);
    console.log(args)
    if (args.length === 0) {
      return;
    }
    console.log(args.join(" "))
    pixiv.searchIllust(args.join(" ")).then(result => {
      let illust = result.illusts[Math.floor(Math.random() * result.illusts.length)];
      console.log(illust);
      console.log(illust.image_urls.medium)
      message.channel.sendFile(illust.image_urls.medium);
      // return pixiv.requestUrl(json.next_url);
    })
  } else if (message.content.startsWith("elembattle")) {
    let args = message.content.split(/\s+/g).slice(1);
    console.log(args)
    if (args.length !== 5) {
      message.reply("Please enter five of the following elements (repeats allowed): fire, water, grass");
      return;
    }
    
    let elements = ["fire", "water", "grass"];
  
    let points = 0;
    let opponentPoints = 0;
  
    for (let elem of args) {
      console.log(elem)
      if (elements.indexOf(elem) < 0) {
        message.reply("Please provide only valid elements: fire, water, grass");
        return;
      }

      let opponentElem = elements[Math.floor(Math.random() * elements.length)];

      let result = elemBattleDetermineWinner(elem, opponentElem);

      message.channel.send("\nYour element: " + elem + "\nOpponent element: " + opponentElem);
      
      switch (result) {
        case -1:
         message.channel.send("Lose");
         opponentPoints++;
         break;
        case 0:
         message.channel.send("Draw");
         break;
        case 1:
         message.channel.send("Win");
         points++;
         break;
      }
    }

    let resultMessage = "";

    if (points === args.length) {
      resultMessage = "FLAWLESS VICTORY!";
    } else if (points > opponentPoints) {
      resultMessage = "VICTORY!";
    } else if (points < opponentPoints) {
      resultMessage = "DEFEAT!";
    } else {
      resultMessage = "DRAW!";
    }

    message.reply(resultMessage);
    message.channel.send("Your points: " + points);
    message.channel.send("Opponent's points: " + opponentPoints);
  } else if (message.content.startsWith("tableflip")) {
    message.channel.send("(ノಠ益ಠ)ノ彡┻━┻");
  } else if (((message.content.indexOf("kokichi") > -1) || (message.content.indexOf("ouma") > -1)) && message.member.user.username === "Rintokki" && message.member.user.discriminator === "1924") {
    console.log(message.member);
    message.reply(":police_car::police_car::police_car::police_car::police_car::police_car::police_car::police_car::police_car::blobpolice::blobpolice::blobpolice::blobpolice::blobpolice:")
  } else if (message.content.startsWith("stocks")) {
    let symbol = message.content.split(/\s+/g).slice(1);
    // 26Z1HA8NSSEGQYHP
    if (!symbol) {
      message.reply("Please provide the symbol of a stock (such as \"FB\" or \"MSFT\").");
    } else {
      //let currentPrice = new Promise((resolve, reject) => {
      try {
        let apiKey = process.env["stocksApiKey"]
        request(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${stocksApiKey}`, function (error, response, body) {
          if (error) {
            console.error("An error occurred:");
            console.log(error);
            message.reply("An error occurred.");
          } else {
            let responseBody = JSON.parse(body);
            console.log(responseBody);

            let data = responseBody["Time Series (1min)"];
            let recentMinuteKey = Object.keys(data)[0];
            let recentMinuteData = data[recentMinuteKey];
            console.log(recentMinuteData);

            let price = recentMinuteData["4. close"]; // retrieve stock price at the closing of the most recent minute
            console.log(price);
  
            message.reply(`Current stock price of ${symbol}: ${price} USD`);
          }
        });
      //});
    } catch (error) {
        console.log(error);
        message.reply("Unable to retrieve the current price for the specified stock.");
      }
    }
  }
  
  /* else if (message.content.startsWith("safebooru")) {
    let args = message.content.split(/\s+/g).slice(1);
  
    if (args.length === 0) {
      return;
    }
    
    let safebooruArgs = {
      limit: 100,
      page: 1,
      tags: 'fox_ears smile',
      random: true
    };

    safebooru.posts(safebooruArgs).then(posts => {
      console.log(posts[0]);
    });
  } */
});

// token will be logged, so be careful!
client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

function elemBattleDetermineWinner(elementOne, elementTwo) {
  if (elementOne === "fire") {
    switch (elementTwo) {
      case "water":
        return -1;
      case "grass":
        return 1;
    }
  } else if (elementOne === "water") {
    switch (elementTwo) {
      case "fire":
        return 1;
      case "grass":
        return -1;
    }
  } else if (elementOne === "grass") {
    switch (elementTwo) {
      case "water":
        return 1;
      case "fire":
        return -1;
    }
  }

  return 0;
}