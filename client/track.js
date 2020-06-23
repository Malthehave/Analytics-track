window.SailTrack = class SailTrack {
    constructor(webId) {
        // If no id is passed generate a unique one
        if (!webId) {
            webId = Math.random().toString(36).substr(2, 9);
        }
        this.webId = webId;
        this.currentUrl = window.location.href; // Current url that user is on
        this.deviceInfo = this.getDeviceInfo(); // Object that holds information about users device

        // Save unique user id in a cookie

        this.newPageView() // Send a request on every load
    }

    // getBrowser() {
    //     // Function for getting browser name
    //     // https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator
    //     const userAgentObj = navigator.userAgent;
    //     let currentBrowser;

    //     // The order matters here, and this may report false positives for unlisted browsers.
    //     if (userAgentObj.indexOf("Firefox") > -1) {
    //         currentBrowser = "Mozilla Firefox";
    //         // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
    //     } else if (userAgentObj.indexOf("SamsungBrowser") > -1) {
    //         currentBrowser = "Samsung Internet";
    //         // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
    //     } else if (userAgentObj.indexOf("Opera") > -1 || userAgentObj.indexOf("OPR") > -1) {
    //         currentBrowser = "Opera";
    //         // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
    //     } else if (userAgentObj.indexOf("Trident") > -1) {
    //         currentBrowser = "Microsoft Internet Explorer";
    //         // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
    //     } else if (userAgentObj.indexOf("Edge") > -1) {
    //         currentBrowser = "Microsoft Edge";
    //         // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
    //     } else if (userAgentObj.indexOf("Chrome") > -1) {
    //         currentBrowser = "Google Chrome"; // Or chromium
    //         // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
    //     } else if (userAgentObj.indexOf("Safari") > -1) {
    //         currentBrowser = "Apple Safari";
    //         // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
    //     } else {
    //         currentBrowser = "unknown";
    //     }

    //     return currentBrowser;
    // }

    getDeviceSpecs() {
        // Function that gets information about users device. 
        // Returns OS and Browser
        // https://stackoverflow.com/a/18706818/8691718
        const unknown = '-';

        // Detect browser
        const nVer = navigator.appVersion;
        const nAgt = navigator.userAgent;
        let browser = navigator.appName;
        let version = '' + parseFloat(navigator.appVersion);
        let majorVersion = parseInt(navigator.appVersion, 10);
        let nameOffset, verOffset, ix;
        // Opera
        if ((verOffset = nAgt.indexOf('Opera')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Opera Next
        if ((verOffset = nAgt.indexOf('OPR')) != -1) {
            browser = 'Opera';
            version = nAgt.substring(verOffset + 4);
        }
        // Edge
        else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
            browser = 'Microsoft Edge';
            version = nAgt.substring(verOffset + 5);
        }
        // MSIE
        else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(verOffset + 5);
        }
        // Chrome
        else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
            browser = 'Chrome';
            version = nAgt.substring(verOffset + 7);
        }
        // Safari
        else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
            browser = 'Safari';
            version = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf('Version')) != -1) {
                version = nAgt.substring(verOffset + 8);
            }
        }
        // Firefox
        else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
            browser = 'Firefox';
            version = nAgt.substring(verOffset + 8);
        }
        // MSIE 11+
        else if (nAgt.indexOf('Trident/') != -1) {
            browser = 'Microsoft Internet Explorer';
            version = nAgt.substring(nAgt.indexOf('rv:') + 3);
        }
        // Other browsers
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
            browser = nAgt.substring(nameOffset, verOffset);
            version = nAgt.substring(verOffset + 1);
            if (browser.toLowerCase() == browser.toUpperCase()) {
                browser = navigator.appName;
            }
        }
        // trim the version string
        if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
        if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

        majorVersion = parseInt('' + version, 10);
        if (isNaN(majorVersion)) {
            version = '' + parseFloat(navigator.appVersion);
            majorVersion = parseInt(navigator.appVersion, 10);
        }
        // End of browser detection

        // Detect operating system
        let os = unknown;
        const clientStrings = [
            { s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/ },
            { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
            { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
            { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
            { s: 'Windows Vista', r: /Windows NT 6.0/ },
            { s: 'Windows Server 2003', r: /Windows NT 5.2/ },
            { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
            { s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
            { s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
            { s: 'Windows 98', r: /(Windows 98|Win98)/ },
            { s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
            { s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
            { s: 'Windows CE', r: /Windows CE/ },
            { s: 'Windows 3.11', r: /Win16/ },
            { s: 'Android', r: /Android/ },
            { s: 'Open BSD', r: /OpenBSD/ },
            { s: 'Sun OS', r: /SunOS/ },
            { s: 'Chrome OS', r: /CrOS/ },
            { s: 'Linux', r: /(Linux|X11(?!.*CrOS))/ },
            { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
            { s: 'Mac OS X', r: /Mac OS X/ },
            { s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
            { s: 'QNX', r: /QNX/ },
            { s: 'UNIX', r: /UNIX/ },
            { s: 'BeOS', r: /BeOS/ },
            { s: 'OS/2', r: /OS\/2/ },
            { s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ }
        ];
        for (const id in clientStrings) {
            const cs = clientStrings[id];
            if (cs.r.test(nAgt)) {
                os = cs.s;
                break;
            }
        }

        // OS version is omitted, but can be turned on if uncommented
        // let osVersion = unknown;
        if (/Windows/.test(os)) {
            // osVersion = /Windows (.*)/.exec(os)[1];
            os = 'Windows';
        }

        // switch (os) {
        //     case 'Mac OS X':
        //         osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
        //         break;

        //     case 'Android':
        //         osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
        //         break;

        //     case 'iOS':
        //         osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
        //         osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
        //         break;
        // }
        // End of operating system detection

        // Return all information
        return { browser, os }
    }

    getDeviceInfo() {
        // Functin to get information about device
        // E.g. width, height and user agent
        const { browser, os } = this.getDeviceSpecs()
        return {
            width: screen.width,
            height: screen.height,
            browser,
            os,
            // language: ?
            userTime: new Date(),
        }
    }

    newPageView() {
        // Function for sending information to server on each new page load
        console.log(this.webId)
        console.log(this.deviceInfo)
    }

    sendEvent(eventObj) {
        // Track events by providing...
        console.log(`User: ${this.webId}`)
        console.log(eventObj)
    }
}

// const SailTrack = new SailTrack()

// TrackSession.sendRequest()
// TrackSession.sendEvent({
//     event: "shoe-size",
//     value: 44
// })