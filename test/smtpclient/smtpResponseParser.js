
test("Create smtpResponseParser object", function(){
    var parser = new smtpResponseParser();
    ok(true, parser instanceof smtpResponseParser);
});

test("Write data to parser", function(){
    var parser = new smtpResponseParser();
    parser.send("test");
    equal("test", parser._remainder);
});

asyncTest("Events: ondata", function(){
    expect(1);

    var line = "250 1.2.3 test",
        response = {
            success: true,
            statusCode: 250,
            enhancedStatus: "1.2.3",
            data: "test",
            line: line
        }, i=0;

    var parser = new smtpResponseParser();

    parser.ondata = function(data){
        if(i++){
            ok(false, "Should not run more than once");
        }
        deepEqual(data, response);
        start();
    };

    parser.onend = function(){
        ok(false, "Not expected");
    };

    parser.onerror = function(err){
        ifError(err);
    };

    parser.send(line + "\r\n");
});

asyncTest("Events: ondata, onend", function(){
    expect(1);

    var line = "250 1.2.3 test",
        response = {
            success: true,
            statusCode: 250,
            enhancedStatus: "1.2.3",
            data: "test",
            line: line
        }, i=0;

    var parser = new smtpResponseParser();

    parser.ondata = function(data){
        if(i++){
            ok(false, "Should not run more than once");
        }
        deepEqual(data, response);
    };

    parser.onend = function(){
        start();
    };

    parser.onerror = function(err){
        ifError(err);
    };

    parser.send(line);
    parser.end();
});

asyncTest("Events: ondata, onend, write one byte at a time", function(){
    expect(2);

    var lines = ["250 1.2.3 test", "252 pest"],
        i = 0,
        responses = [{
            success: true,
            statusCode: 250,
            enhancedStatus: "1.2.3",
            data: "test",
            line: lines[0]
        },{
            success:true,
            statusCode: 252,
            enhancedStatus: null,
            data: "pest",
            line: lines[1]
        }];

    var parser = new smtpResponseParser();

    parser.ondata = function(data){
        deepEqual(data, responses[i++]);
    };

    parser.onend = function(){
        start();
    };

    Array.prototype.slice.call(lines.join("\r\n")).forEach(parser.send.bind(parser));
    parser.end();
});

asyncTest("Multi line response", function(){
    expect(1);

    var lines = ["250-test1", "250-test2 test3", "250 test4"],
        response = {
            success: true,
            statusCode: 250,
            enhancedStatus: null,
            data: "test1\ntest2 test3\ntest4",
            line: lines.join("\n")
        }, i=0;

    var parser = new smtpResponseParser();

    parser.ondata = function(data){
        if(i++){
            ok(false, "Should not run more than once");
        }
        deepEqual(data, response);
    };

    parser.onend = function(){
        start()
    };

    parser.onerror = function(err){
        ifError(err);
    };

    Array.prototype.slice.call(lines.join("\r\n")).forEach(parser.send.bind(parser));
    parser.end();
});

asyncTest("Mixed single and multi line responses", function(){
    expect(3);

    var lines = [
            "256 1.2.3 test",
            "250-test1",
            "250-test2 test3",
            "250 test4",
            "254 test6"],
        responses = [
            {
                success: true,
                statusCode: 256,
                enhancedStatus: "1.2.3",
                data: "test",
                line: lines[0]
            },
            {
                success: true,
                statusCode: 250,
                enhancedStatus: null,
                data: "test1\ntest2 test3\ntest4",
                line: lines.slice(1, 4).join("\n")
            },
            {
                success: true,
                statusCode: 254,
                enhancedStatus: null,
                data: "test6",
                line: lines[4]
            }],
        i=0;

    var parser = new smtpResponseParser();

    parser.ondata = function(data){
        deepEqual(data, responses[i++]);
    };

    parser.onend = function(){
        start();
    };

    parser.onerror = function(err){
        ifError(err);
    };

    Array.prototype.slice.call(lines.join("\r\n")).forEach(parser.send.bind(parser));
    parser.end();
});

asyncTest("Events: onerror, invalid line", function(){
    expect(2);

    var line = "nostatus",
        response = {
            success: false,
            statusCode: null,
            enhancedStatus: null,
            data: "nostatus",
            line: line
        }, i=0;

    var parser = new smtpResponseParser();

    parser.ondata = function(data){
        if(i++){
            ok(false, "Should not run more than once");
        }
        deepEqual(data, response);
    };

    parser.onend = function(){
        start();
    };

    parser.onerror = function(err){
        ok(err);
    };

    parser.send(line);
    parser.end();
});

asyncTest("Events: onerror, closed stream, no write", function(){
    expect(1);

    var parser = new smtpResponseParser();

    parser.onerror = function(err){
        ok(err);
        start();
    };

    parser.send("250 test1\r\n");
    parser.end();
    parser.send("250 test1\r\n");
});

asyncTest("Events: onerror, closed stream, no end", function(){
    expect(1);

    var parser = new smtpResponseParser();

    parser.onerror = function(err){
        ok(err);
        start();
    };

    parser.send("250 test1\r\n");
    parser.end();
    parser.end();
});

asyncTest("Invalid line break &lt;LF&gt;", function(){
    expect(3);

    var lines = [
            "256 1.2.3 test",
            "250-test1",
            "250-test2 test3",
            "250 test4",
            "254 test6"],
        responses = [
            {
                success: true,
                statusCode: 256,
                enhancedStatus: "1.2.3",
                data: "test",
                line: lines[0]
            },
            {
                success: true,
                statusCode: 250,
                enhancedStatus: null,
                data: "test1\ntest2 test3\ntest4",
                line: lines.slice(1, 4).join("\n")
            },
            {
                success: true,
                statusCode: 254,
                enhancedStatus: null,
                data: "test6",
                line: lines[4]
            }],
        i=0;

    var parser = new smtpResponseParser();

    parser.ondata = function(data){
        deepEqual(data, responses[i++]);
    };

    parser.onend = function(){
        start();
    };

    parser.onerror = function(err){
        ifError(err);
    };

    Array.prototype.slice.call(lines.join("\n")).forEach(parser.send.bind(parser));
    parser.end();
});

asyncTest("Response success false", function(){
    expect(1);

    var line = "150 1.2.3 test",
        response = {
            success: false,
            statusCode: 150,
            enhancedStatus: "1.2.3",
            data: "test",
            line: line
        }, i=0;

    var parser = new smtpResponseParser();

    parser.ondata = function(data){
        if(i++){
            ok(false, "Should not run more than once");
        }
        deepEqual(data, response);
        start();
    };

    parser.onend = function(){
        ok(false, "Not expected");
    };

    parser.onerror = function(err){
        ifError(err);
    };

    parser.send(line + "\r\n");
});
