import React, { useState } from 'react';
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Navbar,
  Nav,
} from 'react-bootstrap';
import './login-view.scss';

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    /* Send a request to the server for authentication */
    axios
      .post('https://myflixmovieapp.herokuapp.com/login', {
        Username: username,
        Password: password,
      })
      .then((response) => {
        const data = response.data;
        props.onLoggedIn(data);
      })
      .catch((e) => {
        console.log('no such user');
      });
  };
  /* then call props.onLoggedIn(username) */
};

return (
  <form>
    <label>
      Username:
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
    </label>
    <label>
      Password:
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
    </label>
    <button type="button" onClick={handleSubmit}>Submit</button>
    <h5>Not yet registered?</h5>
    <Link to={`/register`}>
      <Button variant='dark link'>
        <h5>Register Here</h5>
      </Button>
    </Link>
  </form>
);
