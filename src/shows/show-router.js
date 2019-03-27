const express = require('express');
const AddService = require('./show-service');
const addRouter = express.Router();
const path = require('path');
const jsonBodyParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');
const uuidv4 = require('uuid/v4');


addRouter.post('/', jsonBodyParser, requireAuth, (req, res, next) => {
  const { title, content, show_time, day, duration, network } = req.body;

  for (const field of ['title', 'show_time', 'day', 'duration'])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });
  const show = {
    title,
    content,
    show_time,
    day,
    duration,
    user_id: req.user.id,
    network,
    uuid: uuidv4()
  }
  AddService.insertShow(req.app.get('db'), show)
    .then(show => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${show.id}`))
        .json(AddService.serializeShow(show));
    })
    .catch(next)
})

addRouter.patch('/', requireAuth, jsonBodyParser, (req, res, next) => {
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

        const {title, content, show_time, day, duration, network} = show

      const updatedShow = {
        title: newTitle || title,
        content: newContent || content,
        show_time: newTime || show_time,
        day: newDay || day,
        duration: newDuration || duration,
        network: newNetwork || network
      }
      AddService.update(req.app.get('db'), uuid, AddService.serializeShow(updatedShow))
      .then(results => {
        console.log(results)
        if(results > 0)
          res.status(200).json(results);
        else  
          res(400).send('Something went wrong 🙁');
      })
      .catch(next)
    })
    .catch(next)
})

addRouter.get('/', requireAuth, (req, res, next) => {
  const userId = req.user.id
  AddService.getUserShows(req.app.get('db'), userId)
    .then(shows => res.json(shows))
    .catch(next)
})

addRouter.delete('/', requireAuth, jsonBodyParser, (req, res, next) => {
  const { id } = req.body;
  AddService.delete(req.app.get('db'), id)
    .then(result =>{
      if(result > 0){
        res.status(204).json(result)
      }
      else{
        res.status(404).send('Show not found');
      }
    })
    .catch(next)
})




module.exports = addRouter;