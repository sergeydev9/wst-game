import { Disclosure } from '@headlessui/react';
import { Button, Card } from '@whosaidtrue/ui';
import { ReactComponent as Logo } from '../../assets/logo.svg';

export interface GameVersionsProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  onLetsPlayClick: React.MouseEventHandler<HTMLButtonElement>;
}

const GameVersions: React.FC<GameVersionsProps> = ({ onLetsPlayClick }) => {
  return (
    <div className="text-center">
      <h2 className="text-yellow-base text-large-title font-extrabold mb-4">
        Two Versions of the Same Game
      </h2>
      <div className="mb-10">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="text-title-3 text-white font-semibold underline">
                <span>What's the difference?</span>
              </Disclosure.Button>
              <Disclosure.Panel className="text-left pt-4">
                <div className="grid grid-cols-1 gap-12 max-w-6xl mx-auto text-white text-lg font-bold md:grid-cols-2">
                  <div className="">
                    <div className="text-2xl mb-2">
                      Who Said True?! Game Edition
                    </div>
                    <ul className="space-y-2">
                      <li>Ages 13 and older</li>
                      <li>"SFW" Question Decks are Safe for Work</li>
                      <li>
                        'PG13' questions may not be appropriate for some family
                        members
                      </li>
                      <li>
                        'R' questions are definitely not appropriate for
                        sensitive or young players
                      </li>
                    </ul>
                  </div>
                  <div className="">
                    <div className="text-2xl mb-2">
                      Who Said True?! for Schools Edition
                    </div>
                    <ul className="space-y-2">
                      <li>School and Teacher-friendly</li>
                      <li>Ages 11 to 99 years old</li>
                      <li>All questions that are safe for school</li>
                      <li>
                        Question Decks are based on age and life experience
                      </li>
                    </ul>
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
      <div className="inline-grid grid-cols-1 gap-12 md:grid-cols-2">
        <Card>
          <div className="h-full flex flex-col items-center">
            <Logo className="w-36 h-36 my-8" />
            <div className="flex-1 text-title-3 font-bold">
              The devilishly fun party game aimed to reveal the best stories out
              of all your friends.
            </div>
            <Button onClick={onLetsPlayClick}>Let's Play</Button>
          </div>
        </Card>
        <Card>
          <div className="h-full flex flex-col items-center">
            <Logo className="w-36 h-36 my-8" />
            <div className="flex-1 text-title-3 font-bold">
              Who Said True?! for Schools is the same game but safe for 11
              through 18, and a school environment.
            </div>
            <Button onClick={onLetsPlayClick}>Let's Play</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GameVersions;
