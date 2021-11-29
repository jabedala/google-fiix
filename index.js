const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const FiixCmmsClient = require('fiix-cmms-client');
const fiixCmmsClient = new FiixCmmsClient();

app.use(bodyParser.json());
app.use(cors());

fiixCmmsClient.setBaseUri( 'https://vinedo.macmms.com/api/' );
fiixCmmsClient.setAppKey('macmmsaakp384c0df0fea61e19fae582ad70e5ded106d0779695c05b6ec072de4');
fiixCmmsClient.setAuthToken('macmmsaakp384c0df0fea61e19fae582ad70e5ded106d0779695c05b6ec072de4');
fiixCmmsClient.setPKey('macmmsaskp38443bc1178123872ef10ae5411474d838b6258c5533c4aa67771b42d194f720656');

app.get('/', async(req, res) => {
  sendPing(ret => res.send(ret))
});

app.post('/reading', async (req, res) => {
  uploadReading(req.body, ret => res.send(ret))
});

app.listen(process.env.PORT || 4040);

const sendPing = callback => {
  const body = {
    name: "Ping",
    callback,
  };
  fiixCmmsClient.rpc(body);
};

const uploadReading = (params, callback) => {
  const body = reading(params);
  body["callback"] = callback;
  fiixCmmsClient.add(body);
};

const reading = params => {
  const { intAssetID, intMeterReadingUnitsID, dtmDateSubmitted = Date.now(), dblMeterReading } = params;
  return {
    className: "MeterReading",
    fields: "intMeterReadingUnitsID,dblMeterReading,intAssetID,dtmDateSubmitted",
    object: {
      intMeterReadingUnitsID,
      dblMeterReading,
      intAssetID,
      dtmDateSubmitted,
    },
  };
};
