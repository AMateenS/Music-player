const container = document.querySelector(".container");
const musicimg = document.querySelector(".music-area .music-image");
const musicname = document.querySelector(".about-music .music-name");
const musicartist = document.querySelector(".about-music .artist-name");
const musicaudio = document.querySelector(".main-audio");
const playpasebtn = document.querySelector(".play-pase");
const nextbtn = document.querySelector("#next");
const prevbtn = document.querySelector("#prev");
const progressarea = document.querySelector(".progress-area");
const progressbar = document.querySelector(".progress-bar");
const musiclist = document.querySelector(".music-playlist");
const moremusicbtn = document.querySelector(".playlist");
const closemusicbtn = document.querySelector(".closelist");

let musicindex = 1;

window.addEventListener('load', () => {
    loadmusic(musicindex);
    playingsong();
});

function loadmusic(indexnum) {
    musicname.innerHTML = musicall[indexnum - 1].name;
    musicartist.innerHTML = musicall[indexnum - 1].artist;
    musicimg.src = `${musicall[indexnum - 1].img}`;
    musicaudio.src = `${musicall[indexnum - 1].src}`;
};
const muimgrot=document.querySelector(".music-image");

function playmusic() {
    muimgrot.classList.add("rotat");
    container.classList.add("paused");
    playpasebtn.querySelector("i").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"  fill="Currentcolor"><path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/></svg>';
    musicaudio.play();
}
function pausemusic() {
    muimgrot.classList.remove("rotat");
    container.classList.remove("paused");
    playpasebtn.querySelector("i").innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"  fill="Currentcolor"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/></svg>';
    musicaudio.pause();
}
function nextmusic() {
    musicindex++;
    musicindex > musicall.length ? musicindex = 1 : musicindex = musicindex;
    loadmusic(musicindex);
    playmusic();
}
function prevmusic() {
    musicindex--;
    musicindex < 1 ? musicindex = musicall.length : musicindex = musicindex;
    loadmusic(musicindex);
    playmusic();
}

playpasebtn.addEventListener('click', () => {
    const isMusicPaused = container.classList.contains("paused");

    isMusicPaused ? pausemusic() : playmusic();
})

nextbtn.addEventListener("click", () => {
    nextmusic();
    playingsong();
});
prevbtn.addEventListener("click", () => {
    prevmusic();
    playingsong();
});

musicaudio.addEventListener("timeupdate", (e) => {
    const currentime = e.target.currentTime;
    const duration = e.target.duration;
    let progresswidth = (currentime / duration) * 100;
    progressbar.style.width = `${progresswidth}%`;

    let musicCurrentime = document.querySelector(".current-time");
    let musicduration = document.querySelector(".max-duration");

    musicaudio.addEventListener("loadeddata", () => {

        let mainadduration = musicaudio.duration;
        let totalmin = Math.floor(mainadduration / 60);
        let totalsec = Math.floor(mainadduration % 60);
        if (totalsec < 10) {
            totalsec = `0${totalsec}`;
        }
        musicduration.innerHTML = `${totalmin}:${totalsec}`;

    });

    let currentmin = Math.floor(currentime / 60);
    let currentsec = Math.floor(currentime % 60);
    if (currentsec < 10) {
        currentsec = `0${currentsec}`;
    }
    musicCurrentime.innerHTML = `${currentmin}:${currentsec}`;

});

progressarea.addEventListener("click", (e) => {
    let progresswidth = progressarea.clientWidth;
    let clickedOffsetX = e.offsetX;
    let songduration = musicaudio.duration;
    musicaudio.currentTime = (clickedOffsetX / progresswidth) * songduration;
    playmusic();
})

var repeatbtn = document.querySelector("#loop");
repeatbtn.addEventListener("click", () => {
    var getText = repeatbtn.innerHTML;
    switch (getText) {
        case 'repeat':
            repeatbtn.innerHTML = 'repeat_one';
            repeatbtn.setAttribute("title", "song looped");
            break;
        case 'repeat_one':
            repeatbtn.innerHTML = 'shuffle';
            repeatbtn.setAttribute("title", "playback shuffled");
            break;
        case 'shuffle':
            repeatbtn.innerHTML = 'repeat';
            repeatbtn.setAttribute("title", "playlist looped");
            break;
    }
})

musicaudio.addEventListener("ended", () => {
    var getText=repeatbtn.innerHTML;
    switch(getText){
        case'repeat':
        nextmusic();
        break;
        case'repeat_one':
        musicaudio.currentime=0;
        loadmusic(musicindex);
        playmusic();
        break;
        case'shuffle':
        let randomindex= Math.floor((Math.random()*musicall.length)+1);
        do{
         randomindex= Math.floor((Math.random()*musicall.length)+1);   
        }while(musicindex==randomindex);
        musicindex=randomindex;
        loadmusic(musicindex);
        playmusic();
        break;
    }
})

moremusicbtn.addEventListener("click",()=>{
    musiclist.style.bottom=0;
    musiclist.style.opacity=1;
});
closemusicbtn.addEventListener("click",()=>{
    musiclist.style.bottom="-55%";
    musiclist.style.opacity=0;
});

const ultag = document.querySelector("ul");

for (let i = 0; i < musicall.length; i++) {
    let litag = `<li li-index="${i+ 1}">
            <div class="row">
                <span>${musicall[i].name}</span>
                <p>${musicall[i].artist}</p>
            </div>
            <audio class="audio-${i}" src="${musicall[i].src}"></audio>
            <span id="duration-${i}">1:23</span>
        </li>`;
    ultag.insertAdjacentHTML("beforeend", litag);

    // Select the newly added elements
    let liaudiodurationtag = ultag.querySelector(`#duration-${i}`);
    let liaudiotag = ultag.querySelector(`.audio-${i}`);

    // Ensure the elements exist before adding the event listener
    if (liaudiotag) {
        liaudiotag.addEventListener("loadeddata", () => {
            let duration = liaudiotag.duration;
            let totalmin = Math.floor(duration / 60);
            let totalsec = Math.floor(duration % 60);
            if (totalsec < 10) {
                totalsec = `0${totalsec}`;
            }
            liaudiodurationtag.innerHTML = `${totalmin}:${totalsec}`;
        });
    }
}

const allitag = ultag.querySelectorAll("li"); // Use querySelectorAll to get all <li> elements

function playingsong() {
    for (let j = 0; j < allitag.length; j++) {
        // Remove the "playing" class from all <li> elements
        allitag[j].classList.remove("playing");

        // Add "playing" class to the current song's <li>
        if (allitag[j].getAttribute("li-index") == musicindex) {
            allitag[j].classList.add("playing");
        }

        // Add an onclick attribute to each <li> for the clicked functionality
        allitag[j].setAttribute("onclick", "clicked(this)");
    }
}

function clicked(element) {
    // Get the li-index of the clicked <li>
    let liindex = element.getAttribute("li-index");
    musicindex = liindex; // Update the current music index

    // Load and play the clicked song
    loadmusic(musicindex);
    playmusic();
}
