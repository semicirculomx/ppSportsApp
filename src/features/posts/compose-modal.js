import React from 'react'
import { useState, useRef } from 'react'
import { Modal, Media, Alert, ProgressBar, Popover, OverlayTrigger } from 'react-bootstrap'
import { useHistory, useLocation } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-regular-svg-icons/faImage'
import { faSmile } from '@fortawesome/free-regular-svg-icons/faSmile'

import { useSelector, useDispatch } from 'react-redux'
import { composePost, selectPostById } from './postsSlice'
import { useEffect } from 'react'

import QuotedPost from 'comps/quoted-post'

import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import DOMPurify from 'dompurify';
import { filterInput } from 'utils/helpers'

export default props => {
    let location = useLocation()
    let history = useHistory()
    let dispatch = useDispatch()

    let { user } = useSelector(state => state.auth);
    let quoteId = new URLSearchParams(location.search).get("quote");
    let quotePost = useSelector(state => selectPostById(state, quoteId));

    const replyId = new URLSearchParams(location.search).get("reply_to");
    let replyPost = useSelector(state => selectPostById(state, replyId));

    let { compose_status: status } = useSelector(state => state.posts)

    let ta = useRef(null)
    const [height, setHeight] = useState("auto")
    const [editor_text, setText] = useState(``)
    const [active, setActive] = useState(false)

    const [error, setError] = useState(null)

    let [progress, setProgress] = useState(10)

    let dirtyProgress = () => {
        if (progress < 90)
            setTimeout(() => { setProgress(90) }, 200)
        return true
    }
    const handleClose = () => {
        if (status !== 'error' || true) {
            history.goBack();
        }
    }
    let resizeTa = () => {
        if (ta.current) {
            // let height = ta.current.scrollHeight;
            // cur.height = 'auto';
            // cur.height = (cur.scrollHeight) + 'px';
            setHeight('auto')
        }
    }
    useEffect(() => {
        if (ta.current) {
            let height = ta.current.scrollHeight;
            setHeight(height + 'px')
        }
    }, [editor_text])
    useEffect(() => {
        if (ta.current)
            ta.current.focus()
    }, [])
    let handleChange = e => {
        resizeTa()
        let text = e.target.value
        setText(text)
        setActive(DOMPurify.sanitize(text, { ALLOWED_TAGS: [] }).trim().length > 0)
    }
    let handleSubmit = async (e) => {
        if (!active)
            return;
        let text;
        try {
            text = filterInput(editor_text, 'html', { max_length: 60000, identifier: 'Post' })
        } catch (err) {
            return setError(err.message)
        }
        setActive(false)
        let body = {
            text
        }
        let url;
        if (replyId) {
            url = `/api/post/${replyId}/reply`
        }
        else if (quotePost) {
            body = {
                ...body,
                is_quote_status: true,
                quoted_status_id: quotePost.id,
                quoted_status_id_str: quotePost.id_str,
                quoted_status: quotePost._id
            }
        }
        let action = await dispatch(composePost({ body, url }))
        setActive(true)
        if (action.type === 'posts/composePost/fulfilled')
            handleClose()
    }
    let addEmoji = emoji => {
        setText(text => (text + emoji.native))
    }
    const picker = (
        <Popover id="popover-basic">
            <Picker
                onSelect={addEmoji}
                color="#3eaaee"
                sheetSize={32}
                emoji='point_up'
                title="Pick your emoji"
                set='twitter'
            />
        </Popover>
    );

    return (
        <>
            <Modal
                className="p-0"
                size="lg"
                scrollable={true}
                show={true}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton className="py-2">
                    <Modal.Title><small className="font-weight-bold">
                        {replyId ? 'Post your reply' : 'Compose post'}
                    </small></Modal.Title>
                </Modal.Header>
                {status === 'pending' && (
                    dirtyProgress() &&
                    <ProgressBar className="rounded-0" now={progress} />
                )}
                {status === "error" && (
                    <Alert variant="danger" className="font-weight-bold text-white">
                        Error submiting post, try again!
                    </Alert>
                )}
                {error && (
                    <Alert variant="danger" className="font-weight-bold text-white">
                        {error}
                    </Alert>
                )}
                <Modal.Body className="pt-1 pb-0">
                    <Media className='h-100 w-100'>
                        <img
                            className="rounded-circle"
                            src={user.default_profile_image ? '/img/default-profile-vector.svg' : user.profile_image_url_https}
                            alt=""
                            width={50}
                            height={50}
                        />
                        <Media.Body className="h-100 w-50" style={{ minHeight: '175px' }}>
                            <textarea
                                ref={ta}
                                className="w-100 p-2 pb-5"
                                style={{
                                    height,
                                }}
                                name="text"
                                onChange={handleChange}
                                value={editor_text}
                                placeholder="Escribe tu comentario.."
                            >
                            </textarea>
                            <QuotedPost className="mb-2 mt-n5" post={replyPost || quotePost} />
                        </Media.Body>
                    </Media>
                </Modal.Body>
                <Modal.Footer className="py-1">
                    <div className="d-flex w-100 justify-content-between align-items-center">
                        <div style={{ fontSize: "1.5em" }}>
                            <OverlayTrigger rootClose={true} trigger="click" placement="auto-start" overlay={picker}>
                                <button className="text-primary btn btn-lg rounded-circle btn-naked-primary p-2">
                                    <FontAwesomeIcon size="lg" icon={faSmile} />
                                </button>
                            </OverlayTrigger>
                            <button className="disabled text-primary btn btn-lg rounded-circle btn-naked-primary p-2">
                                <FontAwesomeIcon size="lg" icon={faImage} />
                            </button>
                        </div>
                        <div className="right">
                            <button
                                onClick={handleSubmit}
                                disabled={!active}
                                className="btn btn-primary rounded-pill px-3 py-2 font-weight-bold">
                                Publicar
                            </button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}
// import React from 'react'
// import { useState, useRef } from 'react'
// import { Modal, Media, Alert, ProgressBar, Form, Row, Col } from 'react-bootstrap'
// import { useHistory, useLocation } from 'react-router-dom'

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faImage } from '@fortawesome/free-regular-svg-icons/faImage'
// import { faSmile } from '@fortawesome/free-regular-svg-icons/faSmile'

