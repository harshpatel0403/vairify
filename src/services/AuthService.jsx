import requests from "./httpService";

const AuthService = {
    Login(body) {
        return requests.post(`/users/login`, body);
    },
    register(body) {
        return requests.post(`/users/create`, body);
    },
    getAllCountries(body) {
        return requests.get(`/country/all`, body);
    },
};

export default AuthService;
