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