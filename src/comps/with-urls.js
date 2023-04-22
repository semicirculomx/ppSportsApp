import React from 'react'
import { unescape } from 'html-escaper';
import anchorme from "anchorme";
import DOMPurify from 'dompurify';
import { filterInput } from 'utils/helpers';
import { truncatedText } from 'utils/helpers';

export default ({ children }) => {
    if (!children || !children.toString)
        return null
    let string = children.toString() //can be escaped too
    let text = filterInput(string, 'text', {  //filterInput is a custom function  to filter input             
        max_length: 60000,
        identifier: 'Post',
    })
    
    text = anchorme({
        input: text,
        // use some options
        options: {
            attributes: {
                target: "_blank",
                rel: "noopener noreferrer",
                class: "text-wrap break-all",
            },
            exclude: string => string.startsWith("https://res.cloudinary.com/"),
            // any link above 50 characters will be truncated
            truncate: 50,
        },
        // and extensions
        extensions: [
            // an extension for hashtag search
            {
                test: /#(\w|_)+/gi,
                transform: (string) =>
                    `<a class="high-index" href="/search?q=${encodeURIComponent(string)}"> ${string} </a>`,
            },
            // an extension for mentions
            {
                test: /@(\w|_)+/gi,
                transform: (string) =>
                    `<a class="high-index" href="/user/${string.slice(1)}">${string}</a>`,
            },
        ],
    });

    // should not pass for a good code beforehand
    if (DOMPurify.sanitize(text, { ALLOWED_TAGS: [] }).trim() === '')
        text = 'null'
    return (<>
    {/* <div className='mw-100 overflow-hidden' dangerouslySetInnerHTML={{ __html: text}}></div> */}
        <div className='mw-100 overflow-hidden' dangerouslySetInnerHTML={{ __html: string}}></div>
    </>)
}