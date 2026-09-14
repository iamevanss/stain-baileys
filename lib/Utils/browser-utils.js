import { platform, release } from 'os';

const PLATFORM_MAP = {
    aix: 'AIX',
    darwin: 'Mac OS',
    win32: 'Windows',
    android: 'Android',
    freebsd: 'FreeBSD',
    openbsd: 'OpenBSD',
    sunos: 'Solaris',
    linux: 'Linux',
    haiku: undefined,
    cygwin: undefined,
    netbsd: undefined
};

const BROWSER_MAP = {
    safari: 'Safari',
    chrome: 'Chrome',
    edge: 'Edge',
    firefox: 'Firefox',
    opera: 'Opera',
    brave: 'Brave',
    samsung: 'Samsung Internet'
};

const getBrowserN = (bros) => {
    return BROWSER_MAP[bros] || bros;
};

export const Browsers = {
    ubuntu: browser => ['Ubuntu', getBrowserN(browser), '22.04.4'],
    macOS: browser => ['Mac OS', getBrowserN(browser), '14.4.1'],
    baileys: browser => ['Baileys', getBrowserN(browser), '6.5.0'],
    windows: browser => ['Windows', getBrowserN(browser), '10.0.22631'],
    iOS: browser => ['iOS', getBrowserN(browser), '18.2'],
    appropriate: browser => [PLATFORM_MAP[platform()] || 'Ubuntu', getBrowserN(browser), release()]
};

export const getPlatformId = (browser) => {
    const platformType = proto.DeviceProps.PlatformType[browser.toUpperCase()];
    return platformType ? platformType.toString() : '1';
};
