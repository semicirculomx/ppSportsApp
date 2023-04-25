import React from 'react'

import Heading from 'comps/Heading'

export default props => {
    return (<>
        <Heading title='Chat room(s)' btnProfile backButton />
        <p className='flex min-vh-100 p-3 text-muted'>
           More 
        </p>
    </>)
}