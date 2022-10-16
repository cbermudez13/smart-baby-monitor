# Smart Baby Monitor
This application is integrated with AWS Amplify and uses react native and expo

Getting started:
- Install Amplify CLI, expo CLI, react native libraries or any other libraries as needed:
    - npm install
    - npm install -g expo-cli
    - npm install aws-amplify aws-amplify-react-native 
    amazon-cognito-identity-js @react-native-community/netinfo @react-native-async-storage/async-storage @react-native-picker/picker
    - amplify pull --appId d1nivy287o14vl --envName staging
- To run live server: expo start
- To use IOS environment: Scan qr code and run expo server on IOS using expo go app (download from App Store)

Notes: 
This application uses the following technologies:

AWS Amplify, Expo, React Native, AWS AppSync, AWS CloudFormation
AWS Kinesis Streams, AWS IoT Core, GraphQL, REST APIs.

"amplify function build" builds all of your functions currently in the project
"amplify mock function <functionName>" runs your function locally
To access AWS resources outside of this Amplify app, edit the .\amplify\backend\function\smartbabymonitor3a1c4aa4\custom-policies.json
"amplify push" builds all of your local backend resources and provisions them in the cloud
"amplify publish" builds all of your local backend and front-end resources (if you added hosting category) and provisions them in the cloud
