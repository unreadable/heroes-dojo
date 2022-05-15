import { Entity, IRange } from './index';
import { LogType } from '../utils/constants';

export default class Villain extends Entity {
    constructor(chances: Record<string, IRange>) {
        super(chances);
    }

    public takeDamage(attackerStrength: number) {
        const isLuckyToDogeStrike = this.isLucky(this.luck);
        if (isLuckyToDogeStrike) {
            return this.logEvent('Villain managed to doge attack', LogType.Wow);
        };

        const damage = attackerStrength - this.defence;
        this.health = Math.max(0, this.health - damage);

        this.logEvent('Villain took damage worth : ' + damage, LogType.Info);
        this.logEvent('Villain ph is now: ' + this.health, LogType.Warning);
    }

    public attack(enemy: Entity) {
        this.logEvent('Villain attacks hero', LogType.Info);
        enemy.takeDamage(this.strength);
    }
};