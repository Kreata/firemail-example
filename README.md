# Firemail Example App

## Usage

**Step 1**

Install firemail app with volo

```bash
git clone git@github.com:andris9/firemail.git
cd firemail
volo install
```

**Step 2**

Install the application to the FirefoxOS simulator (use the [manifest file](manifest.webapp) in the root directory)

**Step 3**

Open the application in the simulator.

## Run tests

To run all tests, install and start the test SMTP server

```bash
cd test/smtpServer
npm install
npm start
```

Open the example app in the simulator and click on the Unit Tests button.

## License

**MIT**