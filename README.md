## noname
A web-based implementation of [Legends of the Three Kingdoms (SanGuoSha)](https://en.wikipedia.org/wiki/Legends_of_the_Three_Kingdoms).

## Live Play
Click [GitHub Pages](https://adeFuLoDgu.github.io/noname) or [Cloudflare Pages](https://adefulodgu-noname.pages.dev) to play directly in your browser. *(Note: A Chromium-based browser is highly recommended for the best experience).*

## Recommended Settings
* **Post-Update Reset:** Please reset the game after any major version update to apply the latest default settings.

![image](https://raw.githubusercontent.com/adeFuLoDgu/noname/master/docs/reset_illustration.jpg)

* **iOS "A problem repeatedly occurred" Error:** If you encounter this error on iOS, go to **Settings > Safari > Advanced > Feature Flags** (or **Experimental Features** on older iOS versions), then disable **"GPU Process: Canvas Rendering"** and **"WebGPU"**. Additionally, lower the in-game performance settings as shown below to disable heavy effects:

![image](https://raw.githubusercontent.com/adeFuLoDgu/noname/master/docs/low_performance_settings_1.png)
![image](https://raw.githubusercontent.com/adeFuLoDgu/noname/master/docs/low_performance_settings_2.png)

## How to Host the Server
* For server hosting instructions, please visit the [Simple Noname Master Server repository](https://github.com/adeFuLoDgu/Simple_Noname_Master_Server).

## Note
* Running this repository locally requires specific dependencies. Please refer to the [official repository](https://github.com/libnoname/noname) for detailed setup instructions.

## Known Issues
* **Firefox Compatibility:** Zoom levels and card scrolling do not function properly in Firefox.
* **Multiplayer Connection:** Multiplayer mode is unavailable on the live play sites due to GitHub/Cloudflare's strict HTTPS enforcement (which blocks insecure WebSockets). To bypass this, you must manually enable mixed content for the live play site in your browser settings.
* **Feature Limitations:** Changing skins and sending emojis are currently unavailable in the live play version.