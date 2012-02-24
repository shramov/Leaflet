L.Control.Zoom = L.Control.extend({
	options: {
		position: 'topleft',
		shiftClick: false,
		shiftLevels: 4
	},

	onAdd: function (map) {
		var className = 'leaflet-control-zoom',
		    container = L.DomUtil.create('div', className);
		    
		this._createButton('Zoom in', className + '-in', container, map.zoomIn, map);
		this._createButton('Zoom out', className + '-out', container, map.zoomOut, map);

		return container;
	},

	_createButton: function (title, className, container, fn, context) {
		var link = L.DomUtil.create('a', className, container);
		link.href = '#';
		link.title = title;

		var cb = function (e) {
			function shiftPressed(e) {
				if (e && e.shiftKey) { return true; }
				if (document.layers && navigator.appName === "Netscape") {
					return e.modifiers - 0 > 3;
				}
				return false;
			}

			if (this.options.shiftClick && shiftPressed(e)) {
				var i;
				for (i = 1; i < this.options.shiftLevels; i++) {
					fn.call(context);
				}
			}
			return fn.call(context);
		};

		L.DomEvent
			.addListener(link, 'click', L.DomEvent.stopPropagation)
			.addListener(link, 'click', L.DomEvent.preventDefault)
			.addListener(link, 'click', cb, this);

		return link;
	}
});
