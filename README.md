# Firemail Example App

Example application for sending e-mails from FirefoxOS. Also includes unit test runner for [firemail](http://github.com/andris9/firemail) module (tests need to be run from FirefoxOS as socket support is not available in regular Firefox).

![firemail](http://tahvel.info/firemail2.png)

## Usage

**Step 1**

Install firemail application with volo

```bash
git clone git@github.com:Kreata/firemail-example.git
cd firemail-example
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