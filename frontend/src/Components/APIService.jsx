
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const APIService = {
	sendQuery: (query) => {
		return axios.post(`${API_BASE_URL}/translate-query`, { query });
	  },
	
	  sendPdfAndQuery: (pdfFile, query) => {
		const formData = new FormData();
		formData.append('pdfFile', pdfFile);
		formData.append('query', query);
		return axios.post(`${API_BASE_URL}/translate-query-with-pdf`, formData, {
		  headers: {
			'Content-Type': 'multipart/form-data',
		  },
		});
	  },
};

export default APIService;