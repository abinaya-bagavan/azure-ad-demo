import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./authConfig";
import { callMsGraph } from './graph'

function App() {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const handleButton = () => {
    instance.loginPopup(loginRequest).catch((e) => {
      console.log(e);
    });
  };
  const ProfileData = () => {
    // Silently acquires an access token which is then attached to a request for MS Graph data
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        callMsGraph(response.accessToken).then((response) =>
          setGraphData(response)
        );
      });
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Button variant="primary" onClick={() => handleButton()}>
          Log in
        </Button>
        {accounts[0]?.name && (
          <>
            <h5 className="card-title">Welcome {accounts[0].name}</h5>
            <Button variant="primary" onClick={ProfileData}>Get Profile info</Button>
            {graphData && (
              <>
                <p>
                  <strong>First Name: </strong> {graphData.givenName}
                </p>
                <p>
                  <strong>Last Name: </strong> {graphData.surname}
                </p>
                <p>
                  <strong>Email: </strong> {graphData.userPrincipalName}
                </p>
                <p>
                  <strong>Id: </strong> {graphData.id}
                </p>
              </>
            )}
          </>
        )}
      </header>
    </div>
  );
}

export default App;
