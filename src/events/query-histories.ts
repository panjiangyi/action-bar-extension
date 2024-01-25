import { ActionBase, addListenerFunc, EventBase } from './def';

export type QueryHistoriesEventType = EventBase<{
	kw?: string;
}>;

export type HistoryAction = ActionBase<
	'history',
	chrome.history.HistoryItem & {
		favicon: string;
	}
>;
export type QueryHistoriesEventResponse = HistoryAction[];
export class QueryHistoriesEvent {
	static name = 'query histories';

	static inBackground: addListenerFunc = async (
		event: QueryHistoriesEventType,
		sender,
		setResponse: (response: QueryHistoriesEventResponse) => void,
	) => {
		const getAllHistories = async (
			kw: string = '',
		): Promise<QueryHistoriesEventResponse> => {
			const historyItems = await chrome.history.search({
				text: kw,
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
		const histories = await getAllHistories(event.payload.kw);
		setResponse(histories);
	};

	static async triggerInContent(kw?: string) {
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
}
