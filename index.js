/*var express = require('express');
var router = express.Router();
var crypto = require('crypto'),*/

/* GET home page. */

exports.index = function(req, res){
	res.render( 'index');	
};
exports.student = function(req, res){
	res.render( 'student');	
};
exports.teacher = function(req, res){
	res.render( 'teacher');	
};

//module.exports = router;