// import { useSelector, useDispatch } from 'react-redux'
// import { composePost,composePostAndPick, selectPostById } from './postsSlice'
// import { useEffect } from 'react'

// import QuotedPost from 'comps/quoted-post'
// import { fetchLeagueMatches, selectApiSports, selectLeagueMatches } from 'features/picks/picksSlice'

// import 'emoji-mart/css/emoji-mart.css'
// import DOMPurify from 'dompurify'
// import { filterInput, dateConverter } from 'utils/helpers'

// export default props => {
//     let location = useLocation()
//     let history = useHistory()
//     let dispatch = useDispatch()

//     let { user } = useSelector(state => state.auth)
//     let quoteId = new URLSearchParams(location.search).get('quote')
//     let quotePost = useSelector(state => selectPostById(state, quoteId))
//     let apiSports = useSelector(selectApiSports)
//     let leagueMatches = useSelector(selectLeagueMatches)

//     const replyId = new URLSearchParams(location.search).get('reply_to')
//     let replyPost = useSelector(state => selectPostById(state, replyId))

//     let { compose_status: status } = useSelector(state => state.posts)
//     let userBank = user.bank
//     let ta = useRef(null)
//     let [home_team, setHomeTeam] = useState('')
//     let [away_team, setAwayTeam] = useState('')
//     let [market, setMarket] = useState('')
//     let [odds, setOdds] = useState('')
//     let [stake, setStake] = useState('')
//     let [match, setMatch] = useState(null)
//     let [profit, setProfit] = useState(0)
//     let [pick_title, setPickTitle] = useState('')
//     const [height, setHeight] = useState('auto')
//     const [editor_text, setText] = useState(``)
//     const [active, setActive] = useState(false)
//     let [sport, setSport] = useState(null) // sport id
//     const [commence_time, setCommenceTime] = useState(null)
//     let [competition, setCompetition] = useState(null) // competition
//     let [match_id, setMatch_id] = useState(null) // competition
//     let [matchTitle, setMatchTitle] = useState(null) // competition
//     let [bets, setBets] = useState([]) // competition
//     let [bookmakers, setBookMakers] = useState(null) // competition

//     const [error, setError] = useState(null)

//     let [progress, setProgress] = useState(10)

//     const findLongestMarketsArray = arr => {
//         return arr.reduce((acc, curr) => {
//             if (curr.markets && curr.markets.length > acc.markets.length) {
//                 return curr
//             } else {
//                 return acc
//             }
//         })
//     }

//     let dirtyProgress = () => {
//         if (progress < 90)
//             setTimeout(() => { setProgress(90) }, 200)
//         return true
//     }
//     const handleClose = () => {
//         if (status !== 'error' || true) {
//             history.goBack()
//         }
//     }
//     let resizeTa = () => {
//         if (ta.current) {
//             // let height = ta.current.scrollHeight;
//             // cur.height = 'auto';
//             // cur.height = (cur.scrollHeight) + 'px';
//             setHeight('auto')
//         }
//     }
//     useEffect(() => {
//         if (ta.current) {
//             let height = ta.current.scrollHeight
//             setHeight(height + 'px')
//         }
//     }, [editor_text])
//     useEffect(() => {
//         if (ta.current) ta.current.focus()

