const fs = require("fs");
const YAML = require("json-to-pretty-yaml");
const transformAndWriteToFile = require("json-to-frontmatter-markdown");
const { config } = require("./config.json");
const request = require("./await-request");
const moment = require('moment');

const recharge_backup = require('./recharge_uploads.json');

function nameOfPokemonFromId(id) {
  return pokedex.en_pokedex[id - 1].name.english;
}

function numberOfPokemonFromId(id) {
  return ("00" + id).slice(-3);
}

function pokemonImageSourceFromId(id) {
  var base_str = "00000" + id;
  var imageName = numberOfPokemonFromId(id);
  return `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/thumbnails/${imageName}.png`;
}

function createFontMatterFromEpisodeData(episode, slug) {
    let data = "";

    data += `---\n`;
    data += YAML.stringify(episode.snippet);
    
    data += YAML.stringify({
      header: {
        teaser: episode.snippet.thumbnails.medium.url,
      },
      date: episode.contentDetails.videoPublishedAt,    
      image: episode.snippet.thumbnails.high.url,
      optimized_image: episode.snippet.thumbnails.default.url,
      category: slug,
      layout: 'post'
    });
    data += `\n---\n`;
    data += episode.snippet.description;

    return data;
}

async function getUploadsOfChannel(channelId, slug) {
  console.log("This");
  console.log({ config });

  let ytKey = "AIzaSyCxEzKZcVl37q-rBa7_M2ZttgyIJC9talY";
  
  const channelDetails = await request({
    method: "get",
    url: "https://www.googleapis.com/youtube/v3/channels",
    qs: {
      id: channelId,
      key: ytKey,
      part: "snippet,contentDetails,statistics,status",
    },
  });
  // console.log(channelDetails);
  console.log({ channelDetails });
  fs.writeFileSync(`./${slug}_channel.json`, channelDetails);

  let channelDetailsJson = JSON.parse(channelDetails);
  

  let uploadPlaylistID =
    channelDetailsJson.items[0].contentDetails.relatedPlaylists.uploads;
  console.log(uploadPlaylistID);
  /// Next we query for all videos
  //https://www.googleapis.com/youtube/v3/playlistItems?playlistId={"uploads" Id}&key={API key}&part=snippet&maxResults=50

  const uploadsOfChannel = await request({
    method: "get",
    url: "https://www.googleapis.com/youtube/v3/playlistItems",
    qs: {
      playlistId: uploadPlaylistID,
      key: ytKey,
      part: "snippet,contentDetails",
      maxResults: 50,
    },
  });
  let uploadsOfChannelJSON = JSON.parse(uploadsOfChannel);
  fs.writeFileSync(`./${slug}_uploads.json`, uploadsOfChannel);
  // let uploadsOfChannelJSON = recharge_backup;
  // console.log("WARNING: RUNNING WITH OLD DATA");

  let listOfVideos = [];

  listOfVideos = uploadsOfChannelJSON.items;

  listOfVideos.forEach((episode) => {
      
    let data = createFontMatterFromEpisodeData(episode, slug);

    
    fs.writeFileSync(`../_posts/${moment(episode.snippet.publishedAt).format(`YYYY-MM-DD-`)}_${episode.contentDetails.videoId}.md`, data);
    // console.log(data);
  });
}
console.log({ config });

getUploadsOfChannel("UCCKjHsAIxvjtWG8KOcLuG8Q", 'alright'); 
getUploadsOfChannel("UCiWe-JhZJL3cGpFsZNyU7uA", 'recharge'); 
getUploadsOfChannel("UCZTnPAzTvTAaLp7U-BrskOQ", 'hattke'); 
getUploadsOfChannel("UCCOVUkPaT4ZIy6bvx_OO16Q", 'LIT'); 
getUploadsOfChannel("UCDvcxk7hYgNzf4s8lTmM4zg", 'binge'); 
