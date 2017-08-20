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

const commands = {
  hashtag: getDiscriminator,
  roles: getMemberRoles,
  UBW: castUnlimitedBladeWorks,
  elembattle: elembattle,
  embed: getEmbeddedMessage
}

client.login(process.env["appToken"]);

client.on("ready", () => {
  console.log("I am ready!");
});

function getDiscriminator(message) {
  message.reply("Your ID discriminator (hashtag) is: " + message.member.user.discriminator);
}

function getEmbeddedMessage(message) {
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
}

function getMemberRoles(mesage) {
  message.reply("Your roles are: " + message.member.roles.map((role) => {
    let name = role.name;
    if (name === "@everyone") {
      name = "everyone";
    }
    return name;
  }).join(", "));
}

function castUnlimitedBladeWorks(message) { 
   message.channel.send("I am the bone of my sword \nSteel is my body, and fire is my blood");
  message.channel.send("I have created over a thousand blades \nUnknown to life, nor known to death");
  message.channel.send("Have withstood pain to create many weapons \nYet these hands will never hold anything");
  message.channel.send("So as I pray");
  message.channel.send("Unlimited Blade Works");
  message.channel.sendFile("http://orig04.deviantart.net/29e2/f/2016/163/9/8/unlimited_blade_works__re_sized__by_pramudyayusuf-da5z15g.png");
}

function getImageFromPixiv(message) {
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
}

function elembattle(message) {
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
}

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

client.on("presenceUpdate", (userOld, userNew) => {
  console.log(userOld);
  console.log("--------");
  console.log(userNew.presence);
});
    
function tableFlip(message) {
  message.channel.send("(ノಠ益ಠ)ノ彡┻━┻");
}

function getStockInfo(message) {
  let symbol = message.content.split(/\s+/g).slice(1);
  // 26Z1HA8NSSEGQYHP
  if (!symbol) {
    message.reply("Please provide the symbol of a stock (such as \"FB\" or \"MSFT\").");
  } else {
    try {
      let stocksApiKey = process.env["stocksApiKey"]

      let currentPricePromise = new Promise((resolve, reject) => {
        request(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${stocksApiKey}`, function (error, response, body) {
          if (error) {
            console.log("An error occurred while attempting to retrive the current stock price.");
            return reject(error);
          } else {
            let responseBody = JSON.parse(body);
            console.log(responseBody);

            let data = responseBody["Time Series (1min)"];
            let recentMinuteKey = Object.keys(data)[0];
            let recentMinuteData = data[recentMinuteKey];
            console.log(recentMinuteData);

            let price = recentMinuteData["4. close"]; // retrieve stock price at the closing of the most recent minute
            console.log(price);
  
            return resolve(price);
          }
        });
      });

      let timeSeriesOpeningPricesPromise = new Promise((resolve, reject) => {
        request(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&interval=1min&apikey=${stocksApiKey}`, function (error, response, body) {
          if (error) {
            console.log("An error occurred while attempting to retrive opening stock prices.");
            return reject(error);
          } else {
            let responseBody = JSON.parse(body);
            console.log(responseBody);

            let data = responseBody["Time Series (Daily)"];
  
            let todayKey = Object.keys(data)[0];
            let todayData = data[todayKey];
            let todayOpeningPrice = todayData["1. open"]; // retrieve stock price at the opening of the current day
            console.log("Today's opening price: " + todayOpeningPrice);

            let yesterdayKey = Object.keys(data)[1];
            let yesterdayData = data[yesterdayKey];
            let yesterdayOpeningPrice = yesterdayData["1. open"]; // retrieve stock price at the opening of the day before
            console.log("Yesterday's opening price: " + yesterdayOpeningPrice);
  
            let weekAgoKey = Object.keys(data)[5];
            let weekAgoData = data[weekAgoKey];
            let weekAgoOpeningPrice = weekAgoData["1. open"]; // retrieve stock price at the opening of the day before
            console.log("A week ago's opening price: " + weekAgoOpeningPrice);

            let monthAgoKey = Object.keys(data)[20];
            let monthAgoData = data[monthAgoKey];
            let monthAgoOpeningPrice = monthAgoData["1. open"]; // retrieve stock price at the opening of the day before
            console.log("A month ago's opening price: " + monthAgoOpeningPrice);

            return resolve({
              today: todayOpeningPrice,
              yesterday: yesterdayOpeningPrice,
              weekAgo: weekAgoOpeningPrice,
              monthAgo: monthAgoOpeningPrice
            });
          }
        });
      });

      Promise.all([currentPricePromise, timeSeriesOpeningPricesPromise])
        .then((priceData) => {
          console.log("Promise.all completed");
          console.log(priceData);
          let currentPrice = priceData[0];
          message.reply(`Current stock price of ${symbol}: **${currentPrice} USD**`);

          let openingPrices = priceData[1];
          let currentToTodayOpeningDiff = (currentPrice - openingPrices.today).toFixed(4);
          let currentToYesterdayOpeningDiff = (currentPrice - openingPrices.yesterday).toFixed(4);
          let currentToAWeekAgoOpeningDiff = (currentPrice - openingPrices.weekAgo).toFixed(4);
          let currentToAMonthAgoOpeningDiff = (currentPrice - openingPrices.monthAgo).toFixed(4);

          message.channel.send(
            `Current price compared to previous opening prices (weekends are excluded from the continuity): \n\n` +
            `**${currentToTodayOpeningDiff}** difference compared to today. \n` +
            `**${currentToYesterdayOpeningDiff}** difference compared to yesterday. \n` +
            `**${currentToAWeekAgoOpeningDiff}** difference compared to a week ago (5 trading days). \n` +
            `**${currentToAMonthAgoOpeningDiff}** difference compared to a month ago (20 trading days).`);
        })
        .catch((error) => {
          console.log(error);
        });

  } catch (error) {
      console.log(error);
      message.reply("Unable to retrieve the current price for the specified stock.");
    }
  }
}

client.on("error", (e) => console.error(e));
client.on("warn", (e) => console.warn(e));
client.on("debug", (e) => console.info(e));

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

// token will be logged, so be careful!


