import Component from '../component/component';
import Popover from './../popover/popover';

const SELECTOR_COMPONENT = '.aui-audioplayer';

export default class Audioplayer extends Component {

  /**
   * Upgrades all Audioplayer components.
   * @returns {Array} Returns an array of all newly upgraded components.
   */
  static upgradeElements() {
    let components = [];
    Array.from(document.querySelectorAll(SELECTOR_COMPONENT)).forEach(element => {
      if (!Component.isElementUpgraded(element)) {
        components.push(new Audioplayer(element));
      }
    });
    return components;
  };

  formatCurrentTime(currentTime) {
    return `${('0' + Math.floor(currentTime % 3600 / 60)).slice(-2)}:${('0' + Math.floor(currentTime % 3600 % 60)).slice(-2)}`;
  }

  init() {
    super.init();
    this.currentTrack = 0;
    this.scrobble = false;
    this.embed = this.element.querySelector('.aui-audioplayer__embed');
    this.embed.preload = true;
    this.tracks = JSON.parse(this.element.querySelector('.aui-audioplayer__tracks').value);
    this.embed.addEventListener('ended', (event) => {
      this.cancelProgress();
      if (this.tracks.length > 1) {
        this.next();
      } else {
        this.pause();
        this.element.classList.add('has-ended');
      }
      this.updateProgress();
    });
    this.embed.addEventListener('canplay', (event) => {
      this.element.querySelector('.aui-audioplayer__time').innerHTML = this.formatCurrentTime(this.embed.duration);
    });
    this.embed.addEventListener('timeupdate', (event) => {
      this.element.querySelector('.aui-audioplayer__time').innerHTML = this.formatCurrentTime(this.embed.currentTime);
    });
    let play = this.element.querySelector('.aui-audioplayer__play');
    if (play) {
      play.addEventListener('click', (event) => {
        if (this.isPlaying()) {
          this.pause();
        } else {
          this.play();
        }
      });
    }
    let mute = this.element.querySelector('.aui-audioplayer__mute');
    if (mute) {
      mute.addEventListener('click', (event) => {
        if (this.isMuted()) {
          this.unmute();
        } else {
          this.mute();
        }
      });
    }
    let next = this.element.querySelector('.aui-audioplayer__next');
    if (next) {
      next.addEventListener('click', (event) => {
        this.next();
      });
    }
    let previous = this.element.querySelector('.aui-audioplayer__previous');
    if (previous) {
      previous.addEventListener('click', (event) => {
        this.previous();
      });
    }
    window.setTimeout(() => {
      this.slider = this.element.querySelector('.aui-slider__target').noUiSlider;
      this.slider.on('start', () => {
        this.scrobble = true;
      });
      this.slider.on('end', () => {
        this.scrobble = false;
      });
      this.slider.on('change', (value) => {
        this.embed.currentTime = ((Math.abs(value) * this.embed.duration) / 100);
      });
    }, 400);
  }

  isMuted() {
    return this.embed.muted;
  }

  isPlaying() {
    return !this.embed.paused;
  }

  mute() {
    this.element.classList.add('is-mute');
    this.embed.muted = true;
  }

  next() {
    if (this.tracks.length > 1) {
      let restartPlayback = this.isPlaying();
      this.pause();

      if (this.currentTrack >= this.tracks.length - 1) {
        this.currentTrack = 0;
      } else {
        this.currentTrack = this.currentTrack + 1;
      }
      this.embed.src = this.tracks[this.currentTrack].src;
      this.embed.load();
      this.slider.set(0);
      this.element.querySelector('.aui-audioplayer__time').innerHTML = this.formatCurrentTime(this.embed.duration);
      if (restartPlayback) this.play();

      this.element.querySelector('.aui-audioplayer__time').innerHTML = '00:00';
      this.element.querySelector('.aui-audioplayer__title').innerHTML = this.tracks[this.currentTrack].title;
      let cover = this.element.querySelector('.aui-audioplayer__cover');
      if (cover) {
        cover.querySelector('.aui-audioplayer__cover-image').setAttribute('src', this.tracks[this.currentTrack].cover);
      }
    }
  }

  pause() {
    this.cancelProgress();
    this.element.classList.remove('is-playing');
    this.embed.pause();
  }

  play() {
    this.updateProgress();
    this.element.classList.add('is-playing');
    this.element.classList.remove('has-ended');
    this.embed.play();
  }

  previous() {
    if (this.tracks.length > 1) {
      let restartPlayback = this.isPlaying();
      this.pause();

      if (this.currentTrack === 0) {
        this.currentTrack = this.tracks.length - 1;
      } else {
        this.currentTrack = this.currentTrack - 1;
      }
      this.embed.src = this.tracks[this.currentTrack].src;
      this.embed.load();
      this.slider.set(0);
      this.element.querySelector('.aui-audioplayer__time').innerHTML = this.formatCurrentTime(this.embed.duration);
      if (restartPlayback) this.play();

      this.element.querySelector('.aui-audioplayer__time').innerHTML = '00:00';
      this.element.querySelector('.aui-audioplayer__title').innerHTML = this.tracks[this.currentTrack].title;
      let cover = this.element.querySelector('.aui-audioplayer__cover');
      if (cover) {
        cover.querySelector('.aui-audioplayer__cover-image').setAttribute('src', this.tracks[this.currentTrack].cover);
      }
    }
  }

  unmute() {
    this.element.classList.remove('is-mute');
    this.embed.muted = false;
  }

  cancelProgress() {
    if (this.tick) {
      window.cancelAnimationFrame(this.tick);
      this.tick = undefined;
    }
  }

  updateProgress() {
    this.tick = window.requestAnimationFrame(() => {
      if(!this.scrobble) this.slider.set(Math.abs((this.embed.currentTime * 100) / this.embed.duration));
      this.updateProgress();
    });
  }

}
