(function(){
    var RelatedMixinActions = {
        add_file: function(data, file){
            var _self = this;
            $.ajax({
                url: this.url_add(),
                method: 'post',
                data: data,
                success: function(result){
                    _self.get('files').add(file);
                }
            });
        },
        remove_file: function(file){
            var _self = this;
            var url = this.url_remove(file);
            $.ajax({
                url: url,
                method: 'delete',
                data: {file_id: file.id},
                success: function(result){
                    _self.get('files').remove(file);
                }
            });
        }
    };

    Cocktail.mixins.related_file = RelatedMixinActions;
})();
