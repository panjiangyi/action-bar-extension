export type ActionBase<T extends string, D> = {
	type: T;
	data: D;
};

export type EventBase<D> = {
	type: string;
	payload: D;
};

export type addListenerFunc = Parameters<
	typeof chrome.runtime.onMessage.addListener
>[0];
