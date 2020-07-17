window.SailTrack = class SailTrack {
    constructor(options) {
        let { sailId, meta } = options

        // Check if any sailId cookie is already present
        const sailIdCookie = document.cookie?.split('; ')
            .find(row => row.startsWith('sailId'))
            ?.split('=')[1];
        if (sailIdCookie) { // A cookie is present
            // Check if sailId has been passed
            if (sailId) { // A sailId has been passed
                // Check if cookie value is the same as passed sailId
                if (sailIdCookie !== sailId) { // Cookie value and passed sailId are not the same
                    // Update the cookie with the new sailId
                    this.createCookie(sailId)
                }
            } else { // No sailId has been passed
                // Asign value of sailId to value of sailIdCookie
                sailId = sailIdCookie;
            }
        } else { // No cookie present
            // Check if sailId has been passed
            if (sailId) { // A sailId has been passed
                // Create a cookie with the passed sailId
                this.createCookie(sailId)
            } else { // A sailId was not passed
                // Create cookie with a random unique ID
                sailId = Math.random().toString(36).substr(2, 9);
                this.createCookie(sailId)
            }
        }

        this.meta = meta; // Meta data (page categories)
        this.sailId = sailId; // A string uniqie to every user
        this.website = location.hostname; // The root of the url "musaeus.dk"
        this.currentUrl = location.pathname; // Current url that user is on
        this.startTime = new Date();
        this.deviceInfo = this.getDeviceInfo(); // Object that holds information about users device

        // Listen to when the user unloads a page and call the capturePageView function
        window.addEventListener("unload", () => {
            this.capturePageView()
        })
    }

    capturePageView() {
        // Function for sending information to server on each new page load
        navigator.sendBeacon(
            "http://localhost:5000/capture/",
            JSON.stringify(this.getInfoToSend())
        );
        // Update the currentUrl and startTime in case of client side rendering
        this.currentUrl = location.pathname;
        this.startTime = new Date();
    }

    captureEvent(eventObj) {
        // Track events by providing an event object
        // Object provided by user should include:
        // eventCategory: required
        // eventValue: optional
        if (!eventObj) return console.warn("An event object is required");
        if (!eventObj.eventCategory) return console.warn("An eventCategory key is required");
        const { sailId, website, currentUrl } = this.getInfoToSend()
        eventObj.sailId = sailId
        eventObj.website = website
        eventObj.currentUrl = currentUrl
        navigator.sendBeacon(
            "http://localhost:5000/capture/event",
            JSON.stringify(eventObj)
        );
    }

    getInfoToSend() {
        // A helper function
        // Returns an object with the needed information ready to send to server
        return {            
            sailId: this.sailId,
            timeSpent: (new Date() - this.startTime) / 1000,
            website: this.website,
            currentUrl: this.currentUrl,
            deviceInfo: this.deviceInfo,
            meta: this.meta,
        }
    }

    getDeviceInfo() {
        // Functin to get information about device
        // Returns device type, browser and operating system
        // https://stackoverflow.com/a/18706818/8691718
        const unknown = '-';

        // Detect browser
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
            browser = 'Edge';
            version = nAgt.substring(verOffset + 5);
        }
        // MSIE
        else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
            browser = 'Internet Explorer';
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
            browser = 'Internet Explorer';
            version = nAgt.substring(nAgt.indexOf('rv:') + 3);
        }
        // Other browsers
        else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
            // browser = nAgt.substring(nameOffset, verOffset);
            browser = 'Other'
            version = nAgt.substring(verOffset + 1);
            // if (browser.toLowerCase() == browser.toUpperCase()) {
            //     browser = navigator.appName;
            // }
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
            { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
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
        // End of operating system detection

        // Begin find device type
        let deviceType = unknown;
        if (screen.width <= 450) {
            deviceType = 'Mobile';
        } else if (screen.width <= 1100) {
            deviceType = 'Tablet';
        } else if (screen.width > 1101) {
            deviceType = 'Desktop';
        }
        // End device type

        // Return all gatherd information + width and height
        return {
            deviceType,
            browser,
            os,
            // language: ?
        }
    }

    createCookie(cvalue) {
        // Helper function to create a cookie
        // Save unique user id in a cookie
        const CookieExpires = new Date;
        CookieExpires.setFullYear(CookieExpires.getFullYear() + 1); // Expire cookie in one year
        document.cookie = `sailId=${cvalue}; expires=${CookieExpires}; path=/; samesite=strict`;
    }
}

// const SailTrack = new SailTrack()

// SailTrack.sendRequest()
// SailTrack.captureEvent({
//     event: "shoe-size",
//     value: 44
// })