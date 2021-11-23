import { BsInfoCircle } from 'react-icons/bs';
import { Popover } from '@headlessui/react';

const DeckFilterBox: React.FC = ({ children }) => {
  return (
    <div className="bg-purple-subtle-fill rounded-2xl flex flex-col p-6 w-max h-max select-none">
      <Popover className="relative self-center lg:self-auto">
        {({ open }) => (
          <>
            <Popover.Button className="inline-flex items-center lg:absolute lg:-top-1 lg:-right-1">
              <span className="sr-only">Info</span>
              <BsInfoCircle className="text-purple-dark h-8 w-8" />
            </Popover.Button>
            <Popover.Panel className="absolute z-10 w-screen max-w-sm px-4 transform -translate-y-full -translate-x-1/2 left-1/2 -top-4 sm:px-0 lg:max-w-lg">
              <div className="bg-white overflow-hidden p-6 rounded-md shadow-md">
                <div>
                  <span className="font-bold">PG</span> - Not intended for young
                  players
                </div>
                <div>
                  <span className="font-bold">PG13</span> - May not be
                  appropriate for some family members
                </div>
                <div>
                  <span className="font-bold">R</span> - Definitely not
                  appropriate for sensitive or young players
                </div>
                <div>
                  <span className="font-bold">SFW</span> - Safe for Work
                </div>
              </div>
            </Popover.Panel>
          </>
        )}
      </Popover>
      <h2 className="text-center text-xl mb-4 font-black tracking-wide text-basic-black">
        Filter Decks by:
      </h2>
      <div className="flex flex-col sm:flex-row gap-2">{children}</div>
    </div>
  );
};

export default DeckFilterBox;
