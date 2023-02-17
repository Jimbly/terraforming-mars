import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {PlayerInput} from '../../PlayerInput';
import {CardRenderer} from '../render/CardRenderer';
import {CeoCard} from './CeoCard';
import {all, played} from '../Options';
import {Tag} from '../../../common/cards/Tag';

import {IProjectCard} from '../IProjectCard';
import {MoonExpansion} from '../../moon/MoonExpansion';

import {Resources} from '../../../common/Resources';

export class Neil extends CeoCard {
  constructor() {
    super({
      name: CardName.NEIL,
      metadata: {
        cardNumber: 'L34',
        renderData: CardRenderer.builder((b) => {
          b.moon(1, {played, all}).colon().megacredits(1);
          b.br.br;
          b.opgArrow().production((pb) => pb.megacredits(1000)).asterix();
        }),
        description: 'Gain 1 M€ when any player plays a Moon tag. Once per game, increase your M€ production by the value of the LOWEST Moon rate.',
      },
    });
  }

  public onCardPlayed(player: Player, card: IProjectCard) {
    for (const tag of card.tags) {
      if (tag === Tag.MOON) {
        player.game.getCardPlayer(this.name).addResource(Resources.MEGACREDITS, 1, {log: true});
      }
    }
  }

  public action(player: Player): PlayerInput | undefined {
    const game = player.game;
    MoonExpansion.ifMoon(game, (moonData) => {
      const lowestRate = Math.min(moonData.colonyRate, moonData.logisticRate, moonData.miningRate);

      if (lowestRate > 0) {
        player.production.add(Resources.MEGACREDITS, lowestRate, {log: true});
      }
    });

    this.isDisabled = true;
    return undefined;
  }
}