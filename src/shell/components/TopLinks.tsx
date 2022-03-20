import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faEnvelope, faDonate } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faGithub} from "@fortawesome/free-brands-svg-icons";
import './TopLinks.css';
import CommandLink from '../../core/components/CommandLink';
import cmd from '../cmd';

function TopLinks() {

    return <ul className="top-links">                
                <li>
                    <a href='https://www.paypal.com/donate/?hosted_button_id=3GREJYC4T5AJ8' onClick={onDonate} target="_blank">
                        <span className={faDonate.iconName}>donate</span>                    
                    </a>
                </li>
                <li>
                    <a href="https://github.com/BorisLevitskiy/BitwiseCmd"><FontAwesomeIcon className="icon" icon={faGithub} size="lg" /><span className="link-text">github</span></a>
                </li>
                <li>
                    <a href="https://twitter.com/BitwiseCmd"><FontAwesomeIcon className="icon" icon={faTwitter} size="lg" /><span className="link-text">twitter</span></a>
                </li>
                <li>
                    <a href="mailto:&#098;&#105;&#116;&#119;&#105;&#115;&#101;&#099;&#109;&#100;&#064;&#103;&#109;&#097;&#105;&#108;&#046;&#099;&#111;&#109;?subject=Feedback"><FontAwesomeIcon className="icon" icon={faEnvelope} size="lg" /><span className="link-text">idea or feedback</span></a>
                </li>
    </ul>;
}

const onDonate = () => {
    cmd.execute('donate');
    return true;
}

export default TopLinks;