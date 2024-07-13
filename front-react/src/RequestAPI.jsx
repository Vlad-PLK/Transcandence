import axios from 'axios';

const RequestAPI = async (endpoint, data) => {
    try {
        const response = await axios.post(`http://localhost:8000/${endpoint}`, data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export default RequestAPI;