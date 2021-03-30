import { memo } from 'react';
import './card.scss';

const Card = ({id, title, description, removeCard}) => {
  return (
  <div className="cardContainer">
    <div className="cardTitle">{title}</div>
    <div className="cardDescription">{description}</div>
    <div className="removeCard" onClick={removeCard}>X</div>
  </div>
  )
};

Card.defaultProps = {
  removeCard:()=>{}
}

export default memo(Card);