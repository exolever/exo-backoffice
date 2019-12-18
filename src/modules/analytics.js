var analytics;
var AnalyticManager = function(){
    this.init_gogole_analytics();
    this.setup();
};

AnalyticManager.prototype.init_gogole_analytics = function(){
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    this.analytics_code = $('#dev__analytics').data('code');
};

AnalyticManager.prototype.setup = function(){
    var uuid = $('body').data('uuid');
    if (this.analytics_code){
        ga('create', this.analytics_code, 'auto');
        if (uuid){
            ga('set', 'userId', uuid);
        }
        ga('send', 'pageview');
    }
    if (typeof woopra === 'undefined'){
        this.woopra = false;
    }
    else{
        this.woopra = true;
        woopra.track();
    }

};
