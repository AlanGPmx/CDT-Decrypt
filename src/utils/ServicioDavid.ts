import axios from 'axios';

const ipDavis = 'http://10.51.216.49:8080/api/decrypt';

export const testServiceDavis = async () => {
	return await axios
		.post(ipDavis, {
			key: '',
			data: {status: 'UP'},
		})
		.then(function (response) {
			return response;
		})
		.catch(function (error) {
			console.log(error);
		});
};

export const useServiceDavis = async (key: string, data: {}) => {
	console.log(typeof data);

	return await axios
		.post(ipDavis, {
			key,
			data,
		})
		.then(function (response) {
			console.log(response);
			return response.data;
		})
		.catch(function (error) {
			console.log(error);
		});
};
