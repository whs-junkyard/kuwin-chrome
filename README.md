# KUWINTools for Chrome
Unofficial autologin tool for KUWIN, Kasetsart University

## How it work
I reverse engineered KUWINTools for Android, the official application. The protocol used in KUWINTools does not require CAPTCHA.

## How I did it
I used [dex2jar](https://code.google.com/p/dex2jar/) to convert KUWINTools.apk to jar and [jdgui](http://java.decompiler.free.fr/?q=jdgui) to convert the jar to Java source. However, there seems to be a server-side protection that won't allow me to just `curl` data in as it would trigger the protection.

I used `jar2jasmine` in the dex2jar suite to convert the apk to Jasmine format and the modified the endpoint to be my own server as I cannot eavesdrop SSL. Then uploaded the application to my phone and run it. It seems that the `User-Agent` header is missing from the request so I try `curl` again with User-Agent overrided and that seems to be the trick.

The response format was obtained by reading the Java source. However some lines are still not used and its meaning are unclear.

## Future plans

- Native application to retrieve WiFi BSSID and SSID. Warn if connecting to non-WPA SSID and guide to use KUWIN-WPA. Report the SSID to server to get geolocation.
- The above point, but in NPAPI extension. (I'm not experienced in mixing ObjC with C code, can anyone send me a patch?)
- Quota status. Quota warning when reached a set point.
- Login warning when logged in from other location
- Better settings page
- Would it be possible that the browser button auto hide when it is outside of KUWIN? Maybe detecting for timeout reaching login server as the login server is not accessible outside of KU.

# Dump
    curl -v https://login2.ku.ac.th/mobile.php\?action\=login -H 'User-Agent:' -d username= -d password= -d v=4 -d trackme=n -d zone=0

    OK
    N/A
    OK
    bkn[username]
    158.108.225.82	Tue Jul 09 08:46:17 ICT 2013	0
    158.108.226.92/2001:3c8:1303:1164:cd1c:39e:efb0:88c	Tue Jul 09 12:20:12 ICT 2013	0
    2001:3c8:1303:1164:cd1c:39e:efb0:88c	Tue Jul 09 12:26:59 ICT 2013	0

    https://login2.ku.ac.th/v2/keepalive.php?user=bkn[username]
    Seems that querying must be made to the same login server only.

    IPv4/6 fix?