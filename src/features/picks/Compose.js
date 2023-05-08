import React from 'react'
import { useState, useRef } from 'react'
import { Modal, Media, Alert, ProgressBar, Form, Row, Col, InputGroup, Button } from 'react-bootstrap'
import { useLocation } from 'react-router-dom'
import { Typeahead } from 'react-bootstrap-typeahead'

import 'react-bootstrap-typeahead/css/Typeahead.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-regular-svg-icons/faImage'

import { useSelector, useDispatch } from 'react-redux'
import { composePostAndPick } from 'features/posts/postsSlice'
import TextEditor from 'comps/TextEditor.js'
import { useEffect } from 'react'

import { fetchLeagueMatches, getSportsData, selectApiSports, selectLeagueMatches } from 'features/picks/picksSlice'
import Slip from 'comps/Slip'
// import Autocomplete from 'comps/autocomplete'

import { addBestMatch } from 'features/best-matches/bmSlice'

import DOMPurify from 'dompurify'
import { filterInput, dateConverter, findLongestMarketsArray } from 'utils/helpers'

export default props => {
    let location = useLocation()
    let dispatch = useDispatch()

    let { user } = useSelector(state => state.auth)
    let { api_sports_status: apiStatus } = useSelector(state => state.picks)
    let apiSports = useSelector(selectApiSports)
    let leagueMatches = useSelector(selectLeagueMatches)

    // let formType = new URLSearchParams(location.search).get('type')  // 'pick' or 'post'
    const replyId = new URLSearchParams(location.search).get('reply_to')
    let type = props.type
    const betMarkets = ["Ganador", "Hándicap", "Total O/U", "Hándicap G", "Doble O", "BTTS", "Margen V", "1er tiempo", "Especiales", "Largo pl.", "Parlay", "En vivo", "Desc/Final", "1er anot.", "Tarjetas", "Posesión", "Esquina", "D.N.B.", "Exacto", "Intervalo"]
    let { compose_status: status } = useSelector(state => state.posts)
    let ta = useRef(null)
    let unidad = useRef(250);
    let input_ref = useRef()
    let [market, setMarket] = useState('')
    let [odds, setOdds] = useState('')
    let [stake, setStake] = useState('')
    let [match, setMatch] = useState(null)
    let [profit, setProfit] = useState(0)
    let [pick_title, setPickTitle] = useState('')
    const [height, setHeight] = useState('auto')
    const [editor_text, setText] = useState(``)
    const [active, setActive] = useState(false)
    let [sport, setSport] = useState(null) // sport id
    let [matchTitle, setMatchTitle] = useState('') // competition
    let [bets, setBets] = useState([]) // competition
    const [error, setError] = useState(null)
    let [base64Images, setImages] = useState([])
    let [htmlContent, setHtmlContent] = useState(null)
    let [initialContent, setInitialContent] = useState('Escribe aquí tus análisis y predicciones...')
    let [placeholder, setPlaceholder] = useState(true)
    let [bookmaker, setBookmaker] = useState(null)
    let [showModal, setShowModal] = useState(props.show)

    let [progress, setProgress] = useState(0)

    const [totalOdds, setTotalOdds] = useState(0);
    const [totalPayout, setTotalPayout] = useState(0);

    function calculatePayout(bets, stake) {
        if (!bets.length)
            return { totalOdds: 0, payout: 0 };
        // Convert stake to a float
        stake = parseFloat(stake);

        // Calculate the decimal odds and total odds for the parlay
        let decimalOdds = 1;
        for (let i = 0; i < bets.length; i++) {
            let americanOdds = parseFloat(bets[i].odds);

            decimalOdds *= americanOdds > 0 ? (americanOdds / 100) + 1 : (-100 / americanOdds) + 1;

        }
        let totalOdds = (decimalOdds - 1) * 100;

        // Calculate the parlay payout
        let payout = decimalOdds * stake;

        // Format the total odds and payout in American format
        let singleBetOdd = bets[0].odds;
        let totalOddsAmerican = totalOdds >= 0 ? `+${totalOdds.toFixed(0)}` : `-${Math.abs(totalOdds).toFixed(0)}`;
        let payoutAmerican = `$${payout.toFixed(2)}`;
        let payoutNumber = payout.toFixed(2)

        // Return an object with the total odds and payout in American format
        return { totalOdds: bets.length > 1 ? totalOddsAmerican : singleBetOdd, payout: payoutAmerican, payoutNumber: payoutNumber };
    }

    let dirtyProgress = () => {
        if (progress < 90)
            setTimeout(() => { setProgress(90) }, 200)
        return true
    }

    const handleClose = () => {
        if (status !== 'error' || true) {
            setError(null)
            props.onClose()
        }
    }

    const resizeTa = () => {
        if (ta.current) {
            // let height = ta.current.scrollHeight;
            // cur.height = 'auto';
            // cur.height = (cur.scrollHeight) + 'px';
            setHeight('auto')
        }
    }
    useEffect(() => {
        if (ta.current) {
            ta.current.focus()
            let height = ta.current.scrollHeight
            setHeight(height + 'px')
        }
    }, [editor_text])

    useEffect(() => {
        if ((apiStatus === 'idle' || apiStatus === 'done') && !apiSports.length) {
            dispatch(getSportsData())
            // console.log('fetching on posts load, status:', status)
        }
    }, [apiStatus, apiSports, dispatch])

    useEffect(() => {
     setShowModal(props.show)
    }, [props.show])


    /* Handle selected sport */
    const handleSelectSport = (selectedSport) => {
        setSport(selectedSport[0])
        if (selectedSport.length > 0) {
            if (selectedSport[0].customOption) {
                dispatch(fetchLeagueMatches('upcoming'))
            } else {
                dispatch(fetchLeagueMatches(selectedSport[0].key))
            }
        }
    }

    const handleEditorContentChange = (htmlContent) => {
        resizeTa()
        let text = htmlContent.replace(/<[^>]+>/g, '');
        setText(text)
        setActive(DOMPurify.sanitize(text, { ALLOWED_TAGS: [] }).trim().length > 0)
        setHtmlContent(htmlContent);
        extractImages(htmlContent);
        placeholder && setPlaceholder(false);
    }

    const extractImages = (htmlContent) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const base64Images = Array.from(doc.querySelectorAll('img')).map(img => img.src);

        setImages(base64Images);
    }

    /*Handle selected match */
    const handleSelectMatch = (e) => {
        setMatch(e[0])
        console.log(e[0])
        if (e.length > 0) {
            if (e[0].customOption) {
                setMatchTitle(e[0].label)
            } else {
                let selectedMatch = e[0]
                if (selectedMatch.bookmakers.length) {
                    setBookmaker(findLongestMarketsArray(selectedMatch.bookmakers))
                }
                setMatchTitle(selectedMatch.home_team + ' vs ' + selectedMatch.away_team)
            }
            setActive(true)
        }
    }

    /* Add a new bet function*/
    const addBetMatch = () => {
        if (sport && match && market && odds) {
            let matchBody = {
                home_team: match.home_team ? match.home_team : undefined,
                away_team: match.away_team ? match.away_team : undefined,
                commence_time: match.commence_time ? match.commence_time : undefined,
                sport: sport.group ? sport.group : sport.label,
                competition: match.sport_title ? match.sport_title : sport.title,
                match_id: !match.customOption ? match.id : `custom-${matchTitle}-${Date.now()}`,
                matchTitle,
                customOption: match.customOption ? match.customOption : false,
                bookmaker: bookmaker ? bookmaker : null,
            }
            let bet = {
                match: matchBody,
                market,
                odds,
            }
            setBets([...bets, bet])
            setMarket('')
            setOdds('')
            setMatchTitle('')
            setMatch(null)
            setSport(null)
            setBookmaker(null)


            const { totalOdds, payout, payoutNumber } = calculatePayout([...bets, bet], (stake * unidad.current));

            console.log('Total Odds:', totalOdds); // Total Odds: -0.61
            console.log('Total Payout:', payout); // Total Payout: 1030.82

            setTotalOdds(totalOdds)
            setTotalPayout(payout)
            setProfit(payoutNumber - (stake * unidad.current))
            console.log(bet)
        }
    }
    /* Remove a bet function */
    const handleRemove = (index) => {
        const updatedBets = bets.filter((bet, i) => i !== index);
        const { totalOdds, payout, payoutNumber } = calculatePayout([...updatedBets], (stake * unidad.current));
        console.log('trigger remove', totalOdds, totalPayout)
        setTotalOdds(totalOdds)
        setTotalPayout(payout)
        setProfit(payoutNumber - (stake * unidad.current))
        setBets(updatedBets);
    };

    /* Handle submit */
    const handleSubmit = async e => {
        if (!active) return;
        setActive(false);

        let body = {
            post: {},
            pick: {}
        };
        try {
            if (editor_text && !placeholder) {
                let text;
                let htmlSanitized;
                try {
                    htmlSanitized = filterInput(htmlContent, 'html_strict', { max_length: 60000, identifier: 'Post' });
                    text = filterInput(editor_text, 'text', { max_length: 60000, identifier: 'Post' });
                } catch (err) {
                    setActive(true);
                    return setError(err.message);
                }
                body.post = {
                    text,
                    post_title: pick_title,
                    base64Images,
                    htmlContent: htmlSanitized,
                    post_categories: []
                };
            }

            if (bets.length > 0) {
                let pick = {
                    bets,
                    stake,
                    pick_title,
                    profit,
                    lastUserBank: user.bank,
                    totalOdds,
                };
                body.pick = pick;
                if (body.post.text) {
                    body.post.post_categories = bets.map((e) => e.match.sport)
                }
            } else {
                body.post.post_categories = [sport.group ? sport.group : sport.label]
                body.post.bets = [{
                    match: {
                        home_team: match.home_team ? match.home_team : undefined,
                        away_team: match.away_team ? match.away_team : undefined,
                        commence_time: match.commence_time ? match.commence_time : undefined,
                        sport: sport.group ? sport.group : sport.label,
                        competition: match.sport_title ? match.sport_title : sport.title,
                        match_id: !match.customOption ? match.id : `custom-${matchTitle}-${Date.now()}`,
                        customOption: match.customOption ? match.customOption : false,
                        bookmaker: bookmaker ? bookmaker : null,
                        matchTitle,
                    }
                }]
            }
            console.log(body)
            let action = await dispatch(composePostAndPick({ body }))

            if (action.type === 'posts/composePostAndPick/fulfilled') {
                setActive(true);
                handleClose()
            }
        } catch (error) {
            console.log(error)
            setError(error.message)
        }

    }

    /* Handle submit best match */
    const submitMatch = async e => {
        if (!active) return

        setActive(false)

        let matchBody = {
            home_team: match.home_team ? match.home_team : undefined,
            away_team: match.away_team ? match.away_team : undefined,
            commence_time: match.commence_time ? match.commence_time : undefined,
            sport: sport.group ? sport.group : sport.label,
            competition: match.sport_title ? match.sport_title : sport.title,
            match_id: !match.customOption ? match.id : `custom-${matchTitle}-${Date.now()}`,
            matchTitle,
            is_value_match: true,
            customOption: match.customOption ? match.customOption : false,
            bookmaker: bookmaker ? bookmaker : null,

        }

        let body = {
            match: matchBody,
        }
        let action = await dispatch(addBestMatch({ body }))
        if (action.type === 'bm/addBestMatch/fulfilled') {
            setActive(true)
            handleClose()
        }

    }

    return (
        <>
            <Modal
                className="p-0"
                size="lg"
                scrollable={true}
                show={showModal}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton className="py-2">
                    <Modal.Title>
                        <small className="font-weight-bold">
                            {replyId ? 'Responde' : 'Envía tu pick'}
                        </small>
                    </Modal.Title>
                </Modal.Header>
                {status === 'pending' && (
                    <ProgressBar className="rounded-0" now={progress} />
                )}
                {status === 'error' && (
                    <Alert variant="danger" className="font-weight-bold text-white">
                        Error al crear tu post, intenta de nuevo!
                    </Alert>
                )}
                {error && (
                    <Alert variant="danger" className="font-weight-bold text-white">
                        {error}
                    </Alert>
                )}
                <Modal.Body className="retroForm">
                    <Media className="h-100 w-100">
                        <Media.Body className="h-100 w-50" style={{ minHeight: '175px' }}>
                            <Form ref={input_ref} onSubmit={e => e.preventDefault()}>
                                {type !== 'partido' && (
                                    <>
                                        <Form.Group controlId="eventName">
                                            <Form.Control
                                                placeholder="Título del pick"
                                                type="text"
                                                value={pick_title}
                                                onChange={n => setPickTitle(n.target.value)}
                                                required />
                                        </Form.Group>
                                    </>
                                )}

                                {apiSports.length > 0 && (
                                    <Form.Group controlId="sport">
                                        <Typeahead
                                            clearButton
                                            allowNew={true}
                                            newSelectionPrefix="No está? Agrega uno..😁: "
                                            id="sport-typeahead"
                                            onChange={handleSelectSport}
                                            labelKey={(option) => `${option.title} - ${option.group}`}
                                            options={apiSports}
                                            placeholder="Elige un deporte..."
                                            selected={sport ? [sport] : []}
                                        />
                                    </Form.Group>
                                )}

                                {sport && (
                                    <Form.Group controlId="match">
                                        <Typeahead
                                            clearButton
                                            allowNew={true}
                                            newSelectionPrefix="No está? Agrega uno..😁: "
                                            id="match-typeahead"
                                            onChange={handleSelectMatch}
                                            labelKey={(option) => `${option.home_team} - ${option.away_team} | ${dateConverter(option.commence_time)}`}
                                            options={leagueMatches}
                                            placeholder="Selecciona un partido..."
                                            selected={match ? [match] : []}
                                        />
                                    </Form.Group>
                                )}
                                {match && (
                                     <Form.Group controlId="matchTitle">
                                     <Form.Control
                                         placeholder="Título de apuesta"
                                         type="text"
                                         value={matchTitle}
                                         onChange={(e) => setMatchTitle(e.target.value)} />
                                 </Form.Group>
                                )}
                                <hr />
                                {type !== 'analisis' && (
                                    <>
                                        {type === 'apuesta' && (
                                            <>
                                                <Form.Group controlId="market">
                                                    <Typeahead
                                                        clearButton
                                                        allowNew={true}
                                                        newSelectionPrefix="No está? Agrega uno..😁: "
                                                        id="market-typeahead"
                                                        onChange={mercado => !mercado[0]?.customOption ? setMarket(mercado[0]) : setMarket(mercado[0].label)}
                                                        options={betMarkets}
                                                        placeholder="Elige un tipo de mercado..."
                                                        selected={market ? [market] : []}
                                                    />
                                                </Form.Group>
                                                <Row>
                                                    <Col>
                                                        <Form.Group className="mr-2" controlId="marketOdds">
                                                            <Form.Control
                                                                placeholder="Cuota"
                                                                type="number"
                                                                value={odds}
                                                                onChange={n => setOdds(n.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col>
                                                        <Form.Group className="ml-2" controlId="stake">
                                                            <Form.Control
                                                                placeholder="Unidades"
                                                                type="number"
                                                                value={stake}
                                                                onChange={n => setStake(n.target.value)}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>

                                                <InputGroup className="">
                                                    <span>Momio total:</span>
                                                    <InputGroup.Text className="font-weight-bold">{totalOdds}</InputGroup.Text>
                                                </InputGroup>
                                                <InputGroup className="">
                                                    <span>Retorno:</span>
                                                    <InputGroup.Text className="font-weight-bold">{totalPayout}</InputGroup.Text>
                                                </InputGroup>
                                                <div className="custom-btn">
                                                    <Button
                                                        className="font-weight-bold btn w-100 mb-3"
                                                        onClick={addBetMatch}
                                                        disabled={!market || !odds || !stake || !matchTitle}
                                                    >Agregar</Button>
                                                </div>

                                            </>
                                        )}
                                    </>)}
                                <Slip bets={bets} onRemove={handleRemove} />

                                {type !== 'partido' && (
                                    <>
                                        <Form.Group className="w-100 p-0" controlId="analisis">
                                            <TextEditor style={{
                                                height
                                            }} onContentChange={handleEditorContentChange}

                                                content={initialContent} />

                                        </Form.Group>
                                    </>
                                )}
                            </Form>
                        </Media.Body>
                    </Media>
                </Modal.Body>
                <Modal.Footer className="py-2">
                    <div className="d-flex w-100 justify-content-end align-items-center">
                        {/* <div style={{ fontSize: '1.5em' }}>
                            <button className="disabled text-primary btn btn-lg rounded-circle btn-naked-primary p-2">
                                <FontAwesomeIcon size="lg" icon={faImage} />
                            </button>
                        </div> */}
                        <div className="right custom-btn">
                            <button
                                onClick={type === 'partido' ? submitMatch : handleSubmit}
                                className="btn px-3 py-2 font-weight-bold"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    )
}
