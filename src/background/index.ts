import { ClearHistory } from '../events/clear-history';
import { QueryHistoriesEvent } from '../events/query-histories';
import { SearchEvent } from '../events/search';

console.log('background is running');

const getCurrentTab = async () => {
	const queryOptions = { active: true, currentWindow: true };
	const [tab] = await chrome.tabs.query(queryOptions);
	return tab;
};

chrome.runtime.onMessage.addListener((...params) => {
	(async function start() {
		await Promise.all([QueryHistoriesEvent.inBackground(...params)]);
		await Promise.all([SearchEvent.inBackground(...params)]);
		await Promise.all([ClearHistory.inBackground(...params)]);
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
