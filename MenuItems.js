const { MenuItem } = require ("electron" );
const defaultProps = {
    label: "Новый параметр"
};
class MenuTrayItem extends MenuItem {
    constructor(label) {
        super({label});
    }
}
module.exports = MenuTrayItem;