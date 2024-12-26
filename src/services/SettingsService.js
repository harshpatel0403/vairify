import requests from "./httpService"

const SettingsService = {
    updatePushNotification: (body) => {
        return requests.post('/settings/push-notification/status', body)
    },
    getPushNotificationStatus: () => {
        return requests.get('/settings/push-notification/status')
    },
    getDateHistory: () => {
        return requests.get('/settings/date-history')
    }
}

export default SettingsService