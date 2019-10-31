<template>
  <section class="w-full h-full mx-auto p-10 bg-gray-900">
    <h2 class="text-4xl font-bold text-center text-gray-300 mb-16">TP-Demo Nuxt-VideoJs</h2>
    <div class="flex flex-wrap">
      <div class="w-full xl:w-2/3 xl:px-3 mb-16 xl:mb-0">
        <video id="tp-video" class="video-js" tabindex="1">
          <p class="vjs-no-js">
            To view this video please enable JavaScript, and consider upgrading to a
            web browser that
            <a
              href="http://videojs.com/html5-video-support/"
              target="_blank"
            >supports HTML5 video</a>
          </p>
        </video>
      </div>
      <div class="w-full xl:w-1/3 xl:px-3">
        <div class="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
          <div class="flex">
            <div>
              <p class="font-bold">Hotkeys</p>
              <p class="text-sm">Space: play/stop</p>
              <p class="text-sm">Arrow Left: skipping - 10s</p>
              <p class="text-sm">Arrow Right: skipping + 10s</p>
              <p class="text-sm">Arrow Up: volume up</p>
              <p class="text-sm">Arrow Down: volume down</p>
              <p class="text-sm">Shift + Arrow Left: previous video</p>
              <p class="text-sm">Shift + Arrow Right: next video</p>
              <p class="text-sm">Key M: on/off volume</p>
              <p class="text-sm">Key C: on/off caption setting</p>
              <p class="text-sm">Key F: on/off fullscreen</p>
              <p class="text-sm">Key S: on/off season setting</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import videojs from "video.js";
require("silvermine-videojs-quality-selector")(videojs);

import seasons from "../data/seasons";

