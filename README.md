# Chatter

## Description

Chatter is a chat application where users can join chat rooms and send messages to one another. Users can see a list of who is currently in their room. System messages are sent when new users join or leave the room. Users can also share their location with other users which will send the room a link to Google Maps for their coordinates, if the user gives permission.

## Tools

- Node
- TypeScript
- Express
- Socket.io
- Bad-words
- Mustache
- Moment.js
- Qs

## Installation

1. Make sure you have [Node.js](https://nodejs.org/en/) installed.

2. Clone the repo from GitHub [here](https://github.com/sossw1/Chatter).

3. Install all dependencies using npm:

```
npm install
```

or yarn

```
yarn install
```

## Configuration

To configure this application, create `dev.env` and `test.env` files with your sensitive information.

## Usage

Either go to the deployed app, or follow the instructions in the [installation](#installation) section.

## Contributing

If you would like to contribute to this project, please submit a pull request.

## Testing

This repository includes tests written in Jest and has ts-jest included in the development dependencies. Tests can be written in TypeScript in files with the `.test.ts` extension and will be run with the command below if they are in the `/tests` directory:

```
npm test
```

or to re-run tests on file updates:

```
npm run test-watch
```

## License

This project is licensed under the MIT License. See the [License](./LICENSE) file for details.
