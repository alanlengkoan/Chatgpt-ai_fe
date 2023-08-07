import axios from "axios";

let baseURL;

if (import.meta.env.VITE_APP_STAGE === 'dev') {
  baseURL = 'http://localhost:3000';
} else {
  baseURL = import.meta.env.VITE_APP_URL;
}

export default axios.create({
  baseURL: baseURL,
});