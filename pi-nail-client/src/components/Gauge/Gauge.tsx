/*
 * File: c:\pi-nail\pi-nail-client\src\components\Gauge\Gauge.tsx
 * Project: c:\pi-nail\pi-nail-client
 * Created Date: Monday April 16th 2018
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
import autobind from 'autobind-decorator';
// import { FormControl, FormControlLabel, Radio, RadioGroup, SvgIcon } from 'material-ui';
import { TextField } from 'material-ui';
import * as React from 'react';
// import { NumberFormat } from 'react-number-format';
// import keydown, { Keys } from 'react-keydown';
// import { PIDState } from '../../models';
import { GaugeProps } from './GaugeContainer';

export default class Gauge extends React.Component<GaugeProps.IProps, GaugeProps.IState> {
    private canvas: HTMLCanvasElement | null;
    private _context: CanvasRenderingContext2D | null;
    private fontHeight: number = 0;
    private setPointContainer: HTMLDivElement | null;
    private points: Array<{x1: number, y1: number, x2: number, y2: number}> = [];

    constructor(props: GaugeProps.IProps) {
        super(props);

        this.state = {
            initialized: false,
            isUpdating: false,
            radianAngle: 1.2,
            start: {
                x: 0,
                y: 0
            }
        }
    }

    public shouldComponentUpdate(nextProps: GaugeProps.IProps, state: GaugeProps.IState): boolean {
        if (nextProps.presentValue !== this.props.presentValue) {
            return true;
        }

        return false;
    }

    public componentWillUpdate() {
        this.paint(this.canvas!, this._context!);
    }

    public componentDidMount() {
        this.attachCanvasEvents();

        this._context = this.canvas!.getContext('2d');
        if (!this._context) {
            return;
        }

        const dpi: {x: number, y: number} = this.calcFontSize();
        this.fontHeight = ((this.props.fontSize || 36) * dpi.y/72);

        this.setPointContainer!.style.display = "flex";
        this.setPointContainer!.style.bottom = `${this.fontHeight + 10}px`;

        this.paint(this.canvas!, this._context); 
        this.setState({
            initialized: true
        });

        window.addEventListener('resize', this.resizeListener);
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.resizeListener);
    }

    public render() {
        return (
            <div className="topGaugeContainer">
                <div className="gaugeContainer">
                    <canvas ref={(canvas) => { this.canvas = canvas; }} />
                </div>
                <div
                    ref={(div) => {this.setPointContainer = div;}}
                    className="setPointContainer"
                    style={{
                        display: 'none',
                        bottom: `${this.fontHeight+10}px`
                    }}
                >
                    <TextField type="number" 
                        className="setPointInput"
                        defaultValue={this.props.setPoint}
                        onChange={this.onSetPointChange}
                    />
                    <span id="tempSymbol">&deg;C</span>
                </div>
            </div>
        );
    }

    // @autobind
    // protected valueChanged(source: React.ChangeEvent<JSX.Element>, value: number): void {
    // }

    protected resizeListener = (): void => {
        this.paint(this.canvas!, this._context!);
    }

    protected getHit = (x, y): boolean => {
        console.log(`${x}, ${y}`);
        this.setState({
            radianAngle: Math.max(
                Math.min(
                    1.5 - Math.round(Math.atan2(y/2, x) / Math.PI * 100) / 100, 
                    1.5
                ),
                1
            )
        });
        return true;
        // let found: number = -1;
        // for (let i = 0; i <= 100; i++) {
        //     console.log(`(${this.points[i].x1},${this.points[i].y1}),(${this.points[i].x2},${this.points[i].y2})`);
        //     if (x >= this.points[i].x1 && x <= this.points[i].x2 
        //         && y >= this.points[i].y1 && y <= this.points[i].y2) {
        //         found = i;
        //         break;
        //     }
        // }
        // if (found >= 0) {
        //     console.log(`found ${found}`);
        //     this.setState({
        //         radianAngle: 1 + (0.5 * found / 100)
        //     });
        //     return true;
        // } else {
        //     return false;
        // }
    }

    protected attachCanvasEvents = (): void => {
        this.canvas!.onmousedown = (event: MouseEvent): void => {
            event.preventDefault();
            const mouseX: number = event.clientX - this.canvas!.offsetLeft;
            const mouseY: number = event.clientY - this.canvas!.offsetTop;
            this.getHit(mouseX, mouseY);
            this.setState({
                isUpdating: true
            });                                        
        };

        this.canvas!.onmouseup = (event: MouseEvent): void => {
            if (!this.state.isUpdating) {
                return;
            }

            event.preventDefault();

            const mouseX: number = event.clientX - this.canvas!.offsetLeft;
            const mouseY: number = event.clientY - this.canvas!.offsetTop;
            this.getHit(mouseX, mouseY);
            this.setState({
                isUpdating: false
            });    

            this.paint(this.canvas!, this._context!);        
        };

        this.canvas!.onmouseout = (event: MouseEvent): void => {
            if (!this.state.isUpdating) {
                return;
            }
            
            event.preventDefault();

            this.setState({
                isUpdating: false
            });

            this.paint(this.canvas!, this._context!);
        };

        this.canvas!.onmousemove = (event: MouseEvent): void => {
            if (!this.state.isUpdating) { 
                return; 
            }

            event.preventDefault();
            const mouseX: number = event.clientX - this.canvas!.offsetLeft;
            const mouseY: number = event.clientY - this.canvas!.offsetTop;
            this.getHit(mouseX, mouseY);
            
            this.paint(this.canvas!, this._context!);
        };
    }

    @autobind
    protected onSetPointChange(source: React.ChangeEvent<HTMLInputElement>): void {
        this.props.updateSetPoint(source.target.valueAsNumber);
    }

    private paint(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        const parentStyle: CSSStyleDeclaration = getComputedStyle(canvas.parentElement!);
        const style: CSSStyleDeclaration = getComputedStyle(canvas);

        canvas.width = canvas.parentElement!.offsetWidth 
            - parseInt(parentStyle.borderLeft!, 10) - parseInt(parentStyle.borderRight!, 10)
            - parseInt(style.borderLeft!, 10) - parseInt(style.borderRight!, 10)
            - parseInt(style.paddingLeft!, 10) - parseInt(style.paddingRight!, 10);
        canvas.height = canvas.parentElement!.offsetHeight 
            - parseInt(parentStyle.borderTop!, 10) - parseInt(parentStyle.borderBottom!, 10)
            - parseInt(style.borderTop!, 10) - parseInt(style.borderBottom!, 10)
            - parseInt(style.paddingTop!, 10) - parseInt(style.paddingBottom!, 10)

        ctx.lineCap = "flat";
        ctx.font = `${this.props.fontSize || 36}px arial bold`;
        ctx.lineWidth = 20;


        const lineWidth: number = this.props.lineWidth || 40;

        let isWide: boolean = true;
        const yFactor: number = this.props.yScale ? 1 / this.props.yScale : 0.5;
        if (canvas.parentElement!.offsetWidth < (canvas.parentElement!.offsetHeight * yFactor)) {
            isWide = false;
        }
        let width: number;
        let height: number;
        if (isWide) {
            width = Math.round(canvas.parentElement!.offsetWidth - (lineWidth / 4));
            height = Math.max(width, Math.round((canvas.parentElement!.offsetHeight - (lineWidth / 2)) * yFactor));
        } else {
            height = Math.round((canvas.parentElement!.offsetHeight - (lineWidth / 2)) * yFactor);
            width = Math.max(height, Math.round(canvas.parentElement!.offsetWidth - (lineWidth / 4)));
        } 
        const radius: number = Math.min(width, height);
        const margin: number = 0;
        const left: number = isWide ? Math.round(margin + (lineWidth/4)) : (width-radius);
        const top: number = !isWide ? Math.round(margin +  ((lineWidth/yFactor)/2)) : (height-radius);

        const gradient: CanvasGradient = ctx.createLinearGradient(left + (lineWidth/2), height + top, left + width, top + (lineWidth/2));
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.25, '#ebebff');
        gradient.addColorStop(0.5, '#d8d8ff');
        gradient.addColorStop(0.75, '#ffff66');
        gradient.addColorStop(0.8, '#00A400');
        gradient.addColorStop(1, '#8b0000');

        ctx.translate(0, margin + ((lineWidth/yFactor)/2));
        ctx.scale(1, 1/yFactor);
  
        // clear
        ctx.clearRect(left, top, width, height);
  
        // circle
        ctx.beginPath();
        ctx.arc(width + lineWidth/2, height, radius, Math.PI, Math.PI * 1.5);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      
        // indicator
        ctx.beginPath();
        ctx.arc(width + lineWidth/2, 
            height, 
            radius, 
            (this.state.radianAngle - (this.props.thumbAngle || (Math.PI / 30)) / 2) * Math.PI, 
            (this.state.radianAngle + (this.props.thumbAngle || (Math.PI / 30)) / 2) * Math.PI
        );
        ctx.strokeStyle = "black";
        ctx.lineWidth = lineWidth;
        ctx.stroke();

        // calculate arc points for hit detection
        for (let i = 0; i <= 100; i++) {
            const radian: number = (1 + (i / 200)) * Math.PI;
            const xy: {x1: number, y1: number, x2: number, y2: number} = { x1: 0, y1: 0, x2: 0, y2: 0};
            const xOffset: number = Math.max(50*(i/100), lineWidth * ((100-i)/100));
            const yOffset: number = Math.max(50*(100-i)/100, lineWidth * (i/100));

            xy.x1 = this.canvas!.offsetWidth + (Math.cos(radian) * radius);
            xy.y1 = this.canvas!.offsetHeight + ((Math.sin(radian) * radius)) - yOffset;
            xy.x2 = this.canvas!.offsetWidth + (Math.cos(radian) * radius) + xOffset;
            xy.y2 = this.canvas!.offsetHeight + ((Math.sin(radian) * radius)) + yOffset;

            // ctx.strokeStyle = 'yellow';
            // ctx.fillStyle = 'transparent';
            // ctx.strokeRect(xy.x1, xy.y1, xy.x2-xy.x1, xy.y2-xy.y1);
            this.points.push(xy);
        }
  
        ctx.fillStyle = "gray";
        /*    ctx.textAlign = "center";
            ctx.fillText(parseInt(((radianAngle + PI2) % PI2) / PI2 * 100) + "%", cx, cy + 8);
        */
        
        ctx.restore();        

        const temp: string = `${this.props.presentValue}${String.fromCharCode(176)}C`;
        const textMetrics: TextMetrics = ctx.measureText(temp);
        const textX: number = canvas.width + margin - Math.round(textMetrics.width);
        const textY: number = (canvas.height + margin) * yFactor - this.fontHeight;
        ctx.fillText(temp, textX, textY);
    }

    private calcFontSize(): {x: number, y: number} {
        // create an empty element
        const div: HTMLDivElement = document.createElement("div");
        // give it an absolute size of one inch
        div.style.width = "1in";
        div.style.height = "1in";
        // append it to the body
        document.body.appendChild(div);
        // read the computed height
        const x: number = parseFloat(getComputedStyle(div, null).getPropertyValue('width'));
        const y: number = parseFloat(getComputedStyle(div, null).getPropertyValue('height'));
        // remove it again
        document.body.removeChild(div);
        // and return the value
        return { x, y };
    }

    // @keydown(Keys.a)
    // protected setStateAuto(): void {
    //     this.props.updateState(PIDState.Auto);
    // }

    // @keydown(Keys.m)
    // protected setStateManual(): void {
    //     this.props.updateState(PIDState.Manual);
    // }

    // @keydown(Keys.s)
    // protected setStateStopped(): void {
    //     this.props.updateState(PIDState.Stopped);
    // }
}