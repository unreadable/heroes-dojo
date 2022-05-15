import { Entity, Hero, Villain } from '../models';
import { MaxEventsCount, HeroChances, VillainChances } from '../utils/constants';

export default class Game {
    private hero: Hero;
    private villain: Villain;
    private numberOfRounds: number;

    constructor() {
        this.hero = new Hero(HeroChances);
        this.villain = new Villain(VillainChances);
        this.numberOfRounds = 0;
    }

    private fight([firstPlayer, lastPlayer]: [Entity, Entity]) {
        let firstPlayerHealth = firstPlayer.getHealthLevel();
        let lastPlayerHealth = lastPlayer.getHealthLevel();

        while (this.numberOfRounds < MaxEventsCount) {
            firstPlayer.attack(lastPlayer);

            lastPlayerHealth = lastPlayer.getHealthLevel();
            if (!lastPlayerHealth) {
                console.log(`\n🏆 ${firstPlayer.constructor.name} won the game!`);

                break;
            }

            lastPlayer.attack(firstPlayer);

            firstPlayerHealth = firstPlayer.getHealthLevel();
            if (!firstPlayerHealth) {
                console.log(`\n🏆 ${lastPlayer.constructor.name} won the game!`);

                break;
            }

            this.numberOfRounds++;
        }

        if (this.numberOfRounds >= MaxEventsCount) {
            return console.log('⚠️ Maximum number of game rounds exceeded.');
        }
    }

    public start() {
        const heroSpeedLevel = this.hero.getSpeedLevel();
        const villainSpeedLevel = this.villain.getSpeedLevel();

        if (heroSpeedLevel > villainSpeedLevel) {
            this.fight([this.hero, this.villain]);
        } else if (heroSpeedLevel < villainSpeedLevel) {
            this.fight([this.villain, this.hero]);
        } else {
            const heroLuckLevel = this.hero.getLuckLevel();
            const villainLuckLevel = this.villain.getLuckLevel();

            if (heroLuckLevel > villainLuckLevel) {
                this.fight([this.hero, this.villain]);
            } else {
                this.fight([this.villain, this.hero]);
            }
        }
    }
}