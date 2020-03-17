import { Tags } from "../Tags";
import { Player } from "../../Player";
import { PreludeCard } from "./PreludeCard";
import { IProjectCard } from "../IProjectCard";
import { Resources } from '../../Resources';
import { CardName } from '../../CardName';

export class AlliedBanks extends PreludeCard implements IProjectCard {
    public tags: Array<Tags> = [Tags.EARTH];
    public name: string = CardName.ALLIED_BANKS;
    public play(player: Player) {
        player.setProduction(Resources.MEGACREDITS,4);
	    player.megaCredits += 3; 
	    return undefined;   
    }
}

