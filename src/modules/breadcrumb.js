var BreadcrumbManager = function(){
    this.className = 'breadcrumb';
};

BreadcrumbManager.prototype.read_breadcrumbs = function(){
    //Read current breadcrumb and mark active sections
    var _self = this;
    $('.' + this.className + " li").each(function(){
        _self.mark_view($(this).data('viewname'));
    });

};

BreadcrumbManager.prototype.mark_view = function(viewname){
    //Mark each li active
    if (viewname === ''){
        return;
    }
    $("nav [data-viewname='" + viewname + "']").each(function(){
        var elem = $(this);
        if (elem.siblings('.active').length > 0){
            elem.siblings('.active').removeClass('active');
        }
        elem.addClass('active');
        elem.parents('li').siblings('.active').removeClass('active');
        elem.parents('li').addClass('active');
        elem.parents('ul.collapse').addClass('in');
    });
};

var breadcrumb;
