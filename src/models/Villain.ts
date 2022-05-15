import { Entity, IRange } from './index';
import { Logger } from '../services';

export default class Villain extends Entity {
    private logger: Logger;

    constructor(chances: Record<string, IRange>) {
        super(chances);

        this.logger = new Logger();
    }

    public takeDamage(attackerStrength: number) {
        const isLuckyToDogeStrike = this.isLucky(this.luck);
        if (isLuckyToDogeStrike) {
            return this.logger.wow('Villain managed to doge attack');
        };

        const damage = attackerStrength - this.defence;
        this.health = Math.max(0, this.health - damage);

        this.logger.info('Villain took damage worth : ' + damage);
        this.logger.warning('Villain ph is now: ' + this.health);
    }

    public attack(enemy: Entity) {
        this.logger.info('Villain attacks hero');
        enemy.takeDamage(this.strength);
    }
};