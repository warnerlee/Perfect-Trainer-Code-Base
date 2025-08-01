#Running the project locally:
    This project can be broken into 2 distinct folders: "client" and "server"
    In order to run the project you first need to create a file named .env in the server folder.
    This env folder will contain environment variables for connecting to the database and decoding passwords.
    -JWT_SECRET
    -DATBASE_URL
    The above are the two variables you need.
    If your wish to have your own independent DB then you can look up a jwt secret generator and create it.
    You will also need to set up postgress locally and create a connection string which will follow this format:
    -postgresql://user:password@localhost/mydatabase
    -If you do not want to set up locally I will send you the dev .env file
    You will also need to create a file named .gitignore in the server folder with the following lines:
    .env
    /node_modules
    /generated/prisma
    This will prevent sensitive and non useful data from being pushed to github

    Now that we have the intial files set up and the repository pulled locally from the master branch, we will need to install dependencies.
    Open both the server and client folders in a cmd terminal and run npm install for each. This will install all the relevant npm packages
    After this in the seperate cmd terminals you will need to run "nodemon start" in the server cmd, this will start the server
    nodemon lets us run our projects and will auto restart/apply code when it is saved.
    In the client cmd type "npm start" this will take some time but will eventually run the front end react site on your default browser.

    Making Changes:
    While we want to improve the code base we will need to use version control in order to make sure we do not break anything or step on eachothers toes for now we can use basic branching, make sure to familiarize yourself with the first few lessons of:
    https://learngitbranching.js.org/?locale=en_US
    Any time you try to merge back into master I'll need to approve it and review to make sure code changes arent conflicting with my current branch.

    To Do:

    src/
├── models/
│   ├── BaseModel.js
│   ├── User.js
│   ├── Trainer.js
│   └── Admin.js
├── services/
│   ├── AuthService.js
│   ├── CredentialService.js
│   └── JobService.js
├── controllers/
│   ├── TrainerController.js
│   ├── AdminController.js
│   └── AuthController.js
├── middleware/
│   └── AuthMiddleware.js
├── routes/
│   ├── trainer.js
│   ├── admin.js
│   └── auth.js
└── database.js

This should outline the structure we wish to implement. I am working on the class diagrams for each but to summarize:
We want a layered architecture that includes 4 key components:
-Models - Classes designed to perform our postgresql operations.
-Services - Classes designed to use models and manipulate/send data between different models
-Contollers - handle http req and res along with validation for req. This will send the data to relevant services.
-Middleware - which just handles authentication abd authorization of tokens.
