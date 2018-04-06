
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('pages/index');
};
exports.scan = function(req, res){
  res.render('pages/scanrfid');
};
exports.doctor = function(req, res){
  res.render('pages/personalstatement');
};
