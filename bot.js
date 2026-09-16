const SOURCES = [
 // === TRANSFERS & TOP ===
 {url:"https://nitter.poast.org/FabrizioRomano/rss", name:"Fabrizio Romano"},
 {url:"https://nitter.net/FabrizioRomano/rss", name:"Fabrizio Romano"},
 {url:"https://www.transfermarkt.us/rss/news", name:"Transfermarkt"},
 {url:"https://feeds.bbci.co.uk/sport/football/rss.xml", name:"BBC Sport Football"},
 {url:"https://www.skysports.com/rss/12040", name:"Sky Sports Football"},
 {url:"https://www.espn.com/espn/rss/soccer/news", name:"ESPN FC"},
 {url:"https://www.goal.com/en/feeds/news?fmt=rss", name:"Goal"},
 {url:"https://www.theguardian.com/football/rss", name:"The Guardian Football"},
 {url:"https://www.90min.com/feeds/news.rss", name:"90min"},
 {url:"https://www.football365.com/feed", name:"Football365"},
 {url:"https://www.fourfourtwo.com/rss", name:"FourFourTwo"},
 {url:"https://www.caughtoffside.com/feed/", name:"TNT Sports"},
 {url:"https://www.planetfootball.com/feed", name:"Planet Football"},
 {url:"https://www.givemesport.com/feed/", name:"GiveMeSport Football"},
 {url:"https://www.sportbible.com/football/feed", name:"SPORTbible Football"},
 
 // === BANTER & FAN ===
 {url:"https://trollfootball.me/feed", name:"Banter FC"},
 {url:"https://www.footballfancast.com/feed", name:"Fan Banter"},
 {url:"https://www.footballtransferstavern.com/feed/", name:"FanGround"},

 // === AFRICAN ===
 {url:"https://www.completesports.com/feed/", name:"Complete Sports NG"},
 {url:"https://ghanasoccernet.com/feed/", name:"GhanaSoccernet"},
 {url:"https://www.soccerladuma.co.za/rss", name:"Soccer Laduma"},
 {url:"https://www.kick442.com/feed/", name:"Kick442"},
 {url:"https://www.afrik-foot.com/feed", name:"Afrik-Foot"},
 {url:"https://www.cafonline.com/news/rss/", name:"CAF Official"},

 // === OFFICIAL LEAGUES ===
 {url:"https://www.uefa.com/rssfeed/news/", name:"UEFA"},
 {url:"https://www.premierleague.com/en/news/rss", name:"Premier League"},
 {url:"https://www.laliga.com/en-GB/rss", name:"LaLiga"},
 {url:"https://www.bundesliga.com/en/bundesliga/news/rss", name:"Bundesliga"},
 {url:"https://www.legaseriea.it/rss", name:"Serie A"},
 {url:"https://www.ligue1.fr/rss", name:"Ligue 1"}
];

const RSS_API = "https://api.rss2json.com/v1/api.json?rss_url=";
const KEY_NAME="groq_key_football";

function getKey(){let k=localStorage.getItem(KEY_NAME);if(!k){k=prompt("Paste your Groq API Key (gsk_...):");if(k){localStorage.setItem(KEY_NAME,k.trim());}}return k?.trim();}

async function rewriteWithAI(title, src){
 const key=getKey(); if(!key) return title;
 let style = "viral African football banter admin, pidgin, funny, shocking, 20 words max, 2-3 emojis";
 if(src.includes("Fabrizio") || src.includes("Transfermarkt")) style = "FABRIZIO ROMANO breaking transfer style, add 🚨 HERE WE GO, urgent, fee included, 20 words, emojis";
 if(src.includes("Banter") || src.includes("Fan")) style = "troll football banter, savage, funny, mocking, 20 words, emojis";
 if(src.includes("CAF") || src.includes("Afrik") || src.includes("Kick442")) style = "African football pride, pidgin, hype, Naija style, 20 words, emojis";
 try{
  const r=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${key}`},body:JSON.stringify({model:"llama-3.1-8b-instant",messages:[{role:"system",content:style},{role:"user",content:title}],temperature:0.95})});
  const j=await r.json(); return j.choices?.[0]?.message?.content?.replace(/"/g,"")||title;
 }catch(e){return title;}
}

async function getAllRealNews(){
 let all=[];
 for(let src of SOURCES){
  try{
   const res=await fetch(RSS_API+encodeURIComponent(src.url));
   const j=await res.json();
   if(j.items) all=all.concat(j.items.slice(0,2).map(i=>({...i,srcName:src.name})));
  }catch(e){}
 }
 all.sort(()=>Math.random()-0.5);
 return all;
}

function renderPost(text,link,orig,srcName){
 const c=document.getElementById("feed")||document.body;
 const d=document.createElement("div");
 const isFab = srcName.includes("Fabrizio") || srcName.includes("Transfermarkt");
 const color = isFab ? "#ffeb00" : srcName.includes("CAF")||srcName.includes("Afrik") ? "#00ff00" : srcName.includes("Banter")||srcName.includes("Fan") ? "#ff00ff" : "#00ff88";
 d.style.cssText=`background:#111;color:#fff;padding:18px;margin:12px;border-radius:14px;font-family:Arial;border-left:5px solid ${color}`;
 d.innerHTML=`<div style="font-size:11px;color:${color};font-weight:bold;margin-bottom:6px">${isFab?"🚨 ":""}${srcName.toUpperCase()}</div><div style="font-size:18px;font-weight:bold;line-height:1.3">${text}</div><div style="opacity:.35;font-size:11px;margin-top:6px">${orig}</div><div style="opacity:.6;font-size:12px;margin-top:8px">${new Date().toLocaleString()} • <a href="${link}" target="_blank" style="color:${color}">View Source</a></div>`;
 c.prepend(d);
}

async function makePost(){
 const all=await getAllRealNews();
 if(!all.length){renderPost("⚽ Scanning 30 sources... no fresh now 🔥","#","","Scanner");return;}
 const news=all[Math.floor(Math.random()*Math.min(10,all.length))];
 const finalText=await rewriteWithAI(news.title, news.srcName);
 renderPost(finalText,news.link,news.title,news.srcName);
}

function start(){makePost(); setInterval(makePost, 3600000); setInterval(makePost, 7200000);}
start();
