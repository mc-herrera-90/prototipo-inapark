import { getTodayDate } from "./app/utils/dates_utils.js";
import { UI } from "./app/models/ui.js";
import { Database } from "./app/db/database.js";
import { initUIEvents } from "./app/event/handler.js";

function initApplication() {
    getTodayDate();
    new Database().connect();
    const ui = new UI();
    ui.home();
    initUIEvents();
}

document.onreadystatechange = () => {
    if (document.readyState === "complete") {
        initApplication();
    }
};


