console.log('background is running');

const getCurrentTab = async () => {
	const queryOptions = { active: true, currentWindow: true };
	const [tab] = await chrome.tabs.query(queryOptions);
	return tab;
};

chrome.runtime.onMessage.addListener((request) => {
	if (request.type === 'COUNT') {
		console.log(
			'background has received a message from popup, and count is ',
			request?.count,
		);
	}
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
