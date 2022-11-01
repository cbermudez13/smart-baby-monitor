import React from 'react';
import { Amplify, PubSub, Auth } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import awsmobile from '../../aws-exports'

Amplify.configure(awsmobile);

var SUB_TOPIC = "esp32/pub";
var PUB_TOPIC = "esp32/sub";

// Apply plugin with configuration
Amplify.addPluggable(new AWSIoTProvider({
  aws_pubsub_region: 'us-east-1',
  aws_pubsub_endpoint: 'wss://aoa59ba33x299-ats.iot.us-east-1.amazonaws.com/mqtt',
}));

Auth.currentCredentials().then((info) => {
  const cognitoIdentityId = info.identityId;
  console.log(cognitoIdentityId);
});


PubSub.subscribe(SUB_TOPIC).subscribe({
  next: data => console.log('Message received', data.value),
  error: error => console.error(error),
  complete: () => console.log('Done'),
});

const SensorScreen = () => {
  /*
  * Find a way to display sensor data on mobile app
  * data.value.farenheit ---> display farenheit value
  *
  */
    
}

export default SensorScreen;