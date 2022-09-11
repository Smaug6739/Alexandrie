export default class Loader {
  private position = 0;
  private progress = 0;
  private interval: number | NodeJS.Timer | null = null;
  start() {
    this.prepar();
    const appLoader = document.getElementById('app-loader');
    if (!appLoader) throw new Error('Missig app-loader id in document.');
    appLoader.innerHTML =
      '<div id="nprogress"><div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div></div>';
    let amount = 0;
    this.interval = setInterval(() => {
      if (this.progress >= 0 && this.progress < 0.2) amount = 0.1;
      else if (this.progress >= 0.2 && this.progress < 0.5) amount = 0.04;
      else if (this.progress >= 0.5 && this.progress < 0.8) amount = 0.02;
      else if (this.progress >= 0.8 && this.progress < 0.99) amount = 0.007;
      else {
        amount = 0;
        if (this.interval) clearInterval(this.interval);
        this.interval = null;
      }
      this.pushBar(amount);
    }, 150);
  }
  stop() {
    this.prepar();
    const barC = document.getElementById('nprogress');
    if (!barC) return;
    barC.getElementsByClassName('bar')[0]!.classList.add('loader-end');
    setTimeout(() => {
      const appLoader = document.getElementById('app-loader');
      if (!appLoader) throw new Error('Missig app-loader id in document.');
      appLoader.innerHTML = '';
    }, 410);
  }
  private pushBar(progress: number) {
    const nprogress = document.getElementById('nprogress');
    if (!nprogress) return;
    const bar = nprogress.getElementsByClassName('bar')[0] as HTMLElement;
    this.position += progress;
    bar.style.width = this.position * 100 + '%';
    this.progress += progress;
  }
  private prepar() {
    this.position = 0;
    this.progress = 0;
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
  }
}
