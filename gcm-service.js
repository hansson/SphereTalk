var request = require('request');

function sendGCMMessage(data, regIds, gcmApiKey) {
    request(
    {
      method: 'POST',
      uri:'https://android.googleapis.com/gcm/send',
      headers: {'authorization': 'key=' + gcmApiKey},
      json: { 
        registration_ids: regIds,
        data: {data: data}
      } 
    },
    function (error, response, body) {});
}

exports.sendGCMMessage = sendGCMMessage;