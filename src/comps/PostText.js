import React from 'react'
import WithUrls from 'comps/with-urls'
import { useHistory } from 'react-router-dom'

/**
 * React Router onclick workaround
 * @example <div {...OnClick(onClick)}/>
 */
const OnClick = (() => {
    let clickTime = 0;
    let pos = { x: 0, y: 0 };

    return onClick => ({
        onMouseDown: ({ nativeEvent: e }) => { clickTime = Date.now(); pos.x = e.x; pos.y = e.y; },
        onMouseUp: ({ nativeEvent: e }) => { Date.now() - clickTime < 500 && pos.x === e.x && pos.y === e.y && e.which === 1 && onClick() },
    });
})();

export default ({ post, expanded = false, to }) => {
    const history = useHistory()
    let { text, htmlContent } = post
    if (!expanded) {
        text = `${text.substring(0, 15)} ...`
        htmlContent = text
    } 
    return (
    <div {...OnClick((e) => { to && history.push(to) })}>
        <WithUrls>{htmlContent}</WithUrls>
    </div>
    )
}
