console.log('background is running');

const getCurrentTab = async () => {
	const queryOptions = { active: true, currentWindow: true };
	const [tab] = await chrome.tabs.query(queryOptions);
	return tab;
};

const getAllHistories = async (kw: string = '') => {
	const historyItems = await chrome.history.search({
		text: kw,
		maxResults: 100,
	});
	return historyItems.map((item) => {
		const favicon = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${item.url}&size=16`;
		return {
			...item,
			favicon,
		};
	});
};
chrome.runtime.onMessage.addListener((request, _, setResponse) => {
	(async () => {
		if (request.type === 'get-history') {
			const dd = await getAllHistories();
			setResponse(dd);
		}
	})();
	return true;
});

// Listen for the open omni shortcut
chrome.commands.onCommand.addListener(async (command) => {
	if (command === 'open-arc') {
		const tab = await getCurrentTab();
		const tabId = tab?.id;
		if (tabId == null) return;
		chrome.tabs.sendMessage(tabId, { request: 'open-arc' });
	}
});
