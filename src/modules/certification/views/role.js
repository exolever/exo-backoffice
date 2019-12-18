(function(Backbone) {
    var RoleModel = Backbone.Model.extend({
        toString: function(){
            return this.get('name');
        }
    });

    var RoleCollection = Backbone.Collection.extend({
        model: RoleModel,
        url: function(){
            return urlservice.resolve('roles');
        },
        get_manager: function(){
            return this.findWhere({
              'code': settings.relation.CONSULTANT_CH_MANAGER
            });
        }

    });

    var RoleConsultantModel = Backbone.Model.extend({
        url: function(){
            if (this.id){
                return urlservice.resolve('consultant-roles-detail', this.get('consultant'), this.id);
            }
            else{
                return urlservice.resolve('consultant-roles', this.get('consultant'));
            }
        }
    });

    var RoleConsultantCollection = Backbone.Collection.extend({
        model: RoleConsultantModel,
        initialize: function(models, options){
            this.consultant_id = options.consultant_id;
        },
        url: function(){
            return urlservice.resolve('consultant-roles', this.consultant_id);
        }
    });
    if (typeof window.Model === 'undefined') window.Model = {};
    if (typeof window.Collection == 'undefined') window.Collection = {};
    window.Model.Role = RoleModel;
    window.Model.RoleConsultant = RoleConsultantModel;
    window.Collection.Role = RoleCollection;
    window.Collection.RoleConsultant = RoleConsultantCollection;
})(Backbone);


(function(Backbone) {
    var RoleItemView = Backbone.View.extend({
        container: '#dev__role-list',
        detail_template: templates.consultant_role_detail,
        mixins: ['network_detail_itemview'],
        relatedModel: window.Model.RoleConsultant,
        relatedField: 'role',
        render: function(){
            var html = this.detail_template(this.model.toJSON());
            $(this.container).html($(this.container).html()+html);
        },
        mark_selected: function(){
            $(this.container).find(
                'span[class*="rol-' + _.decapitalize(this.model.get('code')) + '"]').removeClass('hidden');
        },
        unmark_selected: function(){
            $(this.container).find(
                'span[class*="rol-' + _.decapitalize(this.model.get('code')) + '"]').addClass('hidden');
        },
        mark_element: function(event){
            if(this.get_value()){
                this.mark_selected();
            }
            else{
                this.unmark_selected();
            }
        }
    });

    var RoleConsultantListView = Backbone.View.extend({
        el: '#dev__roles',
        itemView: RoleItemView,
        objectCollection: window.Collection.Role,
        objectConsultantCollection: window.Collection.RoleConsultant,
        relatedField: 'role',
        mixins: ['network_detail_collectionview']
    });

    if (typeof window.View === 'undefined') window.View = {};
    window.View.RoleConsultant = RoleConsultantListView;
})(Backbone);
