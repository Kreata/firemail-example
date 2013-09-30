
test("Create smtpclient object", function(){
    var client = smtpclient();
    ok(true, client instanceof smtpclient);
});

asyncTest("Connect to and disconnect from a testserver", function(){
    expect(2);

    var client = smtpclient("localhost", 1025);
    client.connect();

    client.onidle = function(){
        ok(1, "Connection opened");
        client.close();
    };

    client.onerror = function(err){
        ifError(err);
    };

    client.onclose = function(){
        ok(1, "Connection closed");
        start();
    };
});

asyncTest("Disconnect with QUIT", function(){
    expect(2);

    var client = smtpclient("localhost", 1025);
    client.connect();

    client.onidle = function(){
        ok(1, "Connection opened");
        client.quit();
    };

    client.onerror = function(err){
        ifError(err);
    };

    client.onclose = function(){
        ok(1, "Connection closed");
        start();
    };
});

asyncTest("Authenticate with default method", function(){
    expect(2);

    var client = smtpclient("localhost", 1025, {
        auth: {
            user: "testuser",
            pass: "testpass"
        }
    });

    client.connect();

    client.onidle = function(){
        ok(1, "Connection opened");
        client.quit();
    };

    client.onerror = function(err){
        ifError(err);
    };

    client.onclose = function(){
        ok(1, "Connection closed");
        start();
    };
});

asyncTest("Authenticate using PLAIN", function(){
    expect(2);

    var client = smtpclient("localhost", 1025, {
        auth: {
            user: "testuser",
            pass: "testpass"
        },
        authMethod: "PLAIN"
    });

    client.connect();

    client.onidle = function(){
        ok(1, "Connection opened");
        client.quit();
    };

    client.onerror = function(err){
        ifError(err);
    };

    client.onclose = function(){
        ok(1, "Connection closed");
        start();
    };
});

asyncTest("Authenticate using LOGIN", function(){
    expect(2);

    var client = smtpclient("localhost", 1025, {
        auth: {
            user: "testuser",
            pass: "testpass"
        },
        authMethod: "LOGIN"
    });

    client.connect();

    client.onidle = function(){
        ok(1, "Connection opened");
        client.quit();
    };

    client.onerror = function(err){
        ifError(err);
    };

    client.onclose = function(){
        ok(1, "Connection closed");
        start();
    };
});

asyncTest("Authenticate with invalid data", function(){
    expect(2);

    var client = smtpclient("localhost", 1025, {
        auth: {
            user: "testuser1",
            pass: "testpass1"
        },
        authMethod: "PLAIN"
    });

    client.connect();

    client.onidle = function(){
        ok(false, "Connection should not be opened, as authentication fails");
        client.quit();
    };

    client.onerror = function(err){
        ok(err, "Authentication error");
    };

    client.onclose = function(){
        ok(1, "Connection closed");
        start();
    };
});

asyncTest("MAIL FROM fails", function(){
    expect(3);

    var client = smtpclient("localhost", 1025);

    client.connect();

    var first = 0;

    client.onidle = function(){
        if(first++){
            ok(false, "Should not occur");
            client.quit();
            return;
        }
        ok(1, "Connection opened");
        client.useEnvelope({from: "fail@fail.ee"});
    };

    client.onerror = function(err){
        ok(err, "Mail validation failed");
    };

    client.onclose = function(){
        ok(1, "Connection closed");
        start();
    };
});

asyncTest("RCPT TO: fails (no recipients)", function(){
    expect(3);

    var client = smtpclient("localhost", 1025);

    client.connect();

    var first = 0;

    client.onidle = function(){
        if(first++){
            ok(false, "Should not occur");
            client.quit();
            return;
        }
        ok(1, "Connection opened");
        client.useEnvelope({from: "nofail@fail.ee"});
    };

    client.onerror = function(err){
        ok(err, "Mail validation failed");
    };

    client.onclose = function(){
        ok(1, "Connection closed");
        start();
    };
});

asyncTest("RCPT TO: fails (invalid recipient)", function(){
    expect(3);

    var client = smtpclient("localhost", 1025);

    client.connect();

    var first = 0;

    client.onidle = function(){
        if(first++){
            ok(false, "Should not occur");
            client.quit();
            return;
        }
        ok(1, "Connection opened");
        client.useEnvelope({from: "nofail@fail.ee", to: "fail@fail.ee"});
    };

    client.onerror = function(err){
        ok(err, "Mail validation failed");
    };

    client.onclose = function(){
        ok(1, "Connection closed");
        start();
    };
});

