chrome.webRequest.onBeforeSendHeaders.addListener(function(details){
	for (var i = 0; i < details.requestHeaders.length; ++i) {
		if (details.requestHeaders[i].name === "User-Agent"){
			details.requestHeaders.splice(i, 1);
			break;
		}
	}
	return {requestHeaders: details.requestHeaders};
}, {urls: ["https://*.ku.ac.th/mobile.php*"]}, ["blocking", "requestHeaders"]);

chrome.webRequest.onHeadersReceived.addListener(function(details){
	for (var i = 0; i < details.responseHeaders.length; ++i) {
		if (details.responseHeaders[i].name === 'Location') {
			if(details.responseHeaders[i].value.match(/^http:\/\/kulogin\.ku\.ac\.th\//)){
				do_login();
			}
			break;
		}
	}
}, {urls: ["<all_urls>"]}, ["responseHeaders"]);

function do_login(cb){
	chrome.storage.sync.get({
		"username": "",
		"zone": 0
	}, function(data){
		if(data.username === ""){
			return;
		}
		chrome.storage.local.get("password", function(pw){
			var notify = new Notification("Logging in");
			KUWINTools.login(data.username, pw.password, data.zone, function(resp){
				notify.close();
				if(resp.success){
					notify = new Notification(resp.user + " logged in");
					localStorage.logged_user = resp.user;
					setTimeout(function(){
						notify.close();
					}, 1000);
				}else{
					new Notification(resp.message);
				}
			});
		});
	});
}