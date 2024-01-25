/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, Transition } from '@headlessui/react';
import { atom, useAtom } from 'jotai';
import { Fragment, useEffect, useState } from 'react';

const dialogOpenAtom = atom(false);

export const App = () => {
	const [isOpen, setIsOpen] = useAtom(dialogOpenAtom);
	const [actions, setActions] = useState<any[]>([]);

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

	useEffect(() => {
		(async () => {
			const d = await chrome.runtime.sendMessage({
				type: 'get-history',
			});
			setActions(d);
		})();
	}, []);

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
							<Dialog.Panel className="jtw-w-[700px] jtw-h-[540px] jtw-transform jtw-overflow-hidden jtw-rounded-2xl jtw-bg-white jtw-p-6 jtw-text-left jtw-align-middle jtw-shadow-xl jtw-transition-all">
								<div className="jtw-h-[40px]">
									<input
										type="text"
										placeholder="Type a command or search"
										className="jtw-block jtw-w-full jtw-px-4 jtw-py-3 jtw-text-gray-900 jtw-border jtw-border-gray-300 jtw-rounded-lg jtw-bg-gray-50 sm:text-md focus:jtw-ring-blue-500 focus:jtw-border-blue-500 dark:jtw-bg-gray-700 dark:jtw-border-gray-600 dark:jtw-placeholder-gray-400 dark:jtw-text-white dark:focus:jtw-ring-blue-500 dark:focus:jtw-border-blue-500"
									/>
								</div>
								<div className="jtw-mt-2 jtw-overflow-auto jtw-h-full ">
									{actions.map((action) => {
										return (
											<div
												key={action.id}
												className="jtw-flex jtw-my-4 jtw-items-center"
												onClick={() => {
													window.open(action.url);
												}}
											>
												<img src={action.favicon} />
												<div>{action.title}</div>
											</div>
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
