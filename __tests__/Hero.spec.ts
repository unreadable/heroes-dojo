import { mocks } from './mocks';

import { Hero, Villain } from '../src/models/';
import { HeroChances, VillainChances } from '../src/utils/constants';

describe('Testing Hero player', () => {
    it('hero should have player properties in the right interval', () => {
        const hero = new Hero(HeroChances);

        expect(hero.getHealthLevel()).toBeGreaterThanOrEqual(HeroChances.Health.min);
        expect(hero.getHealthLevel()).toBeLessThanOrEqual(HeroChances.Health.max);

        expect(hero.getStrengthLevel()).toBeGreaterThanOrEqual(HeroChances.Strength.min);
        expect(hero.getDefenceLevel()).toBeLessThanOrEqual(HeroChances.Strength.max);

        expect(hero.getDefenceLevel()).toBeGreaterThanOrEqual(HeroChances.Defence.min);
        expect(hero.getDefenceLevel()).toBeLessThanOrEqual(HeroChances.Defence.max);

        expect(hero.getSpeedLevel()).toBeGreaterThanOrEqual(HeroChances.Speed.min);
        expect(hero.getSpeedLevel()).toBeLessThanOrEqual(HeroChances.Speed.max);

        expect(hero.getLuckLevel()).toBeGreaterThanOrEqual(HeroChances.Luck.min);
        expect(hero.getLuckLevel()).toBeLessThanOrEqual(HeroChances.Luck.max);
    });

    it('hero should do no damage when villain is doging attack', () => {
        const hero = new Hero({
            ...HeroChances,
            Strength: mocks.heroMaxStrengthRange,
        });
        const villain = new Villain({
            ...VillainChances,
            Health: mocks.villainMaxHealthRange,
            Defence: mocks.villainMaxDefenceRange,
        });

        villain['isLucky'] = () => true;
        hero.attack(villain);

        expect(villain.getHealthLevel()).toBe(mocks.villainHealth);
    });

    it('hero should do normal damage with no special skills and no villain doge', () => {
        const hero = new Hero({
            ...HeroChances,
            Strength: mocks.heroMaxStrengthRange
        });
        const villain = new Villain({
            ...VillainChances,
            Health: mocks.villainMaxHealthRange,
            Defence: mocks.villainMaxDefenceRange
        });

        villain['isLucky'] = () => false;
        hero['isLucky'] = () => false;
        hero.attack(villain);

        expect(villain.getHealthLevel()).toBe(mocks.villainHealthAfterOneHit);
    });
    
    it('hero should do twice the damage with critical double hit and no villain doge', () => {
        const hero = new Hero({
            ...HeroChances,
            Strength: mocks.heroMaxStrengthRange,
        });
        const villain = new Villain({
            ...VillainChances,
            Health: mocks.villainMaxHealthRange,
            Defence: mocks.villainMaxDefenceRange
        });

        let count = 0;

        villain['isLucky'] = () => false;
        hero['isLucky'] = () => ++count % 2 === 1;

        hero.attack(villain);

        expect(villain.getHealthLevel()).toBe(mocks.villainHealthAfterDoubleHit);
    });

    it('hero should do three times damage with critical triple hit and no villain doge', () => {
        const hero = new Hero({
            ...HeroChances,
            Strength: mocks.heroMaxStrengthRange,
        });
        const villain = new Villain({
            ...VillainChances,
            Health: mocks.villainMaxHealthRange,
            Defence: mocks.villainMaxDefenceRange
        });

        hero['isLucky'] = () => true;
        villain['isLucky'] = () => false;

        hero.attack(villain);

        expect(villain.getHealthLevel()).toBe(mocks.villainHealthAfterTripleHit);
    });

    it('hero should take no damage with lucky doge', () => {
        const hero = new Hero({
            ...HeroChances,
            Health: mocks.heroMaxHealthRange
        });
        const villain = new Villain({ ...VillainChances });

        hero['isLucky'] = () => true;
        villain.attack(hero);

        expect(hero.getHealthLevel()).toBe(mocks.heroHealth);
    });

    it('hero should take normal damage with no resilience', () => {
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

    it('hero should take normal damage with no resilience', () => {
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
        hero['isLucky'] = () => ++count % 2 === 0;

        villain.attack(hero);

        expect(hero.getHealthLevel()).toBe(mocks.heroHealthAfterSemiHit);
    });

    it('hero should not use resilience two times in a row but available after', () => {
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
        hero['isLucky'] = () => ++count % 2 === 0;

        villain.attack(hero);
        villain.attack(hero);

        expect(hero.getHealthLevel()).toBe(mocks.heroHealthTwoInARow);

        villain.attack(hero);

        expect(hero.getHealthLevel()).toBe(mocks.heroHealthTwoInARowAndStillGoing);
    });
});
