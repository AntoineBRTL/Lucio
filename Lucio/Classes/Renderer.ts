import { RenderingEnvironment } from "./RenderingEnvironment.js";
import { RenderingQuad } from "./RenderingQuad.js";

export class Renderer
{
    private renderingEnvironment: RenderingEnvironment;
    private renderingQuad: RenderingQuad;

    public constructor(raytracerVert: string, raytracerFrag: string)
    {
        this.renderingEnvironment = new RenderingEnvironment();
        this.renderingQuad = new RenderingQuad(this.renderingEnvironment.getGL(), raytracerVert, raytracerFrag);
    }

    /** Clears the frame */
    private clear(gl: WebGL2RenderingContext): void
    {
        /** Clear color buffer */
        gl.clear(gl.COLOR_BUFFER_BIT);
    }

    public render()
    {
        /** Gets OpenGL context */
        let gl: WebGL2RenderingContext = this.renderingEnvironment.getGL();

        /** Clear the old frame */
        this.clear(gl);

        /** Render the fullscreen Quad */
        this.renderingQuad.render(gl);
    }
}