import * as chance from 'chance';
import { IRange } from './index';
import { LogType } from '../utils/constants';

export default abstract class Entity {
    protected health: number;
    protected strength: number;
    protected defence: number;
    protected speed: number;
    protected luck: number;

    constructor({ Health, Strength, Defence, Speed, Luck }: Record<string, IRange>) {
        this.health = chance().integer(Health);
        this.strength = chance().integer(Strength);
        this.defence = chance().integer(Defence);
        this.speed = chance().integer(Speed);
        this.luck = chance().integer(Luck);
    }

    public getHealthLevel(): number {
        return this.health;
    }

    public getStrengthLevel(): number {
        return this.strength;
    }

    public getDefenceLevel(): number {
        return this.defence;
    }

    public getSpeedLevel(): number {
        return this.speed;
    }

    public getLuckLevel(): number {
        return this.luck;
    }

    protected isLucky(likelihood: number): boolean {
        return chance().bool({ likelihood });
    }

    abstract takeDamage(attackerStrength: number): void;
    abstract attack(enemy: Entity): void;
};
