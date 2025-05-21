import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchDevices = async () => {
  try {
    const response = await axios.get(`${API_URL}/devices`);
    return response.data;
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw error;
  }
};

export const fetchVlans = async () => {
  try {
    const response = await axios.get(`${API_URL}/vlans`);
    return response.data;
  } catch (error) {
    console.error('Error fetching VLANs:', error);
    throw error;
  }
};

export const fetchRules = async () => {
  try {
    const response = await axios.get(`${API_URL}/rules`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rules:', error);
    throw error;
  }
};

export const updateRules = async (rules) => {
  try {
    const response = await axios.post(`${API_URL}/rules`, rules);
    return response.data;
  } catch (error) {
    console.error('Error updating rules:', error);
    throw error;
  }
};

export const simulateDevice = async (deviceData) => {
  try {
    const response = await axios.post(`${API_URL}/simulate`, deviceData);
    return response.data;
  } catch (error) {
    console.error('Error simulating device:', error);
    throw error;
  }
};