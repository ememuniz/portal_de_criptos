var express = require('express');
var router = express.Router();
const Cripto = require('../models/cripto');
const { getCriptos } = require('../../config/ApiCripto.js');
const withAuth = require('../middlewares/auth');
const mongoose = require('mongoose');


router.get('/options', async (req, res) => {
  let criptos = [];
  let criptoJSON = await getCriptos();
  criptoJSON.forEach((cripto) => {
    const criptoName = cripto['name'];
    const criptoSymbol = cripto['symbol'];
    criptos.push({ name: criptoName, symbol: criptoSymbol });
  });
  try {
    res.status(200).json(criptos);
  } catch (e) {
    res.status(500).json({ e: 'Error in getting criptos' });
  }
});


router.post('/add', withAuth, async (req, res) => {
  let criptomoeda = req.body;
  let criptoBD;
  let criptoJSON = await getCriptos();
  const criptoFind = criptoJSON.find(
    (cripto) => cripto['name'] === criptomoeda['name'],
  );

  if (criptoFind) {
    criptoBD = new Cripto({
      symbol: criptoFind['symbol'],
      name: criptoFind['name'],
      rank: criptoFind['rank'],
      price: criptoFind['price'],
      market_cap: criptoFind['market_cap'],
      total_volume_24h: criptoFind['total_volume_24h'],
      low_24h: criptoFind['low_24h'],
      high_24h: criptoFind['high_24h'],
      delta_1h: parseFloat(criptoFind['delta_1h'].replace(',', '.')),
      delta_24h: parseFloat(criptoFind['delta_24h'].replace(',', '.')),
      delta_7d: parseFloat(criptoFind['delta_7d'].replace(',', '.')),
      delta_30d: parseFloat(criptoFind['delta_30d'].replace(',', '.')),
      markets: criptoFind['markets'],
      last_update_timestamp: criptoFind['last_update_timestamp'],
      remaining: criptoFind['remaining'],
      author: req.user._id,
    });
    console.log('Author: ' + req.user);
  } else {
    res.status(500).json({ e: 'Cripto not found' });
  }
  try {
    await criptoBD.save();
    res.status(200).json(criptoBD);
  } catch (e) {
    res.status(500).json({ e: 'Problem in adding cripto', details: e.message });
  }
});


router.get('/view/:id', withAuth, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('-------ID: ' + id);
    let cripto = await Cripto.findById(id);
    console.log('-------Cripto: ' + cripto);
    if (isOwner(req.user, cripto)) {
      res.status(200).json(cripto);
    } else {
      res.status(403).json({ e: 'Permission denied' });
    }
  } catch (e) {
    res.status(500).json({ e: 'Error in getting criptos', details: e.message });
  }
});

const isOwner = (user, cripto) => {
  if (JSON.stringify(user._id) == JSON.stringify(cripto.author._id)) {
    return true;    
  } else {
    return false;
  }
};

router.get('/teste', async (req, res) => {
  let criptos = [];
  let criptoJSON = await getCriptos();
  criptoJSON.forEach((cripto) => {
    criptos.push(cripto);
  });
  try {
    res.status(200).json(criptos);
  } catch (e) {
    res.status(500).json({ e: 'Error in getting criptos' });
  }
});

module.exports = router;

/*router.post('/cripto/:id', async (req, res) => {
  const { name } = req.body;
  try {
    let criptoName = await APIcripto.findOne({ email });




    if (!user) {
      res.status(401).json({ e: 'Incorrect email or password' });
    } else {
      user.isCorrectPassword(password, function (err, same) {
        if (!same) {
          res.status(401).json({ e: 'Incorrect email or password' });
        } else {
          const token = jwt.sign({ email }, secret, { expiresIn: '30d' });
          res.status(200).json({ user: user, token: token });
        }
      });
    }
  } catch (e) {
    res.status(500).json({ e: 'Internal error, please try again' });
  }
}); */
