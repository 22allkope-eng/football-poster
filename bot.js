// FOOTBALL BANTER HUB - 7 POSTS DAILY BOT - Yaounde Time
const postsDB={
 news:["🚨 BREAKING: {team} in talks to sign {player} for €{price}M!","DONE DEAL! {player} joins {team} - Medical tomorrow 👀","BREAKING: {team} sack manager after defeat! Who next?","TRANSFER BOMBSHELL: {player} wants to leave {team} NOW","{team} star injured for 3 months - Big blow 😭","CHAMPIONS LEAGUE DRAW: Group of death confirmed! 🔥"],
 banter:["Man Utd fans after 1 win: 'We're back' 🤣 11th position btw","Arsenal fans: 'This is our year' Every year since 2004 😭","Chelsea spent €1B to be mid-table. Football heritage 🤣","FT: {teamA} {scoreA}-{scoreB} {teamB} - {teamB} fans explain 👇","Liverpool bottle it? From 1st to 5th in 2 weeks 😱","Pep after losing: 'We were not good enough' - No way 🤣","Man City 115 charges and still playing. How? 🤔"],
 stats:["📊 Haaland {goals} goals in {games} games. Better than Ronaldo?","🔥 Saka vs Foden this season - Stats don't lie!","Most chances created: 1. De Bruyne {n} 2. Odegaard {n2} - Best?","Fastest players: Mbappe {speed} km/h - Can anyone catch him?"]
};
const teams=["Arsenal","Man Utd","Chelsea","Liverpool","Man City","Barca","Real Madrid","Bayern","PSG"];
const players=["Mbappe","Haaland","Saka","Bellingham","Salah","Osimhen","Vinicius","Rashford"];
function random(a){return a[Math.floor(Math.random()*a.length)]}
function randNum(mn,mx){return Math.floor(Math.random()*(mx-mn+1))+mn}
function generatePost(type){
 let t=random(postsDB[type]);
 return t.replace("{team}",random(teams)).replace("{teamA}",random(teams)).replace("{teamB}",random(teams)).replace("{player}",random(players)).replace("{price}",randNum(30,150)).replace("{goals}",randNum(5,20)).replace("{games}",randNum(5,10)).replace("{n}",randNum(10,30)).replace("{n2}",randNum(5,20)).replace("{speed}",randNum(34,38)).replace("{scoreA}",randNum(0,4)).replace("{scoreB}",randNum(0,4));
}
const schedule=[{hour:7,type:"news",emoji:"🚨"},{hour:10,type:"banter",emoji:"🤣"},{hour:13,type:"news",emoji:"👀"},{hour:16,type:"stats",emoji:"📊"},{hour:19,type:"banter",emoji:"🔥"},{hour:21,type:"news",emoji:"⚽"},{hour:23,type:"banter",emoji:"😭"}];
function checkAndPost(){
 const now=new Date();const yaoundeHour=(now.getUTCHours()+1)%24;const today=now.toDateString();
 let lastPost=localStorage.getItem('lastPostDay');let postedHours=JSON.parse(localStorage.getItem('postedHours')||'[]');
 if(lastPost!==today) postedHours=[];
 schedule.forEach(slot=>{
  if(yaoundeHour>=slot.hour&&!postedHours.includes(slot.hour)){
   const newPost={ty:slot.type,tg:slot.type.toUpperCase(),tt:generatePost(slot.type),em:slot.emoji,tm:"now",lk:randNum(1,10)+"."+randNum(1,9)+"K",cm:randNum(100,999)+""};
   if(typeof data!=='undefined'){data.unshift(newPost);if(typeof load==='function')load();}
   postedHours.push(slot.hour);localStorage.setItem('postedHours',JSON.stringify(postedHours));localStorage.setItem('lastPostDay',today);
   console.log("BOT POSTED:",newPost.tt);
  }
 });
}
setInterval(checkAndPost,60000);checkAndPost();
console.log("🤖 BANTER BOT ACTIVE");
