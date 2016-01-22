(function(){
    
    console.log('hello');
    $.get('/history.html', function(data){
        console.log('got here');
    });
    
})();