import * as http from 'http';
import {Database} from '../database/Database';
import {GameLoader} from '../database/GameLoader';
import {Server} from '../models/ServerModel';
import {AsyncHandler} from './Handler';
import {IContext} from './IHandler';
import {LoadGameFormModel} from '../common/models/LoadGameFormModel';

export class LoadGame extends AsyncHandler {
  public static readonly INSTANCE = new LoadGame();
  private constructor() {
    super();
  }

  public override put(req: http.IncomingMessage, res: http.ServerResponse, ctx: IContext): Promise<void> {
    return new Promise((resolve) => {
      let body = '';
      req.on('data', function(data) {
        body += data.toString();
      });
      req.once('end', async () => {
        try {
          const gameReq: LoadGameFormModel = JSON.parse(body);

          const game_id = gameReq.game_id;
          // This should probably be behind some kind of verification that prevents just
          // anyone from rolling back a large number of steps.
          const rollbackCount = gameReq.rollbackCount;
          if (rollbackCount > 0) {
            Database.getInstance().deleteGameNbrSaves(game_id, rollbackCount);
          }
          const game = await GameLoader.getInstance().getByGameId(game_id, /* bypassCache */ true);
          if (game === undefined) {
            console.warn(`unable to find ${game_id} in database`);
            ctx.route.notFound(req, res, 'game_id not found');
          } else {
            ctx.route.writeJson(res, Server.getSimpleGameModel(game));
          }
        } catch (error) {
          ctx.route.internalServerError(req, res, error);
        }
        resolve();
      });
    });
  }
}
