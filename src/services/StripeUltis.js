import { instance as axios } from "./httpService";

export const GetClienSevert = (amounts, currecnys, emails, names, phones, dess, stdess, invouiceId) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${import.meta.VITE_APP_API_BASE_URL}create-payment-intent-customers`, null, {
          params: {
            total: amounts,
            currency: currecnys,
            email: emails,
            name: names,
            phone: phones,
            des: dess,
            stdes: stdess,
            invoiceId: invouiceId,
          },
        }
        )
        .then(function (response) {
          resolve(response.data);
        })
        .catch(function (error) {
          reject(error.response.data);
        });
    });
  };