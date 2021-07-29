import React from 'react';
import { FaFacebook } from '@react-icons/all-files/fa/FaFacebook';
import { FaTwitter } from '@react-icons/all-files/fa/FaTwitter';
import { FaTwitch } from '@react-icons/all-files/fa/FaTwitch';
import { FaInstagram } from '@react-icons/all-files/fa/FaInstagram';

export interface ISocialLinksProps {
    fbook: string;
    insta: string;
    twitch: string;
    twitter: string;
}
const links: React.FC<ISocialLinksProps> = ({ fbook, insta, twitch, twitter }) => {

    return (
        <section className="flex flex-col items-center sm:flex-row sm:gap-6 gap-2">
            <h5 className="font-semibold text-sm">Follow Us</h5>
            <div className="flex flex-row gap-4 text-iris-dark justify-between text-xl">
                <a href={fbook} target="_blank" rel="noreferrer" className="cursor-pointer"><FaFacebook /></a>
                <a href={twitter} target="_blank" rel="noreferrer" className="cursor-pointer"><FaTwitter /></a>
                <a href={twitch} target="_blank" rel="noreferrer" className="cursor-pointer"><FaTwitch /></a>
                <a href={insta} target="_blank" rel="noreferrer" className="cursor-pointer"><FaInstagram /></a>
            </div>
        </section>
    )
}

export default links;