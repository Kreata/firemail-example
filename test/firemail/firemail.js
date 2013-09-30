
asyncTest("Should end with error", function(){
    var mail = {
        smtp:{
            host: "localhost",
            port: 1025
        },
        from: "sender@example.com",
        subject: "test",
        text: "test"
    };

    expect(2);

    firemail(mail, function(err, success){
        ok(err);
        ok(!success);
        start();
    });
});

asyncTest("should pass", function(){
    var mail = {
        smtp:{
            host: "localhost",
            port: 1025
        },
        from: "sender@example.com",
        to: "receiver@example.com",
        subject: "test",
        text: "test"
    };

    expect(2);

    firemail(mail, function(err, success){
        ok(!err);
        ok(success);
        start();
    });
});