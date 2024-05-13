export type addListenerFunc = Parameters<
	typeof chrome.runtime.onMessage.addListener
>[0];

export type EventBase<D> = {
	type: ActionType;
	payload: D;
};

export type ActionBase<T extends ActionType, D> = {
	type: T;
	data: D;
	icon?: React.ReactNode;
	desc: string;
};

export enum ActionType {
	history,
	search,
	clearHistory,
}

export type HistoryAction = ActionBase<
	ActionType.history,
	chrome.history.HistoryItem & {
		favicon: string;
	}
>;

export type SearchAction = ActionBase<
	ActionType.search,
	{
		keyword: string;
	}
>;
export type ClearHistory = ActionBase<
	ActionType.clearHistory,
	{
		keyword: string;
	}
>;

export type SpecialAction = SearchAction | ClearHistory;

export type ExtEvents = HistoryAction | SpecialAction;
