var format = function(fmt, obj) {
  obj = _.clone(obj);
  return fmt.replace(/%s/g, function(match) {
    return String(obj.shift());
  });
};
var UrlsService = function(api_url) {
    _.mixin(s.exports());
    this.urls = {};
    this.mainUrl = api_url;
    var parser = parseURL(api_url);
    this.protocol = parser.protocol;
    this.host = parser.host;
    this.hostname = parser.hostname;
    this.port = parser.port;
  };

UrlsService.prototype.initialize_async = function(async_url){
  this.asyncUrl = async_url;
  var parser = parseURL(async_url);

  this.async_protocol = parser.protocol;
  this.async_host = parser.host;
  this.async_hostname = parser.hostname;
  this.async_port = parser.port;
};

UrlsService.prototype.update = function(urls) {
  this.urls = _.extend(this.urls, urls);
  return this.urls;
};

UrlsService.prototype.resolve = function() {
  var args, name, url;
  args = _.toArray(arguments);
  if (args.length === 0) {
    throw Error("wrong arguments to setUrls");
  }
  name = args.slice(0, 1)[0];
  url = format(this.urls[name], args.slice(1));
  return format("%s/%s", [_.rtrim(this.mainUrl, "/"), _.ltrim(url, "/")]);
};

UrlsService.prototype.resolveAbsolute = function() {
  //like resolve but without /api/
  var args, name, url, server_name;
  args = _.toArray(arguments);
  if (args.length === 0) {
    throw Error("wrong arguments to setUrls");
  }
  name = args.slice(0, 1)[0];
  url = format(this.urls[name], args.slice(1));
  server_name = this.protocol + '//' + this.host;
  return format("%s/%s", [_.rtrim(server_name, "/"), _.ltrim(url, "/")]);
};

UrlsService.prototype.Absolute = function() {
  //like resolveAbsolute but we don't need to search in the array of urls
  var args, url, server_name;
  args = _.toArray(arguments);
  if (args.length === 0) {
    throw Error("wrong arguments to setUrls");
  }
  url = args.slice(0, 1)[0];
  server_name = this.protocol + '//' + this.host;
  return format("%s/%s", [_.rtrim(server_name, "/"), _.ltrim(url, "/")]);
};

UrlsService.prototype.resolveAsync = function(){
  var args, name, url;
  args = _.toArray(arguments);
  if (args.length === 0) {
    throw Error("wrong arguments to setUrls");
  }
  if (!this.asyncUrl){
    throw Error("Not async url in conf.json");
  }
  name = args.slice(0, 1)[0];
  url = format(this.urls[name], args.slice(1));
  return format("%s/%s", [_.rtrim(this.asyncUrl, "/"), _.ltrim(url, "/")]);
};
