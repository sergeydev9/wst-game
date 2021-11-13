import { Disclosure } from '@headlessui/react';
import { FaAngleRight } from '@react-icons/all-files/fa/FaAngleRight';
import Box from '../containers/box/Box';

export interface FaqProps {
  question: string;
}

// DM:  investigate implementing `focus-visible` at some point in the future
//      since we might not want the focus state visble on click.
// REF: https://tailwindcss.com/docs/hover-focus-and-other-states#focus-visible

const FaqItem: React.FC<FaqProps> = ({ question, children }) => {
  return (
    <Box
      boxstyle="white"
      className="select-none focus-within:ring-4 focus-within:ring-pink-base"
    >
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex items-center justify-between p-6 w-full focus:outline-none">
              <span className="font-bold text-xl text-left">{question}</span>
              <FaAngleRight
                className={`text-3xl bg-no-repeat ml-5 ${
                  open
                    ? 'transition duration-100 transform rotate-90'
                    : 'transition duration-100 transform rotate-0'
                } hover:text-basic-gray motion-reduce:transition-none motion-reduce:transform-none`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-6 pb-6 text-left w-full">
              <span className="font-semibold text-base">{children}</span>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </Box>
  );
};

export default FaqItem;
