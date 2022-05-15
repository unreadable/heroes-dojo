import { Entity, IRange } from './index';
import { Logger } from '../services';
import { HeroSpecialChances, HeroCooldownTurns } from '../utils/constants';

export default class Hero extends Entity {
    private logger: Logger;

    private currentTurn = 0;
    private resilience = {
        lastTurnUsed: -Infinity,
        ableToUse: true
    };

    constructor(chances: Record<string, IRange>) {
        super(chances);

        this.logger = new Logger();
    }

    public takeDamage(attackerStrength: number) {
        const isLuckyToDogeStrike = this.isLucky(this.luck);
        if (isLuckyToDogeStrike) {
            return this.logger.wow('Hero managed to doge attack!');
        };

        if (!this.resilience.ableToUse && this.currentTurn - this.resilience.lastTurnUsed >= HeroCooldownTurns) {
            this.resilience.ableToUse = true;
        }

        const isLuckyToDefend = this.isLucky(HeroSpecialChances.Resilience);
        if (this.resilience.ableToUse && isLuckyToDefend) {
            const damage = (attackerStrength - this.defence) / 2;

            this.health = Math.max(0, this.health - damage);
            this.logger.info('Hero took half of the damage worh: ' + damage);

            this.resilience = {
                lastTurnUsed: this.currentTurn,
                ableToUse: false
            };
        } else {
            const damage = (attackerStrength - this.defence);

            this.health = Math.max(0, this.health - damage);
            this.logger.info('Hero took full damage worth: ' + damage);
        }

        this.currentTurn += 1;

        this.logger.warning('Hero ph is now: ' + this.health);
    }

    public criticalStrike(enemy: Entity) {
        const isLuckyTripleCombo = this.isLucky(HeroSpecialChances.TripleCombo);

        enemy.takeDamage(this.strength);
        enemy.takeDamage(this.strength);

        if (isLuckyTripleCombo) {
            this.logger.wow('Hero managed to hit three times!');
            enemy.takeDamage(this.strength);
        }
    }

    public attack(enemy: Entity) {
        const isLuckyToCriticalHit = this.isLucky(HeroSpecialChances.Critical);

        if (isLuckyToCriticalHit) {
            this.logger.success('Hero attacks villain with critical strike!');
            this.criticalStrike(enemy);
        } else {
            this.logger.info('Hero attacks villain with no special skill');
            enemy.takeDamage(this.strength);
        }
    }
};
