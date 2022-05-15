import { mocks } from './mocks';

import { Hero, Villain } from '../src/models/';
import { HeroChances, VillainChances } from '../src/utils/constants';

describe('Testing Villain player', () => {
    it('villain should have player properties in the right interval', () => {
        const villain = new Villain(VillainChances);

        expect(villain.getHealthLevel()).toBeGreaterThanOrEqual(VillainChances.Health.min);
        expect(villain.getHealthLevel()).toBeLessThanOrEqual(VillainChances.Health.max);

        expect(villain.getStrengthLevel()).toBeGreaterThanOrEqual(VillainChances.Strength.min);
        expect(villain.getDefenceLevel()).toBeLessThanOrEqual(VillainChances.Strength.max);

        expect(villain.getDefenceLevel()).toBeGreaterThanOrEqual(VillainChances.Defence.min);
        expect(villain.getDefenceLevel()).toBeLessThanOrEqual(VillainChances.Defence.max);

        expect(villain.getSpeedLevel()).toBeGreaterThanOrEqual(VillainChances.Speed.min);
        expect(villain.getSpeedLevel()).toBeLessThanOrEqual(VillainChances.Speed.max);

        expect(villain.getLuckLevel()).toBeGreaterThanOrEqual(VillainChances.Luck.min);
        expect(villain.getLuckLevel()).toBeLessThanOrEqual(VillainChances.Luck.max);
    });

    it('villain should do no damage when hero is doging attack', () => {
        const hero = new Hero({
            ...HeroChances,
            Health: mocks.heroMaxHealthRange
        });
        const villain = new Villain(VillainChances);

        hero['isLucky'] = () => true;
        villain.attack(hero);

        expect(hero.getHealthLevel()).toBe(mocks.heroHealth);
    });

    it('villain should do normal damage with no special hero skills and doge', () => {
        const hero = new Hero({
            ...HeroChances,
            Health: mocks.heroMaxHealthRange,
            Defence: mocks.heroMaxDefenceRange
        });
        const villain = new Villain({
            ...VillainChances,
            Strength: mocks.villainMaxStrengthRange
        });

        hero['isLucky'] = () => false;
        villain.attack(hero);

        expect(hero.getHealthLevel()).toBe(mocks.heroHealthAfterDefaultHit);
    });
    
    it('villain should do half of damage with hero resilience', () => {
        const hero = new Hero({
            ...HeroChances,
            Health: mocks.heroMaxHealthRange,
            Defence: mocks.heroMaxDefenceRange
        });
        const villain = new Villain({
            ...VillainChances,
            Strength: mocks.villainMaxStrengthRange
        });

        let count = 0;
        hero['isLucky'] = () => ++count != 1;

        villain.attack(hero);

        expect(hero.getHealthLevel()).toBe(mocks.heroHealthAfterSemiHit);
    });

    it('villain should take no damage with lucky doge', () => {
        const hero = new Hero(HeroChances);
        const villain = new Villain({
            ...VillainChances,
            Health: mocks.villainMaxHealthRange
        });

        villain['isLucky'] = () => true;
        hero.attack(villain);

        expect(villain.getHealthLevel()).toBe(mocks.villainHealth);
    });

    it('villain should take normal damage with no doge', () => {
        const hero = new Hero({
            ...HeroChances,
            Strength: mocks.heroMaxStrengthRange
        });
        const villain = new Villain({
            ...VillainChances,
            Health: mocks.villainMaxHealthRange,
            Defence: mocks.villainMaxDefenceRange
        });

        hero['isLucky'] = () => false;
        villain['isLucky'] = () => false;
        hero.attack(villain);

        expect(villain.getHealthLevel()).toBe(mocks.villainHealthAfterOneHit);
    });
});
