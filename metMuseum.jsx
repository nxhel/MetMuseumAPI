"use-strict";

const { useState } = React;

/** 
 * SearchForum Component
 * @param {string}  userInput this prop Contains the value of the Seach TextBox
 * @param {Function} setUserChoice This prop is a Component(setter) of my userInput State
 * @param {Function} handleInput This prop is a Function that will be called once the form is Submitted
 * @returns {JSX.Element} a form Component
 */
function SearchForum({ userInput, setUserChoice, handleInput }) {
  return (
    <form onSubmit={ (e)=>{ e.preventDefault(); handleInput()}}>
      <input type="text" placeholder="Looking For" value={userInput} onChange={(e) => setUserChoice(e.target.value)}/>
      <button type="submit">Search</button>
    </form>
  );
}

/** 
 * ArtElementDetails Component
 * @param {object} detailedView this prop (detailedView state) contains all the information of an objectId
 * @returns {JSX.Element} A div containinng all the selected information from the detailedView object/state
 */
function ArtElementDetails ( {detailedView}){
    return (
        <div>
            <h2>{detailedView.title}</h2>
            <div className="artist_info">
              <p>{detailedView.artistDisplayName}</p>
              <p>{detailedView.artistDisplayBio}</p>
              <p></p>
            </div>
            <ArtImage detailedView={detailedView} />
            <dl>
              <dt>Medium:</dt>
              <dd>{detailedView.medium}</dd>
            </dl>
            <dl>
              <dt>Dimension:</dt>
              <dd>{detailedView.dimensions}</dd>
            </dl>
            <dl>
              <dt>Culture:</dt>
              <dd>{detailedView.culture}</dd>
              <dd>{detailedView.periode}</dd>
            </dl>
        </div>
    );
}

/**
 * ArtImage Component
 * @param {object} detailedView this prop (detailedView state) contains all the information of an objectId
 * @returns {JSX.Element} an img tag with its respective src , title and alt.
 */
function ArtImage ( {detailedView}){
    return (
        <img id="returned-image" src={detailedView.primaryImageSmall} alt={detailedView.classification} title={detailedView.objectName}/>
    );
}


function App() {
  const [userInput, setUserInput] = useState('');
  const [listItems, setListItems] = useState([]);
  const [detailedView, setDetailedView] = useState({});

  const AllListItems = () => {
    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?q=${userInput}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Not 2xx response');
        }
        return response.json();
      })
      .then(data => {
        setListItems(Array.from(data.objectIDs));
      })
      .catch(err => {
        console.error('Error:', err);
      });
  };

/**
* Adds a class when an element is clicked and fetches to get details on the ObjId 
* @param {Event} event e 
* @param {string} objectID - the Id of the Object from the list .
*/
  function handleListItemClick(e, objectID) {
    e.target.classList.add('selected');
    fetchData(objectID);
  }

  const fetchData = (objectID) => {
    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Not 2xx response');
        }
        return response.json();
      })
      .then( theData => {
        if(theData.primaryImageSmall==""){
            theData.primaryImageSmall=`./notAvailable1.jpg`;
        }
        setDetailedView(theData);
      })
      .catch(err => {
        console.error('Error:', err);
      });
  };

  return (
    <div className="wrapper">
      <header>
        <h1>The Metropolitan Museum of Art</h1>
        <SearchForum userChoice={userInput} setUserChoice={setUserInput} handleInput={AllListItems}/>
        <ul>
            { listItems.map((objId, index) =>(<li key={index} onClick={(e) => handleListItemClick(e, objId)}>{objId}</li>))}
        </ul>
      </header>
      <main>
      {Object.keys(detailedView).length > 0 ? 
        (<div><ArtElementDetails detailedView={detailedView} /></div>) : (<h2>Welcome to the Metropolitan Museum Of Art. Please Type in Your Search</h2>)
        }
      </main>
    </div>
  );
}
ReactDOM.render
(
    <App />, 
    document.querySelector("#react-root")
);
