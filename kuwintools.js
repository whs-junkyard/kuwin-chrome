var KUWINTools = {};
KUWINTools.utils = {};

// Port these.
KUWINTools.utils.xhr = function(type, url, data, cb){
	var xhr = new XMLHttpRequest();
	xhr.open(type, url, true);
	xhr.addEventListener("load", function(){
		if(cb){
			cb({
				success: true,
				resp: xhr.responseText,
				status: xhr.status
			});
		}
	}, false);
	xhr.addEventListener("error", function(){
		if(cb){
			cb({
				success: false,
				resp: xhr.responseText,
				status: xhr.status
			});
		}
	}, false);
	if(data){
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(KUWINTools.utils.build_query(data));
	}else{
		xhr.send();
	}
};
KUWINTools.utils.get = function(url, cb){
	return KUWINTools.utils.xhr("GET", url, null, cb);
};
KUWINTools.utils.post = function(url, postdata, cb){
	return KUWINTools.utils.xhr("POST", url, postdata, cb);
};
KUWINTools.utils.build_query = function(formdata, numeric_prefix, arg_separator){
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Legaev Andrey
  // +   improved by: Michael White (http://getsprink.com)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +    revised by: stag019
  // +   input by: Dreamer
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: MIO_KODUKI (http://mio-koduki.blogspot.com/)
  // %        note 1: If the value is null, key and value is skipped in http_build_query of PHP. But, phpjs is not.
  // -    depends on: urlencode
  // *     example 1: http_build_query({foo: 'bar', php: 'hypertext processor', baz: 'boom', cow: 'milk'}, '', '&amp;');
  // *     returns 1: 'foo=bar&amp;php=hypertext+processor&amp;baz=boom&amp;cow=milk'
  // *     example 2: http_build_query({'php': 'hypertext processor', 0: 'foo', 1: 'bar', 2: 'baz', 3: 'boom', 'cow': 'milk'}, 'myvar_');
  // *     returns 2: 'php=hypertext+processor&myvar_0=foo&myvar_1=bar&myvar_2=baz&myvar_3=boom&cow=milk'
  var value, key, tmp = [],
    that = this;

  var _http_build_query_helper = function (key, val, arg_separator) {
    var k, tmp = [];
    if (val === true) {
      val = "1";
    } else if (val === false) {
      val = "0";
    }
    if (val != null) {
      if(typeof(val) === "object") {
        for (k in val) {
          if (val[k] != null) {
            tmp.push(_http_build_query_helper(key + "[" + k + "]", val[k], arg_separator));
          }
        }
        return tmp.join(arg_separator);
      } else if (typeof(val) !== "function") {
        return encodeURIComponent(key) + "=" + encodeURIComponent(val);
      } else {
        throw new Error('There was an error processing for http_build_query().');
      }
    } else {
      return '';
    }
  };

  if (!arg_separator) {
    arg_separator = "&";
  }
  for (key in formdata) {
    value = formdata[key];
    if (numeric_prefix && !isNaN(key)) {
      key = String(numeric_prefix) + key;
    }
    var query=_http_build_query_helper(key, value, arg_separator);
    if(query !== '') {
      tmp.push(query);
    }
  }

  return tmp.join(arg_separator);
}

// Don't change these
KUWINTools.endpoint = "https://kulogin!.ku.ac.th/mobile.php";
KUWINTools.zones = ["bkn", "kps", "src", "csc", "Guest"];

KUWINTools.utils.get_server = function(){
	// min = 1, max = 12
	return Math.floor(Math.random() * 12)+1;
}
KUWINTools.get_endpoint = function(){
	return KUWINTools.endpoint.replace("!", KUWINTools.utils.get_server());
}
KUWINTools.login = function(user, pass, zone, cb){
	if(typeof zone != "number"){
		zone = KUWINTools.zones.indexOf(zone);
		if(zone == -1){
			return {
				success: false,
				message: "Invalid zone. Valid zones are: "+KUWINTools.zones.join(", ")
			};
		}
	}
	KUWINTools.utils.post(KUWINTools.get_endpoint() + "?action=login", {
		'username': user,
		'password': pass,
		'v': 4,
		'trackme': 'n',
		'zone': zone
	}, function(resp){
		if(!resp.success){
			return cb({
				success: false,
				message: "HTTP Error: "+resp.status+" "+resp.resp
			});
		}
		// parse it
		resp = resp.resp.split("\n");
		if(resp[0] !== "OK"){
			return cb({
				success: false,
				message: resp[0]
			});
		}
		var user = resp[3];
		var sessions = resp.slice(4);
		var outSessions = [];
		sessions.forEach(function(sess){
			var out = {};
			sess = sess.split("\t");
			if(sess.length != 3){
				return;
			}
			out['ip'] = sess[0];
			out['time'] = new Date(sess[1].replace("ICT", "+0700"));
			out['idle'] = sess[2];
			outSessions.push(out);
		});
		cb({
			success: true,
			user: user,
			sessions: outSessions
		});
	});
}