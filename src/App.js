import TrelloList from './components/trello-list';
import './App.css';
import useLocalStorage from "./hooks/useLocalstorage";
import { MOCK_LIST, MOCK_LIST_CARD_MAP, MOCK_CARD_DETAILS } from "./mock/inital-data";

function App() {
  const [list, setList] = useLocalStorage('list', MOCK_LIST);
  const [listCardInfo, setListCardInfo] = useLocalStorage('listCardInfo', MOCK_LIST_CARD_MAP);
  const [cardDetails, setCardDetails] = useLocalStorage('cardDetails', MOCK_CARD_DETAILS);


  const addNewList = () => {
    const listName = prompt("New List name ?");
    if(listName) {
      const newListCardInfo = {...listCardInfo, [listName]: []};
      setListCardInfo(newListCardInfo);
      setList([...list, listName]);
    }
  }

  const addNewCard = (listId) => {
    const cardTitle = prompt("Title ?");
    const description = prompt("Description ?");
    if(cardTitle && description) {
      const cardId = cardTitle;
      const newCard = {
        id: cardId,
        title: cardTitle,
        description: description,
        listId,
      }

      // Add card info
      const newCardDetails = {[cardId]: newCard, ...cardDetails};
      setCardDetails(newCardDetails);

      // Update cardId in list
      const updatedCards = [cardId, ...listCardInfo[listId]];
      const newListInfo = {...listCardInfo, [listId]: updatedCards};
      setListCardInfo(newListInfo);
    }
  }

  const moveCardBetweenList = (cardId, newListId) => {
    const cardInfo = cardDetails[cardId];
    const { listId } = cardInfo;
    if(listId === newListId) return;

    // Update list id in card
    const newCardInfo = {...cardInfo};
    newCardInfo.listId = newListId;
    setCardDetails({...cardDetails, [cardId]: newCardInfo});

    //Remove cardId from old list
    const cardList = listCardInfo[listId];
    const newCardList = cardList.reduce( (acc, itemName) => {
      if(itemName !== cardId) {
        acc.push(itemName)
      }
      return acc;
    }, []);
    // Add cardId into New List
    const updatedCards = [cardId, ...listCardInfo[newListId]];
    // Update the list
    const newListInfo = {...listCardInfo, [listId]: newCardList, [newListId]: updatedCards};
    setListCardInfo(newListInfo);
  }

  const deleteCardFromList = (cardId) => {
    const cardInfo = cardDetails[cardId];

    const { listId } = cardInfo;
    const cardList = listCardInfo[listId];
    const newCardList = cardList.reduce( (acc, itemName) => {
      if(itemName !== cardId) {
        acc.push(itemName)
      }
      return acc;
    }, []);
    const newListInfo = {...listCardInfo, [listId]: newCardList};
    setListCardInfo(newListInfo);

    const {[cardId]: deletedCardInfo, ...newCardDetails} = cardDetails;
    setCardDetails(newCardDetails);
  }

  const deleteList = (listId) => {
    // delete cards in the list
    const cardList = listCardInfo[listId];
    const newCardDetails = {...cardDetails};
    cardList.forEach((cardId) => delete newCardDetails[cardId]);
    setCardDetails(newCardDetails);

    // delete from grouped info
    const newListInfo = {...listCardInfo};
    delete newListInfo[listId];
    setListCardInfo(newListInfo);

    // Delete from master list
    const newList = list.reduce( (acc, itemName) => {
      if(itemName !== listId) {
        acc.push(itemName)
      }
      return acc;
    }, []);
    setList(newList);
  }

  return (
    <div className="App">
      <h1>Trello Board</h1>
      <button onClick={addNewList}>Add List</button>
      <TrelloList 
        list={list}
        listCardInfo={listCardInfo}
        cardDetails={cardDetails}
        deleteList={deleteList}
        deleteCardFromList={deleteCardFromList}
        moveCardBetweenList={moveCardBetweenList}
        addNewCard={addNewCard}
      />
    </div>
  );
}

export default App;
