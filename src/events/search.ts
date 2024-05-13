import {
	ActionType,
	addListenerFunc,
	EventBase,
	ExtEvents,
	SpecialAction,
} from './def';
type SearchEventType = EventBase<{
	keyword: string;
}>;

export class SearchEvent {
	static name = ActionType.search;

	static inBackground: addListenerFunc = async (event: SearchEventType) => {
		if (event.type !== this.name) return;
		chrome.search.query({
			text: event.payload.keyword,
			disposition: 'NEW_TAB',
		});
	};

	static async triggerInContent(keyword: string) {
		await chrome.runtime.sendMessage<SearchEventType, null>({
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
		if (keyword == '') return null;
		if (keyword.startsWith('/')) return null;
		return {
			type: ActionType.search,
			icon: '🔍',
			desc: 'Search for a query',
			data: {
				keyword,
			},
		};
	}

	static async handler(action: ExtEvents) {
		if (action.type !== ActionType.search) return;
		await this.triggerInContent(action.data.keyword);
	}
}
