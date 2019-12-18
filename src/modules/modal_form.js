(function(Backbone) {
    var ModalContentForm = Backbone.View.extend({
        tagName: 'form',
        events: {
            ok: 'submit'
        },
        render: function() {
            this.$el.html(this.template());
            this.$el.validate();
            return this;
        },
        is_valid: function(){
            if (this._valid === undefined){
                return true;
            }
            return this._valid;
        },
        set_valid: function(value){
            this._valid = value;
        },
        save: function(){
            return true;
        },
        submit: function(event){
            event.preventDefault();
            if(this.$el.valid()){
                this.save();
                this.set_valid(true);
            }
            else{
                this.set_valid(false);
            }
        }
    });
    Backbone.BootstrapContentModalForm = ModalContentForm;
})(Backbone);
