(function(Backbone){

    var CustomerMemberRoleModel = Backbone.Model.extend({});

    var SprintModel = Backbone.models.Project.extend({
        initialize: function(options){
            options = $.extend({}, options);
            SprintModel.__super__.initialize.apply(this, arguments);
            this.sprint_id = this.project_id;

            this.set('users_roles',
              new Backbone.Collection(
                [],
                {model: CustomerMemberRoleModel})
            );
        },
        add_member: function(name, email, role){
            var members = this.get('users_roles');
            var position = members.length + 1;
            members.add({
                short_name: name,
                email: email,
                role: role,
                position: position
            });
        },
        remove_member: function(id){
            var customer_members = this.get('users_roles');
            var member = customer_members.findWhere({position: id});
            customer_members.remove(member);
        },
        parse: function(response, options){
            var hash = SprintModel.__super__.parse.apply(this, arguments);
            hash.users_roles.forEach(function(x){
                this.add_member(x.short_name, x.email, x.role);
            });
            delete hash.users_roles;
            return hash;
        }

    });

    if (typeof Backbone.models === 'undefined') Backbone.models = {};
    Backbone.models.Sprint = SprintModel;

})(Backbone);
