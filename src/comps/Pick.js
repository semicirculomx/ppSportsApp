import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Media, Row, Col, Badge, Button, Modal, Form } from 'react-bootstrap';
import PostText from './PostText';
import ReactionsBar from 'features/posts/ReactionsBar'
import { dateConverter, gameDate } from 'utils/helpers';
import ReactTimeAgo from 'react-time-ago';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import Prompt from 'comps/prompt-modal';
import { useHistory } from 'react-router-dom';
import { removePick, updatePick } from 'features/picks/picksSlice';


function Pick({pick}) {
  let { user: authUser, isAuthenticated } = useSelector(state => state.auth)
  let { remove_status: status_remove } = useSelector(state => state.picks)
  let { update_status: status_update } = useSelector(state => state.posts)

  const [isExpanded, setIsExpanded] = useState(false);
  let [showPrompt, setShowPrompt] = useState(false)
  const dispatch = useDispatch();
  let [error, setError] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(pick.status);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEditModal = () => {
    setShowEditModal(!showEditModal);
  }

  const handleStatusChange = (e) => {
    e.preventDefault();
    setSelectedStatus(e.target.value);

  };

  const updatePickStatus = async () => {
    let body = { ...pick , status: selectedStatus }
    let action;
    try {
      if(pick.status !== selectedStatus)
       action = await dispatch(updatePick(body));
       if(action.type === 'picks/updatePick/fulfilled')
          setShowEditModal(false);
    } catch (error) {
      setError(error);
    }
  };

  const getBadgeClass = (status) => {
    switch (status) {
      case "won":
        return "bg-won";
      case "lost":
        return "bg-lost";
      case "void":
        return "bg-void";
      case "pending":
        return "bg-pending";
      case "cashback": // Aquí está la corrección
        return "bg-cashback";
      case "canceled":
        return "bg-canceled";
      case "half-won":
        return "bg-won";
      case "half-lost":
        return "bg-won";
      default:
        return "bg-pending";
    }
  }
  
  const getBadgeText = (status) => {
    switch (status) {
      case "won":
        return "Ganada";
      case "lost":
        return "Perdida";
      case "void":
        return "Anulada";
      case "pending":
        return "Pendiente";
      case "cashback":
        return "Reembolsada";
      case "canceled":
        return "Cancelada";
      case "half-won":
        return "Mitad ganada";
      case "half-lost":
        return "Mitad perdida";
      default:
        return "Desconocido";
    }
  }  
  const handleConfirmDelete = async () => {
    try {
      setShowPrompt(false)
      let action = await dispatch(removePick(pick?._id))
      if (action.type === 'picks/removePick/fulfilled') console.log('deleted', action)
    } catch (error) {
      setError(error)
    }
  }
  const deletePick = () => {
    setShowPrompt(true)
  }
  const handleCancelDelete = () => {
    setShowPrompt(false)
  }
  return (
    <>
      <div onClick={handleExpandClick}>
      <div className="d-flex w-100 justify-content-between align-items-center mb-2">  
        <div>
        <h5 className="mb-0">{pick?.pick_title}</h5>
         <div className="mb-1 align-items-center">
            <span className="mr-1 text-muted">{pick?.stake}𝑢</span>
            <span className="mr-1 text-dark">|</span>
            <span className="mr-1 text-muted">${pick?.profit.toFixed(2)}</span>
            {/* <small>hace <ReactTimeAgo date={Date.parse(pick?.created_at)} timeStyle="twitter" /></small> */}
            </div>
            <div className="align-items-center">
            <span className="mr-1 text-dark badge">Cuota: {pick?.totalOdds}</span>
            <span className="mr-1 ">|</span>
            <span className="mr-1 text-dark badge">ROI: {(((pick?.profit.toFixed(2)/(pick?.stake*250)))*100).toFixed(2)}%</span>
            {/* <small>hace <ReactTimeAgo date={Date.parse(pick?.created_at)} timeStyle="twitter" /></small> */}
            </div>
        </div>
            <span className={`badge ${getBadgeClass(pick?.status)}`}>
              {getBadgeText(pick?.status)}
            </span>
        </div>
        {isExpanded && (
          <div className="expanded-info">
            {pick &&
              pick?.bets.length > 0 &&
              pick?.bets.map((bet) => (
                <div className="bet-item" key={bet._id}>
                  <div className="timeline"></div>
                  <div className="bet-content">
                    <div className="mb-1 d-flex justify-content-between align-items-center">
                      <p className="w-75 mb-0">
                        {bet.market}
                      </p>
                      <p className="mb-0 font-weight-bold">
                        {(bet.odds > 0) ? `+${bet.odds}`: (bet.odds)}
                      </p>
                    </div>
                    <div className="mb-1 d-flex justify-content-between align-items-center">
                      <span className="w-75">
                      {(bet.match.home_team && bet.match.away_team)? `${bet.match.home_team} vs ${bet.match.away_team}`: bet.match.matchTitle } - {dateConverter(bet.match.commence_time)}
                      </span>
                    </div>
                    <div className="d-flex w-100 justify-content-between align-items-center">
                      <span className="text-muted">
                        {bet.match.competition} - {bet.match.sport}
                        <br />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
           {authUser?._id === pick?.user._id &&(
             <div className="d-flex w-100 justify-content-end align-items-center">

              <Button
                className="cutom-btn mx-1 btn-light btn-sm"
                onClick={handleEditModal}
              >
                <FontAwesomeIcon icon={faEdit}>Editar</FontAwesomeIcon>

              </Button>

              <Button
                className="cutom-btn mx-1 btn-light btn-sm"
                onClick={e => deletePick()}
              >
                <FontAwesomeIcon icon={faTrash}>Borrar</FontAwesomeIcon>

              </Button>
            </div> 
            )}
          </div>
        )}
      </div>
      <Prompt
        show={showPrompt}
        header="Seguro que quieres borrar este post?"
        body="No podrás recuperarlo"
        cancelText="Cancelar"
        confirmText="Borrar"
        handleConfirm={handleConfirmDelete}
        handleCancel={handleCancelDelete}
      />
      <Modal
        size="md"
        centered
        show={showEditModal}
        onHide={handleEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar estado del Pick</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="statusSelect">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                value={selectedStatus}
                onChange={handleStatusChange}
              >
                <option value="won">Ganada</option>
                <option value="lost">Perdida</option>
                <option value="void">Nulo</option>
                <option value="pending">Pendiente</option>
                <option value="cashback">Reembolsada</option>
                <option value="canceled">Cancelada</option>
                <option value="half-won">Mitad ganada</option>
                <option value="half-lost">Mitad perdida</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={updatePickStatus}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Pick;
