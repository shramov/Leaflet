L.Control.Zoom = L.Control.extend({
	options: {
		position: 'topleft',
		shiftClick: false,
		shiftLevels: 4
	},

	initialize: function (options) {
		L.Util.setOptions(this, options);
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
			if (this.options.shiftClick && e && e.shiftKey) {
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
