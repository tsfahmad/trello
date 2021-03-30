import Card from './card';
import './trello-list.scss';

const DRAG_CONST_KEY = "$%%$_";

const TrelloList = ({list, listCardInfo, 
  cardDetails, addNewCard, deleteCardFromList, 
  deleteList, moveCardBetweenList}) => {

  const getList = (listId) => {
    const cardList = listCardInfo[listId];

    const handleDragStart = (event, id) => {
      event.dataTransfer.setData("text", `${DRAG_CONST_KEY}${id}`);
    }

    const handleOnDrop = (event, listId) => {
      event.preventDefault();
      const data = event.dataTransfer.getData("text");
      if(data.startsWith(DRAG_CONST_KEY)) {
        const cardId = data.slice(DRAG_CONST_KEY.length)
        if(cardId && listId) {
          moveCardBetweenList(cardId, listId);
        }
      }
    }

    return (
      <div className="listContainer" key={listId}>
        <div className="listHeader">{listId}</div>
        <div className="deleteList" onClick={() => deleteList(listId)}>X</div>
        <div className="itemContainer"  onDrop={(event) => handleOnDrop(event, listId)} onDragOver={(e) => e.preventDefault()}>
          {cardList.map((id) => {
            const {title, description} = cardDetails[id];
            return (
              <div key={id} className="draggableContainer" draggable="true" onDragStart={(event) => handleDragStart(event, id)}>
                <Card 
                  id={id}
                  title={title} 
                  description={description} 
                  removeCard={() => deleteCardFromList(id)}
                />
              </div>
              )
          })}
        </div>
        <div className="addCard" onClick={() =>addNewCard(listId)}> + </div>
      </div>
    );
  }

  return (
  <div className="trelloContainer"> 
    {list.map(getList)} 
  </div>);
};

export default TrelloList;