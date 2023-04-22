import React, { useEffect } from 'react'
import { useState } from 'react'

import {
    Row,
    Col,
    Modal,
    Form,
    Button,
    Figure,
    OverlayTrigger,
    Popover,
    Alert,
    ProgressBar,
    Media
} from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

export default (props) => {

    const [stake, setStake] = useState(0);
    const [bet1Odds, setBet1Odds] = useState(0);
    const [totalWin, setTotalWin] = useState(0);
    const [totalPayout, setTotalPayout] = useState(0);
    const [betType, setBetType] = useState('positive');

    const handleInputChange = (event) => {
        const target = event.target;
        const name = target.name;
        const value = target.value;
        if (name === 'stake') {
            setStake(value);
        } else if (name === 'bet1Odds') {
            setBet1Odds(value);
        }
    };

    const handleBetTypeChange = (event) => {
        const target = event.target;
        const value = target.value;
        setBetType(value);
    };

    const calculatePayout = () => {
        const payoutPercentage = (betType === 'positive') ? bet1Odds / 100 : 100 / bet1Odds;
        const payoutAmount = parseFloat(stake) * payoutPercentage;
        const totalPayout = parseFloat(stake) + payoutAmount;
        const totalWin = payoutAmount.toFixed(2);
        setTotalPayout(totalPayout.toFixed(2));
        setTotalWin(totalWin);
    };

    

    return (
        <>
            {/* <Media>
                <Media.Body className="betCalculator">
                    <Form>
                        <Form.Group>
                            <Form.Label>Stake</Form.Label>
                            <Form.Control type="text" name="stake" value={stake} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Bet 1 Odds</Form.Label>
                            <Form.Control type="text" name="bet1Odds" value={bet1Odds} onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Choose Bet Type</Form.Label>
                          <Row>
                            <Col xs={6}>
                                <Form.Check
                                    type="radio"
                                    label="Positive"
                                    id="positive"
                                    name="betType"
                                    value="positive"
                                    checked={betType === 'positive'}
                                    onChange={handleBetTypeChange}
                                />
                                                            </Col>
                                                            <Col xs={6}>

                                <Form.Check
                                    type="radio"
                                    label="Negative"
                                    id="negative"
                                    name="betType"
                                    value="negative"
                                    checked={betType === 'negative'}
                                    onChange={handleBetTypeChange}
                                />
                            </Col>
                            </Row>
                        </Form.Group>
                        <Button onClick={calculatePayout}>Calculate Payout</Button>
                        <h1>{totalWin}</h1>
                        <h1>{totalPayout}</h1>
                        {/* <Form.Group>
              <Form.Label>Total Win</Form.Label>
              <Form.Static>{totalWin}</Form.Static>
            </Form.Group>
            <Form.Group>
              <Form.Label>Total Payout</Form.Label>
              <Form.Static>{totalPayout}</Form.Static>
            </Form.Group>
                    </Form> 
                </Media.Body>
            </Media>*/}
            
            <Form className="my-form">
  <Form.Group className="my-form-group">
    <Form.Label className="my-label">Stake</Form.Label>
    <Form.Control type="text" name="stake" value={stake} onChange={handleInputChange} className="my-input" />
  </Form.Group>
  <Form.Group className="my-form-group">
    <Form.Label className="my-label">Bet 1 Odds</Form.Label>
    <Form.Control type="text" name="bet1Odds" value={bet1Odds} onChange={handleInputChange} className="my-input" />
  </Form.Group>
  <Form.Group className="my-form-group">
    <Form.Label className="my-label">Choose Bet Type</Form.Label>
    <Row>
      <Col xs={6}>
        <Form.Check
          type="radio"
          label="Positive"
          id="positive"
          name="betType"
          value="positive"
          checked={betType === 'positive'}
          onChange={handleBetTypeChange}
          className="my-radio"
        />
      </Col>
      <Col xs={6}>
        <Form.Check
          type="radio"
          label="Negative"
          id="negative"
          name="betType"
          value="negative"
          checked={betType === 'negative'}
          onChange={handleBetTypeChange}
          className="my-radio"
        />
      </Col>
    </Row>
  </Form.Group>
  <Button onClick={calculatePayout} className="my-button">Calculate Payout</Button>
  <span className="my-result">{totalWin}</span>
  <span className="my-result">{totalPayout}</span>
</Form>

        </>
    );
};

