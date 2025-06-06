let songs;
let songsListLibrary;
let issongListLibraryVisible = false;
let currentSong = new Audio()
let currentFolder;
let bottomLeftSubContisRemoved = false;
const mainPlayButton = document.querySelector('.main-play-button')
const songName = document.querySelector('.song-name')
const songTime = document.querySelector('.song-time')

//event for click + icon .....remove previous UI add new one UI

const showSongLibButton = document.querySelector(".show-song-lib-button");
showSongLibButton.addEventListener("click", () => {
  //accessing container for changing after click + button
  const topLeftSubCont = document.querySelector(".top-left-sub-container");
  const middleLeftSubCont = document.querySelector(
    ".middle-left-sub-container"
  );
  middleLeftSubCont.style.display = "none";
  if (!bottomLeftSubContisRemoved) {
    const bottomLeftSubCont = document.querySelector(
      ".bottom-left-sub-container"
    );
    bottomLeftSubCont.remove();
    bottomLeftSubContisRemoved = true;
  }
  middleLeftSubCont.style.position = "absolute";
  middleLeftSubCont.style.bottom = "100px";
  if (issongListLibraryVisible) {
    songsListLibrary.remove();
    issongListLibraryVisible = false;
  }
  //new container creation for songlist
  songsListLibrary = document.createElement("div");
  issongListLibraryVisible = true;
  songsListLibrary.classList.add("songsListLibrary");
  songsListLibrary.style.position = "absolute";
  songsListLibrary.style.border = "solid";
  songsListLibrary.style.top = "126px";
  songsListLibrary.style.bottom = "1px";
  songsListLibrary.style.height = "83%";
  songsListLibrary.style.width = "24vw";
  songsListLibrary.style.border = "1px solid";

  topLeftSubCont.appendChild(songsListLibrary);

  const ul = document.createElement("ul");
  songsListLibrary.appendChild(ul);
  ul.style.display = "flex";
  ul.style.flexFlow = "column wrap";


  //call async getSongList function return promise we get song from songs folder
  getSongList(currentFolder)
    .then((response) => {
      return response;
    })
    .then((data) => {
      data.forEach((element) => {
        const li = document.createElement("li");
        li.innerHTML += `
                        <div class="songCard">
                            <img src="nav_assets/musicIcon.svg" alt="" class="invert">
                            <div class="info">
                                <div>${element.replaceAll("%20", " ").split("/")[1]
          }</div>
                                <div>SongArtist</div>
                            </div>
                            <div class="playSong">
                                <div>PlayNow</div>
                                <div>
                                    <img src="nav_assets/playButton.svg" alt="" class="invert">
                                </div>
                            </div>
                        </div>
            `;
        ul.appendChild(li);
      });
      //to get song and event listner for each song for play
      Array.from(document.querySelector('.songsListLibrary>ul').getElementsByTagName('li')).forEach((e) => {
        e.addEventListener('click', () => {
          playMusic(e.querySelector('.info > div').innerHTML)
        })
      })
    });
});

//event for click main play button
//main play buttons events for play and pause prev,next buttons
mainPlayButton.addEventListener('click', () => {
  if (currentSong.paused) {
    currentSong.play()
    mainPlayButton.src = "nav_assets/asset 51.svg"
  }
  else {
    currentSong.pause()
    mainPlayButton.src = "nav_assets/asset 56.svg"
  }
})

async function getSongList() {
  songs = await getSongs(currentFolder);
  return songs;
}


//function for changing seconds into minutes 
function formatAudioTime(currentTime, totalDuration) {
  function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return `${formatTime(currentTime)} / ${formatTime(totalDuration)}`;
}

//function for play track or music in songlist
const playMusic = (track) => {

  currentSong.src = `\songs/` + `${currentFolder}/` + track;

  currentSong.play()
  mainPlayButton.src = "nav_assets/asset 51.svg"


  //songName.innerHTML=track.split("-")[0]
  //event for timeupdate for song time
  currentSong.addEventListener('timeupdate', () => {

    songTime.innerHTML = formatAudioTime(currentSong.currentTime, currentSong.duration)
    document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
  })

}
document.querySelector('.seekBar').addEventListener('click', (e) => {
  //how many percent of seekbar user is clicked
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100

  document.querySelector('.circle').style.left = percent + "%"

  currentSong.currentTime = currentSong.duration * (percent / 100)
})

async function getSongs(folder) {
  let songs = [];
  currentFolder = folder
  const response = await fetch(
    `https://music-listening.vercel.app/${folder}`
  );
  const data = await response.text()
    .then((data) => {
      let div = document.createElement("div");
      div.innerHTML = data;
      let as = div.getElementsByTagName("a");
      Array.from(as).forEach((element) => {
        if (element.href.endsWith(".m4a")) {
          songs.push(element.href.split("songs/")[1]);
        }
      });
    })
    .catch((error) => {
      console.log("error: ", error);
    })
    .finally(() => {
      console.log("fetch process execute is done");
    });
  return songs;
}

