const http = require("http");
const libmoji = require("libmoji");
const download = require("images-downloader").images;
const port = 3070;
const dest = "./saves";
const requestHandler = (request, response) => {
  console.log(request.url);
  response.end("Hello Node.js Server!");
};

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log("something bad happened", err);
  }

  getComics(1710);
});

async function getComics(i) {
  let images = [];
  let comicIds = [
    "10224703",
    "10214012",
    "10213821",
    "10220310",
    "10220906",
    "10102514",
    "10219619",
    "7201994",
    "8768557",
    "8770505",
    "10219347",
    "10117750",
  ];
  for (let index = 0; index < comicIds.length; index++) {
    let gender = libmoji.genders[libmoji.randInt(2)];
    let avatarId = 270452360 - i + "_2-s1";
    let outfit = libmoji.randOutfit(
      libmoji.getOutfits(libmoji.randBrand(libmoji.getBrands(gender[0])))
    );
    let comicId = comicIds[index];
    let render = libmoji.buildRenderUrl(comicId, avatarId, 1, 2, outfit);
    console.log({ render });

    images.push(render);
  }

  let downloaded = false;
  setTimeout(() => {
    if (!downloaded) {
      getComics(i + 1);
      return;
    }
  }, 30000);

  await download(images, dest)
    .then((result) => {
      console.log("Images downloaded", result);
      console.log(i);
      downloaded = true;
      if (i <= 2000) {
        getComics(i + 1);
      }
    })

    .catch((error) => {
      console.log("downloaded error", error);
    });
}

async function buildAvatar() {
  let images = [];
  for (let index = 0; index < 1; index++) {
    let gender = libmoji.genders[libmoji.randInt(2)];
    let style = libmoji.styles[2];

    ///delete this
    var allTraits = libmoji.getTraits(gender[0], style[0]);
    var hairToneIndex = allTraits.findIndex((x) => x.key == "skin_tone");
    var hairTones = allTraits[hairToneIndex].options;

    console.log({
      style: style[0],
      hairTones,
      length: hairTones.length,
    });
    //--------------------------

    let traits = libmoji.randTraits(libmoji.getTraits(gender[0], style[0]));
    let outfit = libmoji.randOutfit(
      libmoji.getOutfits(libmoji.randBrand(libmoji.getBrands(gender[0])))
    );
    let randomHat = libmoji.randInt(100);
    let randomGlasses = libmoji.randInt(100);
    if (randomHat < 90) {
      var foundIndex = traits.findIndex((x) => x[0] == "hat");

      traits[foundIndex][1] = -1;
    }

    if (randomGlasses < 90) {
      var foundIndex = traits.findIndex((x) => x[0] == "glasses");
      traits[foundIndex][1] = -1;
    }

    for (let index2 = 0; index2 < 3; index2++) {
      //delete this hair
      var foundIndexHairTone = traits.findIndex((x) => x[0] == "skin_tone");
      traits[foundIndexHairTone][1] = hairTones[index2].value;
      //--------------------

      console.log(libmoji.templates);

      let comicId = libmoji.getComicId(libmoji.randTemplate(libmoji.templates));

      let rotation = index2 == 2 ? 7 : index2;
      let avatarUrl = await libmoji.buildPreviewUrl(
        "happy",
        1,
        gender[1],
        style[1],
        rotation,
        traits,
        outfit
      );
      console.log({ preview: avatarUrl });

      let avatarId = libmoji.getAvatarId(
        "https://render.bitstrips.com/v2/cpanel/8968038-99041212832_66-s5-v1.png?transparent=1&palette=1"
      );

      let render = libmoji.buildRenderUrl(comicId, avatarId, 1, 2, outfit);

      console.log({ render });

      images.push(avatarUrl);
    }
  }
  download(images, dest)
    .then((result) => {
      console.log("Images downloaded", result);
    })
    .catch((error) => console.log("downloaded error", error));
}
