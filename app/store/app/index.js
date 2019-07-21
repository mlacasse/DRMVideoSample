import { ERROR } from './types';

const INITIAL_STATE = {
  apiKey: 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiYXBpIiwidWlkIjoiOWQxOWIzZWQtYzA1Zi00ZTBjLWEzMzgtNDE4NzA1MTAwZGEzIiwiYW5vbiI6ZmFsc2UsInBlcm1pc3Npb25zIjpudWxsLCJhcGlLZXkiOiI5ZDE5YjNlZC1jMDVmLTRlMGMtYTMzOC00MTg3MDUxMDBkYTMiLCJleHAiOjE1ODI3NTE4NDEsImlhdCI6MTUxOTY3OTg0MSwiaXNzIjoiT3JiaXMtT0FNLVYxIiwic3ViIjoiOWQxOWIzZWQtYzA1Zi00ZTBjLWEzMzgtNDE4NzA1MTAwZGEzIn0.iLa8Ch4k59Of4UL6mWJwHNeX-YBb4gcfsw46IMmbT9id-n-8Fj3g0Hz9l6d_GIZDz2Hi8OQsB-CFeycQGYBkgQ',
  username: 'tizen-test3@mailinator.com',
  password: 'Test1234!',
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
