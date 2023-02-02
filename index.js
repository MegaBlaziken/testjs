const Discord = require("discord.js");
const request = require('request');
const cron = require('node-cron');
const moment = require('moment');
const fs = require("fs");

//write here
var bottoken = ''
var twitterID = 'megablaziken'
const c_geso = '1065658516527906856'
const c_turf = '1065658130110873600'
const c_bankara = '1065658280900296784'
const c_salmon = '1065658494235185262'
const c_xmatch = '1065658398365986856'

//https://github.com/misenhower/splatoon3.ink/wiki/Data-Access
//You must read the policies


//datas
var gesodata = ''
var stagedata = ''
var langdata = ""
var formatdata = {
  "gearPower": {
      "Ink Saver (Main)": {
          "name": "インク効率アップ(メイン)"
      },
      "Ink Saver (Sub)": {
          "name": "インク効率アップ(サブ)"
      },
      "Ink Recovery Up": {
          "name": "インク回復力アップ"
      },
      "Run Speed Up": {
          "name": "ヒト移動速度アップ"
      },
      "Swim Speed Up": {
          "name": "イカダッシュ速度アップ"
      },
      "Special Charge Up": {
          "name": "スペシャル増加量アップ"
      },
      "Special Saver": {
          "name": "スペシャル減少量ダウン"
      },
      "Special Power Up": {
          "name": "スペシャル性能アップ"
      },
      "Quick Respawn": {
          "name": "復活時間短縮"
      },
      "Quick Super Jump": {
          "name": "スーパージャンプ時間短縮"
      },
      "Sub Power Up": {
          "name": "サブ性能アップ"
      },
      "Ink Resistance Up": {
          "name": "相手インク影響軽減"
      },
      "Sub Resistance Up": {
          "name": "サブ影響軽減"
      },
      "Intensify Action": {
          "name": "アクション強化"
      },
      "Opening Gambit": {
          "name": "スタートダッシュ"
      },
      "Last-Ditch Effort": {
          "name": "ラストスパート"
      },
      "Tenacity": {
          "name": "逆境強化"
      },
      "Comeback": {
          "name": "カムバック"
      },
      "Ninja Squid": {
          "name": "イカニンジャ"
      },
      "Haunt": {
          "name": "リベンジ"
      },
      "Thermal Ink": {
          "name": "サーマルインク"
      },
      "Respawn Punisher": {
          "name": "復活ペナルティアップ"
      },
      "Ability Doubler": {
          "name": "追加ギアパワー倍化"
      },
      "Stealth Jump": {
          "name": "ステルスジャンプ"
      },
      "Object Shredder": {
          "name": "対物攻撃力アップ"
      },
      "Drop Roller": {
          "name": "受け身術"
      },
      "Unknown": {
          "name": "不明"
      }
  },
  "brands": {
      "Zink": {
          "name": "アイロニック","Favored_Ability":"スーパージャンプ時間短縮"
      },
      "Cuttlegear": {
          "name": "アタリメイド","Favored_Ability":"なし"
      },
      "Tentatek": {
          "name": "アロメ","Favored_Ability":"インク回復力アップ"
      },
      "Zekko": {
          "name": "エゾッコ","Favored_Ability":"スペシャル減少量ダウン"
      },
      "Krak-On": {
          "name": "クラーゲス","Favored_Ability":"イカダッシュ速度アップ"
      },
      "Inkline": {
          "name": "シグレニ","Favored_Ability":"サブ影響軽減"
      },
      "Splash Mob": {
          "name": "ジモン","Favored_Ability":"インク効率アップ(メイン)"
      },
      "SquidForce": {
          "name": "バトロイカ","Favored_Ability":"相手インク影響軽減"
      },
      "Forge": {
          "name": "フォーリマ","Favored_Ability":"スペシャル性能アップ"
      },
      "Skalop": {
          "name": "ホタックス","Favored_Ability":"復活時間短縮"
      },
      "Firefin": {
          "name": "ホッコリー","Favored_Ability":"インク効率アップ(サブ)"
      },
      "Takoroka": {
          "name": "ヤコ","Favored_Ability":"スペシャル増加量アップ"
      },
      "Annaki": {
          "name": "アナアキ","Favored_Ability":"インク効率アップ(サブ)"
      },
      "Barazushi": {
          "name": "バラズシ","Favored_Ability":"アクション強化"
      },
      "Emberz": {
          "name": "シチリン","Favored_Ability":"アクション強化"
      },
      "Enperry": {
          "name": "エンペリー","Favored_Ability":"サブ性能アップ"
      },
      "Rockenberg": {
          "name": "ロッケンベルグ","Favored_Ability":"ヒト移動速度アップ"
      },
      "Toni Kensa": {
        "name": "タタキケンサキ","Favored_Ability":"インク効率アップ(メイン)"
    }
  },
  "GearTypes":{
    "HeadGear":{
        "name":"アタマ"
    },
    "ClothingGear":{
        "name":"フク"
    },
    "ShoesGear":{
        "name":"クツ"
    }
  }
}

//slash commands
const interactiondata = [
  {name: "geso",    description: "ゲソタウンのギアをすべて取得。"},
  {name: "help",    description:"ヘルプコマンド"},
  {name: "update",  description:"コマンド追加用"},
  {name: "xmatch",  description: "Xマッチのステージを取得します。" },
  {name: "turf",    description: "ナワバリのステージを取得します。"},
  {name: "series",  description: "チャレンジのステージを取得します。"},
  {name: "open",    description: "オープンのステージを取得します。"},
  {name: "coop",    description: "サーモンランの情報を取得します。"},
];

//get gears
cron.schedule('30 0 1,5,9,13,17,21 * * *', () => {
    //ゲソタウンデータ取得
    var options1 = {
      url: 'https://splatoon3.ink/data/gear.json',
      headers: {
        'User-Agent': 'Discordbot-Twitter-'+twitterID,
      }
    };
    function gets1(error1, response1, body1) {
      if (!error1 && response1.statusCode == 200) {
        gesodata = JSON.parse(body1);
        console.log(`{${d}日${h}時${m}分${s}秒} ゲソタウンリクエスト送信`)
      }
    }
    request.get(options1, gets1);  
});
//get schedule
cron.schedule('30 0 1,3,5,7,9,11,13,15,17,19,21,23 * * *', () => {
  //ステージ取得
  var options2 = {
    url: 'https://splatoon3.ink/data/schedules.json',
    headers: {
      'User-Agent': 'Discordbot-Twitter-'+twitterID
    }
  };
  function gets2(error2, response2, body2) {
    if (!error2 && response2.statusCode == 200) {
      stagedata = JSON.parse(body2);
      console.log(`{${d}日${h}時${m}分${s}秒} ステージリクエスト送信`)
    }
  }
  request.get(options2, gets2);
});
//get time
function nowtime(){
  var now = new Date();
  d = now.getDate()
  h = now.getHours()
  m = now.getMinutes()
  s = now.getSeconds()
}


