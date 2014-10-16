"use strict";

define([
	'app/measure/PerfMon',
	'goo/entities/SystemBus',
	'data_pipeline/PipelineAPI',
],
	function(
		PerfMon,
		SystemBus,
		PipelineAPI
		) {

		var CustomUiCallbacks = function() {};

		var playerPiece;

		var callbackMap = {
			frame_tpf : function() {
				var tpfStack = PerfMon.getTpfStack();
				return Math.ceil(tpfStack[tpfStack.length-1]);
			},

			fetchTpfStack : function() {
				return PerfMon.getTpfStack();
			},

			fetchAerodynamicCurves : function() {
				return PipelineAPI.readCachedConfigKey('game_data', 'aerodynamic_curves').wings;
			},

			applied_control_update :function(control) {
				return playerPiece.pieceInput.getAppliedState(control);
			},

			player_control_update : function(control) {
				return playerPiece.pieceInput.getInputState(control);
			},

			fire_game_event : function(params) {
				event.fireEvent(event.list()[params.event], params.args);
			},

			fetchControlState : function(control) {
				return playerPiece.pieceInput.getInputState(control);
			},

			fetchPlayerPiece : function() {
				return playerPiece;
			},

			more_stats : function() {
				var stats = PerfMon.getStatsCollection();
				return [
					'Tpf: '+Math.round(stats.tpf)*0.001+'s',
					'Shaders: '+stats.cachedShaders,
					//	'RenderCalls: '+stats.drawCalls,
					//	'Vertices: '+stats.verts,
					//	'Indices: '+stats.indices,
					'Ents (all): '+stats.allentities,
					'Ents (world): '+stats.entities,
					'Ents (animated): '+stats.animations,
					'TrxUpdates: '+stats.transforms,
					'Lights: '+stats.lights,
					'Comps: '+stats.composers+' Passes: '+stats.passes,
					'Gui Calls: '+stats.guiCalls
				];
			},
			registerMessageElement: function(element, channel, state) {

				if (!messageElements[channel]) {
					messageElements[channel] = {}
				}
				messageElements[channel][element.shape+'_'+channel+'_'+state] = element;
			},
			getChannelMessage: function(channel) {
				return channels[channel] || 'Channel: '+channel+' is silent';
			},
			fetchCallById : function(id) {

				switch (id) {
					case "player_control_event":
						return function(params) {
							event.fireEvent(event.list().PLAYER_CONTROL_EVENT, {control:params.control, value:params.value});
							if (params.enabler) {
								SystemBus.emit("guiToggleEnabler", {value:params.value, enabler:params.enabler})
							}
						};
						break;
					case "gui_toggle_template":
						return function(params) {
							SystemBus.emit("guiToggleTemplate", {template:params.template, enabler:params.enabler})
						};
						break;
					default:

				}


			},
			player_control_event:function(params) {
				event.fireEvent(event.list().PLAYER_CONTROL_EVENT, {control:params.control, value:params.value});
				if (params.enabler) {
					SystemBus.emit("guiToggleEnabler", {value:params.value, enabler:params.enabler})
				}
			},
			gui_toggle_template: function(params) {
				SystemBus.emit("guiToggleTemplate", {template:params.template, enabler:params.enabler})
			},


			processCallbacks : function(tpf) {
				for (var channel in messageElements) {
					for (var elemKey in messageElements[channel]) {
						var element = messageElements[channel][elemKey];
						if (element.stateTieout > 0) {
							element.stateTieout -= tpf;
							element.notifyStateChange(element.messageChannels[channel]);
							if (element.stateTieout < 0 ) {
								element.notifyStateChange(element.states.passive);
							}
						}
					}
				}
			}

		};

		var channels = {};

		CustomUiCallbacks.getCallbackMap = function() {
			return callbackMap;
		};

		CustomUiCallbacks.setChannelMessage = function(channel, message) {
			channels[channel] = message;
		};

		var messageElements = {};


		CustomUiCallbacks.handleGuiMessage = function(args) {
			CustomUiCallbacks.setChannelMessage(args.channel, args.message);
			if (messageElements[args.channel]) {
				for (var key in messageElements[args.channel]) {
					var element = messageElements[args.channel][key];
					element.notifyStateChange(element.messageChannels[args.channel]);
					element.stateTieout = element.messageData.duration;
				}
			}
		};

		SystemBus.addListener("message_to_gui", CustomUiCallbacks.handleGuiMessage);


		var channels = ["system_channel", "hint_channel"];

		var messages = [
			[
				"sys_test_1",
				"sys_test_2",
				"sys_test_3"
			],
			//	[
			//		"alert_test_1",
			//		"alert_test_2",
			//		"alert_test_3"
			//	],
			[
				"hint_test_1",
				"hint_test_2",
				"hint_test_3"
			]
		];

		return CustomUiCallbacks
	});
