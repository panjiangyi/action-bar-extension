import { addListenerFunc, EventBase, ExtEvents, HistoryAction } from './def';

export type QueryHistoriesEventType = EventBase<null>;

export type QueryHistoriesEventResponse = HistoryAction[];
export class QueryHistoriesEvent {
	static name = 'query histories';

	static inBackground: addListenerFunc = async (
		event: QueryHistoriesEventType,
		sender,
		setResponse: (response: QueryHistoriesEventResponse) => void,
	) => {
		const getAllHistories =
			async (): Promise<QueryHistoriesEventResponse> => {
				const historyItems = await chrome.history.search({
					text: '',
					maxResults: 100,
				});
				return historyItems.map((item) => {
					const favicon = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${item.url}&size=20`;
					return {
						type: 'history',

						data: {
							...item,
							favicon,
						},
					};
				});
			};
		if (event.type !== this.name) return;
		const histories = await getAllHistories();
		setResponse(histories);
	};

	static async triggerInContent() {
		const result = await chrome.runtime.sendMessage<
			QueryHistoriesEventType,
			QueryHistoriesEventResponse
		>({
			type: this.name,
			payload: null,
		});
		return result;
	}

	static handler(action: ExtEvents) {
		if (action.type != 'history') return;
		window.open(action.data.url);
	}
}
