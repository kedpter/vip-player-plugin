
$( document ).ready(function() {
	const api_file_url = "https://raw.githubusercontent.com/iodefog/VipVideo/master/VipVideo/Helper/vlist.json";

	const default_player_list = {
		"list": [
				{
						"name": "1223-1",
						"url": "http://v.d9y.net/vip/?url="
				},
				{
						"name": "1223-2",
						"url": "http://mimijiexi.top/?url="
				},
				{
						"name": "1223-3",
						"url": "http://55jx.top/?url="
				},
				{
						"name": "1223-4",
						"url": "http://playx.top/?url="
				},
				{
						"name": "1223-5",
						"url": "http://nitian9.com/?url="
				},
				{
						"name": "1223-6",
						"url": "http://19g.top/?url="
				},
				{
						"name": "1223-7",
						"url": "http://52088.online/?url="
				},
				{
						"name": "5月-21",
						"url": "http://jiexi.071811.cc/jx2.php?url="
				},
				{
						"name": "9月-2",
						"url": "http://jqaaa.com/jx.php?url="
				},
				{
						"name": "5月-4",
						"url": "http://beaacc.com/api.php?url="
				}]
			};

	filterApis(default_player_list["list"]).then(createApiElements);
	// fetchFromUrl(api_file_url).then(filterApis).then(createApiElements);

	$("#use_default").click(function () {
		filterApis(default_player_list["list"]).then(createApiElements);
	});

	$("#update").click(function () {
		chrome.storage.sync.set({"vip-player-list": "undefined"}, function(){
			fetchFromUrl(api_file_url).then(filterApis).then(createApiElements);
		});
	});



});

const fetchFromUrl = url => {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get({"vip-player-list": "undefined"}, function (ch_storage) {
			apis = ch_storage["vip-player-list"]
			// exists in db => do nothing
			if (apis !== "undefined")
			{
				console.log('fetch from local db');
				resolve(apis);
			}
			// not exist => fetch it
			else
			{
				// createAutoClosingAlert('更新失败，请检查网络后再尝试')
				// createAutoClosingAlert('更新成功，请点击确定');

				console.log('fetch from remote site');
				fetch(url).then((response) => {
					// createAutoClosingAlert('更新成功，请点击确定');
					$('#status').text("更新成功");
					return response.json();
				}).catch((response) => $('#status').text("更新失败，可能需要翻墙")).then(listjson => resolve(listjson['list']));
			}
		});
	});
};

const save = apis => {
	return new Promise((resolve) => {
		chrome.storage.sync.set({"vip-player-list" : apis}, function () {
			resolve(apis);
		})
	})
};

const createApiElements = apis => {
	return new Promise(resolve => {
		let ul = document.getElementsByTagName("ul")[0];
		// remove childs
		while (ul.firstChild) {
			ul.removeChild(ul.firstChild);
		}
		for (let i in apis) {
			let li = document.createElement("li");
			ul.appendChild(li);
			li.innerHTML = apis[i].name;
			li.setAttribute("data-url", apis[i].url);

			li.onclick = function() {
				chrome.tabs.query({
					active: true,
					currentWindow: true
				}, (tabs) => {
					window.open(this.dataset.url + tabs[0].url);
				});
			};
		}
		save(apis).then(apis => resolve(apis));
	});
};


const filterApis = out => {
	return new Promise(resolve => {
		let apis = out.filter(e => (typeof e['url'] === 'string') && !!e['url']);
		apis = apis.slice(0, 10);
		resolve(apis);
	});
};
