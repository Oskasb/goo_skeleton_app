"use strict";

require.config({
	paths: {
		goo: "../../../../../../../../projects/goojs/src/goo",
		data_pipeline: "submodules/data_pipeline/src",
		gui:"submodules/canvas_gui_3d/src"
		// goo: "./lib/goo"
	}
});

require(["app/Client", "app/GooSetup"], function(Client, GooSetup) {
	var client = new Client();
    client.initiateClient(new GooSetup());
});