const sclient= new Discord.Client({
  intents: Object.keys(Discord.Intents.FLAGS, Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS)
});
sclient.on('ready', async () => {
  nowtime()
  console.log(`{${d}日${h}時${m}分${s}秒} [\x1b[35mパッケージバージョン:${Discord.version}\x1b[0m] スプラ3BOT起動完了`);
  sclient.user.setActivity(sclient.guilds.cache.size + 'サーバーに参加中｜s3.help', {
    type: 'PLAYING'
  })

  //ゲソタウンデータ取得
  var options1 = {
    url: 'https://splatoon3.ink/data/gear.json',
    headers: {
      'User-Agent': 'Discordbot-Twitter-'+twitterID,
    }
  };
  function gets1(error1, response1, body1) {
    if (!error1 && response1.statusCode == 200) {
      gesodata = JSON.parse(body1);
      console.log(`{${d}日${h}時${m}分${s}秒} ゲソタウンリクエスト送信`)
    }
  }
  request.get(options1, gets1);
  //ステージ取得
  var options2 = {
    url: 'https://splatoon3.ink/data/schedules.json',
    headers: {
      'User-Agent': 'Discordbot-Twitter-'+twitterID
    }
  };
  function gets2(error2, response2, body2) {
    if (!error2 && response2.statusCode == 200) {
      stagedata = JSON.parse(body2);
      console.log(`{${d}日${h}時${m}分${s}秒} ステージリクエスト送信`)
    }
  }
  request.get(options2, gets2);
  //言語設定取得
  var options3 = {
    url: 'https://splatoon3.ink/data/locale/ja-JP.json',
    headers: {
      'User-Agent': 'Discordbot-Twitter-'+twitterID
    }
  };
  function gets3(error3, response3, body3) {
    if (!error3 && response3.statusCode == 200) {
      langdata = JSON.parse(body3);
      console.log(`{${d}日${h}時${m}分${s}秒} 言語設定リクエスト送信`)
    }
  }
  request.get(options3, gets3);
  const geso_channel = await sclient.channels.fetch(c_geso)
    cron.schedule('35 0 1,5,9,13,17,21 * * *', () => {
    //普通のギア
    var limited = gesodata.data.gesotown.limitedGears
    var limitedgearembed = []
    for (let i = 0; i < 6; i++) {
      var MainJP = formatdata.gearPower[limited[i].gear.primaryGearPower.name].name
      var FavoJP = formatdata.brands[limited[i].gear.brand.name].Favored_Ability
      var BrandJP = formatdata.brands[limited[i].gear.brand.name].name
      var GearName = langdata.gear[limited[i].gear.__splatoon3ink_id].name
      var GearType = formatdata.GearTypes[limited[i].gear.__typename].name
      if((limited[i].gear.additionalGearPowers).length == 1){
        limitedgearembed.push(new Discord.MessageEmbed()
        .setColor(0xff0099)
        .setTitle(GearName)
        .setDescription(limited[i].price.toString() +"ゲソ")
        .setAuthor({ name: '📢 新規入荷！', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
        .setThumbnail(limited[i].gear.primaryGearPower.image.url)
        .addFields(
          { name: 'ギアの種類', value: GearType, inline: true },
          { name: 'メインギアパワー', value: MainJP, inline: true },
          { name: '付きやすいギアパワー', value: FavoJP, inline: true },
          { name: '\u200B', value: '\u200B'},
          { name: '追加ギアパワー1', value: '⭕', inline: true },
          { name: '追加ギアパワー2', value: '❌', inline: true },
          { name: '追加ギアパワー3', value: '❌', inline: true },
        )
        .setImage(limited[i].gear.image.url)
        .setTimestamp(limited[i].saleEndTime)
        .setFooter({ text: 'ブランド：'+BrandJP, iconURL: limited[i].gear.brand.image.url }))
      }
      if((limited[i].gear.additionalGearPowers).length == 2){
        limitedgearembed.push(new Discord.MessageEmbed()
        .setColor(0xff0099)
        .setTitle(GearName)
        .setDescription(limited[i].price.toString() +"ゲソ")
        .setAuthor({ name: '📢 新規入荷！', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
        .setThumbnail(limited[i].gear.primaryGearPower.image.url)
        .addFields(
          { name: 'ギアの種類', value: GearType, inline: true },
          { name: 'メインギアパワー', value: MainJP, inline: true },
          { name: '付きやすいギアパワー', value: FavoJP, inline: true },
          { name: '\u200B', value: '\u200B'},
          { name: '追加ギアパワー1', value: '⭕', inline: true },
          { name: '追加ギアパワー2', value: '⭕', inline: true },
          { name: '追加ギアパワー3', value: '❌', inline: true },
        )
        .setImage(limited[i].gear.image.url)
        .setTimestamp(limited[i].saleEndTime)
        .setFooter({ text: 'ブランド：'+BrandJP, iconURL: limited[i].gear.brand.image.url }))
      }
      if((limited[i].gear.additionalGearPowers).length == 3){
        limitedgearembed.push(new Discord.MessageEmbed()
        .setColor(0xff0099)
        .setTitle(GearName)
        .setDescription(limited[i].price.toString() +"ゲソ")
        .setAuthor({ name: '📢 新規入荷！', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
        .setThumbnail(limited[i].gear.primaryGearPower.image.url)
        .addFields(
          { name: 'ギアの種類', value: GearType, inline: true },
          { name: 'メインギアパワー', value: MainJP, inline: true },
          { name: '付きやすいギアパワー', value: FavoJP, inline: true },
          { name: '\u200B', value: '\u200B'},
          { name: '追加ギアパワー1', value: '⭕', inline: true },
          { name: '追加ギアパワー2', value: '⭕', inline: true },
          { name: '追加ギアパワー3', value: '⭕', inline: true },
        )
        .setImage(limited[i].gear.image.url)
        .setTimestamp(limited[i].saleEndTime)
        .setFooter({ text: 'ブランド：'+BrandJP, iconURL: limited[i].gear.brand.image.url }))
      }
    }
    geso_channel.send({embeds: [limitedgearembed[5]]})
    nowtime()
    console.log(`{${d}日${h}時${m}分${s}秒} ゲソタウン入荷送信`)
    })
    cron.schedule('35 0 9 * * *', () => {
    //ピックアップギア
    var pickupbrand = gesodata.data.gesotown.pickupBrand
    var pickupembeds = []
    for (let i = 0; i < 3; i++) {
      var MainJP = formatdata.gearPower[pickupbrand.brandGears[i].gear.primaryGearPower.name].name
      var FavoJP = formatdata.brands[pickupbrand.brandGears[i].gear.brand.name].Favored_Ability
      var BrandJP = formatdata.brands[pickupbrand.brandGears[i].gear.brand.name].name
      var GearName = langdata.gear[pickupbrand.brandGears[i].gear.__splatoon3ink_id].name
      var GearType = formatdata.GearTypes[pickupbrand.brandGears[i].gear.__typename].name
      if((pickupbrand.brandGears[i].gear.additionalGearPowers).length == 1){
        pickupembeds.push(new Discord.MessageEmbed()
        .setColor(0xff0099)
        .setTitle(GearName)
        .setDescription(pickupbrand.brandGears[i].price.toString() +"ゲソ")
        .setAuthor({ name: '📢 今日のピックアップ！', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
        .setThumbnail(pickupbrand.brandGears[i].gear.primaryGearPower.image.url)
        .addFields(
          { name: 'ギアの種類', value: GearType, inline: true },
          { name: 'メインギアパワー', value: MainJP, inline: true },
          { name: '付きやすいギアパワー', value: FavoJP, inline: true },
          { name: '\u200B', value: '\u200B'},
          { name: '追加ギアパワー1', value: '⭕', inline: true },
          { name: '追加ギアパワー2', value: '❌', inline: true },
          { name: '追加ギアパワー3', value: '❌', inline: true },
        )
        .setImage(pickupbrand.brandGears[i].gear.image.url)
        .setTimestamp(pickupbrand.saleEndTime)
        .setFooter({ text: 'ブランド：'+BrandJP, iconURL: pickupbrand.brandGears[i].gear.brand.image.url }))
      }
      if((pickupbrand.brandGears[i].gear.additionalGearPowers).length == 2){
        pickupembeds.push(new Discord.MessageEmbed()
        .setColor(0xff0099)
        .setTitle(GearName)
        .setDescription(pickupbrand.brandGears[i].price.toString() +"ゲソ")
        .setAuthor({ name: '📢 今日のピックアップ！', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
        .setThumbnail(pickupbrand.brandGears[i].gear.primaryGearPower.image.url)
        .addFields(
          { name: 'ギアの種類', value: GearType, inline: true },
          { name: 'メインギアパワー', value: MainJP, inline: true },
          { name: '付きやすいギアパワー', value: FavoJP, inline: true },
          { name: '\u200B', value: '\u200B'},
          { name: '追加ギアパワー1', value: '⭕', inline: true },
          { name: '追加ギアパワー2', value: '⭕', inline: true },
          { name: '追加ギアパワー3', value: '❌', inline: true },
        )
        .setImage(pickupbrand.brandGears[i].gear.image.url)
        .setTimestamp(pickupbrand.saleEndTime)
        .setFooter({ text: 'ブランド：'+BrandJP, iconURL: pickupbrand.brandGears[i].gear.brand.image.url }))
      }
      if((pickupbrand.brandGears[i].gear.additionalGearPowers).length == 3){
        pickupembeds.push(new Discord.MessageEmbed()
        .setColor(0xff0099)
        .setTitle(GearName)
        .setDescription(pickupbrand.brandGears[i].price.toString() +"ゲソ")
        .setAuthor({ name: '📢 今日のピックアップ！', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
        .setThumbnail(pickupbrand.brandGears[i].gear.primaryGearPower.image.url)
        .addFields(
          { name: 'ギアの種類', value: GearType, inline: true },
          { name: 'メインギアパワー', value: MainJP, inline: true },
          { name: '付きやすいギアパワー', value: FavoJP, inline: true },
          { name: '\u200B', value: '\u200B'},
          { name: '追加ギアパワー1', value: '⭕', inline: true },
          { name: '追加ギアパワー2', value: '⭕', inline: true },
          { name: '追加ギアパワー3', value: '⭕', inline: true },
        )
        .setImage(pickupbrand.brandGears[i].gear.image.url)
        .setTimestamp(pickupbrand.saleEndTime)
        .setFooter({ text: 'ブランド：'+BrandJP, iconURL: pickupbrand.brandGears[i].gear.brand.image.url }))
      }
    }
    geso_channel.send({embeds: [pickupembeds[0],pickupembeds[1],pickupembeds[2]]})
    nowtime()
    console.log(`{${d}日${h}時${m}分${s}秒} ゲソタウンピックアップギア入荷送信`)
    })
    const nawa_channel = await sclient.channels.fetch(c_turf)
    cron.schedule('35 0 1,3,5,7,9,11,13,15,17,19,21,23 * * *', () => {
    // ナワバリバトル
    var turfSC = stagedata.data.regularSchedules
    var festSC = stagedata.data.festSchedules
    var turfembed = []

    var festcount = 0
    let i = 0;{
      if(turfSC.nodes[i].festMatchSetting == null){
        var Stage1JP = langdata.stages[turfSC.nodes[i].regularMatchSetting.vsStages[0].id].name
        var Stage2JP = langdata.stages[turfSC.nodes[i].regularMatchSetting.vsStages[1].id].name
        turfembed.push(new Discord.MessageEmbed()
        .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(i))
        .setColor(0x19d719)
        .setTitle('ナワバリバトル')
        .setAuthor({ name: 'Splatoon3.inkにより出力', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
        .setThumbnail('https://splatoon3.ink/assets/regular.64299513.svg')
        .addFields({ name: '開催時間', value: `${moment(turfSC.nodes[i].startTime).date()}日${moment(turfSC.nodes[i].startTime).hours()}:00～${moment(turfSC.nodes[i].endTime).date()}日${moment(turfSC.nodes[i].endTime).hours()}:00`},
        { name: 'ステージ1', value: Stage1JP, inline: true },
        { name: 'ステージ2', value: Stage2JP, inline: true },
        { name: '\u200B', value: '\u200B'}
        )
        .setImage(turfSC.nodes[i].regularMatchSetting.vsStages[0].image.url)
        )
        turfembed.push(new Discord.MessageEmbed()
        .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(i))
        .setImage(turfSC.nodes[i].regularMatchSetting.vsStages[1].image.url))
      }else{
        festcount++
          var Stage1JP = langdata.stages[festSC.nodes[festcount - 1].festMatchSetting.vsStages[0].id].name
          var Stage2JP = langdata.stages[festSC.nodes[festcount - 1].festMatchSetting.vsStages[1].id].name
          turfembed.push(new Discord.MessageEmbed()
          .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(festcount))
          .setColor(0x19d719)
          .setTitle('フェスマッチ : ナワバリバトル')
          .setAuthor({ name: 'Splatoon3.inkにより出力', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
          .addFields({ name: '開催時間', value: `${moment(festSC.nodes[i].startTime).date()}日${moment(festSC.nodes[i].startTime).hours()}:00～${moment(festSC.nodes[i].endTime).date()}日${moment(festSC.nodes[i].endTime).hours()}:00`},
          { name: 'ステージ1', value: Stage1JP, inline: true },
          { name: 'ステージ2', value: Stage2JP, inline: true },
          { name: '\u200B', value: '\u200B'}
          )
          .setImage(festSC.nodes[festcount - 1].festMatchSetting.vsStages[0].image.url)
          )
          turfembed.push(new Discord.MessageEmbed()
          .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(festcount))
          .setImage(festSC.nodes[festcount - 1].festMatchSetting.vsStages[1].image.url))
      }
    }
    //フェスなどで取得できないとき
    if(turfembed.length == 0){
      turfembed.push(new Discord.MessageEmbed()
      .setColor(0x19d719)
      .setTitle('現在フェスのためナワバリバトルは行われていません。')
      )
    }
    nawa_channel.send({embeds: turfembed})
    nowtime()
    console.log(`{${d}日${h}時${m}分${s}秒} ナワバリバトル送信`)
    })
    const b_channel = await sclient.channels.fetch(c_bankara)
    cron.schedule('35 0 1,3,5,7,9,11,13,15,17,19,21,23 * * *', () => {
    // チャレンジマッチ
    var bankarasc =  stagedata.data.bankaraSchedules
    var cembed = []

    let i = 0;{
      if(bankarasc.nodes[i].bankaraMatchSettings !== null){
      var rule = langdata.rules[bankarasc.nodes[i].bankaraMatchSettings[0].vsRule.id].name
      var Stage1JP = langdata.stages[bankarasc.nodes[i].bankaraMatchSettings[0].vsStages[0].id].name
      var Stage2JP = langdata.stages[bankarasc.nodes[i].bankaraMatchSettings[0].vsStages[1].id].name
      if(bankarasc.nodes[i].festMatchSetting == null){
        cembed.push(new Discord.MessageEmbed()
        .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(i))
        .setColor(0xf54910)
        .setTitle(`バンカラマッチチャレンジ---${rule}`)
        .setAuthor({ name: 'Splatoon3.inkにより出力', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
        .setThumbnail('https://splatoon3.ink/assets/bankara.996009b0.svg')
        .addFields({ name: '開催時間', value: `${moment(bankarasc.nodes[i].startTime).date()}日${moment(bankarasc.nodes[i].startTime).hours()}:00～${moment(bankarasc.nodes[i].endTime).date()}日${moment(bankarasc.nodes[i].endTime).hours()}:00`},
        { name: 'ステージ1', value:  Stage1JP, inline: true },
        { name: 'ステージ2', value:  Stage2JP, inline: true }
        )
        .setImage(bankarasc.nodes[i].bankaraMatchSettings[0].vsStages[0].image.url)
      )
      cembed.push(new Discord.MessageEmbed()
      .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(i))
      .setImage(bankarasc.nodes[i].bankaraMatchSettings[0].vsStages[1].image.url))
      }
    }
    }
    //フェスなどで取得できないとき
    if(cembed.length == 0){
      cembed.push(new Discord.MessageEmbed()
      .setColor(0xf54910)
      .setTitle('現在フェスのためバンカラマッチ（チャレンジ）は行われていません。')
      )
    }
    b_channel.send({embeds: cembed})
    nowtime()
    console.log(`{${d}日${h}時${m}分${s}秒} チャレンジ送信`)
    })
    cron.schedule('35 0 1,3,5,7,9,11,13,15,17,19,21,23 * * *', () => {
    // オープンマッチ
    var bankarasc =  stagedata.data.bankaraSchedules
    var oembed = []

    let i = 0;{
      if(bankarasc.nodes[i].bankaraMatchSettings !== null){
          var rule = langdata.rules[bankarasc.nodes[i].bankaraMatchSettings[1].vsRule.id].name
          var Stage1JP = langdata.stages[bankarasc.nodes[i].bankaraMatchSettings[1].vsStages[0].id].name
          var Stage2JP = langdata.stages[bankarasc.nodes[i].bankaraMatchSettings[1].vsStages[1].id].name
          if(bankarasc.nodes[i].festMatchSetting == null){
            oembed.push(new Discord.MessageEmbed()
            .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(i))
            .setColor(0xf58310)
            .setTitle(`バンカラマッチオープン---${rule}`)
            .setAuthor({ name: 'Splatoon3.inkにより出力', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
            .setThumbnail('https://splatoon3.ink/assets/bankara.996009b0.svg')
            .addFields({ name: '開催時間', value: `${moment(bankarasc.nodes[i].startTime).date()}日${moment(bankarasc.nodes[i].startTime).hours()}:00～${moment(bankarasc.nodes[i].endTime).date()}日${moment(bankarasc.nodes[i].endTime).hours()}:00`},
            { name: 'ステージ1', value: Stage1JP, inline: true },
            { name: 'ステージ2', value: Stage2JP, inline: true }
          )
          .setImage(bankarasc.nodes[i].bankaraMatchSettings[1].vsStages[0].image.url)
          )
          oembed.push(new Discord.MessageEmbed()
          .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(i))
          .setImage(bankarasc.nodes[i].bankaraMatchSettings[1].vsStages[1].image.url))
          }
        }
      }
      //フェスなどで取得できないとき
      if(oembed.length == 0){
        oembed.push(new Discord.MessageEmbed()
        .setColor(0xf58310)
        .setTitle('現在フェスのためバンカラマッチ（オープン）は行われていません。')
        )
      }
    b_channel.send({embeds: oembed})
    nowtime()
    console.log(`{${d}日${h}時${m}分${s}秒} オープン送信`)
    })
    const x_channel = await sclient.channels.fetch(c_xmatch)
    cron.schedule('35 0 1,3,5,7,9,11,13,15,17,19,21,23 * * *', () => {
    // Xマッチ
    var Xsc =  stagedata.data.xSchedules
    var Xembed = []

    let i = 0; {
      if(Xsc.nodes[i].xMatchSetting !== null){
          var rule = langdata.rules[Xsc.nodes[i].xMatchSetting.vsRule.id].name
          var Stage1JP = langdata.stages[Xsc.nodes[i].xMatchSetting.vsStages[0].id].name
          var Stage2JP = langdata.stages[Xsc.nodes[i].xMatchSetting.vsStages[1].id].name
          if(Xsc.nodes[i].festMatchSetting == null){
            Xembed.push(new Discord.MessageEmbed()
            .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(i))
            .setColor(0x0fdb9b)
            .setTitle(`Xマッチ---${rule}`)
            .setAuthor({ name: 'Splatoon3.inkにより出力', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
            .setThumbnail('https://splatoon3.ink/assets/x.4bec815d.svg')
            .addFields({ name: '開催時間', value: `${moment(Xsc.nodes[i].startTime).date()}日${moment(Xsc.nodes[i].startTime).hours()}:00～${moment(Xsc.nodes[i].endTime).date()}日${moment(Xsc.nodes[i].endTime).hours()}:00`},
            { name: 'ステージ1', value: Stage1JP, inline: true },
            { name: 'ステージ2', value: Stage2JP, inline: true }
          )
          .setImage(Xsc.nodes[i].xMatchSetting.vsStages[0].image.url)
          )
          Xembed.push(new Discord.MessageEmbed()
          .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(i))
          .setImage(Xsc.nodes[i].xMatchSetting.vsStages[1].image.url))
          }
        }
      }
    //フェスなどで取得できないとき
    if(Xembed.length == 0){
      Xembed.push(new Discord.MessageEmbed()
      .setColor(0x0fdb9b)
      .setTitle('現在フェスのためXマッチは行われていません。')
      )
    }
    x_channel.send({embeds: Xembed})
    nowtime()
    console.log(`{${d}日${h}時${m}分${s}秒} Xマッチ送信`)
    })
    const salmon_channel = await sclient.channels.fetch(c_salmon)
    cron.schedule('35 0 1,9,17 * * *', () => {
    var coopsc =  stagedata.data.coopGroupingSchedule.regularSchedules
    var coopembeds = []
    var limitco = 2
    //bigrun
    var bigrunsc =  stagedata.data.coopGroupingSchedule.bigRunSchedules
    var BGi = 0

    for (let i = 0; i < limitco ; i++) {
      function bigrun(){
        var weapon1 = langdata.weapons[bigrunsc.nodes[BGi].setting.weapons[0].__splatoon3ink_id].name
        var weapon2 = langdata.weapons[bigrunsc.nodes[BGi].setting.weapons[1].__splatoon3ink_id].name
        var weapon3 = langdata.weapons[bigrunsc.nodes[BGi].setting.weapons[2].__splatoon3ink_id].name
        var weapon4 = langdata.weapons[bigrunsc.nodes[BGi].setting.weapons[3].__splatoon3ink_id].name
        var stage = langdata.stages[bigrunsc.nodes[BGi].setting.coopStage.id].name
        coopembeds.push(new Discord.MessageEmbed()
      .setColor(0xb322ff)
      .setTitle(`${stage}`)
      .setAuthor({ name: 'Splatoon3.inkにより出力', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
      .setThumbnail('https://splatoon2.ink/assets/img/mr-grizz.a87af81b.png')
      .addFields({ name: '開催時間', value: `${moment(bigrunsc.nodes[BGi].startTime).date()}日${moment(bigrunsc.nodes[BGi].startTime).hours()}:00～${moment(bigrunsc.nodes[BGi].endTime).date()}日${moment(bigrunsc.nodes[BGi].endTime).hours()}:00`},
      { name: '武器1', value: weapon1, inline: true},
      { name: '武器2', value: weapon2, inline: true},
      { name: '\u200B', value: '\u200B'},
      { name: '武器3', value: weapon3, inline: true},
      { name: '武器4', value: weapon4, inline: true}
      )
      .setImage(bigrunsc.nodes[BGi].setting.coopStage.image.url)
      )
      }
      function normal(){
        var weapon1 = langdata.weapons[coopsc.nodes[i].setting.weapons[0].__splatoon3ink_id].name
        var weapon2 = langdata.weapons[coopsc.nodes[i].setting.weapons[1].__splatoon3ink_id].name
        var weapon3 = langdata.weapons[coopsc.nodes[i].setting.weapons[2].__splatoon3ink_id].name
        var weapon4 = langdata.weapons[coopsc.nodes[i].setting.weapons[3].__splatoon3ink_id].name
        var stage = langdata.stages[coopsc.nodes[i].setting.coopStage.id].name
        coopembeds.push(new Discord.MessageEmbed()
        .setColor(0xff5600)
        .setTitle(`${stage}`)
        .setAuthor({ name: 'Splatoon3.inkにより出力', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
        .setThumbnail('https://splatoon2.ink/assets/img/mr-grizz.a87af81b.png')
        .addFields({ name: '開催時間', value: `${moment(coopsc.nodes[i].startTime).date()}日${moment(coopsc.nodes[i].startTime).hours()}:00～${moment(coopsc.nodes[i].endTime).date()}日${moment(coopsc.nodes[i].endTime).hours()}:00`},
        { name: '武器1', value: weapon1, inline: true},
        { name: '武器2', value: weapon2, inline: true},
        { name: '\u200B', value: '\u200B'},
        { name: '武器3', value: weapon3, inline: true},
        { name: '武器4', value: weapon4, inline: true}
        )
        .setImage(coopsc.nodes[i].setting.coopStage.image.url)
      )

      }
      if((coopsc.nodes[i+1].startTime !== coopsc.nodes[i].endTime)){
        normal()
        bigrun()
        limitco--
      }else{
        if((moment(coopsc.nodes[i].startTime) > moment()&&i == 0)){
          bigrun()
          normal()
          limitco--
        }else{
          normal()
        }
      }
    }
    salmon_channel.send({embeds: coopembeds})
    nowtime()
    console.log(`{${d}日${h}時${m}分${s}秒} サーモン送信`)
    })
});
sclient.on("messageCreate", async message => {
  if (message.author.bot) return;
  if(!message.guild)return;
  if(!message.channel.permissionsFor(sclient.user.id).has('ADMINISTRATOR')){
  }else{
      if(!message.channel.permissionsFor(sclient.user.id).has('SEND_MESSAGES')) return;
      if(!message.channel.permissionsFor(sclient.user.id).has('ATTACH_FILES')) return;
      if(!message.channel.permissionsFor(sclient.user.id).has('READ_MESSAGE_HISTORY')) return;
  }
  if(message.content == 's3.help'){
    
      const emb= new Discord.MessageEmbed()
      .setDescription('```s3.slash => スラッシュコマンドをサーバーに追加します。\nスラッシュコマンドについては/helpより確認いただけます。```')
      .setColor('7b68ee')
      message.reply({embeds: [emb], ephemeral: true })
      console.log(gesodata)
      console.log(stagedata)
      console.log(langdata)
  }
  if(message.content == 's3.slash'){
    await sclient.application.commands.set(interactiondata, message.guild.id);
  }
})
sclient.on('guildCreate', async guild => {
  sclient.user.setActivity(sclient.guilds.cache.size + 'サーバーに参加中｜s3.help', {
    type: 'PLAYING'
  });
  await sclient.application.commands.set(interactiondata, guild.id);
})
sclient.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
      return;
  }
  nowtime()
  console.log(`{${d}日${h}時${m}分${s}秒} [\x1b[34mコマンドの使用\x1b[0m] ${interaction.guild.name}:${interaction.guild.id}　でコマンドが${interaction.member.id}によって使用`);
  if (interaction.commandName === 'geso') {
    //ピックアップギア
    var pickupbrand = gesodata.data.gesotown.pickupBrand
    var pickupembeds = []
    for (let i = 0; i < 3; i++) {
      var MainJP = formatdata.gearPower[pickupbrand.brandGears[i].gear.primaryGearPower.name].name
      var FavoJP = formatdata.brands[pickupbrand.brandGears[i].gear.brand.name].Favored_Ability
      var BrandJP = formatdata.brands[pickupbrand.brandGears[i].gear.brand.name].name
      var GearName = langdata.gear[pickupbrand.brandGears[i].gear.__splatoon3ink_id].name
      var GearType = formatdata.GearTypes[pickupbrand.brandGears[i].gear.__typename].name
      if((pickupbrand.brandGears[i].gear.additionalGearPowers).length == 1){
        pickupembeds.push(new Discord.MessageEmbed()
        .setColor(0xff0099)
        .setTitle(GearName)
        .setDescription(pickupbrand.brandGears[i].price.toString() +"ゲソ")
        .setAuthor({ name: 'ピックアップギア', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
        .setThumbnail(pickupbrand.brandGears[i].gear.primaryGearPower.image.url)
        .addFields(
          { name: 'ギアの種類', value: GearType, inline: true },
          { name: 'メインギアパワー', value: MainJP, inline: true },
          { name: '付きやすいギアパワー', value: FavoJP, inline: true },
          { name: '\u200B', value: '\u200B'},
          { name: '追加ギアパワー1', value: '⭕', inline: true },
          { name: '追加ギアパワー2', value: '❌', inline: true },
          { name: '追加ギアパワー3', value: '❌', inline: true },
        )
        .setImage(pickupbrand.brandGears[i].gear.image.url)
        .setTimestamp(pickupbrand.saleEndTime)
        .setFooter({ text: 'ブランド：'+BrandJP, iconURL: pickupbrand.brandGears[i].gear.brand.image.url }))
      }
      if((pickupbrand.brandGears[i].gear.additionalGearPowers).length == 2){
        pickupembeds.push(new Discord.MessageEmbed()
        .setColor(0xff0099)
        .setTitle(GearName)
        .setDescription(pickupbrand.brandGears[i].price.toString() +"ゲソ")
        .setAuthor({ name: 'ピックアップギア', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
        .setThumbnail(pickupbrand.brandGears[i].gear.primaryGearPower.image.url)
        .addFields(
          { name: 'ギアの種類', value: GearType, inline: true },
          { name: 'メインギアパワー', value: MainJP, inline: true },
          { name: '付きやすいギアパワー', value: FavoJP, inline: true },
          { name: '\u200B', value: '\u200B'},
          { name: '追加ギアパワー1', value: '⭕', inline: true },
          { name: '追加ギアパワー2', value: '⭕', inline: true },
          { name: '追加ギアパワー3', value: '❌', inline: true },
        )
        .setImage(pickupbrand.brandGears[i].gear.image.url)
        .setTimestamp(pickupbrand.saleEndTime)
        .setFooter({ text: 'ブランド：'+BrandJP, iconURL: pickupbrand.brandGears[i].gear.brand.image.url }))
      }
      if((pickupbrand.brandGears[i].gear.additionalGearPowers).length == 3){
        pickupembeds.push(new Discord.MessageEmbed()
        .setColor(0xff0099)
        .setTitle(GearName)
        .setDescription(pickupbrand.brandGears[i].price.toString() +"ゲソ")
        .setAuthor({ name: 'ピックアップギア', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
        .setThumbnail(pickupbrand.brandGears[i].gear.primaryGearPower.image.url)
        .addFields(
          { name: 'ギアの種類', value: GearType, inline: true },
          { name: 'メインギアパワー', value: MainJP, inline: true },
          { name: '付きやすいギアパワー', value: FavoJP, inline: true },
          { name: '\u200B', value: '\u200B'},
          { name: '追加ギアパワー1', value: '⭕', inline: true },
          { name: '追加ギアパワー2', value: '⭕', inline: true },
          { name: '追加ギアパワー3', value: '⭕', inline: true },
        )
        .setImage(pickupbrand.brandGears[i].gear.image.url)
        .setTimestamp(pickupbrand.saleEndTime)
        .setFooter({ text: 'ブランド：'+BrandJP, iconURL: pickupbrand.brandGears[i].gear.brand.image.url }))
      }
    }
    //普通のギア
    var limited = gesodata.data.gesotown.limitedGears
    var limitedgearembed = []
    for (let i = 0; i < 6; i++) {
      var MainJP = formatdata.gearPower[limited[i].gear.primaryGearPower.name].name
      var FavoJP = formatdata.brands[limited[i].gear.brand.name].Favored_Ability
      var BrandJP = formatdata.brands[limited[i].gear.brand.name].name
      var GearName = langdata.gear[limited[i].gear.__splatoon3ink_id].name
      var GearType = formatdata.GearTypes[limited[i].gear.__typename].name
      if((limited[i].gear.additionalGearPowers).length == 1){
        limitedgearembed.push(new Discord.MessageEmbed()
        .setColor(0xff0099)
        .setTitle(GearName)
        .setDescription(limited[i].price.toString() +"ゲソ")
        .setAuthor({ name: 'Splatoon3.inkにより出力', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
        .setThumbnail(limited[i].gear.primaryGearPower.image.url)
        .addFields(
          { name: 'ギアの種類', value: GearType, inline: true },
          { name: 'メインギアパワー', value: MainJP, inline: true },
          { name: '付きやすいギアパワー', value: FavoJP, inline: true },
          { name: '\u200B', value: '\u200B'},
          { name: '追加ギアパワー1', value: '⭕', inline: true },
          { name: '追加ギアパワー2', value: '❌', inline: true },
          { name: '追加ギアパワー3', value: '❌', inline: true },
        )
        .setImage(limited[i].gear.image.url)
        .setTimestamp(limited[i].saleEndTime)
        .setFooter({ text: 'ブランド：'+BrandJP, iconURL: limited[i].gear.brand.image.url }))
      }
      if((limited[i].gear.additionalGearPowers).length == 2){
        limitedgearembed.push(new Discord.MessageEmbed()
        .setColor(0xff0099)
        .setTitle(GearName)
        .setDescription(limited[i].price.toString() +"ゲソ")
        .setAuthor({ name: 'Splatoon3.inkにより出力', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
        .setThumbnail(limited[i].gear.primaryGearPower.image.url)
        .addFields(
          { name: 'ギアの種類', value: GearType, inline: true },
          { name: 'メインギアパワー', value: MainJP, inline: true },
          { name: '付きやすいギアパワー', value: FavoJP, inline: true },
          { name: '\u200B', value: '\u200B'},
          { name: '追加ギアパワー1', value: '⭕', inline: true },
          { name: '追加ギアパワー2', value: '⭕', inline: true },
          { name: '追加ギアパワー3', value: '❌', inline: true },
        )
        .setImage(limited[i].gear.image.url)
        .setTimestamp(limited[i].saleEndTime)
        .setFooter({ text: 'ブランド：'+BrandJP, iconURL: limited[i].gear.brand.image.url }))
      }
      if((limited[i].gear.additionalGearPowers).length == 3){
        limitedgearembed.push(new Discord.MessageEmbed()
        .setColor(0xff0099)
        .setTitle(GearName)
        .setDescription(limited[i].price.toString() +"ゲソ")
        .setAuthor({ name: 'Splatoon3.inkにより出力', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
        .setThumbnail(limited[i].gear.primaryGearPower.image.url)
        .addFields(
          { name: 'ギアの種類', value: GearType, inline: true },
          { name: 'メインギアパワー', value: MainJP, inline: true },
          { name: '付きやすいギアパワー', value: FavoJP, inline: true },
          { name: '\u200B', value: '\u200B'},
          { name: '追加ギアパワー1', value: '⭕', inline: true },
          { name: '追加ギアパワー2', value: '⭕', inline: true },
          { name: '追加ギアパワー3', value: '⭕', inline: true },
        )
        .setImage(limited[i].gear.image.url)
        .setTimestamp(limited[i].saleEndTime)
        .setFooter({ text: 'ブランド：'+BrandJP, iconURL: limited[i].gear.brand.image.url }))
      }
    }
    await interaction.reply({embeds: [pickupembeds[0],pickupembeds[1],pickupembeds[2],limitedgearembed[0],limitedgearembed[1],limitedgearembed[2],limitedgearembed[3],limitedgearembed[4],limitedgearembed[5]], ephemeral: true })
  }
  if (interaction.commandName === 'help') {
    const emb= new Discord.MessageEmbed()
      .setDescription('```/help => コレです\n/update => 新しいコマンドが実装された際は各自実行することで使えるようになります。\n/geso => 現在のゲソタウンのギアをすべて表示します。\n/turf {数字} => ナワバリバトルのスケジュールを{数字}先まで表示します\n/series {数字} => バンカラマッチチャレンジのスケジュールを{数字}先まで表示します\n/open {数字} => バンカラマッチオープンのスケジュールを{数字}先まで表示します\n/coop {数字} => サーモンランのスケジュールを{数字}先まで表示します\n\n```')
      .setColor('7b68ee')
      interaction.reply({embeds: [emb], ephemeral: true })
  }
  if (interaction.commandName === 'update'){
    sclient.application.commands.set(interactiondata, interaction.guild.id);
    interaction.reply({content : '追加完了', ephemeral: true })
  }
  if(interaction.commandName === 'turf'){
    var turfSC = stagedata.data.regularSchedules
    var festSC = stagedata.data.festSchedules
    var turfembed = []
    var limit = 5
    //const regular = sclient.emojis.cache.get("1066539179200237579");

    var festcount = 0
    for (let i = 0; i < limit ; i++) {
      if(turfSC.nodes[i].festMatchSetting == null){
        var Stage1JP = langdata.stages[turfSC.nodes[i].regularMatchSetting.vsStages[0].id].name
        var Stage2JP = langdata.stages[turfSC.nodes[i].regularMatchSetting.vsStages[1].id].name
        turfembed.push(new Discord.MessageEmbed()
        .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(i))
        .setColor(0x19d719)
        .setTitle('ナワバリバトル')
        .setAuthor({ name: 'Splatoon3.inkにより出力', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
        .setThumbnail('https://media.discordapp.net/attachments/1065472888985100378/1069820233306603530/regular.png')
        .addFields({ name: '開催時間', value: `${moment(turfSC.nodes[i].startTime).date()}日${moment(turfSC.nodes[i].startTime).hours()}:00～${moment(turfSC.nodes[i].endTime).date()}日${moment(turfSC.nodes[i].endTime).hours()}:00`},
        { name: 'ステージ1', value: Stage1JP, inline: true },
        { name: 'ステージ2', value: Stage2JP, inline: true },
        { name: '\u200B', value: '\u200B'}
        )
        .setImage(turfSC.nodes[i].regularMatchSetting.vsStages[0].image.url)
        )
        turfembed.push(new Discord.MessageEmbed()
        .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(i))
        .setImage(turfSC.nodes[i].regularMatchSetting.vsStages[1].image.url))
      }else{
        festcount++
          var Stage1JP = langdata.stages[festSC.nodes[festcount - 1].festMatchSetting.vsStages[0].id].name
          var Stage2JP = langdata.stages[festSC.nodes[festcount - 1].festMatchSetting.vsStages[1].id].name
          turfembed.push(new Discord.MessageEmbed()
          .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(festcount))
          .setColor(0x19d719)
          .setTitle('フェスマッチ : ナワバリバトル')
          .setAuthor({ name: 'Splatoon3.inkにより出力', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
          .setThumbnail('https://media.discordapp.net/attachments/1065472888985100378/1069820233306603530/regular.png')
          .addFields({ name: '開催時間', value: `${moment(festSC.nodes[i].startTime).date()}日${moment(festSC.nodes[i].startTime).hours()}:00～${moment(festSC.nodes[i].endTime).date()}日${moment(festSC.nodes[i].endTime).hours()}:00`},
          { name: 'ステージ1', value: Stage1JP, inline: true },
          { name: 'ステージ2', value: Stage2JP, inline: true },
          { name: '\u200B', value: '\u200B'}
          )
          .setImage(festSC.nodes[festcount - 1].festMatchSetting.vsStages[0].image.url)
          )
          turfembed.push(new Discord.MessageEmbed()
          .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(festcount))
          .setImage(festSC.nodes[festcount - 1].festMatchSetting.vsStages[1].image.url))
      }
    }
    //フェスなどで取得できないとき
    if(turfembed.length == 0){
      turfembed.push(new Discord.MessageEmbed()
      .setColor(0x19d719)
      .setTitle('現在フェスのためナワバリバトルは行われていません。')
      )
    }
    interaction.reply({embeds: turfembed, ephemeral: true })
  }
  if(interaction.commandName === 'series'){
    var bankarasc =  stagedata.data.bankaraSchedules
    var cembed = []
    var limitc = 5

    for (let i = 0; i < limitc ; i++) {
      if(bankarasc.nodes[i].bankaraMatchSettings !== null){
      var rule = langdata.rules[bankarasc.nodes[i].bankaraMatchSettings[0].vsRule.id].name
      var Stage1JP = langdata.stages[bankarasc.nodes[i].bankaraMatchSettings[0].vsStages[0].id].name
      var Stage2JP = langdata.stages[bankarasc.nodes[i].bankaraMatchSettings[0].vsStages[1].id].name
      if(bankarasc.nodes[i].festMatchSetting == null){
        cembed.push(new Discord.MessageEmbed()
        .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(i))
        .setColor(0xf54910)
        .setTitle(`チャレンジ---${rule}`)
        .setAuthor({ name: 'Splatoon3.inkにより出力', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
        .setThumbnail('https://media.discordapp.net/attachments/1065472888985100378/1069820232912343130/bankara.png')
        .addFields({ name: '開催時間', value: `${moment(bankarasc.nodes[i].startTime).date()}日${moment(bankarasc.nodes[i].startTime).hours()}:00～${moment(bankarasc.nodes[i].endTime).date()}日${moment(bankarasc.nodes[i].endTime).hours()}:00`},
        { name: 'ステージ1', value:  Stage1JP, inline: true },
        { name: 'ステージ2', value:  Stage2JP, inline: true }
        )
        .setImage(bankarasc.nodes[i].bankaraMatchSettings[0].vsStages[0].image.url)
      )
      cembed.push(new Discord.MessageEmbed()
      .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(i))
      .setImage(bankarasc.nodes[i].bankaraMatchSettings[0].vsStages[1].image.url))
      }
    }
    }
    //フェスなどで取得できないとき
    if(cembed.length == 0){
      cembed.push(new Discord.MessageEmbed()
      .setColor(0xf54910)
      .setTitle('現在フェスのためバンカラマッチは行われていません。')
      )
    }
    interaction.reply({embeds: cembed, ephemeral: true })
  }
  if(interaction.commandName === 'open'){
    var bankarasc =  stagedata.data.bankaraSchedules
    var oembed = []
    var limito = 5

    for (let i = 0; i < limito ; i++) {
      if(bankarasc.nodes[i].bankaraMatchSettings !== null){
          var rule = langdata.rules[bankarasc.nodes[i].bankaraMatchSettings[1].vsRule.id].name
          var Stage1JP = langdata.stages[bankarasc.nodes[i].bankaraMatchSettings[1].vsStages[0].id].name
          var Stage2JP = langdata.stages[bankarasc.nodes[i].bankaraMatchSettings[1].vsStages[1].id].name
          if(bankarasc.nodes[i].festMatchSetting == null){
            oembed.push(new Discord.MessageEmbed()
            .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(i))
            .setColor(0xf58310)
            .setTitle(`オープン---${rule}`)
            .setAuthor({ name: 'Splatoon3.inkにより出力', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
            .setThumbnail('https://media.discordapp.net/attachments/1065472888985100378/1069820232912343130/bankara.png')
            .addFields({ name: '開催時間', value: `${moment(bankarasc.nodes[i].startTime).date()}日${moment(bankarasc.nodes[i].startTime).hours()}:00～${moment(bankarasc.nodes[i].endTime).date()}日${moment(bankarasc.nodes[i].endTime).hours()}:00`},
            { name: 'ステージ1', value: Stage1JP, inline: true },
            { name: 'ステージ2', value: Stage2JP, inline: true }
          )
          .setImage(bankarasc.nodes[i].bankaraMatchSettings[1].vsStages[0].image.url)
          )
          oembed.push(new Discord.MessageEmbed()
          .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(i))
          .setImage(bankarasc.nodes[i].bankaraMatchSettings[1].vsStages[1].image.url))
          }

      }
    }
    //フェスなどで取得できないとき
    if(oembed.length == 0){
      oembed.push(new Discord.MessageEmbed()
      .setColor(0xf58310)
      .setTitle('現在フェスのためバンカラマッチは行われていません。')
      )
    }
    interaction.reply({embeds: oembed, ephemeral: true })
  }
  if(interaction.commandName === 'xmatch'){
    var Xsc =  stagedata.data.xSchedules
    var Xembed = []
    var limitX = 5
    
    for (let i = 0; i < limitX ; i++) {
      if(Xsc.nodes[i].xMatchSetting !== null){
          var rule = langdata.rules[Xsc.nodes[i].xMatchSetting.vsRule.id].name
          var Stage1JP = langdata.stages[Xsc.nodes[i].xMatchSetting.vsStages[0].id].name
          var Stage2JP = langdata.stages[Xsc.nodes[i].xMatchSetting.vsStages[1].id].name
          if(Xsc.nodes[i].festMatchSetting == null){
            Xembed.push(new Discord.MessageEmbed()
            .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(i))
            .setColor(0x0fdb9b)
            .setTitle(`Xマッチ---${rule}`)
            .setAuthor({ name: 'Splatoon3.inkにより出力', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
            .setThumbnail('https://media.discordapp.net/attachments/1065472888985100378/1069820233507934258/xmatch.png')
            .addFields({ name: '開催時間', value: `${moment(Xsc.nodes[i].startTime).date()}日${moment(Xsc.nodes[i].startTime).hours()}:00～${moment(Xsc.nodes[i].endTime).date()}日${moment(Xsc.nodes[i].endTime).hours()}:00`},
            { name: 'ステージ1', value: Stage1JP, inline: true },
            { name: 'ステージ2', value: Stage2JP, inline: true }
          )
          .setImage(Xsc.nodes[i].xMatchSetting.vsStages[0].image.url)
          )
          Xembed.push(new Discord.MessageEmbed()
          .setURL('https://discord.com/channels/588336492049465364/588343228063940619/1038374680240861234%index='+String(i))
          .setImage(Xsc.nodes[i].xMatchSetting.vsStages[1].image.url))
          }

      }
    }
    //フェスなどで取得できないとき
    if(Xembed.length == 0){
      Xembed.push(new Discord.MessageEmbed()
      .setColor(0x0fdb9b)
      .setTitle('現在フェスのためXマッチは行われていません。')
      )
    }
    interaction.reply({embeds: Xembed, ephemeral: true })
  }
  if(interaction.commandName === 'coop'){
    var coopsc =  stagedata.data.coopGroupingSchedule.regularSchedules
    var coopembeds = []
    var limitco = 4
    //bigrun
    var bigrunsc =  stagedata.data.coopGroupingSchedule.bigRunSchedules
    var BGi = 0

    for (let i = 0; i < limitco ; i++) {
      function bigrun(){
        var weapon1 = langdata.weapons[bigrunsc.nodes[BGi].setting.weapons[0].__splatoon3ink_id].name
        var weapon2 = langdata.weapons[bigrunsc.nodes[BGi].setting.weapons[1].__splatoon3ink_id].name
        var weapon3 = langdata.weapons[bigrunsc.nodes[BGi].setting.weapons[2].__splatoon3ink_id].name
        var weapon4 = langdata.weapons[bigrunsc.nodes[BGi].setting.weapons[3].__splatoon3ink_id].name
        var stage = langdata.stages[bigrunsc.nodes[BGi].setting.coopStage.id].name
        coopembeds.push(new Discord.MessageEmbed()
      .setColor(0xff5600)
      .setTitle(`${stage}`)
      .setAuthor({ name: 'Splatoon3.inkにより出力', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
      .setThumbnail('https://cdn.discordapp.com/attachments/1065472888985100378/1069818271815192647/salmon.png')
      .addFields({ name: '開催時間', value: `${moment(bigrunsc.nodes[BGi].startTime).date()}日${moment(bigrunsc.nodes[BGi].startTime).hours()}:00～${moment(bigrunsc.nodes[BGi].endTime).date()}日${moment(bigrunsc.nodes[BGi].endTime).hours()}:00`},
      { name: '武器1', value: weapon1, inline: true},
      { name: '武器2', value: weapon2, inline: true},
      { name: '\u200B', value: '\u200B'},
      { name: '武器3', value: weapon3, inline: true},
      { name: '武器4', value: weapon4, inline: true}
      )
      .setImage(bigrunsc.nodes[BGi].setting.coopStage.image.url)
      )
      }
      function normal(){
        var weapon1 = langdata.weapons[coopsc.nodes[i].setting.weapons[0].__splatoon3ink_id].name
        var weapon2 = langdata.weapons[coopsc.nodes[i].setting.weapons[1].__splatoon3ink_id].name
        var weapon3 = langdata.weapons[coopsc.nodes[i].setting.weapons[2].__splatoon3ink_id].name
        var weapon4 = langdata.weapons[coopsc.nodes[i].setting.weapons[3].__splatoon3ink_id].name
        var stage = langdata.stages[coopsc.nodes[i].setting.coopStage.id].name
        coopembeds.push(new Discord.MessageEmbed()
        .setColor(0xff5600)
        .setTitle(`${stage}`)
        .setAuthor({ name: 'Splatoon3.inkにより出力', iconURL: 'https://splatoon3.ink/assets/little-buddy.445c3c88.png', url: 'https://github.com/misenhower/splatoon3.ink' })
        .setThumbnail('https://cdn.discordapp.com/attachments/1065472888985100378/1069818271815192647/salmon.png')
        .addFields({ name: '開催時間', value: `${moment(coopsc.nodes[i].startTime).date()}日${moment(coopsc.nodes[i].startTime).hours()}:00～${moment(coopsc.nodes[i].endTime).date()}日${moment(coopsc.nodes[i].endTime).hours()}:00`},
        { name: '武器1', value: weapon1, inline: true},
        { name: '武器2', value: weapon2, inline: true},
        { name: '\u200B', value: '\u200B'},
        { name: '武器3', value: weapon3, inline: true},
        { name: '武器4', value: weapon4, inline: true}
        )
        .setImage(coopsc.nodes[i].setting.coopStage.image.url)
      )

      }
      if((coopsc.nodes[i+1].startTime !== coopsc.nodes[i].endTime)){
        normal()
        bigrun()
        limitco--
      }else{
        if((moment(coopsc.nodes[i].startTime) > moment()&&i == 0)){
          bigrun()
          normal()
          limitco--
        }else{
          normal()
        }
      }
    }
    interaction.reply({embeds: coopembeds, ephemeral: true })
  }
});
sclient.on('guildDelete', async guild => {
  sclient.user.setActivity(sclient.guilds.cache.size + 'サーバーに参加中｜s3.help', {
   type: 'PLAYING'
 });
})
sclient.login(bottoken);
