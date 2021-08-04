import React from 'react';
import { FaFacebook } from '@react-icons/all-files/fa/FaFacebook';
import { FaTwitter } from '@react-icons/all-files/fa/FaTwitter';
import { FaInstagram } from '@react-icons/all-files/fa/FaInstagram';

import { BodySmall } from '../typography/Typography';

export interface ISocialLinksProps {
    fbook: string;
    insta: string;
    twitter: string;
}
const SocialMediaLinks: React.FC<ISocialLinksProps> = ({ fbook, insta, twitter }) => {

    return (
        <section className="flex flex-col items-center text-primary sm:flex-row sm:gap-6 gap-2">
            <BodySmall>Follow Us</BodySmall>
            <div className="flex flex-row gap-4 text-iris-dark justify-between text-xl">
                <a href={fbook} target="_blank" rel="noreferrer" className="cursor-pointer"><FaFacebook /></a>
                <a href={twitter} target="_blank" rel="noreferrer" className="cursor-pointer"><FaTwitter /></a>
                <a href={insta} target="_blank" rel="noreferrer" className="cursor-pointer"><FaInstagram /></a>
            </div>
        </section>
    )
}

export default SocialMediaLinks;