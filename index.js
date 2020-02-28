const botconfig = require("./botconfig.json")
const Discord = require("discord.js")
const mongoose = require("mongoose")
const Money = require("./models/money.js")

mongoose.connect('mongodb+srv://root:rootToor@cluster0-c9atl.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const bot = new Discord.Client({disableEveryone: true})

bot.on("ready", async ()=>{
    console.log(`${bot.user.username} is online!`);
    bot.user.setActivity("coding...");
 })
//messagesbotconfig
bot.on("message", async message =>{
    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    let prefix = botconfig.prefix;
    let content = message.content.split(" ");
    let command = content[0];
    let space_command = content[1];
    let args = content.slice(1);
//setmoney

function coin(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

if(command===`${prefix}balance` && space_command===`set`){
    let nameuser = message.mentions.users.first().username
    let iduser = message.mentions.users.first().id
    let coinsset = content[2]
    let coinInt = parseInt(coinsset)
    if(!Number.isInteger(coinInt)){
        message.channel.send("Try !balance set number @mention")
    }
    if(Number.isInteger(coinInt)) {
    console.log(nameuser)
    console.log(iduser)
    console.log(coinsset)
    Money.findOne({
        userID: iduser,
        serverID: message.guild.id
    }, (err, money) =>{
    if(err) console.log(err);
    if(!money){
        const newMoney = new Money({
            userID: iduser,
            userName: nameuser,
            serverID: message.guild.id,
            money: coinsset
        })
        newMoney.save()
    }else{
        money.money = coinsset
        money.save().catch(err =>console.log(err))
    }
})
}
}
if(command===`${prefix}balance` && space_command===`take`){
    let nameuser = message.mentions.users.first().username
    let iduser = message.mentions.users.first().id
    let coinstake = content[2]
    let coinInt = parseInt(coinstake)
    if(!Number.isInteger(coinInt)){
        message.channel.send("Try !balance take number @mention")
    }
    if(Number.isInteger(coinInt)) {
    console.log(nameuser)
    console.log(iduser)
    console.log(coinstake)
    Money.findOne({
        userID: iduser,
        serverID: message.guild.id
    }, (err, money) =>{
    if(err) console.log(err);
    if(!money){
        const newMoney = new Money({
            userID: iduser,
            userName: nameuser,
            serverID: message.guild.id,
            money: money
        })
        newMoney.save()
    }else{
        money.money = money.money - coinInt
        money.save().catch(err =>console.log(err))
    }
})
}
}

if(command===`${prefix}balance` && space_command===`add`){
    let nameuser = message.mentions.users.first().username
    let iduser = message.mentions.users.first().id
    let coinsadd = content[2]
    let coinInt = parseInt(coinsadd)
    if(!Number.isInteger(coinInt)){
        message.channel.send("Try !balance add number @mention")
    }
    if(Number.isInteger(coinInt)) {
    console.log(nameuser)
    console.log(iduser)
    console.log(coinsadd)
    Money.findOne({
        userID: iduser,
        serverID: message.guild.id
    }, (err, money) =>{
    if(err) console.log(err);
    if(!money){
        const newMoney = new Money({
            userID: iduser,
            userName: nameuser,
            serverID: message.guild.id,
            money: money
        })
        newMoney.save()
    }else{
        money.money = money.money + coinInt
        money.save().catch(err =>console.log(err))
    }
})
}
}

if(command===`${prefix}balance` && space_command !=="set" && space_command !=="add" && space_command !=="take"){
    Money.findOne({
        userID: message.author.id,
        serverID: message.guild.id
    },(err, money) =>{
        if(err) console.log(err);
        let moneybalance = new Discord.RichEmbed()
        .setTitle("Balance")
        .setColor("#ebde34")
        .setThumbnail(message.author.displayAvatarURL)
        if(!money){
            moneybalance.addField("Coins", 0, true)
            return message.channel.send(moneybalance)
        }else{moneybalance.addField("Coins", money.money, true)
        return message.channel.send(moneybalance)
        }
    })
}

if(command===`${prefix}coinflip` && content[2]=="head" || content[2]=="tails"){
let amount = content[1]/1

Money.findOne({
    userID: message.author.id,
    serverID: message.guild.id
},(err, money) =>{
    if(err) console.log(err)
    let coinflip = new Discord.RichEmbed()
    if(!money){
        coinflip.setTitle("You dont have enought money !")
        coinflip.setColor("#f54c4c")
        return message.channel.send(coinflip);}
    if(money){
    if(money.money < amount){
        coinflip.setTitle("You dont have enought money !")
        coinflip.setColor("#f54c4c")
        return message.channel.send(coinflip);
    }
    if(money.money > amount){
        let coinrandom = coin(0, 1)
        if(coinrandom==1){
    money.money = money.money - amount
    money.save().catch(err =>console.log(err))
    if(content[2]=="head"){
        coinflip.setThumbnail("") //lose head url
    }
    if(content[2]=="tails"){
        coinflip.setThumbnail("") //win tails url
    }
    coinflip.setTitle('You lose!')
    coinflip.setColor("#a10000")
    coinflip.addField("Bet", amount)
    coinflip.addField("Current Balance", money.money)
    return message.channel.send(coinflip)
        }
    if(coinrandom==0){
        money.money = money.money + amount*2
        money.save().catch(err => console.log(err))
        if(content[2]=="head"){
            coinflip.setThumbnail("") //win head url
        }
        if(content[2]=="tails"){
            coinflip.setThumbnail("") //win tails url
        }
        coinflip.setTitle('You win!')
        coinflip.setColor("#07d400")
        coinflip.addField("Bet", amount)
        coinflip.addField("Current Balance", money.money)
        return message.channel.send(coinflip)
    }
    }
}
})
}
if(command===`${prefix}coinflip` && content[2]!=="head" && content[2]!=="tails"){
    let coinfliphelp = new Discord.RichEmbed()
    .setTitle("Try !coinflip amount head/tails")
    .setColor("#c2de3a")
    return message.channel.send(coinfliphelp)
}
if(command===`${prefix}leaderboard`){
  //idk na dzis
}
})
bot.login(botconfig.token)
