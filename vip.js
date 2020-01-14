$( document ).ready(function() {
	const api_file_url = "https://raw.githubusercontent.com/iodefog/VipVideo/master/VipVideo/Helper/vlist.json";

	fetchFromUrl(api_file_url).then(filterApis).then(createApiElements);

	$("#update").click(function () {
		chrome.storage.sync.set({"vip-player-list": "undefined"}, function(){
			fetchFromUrl(api_file_url).then(filterApis).then(createApiElements);
		});
	});


});

const fetchFromUrl = url => {
	return new Promise((resolve, reject) => {
		chrome.storage.sync.get({"vip-player-list": "undefined"}, function (apis) {
			// exists in db => do nothing
			if (apis["vip-player-list"] !== "undefined")
			{
				console.log('fetch from local db');
				resolve(apis["vip-player-list"]);
			}
			// not exist => fetch it
			else
			{
				console.log('fetch from remote site');
				fetch(url).then((response) => response.json()).then(listjson => resolve(listjson['list']));
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