asyncTest("RCPT TO: success", function(){
    expect(3);

    var client = smtpclient("localhost", 1025);

    client.connect();

    var first = 0;

    client.onidle = function(){
        if(first++){
            ok(false, "Should not occur");
            client.quit();
            return;
        }
        ok(1, "Connection opened");
        client.useEnvelope({from: "nofail@fail.ee", to: "nofail@fail.ee"});
    };

    client.onerror = function(err){
        ifError(err, "Mail validation failed");
    };

    client.onready = function(){
        ok(1, "Mail validation passed");
        client.close();
    };

    client.onclose = function(){
        ok(1, "Connection closed");
        start();
    };
});

asyncTest("RCPT TO: success with some failures", function(){
    expect(3);

    var client = smtpclient("localhost", 1025);

    client.connect();

    var first = 0;

    client.onidle = function(){
        if(first++){
            ok(false, "Should not occur");
            client.quit();
            return;
        }
        ok(1, "Connection opened");
        client.useEnvelope({from: "nofail@fail.ee", to: ["nofail@fail.ee", "fail@fail.ee"]});
    };

    client.onerror = function(err){
        ifError(err, "Mail validation failed");
    };

    client.onready = function(failedRecipients){
        deepEqual(failedRecipients, ["fail@fail.ee"]);
        client.close();
    };

    client.onclose = function(){
        ok(1, "Connection closed");
        start();
    };
});

asyncTest("DATA: success", function(){
    expect(4);

    var client = smtpclient("localhost", 1025);

    client.connect();

    var first = 0;

    client.onidle = function(){
        if(first++){
            ok(false, "Should not occur");
            client.quit();
            return;
        }
        ok(1, "Connection opened");
        client.useEnvelope({from: "nofail@fail.ee", to: ["nofail@fail.ee"]});
    };

    client.onerror = function(err){
        ifError(err, "DATA command failed");
    };

    client.onready = function(failedRecipients){
        ok(1, "Waiting for data");
        var message = "Subject: Hello!\r\n\r\nMessage";

        Array.prototype.slice.call(message).forEach(function(c){
            client.send(c);
        });
        client.end();
    };

    client.ondone = function(status){
        ok(status, "message accepted");
        client.quit();
    };

    client.onclose = function(){
        ok(1, "Connection closed");
        start();
    };
});

asyncTest("DATA: success with dots", function(){
    expect(4);

    var client = smtpclient("localhost", 1025);

    client.connect();

    var first = 0;

    client.onidle = function(){
        if(first++){
            ok(false, "Should not occur");
            client.quit();
            return;
        }
        ok(1, "Connection opened");
        client.useEnvelope({from: "nofail@fail.ee", to: ["nofail@fail.ee"]});
    };

    client.onerror = function(err){
        ifError(err, "DATA command failed");
    };

    client.onready = function(failedRecipients){
        ok(1, "Waiting for data");
        var message = "Subject: Hello!\r\n\r\n.\r\n.\n.\r\n.Message\r\n.\r\n";

        Array.prototype.slice.call(message).forEach(function(c){
            client.send(c);
        });
        client.end();
    };

    client.ondone = function(status){
        ok(status, "message accepted");
        client.quit();
    };

    client.onclose = function(){
        ok(1, "Connection closed");
        start();
    };
});

asyncTest("Idle after sending message", function(){
    expect(5);

    var client = smtpclient("localhost", 1025);

    client.connect();

    var idle = 0;

    client.onidle = function(){
        if(idle++ > 1){
            ok(false, "Should not occur");
            client.quit();
            return;
        }
        if(idle == 2){
            ok(true, "Entered idle");
            client.quit();
            return;
        }
        ok(1, "Connection opened");
        client.useEnvelope({from: "nofail@fail.ee", to: ["nofail@fail.ee"]});
    };

    client.onerror = function(err){
        ifError(err, "DATA command failed");
    };

    client.onready = function(failedRecipients){
        ok(1, "Waiting for data");
        var message = "Subject: Hello!\r\n\r\n.\r\n.\n.\r\n.Message\r\n.\r\n";

        Array.prototype.slice.call(message).forEach(function(c){
            client.send(c);
        });
        client.end();
    };

    client.ondone = function(status){
        ok(status, "message accepted");
    };

    client.onclose = function(){
        ok(1, "Connection closed");
        start();
    };
});

asyncTest("Connect to and disconnect from a secure testserver", function(){
    expect(2);

    // Self signed certificates are not supported, so we need a trusted secure server
    var client = smtpclient("smtp.gmail.com", 465, {useSSL: true});
    client.connect();

    client.onidle = function(){
        ok(1, "Connection opened");
        client.close();
    };

    client.onerror = function(err){
        ifError(err);
    };

    client.onclose = function(){
        ok(1, "Connection closed");
        start();
    };
});