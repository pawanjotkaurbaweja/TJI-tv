const fs = require("fs");
const YAML = require("json-to-pretty-yaml");
const transformAndWriteToFile = require("json-to-frontmatter-markdown");
const { config } = require("./config.json");
const request = require("./await-request");

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

function gen_pages() {
  for (let index = 1; index <= 151; index++) {
    const pokemon = pokedex.en_pokedex[index - 1];
    console.log(pokemon);

    let data = "";

    data += `---\n`;
    data += YAML.stringify(pokemon);
    data += YAML.stringify({
      model: {
        asset: `/pokemon_models/models/${("00" + index).slice(
          -3
        )}/glTF/model.gltf`,
        color: "#FFFFFF",
      },
    });
    data += YAML.stringify({
      header: {
        teaser: pokemonImageSourceFromId(index),
      },
      status: "Kento",

      sidebar: [
        {
          image: pokemonImageSourceFromId(index),
        },
      ],
    });
    data += `\n---`;

    fs.writeFileSync(`../_pokemons/${("00" + index).slice(-3)}.md`, data);
    console.log(data);
  }
}

// gen_pages();

async function getUploadsOfChannel(channelId) {
  console.log("This");
  console.log({ config });

  let ytKey = "AIzaSyDmiCCRro64yTN5MYwgpdIa_kFZfm6tkGY";
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
  fs.writeFileSync(`./recharge_channel.json`, channelDetails);

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
  fs.writeFileSync(`./recharge_uploads.json`, uploadsOfChannel);

  let listOfVideos = [];
  listOfVideos = uploadsOfChannelJSON.items;

  listOfVideos.forEach((episode) => {
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
      category: "Recharge",
      tags: [
          'technology', 'buzz'
      ]
    });
    data += `\n---\n`;
    data += episode.snippet.description,
    fs.writeFileSync(`../_recharge/${(episode.contentDetails.videoId)}.md`, data);
    // console.log(data);
  });
}
console.log({ config });

getUploadsOfChannel("UCiWe-JhZJL3cGpFsZNyU7uA");
