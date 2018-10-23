const router = require('express').Router();
const Video = require('../models/video');

// GET ROUTES
router.get('/videos', async (req, res) => {
  const videos = await Video.find({});
  res.render('videos/index', {videos});
});

router.get('/videos/create', (req, res) => {
  res.render('videos/create');
});

router.get('/videos/show/:id', async (req, res) => {

  const id = req.params.id;
  const video = await Video.findById(id);
  res.render('videos/show', {video});
});





// POST ROUTES
router.post('/videos', async (req, res) => {
 const video = new Video();
 buildVideo(video, req.body);
 if(video.errors){
   res.status(400).render('videos/create', {video});
 } else {
   await video.save();
   res.redirect(`/videos/${video._id}`);
 }
});


const buildVideo = (video, {title, description, url}) => {
  video.title = title;
  video.description = description;
  video.url = url;
  video.validateSync();
};

const findVideo = async (req) => {
  const {id} = req.params;
  return await Video.findOne({ _id: id });
}

module.exports = router;
