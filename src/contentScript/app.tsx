import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect } from 'react'
import { atom, useAtom } from 'jotai'

const dialogOpenAtom = atom(false)

export const App = () => {
  let [isOpen, setIsOpen] = useAtom(dialogOpenAtom)

  useEffect(() => {
    const listener: Parameters<typeof chrome.runtime.onMessage.addListener>[0] = (
      message,
      sender,
      sendResponse,
    ) => {
      if (message.request == 'open-arc') {
        setIsOpen(!isOpen)
      }
    }
    chrome.runtime.onMessage.addListener(listener)
    return () => chrome.runtime.onMessage.removeListener(listener)
  }, [isOpen])

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="jtw-relative jtw-z-10" onClose={() => setIsOpen(false)}>
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
                <div>
                  <input
                    type="text"
                    placeholder="Type a command or search"
                    className="jtw-block jtw-w-full jtw-px-4 jtw-py-3 jtw-text-gray-900 jtw-border jtw-border-gray-300 jtw-rounded-lg jtw-bg-gray-50 sm:text-md focus:jtw-ring-blue-500 focus:jtw-border-blue-500 dark:jtw-bg-gray-700 dark:jtw-border-gray-600 dark:jtw-placeholder-gray-400 dark:jtw-text-white dark:focus:jtw-ring-blue-500 dark:focus:jtw-border-blue-500"
                  />
                </div>
                <div className="jtw-mt-2">
                  <p className="jtw-text-sm jtw-text-gray-500">
                    Your payment has been successfully submitted. We’ve sent you an email with all
                    of the details of your order.
                  </p>
                </div>

                <div className="jtw-mt-4">
                  <button
                    type="button"
                    className="jtw-inline-flex jtw-justify-center jtw-rounded-md jtw-border jtw-border-transparent jtw-bg-blue-100 jtw-px-4 jtw-py-2 jtw-text-sm jtw-font-medium jtw-text-blue-900 hover:jtw-bg-blue-200 focus:jtw-outline-none focus-visible:jtw-ring-2 focus-visible:jtw-ring-blue-500 focus-visible:jtw-ring-offset-2"
                  >
                    Got it, thanks!
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
