/* global TD */
import moduleRaid from 'moduleraid';
import { Timestamp } from './components/time';
import { BTDUtils } from './components/btdDebug';
import { RemoveRedirection } from './components/removeRedirection';
import { ChirpHandler as ChirpHandlerClass } from './components/chirpHandler';
import { monitorMediaSizes } from './util/columnsMediaSizeMonitor';

const BTD_SETTINGS = JSON.parse(document.querySelector('[data-btd-settings]').dataset.btdSettings);

let mR;
try {
  mR = moduleRaid();
} catch (e) {
  //
}

window.$ = mR && mR.findFunction('jQuery') && mR.findFunction('jquery:')[0];

const Utils = new BTDUtils(BTD_SETTINGS, TD);
const ChirpHandler = new ChirpHandlerClass(BTD_SETTINGS, TD, Utils);

(async () => {
  /* Starts monitoring new chirps */
  ChirpHandler.monitorChirps();

  /* init the ColumnsMediaSizeKeeper component */
  monitorMediaSizes();

  /* Init the Timestamp component */
  const BTDTime = new Timestamp(BTD_SETTINGS, TD);

  /*
  * If the user chose so, we override the timestamp function called by TweetDeck
  */
  if (BTD_SETTINGS.ts !== 'relative') {
    TD.util.prettyDate = d => BTDTime.prettyDate(d);
  }

  /*
 * If the user chose so, we override the link creation mechanism to remove the t.co redirection
 */
  if (BTD_SETTINGS.no_tco) {
    new RemoveRedirection(BTD_SETTINGS, TD).init();
  }

  $(document).one('dataColumnsLoaded', async () => {
    console.log('ready!');
  });
})();