//event for hamburger button in tablets and mobiles
document.querySelector('.hamburger-img').addEventListener('click', () => {
  document.querySelector('.left-sub-container').style.display = "block"
  document.querySelector('.down-sub-container').style.width = "75%"
  document.querySelector('.down-sub-container').style.left = "25%"
  document.querySelector('.bottom-left-sub-container').style.display = "none"

})
document.querySelector('.privous-button').addEventListener('click', () => {

  let currentSongIndex = songs.indexOf(currentSong.src.split("songs/")[1])
  if (currentSongIndex > 0) {
    playMusic(songs[currentSongIndex - 1].replaceAll("%20", " ").split("/")[1])

  }
})
document.querySelector('.next-button').addEventListener('click', () => {
  let currentSongIndex = songs.indexOf(currentSong.src.split("songs/")[1])
  if (currentSongIndex < songs.length - 1) {
    playMusic(songs[currentSongIndex + 1].replaceAll("%20", " ").split("/")[1])
  }
})


//event for volume bar
const volumeBar = document.querySelector(".volume-bar");
volumeBar.addEventListener("input", function () {
  currentSong.volume = volumeBar.value;
});
async function displayAlbums() {
  try {
    // Fetch the directory listing
    const response = await fetch("https://music-listening.vercel.app/");
    const data = await response.text();

    // Parse the response to extract folder names
    let div = document.createElement('div');
    div.innerHTML = data;
    let links = div.getElementsByTagName('a');

    let folders = Array.from(links)
      .map(link => link.href.split('songs/')[1])  // Extract folder names
      .filter(folder => folder); // Remove empty values
      
    let cardsHTML = "";

    // Fetch and generate album cards in parallel
    await Promise.all(folders.map(async (folder) => {
      try {
        let infoResponse = await fetch(`https://music-listening.vercel.app/${folder}/info.json`);
        let info = await infoResponse.json();

        cardsHTML += `
          <div class="card" id="card" data-foldername="${folder}">
            <img src="nav_assets/playButtonSvg.svg" class="playButton" alt="">
            <img src="https://music-listening.vercel.app/${folder}/cover.jpeg" alt="">
            <h4>${info.Artist_Name}</h4>
            <span>${info.Category}</span>
          </div>
        `;
      } catch (error) {
        console.error(`Error fetching info.json for ${folder}:`, error);
        console.log(error);
        
      }
    }));

    // Update the cards container in one go
    document.querySelector('.cards').innerHTML = cardsHTML;

  } catch (error) {
    console.error("Error fetching albums:", error);
  }
  document.querySelectorAll('.card').forEach((e)=>{
    
    e.addEventListener('click',()=>{
      currentFolder=e.dataset.foldername;
      showSongLibButton.click()
    })
  })
  
}
  
window.onload = () => {
  displayAlbums();
};

//event for search bar inputs
document.querySelector('.search-input').addEventListener('keydown',(e)=>{
  if(e.key==='Enter')
  {
    const input=e.target.value;
    matchInput(input)
    async function matchInput()
    {
      const response=await fetch('https://music-listening.vercel.app/')
      const data=await response.text()
      let div=document.createElement('div')
      div.innerHTML=data
      let as=div.getElementsByTagName('a')
      let folders=Array.from(as)
      .map(e=>e.href.split('songs/')[1])
      .filter(e=>e)
      let result=folders.filter(e=>e.toLowerCase().includes(input.toLowerCase()))
      console.log('result after pressed downkey: ',result);
      
      cards=document.querySelector('.cards')
      Array.from(cards.children)
      .map((card)=>{
        result.forEach((item)=>{
          if(card.dataset.foldername.includes(item))
          {
            console.log('selected foldername: ',card.dataset.foldername);
            searchAlbumDisplay(card.dataset.foldername)
          }
        })
      })
    }
  }
})

//fun for selected albums show up
async function searchAlbumDisplay(folder)
{
  console.log('folder passing from upper: ',folder);
  
 let folders=[];
 folders.push(folder)
 cards=document.querySelector('.cards')
 cards.innerHTML=''
 await Promise.all(folders.map(async(folder)=>{
  let response=await fetch(`https://music-listening.vercel.app/${folder}/info.json`)
  let info=await response.json()
  cards.innerHTML+=
  `<div class="card" id="card" data-foldername="${folder}">
            <img src="nav_assets/playButtonSvg.svg" class="playButton" alt="">
            <img src="https://music-listening.vercel.app/${folder}/cover.jpeg" alt="">
            <h4>${info.Artist_Name}</h4>
            <span>${info.Category}</span>
          </div>`
          
 }))
}