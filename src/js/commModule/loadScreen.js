define(function(require, exports, module) {
    
    function loadScreen(app){
        this.app = app
        this.count = 0;
    };
    loadScreen.prototype.start = function(count){
        var hash = this.app.getCurrentHash();
        this.count = count ? count : ++this.count;
        this.app.showLoading();
    };
    loadScreen.prototype.end = function(){
        if(this.app.getCurrentHash() !== hash) return false;
        if( 0 == --this.count ) this.app.hideLoading();
        return true;
    }
    
    module.exports = loadScreen;
});