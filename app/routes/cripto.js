var express = require('express');
var router = express.Router();
const Cripto = require('../models/cripto');
const { getCriptos } = require('../../config/ApiCripto.js');
const withAuth = require('../middlewares/auth');
const mongoose = require('mongoose');

//! Seleciona o nome das cripto disponíveis na API e mostra na tela
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

//! Seleciona a criptomoeda mandada pela interface, procura na API, salva no banco de dados
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

//! Seleciona uma criptomoeda no Banco de Dados e mostra na tela
router.get('/view/:id', withAuth, async (req, res) => {
  try {
    const { id } = req.params;
    let cripto = await Cripto.findById(id);
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

//! Seleciona todas as criptomoedas de um mesmo usuário e mostra na tela.
router.get('/all', withAuth, async (req, res) => {
  try {
    let criptos = await Cripto.find({ author: req.user._id });
    res.status(200).json(criptos);
  } catch (e) {
    res.status(500).json({ e: 'Error in getting criptos' });
  }
});

//! Recebe o nome da criptomoeda que vai ser atualizada, busca essa cripto na API, salva os novos dados no Banco de Dados e mostra na tela.
router.put('/update/:id', withAuth, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  let criptoJSON = await getCriptos();
  console.log('criptoJSON', criptoJSON);
  const criptoFind = criptoJSON.find((cripto) => cripto['name'] === name);
  try {
    if (criptoFind) {
      let cripto = await Cripto.findById(id);
      console.log('cripto', cripto);
      console.log('req.user', req.user);
      console.log('isOwner', isOwner(req.user, cripto));
      console.log('user._id', req.user._id);
      console.log('cripto.author._id', cripto.author._id);
      if (isOwner(req.user, cripto)) {
        let criptoUpdate = await Cripto.findOneAndUpdate(
          {_id: id},
          {
            $set: {
              name: criptoFind['name'],
              symbol: criptoFind['symbol'],
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
            },
          },
          { upsert: true, new: true },
        );
        res.status(200).json(criptoUpdate);
      } else {
        res.status(403).json({ e: 'Permission denied' });
      }
    } else {
      res.status(500).json({ e: 'Cripto not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Problem to update a note', details: error.message });
  }
});

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

//! Seleciona a criptomoeda mandada pela interface e deleta ela do Banco de Dados
router.delete('/delete/:id', withAuth, async (req, res) => {
  const { id } = req.params;
  try {
    let cripto = await Cripto.findById(id);
    console.log('cripto:', cripto);
    console.log('req.user', req.user);
    if (isOwner(req.user, cripto)) {
      await cripto.deleteOne();
      res.status(204).json({message: "Cripto deleted"});
    } else {
      res.status(403).json({ e: 'Permission denied'});
    }
  } catch (e) {
    res.status(500).json({ e: 'Error in deleting criptos', details: e.message });
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
