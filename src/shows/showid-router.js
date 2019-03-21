const express = require('express');
const AddService = require('./show-service');
const jsonBodyParser = express.json();
const router = express.Router();
const { requireAuth } = require('../middleware/jwt-auth');

router.get('/:id', requireAuth, (req, res, next) => {
  const { id } = req.params;

  AddService.getShowsByUuid(req.app.get('db'), id)
    .then(shows => {
      if (shows[0]) {
        res.json(shows[0]);
      }
      else {
        res.status(404).send('Show not found');
      }
    })
    .catch(next)
})

router.patch('/:id', requireAuth, jsonBodyParser, (req, res, next) => {
  const uuid = req.params.id
  AddService.getShowsByUuid(req.app.get('db'), uuid)
    .then(shows => {
      const show = shows[0];
      const {
        title: newTitle,
        content: newContent,
        show_time: newTime,
        day: newDay,
        duration: newDuration,
        network: newNetwork } = req.body;

      const { title, content, show_time, day, duration, network } = show

      const updatedShow = {
        title: newTitle || title,
        content: newContent || content,
        show_time: newTime || show_time,
        day: newDay || day,
        duration: newDuration || duration,
        network: newNetwork || network
      }
      AddService.update(req.app.get('db'), uuid, updatedShow)
        .then(results => {
          if (results > 0)
            res.status(200).json(results);
          else
            res(400).send('Something went wrong =(');
        })
        .catch(next)
    })
    .catch(next)
})
module.exports = router;