export default {
  data() {
    return {
      player: null,
      currentVideo: {
        seasonIndex: 0,
        videoIndex: 0,
        video: null
      },
      nextVideo: {
        seasonIndex: 0,
        videoIndex: 1,
        video: null
      }
    };
  },
  mounted() {
    this.$nextTick(function() {
      this.init();
    });
  },
  methods: {
    init() {
      let self = this;
      this.setCurrentVideo(0, 0);

      let options = {
        // height: "360",
        fluid: true,
        autoplay: false,
        controls: true,
        preload: "auto",
        controlBar: {
          volumePanel: { inline: false }
        },
        poster: this.currentVideo.video.poster,
        sources: this.currentVideo.video.sources,
        tracks: this.currentVideo.video.tracks,
        userActions: {
          hotkeys: event => {
            switch (event.code) {
              case "Space":
                if (self.player.paused()) {
                  self.player.play();
                } else {
                  self.player.pause();
                }
                break;
              case "ArrowRight":
                if (event.shiftKey) {
                  self.vjsNextVideo();
                } else {
                  self.player.currentTime(self.player.currentTime() + 10);
                }
                break;
              case "ArrowLeft":
                if (event.shiftKey) {
                  self.vjsPreviousVideo();
                } else {
                  self.player.currentTime(self.player.currentTime() - 10);
                }
                break;
              case "ArrowUp":
                self.player.volume(self.player.volume() + 0.05);
                break;
              case "ArrowDown":
                self.player.volume(self.player.volume() - 0.05);
                break;
              case "KeyM":
                if (self.player.muted()) {
                  self.player.muted(false);
                } else {
                  self.player.muted(true);
                }
                break;
              case "KeyC":
                self.vjsSubsCapsClicked();
                break;
              case "KeyF":
                if (self.player.isFullscreen()) {
                  self.player.exitFullscreen();
                } else {
                  self.player.requestFullscreen();
                }
                break;
              case "KeyS":
                self.vjsChaptersClicked();
                break;

              default:
                break;
            }
          }
        }
      };
      var player = videojs("tp-video", options);
      player.ready(function() {
        this.focus();
        console.log("video ready");
      });
      player.on("ended", function() {
        console.log("video ended");
      });
      player.on("play", () => {
        if (
          self.player.controlBar.chaptersButton
            .el()
            .classList.contains("vjs-hidden")
        ) {
          self.player.controlBar.chaptersButton.show();
        }
        self.showSeason(self.currentVideo.seasonIndex);
        console.log("video play");
      });
      player.on("pause", function() {
        console.log("video pause");
      });
      player.on("error", function() {
        console.log("video error");
      });
      player.on("waiting", function() {
        console.log("video waiting");
      });
      player.on("emptied", function() {
        console.log("video emptied");
      });

      player.controlBar.addChild("QualitySelector");
      this.player = player;

      this.addOrUpdateVideoTitle(this.currentVideo.video.name);
      this.addSkipButtons();
      this.addOrUpdateNextButton();
    },
    setCurrentVideo(seasonIndex = 0, videoIndex = 0) {
      this.currentVideo.seasonIndex = seasonIndex;
      this.currentVideo.videoIndex = videoIndex;
      this.currentVideo.video =
        seasons[this.currentVideo.seasonIndex].videos[
          this.currentVideo.videoIndex
        ];

      // update next video
      if (
        videoIndex ===
        seasons[this.currentVideo.seasonIndex].videos.length - 1
      ) {
        if (seasonIndex === seasons.length - 1) {
          this.nextVideo.seasonIndex = 0;
          this.nextVideo.videoIndex = 0;
        } else {
          this.nextVideo.seasonIndex = seasonIndex + 1;
          this.nextVideo.videoIndex = 0;
        }
      } else {
        this.nextVideo.seasonIndex = seasonIndex;
        this.nextVideo.videoIndex = videoIndex + 1;
      }

      this.nextVideo.video =
        seasons[this.nextVideo.seasonIndex].videos[this.nextVideo.videoIndex];
    },
    playVideo(seasonIndex = 0, videoIndex = 0) {
      this.setCurrentVideo(seasonIndex, videoIndex);
      this.addOrUpdateVideoTitle(this.currentVideo.video.name);
      this.addOrUpdateNextButton();
      this.player.src(this.currentVideo.video.sources);
      this.player.play();
    },
    addOrUpdateNextButton() {
      if (document.querySelector(".next-video-block") !== null) {
        document
          .querySelector(".next-video-block-cover")
          .setAttribute(
            "style",
            "background-image:url(" + this.nextVideo.video.poster + ")"
          );
        document.querySelector(
          ".next-video-block-name"
        ).innerText = this.nextVideo.video.name;
        document.querySelector(
          ".next-video-block-description"
        ).innerText = this.nextVideo.video.description;
      } else {
        var nextButton = this.player.controlBar.addChild("button");
        nextButton.addClass("next-video");
        nextButton.setAttribute("title", "Next video");

        nextButton.el().innerHTML +=
          '<div class="next-video-block">' +
          '<span class="next-video-block-title">Next video</span>' +
          '<span class="next-video-block-content">' +
          '<span class="next-video-block-cover" style="background-image:url(' +
          this.nextVideo.video.poster +
          ')"></span>' +
          '<span class="next-video-block-text">' +
          '<span class="next-video-block-name">' +
          this.nextVideo.video.name +
          "</span>" +
          '<span class="next-video-block-description">' +
          this.nextVideo.video.description;
        +"</span>" + "</span>" + "</span>" + "</div>";
        nextButton.on("click", () => {
          this.playVideo(this.nextVideo.seasonIndex, this.nextVideo.videoIndex);
        });
      }
    },
    addOrUpdateVideoTitle(title) {
      let videoTitleEl = document.querySelector("#video-title");

      if (!!!videoTitleEl) {
        videoTitleEl = this.player
          .el()
          .appendChild(document.createElement("span"));
        videoTitleEl.id = "video-title";
      }

      videoTitleEl.textContent = title;
    },
    addSkipButtons() {
      let skipForvardButton = this.player.controlBar.addChild("button");
      this.player.controlBar
        .el()
        .insertBefore(
          skipForvardButton.el(),
          this.player.controlBar.el().firstChild.nextSibling
        );
      skipForvardButton.addClass("skip-forvard");
      skipForvardButton.setAttribute("title", "Skip forvard");
      skipForvardButton.el_.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="clipboard_v62" documentref="IDI_15xylr1u" style=" height: 4.5em; width: 4em; "><defs></defs><g transform="matrix(1 0 0 1 20.4637 21.1995)" class=""><path stroke="white" stroke-width="3.4270233425567604" d="M -18.87236213684082 -3.590014934539795 L -15.035825729370117 3.9342041015625 L -22.688581466674805 7.642200946807861 " transform="matrix(0.986901 -0.161327 0.161327 0.986901 28.096 -19.4831)" class="" fill="none"></path><path d="M 31.202484130859375 26.431718826293945 C 32.353084564208984 29.798948287963867 32.4420166015625 33.539520263671875 31.214237213134766 37.153221130371094 C 28.203319549560547 46.015201568603516 18.41401481628418 50.75841522216797 9.349221229553223 47.747501373291016 C 0.28441911935806274 44.73657989501953 -4.623226642608643 35.11171340942383 -1.6123096942901611 26.249731063842773 C 1.3986061811447144 17.387760162353516 11.187910079956055 12.644540786743164 20.25271224975586 15.65545654296875 L 23.535364151000977 16.745805740356445 " stroke="white" stroke-width="3.4270233425567604" transform="matrix(0.986901 -0.161327 0.161327 0.986901 -19.7215 -27.1337)" class="" fill="none"></path><text font-size="17.135117449101145" font-weight="400" letter-spacing="-0.5140535234730346" fill="#fff" transform="matrix(1 0 0 1 -9 7.5)" class="" height="4" text-anchor="start"><tspan style="white-space: pre;" x="0" dy="0">1</tspan><tspan style="white-space: pre;">0</tspan></text><path stroke="white" stroke-width="3.4270233425567604" d="M -26.258333206176758 -6.043300628662109 L -22.38226890563965 1.3645679950714111 L -30.074556350708008 5.188914775848389 " transform="matrix(0.986901 -0.161327 0.161327 0.986901 28.096 -19.4831)" class="" fill="none"></path></g></svg>';
      skipForvardButton.on("click", () => {
        this.player.currentTime(this.player.currentTime() + 10);
      });

      let skipBackwardButton = this.player.controlBar.addChild("button");
      this.player.controlBar
        .el()
        .insertBefore(skipBackwardButton.el(), skipForvardButton.el());
      skipBackwardButton.addClass("skip-backward");
      skipBackwardButton.setAttribute("title", "Skip backward");
      skipBackwardButton.el_.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="clipboard_v62" documentref="IDI_7xbq6oi" style=" height: 4.5em; width: 4em; "> <defs></defs> <g transform="matrix(1,0,0,1,0,0)" id="content"> <g transform="matrix(1 0 0 1 20.4637 21.1995)" class=""> <path stroke="white" stroke-width="3.450229000484504" d="M 18.976259231567383 2.5876729488372803 L 12.93835735321045 8.625574111938477 L 18.976259231567383 14.663475036621094 " transform="matrix(0.986901 -0.161327 0.161327 0.986901 -28.0094 -19.8442)" class="" fill="none"></path> <path d="M -37.95124816894531 15.522653579711914 C -40.11845397949219 18.40645408630371 -41.40275192260742 21.991607666015625 -41.40275192260742 25.876718521118164 C -41.40275192260742 35.404266357421875 -33.67914581298828 43.12786102294922 -24.151607513427734 43.12786102294922 C -14.624061584472656 43.12786102294922 -6.900459289550781 35.404266357421875 -6.900459289550781 25.876718521118164 C -6.900459289550781 16.34917449951172 -14.624061584472656 8.62557315826416 -24.151607513427734 8.62557315826416 L -27.60183334350586 8.62557315826416 " stroke="white" stroke-width="3.450229000484504" transform="matrix(0.986901 -0.161327 0.161327 0.986901 19.6607 -27.6366)" class="" fill="none"></path> <text font-size="17.135117449101145" font-weight="400" letter-spacing="-0.5140535234730346" fill="#fff" transform="matrix(1 0 0 1 -9 7.5)" class="" height="4" text-anchor="start"><tspan style="white-space: pre;" x="0" dy="0">1</tspan><tspan style="white-space: pre;">0</tspan></text> <path stroke="white" stroke-width="3.450229000484504" d="M 26.739274978637695 2.5876729488372803 L 20.701374053955078 8.50048542022705 L 26.739274978637695 14.663475036621094 " transform="matrix(0.986901 -0.161327 0.161327 0.986901 -28.0094 -19.8442)" class="" fill="none"></path> </g> </g> </svg>';
      skipBackwardButton.on("click", () => {
        this.player.currentTime(this.player.currentTime() - 10);
      });
    },
    showSeason(seasonIndex = 0) {
      let currentSeason = seasons[seasonIndex];
      let listMenu = this.player.controlBar.chaptersButton.menu.el();
      let listMenuInner =
        '<div class="season-cover"></div> <span class="list-menu-item-title"></span><span class="list-menu-arrow arrow-left disabled"></span><span class="list-menu-arrow arrow-right" ></span><ul class="list-menu-ul">';
      for (var i = 0; i < currentSeason.videos.length; i++) {
        listMenuInner +=
          `<li class="list-menu-item" seasonIndex="${seasonIndex}" videoIndex="${i}">` +
          '<div class="list-menu-cover" style="background-image:url(' +
          currentSeason.videos[i].poster +
          ')"><span class="progress-bar" style="width:' +
          currentSeason.videos[i].progress +
          '"></span> </div>' +
          '<div class="list-menu-title">' +
          currentSeason.videos[i].name +
          "</div>" +
          '<div class="list-menu-description">' +
          currentSeason.videos[i].description +
          "</div>" +
          '<div class="list-menu-time">' +
          currentSeason.videos[i].time +
          "</div>" +
          "</li>";
      }
      listMenuInner += "</ul>";
      listMenu.innerHTML = listMenuInner;
      let listMenuTitle = `<span class="list-menu-close-button""></span><select class="season-select-list" seasonId="${seasonIndex}">`;
      for (var i = 0; i < seasons.length; i++) {
        if (i === seasonIndex) {
          listMenuTitle += `<option value="${i}" selected>Season ${i +
            1}</option>`;
        } else {
          listMenuTitle += `<option value="${i}">Season ${i + 1}</option>`;
        }
      }
      listMenuTitle += "</select>";
      let videoListTitle = document.querySelector(
        ".vjs-chapters-button .list-menu-item-title"
      );
      videoListTitle.innerHTML = listMenuTitle;

      document.querySelector(".list-menu-close-button").onclick = () => {
        this.vjsChaptersClicked();
      };
      document.querySelector(".arrow-left").onclick = () => {
        this.vjsScrollSeasonList("left");
      };
      document.querySelector(".arrow-right").onclick = () => {
        this.vjsScrollSeasonList("right");
      };
      document.querySelector(".list-menu-ul").onscroll = () => {
        this.vjsListUlScroll();
      };
      let menuItems = document.querySelectorAll(".list-menu-item");
      for (const menuItem of menuItems) {
        menuItem.onclick = el => {
          this.vjsSelectVideo(el.target.closest(".list-menu-item"));
        };
      }
      document.querySelector(".season-select-list").onchange = () => {
        this.showSeason(
          Number(document.querySelector(".season-select-list").value)
        );
      };
    },
    vjsChaptersClicked() {
      document.querySelector("button.vjs-chapters-button").click();
    },
    vjsSubsCapsClicked() {
      document.querySelector("button.vjs-subs-caps-button").click();
    },
    vjsSelectVideo(el) {
      this.playVideo(
        Number(el.attributes.seasonIndex.value),
        Number(el.attributes.videoIndex.value)
      );
    },
    vjsScrollSeasonList(direction) {
      let videoList = document.querySelector(".list-menu-ul");
      let vidWidth = document.querySelector(".list-menu-item").clientWidth;
      let iterations = 24; //like 24frames per sec
      //for animated movement
      for (var i = 0; i < iterations; i++) {
        setTimeout(function() {
          if (direction == "left") {
            videoList.scrollLeft -= vidWidth / iterations;
          } else if (direction == "right") {
            videoList.scrollLeft += vidWidth / iterations;
          } else {
            console.log("Meh..");
          }
        }, (200 / iterations) * i);
      }
    },
    vjsListUlScroll() {
      let videoList = document.querySelector(".list-menu-ul");
      if (videoList.scrollLeft == 0) {
        document
          .querySelector(".list-menu-arrow.arrow-left")
          .classList.add("disabled");
      } else {
        document
          .querySelector(".list-menu-arrow.arrow-left")
          .classList.remove("disabled");
      }
      if (
        videoList.scrollLeft >=
        videoList.scrollWidth - videoList.clientWidth
      ) {
        document
          .querySelector(".list-menu-arrow.arrow-right")
          .classList.add("disabled");
      } else {
        document
          .querySelector(".list-menu-arrow.arrow-right")
          .classList.remove("disabled");
      }
    },
    vjsNextVideo() {
      let seasonIndex = 0;
      let videoIndex = 0;
      if (
        this.currentVideo.videoIndex >=
        seasons[this.currentVideo.seasonIndex].videos.length - 1
      ) {
        if (this.currentVideo.seasonIndex >= seasons.length - 1) {
          seasonIndex = 0;
          videoIndex = 0;
        } else {
          seasonIndex = this.currentVideo.seasonIndex + 1;
          videoIndex = 0;
        }
      } else {
        seasonIndex = this.currentVideo.seasonIndex;
        videoIndex = this.currentVideo.videoIndex + 1;
      }
      this.playVideo(seasonIndex, videoIndex);
    },
    vjsPreviousVideo() {
      let seasonIndex = 0;
      let videoIndex = 0;
      if (
        this.currentVideo.videoIndex <= 0
      ) {
        if (this.currentVideo.seasonIndex <= 0) {
          seasonIndex = 0;
          videoIndex = 0;
        } else {
          seasonIndex = this.currentVideo.seasonIndex - 1;
          videoIndex = 0;
        }
      } else {
        seasonIndex = this.currentVideo.seasonIndex;
        videoIndex = this.currentVideo.videoIndex - 1;
      }
      this.playVideo(seasonIndex, videoIndex);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
