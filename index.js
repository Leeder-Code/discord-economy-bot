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

if(command===`${prefix}balance` && space_command===`set` && message.member.hasPermission("ADMINISTRATOR")){
    let nameuser = message.mentions.users.first().username
    let iduser = message.mentions.users.first().id
    let coinsset = content[2]
    let coinInt = parseInt(coinsset)
    if(!Number.isInteger(coinInt)){
        let sethelp = new Discord.RichEmbed()
        .setTitle("Try !balance set [amount] @mention")
        .setColor("#c2de3a")
        message.channel.send(sethelp)
    }
    if(Number.isInteger(coinInt)) {
        console.log('Gems set')
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
if(command===`${prefix}balance` && space_command===`take` && message.member.hasPermission("ADMINISTRATOR")){
    let nameuser = message.mentions.users.first().username
    let iduser = message.mentions.users.first().id
    let coinstake = content[2]
    let coinInt = parseInt(coinstake)
    if(!Number.isInteger(coinInt)){
        let takehelp = new Discord.RichEmbed()
        .setTitle("Try !balance take [amount] @mention")
        .setColor("#c2de3a")
        message.channel.send(takehelp)
    }
    if(Number.isInteger(coinInt)) {
    console.log('Gems taken')
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

if(command===`${prefix}balance` && space_command===`add` && message.member.hasPermission("ADMINISTRATOR")){
    let nameuser = message.mentions.users.first().username
    let iduser = message.mentions.users.first().id
    let coinsadd = content[2]
    let coinInt = parseInt(coinsadd)
    if(!Number.isInteger(coinInt)){
        let addhelp = new Discord.RichEmbed()
        .setTitle("Try !balance add [amount] @mention")
        .setColor("#c2de3a")
        message.channel.send(addhelp)
    }
    if(Number.isInteger(coinInt)) {
        console.log('Gems added')
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
            moneybalance.addField("Gems", 0, true)
            return message.channel.send(moneybalance)
        }else{moneybalance.addField("Gems", money.money, true)
        return message.channel.send(moneybalance)
        }
    })
}

if(command===`${prefix}coinflip` && content[2]=="head" || content[2]=="tails"){
let amount = content[1]/1
if(content[1]>0){
Money.findOne({
    userID: message.author.id,
    serverID: message.guild.id
},(err, money) =>{
    if(err) console.log(err)
    let coinflip = new Discord.RichEmbed()
    if(!money){
        coinflip.setTitle("You dont have enough money!")
        coinflip.setColor("#f54c4c")
        return message.channel.send(coinflip);}
    if(money){
    if(money.money < amount){
        coinflip.setTitle("You dont have enough money!")
        coinflip.setColor("#f54c4c")
        return message.channel.send(coinflip);
    }
    if(money.money >= parseInt(amount)){
        let coinrandom = coin(0, 1)
        if(coinrandom==1){
    money.money = money.money - parseInt(amount)
    money.save().catch(err =>console.log(err))
    if(content[2]=="head"){
        coinflip.setThumbnail("https://i.imgur.com/XQYCsWN.png") //tails url
    }
    if(content[2]=="tails"){
        coinflip.setThumbnail("https://i.imgur.com/dkJA07x.png") //head url
    }
    coinflip.setTitle('You lose!')
    coinflip.setColor("#a10000")
    coinflip.addField("Bet", parseInt(amount))
    coinflip.addField("Current Balance", money.money)
    return message.channel.send(coinflip)
        }
    if(coinrandom==0){
        money.money = money.money + parseInt(amount*2) //coinflip prize *
        money.save().catch(err => console.log(err))
        if(content[2]=="head"){
            coinflip.setThumbnail("https://i.imgur.com/dkJA07x.png") //head url
        }
        if(content[2]=="tails"){
            coinflip.setThumbnail("https://i.imgur.com/XQYCsWN.png") //tails url
        }
        coinflip.setTitle('You win!')
        coinflip.setColor("#07d400")
        coinflip.addField("Bet", parseInt(amount))
        coinflip.addField("Current Balance", money.money)
        return message.channel.send(coinflip)
    }
    }
}
})
}else{
    var embed = new Discord.RichEmbed()
    .setTitle("Value must be positive!")
    .setColor("f54c4c")
    return message.channel.send(embed)
}
}
if(command===`${prefix}coinflip` && content[2]!=="head" && content[2]!=="tails"){
    let coinfliphelp = new Discord.RichEmbed()
    .setTitle("Try !coinflip amount head/tails")
    .setColor("#c2de3a")
    return message.channel.send(coinfliphelp)
}
if(command===`${prefix}leaderboard` && content[1] === undefined){

    Money.find().sort([['money', 'descending']]).exec((err, res) => {
        if(err) console.log(err)
        var embed = new Discord.RichEmbed()
        .setTitle(`Leaderboard of server ` + message.guild.name)
        .setColor("#3ab7e0")
        for(i=0; i < 20; i++){
            if(res[i] == null) break;
            try{
                embed.addField(`${i+1} ${bot.users.get(res[i].userID).username}`, `${res[i].money}`)
               }catch(e){
               embed.addField(`${i+1} ${res[i].userName}`, `${res[i].money}`)
               }
  
        }
        message.channel.send(embed);
    })


}
if(command===`${prefix}leaderboard` && message.mentions.members.first()){
    let iduser = message.mentions.users.first().id
    let nameuser = message.mentions.users.first().username
    Money.findOne({
        userID : iduser,
        serverID: message.guild.id
    },(err, money) =>{
        if(err) console.log(err)
        let embed = new Discord.RichEmbed()
        .setColor("#ebde34")
        if(money){
        embed.setTitle(`${nameuser} has ${money.money} gems` )
        return message.channel.send(embed)
        }
        if(!money){
        embed.setTitle(`${nameuser} has 0 gems` )
        return message.channel.send(embed)
        }
    }
    )
}
if(command===`${prefix}leaderboard` && !message.mentions.members.first() && content[1] !== undefined){
    let leadhelp = new Discord.RichEmbed()
    .setTitle("Try !leaderboard")
    .setColor("#c2de3a")
    .setDescription("or !leaderboard @mention")
    message.channel.send(leadhelp)

}
})
bot.login(botconfig.token)
