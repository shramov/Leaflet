L.Control.Permalink = L.Class.extend({
	options: {
		position: L.Control.Position.BOTTOM_LEFT,
		useAnchor: true
	},

	initialize: function(options) {
		L.Util.setOptions(this, options);
		this._set_urlvars();
		this._centered = false;
	},

	onAdd: function(map) {
		this._container = L.DomUtil.create('div', 'leaflet-control-attribution');
		L.DomEvent.disableClickPropagation(this._container);
		map.on('moveend', this._update, this);
		this._map = map;
		this._href = L.DomUtil.create('a', null, this._container);
		this._href.innerHTML = "Permalink";
		this._set_center(this._params);
		this._update();
	},

	getPosition: function() {
		return this.options.position;
	},

	getContainer: function() {
		return this._container;
	},

	_update: function() {
		if (!this._map) return;

		var center = this._map.getCenter();
		center = this._round_point(center);
		this._params['zoom'] = this._map.getZoom();
		this._params['lat'] = center.lat;
		this._params['lon'] = center.lng;

		var params = L.Util.getParamString(this._params);
		var sep = '?';
		if (this.options.useAnchor) sep = '#';
		this._href.setAttribute('href', this._url_base + sep + params.slice(1))
	},

	_round_point : function(point) {
		var bounds = this._map.getBounds(), size = this._map.getSize();
		var ne = bounds.getNorthEast(), sw = bounds.getSouthWest();

		var round = function (x, p) {
			if (p == 0) return x;
			shift = 1;
			while (p < 1 && p > -1) {
				x *= 10;
				p *= 10;
				shift *= 10;
			}
			return Math.floor(x)/shift;
		}
		point.lat = round(point.lat, (ne.lat - sw.lat) / size.y);
		point.lng = round(point.lng, (ne.lng - sw.lng) / size.x);
		return point;
	},

	_set_urlvars: function()
	{
		this._url_base = window.location.href.split('#')[0];
		this._params = this._parse_urlvars(window.location.hash.slice(1));
		if (this._params.lat && this._params.lon && this._params.zoom)
			return;

		var idx = this._url_base.indexOf('?');
		if (idx < 0)
			return;

		this._params = this._parse_urlvars(this._url_base.slice(idx + 1));
		this._url_base = this._url_base.substring(0, idx);
	},

	_parse_urlvars: function(s) {
		var p = {};
		var params = s.split('&');
		for(var i = 0; i < params.length; i++) {
			var tmp = params[i].split('=');
			if (tmp.length != 2) continue;
			p[tmp[0]] = tmp[1];
		}
		return p;
	},

	_set_center: function(params)
	{
		if (this._centered) return;
		if (params.zoom == undefined ||
		    params.lat == undefined ||
		    params.lon == undefined) return;
		this._centered = true;
		this._map.setView(new L.LatLng(params.lat, params.lon), params.zoom);
	}
});
