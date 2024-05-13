import Fuse from 'fuse.js';

import {
	ActionType,
	addListenerFunc,
	EventBase,
	ExtEvents,
	SpecialAction,
} from './def';
import { getAllHistories } from './query-histories';
type EventType = EventBase<{
	keyword: string;
}>;

export class ClearHistory {
	static name = ActionType.clearHistory;
	static cmd = 'clear';

	static inBackground: addListenerFunc = async (event: EventType) => {
		if (event.type !== this.name) return;
		// chrome.history.addUrl
		const allHistories = await getAllHistories();
		const keyword = event.payload.keyword
			.replace(`/${this.cmd}`, '')
			.trim();
		if (keyword == '') {
			console.log('fake clear all !');
			return;
		}

		const fuseOptions = {
			includeScore: true,
			includeMatches: true,

			keys: ['data.title', 'data.keyword'],
		};
		const ww = new Fuse(allHistories, fuseOptions)
			.search(keyword)
			.map((k) => k.item);
		ww.map((item) => item.data.url).forEach((url) => {
			if (url == null) return;
			chrome.history.deleteUrl({ url });
		});
	};

	static async triggerInContent(keyword: string) {
		await chrome.runtime.sendMessage<EventType, null>({
			type: this.name,
			payload: {
				keyword,
			},
		});
	}

	/**
	 * create special action
	 * @param keyword
	 * @returns
	 */
	static formAction(keyword: string): SpecialAction | null {
		if (!keyword.startsWith(`/${this.cmd}`)) {
			return null;
		}
		return {
			type: ActionType.clearHistory,
			icon: '⛰',
			desc: 'Clear all browser history',
			data: {
				keyword,
			},
		};
	}

	static async handler(action: ExtEvents) {
		if (action.type !== ActionType.clearHistory) return;
		await this.triggerInContent(action.data.keyword);
	}
}
