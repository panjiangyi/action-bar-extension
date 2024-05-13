import {
	ActionType,
	addListenerFunc,
	EventBase,
	ExtEvents,
	HistoryAction,
} from './def';

export type QueryHistoriesEventType = EventBase<{
	kw: string;
}>;

export type QueryHistoriesEventResponse = HistoryAction[];

export const getAllHistories = async (
	kw: string,
): Promise<QueryHistoriesEventResponse> => {
	const historyItems = await chrome.history.search({
		text: kw,
		maxResults: 9999999,
	});
	return historyItems.map((item) => {
		const favicon = `chrome-extension://${chrome.runtime.id}/_favicon/?pageUrl=${item.url}&size=20`;
		return {
			type: ActionType.history,
			desc: item.url ?? '',
			data: {
				...item,
				favicon,
			},
		};
	});
};
export class QueryHistoriesEvent {
	static name = ActionType.history;

	static inBackground: addListenerFunc = async (
		event: QueryHistoriesEventType,
		sender,
		setResponse: (response: QueryHistoriesEventResponse) => void,
	) => {
		if (event.type !== this.name) return;
		const histories = await getAllHistories(event.payload.kw);
		setResponse(histories);
	};

	static async triggerInContent(kw: string) {
		const result = await chrome.runtime.sendMessage<
			QueryHistoriesEventType,
			QueryHistoriesEventResponse
		>({
			type: this.name,
			payload: {
				kw,
			},
		});
		return result;
	}

	static handler(action: ExtEvents) {
		if (action.type != ActionType.history) return;
		window.open(action.data.url);
	}
}
