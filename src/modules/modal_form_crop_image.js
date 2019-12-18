(function(Backbone) {
    var CropImageModal = Backbone.BootstrapContentModalForm.extend({
        template: templates.modal_image_crop,
        events:{
            ok: 'submit',
            "click .actions > button": "image_action"
        },
        initialize: function(options){
            this.result = options.result;
            this.channel = options.channel;
            this.msg_name = options.msg_name || "image-cropped";
            this.on('shown', this.show_crop, this);
        },
        render: function(){
            var _self = this;
            this.$el.html(this.template());
            this.$image = this.$el.find(".image-crop > img");

        },
        submit: function(){
            this.save();
        },
        save: function(){
            var image = this.$image.cropper("getCroppedCanvas");
            this.channel.trigger(this.msg_name, image);
        },
        show_crop: function(){
            this.$image.cropper({
                aspectRatio: 1,
                minContainerWidth: 400,
                minContainerHeight: 200,
                background: false,
                preview: ".img-preview",
                done: function(data) {
                    // Output the result data for cropping image.
                }
            });
            this.$image.cropper("reset", true).cropper("replace", this.result);
        },
        image_action: function(event){
            var target = $(event.currentTarget);
            var action = target.data('action');
            var value = target.data('value');
            if (value){
                this.$image.cropper(action, value);
            }
            else{
                this.$image.cropper(action);
            }
        }
    });
    Backbone.BootstrapCropImageModal = CropImageModal;
})(Backbone);
