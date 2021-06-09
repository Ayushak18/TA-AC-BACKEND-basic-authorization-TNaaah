let express = require('express');
let Podcast = require('../models/podcast');
let auth = require('../middlewares/auth');

let router = express.Router();

router.use(auth.authLogin);

router.get('/', (req, res, next) => {
  res.render('podcastIndex');
});

router.get('/free', (req, res, next) => {
  Podcast.find({ type: 'Free' }, (error, podcast) => {
    if (error) {
      next(error);
    } else {
      res.render('freePodcast', { podcast: podcast });
    }
  });
});

router.use(auth.vipUser) || router.use(auth.premiumUser);

router.get('/vip', (req, res, next) => {
  Podcast.find({ type: 'VIP' }, (error, podcast) => {
    if (error) {
      next(error);
    } else {
      res.render('vipPodcast', { podcast: podcast });
    }
  });
});

router.use(auth.premiumUser);

router.get('/premium', (req, res, next) => {
  Podcast.find({ type: 'Premium' }, (error, podcast) => {
    if (error) {
      next(error);
    } else {
      res.render('premiumPodcast', { podcast: podcast });
    }
  });
});

router.post('/', (req, res, next) => {
  Podcast.create(req.body, (error, podcast) => {
    if (error) {
      next(error);
    } else {
      res.redirect('/podcast/' + podcast.type);
    }
  });
});

router.get('/:id', (req, res, next) => {
  let podcastId = req.params.id;
  Podcast.findById(podcastId, (error, podcast) => {
    if (error) {
      next(error);
    } else {
      res.render('singlePodcast', { podcast: podcast });
    }
  });
});

router.get('/:id/edit', (req, res, next) => {
  let podcastId = req.params.id;
  Podcast.findById(podcastId, (error, podcast) => {
    if (error) {
      next(error);
    } else {
      res.render('editPodcast', { podcast: podcast });
    }
  });
});

router.post('/:id/edit', (req, res, next) => {
  let podcastId = req.params.id;
  Podcast.findByIdAndUpdate(podcastId, req.body, (error, podcast) => {
    if (error) {
      next(error);
    } else {
      res.redirect('/podcast/' + podcastId);
    }
  });
});

router.get('/:id/delete', (req, res, next) => {
  let podcastId = req.params.id;
  Podcast.findByIdAndRemove(podcastId, (error, podcast) => {
    if (error) {
      next(error);
    } else {
      res.redirect('/podcast');
    }
  });
});

module.exports = router;
