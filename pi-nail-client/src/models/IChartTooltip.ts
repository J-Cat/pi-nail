/*
 * File: c:\pi-nail\pi-nail-client\src\models\IChartTooltip.ts
 * Project: c:\pi-nail\pi-nail-client
 * Created Date: Thursday April 19th 2018
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
export interface IChartTooltip {
    // X Value of the tooltip as a string
    xLabel: string;

    // Y value of the tooltip as a string
    yLabel: string;

    // Index of the dataset the item comes from
    datasetIndex: number;

    // Index of this data item in the dataset
    index: number;

    // X position of matching point
    x: number;

    // Y position of matching point
    y: number;
}