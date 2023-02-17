import axios from "axios";

const baseURL = 'https://cafe-app-native-production.up.railway.app/api';

const cafeApi = axios.create({ baseURL });





export default cafeApi

