import { addListenerFunc, EventBase, ExtEvents, SearchAction } from './def';
type SearchEventType = EventBase<{
	keyword: string;
}>;

export class SearchEvent {
	static name = 'search';

	static inBackground: addListenerFunc = async (event: SearchEventType) => {
		if (event.type !== this.name) return;
		chrome.search.query({
			text: event.payload.keyword,
			disposition: 'NEW_TAB',
		});
	};

	static async triggerInContent(keyword: string) {
		await chrome.runtime.sendMessage<SearchEvent, null>({
			type: this.name,
			payload: {
				keyword,
			},
		});
	}

	static formAction(keyword: string): SearchAction {
		return {
			type: 'search',
			data: {
				keyword,
			},
		};
	}

	static handler(action: ExtEvents) {
		if (action.type != 'search') return;
		this.triggerInContent(action.data.keyword);
	}
}