//         return () => {
//             // Cancel any outstanding asynchronous tasks or subscriptions
//         }
//     }, [])
//     let handleChange = e => {
//         resizeTa()
//         let text = e.target.value
//         setText(text)
//         setActive(DOMPurify.sanitize(text, { ALLOWED_TAGS: [] }).trim().length > 0)
//     }

//     let handleSelect = e => {
//         const selectedSport = apiSports.find(s => s.key === e.target.value)
//         console.log(selectedSport)
//         setSport(selectedSport.group)
//         dispatch(fetchLeagueMatches(selectedSport.key))
//     }
//     let handleSelectMatch = e => {
//         const selectedMatch = leagueMatches.find(match => match.id === e.target.value)
//         setMatch(selectedMatch)
//         setHomeTeam(selectedMatch.home_team)
//         setAwayTeam(selectedMatch.away_team)
//         setCommenceTime(selectedMatch.commence_time)
//         setCompetition(selectedMatch.sport_title)
//         setMatch_id(selectedMatch.id)
//         setMatchTitle(`${selectedMatch.home_team} vs ${selectedMatch.away_team}`)
//         if (selectedMatch.bookmakers && selectedMatch.bookmakers.length > 0) {
//             bookmakers = findLongestMarketsArray(selectedMatch.bookmakers)
//             setBookMakers(bookmakers)
//         } else {
//             setBookMakers(false)
//         }
//     }

//     let handleSelectMarket = e => {
//         const selectedMarket = bookmakers.markets.find(m => m.key === e.target.value)
//         setMarket(selectedMarket.key)
//         console.log(selectedMarket)
//     }

//     let addBetMatch = () => {
//         if (market && odds) {
//             let bet = {
//                 match: {matchTitle, sport, competition,
//                     match_id, ...match},
//                 market,
//                 odds,
//             }
//             setBets([...bets, bet])
//             setMarket('')
//             setOdds('')
//             setHomeTeam('')
//             setAwayTeam('')
//             setCommenceTime('')
//             setCompetition('')
//             setMatch(null)
//             setSport(null)

//             console.log(bet)
//         }
//     }

//     let handleSubmit = async e => {
//         if (!active) return
//         let text
//         try {
//             text = filterInput(editor_text, 'html', { max_length: 500, identifier: 'Post' })
//         } catch (err) {
//             return setError(err.message)
//         }
//         setActive(false)
//         let pick = {
//             bets,
//             stake,
//             pick_title,
//             profit,
//             lastUserBank: user.bank,
//         }


//         let body = {
//             text,
//             pick: pick,
//             is_pick: true,
//         }
//         let url
//         if (replyId) {
//             url = `/api/post/${replyId}/reply`
//         } else if (quotePost) {
//             body = {
//                 ...body,
//                 is_quote_status: true,
//                 quoted_status_id: quotePost.id,
//                 quoted_status_id_str: quotePost.id_str,
//                 quoted_status: quotePost._id,
//             }
//         }
//         let action = await dispatch(composePostAndPick({ body, url }))
//         setActive(true)
//         if (action.type === 'posts/composePostAndPick/fulfilled')
//             handleClose()
//     }

//     return (
//         <>
//             <Modal
//                 className="p-0"
//                 size="lg"
//                 scrollable={true}
//                 show={true}
//                 onHide={handleClose}
//                 backdrop="static"
//                 keyboard={false}
//             >
//                 <Modal.Header closeButton className="py-2">
//                     <Modal.Title>
//                         <small className="font-weight-bold">
//                             {replyId ? 'Responde' : 'Envía tu pick'}
//                         </small>
//                     </Modal.Title>
//                 </Modal.Header>
//                 {status === 'pending' && dirtyProgress() && (
//                     <ProgressBar className="rounded-0" now={progress} />
//                 )}
//                 {status === 'error' && (
//                     <Alert variant="danger" className="font-weight-bold text-white">
//                         Error submiting post, try again!
//                     </Alert>
//                 )}
//                 {error && (
//                     <Alert variant="danger" className="font-weight-bold text-white">
//                         {error}
//                     </Alert>
//                 )}
//                 <Modal.Body className="pt-1 pb-0">
//                     <Media className="h-100 w-100">
//                         <img
//                             className="rounded-circle"
//                             src={
//                                 user.default_profile_image
//                                     ? '/img/default-profile-vector.svg'
//                                     : user.profile_image_url_https
//                             }
//                             alt=""
//                             width={50}
//                             height={50}
//                         />
//                         <Media.Body className="h-100 w-50" style={{ minHeight: '175px' }}>
//                             <Form onSubmit={e => e.preventDefault()}>
//                                 <Form.Group controlId="sport">
//                                     <Form.Control
//                                         placeholder="Deportes y ligas"
//                                         as="select"
//                                         value={sport ? sport.key : ''}
//                                         onChange={handleSelect}
//                                     >
//                                         <option value="">Lista de deportes</option>
//                                         {apiSports.map((m, index) => (
//                                             <option key={index} value={m.key}>
//                                                 {m.title} - {m.group}
//                                             </option>
//                                         ))}
//                                     </Form.Control>
//                                 </Form.Group>
//                                 {sport && (
//                                     <Form.Group controlId="match">
//                                         <Form.Control
//                                             placeholder="Partidos de hoy"
//                                             as="select"
//                                             value={match ? match.id : ''}
//                                             onChange={handleSelectMatch}
//                                         >
//                                             <option value="">Lista de partidos</option>
//                                             {leagueMatches.map((m, index) => (
//                                                 <option key={m.id} value={m.id}>
//                                                     {m.home_team} - {m.away_team} |{' '}
//                                                     {dateConverter(m.commence_time)}
//                                                 </option>
//                                             ))}
//                                         </Form.Control>
//                                     </Form.Group>
//                                 )}
//                                 {bookmakers && (
//                                     <Form.Group controlId="market">
//                                         <Form.Control
//                                             placeholder="Apuestas disponibles"
//                                             as="select"
//                                             value={market ? market.key : ''}
//                                             onChange={handleSelectMarket}
//                                         >
//                                             <option value="">Lista de apuestas</option>
//                                             {bookmakers.markets.map((m, index) => {
//                                                 let marketLabel

