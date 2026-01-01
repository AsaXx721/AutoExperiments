import config from "./config"

export default new class autoExperiments {
    constructor() {
        this.ultrasequencerOrder = [];
        this.chronomatronOrder = [];
        this.lastAdded = 0;
        this.lastClick = 0;
        this.clicks = 0;
        this.hasAdded = false;
        this.closing = false;

        register('command', () => config.openGUI()).setName('autoexperiments').setAliases(['ae'])
        register('tick', this.onTick.bind(this))

        this.nonDyedDyes = [
            'minecraft:bone_meal',
            'minecraft:ink_sac',
            'minecraft:lapis_lazuli',
            'minecraft:cocoa_beans'
        ]
    }

    onTick() {
        if (!config.toggle) return
        const container = Player.getContainer();
        if (!container) return;

        const name = String(container.getName()).removeFormatting();

        if (name.startsWith("Chronomatron (")) { this.solveChronomatron(); return }
        if (name.startsWith("Ultrasequencer (")) { this.solveUltraSequencer(); return }
        this.reset()
    }

    reset() {
        this.ultrasequencerOrder = [];
        this.chronomatronOrder = [];
        this.lastAdded = 0;
        this.lastClick = 0;
        this.clicks = 0;
        this.hasAdded = false;
        this.closing = false;
    }

    // recoded 1.8 odin solvers
    solveChronomatron() {
        const maxChronomatron = config.getmaxxp ? 15 : 11 - config.serumcount;
        const items = Player.getContainer().getItems()
        if (items[49]?.getType().getName().includes('Glowstone') && this.hasGlint(items[this.lastAdded])) {
            if (config.autoClose && this.chronomatronOrder.length > maxChronomatron && !this.closing) {
                this.closing = true;
                Client.getMinecraft().currentScreen.close()
            }
            this.hasAdded = false
        }
        if (!this.hasAdded && items[49]?.getType().getName().includes('Clock')) {
            for (let i = 10; i <= 43; i++) {
                if (items[i] && this.hasGlint(items[i])) {
                    this.chronomatronOrder.push(i)
                    this.lastAdded = i
                    this.hasAdded = true
                    this.clicks = 0
                    break;
                }
            }
        }
        if (this.hasAdded && items[49]?.getType().getName().includes('Clock') && this.chronomatronOrder.length > this.clicks && Date.now() - this.lastClick > config.clickdelay) {
            Player.getContainer().click(this.chronomatronOrder[this.clicks], false, 'MIDDLE')
            this.lastClick = Date.now()
            this.clicks++
        }
    }

    solveUltraSequencer() {
        const maxUltraSequencer = config.getmaxxp ? 20 : 9 - config.serumcount;
        const items = Player.getContainer().getItems()
        if (items[49]?.getType().getName().includes('Clock')) this.hasAdded = false
        if (!this.hasAdded && items[49]?.getType().getName().includes('Glowstone')) {
            if (!items[44]) return
            this.ultrasequencerOrder = []
            for (let i = 9; i <= 44; i++) {
                let item = items[i]
                if (this.isDye(item)) this.ultrasequencerOrder[item.getStackSize() - 1] = i
                this.hasAdded = true;
                this.clicks = 0;
                if (this.ultrasequencerOrder.length > maxUltraSequencer && config.autoClose && !this.closing) {
                    this.closing = true;
                    Client.getMinecraft().currentScreen.close()
                }
            }
        }

        if (items[49]?.getType().getName().includes('Clock') && this.ultrasequencerOrder[this.clicks] && Date.now() - this.lastClick > config.clickdelay) {
            Player.getContainer().click(this.ultrasequencerOrder[this.clicks], false, 'MIDDLE')
            this.lastClick = Date.now()
            this.clicks++
        }
    }

    hasGlint(ctItem) {
        const nbt = ctItem.getNBT();
        if (!nbt) return false;

        const text = String(nbt);
        if (text.includes("minecraft:enchantment_glint_override=>true")) return true;
        return false;
    }

    isDye(ctItem) {
        return (ctItem.getType().getRegistryName().includes('dye') || this.nonDyedDyes.includes(ctItem.getType().getRegistryName()))
    }
}
