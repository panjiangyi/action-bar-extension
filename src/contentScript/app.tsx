/* eslint-disable @typescript-eslint/no-explicit-any */
import { css } from '@emotion/css';
import { Dialog, Transition } from '@headlessui/react';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import { atom, useAtom } from 'jotai';
import { Fragment, useEffect, useRef, useState } from 'react';

import { HistoryAction, QueryHistoriesEvent } from '../events/query-histories';

import { Action, useActionSelection } from './action';

const dialogOpenAtom = atom(false);

const useRefs = () => {
	const refs = useRef<Array<HTMLDivElement | null>>([]);

	return {
		init(total: number) {
			refs.current = new Array(total);
		},
		get current() {
			return refs.current;
		},
	};
};

export const App = () => {
	const [isOpen, setIsOpen] = useAtom(dialogOpenAtom);
	const [actions, setActions] = useState<HistoryAction[]>([]);
	const [kw, setKw] = useState('');
	const refs = useRefs();
	const { selectedIndex, handleMouseOver } = useActionSelection(
		actions,
		refs.current,
	);

	useEffect(() => {
		const listener: Parameters<
			typeof chrome.runtime.onMessage.addListener
		>[0] = (message) => {
			if (message.request == 'open-arc') {
				setIsOpen(!isOpen);
			}
		};
		chrome.runtime.onMessage.addListener(listener);
		return () => chrome.runtime.onMessage.removeListener(listener);
	}, [isOpen, setIsOpen]);

	const query = useMemoizedFn(async () => {
		const d = await QueryHistoriesEvent.triggerInContent();
		setActions(d);
		refs.init(d.length);
	});

	useEffect(() => {
		query();
	}, [query]);

	return (
		<Transition show={isOpen} as={Fragment}>
			<Dialog
				as="div"
				className="jtw-relative jtw-z-10"
				onClose={() => setIsOpen(false)}
			>
				<Transition.Child
					as={Fragment}
					enter="jtw-ease-out jtw-duration-300"
					enterFrom="jtw-opacity-0"
					enterTo="jtw-opacity-100"
					leave="jtw-ease-in jtw-duration-200"
					leaveFrom="jtw-opacity-100"
					leaveTo="jtw-opacity-0"
				>
					<div className="jtw-fixed jtw-inset-0 jtw-bg-black/60" />
				</Transition.Child>

				<div className="jtw-fixed jtw-inset-0 jtw-overflow-y-auto">
					<div className="jtw-flex jtw-min-h-full jtw-items-center jtw-justify-center jtw-p-4 jtw-text-center">
						<Transition.Child
							as={Fragment}
							enter="jtw-ease-out jtw-duration-300"
							enterFrom="jtw-opacity-0 jtw-scale-95"
							enterTo="jtw-opacity-100 jtw-scale-100"
							leave="jtw-ease-in jtw-duration-200"
							leaveFrom="jtw-opacity-100 jtw-scale-100"
							leaveTo="jtw-opacity-0 jtw-scale-95"
						>
							<Dialog.Panel className="jtw-w-[700px] jtw-h-[540px] jtw-transform jtw-overflow-hidden jtw-rounded-xl jtw-bg-[#fafcff]  jtw-text-left jtw-align-middle jtw-shadow-xl jtw-transition-all">
								<div className="jtw-h-[50px]">
									<input
										value={kw}
										type="text"
										placeholder="Type a command or search"
										className="jtw-block jtw-text-[20px] jtw-h-full jtw-w-full jtw-px-4 jtw-py-[5px] jtw-text-gray-900 jtw-outline-none jtw-rounded-lg jtw-bg-gray-50   dark:jtw-bg-gray-700  dark:jtw-placeholder-gray-400 dark:jtw-text-white "
										onChange={async (e) => {
											const value = e.target.value;
											setKw(value);
											await query();
										}}
									/>
								</div>
								<div
									className={classNames(
										'jtw-overflow-auto',
										css`
											height: calc(100% - 50px);
										`,
									)}
								>
									{actions.map((action, i) => {
										return (
											<Action
												ref={(current) =>
													(refs.current[i] = current)
												}
												selected={i == selectedIndex}
												onClick={() => {
													window.open(
														action.data.url,
													);
												}}
												onMouseOver={() => {
													handleMouseOver(i);
												}}
												key={action.data.id}
												icon={action.data.favicon}
												title={action.data.title ?? '-'}
												desc={action.data.url ?? '-'}
											/>
										);
									})}
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};