//                                                 if (m.key === 'h2h') {
//                                                     marketLabel = '1X2'
//                                                 } else if (m.key === 'spreads') {
//                                                     marketLabel = 'Handicap'
//                                                 } else if (m.key === 'totals') {
//                                                     marketLabel = 'Ov./Un.'
//                                                 } else {
//                                                     marketLabel = m.key
//                                                 }

//                                                 return (
//                                                     <option key={index} value={m.key}>
//                                                         {marketLabel}
//                                                     </option>
//                                                 )
//                                             })}
//                                         </Form.Control>
//                                     </Form.Group>
//                                 )}
//                                 <Row>
//                                     <Form.Group className="mr-3" as={Col} controlId="marketOdds">
//                                         <Form.Control
//                                             placeholder="Momios"
//                                             type="number"
//                                             style={{ maxWidth: '100px', fontSize: '1.25rem' }}
//                                             value={odds}
//                                             onChange={n => setOdds(n.target.value)}
//                                         />
//                                     </Form.Group>

//                                     <Form.Group className="ml-3" as={Col} controlId="stake">
//                                         <Form.Control
//                                             placeholder="Stake"
//                                             style={{ fontSize: '1.25rem' }}
//                                             type="number"
//                                             value={stake}
//                                             onChange={n => setStake(n.target.value)}
//                                         />
//                                     </Form.Group>
//                                     <Col>
//                                         <button
//                                             onClick={addBetMatch}
//                                             className="ml-3 btn btn-primary px-3 py-2 font-weight-bold"
//                                         >
//                                             +
//                                         </button>
//                                     </Col>
//                                 </Row>
//                                 <Form.Group controlId="eventName">
//                                     <Form.Control
//                                         placeholder="Nombre del evento"
//                                         style={{ fontSize: '1.25rem' }}
//                                         type="text"
//                                         value={pick_title}
//                                         onChange={n => setPickTitle(n.target.value)}
//                                     />
//                                 </Form.Group>
//                                 <Form.Group className="w-100 pt-3 p-2 pb-5" controlId="analisis">
//                                     <Form.Control
//                                         placeholder="Escribe tu análisis"
//                                         as="textarea"
//                                         rows={5}
//                                         style={{
//                                             height,
//                                         }}
//                                         value={editor_text}
//                                         onChange={handleChange}
//                                     />
//                                 </Form.Group>
//                             </Form>
//                         </Media.Body>
//                     </Media>
//                 </Modal.Body>
//                 <Modal.Footer className="py-1">
//                     <div className="d-flex w-100 justify-content-between align-items-center">
//                         <div style={{ fontSize: '1.5em' }}>
//                             <button className="disabled text-primary btn btn-lg rounded-circle btn-naked-primary p-2">
//                                 <FontAwesomeIcon size="lg" icon={faImage} />
//                             </button>
//                         </div>
//                         <div className="right">
//                             <button
//                                 onClick={handleSubmit}
//                                 disabled={!active}
//                                 className="btn btn-primary rounded-pill px-3 py-2 font-weight-bold"
//                             >
//                                 Crear Pick
//                             </button>
//                         </div>
//                     </div>
//                 </Modal.Footer>
//             </Modal>
//         </>
//     )
// }
