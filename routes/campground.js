const express = require('express')
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync');
const {isLoggedin,isAuthor,validateForm} = require('../middleware')
const campgrounds = require('../Controller/Campgrounds')


router.route('/')
      .get( CatchAsync(campgrounds.homepage))
      .post(isLoggedin,validateForm, CatchAsync(campgrounds.createNewCamp))  

router.get('/new',isLoggedin,CatchAsync(campgrounds.addCamps))

router.get('/:id/edit',isLoggedin,isAuthor, CatchAsync(campgrounds.editCamp))


router.route('/:id')
      .put(validateForm,isLoggedin,isAuthor, CatchAsync(campgrounds.updateCamp))
      .get(CatchAsync(campgrounds.viewCamp))
      .delete(isLoggedin,isAuthor,CatchAsync(campgrounds.deleteCamp))


module.exports = router;