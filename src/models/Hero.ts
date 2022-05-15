import { Entity, IRange } from './index';
import { HeroSpecialChances, HeroCooldownTurns, LogType } from '../utils/constants';

export default class Hero extends Entity {
    private currentTurn = 0;
    private resilience = {
        lastTurnUsed: -Infinity,
        ableToUse: true
    };

    constructor(chances: Record<string, IRange>) {
        super(chances);
    }

    public takeDamage(attackerStrength: number) {
        const isLuckyToDogeStrike = this.isLucky(this.luck);
        if (isLuckyToDogeStrike) {
            return this.logEvent('Hero managed to doge attack!', LogType.Wow);
        };

        if (!this.resilience.ableToUse && this.currentTurn - this.resilience.lastTurnUsed >= HeroCooldownTurns) {
            this.resilience.ableToUse = true;
        }

        const isLuckyToDefend = this.isLucky(HeroSpecialChances.Resilience);
        if (this.resilience.ableToUse && isLuckyToDefend) {
            const damage = (attackerStrength - this.defence) / 2;

            this.health = Math.max(0, this.health - damage);
            this.logEvent('Hero took half of the damage worh: ' + damage, LogType.Info);

            this.resilience = {
                lastTurnUsed: this.currentTurn,
                ableToUse: false
            };
        } else {
            const damage = (attackerStrength - this.defence);

            this.health = Math.max(0, this.health - damage);
            this.logEvent('Hero took full damage worth: ' + damage, LogType.Info);
        }

        this.currentTurn += 1;

        this.logEvent('Hero ph is now: ' + this.health, LogType.Warning);
    }

    public criticalStrike(enemy: Entity) {
        const isLuckyTripleCombo = this.isLucky(HeroSpecialChances.TripleCombo);

        enemy.takeDamage(this.strength);
        enemy.takeDamage(this.strength);

        if (isLuckyTripleCombo) {
            this.logEvent('Hero managed to hit three times!', LogType.Wow);
            enemy.takeDamage(this.strength);
        }
    }

    public attack(enemy: Entity) {
        const isLuckyToCriticalHit = this.isLucky(HeroSpecialChances.Critical);

        if (isLuckyToCriticalHit) {
            this.logEvent('Hero attacks villain with critical strike!', LogType.Success);
            this.criticalStrike(enemy);
        } else {
            this.logEvent('Hero attacks villain with no special skill', LogType.Info);
            enemy.takeDamage(this.strength);
        }
    }
};
