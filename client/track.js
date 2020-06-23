window.SailTrack = class SailTrack {
    constructor(webId) {
        // If no id is passed generate a unique one
        if (!webId) {
            webId = Math.random().toString(36).substr(2, 9);
        }
        this.webId = webId;
        this.deviceInfo = this.getDeviceInfo()

        // Save user id in a cookie

        this.newPageView() // Send a request on every load
    }

    getBrowser() {
        // Function for getting browser name
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator
        const userAgentObj = navigator.userAgent;
        let currentBrowser;

        // The order matters here, and this may report false positives for unlisted browsers.
        if (userAgentObj.indexOf("Firefox") > -1) {
            currentBrowser = "Mozilla Firefox";
            // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
        } else if (userAgentObj.indexOf("SamsungBrowser") > -1) {
            currentBrowser = "Samsung Internet";
            // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
        } else if (userAgentObj.indexOf("Opera") > -1 || userAgentObj.indexOf("OPR") > -1) {
            currentBrowser = "Opera";
            // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
        } else if (userAgentObj.indexOf("Trident") > -1) {
            currentBrowser = "Microsoft Internet Explorer";
            // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
        } else if (userAgentObj.indexOf("Edge") > -1) {
            currentBrowser = "Microsoft Edge";
            // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
        } else if (userAgentObj.indexOf("Chrome") > -1) {
            currentBrowser = "Google Chrome"; // Or chromium
            // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
        } else if (userAgentObj.indexOf("Safari") > -1) {
            currentBrowser = "Apple Safari";
            // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
        } else {
            currentBrowser = "unknown";
        }

        return currentBrowser;
    }

    getDeviceInfo() {
        // Functin to get information about device
        // E.g. width, height and user agent
        return {
            width: screen.width,
            height: screen.height,
            currentUrl: window.location.href,
            browser: this.getBrowser(),
            // os: ...,
            // language: 
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