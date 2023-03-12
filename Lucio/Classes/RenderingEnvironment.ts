export class RenderingEnvironment
{
    private canvas: HTMLCanvasElement;
    private gl: WebGL2RenderingContext;

    public constructor()
    {   
        this.canvas = this.generateCanvas();
        this.gl = this.generateContext();

        /** Resize & setup auto-resize */
        this.resize();
        window.addEventListener("resize", this.resize.bind(this));
    }

    /** Resize the environment */
    private resize(): void
    {
        /** Resize the canvas */
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        /** Update Opengl viewport */
        this.gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    }

    /** Generates a canvas, displays it and returns a reference to it*/
    private generateCanvas(): HTMLCanvasElement
    {
        /** Instantiate an HTML canvas */
        let canvas: HTMLCanvasElement = document.createElement('canvas');

        /** Remove unwanted css style from body's html page */
        document.body.style.margin  = "0px";
        document.body.style.padding = "0px";

        /** Display the canvas */
        document.body.appendChild(canvas);
        
        /** Return reference */
        return canvas;
    }

    /** Generates an OpenGL context & returns a reference to it */
    private generateContext(): WebGL2RenderingContext
    {
        /** Instantiate an OpenGL context and make sure it's not null */
        let gl: WebGL2RenderingContext | null;
        gl = this.canvas.getContext("webgl2");
        if(!gl) throw new Error("Can't get context");

        /** Clear color */
        gl.clearColor(0.0, 0.0, 0.0, 1.0);

        /** Return a reference to the context */
        return gl;
    }

    /** Gets a canvas */
    public getCanvas(): HTMLCanvasElement
    {
        return this.canvas;
    }

    /** Gets an OpenGL */
    public getGL(): WebGL2RenderingContext
    {
        return this.gl;
    }
}