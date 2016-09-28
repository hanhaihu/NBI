define(function(require, exports, module) {
    module.exports=" <% _.each(tbody,function( items , index ){ %>\r\n <tr>\r\n <% _.each(items,function( item ){%>\r\n <td>\r\n <%=item%>\r\n </td>\r\n <%})%>\r\n </tr>\r\n <% }) %>";
});