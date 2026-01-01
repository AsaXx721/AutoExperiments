import {
    @Vigilant,
    @SwitchProperty,
    @SliderProperty,
    @ColorProperty,
    @TextProperty,
    @ButtonProperty,
    @NumberProperty,
} from '../Vigilance/index';

@Vigilant("AutoExperiments", "§6§lAutoExperiments", {

})

class config {
    constructor() {
        this.initialize(this)
    }

    @SwitchProperty({
        name: "Toggle",
        category: "General",
    })
    toggle = false;

    @SliderProperty({
        name: "Click Delay",
        category: "General",
        min: 120,
        max: 500
    })
    clickdelay = 150;

    @SwitchProperty({
        name: "Auto Close",
        category: "General",
    })
    autoClose = false;

    @SliderProperty({
        name: "Serum Count",
        category: "General",
        min: 0,
        max: 3
    })
    serumcount = 0;

    @SwitchProperty({
        name: "Get Max XP",
        category: "General",
    })
    getmaxxp = false;
}
export default new config()