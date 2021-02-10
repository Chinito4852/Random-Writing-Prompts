import './App.css';
import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import {Spinner, Card, Button, Navbar, CardColumns, Form, Nav} from 'react-bootstrap';

function App() {

  // URL for django REST api
  const BASE_URL = `http://localhost:8000/`;

  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.withCredentials = true;

  // Declare state variables (the pair returned is a varaible and a function to update it)
  const [randomPrompt, setRandomPrompt] = useState("");
  const [fetchedRandom, setFetchedRandom] = useState(false);
  const [fetchedSaved, setFetchedSaved] = useState(false);
  const [promptType, setPromptType] = useState("quickplot");
  const [randomView, setRandomView] = useState(true);
  const [savedPrompts, setSavedPrompts] = useState([]);

  // Use object to map prompt types to url parameters
  //let promptType = "quickplot";
  let promptTypeMap = {};
  promptTypeMap["quickplot"] = "quick/";
  promptTypeMap["dialogue"] = "dialogue/";
  promptTypeMap["firstline"] = "first/";
  promptTypeMap["traits"] = "traits/";

  // useEffect() runs when the component is mounted or updated
  useEffect(() => {
    fetchRandomPrompt();
    fetchSavedPrompts();
  });

  // Fetch a random prompt from the API
  const fetchRandomPrompt = () => {
    if (!fetchedRandom) {
      axios.get('/'.concat(promptTypeMap[promptType]))
      .then(res => {
        setRandomPrompt(res.data);
      })
      .catch(error => console.log(error));
      setFetchedRandom(true);
    }
  }

  // Fetch the saved prompts from the backend server API
  const fetchSavedPrompts = () => {
    if (!fetchedSaved) {
      axios.get('/'.concat("api/prompts"))
      .then(res => {
        //savedPrompts = res.data;
        setSavedPrompts(res.data);
      })
      .catch(error => console.log(error));
      setFetchedSaved(true);
    }
  }

  // Show the App component's body
  const showBody = () => {
    if (randomPrompt !== "") {
      if (randomView) return showRandomPromptCard();
      else return showSavedPrompts();
    }
    else return showLoader();
  }

  // Show the fetched prompt
  const showRandomPromptCard = () => {
    return (
      <Card className="prompt random-prompt">
        <Card.Body>
          <Card.Title className="prompt-title random-title">Random {promptType}</Card.Title>
          <Card.Text className="random-text">
            {getRandomPromptText()}
          </Card.Text>
          {showButtons()}
        </Card.Body>
      </Card>
    );
  }

  // Format the random prompt text
  const getRandomPromptText = () => {
    if (promptType === "dialogue" && randomPrompt !== "") return "\"" + randomPrompt + "\"";
    else return randomPrompt;
  }

  // Handler function for when the user chooses to get another random prompt
  const buttonClick = (pType) => {
    setPromptType(pType);
    setRandomPrompt("");
    setFetchedRandom(false);
  }

  // Function to return a div for all buttons concerning random prompts
  const showButtons = () => {
    if (randomPrompt !== "") return (
      <div className="button-group">
      <Button className="prompt-button" variant="primary" onClick={() => {buttonClick("quickplot")}} >Get a quick plot</Button>
      <Button className="prompt-button" variant="primary" onClick={() => {buttonClick("dialogue")}} >Get dialogue</Button>
      <Button className="prompt-button" variant="primary" onClick={() => {buttonClick("firstline")}} >Get a first line</Button>
      <Button className="prompt-button" variant="primary" onClick={() => {buttonClick("traits")}} >Get personality traits</Button>
      <Button className="prompt-button" variant="primary" onClick={handleSave} >Save Prompt</Button>
      </div>
    );
  }

  // Save a random prompt
  const handleSave = () => {
    axios.post('/'.concat("api/prompts/"), {promptType: promptType, text: randomPrompt})
    .then(res => {
      alert("Saved prompt!");
      setFetchedSaved(false);
    })
    .catch(error => alert(error));
  }

  // Show all saved prompts (calls the showPrompt function)
  const showSavedPrompts = () => {
    if (savedPrompts.length > 0) {
      return (
        <CardColumns className="saved-deck">
          {savedPrompts.slice().reverse().map((prompt, index) => showPrompt(prompt, index))}
        </CardColumns>
      );
    }
    else {
      return (
        <Card className="prompt random-prompt">
          <Card.Body>
            <Card.Title className="prompt-title random-title">No Prompts!</Card.Title>
            <Card.Text className="random-text">
              Try saving some prompts.
            </Card.Text>
          </Card.Body>
        </Card>
      );
    }
  }

  // Show a saved prompt
  const showPrompt = (prompt, index) => {
    return (
      <Card key={index} className="prompt saved-prompt">
        <Card.Body>
          <Card.Title className="prompt-title">{prompt.promptType}</Card.Title>
          <Card.Text>
            {prompt.text}
          </Card.Text>
          <Button variant="primary" onClick={() => {handleDelete(prompt.id)}}>Delete</Button>
        </Card.Body>
      </Card>
    );
  }

  // Delete a prompt
  const handleDelete = (id) => {
    axios.delete('/'.concat(`api/prompts/${id}`))
    .then(res => {
      alert("Deleted prompt.");
      setFetchedSaved(false);
    })
    .catch(error => alert(error));
  }

  // Show a loader (if the prompt has not finished loading)
  const showLoader = () => {
    return (
      <Spinner animation="border" role="status" variant="primary" className="loader">
        <span className="sr-only">Loading...</span>
      </Spinner>
    );
  }

  // Show top navbar
  const showNavbar = () => {
    return (
      <Navbar variant="dark" bg="dark">
        <Navbar.Brand href="#">Writing Prompts</Navbar.Brand>
        <Button className="ml-auto" variant="success" onClick ={() => {setRandomView(!randomView)}}>
          {(() => {return randomView ? "Saved prompts" : "Random prompt";})()}
        </Button>
      </Navbar>
    );
  }
  
  // Show footer
  const showFooter = () => {
    return (
      <Navbar className="footer" variant="dark" bg="dark">
        <Nav.Link className="ml-auto link" href="http://pitt.edu/~abg41/posts/prompts.html"> API provided by http://pitt.edu/~abg41/posts/prompts.html</Nav.Link>
      </Navbar>
    );
  }

  // Render App component
  return (
    <div>
      {showNavbar()}
      {showBody()}
      {showFooter()}
    </div>
  );
}

export default App;
