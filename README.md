# AWS LAMBDA FUNCTIONS DYNAMODB </br>
## Introduction </br>
Hey there 👋, This is a simple aws lambda function for adding, deleting, editing and getting data from dynamoDb . In these directories you will find the code for the aws lambda function apis. These are basic functions to perform single actions on the dynamoDb database using lambda functions </br>
 </br>
 
## Description </br>
This is a sample package.json file for a Node.js-based project called VSpace. It includes dependencies for popular Node.js modules such as Axios, Nodemailer, Sequelize, and Validator, as well as dev dependencies for testing with Mocha and Chai. The project uses the Serverless Framework for building serverless applications and includes plugins for running the application offline and pruning unused resources during deployment. The package.json file can be used as a starting point for building Node.js-based applications with similar dependencies and technologies.
</br>
This project serves as a foundation for developing a human resource management system for a software house. The system will likely involve serverless functions, API calls to other services, and a database for storing employee data.</br>
</br>
By using this project, the development team can ensure that the project has the necessary dependencies to implement key functionality, such as sending emails with Nodemailer, making HTTP requests with Axios, and validating user input with Validator.</br>
</br>
The dev dependencies for Mocha and Chai enable the team to write and run automated tests to ensure that the system is functioning correctly. Additionally, the nodemon package can be used during development to automatically restart the server when changes are made to the code.</br>
</br>
With the Serverless Framework, the team can easily deploy and manage the application on a cloud platform such as AWS Lambda, Azure Functions, or Google Cloud Functions. The serverless-offline plugin allows the team to test and debug the application locally before deploying it to the cloud, while the serverless-prune-plugin helps to optimize resource usage and reduce costs.</br>
</br>
Overall, this project provides a solid foundation for building a scalable and efficient human resource management system for a software house.</br>
</br>
</br>
## Tech Stack </br> 
AWS Lambda  </br>
Node JS </br>
DynamoDB Query operation </br> 
Aws-DynamoDb </br> 
Global secondary index (GSI) </br> 
Local secondary index (LSI) </br> 
S3 Bucket </br> 
Serverless Cloud </br>




# Features </br>
### Templates management:
• The system should allow administrators or authorized users to create, update, retrieve, and delete templates for different types of documents, such as reports, contracts, or emails. </br>
 </br>
### Team management:</br> 
• The system should enable administrators or authorized users to manage teams within the organization, including creating, updating, retrieving, and deleting team information such as team name, team leader, team members, and their roles. </br>
 </br>
### User registration:</br> 
•  The system should allow users to register for an account using their email address or other relevant information. The registration process may involve user validation, such as verifying email addresses or phone numbers. </br>
 </br>
### Workspace management:</br> 
•  The system should allow authorized users to assign workspaces to individual users or teams. This may involve managing user permissions, such as read or write access to specific workspaces or documents. </br>
 </br>
### Scoring system:</br> 
•  The system should enable authorized users to create, update, retrieve, and delete scores for individual users or teams. The scoring system may involve defining scoring criteria, such as quality, accuracy, or timeliness, and assigning scores based on the criteria. </br>
 </br>
 ### Score approval:</br> 
•  The system should allow authorized users to approve scores that have been submitted by other users or teams. The approval process may involve reviewing and verifying scores, providing feedback, and making corrections. </br>
 </br>
### User score retrieval:</br> 
•  The system should enable authorized users to retrieve scores for individual users or teams. Users may need to view their own scores or the scores of their team members, while team leaders or administrators may need to view scores for multiple teams or individuals. </br>
 </br>
### Score sending:</br> 
•  The system should enable authorized users, such as HR or team leads, to send scores to individual users or teams via email or other communication channels. The score sending process may involve generating reports or notifications, attaching documents or scores, and providing feedback. </br>
 </br>
 </br>
### Directory Structure . </br>
├── controllers/ </br>
│ ├── scores </br>
│ ├── teams </br>
│ ├── templates </br>
│ ├── user </br>
│ ├── worspaces </br>
├──db/ </br>
│ ├── Dao/ </br>
│ │ └── messages.js </br>
│ │ └── scores.js </br>
│ │ └── taskDao.js </br>
│ │ └── teamsDao.js </br>
│ │ └── templatesDao.js </br>
│ │ └── workspaceDao.js </br>
│ ├── models/ </br>
│ │ └── game.js </br>
├── services/ </br>
│ ├── validations/ </br>
│ │ └── playerValidation.js </br>
│ │ └── socketValidation.js </br>
│ │ └── tournamnetManagmentValidation.js </br>
│ │ └── validationMatch.js </br>
│ │ └── validationMeeting.js </br>
│ │ └── validationMessages.js </br>
│ │ └── validationStream.js </br>
│ │ └── validationTournament.js </br>
│ │ └── validationUser </br>
│ ├── API_RESPONSES.JS </br>
│ ├── checkRequiredFields.js </br>
│ ├── constants.js </br>
│ ├── helpers.js </br>
│ ├── publicServices.js </br>
│ └── webSocketMessage.js </br>
├──README.md </br>
 </br>
 </br>
 </br>
 
 # Installation Guide </br>
1 Make sure you have Node.js version 12 . You can check your Node.js version by running the command ```node -v``` in your terminal or command prompt. </br>
 </br>
2- Open a terminal or command prompt and navigate to the directory where you want to install the project. </br>
 </br>
3- Clone the project repository using the Git command git clone <repository-url>, replacing <repository-url> with the URL of the project repository. </br>
 </br>
4- Navigate to the project directory using the command cd <project-directory>, replacing <project-directory> with the name of the project directory that was created in step 3. </br>

5- Run the command ```npm install``` to install the project dependencies. </br>
 </br>
6- Add any necessary secret keys and access keys to the project configuration files. For example, you may need to add AWS access keys to the config.json file or API keys to the constants.js file. </br>
 </br>
7- Once the dependencies have finished installing, run the command ```npm run offline``` to start the project. This will start a local server running on your machine that you can use to test the project. </br>
 </br>
8- By following these instructions, you should be able to install and run the project on your local machine. Please note that you may need to modify these instructions slightly depending on your specific operating system and environment. </br>
</br> </br>
</br></br>
# Deploy To Live
Run this command to deploye your code live
```npm run deploye```


