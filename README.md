# Passport.js Demo Application

This node application provides a demo into how to implement a third-party login Strategy (in this case GitHub) with [passport.js](http://www.passportjs.org/).

## Instructions

1. First, you'll need to clone the repo into your projects directory
1. Next, make sure you run `npm install` to get all the project dependencies
1. Then, ***create a copy*** of the `.env.example` file and rename the copy to `.env`. Note that this new file will not get commited to git. For more information on dotenv files, [read this](https://dev.to/getd/how-to-manage-secrets-and-configs-using-dotenv-in-node-js-and-docker-2214)
1. Once you've created a [new GitHub OAuth Application](https://github.com/settings/applications/new), copy the client id  and client secret into your `.env` file
1. Run `npm start` and then open the browser at the URL in the console to test the login.