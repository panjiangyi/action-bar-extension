export type addListenerFunc = Parameters<
	typeof chrome.runtime.onMessage.addListener
>[0];

export type EventBase<D> = {
	type: string;
	payload: D;
};

export type ActionBase<T extends string, D> = {
	type: T;
	data: D;
};

export type HistoryAction = ActionBase<
	'history',
	chrome.history.HistoryItem & {
		favicon: string;
	}
>;

export type SearchAction = ActionBase<
	'search',
	{
		keyword: string;
	}
>;

export type ExtEvents = HistoryAction | SearchAction;
