
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Panic Button' });
};


/*
 * GET login page.
 */

exports.login = function(req, res){

  res.render('index', { title: 'Panic Button' });
};