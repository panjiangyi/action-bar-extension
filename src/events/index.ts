import { compact } from 'lodash';

import { ClearHistory } from './clear-history';
import { ExtEvents } from './def';
import { QueryHistoriesEvent } from './query-histories';
import { SearchEvent } from './search';

export const formActions = (keyword: string) => {
	return compact([
		ClearHistory.formAction(keyword),
		SearchEvent.formAction(keyword),
	]);
};

export const callActions = (action: ExtEvents) => {
	QueryHistoriesEvent.handler(action);
	SearchEvent.handler(action);
	ClearHistory.handler(action);
};
