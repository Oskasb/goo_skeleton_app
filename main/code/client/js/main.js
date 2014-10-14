"use strict";

require(["app/Client", "app/GooSetup"], function(Client, GooSetup) {
	var client = new Client();
    client.initiateClient(new GooSetup());
});
