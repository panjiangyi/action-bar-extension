import { css } from '@emotion/css';
import { useMemoizedFn } from 'ahooks';
import classNames from 'classnames';
import { forwardRef, useEffect, useRef, useState } from 'react';

import { callActions } from '../events';
import { ExtEvents } from '../events/def';

export const useActionSelection = (
	actions: ExtEvents[],
	doms: (HTMLElement | null)[],
	onEnter: () => void,
) => {
	const isSelecting = useRef(false);
	const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([]);

	const total = actions.length;
	const [selectedIndex, setSelectedIndex] = useState(0);

	const handleKeyDown = useMemoizedFn(async (e: KeyboardEvent) => {
		isSelecting.current = true;
		timeoutIds.current.forEach(clearTimeout);
		timeoutIds.current = [];
		timeoutIds.current.push(
			setTimeout(() => {
				isSelecting.current = false;
			}, 60),
		);

		if (e.key === 'ArrowUp' && selectedIndex > 0) {
			setSelectedIndex((prevIndex) => {
				const index = prevIndex - 1;
				doms[index]?.scrollIntoView({
					block: 'nearest',
					inline: 'nearest',
				});
				return index;
			});
		} else if (e.key === 'ArrowDown' && selectedIndex < total - 1) {
			setSelectedIndex((prevIndex) => {
				const index = prevIndex + 1;
				doms[index]?.scrollIntoView({
					block: 'nearest',
					inline: 'nearest',
				});
				return index;
			});
		} else if (e.key === 'Enter') {
			// 处理 Enter 键事件
			// actions[selectedIndex].onAction();
			const action = actions[selectedIndex];
			await callActions(action);
			onEnter();
		}
	});

	const handleMouseOver = (index: number) => {
		if (isSelecting.current) return;
		setSelectedIndex(index);
	};

	useEffect(() => {
		// 添加键盘事件监听
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			// 清除键盘事件监听
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [selectedIndex, handleKeyDown]);

	return {
		setSelectedIndex(index: number) {
			setSelectedIndex(index);
			doms[index]?.scrollIntoView({
				block: 'nearest',
				inline: 'nearest',
			});
		},
		selectedIndex,
		handleMouseOver,
	};
};
export const Action = forwardRef<
	HTMLDivElement,
	{
		className?: string;
		src?: string;
		icon?: React.ReactNode;
		title: string;
		desc: string;
		selected: boolean;
		onClick: () => void;
		onMouseOver: () => void;
	}
>(
	(
		{ className, onMouseOver, selected, onClick, title, desc, src, icon },
		ref,
	) => {
		return (
			<div
				ref={ref}
				className={classNames(
					'jtw-flex jtw-py-2 jtw-items-start  jtw-px-6 ',
					css`
						border-left: 2px solid transparent !important;
					`,
					{
						[css`
							background: #eff3f9;
							border-left: 2px solid #6068d2 !important;
						`]: selected,
					},
					className,
				)}
				onMouseOver={onMouseOver}
				onClick={onClick}
			>
				<div className=" jtw-mr-[10px]">
					{src ? (
						<img className=" jtw-w-[20px] jtw-h-[20px]" src={src} />
					) : icon ? (
						icon
					) : null}
				</div>
				<div className=" jtw-leading-[20px]">
					<div className=" jtw-text-[14px] jtw-font-medium jtw-truncate jtw-max-w-[460px] ">
						{title}
					</div>
					<div className=" jtw-max-w-[460px] jtw-text-[14px] jtw-mt-[4px] jtw-text-[#929db2] jtw-truncate ">
						{desc}
					</div>
				</div>
				{selected && (
					<div
						className={css`
							margin-left: auto;
							color: #929db2;
							font-size: 12px;
							font-weight: 500;
							align-self: center;
						`}
					>
						Select{' '}
						<span
							className={css`
								margin-left: 0.5em;
								font-size: 13px;
								background-color: #dadeea;
								color: #2b2d41;
								text-align: center;
								height: 20px;
								line-height: 20px;
								min-width: 20px;
								padding-left: 3px;
								padding-right: 3px;
								display: inline-block !important;
								border-radius: 5px;
							`}
						>
							⏎
						</span>
					</div>
				)}
			</div>
		);
	},
);
