
export const PLATFORMS_MAP = {
  'ipad': isIpad,
  'iphone': isIphone,
  'ios': isIOS,
  'android': isAndroid,
  'phablet': isPhablet,
  'tablet': isTablet,
  'cordova': isCordova,
  'capacitor': isCapacitorNative,
  'electron': isElectron,
  'pwa': isPWA,
  'mobile': isMobile,
  'mobileweb': isMobileWeb,
  'desktop': isDesktop,
  'hybrid': isHybrid
};

export type Platforms = keyof typeof PLATFORMS_MAP;

export function getPlatforms(win: any) {
  return setupPlatforms(win);
}

export function isPlatform(win: Window, platform: Platforms) {
  return getPlatforms(win).includes(platform);
}

export function setupPlatforms(win: any) {
  win.Ionic = win.Ionic || {};

  let platforms: string[] | undefined | null = win.Ionic.platforms;
  if (platforms == null) {
    platforms = win.Ionic.platforms = detectPlatforms(win);
    platforms.forEach(p => win.document.documentElement.classList.add(`plt-${p}`));
  }
  return platforms;
}

function isMobileWeb(win: Window): boolean {
  return isMobile(win) && !isHybrid(win);
}

function detectPlatforms(win: Window): string[] {
  return Object.keys(PLATFORMS_MAP).filter(p => (PLATFORMS_MAP as any)[p](win));
}

function isIpad(win: Window) {
  return testUserAgent(win, /iPad/i);
}

function isIphone(win: Window) {
  return testUserAgent(win, /iPhone/i);
}

function isIOS(win: Window) {
  return testUserAgent(win, /iPad|iPhone|iPod/i);
}

function isAndroid(win: Window) {
  return testUserAgent(win, /android|sink/i);
}

function isPhablet(win: Window) {
  const width = win.innerWidth;
  const height = win.innerHeight;
  const smallest = Math.min(width, height);
  const largest = Math.max(width, height);

  return (smallest > 390 && smallest < 520) &&
    (largest > 620 && largest < 800);
}

function isTablet(win: Window) {
  const width = win.innerWidth;
  const height = win.innerHeight;
  const smallest = Math.min(width, height);
  const largest = Math.max(width, height);
  return (smallest > 460 && smallest < 820) &&
    (largest > 780 && largest < 1400);
}

function isMobile(win: Window) {
  return matchMedia(win, '(any-pointer:coarse)');
}

function isDesktop(win: Window) {
  return !isMobile(win);
}

function isHybrid(win: Window) {
  return isCordova(win) || isCapacitorNative(win);
}

function isCordova(win: any): boolean {
  return !!(win['cordova'] || win['phonegap'] || win['PhoneGap']);
}

function isCapacitorNative(win: any): boolean {
  const capacitor = win['Capacitor'];
  return !!(capacitor && capacitor.isNative);
}

function isElectron(win: Window): boolean {
  return testUserAgent(win, /electron/);
}

function isPWA(win: Window): boolean {
  return win.matchMedia('(display-mode: standalone)').matches || (win.navigator as any).standalone;
}

export function testUserAgent(win: Window, expr: RegExp) {
  return expr.test(win.navigator.userAgent);
}

function matchMedia(win: any, query: string): boolean {
  return win.matchMedia ? win.matchMedia(query).matches : false;
}
