import { mocks } from './mocks';

import { Hero, Villain } from '../src/models/';
import { HeroChances, VillainChances } from '../src/utils/constants';

import Game from '../src/game';

describe('Testing Game', () => {
    afterEach(() => {    
        jest.clearAllMocks();
    });

    it('should load new game', () => {
        const game = new Game();

        expect(() => game.start()).not.toThrow();
    });

    it('should be the hero who wins', () => {
        const spyLog = jest.spyOn(console, 'log');
        const game = new Game();

        game['villain'] = new Villain(VillainChances);
        game['hero'] = new Hero({
            ...HeroChances,
            Health: mocks.heroMaxHealthRange,
            Strength: mocks.heroMaxStrengthRange,
            Defence: mocks.heroMaxDefenceRange
        });

        game['hero']['isLucky'] = () => true;
        game['villain']['isLucky'] = () => false;

        game.start();

        expect(spyLog).toHaveBeenCalledWith('\n🏆 Hero won the game!');
    });

    it('should be the villain who wins', () => {
        const spyLog = jest.spyOn(console, 'log');
        const game = new Game();

        game['hero'] = new Hero(HeroChances);
        game['villain'] = new Villain({
            ...VillainChances,
            Health: mocks.villainMaxHealthRange,
            Strength: mocks.villainMaxStrengthRange,
            Defence: mocks.villainMaxDefenceRange
        });


        game['hero']['isLucky'] = () => false;
        game['villain']['isLucky'] = () => true;

        game.start();

        expect(spyLog).toHaveBeenCalledWith('\n🏆 Villain won the game!');
    });

    it('should end the game after 20 turns', () => {
        const spyLog = jest.spyOn(console, 'log');
        const game = new Game();

        game['hero'] = new Hero(HeroChances);
        game['villain'] = new Villain(VillainChances);

        game['hero']['isLucky'] = () => true;
        game['villain']['isLucky'] = () => true;

        game.start();

        expect(spyLog).toHaveBeenCalledWith('⚠️ Maximum number of game rounds exceeded.');
    });

    it('should be hero the one who starts', () => {
        const spyLog = jest.spyOn(console, 'log');
        const game = new Game();

        game['hero'] = new Hero({
            ...HeroChances,
            Speed: mocks.heroMaxSpeedRange
        });
        game['villain'] = new Villain({
            ...VillainChances,
            Speed: mocks.villainMinSpeedRange
        });

        game.start();

        expect(spyLog.mock.calls[0].some(l => l.startsWith('Hero attacks villain'))).toBe(true);
    });

    it('should be villain the one who starts', () => {
        const spyLog = jest.spyOn(console, 'log');
        const game = new Game();

        game['hero'] = new Hero(HeroChances);
        game['villain'] = new Villain({
            ...VillainChances,
            Speed: mocks.villainMaxSpeedRange
        });

        game.start();

        expect(spyLog.mock.calls[0]).toContain('Villain attacks hero');
    });

    it('should be hero the one who starts with same speed and better luck', () => {
        const spyLog = jest.spyOn(console, 'log');
        const game = new Game();

        game['hero'] = new Hero({
            ...HeroChances,
            Speed: mocks.heroMinSpeedRange,
            Luck: mocks.maxRange
        });
        game['villain'] = new Villain({
            ...VillainChances,
            Speed: mocks.villainMinSpeedRange,
            Luck: mocks.minRange
        });

        game.start();

        expect(spyLog.mock.calls[0].some(l => l.startsWith('Hero attacks villain'))).toBe(true);
    });

    it('should be villain the one who starts with same speed and better luck', () => {
        const spyLog = jest.spyOn(console, 'log');
        const game = new Game();

        game['hero'] = new Hero({
            ...HeroChances,
            Speed: mocks.heroMinSpeedRange,
            Luck: mocks.minRange
        });
        game['villain'] = new Villain({
            ...VillainChances,
            Speed: mocks.villainMinSpeedRange,
            Luck: mocks.maxRange
        });

        game.start();

        expect(spyLog.mock.calls[0]).toContain('Villain attacks hero');
    });
});
