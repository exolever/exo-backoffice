var ShowDetailManager = function(){
    this.class_selector = ".dev__show_detail";
    this.init_events();
};

ShowDetailManager.prototype.init_events = function(){
    $(document).on(
        'click',
        this.class_selector,
        _.bind(this.processClick, this));
};

ShowDetailManager.prototype.processClick = function(event){
    event.preventDefault();
    var elem = $(event.currentTarget);
    var pk = elem.data('pk');
    var url = elem.data('url');
    exoStorage.set('detail-pk', pk);
    location.href = url;
};
