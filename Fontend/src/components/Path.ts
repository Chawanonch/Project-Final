// const HOST = "/"

import { baseUrlServer } from "./api/agent";

export const routes = {
    home: baseUrlServer,
    building: baseUrlServer + "building",
    rooms: baseUrlServer + "rooms",
    softpower: baseUrlServer + "softpower",
    package: baseUrlServer + "package",
    about: baseUrlServer + "about",
    login: baseUrlServer + "login",
    register: baseUrlServer + "register",
    forgotPassword: baseUrlServer + "forgotPassword",
    settings: baseUrlServer + "settings",
    error: baseUrlServer + "*",
};

export const routesAdmin = {
    home: baseUrlServer,
    buildingSetting: baseUrlServer + "buildingSetting",
    roomSetting: baseUrlServer + "roomSetting",
    softpowerSetting: baseUrlServer + "softpowerSetting",
    bookingSetting: baseUrlServer + "bookingSetting",
    commentSetting: baseUrlServer + "commentSetting",
    packageSetting: baseUrlServer + "packageSetting",
    userSetting: baseUrlServer + "userSetting"
};
