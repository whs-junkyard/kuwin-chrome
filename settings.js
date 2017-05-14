$(function(){
	chrome.storage.sync.get({
		"username": "",
		"zone": 0
	}, function(data){
		$("input[name=username]").val(data.username);
		$("input[name=zone]").val(data.zone);
	});
	chrome.storage.local.get("password", function(data){
		$("input[name=password]").val(data.password);
	});

	$("form").submit(function(){
		chrome.storage.sync.set({
			"username": $("input[name=username]").val(),
			"zone": parseInt($("input[name=zone]").val())
		}, function(){
			$("#saved").show();
		});
		chrome.storage.local.set({
			"password": $("input[name=password]").val()
		});
		return false;
	});
});