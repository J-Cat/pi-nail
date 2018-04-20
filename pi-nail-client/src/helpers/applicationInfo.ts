/*
 * File: c:\pi-nail\pi-nail-client\src\helpers\applicationInfo.ts
 * Project: c:\pi-nail\pi-nail-client
 * Created Date: Sunday April 15th 2018
 * Author: J-Cat
 * -----
 * Last Modified:
 * Modified By:
 * -----
 * License: 
 *    This work is licensed under a Creative Commons Attribution-NonCommercial 4.0 
 *    International License (http://creativecommons.org/licenses/by-nc/4.0/).
 * -----
 * Copyright (c) 2018
 */
const { name, version, description, homepage } = require('../../package.json');
const applicationInfo = {
    description,
    homepage,
    name,
    version
};
export default applicationInfo;
