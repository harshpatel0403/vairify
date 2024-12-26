import { instance as axios } from "./services/httpService";
const convertedVapidKey = urlBase64ToUint8Array(import.meta.env.VITE_APP_PUBLIC_VAPID_KEY);


function urlBase64ToUint8Array(base64String = '') {
  const padding = "=".repeat((4 - base64String.length % 4) % 4)
  // eslint-disable-next-line
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64) || ''
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function sendSubscription(subscription) {

  let savedToken = localStorage.getItem('notificationToken')
  if (!savedToken) {
    return axios.post('/notification/subscribe', subscription).then(() => { localStorage.setItem('notificationToken', JSON.stringify(subscription)) })
  } else {
    savedToken = JSON.parse(savedToken)
    if (savedToken?.keys?.auth !== JSON.parse(JSON.stringify(subscription))?.keys?.auth) {
      console.log(savedToken?.keys?.auth)
      return axios.post('/notification/subscribe', subscription).then(() => { localStorage.setItem('notificationToken', JSON.stringify(subscription)) })
    }
    return null;
  }


  //   return fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/notification/subscribe`, {
  //     method: 'POST',
  //     body: JSON.stringify(subscription),
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   })
}

function sendUnSubscription(subscription) {
  axios.post('/notification/unsubscribe', subscription).then(() => {
  }).catch((error) => console.log(error)).finally(() => {
    localStorage.removeItem("authorization");
    if (window.location.pathname !== "/login") {
      // window.location = '/login'
    }
  })
}

export function subscribeUser() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function (registration) {
      if (!registration.pushManager) {
        console.log('Push manager unavailable.')
        return
      }

      registration.pushManager.getSubscription().then(function (existedSubscription) {
        if (existedSubscription === null) {
          console.log('No subscription detected, make a request.')
          registration.pushManager.subscribe({
            applicationServerKey: convertedVapidKey,
            userVisibleOnly: true,
          }).then(function (newSubscription) {
            console.log('New subscription added.')
            sendSubscription(newSubscription)
          }).catch(function (e) {
            if (Notification.permission !== 'granted') {
              console.log('Permission was not granted.')
            } else {
              console.error('An error ocurred during the subscription process.', e)
            }
          })
        } else {
          console.log('Existed subscription detected.')
          sendSubscription(existedSubscription)
        }
      })
    })
      .catch(function (e) {
        console.error('An error ocurred during Service Worker registration.', e)
      })
  }
}

export function unsubscribeUser() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function (registration) {
      if (!registration.pushManager) {
        console.log('Push manager unavailable.')
        return
      }

      registration.pushManager.getSubscription().then(function (subscription) {
        if (subscription) {
          subscription.unsubscribe().then(function (successful) {
            localStorage.removeItem("notificationToken")
            console.log('Unsubscribed successfully.');
            // You can also notify the server here that the user has unsubscribed
            sendUnSubscription(subscription)
            // Optionally, update your UI or perform any other necessary actions

          }).catch(function (e) {
            console.error('Failed to unsubscribe:', e);
          });
        } else {
          console.log('No subscription available to unsubscribe.');
        }
      }).catch(function (e) {
        console.error('Error when retrieving subscription:', e);
      });
    }).catch(function (e) {
      console.error('Error when getting Service Worker registration:', e);
    });
  }
}