function ajax_configure_search_folder(project_id){
    var _self = this;
    return {
        url: urlservice.resolve('api-search-nodes', project_id),
        dataType: 'json',
        delay: 250,
        data: function (params) {
            _self.query = params;
          return {
            q: params.term, // search term
            page: params.page
          };
        },
        processResults: function (data, params) {
            return {results: data};
        },
        cache: true
    };
}

function template_folder_selection(folder){
    return folder.full_path;
}

function configure_template_result(item){
    // No need to template the searching text
    if (item.loading) {
      return item.text;
    }
    var term = this.query.term || '';
    var $result = markMatch(item.full_path, term);

    return $result;
}

function configure_result(result, container){
    // No need to template the searching text
    if (result.loading) {
      return result.text;
    }
    var s = this.data('select2');
    var term =  s.selection.container.dropdown.$search.val();
    var $result = markMatch(result.text, term);
    return $result;
}

function formatNode(result) {
    if (result.loading) return result.name;
    var s = this.data('select2');
    var term =  s.selection.container.dropdown.$search.val();
    var $result = markMatch(result.name, term);
    var markup = "<div class='select2-result-repository clearfix p-bottom-2'>" +
        "<div class='select2-result-repository__meta'>" +
          "<div class='select2-result-repository__title'>" + $result.html() + "</div>";
    if (result.full_path) {
        markup += "<div class='select2-result-repository__description color-grey-500'> Root" + result.full_path.replaceAll("/", " / ") + "</div>";
    }

    markup += "</div></div>";
    return markup;
}

function formatNodeSelection (node) {
    return node.name;
}
