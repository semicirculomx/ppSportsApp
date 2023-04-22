import React from 'react'
import Feed from 'features/posts/Feed'
import Heading from 'comps/Heading'

class Home extends React.Component {
    render() {
        return (<>
            <Heading title="Pronósticos del día" logo />
            {/* <MediaQuery minWidth={576}>
                <Compose className='mt-2' />
                <div style={{ height: "10px" }} className="w-100 bg-border-color border"></div>
            </MediaQuery> */}
            <Feed />
        </>)
    }
}

export default Home